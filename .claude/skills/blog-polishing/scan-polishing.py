#!/usr/bin/env python3
"""폴리싱 전수 스캔 — 단어 규칙(word-choice) + 문장 규칙(phrasing-style) 중 기계로 잡히는 항목.

부분 grep(즉석에서 떠오르는 몇 개만)로 갈음하지 말고, 폴리싱/리뷰/규칙 갱신 시 이 스크립트를 돌린다.
규칙 표가 늘어나도 자동 반영되므로 "규칙은 있는데 스윕이 덜 됨"을 구조적으로 막는다.

검사 항목:
  [단어]      word-choice.md '지양' 좌열 전체를 자동 추출해 본문(코드펜스 밖)과 대조.
  [문장-볼드] 코드펜스 밖 한 줄의 `**` 개수가 홀수(볼드 깨짐, phrasing #14).
  [문장-평서] `<mark>`/불릿/정리 항목의 평서체(~한다/~된다) 종결, 불릿 첫머리 볼드 라벨(- **…한다**: …)의 평서체(존댓말 통일, phrasing #6).

기계로 못 잡는 문장 규칙(#1 모호함, #11 나열식, #10 주체 모호, #15 인용 구성 등)은
phrasing-style.md 체크리스트로 사람이 직접 훑는다 — 이 스크립트가 그것을 대신하지 않는다.

사용:
  python3 .claude/skills/blog-polishing/scan-polishing.py [파일...]   # 인자 없으면 git 변경된 blog/*.mdx
  python3 .claude/skills/blog-polishing/scan-polishing.py --check blog/*.mdx   # 파일별 건수만(커밋 전 hook용)
  python3 .claude/skills/blog-polishing/scan-polishing.py --allow <파일> <줄> <항목> "<사유>"   # 규칙 예외 등록
예외 목록: allowlist.tsv (그 줄 내용 해시에 묶임 → 줄이 바뀌면 다시 검토 대상)
주의: 오탐이 있다(예: 단어 '목표'=목표 트랙, '하나'=…해야 하나?; 볼드는 두 줄 인용구가 오탐).
     반드시 문맥으로 확인 후 고친다.
종료코드: 매칭이 있으면 1, 없으면 0.
"""
import os, re, sys, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
WC = os.path.join(ROOT, ".claude", "wiki", "word-choice.md")

def extract_terms(path):
    terms = set()
    for ln in open(path, encoding="utf-8"):
        if not ln.startswith("|") or "---" in ln or "| 지양 " in ln:
            continue
        left = ln.strip().strip("|").split("|")[0]
        left = re.sub(r"\([^)]*\)", "", left).replace("**", "").replace("~", "")
        for p in re.split(r"[·/]", left):
            p = p.strip()
            if len(p) >= 2 and re.search(r"[가-힣]", p):
                terms.add(p)
    return terms

SVG_TEXT = re.compile(r"<text[^>]*>([^<]+)</text>")

# PlantUML 라벨: 따옴표 문자열, 화살표와 note의 ':' 뒤 라벨, title, 여러 줄 note 본문
PUML_QUOTED = re.compile(r'"([^"]*)"')
PUML_COLON = re.compile(r"(?:-+>|<-+|\.+>|<\.+|--|\.\.|\bnote\b|\bover\b)[^:]*:\s*(.+)$")   # A -> B : 라벨
PUML_TITLE = re.compile(r"^\s*(?:title|legend|header|footer)\s+(.+)$")
PUML_ACTIVITY = re.compile(r"^\s*:(.+?);?\s*$")                                         # :액티비티;
PUML_DECL = re.compile(r"^\s*(?:participant|actor|database|entity|queue|collections|boundary|control|rectangle|node|component|package|card|folder|frame|cloud|storage|usecase)\s+([^\s\"]+)")  # 따옴표 없는 이름
PUML_COND = re.compile(r"^\s*(?:else)?if\s*\((.+?)\)|^\s*while\s*\((.+?)\)")          # if (조건) then
HANGUL = re.compile(r"[가-힣]")

# Mermaid 라벨: 노드 [..] (..) {..}, 간선 |..|, 따옴표, subgraph 제목, gitGraph id/branch
MMD_SEG = re.compile(r'"([^"]*)"|\|([^|]*)\||\[\(?([^\]\)]*)\)?\]|\(\(?([^)]*)\)?\)|\{\{?([^}]*)\}?\}')
MMD_SUB = re.compile(r"^\s*subgraph\s+\S+?\s*\[?\"?([^\"\]]*)")

def mermaid_labels(ln):
    out = [next(g for g in m if g) for m in MMD_SEG.findall(ln) if any(m)]
    m = MMD_SUB.match(ln)
    if m and m.group(1):
        out.append(m.group(1))
    out = [re.sub(r"<br\s*/?>", " ", s).strip('"[](){} ') for s in out]
    return list(dict.fromkeys(s for s in out if HANGUL.search(s)))

def puml_labels(ln):
    out = [m.group(1) for m in PUML_QUOTED.finditer(ln)]
    bare = PUML_QUOTED.sub("", ln)
    m = PUML_ACTIVITY.match(bare)
    if m:
        out.append(m.group(1))
    else:
        for rx in (PUML_COLON, PUML_TITLE, PUML_COND, PUML_DECL):
            m = rx.search(bare)
            if m:
                out.append(next(g for g in m.groups() if g))
    return [s.replace("\\n", " ") for s in out if HANGUL.search(s)]

HTML_TEXT = re.compile(r">([^<>]*[가-힣][^<>]*)<")
JS_STR = re.compile(r"\"([^\"\n]*[가-힣][^\"\n]*)\"|'([^'\n]*[가-힣][^'\n]*)'|`([^`\n]*[가-힣][^`\n]*)`")

def html_lines(path):
    """static/diagrams/*.html(archify 등 인터랙티브 그림): 태그 사이 글자와 스크립트 문자열 리터럴의 한글."""
    import html as H
    out = []
    for i, ln in enumerate(open(path, encoding="utf-8"), 1):
        segs = HTML_TEXT.findall(ln) + [next(g for g in m if g) for m in JS_STR.findall(ln)]
        for seg in dict.fromkeys(segs):
            out.append((i, H.unescape(seg)))
    return out

def body_lines(path):
    """코드펜스(```) 밖 줄 + 그림 펜스 안의 라벨(```svg의 <text>, ```plantuml/C4-PlantUML의 라벨, title, note, ```mermaid의 노드, 간선, subgraph 라벨).
    그림 속 글자도 지양어 대상이다. 원래 줄번호 유지."""
    if path.endswith(".html"):
        return html_lines(path)
    out, infence, insvg, inpuml, innote, inmmd = [], False, False, False, False, False
    for i, ln in enumerate(open(path, encoding="utf-8"), 1):
        if ln.startswith("```"):
            infence = not infence
            insvg = infence and ln.strip().startswith("```svg")
            inpuml = infence and ln.strip().startswith(("```plantuml", "```puml"))
            inmmd = infence and ln.strip().startswith("```mermaid")
            innote = False
            continue
        if not infence:
            out.append((i, ln.rstrip("\n")))
        elif insvg:
            for m in SVG_TEXT.finditer(ln):
                out.append((i, m.group(1)))
        elif inmmd:
            for lab in mermaid_labels(ln):
                out.append((i, lab))
        elif inpuml:
            s = ln.strip()
            if innote:
                if re.match(r"end\s?note", s):
                    innote = False
                elif HANGUL.search(s):
                    out.append((i, s))
                continue
            if re.match(r"note\b", s) and ":" not in s:
                innote = True
                continue
            for lab in puml_labels(ln):
                out.append((i, lab))
    return out

# 평서체(비존댓) 종결 — 줄 끝이 '…다.'인데 '…니다.'(존댓말)가 아닌 경우(한다/된다/낮다 등). </mark>·따옴표·괄호는 무시.
PYEONG = re.compile(r"[가-힣](?<!니)다[\.\)”\"']*\s*(</mark>)?\s*$")
# 불릿 첫머리 볼드 라벨의 평서체 — '- **…나뉜다**: …합니다.'처럼 줄 끝이 존댓말이라 PYEONG이 놓치는 경우.
PYEONG_LABEL = re.compile(r"^\s*(?:[-*]|[0-9]+\.)\s+\*\*[^*]*[가-힣](?<!니)다\*\*\s*[:：—-]")

# 단음절·과대오탐 지양어는 extract_terms(len>=2, 부분문자열)로 못 잡는다 →
# 여기 '문맥 정규식'으로 보완한다. 좌열에 한 글자(예: 절)만 있는 규칙은 반드시 여기도 추가.
CONTEXT = [
    # '절'(문서의 section·조건절 뜻)만. 절차·적절·거절·계절·절반 등은 매칭 안 됨.
    (re.compile(r"(?:[0-9]+|다음|이어지는|앞|뒤|위|아래|경계|정리|해당|본문|같은|이|그|첫|끝)\s?절(?=[에은을이도과만 .,)\]\n])|조건절"),
     "절(→섹션)"),
    # '주다'(설정값·옵션을 주다 → 설정하다). 보조동사 '되돌려/보여/처리해 주다'는 매칭 안 됨.
    (re.compile(r"(?:`[^`]+`[를을]|이걸|그걸|값을|옵션을|설정을|같은 값을)\s*주(?:면|다|는|지)"),
     "주다(→설정하다)"),
    # 가운데점 나열 금지(phrasing #21) — 인라인 코드 안 포함 전부. 쉼표 또는 '와/과'로.
    (re.compile(r"\u00b7"), "가운데점(→쉼표 또는 와/과, phrasing #21)"),
    # 구어 의문형 어미 '~냐, ~느냐'(ALB냐 NLB냐, 어떻게 하느냐). 한 글자라 좌열 추출로 못 잡는다.
    (re.compile(r"냐"), "~냐(→~인지, ~하는지)"),
]

# 볼드 미적용(플랭킹): 볼드 interior가 구두점(따옴표·괄호·백틱)으로 끝나고 닫는 ** 뒤가 한글/영숫자면
# CommonMark상 닫는 **가 right-flanking이 아니라 무효 → 볼드가 안 걸린다(**"…"**는, **(…)**가, **…`code`**입니다).
# 여는 구분자까지 짝지어 매칭해 오탐 방지(**RESP**(…)·"**재시도**"입니다 같은 정상은 제외). `**`는 짝수라 홀수 검사로 안 잡힘.
FLANK = re.compile(
    r'\*\*["“][^"”*\n]*["”]\*\*[가-힣A-Za-z0-9]'     # **"…"**한글
    r'|\*\*\([^)*\n]*\)\*\*[가-힣A-Za-z0-9]'          # **(…)**한글
    r'|\*\*[^*\n]*`\*\*[가-힣A-Za-z0-9]')             # **…`code`**한글 (백틱으로 끝나는 볼드)

# 지양어 표면형을 우연히 포함하는 별개 단어(오탐 방지용 마스킹)
MASK = re.compile(
    r"부담|분담|담당|담백|상담|면담|대담|헥사고날|지오해시|엇갈|헷갈|가르치|가르침|(?<=[가-힣])가를"
    # 보조동사(~어/아 두다, ~어/아 주다)와 주고받다: 본동사 "값을 두다/주다"만 지양 대상
    r"|(?<=[가-힣])(?<![을를에로도만은는게히이가])\s?(두고|두면|두는|둡니다|둬야|둔|둘|줍니다|주고|주면|주는|준다|줘야)|주고받"
    r"|나타[내냅낸]|보[냅낸내]"                                   # 나타내다, 보내다 ≠ 내다
    r"|(들어|돌아|옮겨|넘어|따라|이어|올라|내려|빠져|줄여 )\s?(갑|가는|간|나갑|나가)"  # 들어가다 등 ≠ 가다
    r"|도구는|[슬플]로우|공짜|재고를|경고를|오프셋|사고방식|정체성|짝지어|심지어|드물고|머물고|끝나야|지나야"
    r"|따라잡|바로잡|붙잡|(한|두|세|네)\s?자리|제자리|감싸"
    r"|(에|디스크에|읽고) (씁니다|쓰는|쓰)"                            # 쓰기(write) 의미
    r"|(트랜잭션|원자적|파이프라인|배치|요청|해시 태그|한 쿼리|취소)(으로|에|로)? ?묶"  # 기술적 결합
)

def is_target_line(line):
    s = line.strip()
    return ("<mark>" in line) or bool(re.match(r"^\s*([-*]|\d+\.)\s", line)) or s.startswith(">")

def targets(argv):
    if argv:
        return argv
    r = subprocess.run(["git", "-C", ROOT, "status", "--porcelain", "blog"],
                       capture_output=True, text=True)
    return [os.path.join(ROOT, l[3:].strip()) for l in r.stdout.splitlines()
            if l[3:].strip().endswith(".mdx")]

ALLOW = os.path.join(os.path.dirname(os.path.abspath(__file__)), "allowlist.tsv")

def line_key(path, n):
    """예외 등록 키: 그 줄의 원문 해시. 줄 내용이 바뀌면 예외도 무효가 되어 다시 검토 대상이 된다."""
    import hashlib
    raw = open(path, encoding="utf-8").read().split("\n")[n - 1].strip()
    return hashlib.sha1(raw.encode()).hexdigest()[:12]

def load_allow():
    """allowlist.tsv: 경로<TAB>항목<TAB>줄해시<TAB>사유<TAB>문맥 — 문맥상 규칙 예외로 확인한 지적."""
    allow = set()
    if os.path.exists(ALLOW):
        for ln in open(ALLOW, encoding="utf-8"):
            if ln.strip() and not ln.startswith("#"):
                c = ln.rstrip("\n").split("\t")
                if len(c) >= 3:
                    allow.add((c[0], c[1], c[2]))
    return allow

# 그림은 손수 SVG만 쓴다(blog-authoring 4절). PlantUML, Mermaid, Archify가 새로 생기면 지적한다.
# 보관 중인 방식을 꼭 써야 하는 글(예: C4 모델 글의 C4-PlantUML 코드 예시)은 --allow로 예외 등록한다.
SVG_BLOCK = re.compile(r"```svg\n(.*?)\n```(?:(?!```svg).)*?/img/c4/([\w.-]+)\.svg", re.S)
DIAGRAM_FMT = re.compile(r"^```(plantuml|puml|mermaid)\b|<ArchifyEmbed\b|<AnatomyEmbed\b")

def scan_file(f, terms):
    hits = []   # (줄번호, 항목, 문맥, 분류)
    if f.endswith(".mdx") or f.endswith(".md"):
        for n, raw in enumerate(open(f, encoding="utf-8"), 1):
            if DIAGRAM_FMT.search(raw):
                hits.append((n, "그림형식(→손수 SVG)", raw.strip()[:60], "그림"))
        # 글 안 ```svg 블록(스캔 대상)과 실제로 보이는 그림 파일이 다르면, 블록만 고치고 파일에 옛 문구가 남은 것이다.
        text = open(f, encoding="utf-8").read()
        for m in SVG_BLOCK.finditer(text):
            p = os.path.join(ROOT, "static", "img", "c4", m.group(2) + ".svg")
            n = text[:m.start()].count("\n") + 1
            if not os.path.exists(p):
                hits.append((n, "그림불일치(파일 없음)", m.group(2), "그림"))
            elif m.group(1).strip() != open(p, encoding="utf-8").read().strip():
                hits.append((n, "그림불일치(블록≠파일)", m.group(2), "그림"))
    for n, line in body_lines(f):
        # 지양어를 부분문자열로 포함하는 별개 단어(부담을→담을 등)는 가려서 오탐을 막는다.
        masked = MASK.sub(lambda m: "□" * len(m.group()), line)
        for t in terms:
            j = masked.find(t)
            if j >= 0:
                hits.append((n, t, line[max(0, j-16):j+16], "단어"))
        for rx, label in CONTEXT:
            for m in rx.finditer(line):
                j = m.start()
                hits.append((n, label, line[max(0, j-16):j+16], "단어"))
        if line.count("**") % 2 == 1:
            hits.append((n, "볼드홀수", line.strip()[:60], "문장-볼드"))
        if FLANK.search(line):
            hits.append((n, "볼드플랭킹", line.strip()[:60], "문장-볼드"))
        if is_target_line(line) and PYEONG.search(line):
            hits.append((n, "평서체", line.strip()[:70], "문장-평서"))
        if PYEONG_LABEL.search(line):
            hits.append((n, "평서체-볼드라벨", line.strip()[:70], "문장-평서"))
    return hits

def cmd_allow(argv):
    """--allow <파일> <줄> <항목> <사유> : 문맥 확인 결과 규칙 예외인 지적을 사유와 함께 등록한다."""
    if len(argv) < 4:
        print('사용: scan-polishing.py --allow <파일> <줄번호> <항목> "<사유>"'); return 2
    f, n, item, reason = argv[0], int(argv[1]), argv[2], " ".join(argv[3:])
    rel = os.path.relpath(os.path.abspath(f), ROOT)
    terms = extract_terms(WC)
    ctx = [h[2] for h in scan_file(os.path.join(ROOT, rel), terms) if h[0] == n and h[1] == item]
    if not ctx:
        print(f"해당 지적 없음: {rel}:{n} [{item}] — 스캔 결과의 줄번호와 항목을 그대로 넣으세요."); return 2
    with open(ALLOW, "a", encoding="utf-8") as fp:
        fp.write("\t".join([rel, item, line_key(os.path.join(ROOT, rel), n), reason, ctx[0].replace("\t", " ")]) + "\n")
    print(f"예외 등록: {rel}:{n} [{item}] — {reason}"); return 0

def main():
    argv = sys.argv[1:]
    if argv[:1] == ["--allow"]:
        return cmd_allow(argv[1:])
    check = argv[:1] == ["--check"]
    if check:
        argv = argv[1:]
    terms = extract_terms(WC)
    files = targets(argv)
    if not files:
        print("대상 파일 없음(인자로 지정하거나 blog/*.mdx를 변경해 두세요).")
        return 0
    allow = load_allow()
    total = allowed = 0
    per_file = []
    for f in files:
        if not os.path.exists(f):
            print(f"!! 없음: {f}"); continue
        rel = os.path.relpath(os.path.abspath(f), ROOT)
        left = []
        for h in scan_file(f, terms):
            if (rel, h[1], line_key(f, h[0])) in allow:
                allowed += 1
            else:
                left.append(h)
        if left:
            per_file.append((rel, left))
            total += len(left)
    if check:
        for rel, left in per_file:
            print(f"  {rel} — {len(left)}건")
    else:
        for rel, left in per_file:
            print(f"\n### {rel} — {len(left)}건 (육안 확인 필수)")
            for n, t, ctx, kind in sorted(left):
                print(f"  [{kind}] {n}: [{t}]  …{ctx}…")
    print(f"\n총 {total}건(예외 등록으로 제외 {allowed}건). 좌열 표면형 {len(terms)}개 기준.")
    if total:
        print("※ 실제 위반은 고치고, 문맥상 규칙 예외면 --allow <파일> <줄> <항목> \"<사유>\" 로 등록한다. 0건이 될 때까지 반복.")
    print("※ 기계로 못 잡는 문장 규칙(모호함·나열식·주체 모호·인용 구성 등)은 phrasing-style 체크리스트로 직접 훑는다.")
    return 1 if total else 0

if __name__ == "__main__":
    sys.exit(main())
