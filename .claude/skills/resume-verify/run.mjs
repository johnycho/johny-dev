// Rezumi(https://rezumi.kr) 이력서 AI 피드백 수집 도우미.
// 실행: node .claude/skills/resume-verify/run.mjs   (헤디드 창이 뜸 — 로그인·업로드는 사용자가 직접)
// 원칙: 비밀번호 등 자격증명을 스크립트가 다루지 않는다(사용자가 창에서 직접 로그인).
// 캡처: 터미널 입력 대신 페이지 우하단에 주입되는 "✅ 피드백 저장" 버튼 클릭으로 저장
//       → ~/.cache/rezumi-helper/feedback.txt(텍스트) + feedback.png(스크린샷). 로그인 세션은 profile/ 에 유지.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {chromium} from 'playwright';

const DIR = path.join(os.homedir(), '.cache', 'rezumi-helper');
fs.mkdirSync(DIR, {recursive: true});
const userDataDir = path.join(DIR, 'profile');
const OUT = path.join(DIR, 'feedback.txt');
const SHOT = path.join(DIR, 'feedback.png');

const ctx = await chromium.launchPersistentContext(userDataDir, {
  headless: false,
  viewport: null,
  args: ['--start-maximized'],
});

// 페이지 → node 로 저장을 트리거하는 바인딩 (모든 프레임에 window.rezumiSave 설치)
await ctx.exposeBinding('rezumiSave', async ({page}) => {
  let text = '';
  try {
    text = await page.evaluate(() => document.body.innerText);
  } catch (e) {
    text = 'ERROR reading page: ' + (e && e.message);
  }
  fs.writeFileSync(OUT, text, 'utf8');
  try {
    await page.screenshot({path: SHOT, fullPage: true});
  } catch (_) {}
  console.log('✔ 저장됨:', OUT);
});

// 우하단 "피드백 저장" 버튼을 주입(SPA 라우팅으로 사라져도 주기적으로 다시 붙임)
const BTN = `(() => {
  const add = () => {
    if (!document.body || document.getElementById('__rezumi_save')) return;
    const b = document.createElement('button');
    b.id = '__rezumi_save';
    b.textContent = '✅ 피드백 저장';
    b.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483647;padding:10px 15px;background:#0e8aa8;color:#fff;border:0;border-radius:999px;font-weight:700;font-size:14px;box-shadow:0 3px 12px rgba(0,0,0,.35);cursor:pointer';
    b.onclick = async () => {
      b.textContent = '저장 중...';
      try { await window.rezumiSave(); b.textContent = '✔ 저장됨'; }
      catch (e) { b.textContent = '오류: ' + e; }
      setTimeout(() => { b.textContent = '✅ 피드백 저장'; }, 1600);
    };
    document.body.appendChild(b);
  };
  add();
  setInterval(add, 1500);
})();`;
await ctx.addInitScript(BTN);

const page = ctx.pages()[0] ?? (await ctx.newPage());
await page.goto('https://rezumi.kr/', {waitUntil: 'domcontentloaded'}).catch(() => {});
// 이미 열린 페이지에도 즉시 주입
for (const p of ctx.pages()) p.evaluate(BTN).catch(() => {});

console.log('\n==================================================');
console.log('  Rezumi 피드백 수집 (비밀번호는 저장/수집하지 않음)');
console.log('--------------------------------------------------');
console.log('  1) 브라우저에서 직접 로그인');
console.log('  2) 이력서 PDF 업로드 + 분석 실행');
console.log('  3) 피드백이 다 나오면 우하단 "✅ 피드백 저장" 클릭');
console.log('     → ~/.cache/rezumi-helper/feedback.txt 저장');
console.log('  (창을 닫으면 종료. 다시 실행해도 로그인 유지)');
console.log('==================================================\n');

await ctx.waitForEvent('close').catch(() => {});
process.exit(0);
