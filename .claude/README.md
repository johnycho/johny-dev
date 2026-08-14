# .claude — 프로젝트 규칙 중앙 관리

johny-dev 기술 블로그 작업 규칙을 **wiki(참조) · skill(절차) · hook(자동 검증)** 으로 분리해 한곳에서 관리한다.

## 구조
```
.claude/
├── README.md              ← 이 문서 (색인)
├── settings.json          ← Claude Code 설정(hook 등록) — 저장소 공유
├── wiki/                  ← 참조 문서(규칙의 "무엇/왜")
│   ├── blog-authoring.md      · 게시글(.mdx) 작성 상세 규칙
│   ├── wiki-authoring.md      · wiki 문서 작성 규칙
│   ├── common-authoring.md    · 게시글·wiki 공통 규칙(코드 예시 스타일 등)
│   ├── spring-boot-updates.md · 스프링 부트 업데이트 시리즈(3.2.0 이후) 소스·범위·주제 규칙
│   └── git-account.md         · Git 계정(johnycho) 정책
├── skills/                ← 실행 절차(규칙의 "어떻게", 호출형)
│   ├── blog-post/SKILL.md          · 마크다운 초안 → 블로그 게시글 변환 절차 (/blog-post)
│   └── spring-update-post/SKILL.md · 스프링 부트 변화 조사 → 주제별 게시글 (/spring-update-post)
└── hooks/                 ← 자동 검증/강제
    ├── check-git-account.sh   · 커밋·푸시 시 johnycho 계정인지 검증(PreToolUse)
    └── restore-git-account.sh · push 후 기본 계정 johny-cho로 자동 원복(PostToolUse)
```

## 사용
- **게시글 작성**: `/blog-post` 스킬 호출 또는 "블로그 글 추가해줘" → skill이 wiki 규칙을 따름.
- **스프링 부트 시리즈**: `/spring-update-post` 호출 또는 "스프링부트 업데이트 글 써줘" → 공식 소스 조사 후 blog-authoring 규칙대로 작성.
- **규칙 확인/수정**: `wiki/` 문서를 본다. 규칙이 바뀌면 wiki를 갱신하고, 절차가 바뀌면 skill을, 자동화가 바뀌면 hook을 수정.
- **hook**: `git commit`/`git push` 시 gh 활성 계정이 johnycho가 아니면 차단·안내(PreToolUse). `git push`가 끝나면 기본 계정 johny-cho로 자동 원복(PostToolUse). (`settings.json`에 등록)

## 참고
- 저장소 루트 `CLAUDE.md`는 개요와 이 폴더로의 포인터 역할만 한다(상세는 여기).
- `settings.local.json`은 개인용(gitignore).
