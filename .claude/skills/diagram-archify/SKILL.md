# 인터랙티브 다이어그램 스킬 (archify)

구조·아키텍처 다이어그램을 **인터랙티브**로 넣는다 — 노드 포커스, hover 시 관계(화살표) 흐름, 여러 뷰 전환. [archify](https://github.com/tt-a1i/archify)(MIT, zero-dependency Node CLI)가 typed JSON IR을 결정적으로 HTML/SVG로 컴파일한다. 형식은 [../../wiki/blog-authoring.md](../../wiki/blog-authoring.md) 4절 참고.

## 언제 쓰나 (적극 적용)
- **아키텍처·구성요소·시스템 연동·데이터 흐름·상태/수명주기** 다이어그램에서 **인터랙티브 탐색이 이해를 도우면 archify를 적극 적용한다.** 블로그 작성 시 구조 다이어그램이 나오면 우선 archify 적용을 검토한다.
- 단, **단순한 그림**(화살표 몇 개, 표로 충분)은 [diagram-static](../diagram-static/SKILL.md)이 가볍고 낫다. 지표·추이·분포는 [chart-canvas](../chart-canvas/SKILL.md).
- **SEO·프린트 고려**: iframe 속 인터랙티브 HTML은 본문으로 색인되지 않는다. 검색 노출이 중요한 핵심 다이어그램이면 **정적 SVG(diagram-static)를 위에 함께 두고** 그 아래 인터랙티브를 붙이는 이중 제공을 고려한다.

## 절차

1. **archify 준비** — `npx skills add tt-a1i/archify -g`(또는 repo clone). CLI는 `node <archify>/archify/bin/archify.mjs <cmd>`. 타입: `architecture · workflow · sequence · dataflow · lifecycle`.
2. **IR(JSON) 작성** — 핵심 스키마(architecture 예):
   - `schema_version:1`, `diagram_type:"architecture"`
   - `meta`: `{ title, quality_profile:"showcase", views:[{id,label,focus:[id…],note}] }`
   - `components:[{ id, type, label, sublabel?, pos:[x,y], size:[w,h], tag? }]` — **type enum**: `external·backend·database·cloud·security·messagebus·frontend`
     - **⚠️ type은 legend에 그 이름 그대로 노출된다 — 색 구분용으로 아무거나 고르지 말고 의미에 맞게 쓴다.** 예: 도메인/코어·유스케이스·일반 프로세스=`backend`, DB·저장소=`database`, 외부 사용자/시스템=`external`, 외부 API 클라이언트=`external`, 메시지 큐=`messagebus`, UI/프런트=`frontend`, 클라우드 관리형 서비스(CDN·S3 등)만=`cloud`. **쿠버네티스 Pod·컨테이너 런타임·Service, 도메인 모듈 등은 `cloud`가 아니다(→ `backend`).** 같은 색이 겹쳐도 위치·경계(boundary)로 구분되므로, 억지 색 분리보다 정확한 타입이 우선.
   - `boundaries:[{ kind, label, wraps:[id…] }]` — **kind enum**: `region · security-group`(라벨로 의미 표현)
   - `connections:[{ id, from, to, label?, variant?("emphasis"/"dashed"/"security"), labelAt?:[x,y] }]`
   - `cards:[{ dot("cyan"/"emerald"/"rose"…), title, items:[…] }]`
3. **검증(필수·반복)** — `archify validate architecture x.json`. 레이아웃 겹침을 엄격히 잡고 **수리 좌표**를 알려준다.
   - 라벨↔노드 겹침 → 해당 connection에 `labelAt:[x,y]`(제안 좌표) 지정.
   - 라벨끼리 근접 → 좌표 조정, 또는 **보조 연결은 라벨을 빼거나 연결 자체를 삭제**(경계·카드가 역할을 설명).
   - `ok ...` 나올 때까지 반복.
4. **렌더** — `archify render architecture x.json static/diagrams/<name>.html`(자체완결 HTML).
5. **임베드 CSS 주입(필수)** — `node .claude/skills/diagram-archify/inject-embed-css.mjs static/diagrams/<name>.html`. **archify로 재렌더할 때마다 다시 실행**(재렌더 시 주입 CSS가 사라짐). 적용(멱등): 편집 크롬 숨김·hover 흐름 유지·본문 폭 채움(넓은 그림 `min-width:0`로 모바일 잘림 방지)·단일 박스·cards 축소.
   - overview-map(미니맵)이나 cards를 표시/숨김하려면 스크립트의 `HIDE` 목록에서 해당 선택자를 뺀다.
6. **블로그 삽입** — 컴포넌트로 임베드(다크/라이트 동기화·자동 높이·단일 테두리 박스 처리):
   ```mdx
   import ArchifyEmbed from '@site/src/components/ArchifyEmbed';

   <ArchifyEmbed src="/diagrams/<name>.html" title="…(인터랙티브)" height="620px" />
   ```
   - `ArchifyEmbed`(`src/components/ArchifyEmbed.tsx`)가 `?theme=`로 초기 테마를 맞추고, 토글 시 same-origin `data-theme`로 리로드 없이 전환. 높이는 내용에 맞춰 자동(연속 관찰 없이 로드 후 몇 번만 측정 → 고정, 상한 1400px).

## 주의
- 자산 **~800KB/다이어그램**(자체완결 HTML). iframe이라 **메인 JS 번들은 늘지 않지만**, 페이지 로드 시 그만큼 받는다 — 한 글에 너무 많이 넣지 않는다.
- `embed=1` URL 모드는 hover 관계 오버레이(화살표 흐름)까지 꺼버리므로 **쓰지 않는다**(크롬 숨김은 위 주입 CSS가 담당).

## 레이아웃·여백 주의 (경험칙)

- **위쪽 빈 띠(top padding) 방지 — IR 좌표를 위로 붙인다.** archify는 viewBox를 대략 `0 0 W H`(원점 0)로 잡으므로, 노드를 `pos:[x, 120]`처럼 아래에서 시작하면 **상단에 그만큼(예: ~90px) 빈 띠**가 생긴다. **최상단 노드/경계가 y≈0 근처**에 오도록 **전체 `pos` y를 동일하게 빼서(평행이동) 재렌더**한다 — 평행이동은 상대 배치를 바꾸지 않으므로 "배치 유지"와 상충하지 않는다(예: scm은 전체 y −60으로 viewBox 488→428).
  - **주의**: `<rect y>` **최소값만 보면 오판**한다 — 좌상단 장식 요소가 y≈5에 있어 최소 y는 작아도, **실제 노드/영역(region)은 y≈60~90부터** 시작해 그 사이가 빈 띠일 수 있다. 최소 y가 아니라 **실제 노드/region이 시작하는 y**를 기준으로 판단한다(예매·scm처럼 최상단 노드가 아래에 있으면 그 값만큼 전체를 위로).
- **세로 중앙정렬로 인한 상단 여백**은 [inject-embed-css.mjs](./inject-embed-css.mjs)가 처리한다 — `body{display:block}` + `.container/.diagram-container`를 `flex-start`로 상단 정렬(중앙정렬 해제). 재렌더 후 이 스크립트를 반드시 다시 돌린다.
- **높이 무한 증가(떨림)**: archify 기본 `.container{height:100dvh}`를 주입 CSS가 `height:auto`로 해제하고, `ArchifyEmbed`는 **연속 ResizeObserver를 쓰지 않고** 로드 후 몇 번만 측정해 고정(상한 1400px)한다 — 되먹임 루프 방지.
- **상하 여백 대칭**: iframe 높이 버퍼는 `+1px`만(위=컨테이너 패딩, 아래=컨테이너 패딩). `scrolling="no"`+overflow hidden이라 스크롤바는 안 생긴다.
- **가로 폭 초과 → 가독성 실패**: 노드를 한 줄로 너무 많이 늘어놓으면 `composition/desktop-readability`로 검증 실패한다. **2행 스네이크 배치**(예: 위 3개 → 아래 3개 역방향)로 폭을 줄인다.
- **임베드 아래 본문과의 간격**: iframe이 바로 아래 문단과 붙어 보이지 않도록 `ArchifyEmbed`가 **하단 여백만(`margin: 0 0 1.75rem`)** 준다. **상단 여백은 두지 않는다**(위에 상단 margin을 주면 정적 SVG와의 사이에 불필요한 빈 공간이 생겨 "위쪽 여백" 지적이 나옴). 별도로 빈 줄을 넣을 필요는 없다(간격이 부족하면 하단 margin 값만 조정).

## 검증
- `npm run build`(onBrokenLinks:throw로 링크 검증) 통과 확인. 산출물 `build/diagrams/<name>.html` 존재 확인. 작성·수정 후 [blog-review](../blog-review/SKILL.md).
