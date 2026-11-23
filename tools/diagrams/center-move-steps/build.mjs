// 센터 간 재고이동 단계별 애니메이션 그림을 만든다.
//   node tools/diagrams/center-move-steps/build.mjs
// 결과: static/diagrams/center-move-steps.html(다크), static/diagrams/center-move-steps-light.html(라이트)
// 입력: template.html(마크업, CSS) + scenes.js(장면, 재생 로직) + vendor/anime.min.js(anime.js 3.2.2, MIT, 인라인)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..', '..');
const outDir = join(root, 'static', 'diagrams');

const TOKENS = {
  light: {
    sheet: '#F7F9F9', ink: '#162028', muted: '#56656E', line: '#CBD5DA', soft: '#EDF2F3',
    scene: '#E9EFF0', wall: '#FBFCFC', stroke: '#33434D', roof: '#D6E0E3',
    box: '#D2A26A', 'box-edge': '#8C6232', vest: '#E8A317',
    ctl: '#16756A', fld: '#3554C2', xl: '#2A7AA0', inv: '#A0650A',
    hot: '#D24F25', 'hot-soft': '#F8DDD2', ok: '#237A3F', 'ok-soft': '#D8EEDF', bad: '#BB3426', 'bad-soft': '#F6DAD6',
    run: '#2F5FBF', 'run-soft': '#DCE5F8',
  },
  dark: {
    sheet: '#141C21', ink: '#E1E9ED', muted: '#93A4AD', line: '#29353C', soft: '#1B252B',
    scene: '#10181D', wall: '#18232A', stroke: '#A7B7BF', roof: '#22303A',
    box: '#B88449', 'box-edge': '#E0B47C', vest: '#D79A2B',
    ctl: '#45BBA8', fld: '#8CA3F6', xl: '#6FC0E6', inv: '#E5A647',
    hot: '#F2774F', 'hot-soft': '#3D2219', ok: '#5CC27A', 'ok-soft': '#173020', bad: '#F07264', 'bad-soft': '#3B1F1C',
    run: '#85A7F2', 'run-soft': '#1C2944',
  },
};

const template = readFileSync(join(here, 'template.html'), 'utf8');
const scenes = readFileSync(join(here, 'scenes.js'), 'utf8');
const anime = readFileSync(join(here, 'vendor', 'anime.min.js'), 'utf8');
if (/<\/script/i.test(anime + scenes)) throw new Error('인라인 스크립트에 </script 가 있다');
if (/https?:\/\//.test(template + scenes)) throw new Error('외부 URL 금지');

mkdirSync(outDir, { recursive: true });
for (const [theme, file] of [['dark', 'center-move-steps.html'], ['light', 'center-move-steps-light.html']]) {
  const tokens = Object.entries(TOKENS[theme]).map(([k, v]) => `  --${k}: ${v};`).join('\n');
  const html = template
    .replace('/*TOKENS*/', () => tokens)
    .replace('/*SCHEME*/', () => theme)
    .replace('/*ANIME*/', () => anime.trim())
    .replace('/*SCENES*/', () => scenes.trim());
  writeFileSync(join(outDir, file), html);
  console.log('wrote', join('static', 'diagrams', file), Math.round(html.length / 1024) + 'KB');
}
