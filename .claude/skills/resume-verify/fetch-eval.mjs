// 로그인된 실제 Chrome(원격 디버깅 9222)에 attach해, 인자로 준 Rezumi 평가 URL들의
// 화면 텍스트를 /tmp/eval1.txt, eval2.txt ... 로 저장한다.
// 사용: node .claude/skills/resume-verify/fetch-eval.mjs <url1> [url2 ...]
// 사전: open -na "Google Chrome" --args --remote-debugging-port=9222 --user-data-dir="$HOME/.cache/rezumi-chrome"
import fs from 'node:fs';
import {chromium} from 'playwright';

const CDP = process.env.CDP || 'http://localhost:9222';
const urls = process.argv.slice(2);
if (!urls.length) { console.error('URL 인자가 필요합니다.'); process.exit(1); }

const browser = await chromium.connectOverCDP(CDP);
const ctx = browser.contexts()[0] || (await browser.newContext());

for (let i = 0; i < urls.length; i++) {
  const page = await ctx.newPage();
  try {
    await page.goto(urls[i], {waitUntil: 'networkidle', timeout: 60000});
  } catch (_) {}
  // SPA 콘텐츠 로딩 대기(텍스트가 충분히 찰 때까지 최대 25초)
  let text = '';
  for (let t = 0; t < 25; t++) {
    text = await page.evaluate(() => document.body.innerText).catch(() => '');
    if (text && text.length > 600) break;
    await page.waitForTimeout(1000);
  }
  const out = `/tmp/eval${i + 1}.txt`;
  fs.writeFileSync(out, text || '(빈 내용)', 'utf8');
  console.log(`eval${i + 1} (${(text || '').length}자) -> ${out}  [${urls[i]}]`);
  await page.close().catch(() => {});
}
process.exit(0);
