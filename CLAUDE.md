# CLAUDE.md

johny-dev 기술 블로그 (Docusaurus). 게시글은 `blog/*.mdx`로 작성하며(`YYYY-MM-DD-slug.mdx`), 주제별 문서는 `wiki/`(URL `/wiki/*`), UI 커스터마이징은 `src/`에 있다.

## 규칙은 `.claude/` 에서 관리한다
작업 규칙은 **wiki(참조) · skill(절차) · hook(자동 검증)** 으로 분리되어 [`.claude/`](.claude/README.md) 에 중앙 관리된다. 색인: [`.claude/README.md`](.claude/README.md)

- **게시글(.mdx) 작성 규칙** → [`.claude/wiki/blog-authoring.md`](.claude/wiki/blog-authoring.md)
  - 절차/스킬 → [`.claude/skills/blog-post/SKILL.md`](.claude/skills/blog-post/SKILL.md) (또는 `/blog-post`)
  - 핵심: 프론트매터(`authors: [ johnycho ]`, tags는 `blog/tags.yml` 등록분) → `<!-- truncate -->` → 본문 H1 중복 금지 → MDX(v3) 위험문자 주의
- **스프링 부트 업데이트 시리즈(3.2.0 이후)** → [`.claude/wiki/spring-boot-updates.md`](.claude/wiki/spring-boot-updates.md)
  - 절차/스킬 → [`.claude/skills/spring-update-post/SKILL.md`](.claude/skills/spring-update-post/SKILL.md) (또는 `/spring-update-post`)
  - 핵심: 공식 소스(release-calendar·spring.io/blog·GitHub releases)로 사실 검증 → **주제별**로 작성 → 형식은 blog-authoring 규칙 준수
- **Git 계정 정책** → [`.claude/wiki/git-account.md`](.claude/wiki/git-account.md)
  - 이 저장소는 **johnycho** 계정으로 커밋·푸시 (머신 기본은 johny-cho). 커밋/푸시 시 hook이 자동 검증.
  - 커밋 identity는 repo-local git config에 johnycho / johnycho.dev@gmail.com로 고정됨.

## 참고
- 저자 설정: `blog/authors.yml` · 태그 설정: `blog/tags.yml`
- 빌드/렌더 확인: `npm run build`, `npm start`.
