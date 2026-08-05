---
name: spring-update-post
description: Spring Boot 3.2.0 이후의 주목할 변화·동향을 공식 소스(release-calendar·spring.io/blog·GitHub releases)로 조사해 주제별 블로그 게시글(blog/*.mdx)로 작성한다. 주제를 안 주면 후보를 제안하고 고르게 한다. "스프링부트 동향 글 하나 써줘", "스프링부트 업데이트 글 추가", "3.x 변화 정리 포스트", "가상 스레드/구조적 로깅 글" 등의 요청에 사용.
---

# 스프링 부트 업데이트 시리즈 작성 스킬

Spring Boot 3.2.0 **이후**의 변화를 **주제별**로 조사·작성한다. 참조 규칙은 반드시 [../../wiki/spring-boot-updates.md](../../wiki/spring-boot-updates.md)를, 게시글 형식은 [../../wiki/blog-authoring.md](../../wiki/blog-authoring.md)를 먼저 읽고 그대로 따른다. 아래는 실행 절차.

## 절차

1. **주제 확정** (wiki 4·4-1절): 한 글 = 한 주제.
   - **사용자가 주제를 줬으면** 그대로 쓴다.
   - **안 줬으면 후보를 제안하고 고르게 한다** — wiki 4-1절 **주제 백로그**의 미작성(`[ ]`) 항목에서 임팩트 큰 3~4개를 뽑아, 각 후보에 "무엇을·왜 볼 만한지" 한 줄을 붙여 제안한다(`AskUserQuestion` 사용 권장). 사용자가 고른 것으로 진행. 백로그가 비었으면 wiki 3·4절 기준으로 소스에서 후보를 만들어 제안한다.
   - **중복 방지 (저장소 전체)**: spring-boot 글끼리뿐 아니라 **`blog/` 전체 글**과 내용이 겹치지 않게 한다. 후보를 정하기 전 `blog/*.mdx`의 제목·슬러그·태그를 훑어(그리고 겹칠 것 같은 글은 본문도) 이미 다룬 주제·각도인지 확인한다. 예: "관측성/트레이싱" 후보는 기존 [kafka-distributed-tracing] 글과 겹치므로, **각도를 달리하거나(예: Spring Boot 자동설정·Micrometer 관점만) 겹치는 부분은 링크로 넘긴다**. 완전히 겹치면 후보에서 뺀다.

2. **공식 소스 조사** (wiki 2절): WebFetch/WebSearch로 아래를 확인한다. **1차 소스로 교차 검증**하고, 버전·날짜·동작 변경을 메모.
   - 해당 주제의 도입/변경 버전 → `github.com/spring-projects/spring-boot/wiki/Spring-Boot-X.Y-Release-Notes` (가장 정확)
   - 공지·배경 → `spring.io/blog` 의 "X.Y.0 available now" 및 심화 글
   - 일정/지원종료 필요 시 → release-calendar / generations
   - deprecation·기본값 변경·breaking 여부를 반드시 확인(마이그레이션 판단용).

4. **사실 검증 체크** (wiki 3·5절): "언제(어느 버전)부터", "무엇이 어떻게 달라졌나", "이전 동작 대비 차이"를 버전 번호로 확정. 추측 금지 — 확인 안 되면 소스를 더 찾거나 범위를 좁힌다. "최신" 대신 버전·날짜로 표기.

5. **파일명·태그 결정** (wiki 5절): `blog/YYYY-MM-DD-spring-boot-<주제>.mdx`. 태그 `[ spring-boot, spring ]`(+주제별). `spring-boot` 태그가 `blog/tags.yml`에 없으면 먼저 등록.

6. **작성** — [blog-authoring.md](../../wiki/blog-authoring.md) 규칙대로:
   - 프론트매터(`authors: [ johnycho ]`, tags) → `<!-- truncate -->` → **인트로 문단**(기준점 3.2.0 이후 주제임을 한 줄로) → 본문.
   - 본문: 배경/왜 → 무엇이 달라졌나(버전 명시) → 코드·설정 예제(Java/Kotlin + `application.yml`) → 실무 적용/마이그레이션 → 정리.
   - 섹션별 핵심 한 문장 `<mark>` 강조. 흐름도는 Mermaid. MDX 위험문자(코드블록 밖 `<` `{` `}`) 스캔.
   - 같은 시리즈·관련 기존 글 상호 링크. **이미 다른 글에서 설명한 개념은 다시 풀지 말고 그 글로 링크**하고, 이 글은 이번 주제 고유의 내용에 집중한다(중복 서술 금지).

7. **검증**: `npm run build`로 MDX 컴파일 확인. 필요 시 `npm start`로 렌더 확인.

8. **백로그 갱신**: 방금 쓴 주제를 wiki 4-1절 **주제 백로그**에서 `[x]`로 표시(작성한 글 파일명 병기). 새로 발견한 좋은 주제가 있으면 백로그에 `[ ]`로 추가한다.

## 커밋
- 커밋·푸시는 [git 계정 정책](../../wiki/git-account.md)에 따라 **johnycho** 계정으로. hook이 자동 검증한다.

## 참고
- 소스·범위·마일스톤·주제기준: [spring-boot-updates.md](../../wiki/spring-boot-updates.md)
- 게시글 형식 전반: [blog-authoring.md](../../wiki/blog-authoring.md)
