# CLAUDE.md

johny-dev 기술 블로그 (Docusaurus). 게시글은 `blog/*.mdx`로 작성하며(`YYYY-MM-DD-slug.mdx`), 주제별 문서는 `wiki/`(URL `/wiki/*`), UI 커스터마이징은 `src/`에 있다.

## 규칙은 `.claude/` 에서 관리한다
작업 규칙은 **wiki(참조) · skill(절차) · hook(자동 검증)** 으로 분리되어 [`.claude/`](.claude/README.md) 에 중앙 관리된다. 색인: [`.claude/README.md`](.claude/README.md)

- **게시글(.mdx) 작성 규칙** → [`.claude/wiki/blog-authoring.md`](.claude/wiki/blog-authoring.md)
  - 절차/스킬 → [`.claude/skills/blog-post/SKILL.md`](.claude/skills/blog-post/SKILL.md) (또는 `/blog-post`)
  - 핵심: 프론트매터(`authors: [ johnycho ]`, tags는 `blog/tags.yml` 등록분) → `<!-- truncate -->` → 본문 H1 중복 금지 → MDX(v3) 위험문자 주의
- **스프링 부트 업데이트 시리즈(3.2.0 이후)** → [`.claude/wiki/spring-boot-updates.md`](.claude/wiki/spring-boot-updates.md)
  - 절차/스킬 → [`.claude/skills/trend-post-spring/SKILL.md`](.claude/skills/trend-post-spring/SKILL.md) (또는 `/trend-post-spring`)
  - 핵심: 공식 소스(release-calendar·spring.io/blog·GitHub releases)로 사실 검증 → **주제별**로 작성 → 형식은 blog-authoring 규칙 준수
- **커밋 전 규칙 동기화(필수)** → [`.claude/skills/rule-sync/SKILL.md`](.claude/skills/rule-sync/SKILL.md) (또는 `/rule-sync`)
  - 커밋 요청을 받으면 커밋 전에, 마지막 커밋 이후 받은 피드백(지양어, 표현, 그림, 구조)이 규칙 파일에 반영됐는지 확인하고 빠진 것을 추가한 뒤 블로그 전체에 적용한다.
  - hook이 강제: 블로그 전체 폴리싱 스캔에 처리되지 않은 지적이 남아 있거나, rule-sync 완료 표시(`mark-done.sh`)가 현재 상태와 다르면 커밋이 막힌다.
  - **막히면 임의로 바꾸지 않는다.** 글 수정안, 예외 등록안(사유), 규칙 갱신안을 사용자에게 보여 주고 확인을 받은 뒤 반영하고, 커밋을 다시 시도한다.
  - 핵심: 피드백 수집 → 반영 위치 분류 → 스캔으로 활용형까지 잡히는지 시험 → 규칙 추가 → 오탐 점검 → 전체 스윕 → 빌드 → 보고 후 커밋
- **Git 계정 정책** → [`.claude/wiki/git-account.md`](.claude/wiki/git-account.md)
  - 이 저장소는 **johnycho** 계정으로 커밋·푸시 (머신 기본은 johny-cho). 커밋/푸시 시 hook이 자동 검증.
  - 커밋 identity는 repo-local git config에 johnycho / johnycho.dev@gmail.com로 고정됨.
- **유틸 서버리스(Vercel) — `tools/johny-utils`** → [`.claude/wiki/vercel-deploy.md`](.claude/wiki/vercel-deploy.md)
  - Cusdis→Slack 중계(`/api/webhook`·`/api/slack-action`) + 게시글 조회수(`/api/view-count`, Upstash Redis). 프런트: `src/viewCount.ts`·`src/components/ViewCount.tsx`.
  - 배포 절차/스킬 → [`.claude/skills/deploy-utils/SKILL.md`](.claude/skills/deploy-utils/SKILL.md) (또는 `/deploy-utils`). 배포는 **사용자 승인 후** 프로덕션 별칭 `https://johny-utils.vercel.app` 로만.
- **소개 페이지(/about)·이력서 PDF 수정** → [`.claude/wiki/about-resume.md`](.claude/wiki/about-resume.md)
  - 절차/스킬 → [`.claude/skills/resume-verify/SKILL.md`](.claude/skills/resume-verify/SKILL.md) (또는 `/resume-verify`)
  - 핵심: 내용은 **단일 원천 `src/components/resume/data.ts`** 만 수정 → **Rezumi 피드백 반영** → **PDF 페이지 오버플로 최종 확인**(헤드리스 렌더로 항목이 다음 페이지로 어색하게 넘어가지 않는지)까지 하고 종료.

## 참고
- 저자 설정: `blog/authors.yml` · 태그 설정: `blog/tags.yml`
- 빌드/렌더 확인: `npm run build`, `npm start`.
