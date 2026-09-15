---
name: java-jdk-trend-post
description: Java/JDK 최신 동향(신버전 기능·JEP·preview/incubator·GraalVM·LTS 등)을 johny-dev 기술 블로그 글(blog/*.mdx)로 작성한다. "자바 최신 동향 글 써줘", "JDK 25 뭐 바뀌었는지", "이 JEP로 블로그", "가상 스레드/패턴 매칭 정리해줘" 등의 요청에 사용. (스프링은 `/spring-update-post`, 그 외 백엔드 일반은 `/backend-trend-post`.)
---

# Java/JDK 동향 블로그 작성 스킬

Java 언어·JDK·JVM의 변화(신버전 기능, JEP, preview/incubator, GraalVM, LTS/지원 등)를 **johny-dev 톤(실전 관점·판단 과정 중심)** 으로 정리한다. 게시글 형식·MDX·다이어그램 규칙은 반드시 [../../wiki/blog-authoring.md](../../wiki/blog-authoring.md)를 먼저 읽고 그대로 따른다. 아래는 실행 절차.

## 원칙
- **1차 소스로 사실 검증.** 어느 기능이 **어느 JDK에서 preview → 2nd preview → final(정식)** 인지, 어느 버전이 LTS인지, 문법·동작을 **OpenJDK 원천으로 확정**한다. 블로그·SNS 요약을 그대로 옮기지 않는다. "최신" 대신 **JDK 버전·JEP 번호·날짜**로 표기.
- **preview/incubator 구분을 명확히.** preview 기능은 `--enable-preview` 필요·버전 간 변경 가능함을 반드시 밝힌다.
- **뉴스 요약이 아니라 관점.** "무엇이 나왔다"가 아니라 **"왜 이 기능이 필요했나 · 실무에 뭐가 달라지나 · 언제 쓰나 · 기존 방식 대비 차이"**.
- **저작권**: 스펙·문서 문장을 복사하지 않는다. 개념·예제는 내 언어로 재구성하고 원문은 링크로만.

## 공식 소스 (사실 확인의 근거)
| 소스 | URL | 용도 |
|---|---|---|
| JEP 인덱스 | https://openjdk.org/jeps/0 | 각 기능이 어느 JDK에 preview/final로 들어갔는지·상태 |
| 개별 JEP | `https://openjdk.org/jeps/<번호>` | 기능의 동기·상세·예제(가장 정확) |
| JDK 프로젝트/일정 | https://openjdk.org/projects/jdk/ | 버전별 포함 기능·GA 일정 |
| Inside Java | https://inside.java/ | Oracle Java 팀 공식 뉴스·해설·팟캐스트 |
| Java Version Almanac | https://javaalmanac.io/ | 버전별 기능·API 비교 |
| preview 프로젝트 | Loom·Panama·Valhalla·Leyden·Amber (openjdk.org/projects/…) | 진행 중 기능의 원천 |

**발굴(동향 탐색)용** — 사실 확인 소스 아님: foojay.io(https://foojay.io/), InfoQ Java, GeekNews. 여기서 본 건 반드시 위 1차 소스로 교차 검증.

## 절차

1. **주제 발굴/확정** (한 글 = 한 주제)
   - 사용자가 주제/JEP/링크를 줬으면 그대로 쓰되 2번으로 검증.
   - 안 줬으면 JEP 인덱스·Inside Java·foojay에서 임팩트 큰 후보(가상 스레드·구조적 동시성·패턴 매칭·레코드·시퀀스드 컬렉션·FFM·Valhalla 밸류 타입·GraalVM native 등) 3~4개를 "무엇을·왜 볼 만한지" 한 줄과 함께 제안(`AskUserQuestion`).
   - **중복 방지(저장소 전체)**: 후보 확정 전 `blog/*.mdx` 제목·슬러그·태그(겹칠 것 같으면 본문도)를 훑어 이미 다룬 각도인지 확인. 겹치면 각도를 달리하거나 링크로 넘긴다.

2. **1차 소스 조사·검증**: WebFetch/WebSearch로 해당 JEP·릴리스·Inside Java를 확인. **어느 JDK에서 어떤 상태(preview/final)인지, 문법·동작·이전 대비 차이**를 버전·JEP 번호로 확정. 추측 금지 — 확인 안 되면 범위를 좁힌다.

3. **각도(주제 문장) 잡기**: 이 글이 답할 질문 하나(예: "가상 스레드는 언제 이득이고 언제 독인가", "패턴 매칭으로 무엇이 사라지나").

4. **파일명·태그**: `blog/YYYY-MM-DD-<slug>.mdx`, kebab-case. 태그는 `blog/tags.yml`에 있는 것만(예: `[ java ]`; 없으면 등록 또는 기존 태그). 애매하면 사용자 확인.

5. **작성** — [blog-authoring.md](../../wiki/blog-authoring.md) 규칙대로:
   - 프론트매터(`authors: [ johnycho ]`, tags) → `<!-- truncate -->` → 바로 주제(문제/배경)로 시작(메타·연재 프레이밍 금지) → 본문.
   - 본문: 배경/왜 → 무엇이 어떻게(JDK 버전·JEP 명시, preview 여부) → 코드 예제(Java, 필요 시 이전 방식과 대비) → 실무 적용/판단 기준 → 정리. 섹션별 핵심 한 문장 `<mark>`.
   - **다이어그램은 우선순위대로**: C4-PlantUML → PlantUML → Mermaid(최후). 지표·추이는 Canvas. (blog-authoring 4절)
   - MDX 위험문자(코드블록 밖 `<` `{` `}`) 스캔 — 제네릭·다이아몬드는 코드블록 안에서만 안전. 관련 기존 글과 상호 링크(중복 서술 금지). 단어는 [word-choice.md](../../wiki/word-choice.md) 지양어 회피.

6. **검증**: `npm run build`로 MDX 컴파일 확인. 필요 시 `npm start`.

7. **리뷰(필수)**: 작성·수정 후 반드시 [`blog-review` 스킬](../blog-review/SKILL.md)(`/blog-review`)로 규칙 검토 후 지적 사항을 반영한다.

## 커밋
- 커밋·푸시는 [git 계정 정책](../../wiki/git-account.md)에 따라 **johnycho** 계정으로. hook이 자동 검증한다.

## 참고
- 게시글 형식·다이어그램·MDX: [blog-authoring.md](../../wiki/blog-authoring.md) · 단어 순화: [word-choice.md](../../wiki/word-choice.md)
- 스프링은 [spring-update-post](../spring-update-post/SKILL.md), 그 외 백엔드 일반은 [backend-trend-post](../backend-trend-post/SKILL.md).
