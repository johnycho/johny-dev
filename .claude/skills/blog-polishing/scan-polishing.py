#!/usr/bin/env python3
"""폴리싱 전수 스캔 — 단어 규칙(word-choice) + 문장 규칙(phrasing-style) 중 기계로 잡히는 항목.

부분 grep(즉석에서 떠오르는 몇 개만)로 갈음하지 말고, 폴리싱/리뷰/규칙 갱신 시 이 스크립트를 돌린다.
규칙 표가 늘어나도 자동 반영되므로 "규칙은 있는데 스윕이 덜 됨"을 구조적으로 막는다.

검사 항목:
  [단어]      word-choice.md '지양' 좌열 전체를 자동 추출해 본문(코드펜스 밖)과 대조.
  [문장-볼드] 코드펜스 밖 한 줄의 `**` 개수가 홀수(볼드 깨짐, phrasing #14).
  [문장-평서] `<mark>`/불릿/정리 항목의 평서체(~한다/~된다) 종결(존댓말 통일, phrasing #6).

기계로 못 잡는 문장 규칙(#1 모호함, #11 나열식, #10 주체 모호, #15 인용 구성 등)은
phrasing-style.md 체크리스트로 사람이 직접 훑는다 — 이 스크립트가 그것을 대신하지 않는다.

사용:
  python3 .claude/skills/blog-polishing/scan-polishing.py [파일...]   # 인자 없으면 git 변경된 blog/*.mdx
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

def body_lines(path):
    """코드펜스(```) 밖 줄만 (원래 줄번호 유지)."""
    out, infence = [], False
    for i, ln in enumerate(open(path, encoding="utf-8"), 1):
        if ln.startswith("```"):
            infence = not infence
            continue
        if not infence:
            out.append((i, ln.rstrip("\n")))
    return out

# 평서체(비존댓) 종결 — 줄 끝이 '…다.'인데 '…니다.'(존댓말)가 아닌 경우(한다/된다/낮다 등). </mark>·따옴표·괄호는 무시.
PYEONG = re.compile(r"[가-힣](?<!니)다[\.\)”\"']*\s*(</mark>)?\s*$")

# 단음절·과대오탐 지양어는 extract_terms(len>=2, 부분문자열)로 못 잡는다 →
# 여기 '문맥 정규식'으로 보완한다. 좌열에 한 글자(예: 절)만 있는 규칙은 반드시 여기도 추가.
CONTEXT = [
    # '절'(문서의 section·조건절 뜻)만. 절차·적절·거절·계절·절반 등은 매칭 안 됨.
    (re.compile(r"(?:[0-9]+|다음|이어지는|앞|뒤|위|아래|경계|정리|해당|본문|같은|이|그|첫|끝)\s?절(?=[에은을이도과만 .,)\]\n])|조건절"),
     "절(→섹션)"),
    # '주다'(설정값·옵션을 주다 → 설정하다). 보조동사 '되돌려/보여/처리해 주다'는 매칭 안 됨.
    (re.compile(r"(?:`[^`]+`[를을]|이걸|그걸|값을|옵션을|설정을|같은 값을)\s*주(?:면|다|는|지)"),
     "주다(→설정하다)"),
]

# 볼드 미적용(플랭킹): **"…"** 뒤에 한글/영숫자가 오면 CommonMark상 닫는 **가 무효 → 볼드가 안 걸린다.
# `**` 개수는 짝수라 홀수 검사로 안 잡힘. 따옴표를 볼드 밖으로("**…**") 빼야 함.
FLANK = re.compile(r'\*\*["“][^"”\n]*["”]\*\*[가-힣A-Za-z0-9]')

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

def main():
    terms = extract_terms(WC)
    files = targets(sys.argv[1:])
    if not files:
        print("대상 파일 없음(인자로 지정하거나 blog/*.mdx를 변경해 두세요).")
        return 0
    total = 0
    for f in files:
        if not os.path.exists(f):
            print(f"!! 없음: {f}"); continue
        words, bolds, pyeongs = [], [], []
        for n, line in body_lines(f):
            for t in terms:
                j = line.find(t)
                if j >= 0:
                    words.append((n, t, line[max(0, j-16):j+16]))
            for rx, label in CONTEXT:
                for m in rx.finditer(line):
                    j = m.start()
                    words.append((n, label, line[max(0, j-16):j+16]))
            if line.count("**") % 2 == 1:
                bolds.append((n, "** 홀수 — 두 줄 인용구면 오탐", line.strip()[:60]))
            if FLANK.search(line):
                bolds.append((n, '**"…"** 뒤 한글 → 볼드 안 닫힘(따옴표를 밖으로)', line.strip()[:60]))
            if is_target_line(line) and PYEONG.search(line):
                pyeongs.append((n, line.strip()[:70]))
        cnt = len(words) + len(bolds) + len(pyeongs)
        if cnt:
            print(f"\n### {os.path.relpath(f, ROOT)} — {cnt}건 (육안 확인 필수)")
            for n, t, ctx in sorted(words):
                print(f"  [단어] {n}: [{t}]  …{ctx}…")
            for n, why, ctx in sorted(bolds):
                print(f"  [문장-볼드] {n}: {ctx}  ({why})")
            for n, ctx in sorted(pyeongs):
                print(f"  [문장-평서] {n}: {ctx}  (평서체면 존댓말로)")
            total += cnt
    print(f"\n총 {total}건. 좌열 표면형 {len(terms)}개 기준. 오탐 포함 — 문맥 확인 후 수정.")
    print("※ 기계로 못 잡는 문장 규칙(모호함·나열식·주체 모호·인용 구성 등)은 phrasing-style 체크리스트로 직접 훑는다.")
    return 1 if total else 0

if __name__ == "__main__":
    sys.exit(main())
