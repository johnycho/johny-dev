# Wiki · 게시글(.mdx) 작성 규칙

기술 블로그 글(`blog/*.mdx`) 작성 시 지켜야 할 상세 규칙. 절차는 [blog-post 스킬](../skills/blog-post/SKILL.md) 참고.
(사이트는 Docusaurus 기반. 블로그는 `blog/`, 주제별 문서는 `docs/`.)

## 1) 파일 / 프론트매터
- 파일명: `blog/YYYY-MM-DD-slug.mdx`. 날짜가 목록 정렬 순서를 결정한다.
- frontmatter:
  - `slug`: URL 슬러그(kebab-case, 파일명 슬러그와 동일하게).
  - `title`: 제목. 콜론(`:`) 등 특수문자가 있으면 큰따옴표로 감싼다.
  - `authors: [ johnycho ]` — 저자는 `blog/authors.yml`에 등록된 것만. 현재 `johnycho` 하나.
  - `tags: [ ... ]` — `blog/tags.yml`에 정의된 태그만 사용(7절).
- 프론트매터 바로 다음: `<!-- truncate -->` → `<br /><br />` → 본문. truncate가 목록 카드의 요약 경계.

## 2) 본문 규칙
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

## 4) 다이어그램 — Mermaid 사용
- 흐름도·구조도는 ASCII 아트 대신 **` ```mermaid ` 코드블록**으로 그린다. 한글은 코드블록에서 2칸 폭이라 ASCII 열 정렬이 깨지기 때문.
- Mermaid는 `docusaurus.config.ts`에 활성화됨(`markdown.mermaid: true` + `@docusaurus/theme-mermaid`). 노드 라벨의 줄바꿈은 `<br/>` 사용.
- 단순 화살표 한 줄(`A → B → C`)이면 굳이 다이어그램화하지 않아도 된다.

## 5) 태그(tags) — `blog/tags.yml` 등록분만
현재 등록된 태그: `hello`, `jpa`, `spring`, `mysql`, `redis`, `kafka`, `open-telemetry`, `system-design`, `architecture`.
- 새 주제 태그가 필요하면 **먼저 `blog/tags.yml`에 label/permalink/description을 추가**한 뒤 사용.
- 글 하나에 여러 태그 가능(예: `[ system-design, architecture ]`).

## 6) 검증
- `npm run build` 로 MDX 컴파일 성공 확인(빌드 실패 시 MDX 파싱 오류 위치가 표시됨).
- 필요 시 `npm start` 로컬 서버로 목록/본문 렌더 확인.

## 관련
- 저자 설정: `blog/authors.yml` · 태그 설정: `blog/tags.yml`
- 커밋·푸시는 [git 계정 정책](./git-account.md)에 따라 **johnycho** 계정으로.
