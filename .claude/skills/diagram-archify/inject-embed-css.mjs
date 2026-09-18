#!/usr/bin/env node
// archify가 렌더한 자체완결 HTML에 "블로그 임베드용 CSS"를 주입한다.
// archify로 재렌더하면 이 CSS가 사라지므로, 렌더 직후 반드시 이 스크립트를 한 번 돌린다.
//
// 사용: node .claude/skills/diagram-archify/inject-embed-css.mjs <rendered.html>
// 효과(멱등):
//   - 편집 크롬 숨김: 툴바(Light·Classic·Present·Export)·Guided views·제목·PATH/LENS 패널·diagram-nav(탭+줌)·node-finder
//     (overview-map는 표시하려면 아래 HIDE 목록에서 빼면 됨)
//   - hover 관계 오버레이(화살표 흐름)는 유지(embed=1을 쓰지 않으므로 안 꺼짐)
//   - 뷰포트 채우기(100dvh) 해제 → 내용 자연 높이(부모 ArchifyEmbed가 iframe 높이를 맞춤)
//   - 본문 폭 채우기(SVG width:100%), 내부 패널 박스(테두리·라운드·그림자) 제거(이중 박스 방지)
//   - cards 축소
import {readFileSync, writeFileSync} from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('usage: inject-embed-css.mjs <rendered.html>');
  process.exit(1);
}

const STYLE = `<style id="blog-chrome-hide">
/* 블로그 임베드용: 다이어그램 + cards만, 편집 크롬·컨트롤 숨김. hover 오버레이(화살표 흐름) 유지 */
.toolbar, .guided-views, .header, .node-finder,
.diagram-nav, .route-probe, .overview-map, .semantic-lens, .focus-chip { display: none !important; }
/* 뷰포트 채우기(100dvh) 해제 → 내용 자연 높이. iframe 되먹임 팽창 방지 */
html, body { height: auto !important; min-height: 0 !important; overflow: hidden !important; margin: 0 !important; padding: 0 !important; }
/* body의 flex/grid 세로 중앙정렬 해제 → 위쪽 여백 넓어짐 방지(내용은 위에서 시작) */
body { display: block !important; }
.container { max-width: none !important; width: 100% !important; height: auto !important; min-height: 0 !important; padding: .75rem !important; gap: .5rem !important;
  justify-content: flex-start !important; align-items: stretch !important; }
/* 내부 패널 박스 제거(이중 박스 방지), 배경은 body 테마색 유지. 세로는 위 정렬, 가로는 중앙 */
.diagram-container { flex: 0 0 auto !important; min-height: 0 !important; padding: 0 !important;
  align-items: flex-start !important; justify-content: center !important;
  border: 0 !important; border-radius: 0 !important; background: transparent !important; box-shadow: none !important; }
.diagram-container::before, .diagram-container::after { display: none !important; }
/* 본문 폭 채우기(벡터라 확대해도 선명) */
.diagram-container svg { width: 100% !important; max-width: none !important; height: auto !important; display: block !important; margin: 0 auto; }
/* cards 축소 */
.cards { gap: .5rem !important; margin-top: .5rem !important; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)) !important; }
.card { padding: .55rem .7rem !important; }
.card, .card li, .card p, .card span, .card strong, .card h3 { font-size: 12px !important; line-height: 1.45 !important; }
</style>
</head>`;

let html = readFileSync(file, 'utf8');
if (html.includes('id="blog-chrome-hide"')) {
  console.log('이미 주입됨(멱등) — 변경 없음:', file);
  process.exit(0);
}
if (!html.includes('</head>')) {
  console.error('</head> 를 찾지 못함 — archify HTML이 맞는지 확인:', file);
  process.exit(1);
}
html = html.replace('</head>', STYLE);
writeFileSync(file, html);
console.log('임베드 CSS 주입 완료:', file);
