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
│   ├── word-choice.md         · 표현·용어 순화(지양→권장 목록·예외) — 계속 늘어나 별도 관리
│   ├── spring-boot-updates.md · 스프링 부트 업데이트 시리즈(3.2.0 이후) 소스·범위·주제 규칙
│   ├── about-resume.md        · 소개 페이지(/about)·이력서 PDF 수정 규칙(단일 원천 data.ts·Rezumi 피드백·PDF 페이지 검증)
│   ├── git-account.md         · Git 계정(johnycho) 정책
│   └── vercel-deploy.md       · Vercel 배포(tools/johny-utils) 정책·환경변수
├── skills/                ← 실행 절차(규칙의 "어떻게", 호출형)
│   ├── blog-post/SKILL.md          · 마크다운 초안 → 블로그 게시글 변환 절차 (/blog-post)
│   ├── trend-post-spring/SKILL.md   · 스프링 부트 변화 조사 → 주제별 게시글 (/trend-post-spring)
│   ├── trend-post-java/SKILL.md     · Java/JDK 동향(JEP·신버전·preview → OpenJDK 검증) 게시글 (/trend-post-java)
│   ├── trend-post-backend/SKILL.md  · 백엔드 최신 동향(GeekNews 등 발굴 → 1차 소스 검증) 게시글 (/trend-post-backend)
│   ├── trend-post-ai/SKILL.md       · AI 개발 활용 동향(LLM 방법론·도구·MCP·하네스 → 공식 소스 검증) 게시글 (/trend-post-ai)
│   ├── blog-review/SKILL.md         · 작성한 글을 단어·작성·MDX·다이어그램 규칙으로 검토·피드백 (/blog-review)
│   ├── resume-verify/SKILL.md      · 소개 페이지·이력서 PDF 수정·검증(+Rezumi 피드백·PDF 검증) (/resume-verify)
│   └── deploy-utils/SKILL.md       · tools/johny-utils Vercel 프로덕션 배포 (/deploy-utils)
└── hooks/                 ← 자동 검증/강제
    ├── check-git-account.sh   · 커밋·푸시 시 johnycho 계정인지 검증(PreToolUse)
    └── restore-git-account.sh · push 후 기본 계정 johny-cho로 자동 원복(PostToolUse)
```

## 사용
- **게시글 작성**: `/blog-post` 스킬 호출 또는 "블로그 글 추가해줘" → skill이 wiki 규칙을 따름.
- **스프링 부트 시리즈**: `/trend-post-spring` 호출 또는 "스프링부트 업데이트 글 써줘" → 공식 소스 조사 후 blog-authoring 규칙대로 작성.
- **백엔드 동향 글**: `/trend-post-backend` 호출 또는 "백엔드 동향 글 써줘/이 기사로 블로그" → GeekNews 등에서 주제 발굴 → **1차 소스로 사실 검증** 후 johny-dev 톤으로 작성(스프링 전용은 위 스킬).
- **Java/JDK 동향 글**: `/trend-post-java` 호출 또는 "자바 최신 동향/이 JEP로 블로그" → OpenJDK JEP·Inside Java 등 1차 소스로 검증(preview/final·버전 명시) 후 작성.
- **AI 개발 활용 동향 글**: `/trend-post-ai` 호출 또는 "AI 개발 활용 동향/클로드·코딩 에이전트로 자동화/MCP 정리" → Anthropic·OpenAI·MCP 등 **공식 소스로 검증**하고 마케팅·과장 배제, 한계·리스크까지 담아 작성.
- **작성 후 리뷰(필수)**: `/blog-review` 호출 또는 "블로그 리뷰" → 단어·작성·MDX·다이어그램·코드 정렬·인용 규칙으로 검토·피드백(모든 작성 스킬은 완료 전 이 리뷰를 거친다).
- **소개 페이지·이력서 수정/검증**: `/resume-verify` 호출 또는 "소개페이지 수정/이력서 내용 바꿔/이력서 검증" → 내용은 `data.ts`만 고치고, Rezumi 피드백 반영 + PDF 페이지 오버플로 최종 확인(about-resume.md 규칙)을 필수로 거친다.
- **규칙 확인/수정**: `wiki/` 문서를 본다. 규칙이 바뀌면 wiki를 갱신하고, 절차가 바뀌면 skill을, 자동화가 바뀌면 hook을 수정.
- **hook**: `git commit`/`git push` 시 gh 활성 계정이 johnycho가 아니면 차단·안내(PreToolUse). `git push`가 끝나면 기본 계정 johny-cho로 자동 원복(PostToolUse). (`settings.json`에 등록)

## 참고
- 저장소 루트 `CLAUDE.md`는 개요와 이 폴더로의 포인터 역할만 한다(상세는 여기).
- `settings.local.json`은 개인용(gitignore).
