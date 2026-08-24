// 이력서 PDF를 브라우저 없이 렌더해 페이지 배치를 검증하는 하니스.
// 사용: node .claude/skills/resume-verify/render-resume.cjs
// 산출: /tmp/resume-out.pdf  → pdfinfo/pdftotext(poppler)로 페이지수·섹션 개행 확인.
// 전제: ResumePdf.tsx 에 `export const __ResumeDoc = ResumeDoc;` 가 있어야 함(영구 export).
const fs = require('fs');
const path = require('path');
const proj = path.resolve(__dirname, '../../..'); // 저장소 루트(.claude/skills/resume-verify → repo)
const req = (m) => require(path.join(proj, 'node_modules', m));
const ts = req('typescript');

// data.ts, ResumePdf.tsx 를 즉석 트랜스파일 → 커스텀 require 로 로드
const cache = {};
function loadTs(absTs) {
  if (cache[absTs]) return cache[absTs];
  const src = fs.readFileSync(absTs, 'utf8');
  const js = ts.transpileModule(src, {
    compilerOptions: {module: 'CommonJS', target: 'ES2019', jsx: ts.JsxEmit.React, esModuleInterop: true},
  }).outputText;
  const mod = {exports: {}};
  cache[absTs] = mod.exports;
  const localRequire = (name) => {
    if (name === 'react') return req('react');
    if (name === '@react-pdf/renderer') return req('@react-pdf/renderer');
    if (name.startsWith('./data')) return loadTs(path.join(path.dirname(absTs), 'data.ts'));
    return require(name);
  };
  new Function('exports', 'require', 'module', js)(mod.exports, localRequire, mod);
  return mod.exports;
}

const React = req('react');
const {Font, renderToFile} = req('@react-pdf/renderer');

// 웹 경로(/fonts/..)를 로컬 파일로 바꿔서 등록되도록 register 를 감싼다
const origRegister = Font.register.bind(Font);
const fix = (src) => (typeof src === 'string' ? src.replace(/^\/fonts\//, proj + '/static/fonts/') : src);
Font.register = (opts) => {
  if (opts && Array.isArray(opts.fonts)) opts = {...opts, fonts: opts.fonts.map((f) => ({...f, src: fix(f.src)}))};
  else if (opts && opts.src) opts = {...opts, src: fix(opts.src)};
  return origRegister(opts);
};

const pdfMod = loadTs(path.join(proj, 'src/components/resume/ResumePdf.tsx'));
if (!pdfMod.__ResumeDoc) {
  console.error('ERR: ResumePdf.tsx 에 `export const __ResumeDoc = ResumeDoc;` 가 필요합니다.');
  process.exit(1);
}

renderToFile(React.createElement(pdfMod.__ResumeDoc), '/tmp/resume-out.pdf')
  .then(() => console.log('OK -> /tmp/resume-out.pdf'))
  .catch((e) => { console.error('ERR', e); process.exit(1); });
