---
name: resume-verify
description: 소개 페이지(/about)나 이력서 PDF의 내용·레이아웃을 수정하고 검증할 때 사용. "소개페이지 수정", "이력서 내용 바꿔", "이력서 검증", "about 페이지 ~ 추가/수정", "이력서 PDF ~" 등의 요청에 필수로 사용. Rezumi 피드백 반영과 PDF 페이지 오버플로 최종 확인(검증)을 강제한다.
---

# 소개 페이지 / 이력서(PDF) 수정·검증 스킬

상세 규칙(단일 진실 원천)은 반드시 [../../wiki/about-resume.md](../../wiki/about-resume.md)를 먼저 읽고 그대로 따른다. 아래는 실행 절차 요약이며, 규칙 자체는 여기서 재서술하지 않는다.

## 절차

1. **내용은 `data.ts`만 수정** (wiki 1절): 경력·프로젝트·수치·문구는 `src/components/resume/data.ts`에서 고친다. about.tsx/ResumePdf.tsx는 레이아웃·스타일만. 문구는 word-choice 규칙 준수.

2. **Rezumi 피드백 루프** (wiki 2절 — 내용을 추가·삭제·수정한 경우 필수):
   - Rezumi는 **구글 로그인** 기반 → 자동화 브라우저에선 OAuth가 차단된다. **자동화하지 말고**, 사용자가 **자기 브라우저에서 직접** 로그인·PDF 업로드·분석하도록 안내한다.
   - 사용자가 **피드백 텍스트를 대화창에 붙여넣으면**, 타당한 개선점만 **`data.ts`에 반영**한다.
   - (`run.mjs`는 구글 로그인 차단으로 Rezumi엔 무용 — 안내하지 말 것.)

3. **빌드 확인**: `npm run build` 로 컴파일 확인(가능하면 `npm start`로 `/about` 렌더도).

4. **PDF 페이지 오버플로 최종 확인** (wiki 3절 — PDF에 영향 주는 변경이면 완료 전 반드시):
   - `node .claude/skills/resume-verify/render-resume.cjs` → `/tmp/resume-out.pdf`.
   - `pdfinfo`로 페이지 수(5장 내외), `pdftotext`로 섹션·항목이 페이지 경계에서 어색하게 쪼개지지 않았는지 확인.
   - 문제 있으면 여백·폰트 조정 후 **재렌더해 통과할 때까지 반복**. 통과해야 작업 종료.

## 커밋
- 커밋·푸시는 [git 계정 정책](../../wiki/git-account.md)에 따라 **johnycho** 계정으로. hook이 자동 검증한다.

## 도구
- `run.mjs` — Rezumi 피드백 수집(Playwright 헤디드, 자격증명 미취급).
- `render-resume.cjs` — 이력서 PDF 헤드리스 렌더(페이지 검증용). `ResumePdf.tsx`의 영구 export `__ResumeDoc` 사용.
