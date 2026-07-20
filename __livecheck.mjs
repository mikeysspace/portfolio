import puppeteer from "puppeteer-core";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = "https://mikeysspace.github.io/portfolio/projects/handlebar-mount";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failed = 0;
const ok = (l, c, x = "") => { console.log(`${c ? "ok  " : "FAIL"}  ${l}${x ? "  " + x : ""}`); if (!c) failed++; };
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true,
  args: ["--no-sandbox","--disable-gpu","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 1100 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 40000 });
  await page.waitForSelector(".stl-canvas canvas", { timeout: 20000 });
  let ready = false;
  for (let i = 0; i < 40; i++) { if (!(await page.$(".stl-overlay"))) { ready = true; break; } await sleep(250); }
  ok("model ready on live site", ready);
  const canvas = await page.$(".stl-canvas canvas");
  const a = await canvas.screenshot(); await sleep(700); const b = await canvas.screenshot();
  ok("canvas not blank", a.length > 3000, `${a.length} B`);
  ok("spinning (frames differ)", Buffer.compare(a, b) !== 0);
} finally { await browser.close(); }
console.log(failed ? `\n${failed} failed` : "\nLive viewer confirmed");
process.exit(failed ? 1 : 0);
