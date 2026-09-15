---
name: trend-post-ai
description: AI를 (백엔드) 개발에 활용하는 동향·방법론·도구를 johny-dev 기술 블로그 글(blog/*.mdx)로 작성한다. ChatGPT·Claude 등 LLM의 개발 활용법, 쓸 만한 도구·MCP 서버·에이전트, 하네스(harness) 구축·개발 자동화 팁, 알아 둘 새 용어·개념 정리에 사용. "AI 개발 활용 동향 글 써줘", "클로드/코딩 에이전트로 개발 자동화", "MCP/툴 유즈 정리해줘" 등의 요청에 쓴다. (스프링은 `/trend-post-spring`, Java/JDK는 `/trend-post-java`, 그 외 백엔드 일반은 `/trend-post-backend`.)
---

# AI 개발 활용 동향 블로그 작성 스킬

LLM(ChatGPT·Claude 등)을 **개발, 특히 백엔드 개발에 실제로 활용하는 방법**을 **johny-dev 톤(실전 관점·판단 과정 중심)** 으로 정리한다. 방법론·도구·하네스 구축·개발 자동화·새 용어까지 포괄하되, **객관적 공식 소스 기반**으로 쓴다. 게시글 형식·MDX·다이어그램 규칙은 반드시 [../../wiki/blog-authoring.md](../../wiki/blog-authoring.md)를 먼저 읽고 그대로 따른다. 아래는 실행 절차.

## 원칙
- **객관적 공식 소스 기반, 마케팅·과장 배제.** 벤더 블로그의 홍보 문구·데모 수치를 그대로 옮기지 않는다. **공식 문서·스펙·모델 카드·릴리스 노트**로 동작·버전·제약을 확정하고, 확인 안 되면 범위를 좁힌다. "최신"·"혁신" 대신 **버전·날짜·구체 동작**으로 표기.
- **벤더 중립.** 특정 도구·회사를 띄우는 글이 아니라 **"무엇을 어떻게 쓰면 개발에 도움이 되나"** 를 다룬다. 비교할 땐 각 도구의 공식 문서를 근거로 공정하게, 장단점을 함께.
- **뉴스 요약이 아니라 방법론·판단.** "무엇이 나왔다"가 아니라 **"왜 유용한가 · 실무 개발에 어떻게 붙이나 · 언제 쓰고 언제 피하나 · 한계·리스크는 무엇인가"**. 자동화·에이전트는 **오작동·비용·보안 리스크와 통제 방법**을 반드시 함께 다룬다.
- **실험/미성숙 표시.** preview·beta·실험 단계 기능, 급변하는 스펙(MCP 등)은 그 사실과 확인 시점(날짜)을 밝힌다.
- **저작권.** 문서·기사 문장·이미지를 복사하지 않는다. 개념·예제는 내 언어로 재구성하고 원문은 링크로만. 프롬프트·코드 예시는 직접 만든 것으로.

## 공식 소스 (사실 확인의 근거)
| 소스 | URL | 용도 |
|---|---|---|
| Anthropic 문서 | https://docs.anthropic.com/ | Claude API·tool use·프롬프트·모델 |
| Anthropic Engineering | https://www.anthropic.com/engineering | 에이전트·하네스 설계 원칙(예: Building effective agents) |
| Claude Code 문서 | https://docs.anthropic.com/en/docs/claude-code | 코딩 에이전트·훅·MCP·슬래시 커맨드 |
| Anthropic Cookbook | https://github.com/anthropics/anthropic-cookbook | 실제 동작하는 예제 코드 |
| OpenAI 문서 | https://platform.openai.com/docs | GPT API·function calling·Agents |
| OpenAI Cookbook | https://github.com/openai/openai-cookbook | 예제·패턴 |
| Model Context Protocol | https://modelcontextprotocol.io/ | MCP 스펙·서버/클라이언트 개념(빠르게 변함) |
| 각 도구 공식 문서 | (Cursor·Continue·LangChain·LlamaIndex 등) | 해당 도구의 정확한 동작·설정 |

**발굴(동향 탐색)용** — 사실 확인 소스 아님: GeekNews(https://news.hada.io/), Hacker News, Latent Space, InfoQ AI. 여기서 본 건 반드시 위 공식 소스로 교차 검증한다.

## 절차

1. **주제 발굴/확정** (한 글 = 한 주제)
   - **사용자가 주제/링크를 줬으면** 그대로 쓰되 2번으로 검증.
   - **안 줬으면** 아래 축에서 임팩트 큰 후보 3~4개를 "무엇을·왜 볼 만한지" 한 줄과 함께 제안(`AskUserQuestion` 권장).
     - **활용 방법론** — 코드 리뷰·리팩터·테스트 생성·문서화·마이그레이션에 LLM 붙이기, 프롬프트/컨텍스트 설계.
     - **도구·에코시스템** — 코딩 에이전트(Claude Code 등), MCP 서버, Agent SDK, 로컬/CI 통합 도구.
     - **하네스 구축** — 도구(tool) 정의·에이전트 루프 제어·평가(eval)·가드레일·휴먼인더루프.
     - **개발 자동화** — CI/CD에 LLM 접목, 코드 생성 파이프라인, 자동 리뷰·이슈 분류.
     - **새 용어·개념** — MCP, tool use/function calling, agentic, RAG, context engineering, eval 등 알아 둘 개념 정리.
   - **중복 방지(저장소 전체)**: 후보 확정 전 `blog/*.mdx`의 제목·슬러그·태그(`ai` 태그 글 위주로 본문도)를 훑어 이미 다룬 각도인지 확인. 겹치면 각도를 달리하거나 링크로 넘긴다.

2. **공식 소스 조사·검증**: WebFetch/WebSearch로 위 공식 문서·스펙·모델 카드를 확인한다. **동작·버전·제약·비용 특성**을 공식 소스로 확정(벤더 홍보·SNS 요약만으로 단언 금지). 스펙이 자주 바뀌는 것(MCP 등)은 **확인 날짜**를 명시.

3. **각도(주제 문장) 잡기**: 이 글이 답할 질문 하나(예: "코딩 에이전트에 MCP를 붙이면 실무에서 뭐가 달라지고 뭘 조심해야 하나"). 나열식이 아니라 그 질문을 향해 전개.

4. **파일명·태그**: `blog/YYYY-MM-DD-<slug>.mdx`, kebab-case 영문. 태그는 `blog/tags.yml`에 있는 것만 — 기본 **`ai`**(+ 성격에 따라 `system-design`·`architecture` 등). 없으면 먼저 등록하거나 기존 태그로. 애매하면 사용자 확인.

5. **작성** — [blog-authoring.md](../../wiki/blog-authoring.md) 규칙대로:
   - 프론트매터(`authors: [ johnycho ]`, tags) → `<!-- truncate -->` → 바로 주제(문제/배경)로 시작(메타·연재 프레이밍 금지) → 본문.
   - 본문: 배경/왜 → 무엇을 어떻게(도구·개념·버전 명시) → 예시(프롬프트·설정·코드·에이전트 흐름) → **실무 적용·판단 기준·한계/리스크·통제법** → 정리. 섹션별 핵심 한 문장 `<mark>`.
   - **다이어그램은 우선순위대로**: C4-PlantUML → PlantUML(에이전트 루프·데이터 흐름은 시퀀스/액티비티) → Mermaid(최후). 지표·추이는 Canvas. (blog-authoring 4절)
   - MDX 위험문자(코드블록 밖 `<` `{` `}`) 스캔. 관련 기존 글과 상호 링크(이미 설명한 개념은 링크로, 중복 서술 금지). 단어는 [word-choice.md](../../wiki/word-choice.md) 지양어 회피.

6. **검증**: `npm run build`로 MDX 컴파일 확인. 필요 시 `npm start`로 렌더 확인.

7. **리뷰(필수)**: 작성·수정 후 반드시 [`blog-review` 스킬](../blog-review/SKILL.md)(`/blog-review`)로 규칙 검토 후 지적 사항을 반영한다.

## 커밋
- 커밋·푸시는 [git 계정 정책](../../wiki/git-account.md)에 따라 **johnycho** 계정으로. hook이 자동 검증한다.

## 참고
- 게시글 형식·다이어그램·MDX: [blog-authoring.md](../../wiki/blog-authoring.md) · 단어 순화: [word-choice.md](../../wiki/word-choice.md)
- 스프링은 [trend-post-spring](../trend-post-spring/SKILL.md), Java/JDK는 [trend-post-java](../trend-post-java/SKILL.md), 그 외 백엔드 일반은 [trend-post-backend](../trend-post-backend/SKILL.md).
