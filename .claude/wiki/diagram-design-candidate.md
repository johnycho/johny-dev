# 아카이브 · diagram-design (후보 다이어그램 스킬) — 추후 검증

> 상태: **평가 보류(추후 검증)**. 채택 결정 전까지 발행하지 않는다.
> 평가용 초안: [`blog/2026-10-19-diagram-design-responsive-test.mdx`](../../blog/2026-10-19-diagram-design-responsive-test.mdx) (`draft: true` — 프로덕션 빌드 제외, 로컬에서만 보임)
> 재현 컴포넌트: [`src/components/blog/DiagramDesignDemo.tsx`](../../src/components/blog/DiagramDesignDemo.tsx) (+ `.module.css`)

## 무엇인가
- [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) — "자연어 요청 → **에디토리얼 다이어그램**을 자가완결 HTML+SVG 1파일로" 그려 주는 **Agent Skill**. MIT, 2026-10 기준 깃허브 스타 ~5.5만.
- 공식: 사이트 https://diagramdesign.dev · 갤러리 https://cathrynlavery.github.io/diagram-design/ · 설치 `npx skills add cathrynlavery/diagram-design`
- **Mermaid 미사용**(자체 레이아웃), 그림자 없음, 아이콘 라이브러리(devicon/tabler/simple) 내장, 브랜드(팔레트·폰트) 온보딩 지원.

## 다이어그램 타입(약 46종, `references/type-*.md`·`docs/screenshots/` 기준)
architecture, architecture-delta, axonometric-plan, bar, data-flow, db-schema, dependency, deployment, dp-integration, dp-security-matrix, er, exploded, fishbone, flowchart, gantt, heatmap, high-level, it-state, journey, kanban, layers, line, loop, medallion, nested, org-chart, polar, process, pyramid, quadrant, quadrant-consultant, radar, sankey, scatter, sequence, service-blueprint, state, story-map, swimlane, timeline, tree, treemap, uml-class, venn, wardley, waterfall. (import: drawio/mermaid/excalidraw)

## 출력·반응형 모델 (블로그 적용 관점)
- 출력은 `viewBox`를 가진 **인라인 SVG**(HTML 래퍼 안). → 기존 Kroki/PlantUML SVG처럼 **컴포넌트로 감싸 인라인**하면 된다(권장). iframe도 가능하나 본문 색인 안 됨.
- 반응형은 **공통 래퍼**가 결정(타입 무관): `.frame{max-width:1200px;width:100%}` + `.diagram-container{overflow-x:auto}` + `svg{width:100%;min-width:760px}` + `viewBox`.
  - **PC**: 프레임 폭까지 유동 확대. **모바일**: `min-width` 아래로는 축소하지 않고 **가로 스크롤**(글자 가독성 우선).
- 이 블로그 기존 규칙(Kroki SVG = `max-width:100%`로 **축소해 한눈에**, 스크롤 없음)과 **철학이 반대**. 채택 시 둘 중 하나로 통일 필요.
  - 축소-투-핏 원하면: 넣을 때 `min-width` 빼고 `max-width:100%`만. (넓은 그림은 모바일 글자 작아짐)
  - 복잡해 줄이면 못 읽는 그림은: diagram-design 방식(가로 스크롤)이 유리.

## 잠정 결론 / 남은 검증
- **활용 가능**: 인라인 SVG로 문제없이 삽입 가능, 모바일·PC 모두 안 깨짐(공통 래퍼가 clip/overflow 방지). 한 샘플로 확인됨.
- **추후 검증 과제**: ① 실제 스킬을 설치·실행해 **대표 타입 몇 개의 실제 출력**으로 교차 확인, ② 반응형 정책(축소 vs 가로 스크롤)을 블로그 규칙으로 확정, ③ diagram-static/archify와 **역할 분담**(언제 diagram-design을 쓸지) 정리.
