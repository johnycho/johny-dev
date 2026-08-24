# Wiki · 소개 페이지 / 이력서(PDF) 수정 규칙

`/about` 소개 페이지와 이력서 PDF의 **내용·레이아웃을 수정할 때 지켜야 할 규칙의 단일 진실 원천(Single Source of Truth)**.
절차는 [resume-verify 스킬](../skills/resume-verify/SKILL.md)이 이 문서를 참조해 수행한다. (규칙은 여기서만 관리하고 스킬·다른 문서에서 재서술하지 않는다.)

## 1) 내용의 단일 원천 — `data.ts`
- 소개 페이지(`src/pages/about.tsx`)와 이력서 PDF(`src/components/resume/ResumePdf.tsx`)는 **둘 다 [`src/components/resume/data.ts`](../../src/components/resume/data.ts)를 읽는다.**
- 그래서 **경력·프로젝트·수치·문구 등 "내용"은 반드시 `data.ts`만 고친다.** about.tsx/ResumePdf.tsx는 표현(레이아웃·스타일)만 담당한다. 한쪽에만 하드코딩하지 않는다.
- 문구는 [word-choice.md](./word-choice.md)의 지양어 규칙을 따른다.
- **섹션 제목 영문 표기는 문법을 지킨다** (웹·PDF 공통):
  - 셀 수 있는 명사는 **복수**: Projects · Certificates · Activities · Skills · (Open Source) Contributions.
  - 불가산 명사는 **단수**: Education · Experience · Troubleshooting. (Educations·Experiences 처럼 억지 복수 금지)
  - 제목은 **명사형**으로: `Introduce`(동사) 대신 `Introduction`.
  - "open source"는 **두 단어**로: `Opensource` 대신 `Open Source`.

## 2) 필수 프로세스 ① — Rezumi 피드백 루프 (내용 변경 시)
소개/이력 **내용을 추가·삭제·수정하면**(단순 오타·레이아웃 제외), 반영 전/후에 [Rezumi](https://rezumi.kr) AI 이력서 피드백을 받아 반영한다.
- **왜**: 항목별 점수·빠진 부분·개선 방향을 외부 관점으로 점검해 이력서 품질을 올린다.
- **로그인은 사용자의 평소 브라우저에서 직접**: Rezumi는 **구글 로그인** 기반이라, Playwright 등 자동화가 제어하는 브라우저에서는 **구글이 OAuth 로그인을 차단**한다("안전하지 않은 브라우저"). 따라서 **자동화로 로그인·수집하려 하지 말 것.** 사용자가 자기 브라우저(구글 로그인된 Chrome/Safari)에서 직접 로그인 → 이력서 PDF 업로드 → 분석한다.
- **수집·반영**: 사용자가 받은 피드백(점수·개선사항) 텍스트를 대화창에 붙여넣으면, 타당한 개선점만 **`data.ts`에 반영**(소개 페이지·PDF에 동시 적용)한다. 개인정보이므로 제3자 제출은 사용자 동의/직접 수행이 전제다.
- (참고) `run.mjs`는 구글 로그인 차단으로 Rezumi에는 사실상 무용하다. Google OAuth를 쓰지 않는 다른 피드백 도구에만 보조로 쓸 수 있다.
- Rezumi가 여의치 않으면 최소한 셀프 리뷰(누락·구체성·수치 임팩트·순서·표현)라도 거친다.

## 3) 필수 프로세스 ② — PDF 페이지 오버플로 최종 확인 (완료 전 반드시)
PDF 내용/레이아웃(폰트 크기·여백·항목 추가 등)을 바꾼 뒤에는 **작업을 끝내기 전에 반드시** 페이지 배치를 검증한다. "내용이 불필요하게 다음 페이지로 개행되지 않는지"가 핵심이다.
- **검증 방법**(브라우저 없이):
  1. `node .claude/skills/resume-verify/render-resume.cjs` → `/tmp/resume-out.pdf` 생성.
     (ResumePdf.tsx의 영구 export `__ResumeDoc`를 사용하므로 소스를 매번 고칠 필요 없다.)
  2. `pdfinfo /tmp/resume-out.pdf | grep Pages` 로 총 페이지 수 확인(목표: **5장 내외**).
  3. `pdftotext -f N -l N /tmp/resume-out.pdf -` 로 각 페이지 끝/다음 페이지 시작을 확인해, **한 섹션이나 한 항목이 페이지 경계에서 어색하게 쪼개지지 않았는지** 점검한다(특히 ACTIVITY·KEY PROJECTS·TROUBLESHOOTING·OPENSOURCE의 개별 항목).
  4. poppler 도구는 `/opt/homebrew/bin/`(pdfinfo·pdftotext·pdftoppm). 이미지로 눈 확인이 필요하면 `pdftoppm -png -r 110`.
- **판정**: 항목이 페이지 경계에서 쪼개졌거나 예상보다 페이지가 늘면, 여백(`h2` margin·`row`/항목 marginBottom)·폰트 크기를 조정하고 **다시 렌더해 통과할 때까지 반복**한다. 통과 후에야 완료로 본다.
- 항목 단위로 안 쪼개지길 원하면 해당 블록에 `wrap={false}`(react-pdf)를 고려한다.

## 4) 커밋
- 커밋·푸시는 [git 계정 정책](./git-account.md)에 따라 **johnycho** 계정으로. hook이 자동 검증한다.

## 관련
- 내용 원천: `src/components/resume/data.ts`
- 표현: `src/pages/about.tsx`(웹) · `src/components/resume/ResumePdf.tsx`(PDF)
- 절차/도구: [resume-verify 스킬](../skills/resume-verify/SKILL.md) (`run.mjs`·`render-resume.cjs`)
