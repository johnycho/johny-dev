# Wiki · 게시글(.mdx) 작성 규칙

기술 블로그 글(`blog/*.mdx`) 작성 시 지켜야 할 상세 규칙. 절차는 [blog-post 스킬](../skills/blog-post/SKILL.md) 참고.
(사이트는 Docusaurus 기반. 블로그는 `blog/`, 주제별 문서는 `docs/`.)

## 1) 파일 / 프론트매터
- 파일명: `blog/YYYY-MM-DD-slug.mdx`. 날짜가 목록 정렬 순서를 결정한다.
- **참조 순서**: 다른 글을 링크로 참조하면, **참조하는 글의 날짜가 참조 대상보다 나중**이어야 목록에서 자연스럽다(후속·심화 글이 위로). 같은 날 여러 글이면 프론트매터 `date`에 시각까지 넣어(`date: YYYY-MM-DDTHH:MM:SS`) 순서를 명확히 한다.
- frontmatter:
  - `slug`: URL 슬러그(kebab-case, 파일명 슬러그와 동일하게).
  - `title`: 제목. 콜론(`:`) 등 특수문자가 있으면 큰따옴표로 감싼다.
  - `authors: [ johnycho ]` — 저자는 `blog/authors.yml`에 등록된 것만. 현재 `johnycho` 하나.
  - `tags: [ ... ]` — `blog/tags.yml`에 정의된 태그만 사용(7절).
- 프론트매터 바로 다음: `<!-- truncate -->` → `<br /><br />` → 본문. truncate가 목록 카드의 요약 경계.

## 2) 본문 규칙
- **눈높이: 초보자도 이해할 수 있게 쓴다.** 전문 용어(예: MDC, ECS, grok, FQCN)는 처음 나올 때 한 줄로 풀어 준다. 필요하면 비유를 쓰고(예: 컨텍스트=세트/창고), 짧은 문장으로 단계를 밟는다. 배경 지식을 가정하지 말고 "왜 필요한지"부터 설명한다. 용어가 많으면 글 끝에 "용어 한 줄 정리" 표를 붙여도 좋다.
- **톤: 담백한 기술 문장.** 과장·극적 비유를 남발하지 않는다. 비유는 이해를 돕는 선에서 절제해서만.
  - **구어적·비유적·AI스러운 표현은 일반적인 기술 용어로 바꾼다** — 지양/권장 단어 목록·예외·용어 선택 규칙은 [word-choice.md](./word-choice.md)를 따른다. (표현을 새로 바꾸면 그 파일 표에 한 행 추가)
- **코드 예시의 메서드 체이닝**은 fluent 정렬을 따른다(첫 줄 마지막 호출의 `.` 아래로 세로 정렬). 상세·예시는 [common-authoring.md](./common-authoring.md) 참고.
- **제목 H1(`# ...`)을 본문 맨 앞에 중복으로 넣지 않는다** — 제목은 프론트매터에 있다. 인트로 문단으로 시작.
- 원본 초안(예: `~/Downloads/*.md`)을 반영할 때는 맨 앞 H1 한 줄만 제거하고 나머지 본문·코드블록은 그대로 살린다.
- 섹션 구분은 `##`부터 사용. 줄바꿈은 `<br />`.
- **`<mark>` 하이라이트 적극 활용**: 각 섹션에서 **가장 핵심이 되는 한 문장/구절**을 `<mark>...</mark>`로 강조한다. 독자가 스크롤하며 요점만 훑어도 흐름을 잡을 수 있게 한다.
  - 기준: 섹션당 대략 1개(많아야 2개). 정의·결론·핵심 규칙처럼 "이것만 기억하면 되는" 부분에.
  - 남용 금지: 여러 문장을 통째로 칠하거나 한 섹션에 여러 개 칠하면 강조 효과가 사라진다. 이미 `**볼드**`나 `>` 인용구로 강조된 블록과 중복해 덧칠하지 않는다.
  - `<mark>` 안에 `**볼드**`·인라인코드·따옴표를 포함해도 된다. 코드블록 안에서는 쓰지 않는다.

## 3) MDX(v3) 주의 — 렌더 깨짐 방지
- 코드블록(``` ```) **밖** 본문에서 raw `{` `}` `<태그` 는 JSX로 해석되어 빌드가 깨질 수 있다.
  - 의도한 `<mark>`, `<br />`, `<!-- -->` 는 예외(그대로 사용).
  - 그 외 `<`, `{`, `}` 가 본문 텍스트에 필요하면 이스케이프(`&lt;`, `&#123;`, `&#125;`).
- 제네릭(`List<Long>`), ASCII 다이어그램, 중괄호 등은 **코드블록 안에서는 안전** — 그대로 둔다.
- 작성 후 코드블록 밖 본문에 위험 패턴이 없는지 스캔한다(스킬 6절).

## 4) 다이어그램·시각화 — Mermaid + Canvas 컴포넌트
- **구조/흐름도는 Mermaid**: ASCII 아트 대신 **` ```mermaid ` 코드블록**으로 그린다(한글은 코드블록에서 2칸 폭이라 ASCII 열 정렬이 깨짐). Mermaid는 `docusaurus.config.ts`에 활성화됨(`markdown.mermaid: true`). 노드 라벨 줄바꿈은 `<br/>`. 단순 화살표 한 줄(`A → B → C`)이면 굳이 그리지 않아도 된다.
- **시간에 따른 값·패턴은 애니메이션 Canvas 컴포넌트를 적극 활용**한다. 지표 추이(메모리 톱니/계단, 트래픽 곡선), 분포(응답시간 꼬리), 두 지표의 상관(캐시 히트율↓+DB 부하↑), 큐 발산 같은 "움직임이 의미 있는" 시각화는 정적 그림보다 **직접 만든 canvas 컴포넌트**가 이해를 돕는다.
  - 재사용 컴포넌트: [`src/components/blog/MonitorCharts.tsx`](../../src/components/blog/MonitorCharts.tsx) — `AnimatedLineChart`(선·듀얼선·계단`step`·추세선`trend`·범례`legend`), `AnimatedBars`(막대). 의존성 없이 SSR 안전(그리기는 클라이언트 `useEffect`에서만).
  - .mdx에서 `import {AnimatedLineChart, AnimatedBars} from '@site/src/components/blog/MonitorCharts';` 후 JSX로 사용. 새 시각화 유형이 필요하면 이 파일에 컴포넌트를 추가해 재사용한다.
  - 애니메이션은 부드럽게(정점 사이 보간 + easing). 과용은 금물 — 정적 표/Mermaid로 충분한 곳엔 쓰지 않는다.
- **도구 GUI 화면은 "오리지널 목업"으로 재현**한다. IDE·프로파일러·대시보드 등 특정 도구의 화면을 예시로 보여줄 때, 스크린샷을 복사/핫링크하지 말고 **창틀·탭·표를 HTML/CSS로 직접 그린 목업 컴포넌트**로 재현한다(캡션에 "실제 스크린샷 아님" 명시).
  - 재사용 컴포넌트: [`src/components/blog/MatMockup.tsx`](../../src/components/blog/MatMockup.tsx) — MAT(Memory Analyzer) 창 목업(`MatDominatorTree`·`MatHistogram`·`MatPathToGCRoots`). 창틀+탭 공통 `Chrome` + 표/트리. 새 도구 화면이 필요하면 같은 패턴(공통 창틀 + 뷰별 데이터 배열)으로 컴포넌트를 추가한다.
  - 테마 대응은 사이트 변수(`--site-card-bg`·`--site-fg`·`--site-accent`·`--site-card-border` 등)를 쓰고, 좁은 화면은 가로 스크롤(`overflow-x:auto`)로.
- **저작권(시각자료 공통)**: 다른 글의 이미지·애니메이션이나 도구의 스크린샷을 복사/핫링크하지 말 것. 같은 개념·화면은 **직접 구현한 컴포넌트(canvas/목업)로 재현**하고, 원문·도구는 **링크로만** 참조한다. (본인이 직접 캡처했거나 권한이 확인된 이미지만 출처 표기 후 임베드)

## 5) 태그(tags) — `blog/tags.yml` 등록분만
현재 등록된 태그: `java`, `jpa`, `spring`, `mysql`, `redis`, `kafka`, `monitoring`, `system-design`, `architecture`, `ai`.
- 새 주제 태그가 필요하면 **먼저 `blog/tags.yml`에 label/permalink/description을 추가**한 뒤 사용.
- 글 하나에 여러 태그 가능(예: `[ system-design, architecture ]`).

## 6) 검증
- `npm run build` 로 MDX 컴파일 성공 확인(빌드 실패 시 MDX 파싱 오류 위치가 표시됨).
- 필요 시 `npm start` 로컬 서버로 목록/본문 렌더 확인.

## 관련
- 저자 설정: `blog/authors.yml` · 태그 설정: `blog/tags.yml`
- 커밋·푸시는 [git 계정 정책](./git-account.md)에 따라 **johnycho** 계정으로.
