// Rezumi 피드백 수집 — "사용자가 직접 띄운 실제 Chrome"에 attach 하는 방식.
// 자동화 도구가 브라우저를 launch하지 않고 connectOverCDP로 붙기만 하므로 navigator.webdriver 가 없어
// 구글 OAuth 로그인이 정상 동작한다(자동 launch 방식은 구글이 차단함).
//
// [사전 준비] Chrome를 원격 디버깅 포트로 직접 실행(기존 Chrome와 별도 프로필):
//   open -na "Google Chrome" --args --remote-debugging-port=9222 --user-data-dir="$HOME/.cache/rezumi-chrome"
//   → 그 창에서 구글 로그인 → rezumi.kr 로그인 → 이력서 PDF 업로드 → 분석
//
// [실행] node .claude/skills/resume-verify/run-cdp.mjs
//   → 3초마다 rezumi 탭 내용을 ~/.cache/rezumi-helper/feedback.txt(+feedback.png)로 저장.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {chromium} from 'playwright';

const CDP = process.env.CDP || 'http://localhost:9222';
const DIR = path.join(os.homedir(), '.cache', 'rezumi-helper');
fs.mkdirSync(DIR, {recursive: true});
const OUT = path.join(DIR, 'feedback.txt');
const SHOT = path.join(DIR, 'feedback.png');

let browser;
try {
  browser = await chromium.connectOverCDP(CDP);
} catch (e) {
  console.error(`\n✖ Chrome(${CDP})에 연결 실패. 아래로 Chrome를 먼저 실행하세요:`);
  console.error('  open -na "Google Chrome" --args --remote-debugging-port=9222 --user-data-dir="$HOME/.cache/rezumi-chrome"\n');
  process.exit(1);
}

const ctx = browser.contexts()[0] || (await browser.newContext());
const rezumiPage = () => ctx.pages().find((p) => p.url().includes('rezumi.kr'));
let page = rezumiPage();
if (!page) {
  page = await ctx.newPage();
  await page.goto('https://rezumi.kr/', {waitUntil: 'domcontentloaded'}).catch(() => {});
}
await page.bringToFront().catch(() => {});

let lastLen = 0;
const capture = async () => {
  try {
    const p = rezumiPage() || page;
    const text = await p.evaluate(() => document.body.innerText).catch(() => null);
    if (text && text.length > 40) {
      fs.writeFileSync(OUT, text, 'utf8');
      if (text.length !== lastLen) {
        lastLen = text.length;
        console.log(`· 갱신 (${text.length}자) → ${OUT}`);
      }
      try { await p.screenshot({path: SHOT, fullPage: true}); } catch (_) {}
    }
  } catch (_) {}
};

console.log('\n✔ 실제 Chrome에 연결됨.');
console.log('  그 창에서 로그인·이력서 업로드·분석을 마치세요.');
console.log('  rezumi 탭 내용이 3초마다 자동 저장됩니다:', OUT);
console.log('  (완료되면 대화창에 "피드백 반영해줘" 라고 하면 됩니다)\n');

const iv = setInterval(capture, 3000);
capture();
browser.on('disconnected', () => { clearInterval(iv); process.exit(0); });
