#!/usr/bin/env node
// check-layout.mjs: layout check for touch phones, foldables included.
//
// Opens every page in WebKit as a touch phone (DPR 3) at the iPhone Duo's
// folded and unfolded viewports, portrait and landscape, and fails when
//   - the page scrolls sideways (scrollWidth wider than the viewport), or
//   - a visible link, button or field sits partly off-screen.
// It also folds and unfolds the phone live (outer portrait -> inner landscape
// -> back) with the mobile menu open, since that resizes the page without a
// reload.
//
// Not part of the Vercel build. Run it against a local production server:
//   npm run build && npm start            # in one terminal
//   npm run check:layout                  # in another (or pass a base URL)
//   node scripts/check-layout.mjs https://pouriarouzrokh.com
// First run on a Mac: npx playwright install webkit

import { webkit } from "playwright";

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");

// CSS px of the area Safari leaves to the page (toolbars excluded). The Duo's
// inner screen has two reported sizes (simulator vs Apple's pixels / 3).
const VIEWPORTS = {
  "outer portrait": { width: 466, height: 560 },
  // Without viewport-fit=cover Safari keeps the page out of the 84 pt side
  // camera inset, which may leave it only 382 px.
  "outer portrait (inset)": { width: 382, height: 560 },
  "outer landscape": { width: 678, height: 390 },
  "inner landscape": { width: 951, height: 580 },
  "inner landscape (Apple)": { width: 890, height: 540 },
  "inner portrait": { width: 669, height: 860 },
  "inner portrait (Apple)": { width: 626, height: 800 },
};

const PAGES = ["/", "/research", "/portfolio", "/blog", "/about", "/contact", "/privacy", "/terms", "/no-such-page"];
// List pages whose first detail link is checked too.
const DETAIL_FROM = { "/research": "/research/", "/portfolio": "/portfolio/", "/blog": "/blog/" };

// Runs in the page: returns a list of problems found.
function findProblems() {
  const vw = window.innerWidth;
  const problems = [];
  const sw = document.documentElement.scrollWidth;
  if (sw > vw) problems.push(`scrolls sideways: content is ${sw}px wide in a ${vw}px viewport`);

  // A control is fine when an ancestor clips or scrolls it (a code block, a carousel).
  const clipped = (el) => {
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      if (getComputedStyle(a).overflowX !== "visible") return true;
    }
    return false;
  };
  for (const el of document.querySelectorAll("a[href], button, input, select, textarea")) {
    const box = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    if (box.width === 0 || box.height === 0) continue;
    if (style.visibility === "hidden" || style.pointerEvents === "none") continue;
    if (box.left >= -1 && box.right <= vw + 1) continue;
    if (clipped(el)) continue;
    const label = (el.getAttribute("aria-label") || el.textContent || el.tagName).trim().slice(0, 40);
    problems.push(`control off-screen: "${label}" spans ${Math.round(box.left)}..${Math.round(box.right)}px`);
  }
  return problems;
}

async function settle(page) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800); // entrance animations
}

const failures = [];
const report = (where, problems) => {
  for (const p of problems) failures.push(`${where}: ${p}`);
  console.log(`${problems.length ? "FAIL" : "ok  "} ${where}`);
};

const browser = await webkit.launch();
try {
  const context = await browser.newContext({
    viewport: VIEWPORTS["outer portrait"],
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  // Find one detail page per list.
  const pages = [...PAGES];
  for (const [list, prefix] of Object.entries(DETAIL_FROM)) {
    await page.goto(BASE + list);
    await settle(page);
    const href = await page.evaluate(
      (prefix) => [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")).find((h) => h.startsWith(prefix) && h.length > prefix.length),
      prefix,
    );
    if (href) pages.push(href);
  }

  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    await page.setViewportSize(viewport);
    for (const path of pages) {
      await page.goto(BASE + path);
      await settle(page);
      report(`${name} ${viewport.width}x${viewport.height} ${path}`, await page.evaluate(findProblems));
    }
  }

  // Fold and unfold live with the mobile menu open.
  await page.setViewportSize(VIEWPORTS["outer portrait"]);
  await page.goto(BASE + "/");
  await settle(page);
  await page.getByRole("button", { name: "Toggle menu" }).tap();
  const navLink = page.locator("nav").getByRole("link", { name: "Research", exact: true }).locator("visible=true").first();
  const folding = [];
  await page.setViewportSize(VIEWPORTS["inner landscape"]);
  await page.waitForTimeout(300);
  folding.push(...(await page.evaluate(findProblems)));
  if (!(await navLink.isVisible())) folding.push("desktop links hidden after unfolding");
  await page.setViewportSize(VIEWPORTS["outer portrait"]);
  await page.waitForTimeout(300);
  folding.push(...(await page.evaluate(findProblems)));
  if (await navLink.isVisible()) folding.push("mobile menu reopened by itself after folding back");
  report("live fold: outer portrait -> inner landscape -> outer portrait", folding);
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`\n${failures.length} layout problem(s):\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.log("\nLayout check passed.");
