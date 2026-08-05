# Wiki · 스프링 부트 업데이트 시리즈 (3.2.0 이후)

Spring Boot 3.2.0 **이후**의 주목할 변화·동향을 **주제별**로 다루는 연재 글의 참조 규칙. 절차는 [spring-update-post 스킬](../skills/spring-update-post/SKILL.md)(`/spring-update-post`) 참고. 게시글 자체의 형식·MDX 규칙은 [blog-authoring.md](./blog-authoring.md)를 그대로 따른다.

## 1) 목적과 범위
- **기준점**: Spring Boot **3.2.0(2023-11)** 이후에 등장한 변화만 다룬다. 그 이전부터 있던 기능은 "3.2 이후에 의미가 달라진 경우"에만.
- **단위**: **버전별**이 아니라 **주제별**로 쓴다. 예) "구조적 로깅", "관측성(Observability) 강화", "RestClient", "가상 스레드", "CDS/AOT 시작속도", "4.0 모듈화·null-safety". 한 주제가 여러 버전에 걸쳐 발전했으면 그 흐름을 한 글에 엮는다.
- **관점**: 릴리스 노트 받아쓰기가 아니라 **"왜 바뀌었나 · 실무에 뭐가 달라지나 · 어떻게 적용/마이그레이션하나"** 를 담는다. johny-dev 톤(실전 경험·판단 과정 중심).

## 2) 공식 소스 (사실 확인의 근거)
글의 모든 버전·날짜·동작 변경은 아래 **1차 소스**로 교차 검증한다(블로그·SNS 요약 신뢰 금지).

| 소스 | URL | 용도 |
|---|---|---|
| Release Calendar | https://spring.io/projects#release-calendar | 다음/현재 GA·지원종료(OSS EOL) 일정 |
| Spring Blog | https://spring.io/blog | "X.Y.0 available now" 공지·하이라이트·심화 글 |
| GitHub Releases | https://github.com/spring-projects/spring-boot/releases | 버전별 변경 목록·태그·날짜 |
| Release Notes (wiki) | `https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-X.Y-Release-Notes` | 주제별 상세·마이그레이션·Deprecations(가장 정확) |
| Version Mappings | https://spring.io/projects/generations | 각 세대의 지원 기간 |

## 3) 버전 마일스톤 (기준점 이후 · GA 날짜는 소스로 재확인)
> 아래는 작성 시점 기준 요약이다. **글에 쓰기 전 반드시 GitHub Release Notes로 날짜·내용 재확인**(버전은 계속 추가됨).

| 버전 | GA | 대표 변화(주제 후보) |
|---|---|---|
| **3.2.0** | 2023-11-23 | (기준점) 가상 스레드 지원, RestClient 도입, Docker Compose/Testcontainers, SSL 번들 |
| **3.3.0** | 2024-05-23 | CDS 시작속도, 관측성(@SpanTag·Prometheus 1.x), 보안 자동설정, 서비스 커넥션 확장 |
| **3.4.0** | 2024-11-21 | 구조적 로깅(ECS·GELF·Logstash), `@Fallback` 빈, 클라이언트 설정 정비 |
| **3.5.0** | 2025-05-22 | RestClient/WebClient 프로퍼티 설정·리다이렉트 기본값, 설정 정리 |
| **4.0.0** | 2025-11-20 | 코드베이스 모듈화(작은 jar), JSpecify null-safety, Java 25 1급 지원, API 버저닝·HTTP Service Client, Jakarta EE 11·Jackson 3·Kotlin 2·JUnit 6 |

> 세대 구분: **3.x는 Spring Framework 6 / Java 17+ / Jakarta EE 9~10**, **4.0은 Spring Framework 7 / Java 17+(25 1급) / Jakarta EE 11**. 4.0은 major라 마이그레이션 주제가 별도 글감이 된다.

## 4) 주제 선정 기준
좋은 주제는 다음 중 하나 이상을 만족한다.
- **실무 임팩트**가 크다(성능·운영·보안·DX). 예: 가상 스레드, CDS, 구조적 로깅.
- **마이그레이션 판단**이 필요하다(deprecation·기본값 변경·breaking). 예: 3.5 리다이렉트 기본값, 4.0 모듈 분리.
- **오해·함정이 잦다**(설정 하나로 동작이 갈림). johny-dev의 "직접 겪은 판단" 서사와 잘 붙는다.
- 이미 쓴 다른 블로그 글(JPA·Kafka·아키텍처 등)과 **연결점**이 있다 → 상호 링크.

피할 것: 단순 의존성 업그레이드 나열, 마이너 버그픽스, 버전별 changelog 전체 요약.

## 4-1) 주제 백로그 (자동 선정의 기준)
스킬이 주제를 스스로 고를 때 이 목록에서 **아직 `[ ]`(미작성)인 것 중 임팩트 큰 것**을 집는다. 글을 쓰면 `[x]`로 바꾸고 파일명을 적는다. 좋은 주제를 새로 찾으면 `[ ]`로 추가한다. (임팩트 큰 순서로 정렬 유지)

- [x] 구조적 로깅 (3.4 / 3.5) — `blog/2026-08-05-spring-boot-structured-logging.mdx`
- [ ] 가상 스레드(Virtual Threads) 지원 (3.2) — `spring.threads.virtual.enabled`, 언제 켜고 언제 위험한가
- [ ] RestClient — 동기 HTTP 클라이언트 (3.2 도입 → 3.5 프로퍼티 설정), RestTemplate/WebClient와 비교
- [ ] CDS/AOT 시작 속도 (3.3) — 시작 시간·메모리 절감, 언제 효과 있나
- [ ] 관측성(Observability) 강화 (3.3+) — Micrometer `@SpanTag`, Prometheus 1.x. ⚠️ 기존 `kafka-distributed-tracing` 글과 겹침 → 트레이싱 개념은 그 글로 링크하고, Spring Boot 자동설정·메트릭 관점으로 각도를 좁힐 것
- [ ] 서비스 커넥션·Docker Compose·Testcontainers 개발 경험 (3.1→3.4)
- [ ] Spring Boot 4.0 마이그레이션 — 모듈화(작은 jar)·JSpecify null-safety·Java 25·API 버저닝·Jakarta EE 11
- [ ] HTTP Service Client / API 버저닝 (4.0)

## 5) 시리즈 컨벤션
- **슬러그/파일명**: `blog/YYYY-MM-DD-spring-boot-<주제>.mdx` (예: `2026-08-10-spring-boot-structured-logging.mdx`). 주제 슬러그는 kebab-case 영문.
- **태그**: 기존 **`spring`** 태그를 쓴다(별도 `spring-boot` 태그는 만들지 않음). 주제에 따라 등록된 태그를 더한다(예: `[ spring, monitoring ]`).
- **버전 표기**: 본문 첫 등장 시 정확히(`Spring Boot 3.4.0`), 이후 `3.4`. "최신"이라는 표현 대신 버전·날짜를 명시(글이 오래돼도 정확하도록).
- **상호 링크**: 같은 시리즈 글끼리 "관련 글"로 링크.
- **메타 문구 금지**: "…시리즈입니다", "이번 주제는…", "3.2.0 이후의 변화를 짚는" 같은 **연재/기준점 소개 문구를 본문에 넣지 않는다**. 독자는 개별 글로 유입되므로, 바로 주제 내용(문제·배경)으로 시작한다. 버전은 사실로서 본문에 적되(예: "3.4.0부터"), 시리즈 프레이밍은 쓰지 않는다.
- **출처**: 본문에서 동작 변경을 단언할 때는 해당 Release Notes/블로그 공지를 근거로 삼는다(필요 시 링크).

## 6) 게시글 형식
- 프론트매터·`<!-- truncate -->`·인트로 문단·`<mark>` 강조·MDX 위험문자·Mermaid 규칙은 전부 [blog-authoring.md](./blog-authoring.md)를 따른다(이 문서는 "무엇을/왜"만 정의).
- 코드 예제는 Java/Kotlin + `application.yml` 조합. 버전에 종속적인 설정은 어느 버전부터인지 명시.

## 관련
- 절차: [spring-update-post 스킬](../skills/spring-update-post/SKILL.md)
- 형식: [blog-authoring.md](./blog-authoring.md) · 커밋 정책: [git-account.md](./git-account.md)
