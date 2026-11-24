// 주문 API의 요청 흐름과 배포 유형 단계별 애니메이션 그림을 만든다.
//   node tools/diagrams/deploy-flow/build.mjs
// 결과: static/diagrams/deploy-flow.html(다크), static/diagrams/deploy-flow-light.html(라이트)
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
    scene: '#E9EFF0', wall: '#FBFCFC', stroke: '#33434D',
    hot: '#D24F25', 'hot-soft': '#F8DDD2',
    v1: '#2F5FBF', 'v1-soft': '#DCE5F8', v2: '#237A3F', 'v2-soft': '#D8EEDF',
    bad: '#BB3426', 'bad-soft': '#F6DAD6', off: '#76848C', 'off-soft': '#E1E7E9', req: '#C27A0E',
  },
  dark: {
    sheet: '#141C21', ink: '#E1E9ED', muted: '#93A4AD', line: '#29353C', soft: '#1B252B',
    scene: '#10181D', wall: '#18232A', stroke: '#A7B7BF',
    hot: '#F2774F', 'hot-soft': '#3D2219',
    v1: '#85A7F2', 'v1-soft': '#1C2944', v2: '#5CC27A', 'v2-soft': '#173020',
    bad: '#F07264', 'bad-soft': '#3B1F1C', off: '#7F909A', 'off-soft': '#212C32', req: '#E5A647',
  },
};

const template = readFileSync(join(here, 'template.html'), 'utf8');
const scenes = readFileSync(join(here, 'scenes.js'), 'utf8');
const anime = readFileSync(join(here, 'vendor', 'anime.min.js'), 'utf8');
if (/<\/script/i.test(anime + scenes)) throw new Error('인라인 스크립트에 </script 가 있다');
if (/https?:\/\//.test(template + scenes)) throw new Error('외부 URL 금지');

mkdirSync(outDir, { recursive: true });
for (const [theme, file] of [['dark', 'deploy-flow.html'], ['light', 'deploy-flow-light.html']]) {
  const tokens = Object.entries(TOKENS[theme]).map(([k, v]) => `  --${k}: ${v};`).join('\n');
  const html = template
    .replace('/*TOKENS*/', () => tokens)
    .replace('/*SCHEME*/', () => theme)
    .replace('/*ANIME*/', () => anime.trim())
    .replace('/*SCENES*/', () => scenes.trim());
  writeFileSync(join(outDir, file), html);
  console.log('wrote', join('static', 'diagrams', file), Math.round(html.length / 1024) + 'KB');
}
