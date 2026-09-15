---
name: backend-trend-post
description: 백엔드 관련 최신 동향·참고할 만한 내용(GeekNews 등 애그리게이터에서 발굴)을 johny-dev 기술 블로그 글(blog/*.mdx)로 작성한다. "백엔드 동향 글 써줘", "이 기사/주제로 블로그 만들어줘", "요즘 백엔드 뭐가 뜨는지 정리해줘" 등의 요청에 사용. (스프링 전용 업데이트 글은 `/spring-update-post` 를 쓴다.)
---

# 백엔드 동향 블로그 작성 스킬

백엔드 생태계의 최근 화제·주목할 기술을 **johny-dev 톤(실전 관점·판단 과정 중심)** 으로 정리한다. 게시글 형식·MDX·다이어그램 규칙은 반드시 [../../wiki/blog-authoring.md](../../wiki/blog-authoring.md)를 먼저 읽고 그대로 따른다. 아래는 실행 절차.

## 원칙
- **애그리게이터는 "주제 발굴"용, 사실은 1차 소스로 검증.** GeekNews·Hacker News 등의 요약을 **그대로 옮기지 않는다** — 원문(공식 문서·릴리스 노트·원 저자 글·논문·벤치마크)으로 버전·날짜·수치·동작을 교차 검증하고, 확인 안 되면 범위를 좁힌다.
- **뉴스 요약이 아니라 관점을 담는다.** "무엇이 나왔다"가 아니라 **"왜 중요한가 · 실무에 뭐가 달라지나 · 언제 쓰고 언제 피하나 · 어떻게 적용/판단하나"**. johny-dev의 판단 서사와 붙인다.
- **저작권**: 기사·원문의 문장·이미지를 복사하지 않는다. 개념은 내 언어로 재구성하고, 원문은 링크로만 참조한다.

## 절차

1. **주제 발굴/확정** (한 글 = 한 주제)
   - **사용자가 주제/링크를 줬으면** 그대로 쓰되, 아래 2번으로 원문을 검증한다.
   - **안 줬으면** 백엔드 동향을 훑어 후보를 제안하고 고르게 한다(`AskUserQuestion` 권장). 발굴 소스:
     - **GeekNews** — https://news.hada.io/ (한국 백엔드·인프라·언어·DB 화제)
     - **Hacker News** — https://news.ycombinator.com/ (원문/토론)
     - 각 프로젝트 공식 릴리스·블로그(예: PostgreSQL·Redis·Kafka·Kubernetes·GraalVM·언어 릴리스 등). **Java/JDK 자체 동향**(신버전·JEP·preview 기능)은 별도 스킬 [java-jdk-trend-post](../java-jdk-trend-post/SKILL.md)를 쓴다.
   - 후보는 백엔드 실무 임팩트가 큰 것(성능·운영·아키텍처·DX·보안) 위주로 3~4개, 각 후보에 "무엇을·왜 볼 만한지" 한 줄.
   - **중복 방지(저장소 전체)**: 후보 확정 전 `blog/*.mdx`의 제목·슬러그·태그(겹칠 것 같으면 본문도)를 훑어 이미 다룬 주제·각도인지 확인한다. 겹치면 각도를 달리하거나 링크로 넘기고, 완전히 겹치면 후보에서 뺀다.

2. **원문·1차 소스 조사·검증**: WebFetch/WebSearch로 원문과 공식 소스를 확인한다. 버전·날짜·수치·동작 변경을 **1차 소스로 확정**(애그리게이터·SNS 요약만으로 단언 금지). "최신" 대신 버전·날짜로 표기.

3. **각도(주제 문장) 잡기**: 이 글이 답할 질문 하나를 정한다(예: "가상 스레드는 실무에서 언제 이득이고 언제 독인가"). 나열식이 아니라 그 질문을 향해 전개.

4. **파일명·태그 결정**: `blog/YYYY-MM-DD-<slug>.mdx`, `slug`는 kebab-case 영문. 태그는 **`blog/tags.yml`에 이미 있는 것만**(없으면 먼저 등록하거나 기존 태그로). 애매하면 사용자에게 확인.

5. **작성** — [blog-authoring.md](../../wiki/blog-authoring.md) 규칙대로:
   - 프론트매터(`authors: [ johnycho ]`, tags) → `<!-- truncate -->` → 바로 주제(문제/배경)로 시작(메타·연재 프레이밍 금지) → 본문.
   - 본문: 배경/왜 → 핵심 내용(버전·사실 명시) → 코드·설정 예제(필요 시) → 실무 적용/판단 기준 → 정리. 섹션별 핵심 한 문장 `<mark>`.
   - **다이어그램은 우선순위대로**: C4-PlantUML → PlantUML → Mermaid(최후). 지표·추이는 Canvas 컴포넌트. (blog-authoring 4절)
   - MDX 위험문자(코드블록 밖 `<` `{` `}`) 스캔. 관련 기존 글과 상호 링크(이미 설명한 개념은 링크로 넘기고 중복 서술 금지).
   - 단어·표현은 [word-choice.md](../../wiki/word-choice.md) 지양어를 피한다.

6. **검증**: `npm run build`로 MDX 컴파일 확인. 필요 시 `npm start`로 렌더 확인.

7. **리뷰(필수)**: 작성·수정 후 반드시 [`blog-review` 스킬](../blog-review/SKILL.md)(`/blog-review`)로 규칙 검토 후 지적 사항을 반영한다.

## 커밋
- 커밋·푸시는 [git 계정 정책](../../wiki/git-account.md)에 따라 **johnycho** 계정으로. hook이 자동 검증한다.

## 참고
- 게시글 형식·다이어그램·MDX: [blog-authoring.md](../../wiki/blog-authoring.md)
- 단어 순화: [word-choice.md](../../wiki/word-choice.md) · 커밋 정책: [git-account.md](../../wiki/git-account.md)
- 스프링 부트 전용 업데이트 글은 [spring-update-post 스킬](../spring-update-post/SKILL.md)을 쓴다(주제가 스프링이면 그쪽).
