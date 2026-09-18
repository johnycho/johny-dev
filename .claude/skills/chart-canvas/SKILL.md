# 애니메이션 차트 스킬 (Canvas 컴포넌트)

**시간에 따른 값·패턴** 처럼 "움직임이 의미 있는" 시각화를 직접 만든 **Canvas 애니메이션 컴포넌트**로 넣는다. 지표 추이(메모리 톱니/계단, 트래픽 곡선), 분포(응답시간 꼬리), 두 지표의 상관(캐시 히트율↓+DB 부하↑), 큐 발산 등. 정적 그림보다 이해를 돕는다. 형식은 [../../wiki/blog-authoring.md](../../wiki/blog-authoring.md) 4절 참고.

> 방식 선택: 구조/시퀀스/상태 등 정적 다이어그램은 [diagram-static](../diagram-static/SKILL.md), 인터랙티브 구조 탐색은 [diagram-archify](../diagram-archify/SKILL.md). "지표·추이·분포·상관·발산"만 이 스킬.

## 컴포넌트 — `src/components/blog/MonitorCharts.tsx`

MDX 상단에서 import 후 사용(Docusaurus가 `@site` alias 제공):

```mdx
import {AnimatedLineChart, AnimatedBars} from '@site/src/components/blog/MonitorCharts';

<AnimatedLineChart title="힙 사용량" data={[30,45,40,60,55,80]} yMax={100} unit="%" trend />
```

- **`AnimatedLineChart`** — 추이·상관·분포. 주요 props: `data:number[]`(필수), `data2?`(두 번째 선), `yMax`, `unit`, `yLabel`, `xLabel`(기본 `시간 →`), `tone`/`tone2`(색 톤), `trend`, `step`(계단형), `legend`, `marker`+`markerLabel`(임계점 표시), `height`(기본 190).
- **`AnimatedBars`** — 막대 비교. props: `data:number[]`, `labels:(string|number)[]`, `yMax`(필수), `unit`, `yLabel`, `xLabel`, `tone`, `height`.
- 색은 `tone`(테마 팔레트 자동 — 다크/라이트 대응)을 쓰고, 직접 색이 필요하면 `color`/`color2`.

그 외 개념 전용 커스텀 컴포넌트도 같은 폴더에 있다: `RetainedHeapDiagram`(힙 참조), `MatMockup`(MAT UI 목업). 새 개념이 필요하면 **같은 폴더에 새 Canvas 컴포넌트를 추가**한다(팔레트 헬퍼 `palette()`·`useCanvas()` 재사용).

## 원칙
- **애니메이션은 부드럽게** — 정점 사이 보간 + easing.
- **과용 금물** — 정적 표·[diagram-static](../diagram-static/SKILL.md)으로 충분한 곳엔 쓰지 않는다.
- 다크/라이트 모두에서 대비가 유지되는지 확인(`tone` 팔레트 사용 시 자동).

## 검증
- `npm run build` 렌더 확인(SSR — 컴포넌트는 `useCanvas`로 클라이언트에서 그림). 작성·수정 후 [blog-review](../blog-review/SKILL.md).
