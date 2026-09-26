#!/usr/bin/env node
// DSECT design system — rendered smoke test.
//
// check.mjs reads the source; this renders it. Every page (index, previews,
// embedded pages, templates) is loaded in Chromium in both themes, and fails on:
//   errors     any console error, uncaught exception or failed request
//   fonts      text set in Inter or JetBrains Mono renders without that face
//              loaded — i.e. the page forgot fonts.css and fell back silently
//              (a missing font FILE already shows up under errors)
//   overflow   the page scrolls sideways at 360, 393 or 1280px
//   touch      an interactive control whose HIT AREA is under 44 × 44px on a
//              phone: 393px wide WITH touch input, so (pointer: coarse) rules
//              apply as they do on a real phone. Not isMobile: that widens the
//              layout viewport to 980px and hides overflow. The probe walks out from the control's centre
//              with elementFromPoint, so a transparent ::before counts — that is
//              the point of it — and so does the control's own <label>.
//
// Exempt from the touch rule, as in WCAG 2.5.8: links inside a sentence, and
// anything marked data-touch-exempt="<reason>" (the reason is printed).
//
// Needs Playwright (npm install). Exit codes follow the Quantum CLI contract:
// 0 ok · 2 error.   --only <substring> limits the pages; --verbose lists passes.

import { chromium } from 'playwright';
import { readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const VERBOSE = args.includes('--verbose');
const TAP = 44;

const html = (dir) => (existsSync(join(ROOT, dir)) ? readdirSync(join(ROOT, dir)).filter((f) => f.endsWith('.html')).sort().map((f) => `${dir}/${f}`) : []);
const PAGES = ['index.html', ...html('previews'), ...html('previews/app'), ...html('templates')].filter((p) => !only || p.includes(only));

const failures = [];
const fail = (page, kind, msg) => failures.push(`${kind.padEnd(8)} ${page}: ${msg}`);

const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {});
let loads = 0;
let probed = 0;

for (const page of PAGES) {
  for (const theme of ['dark', 'light']) {
    for (const width of [360, 393, 1280]) {
      // phones have touch (coarse pointer); the desktop width has a mouse
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: width < 760 });
      const p = await ctx.newPage();
      const errs = [];
      p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
      p.on('pageerror', (e) => errs.push(e.message));
      p.on('requestfailed', (r) => errs.push(`request failed: ${r.url()}`));
      await p.goto(pathToFileURL(join(ROOT, page)).href);
      await p.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      await p.evaluate(() => document.fonts.ready);
      loads++;
      const where = `${theme} ${width}`;
      for (const e of new Set(errs)) fail(page, 'errors', `[${where}] ${e}`);

      if (width === 1280) {
        const unloaded = await p.evaluate(() => {
          const SYSTEM = ['Inter', 'JetBrains Mono'];
          const used = new Set();
          for (const el of document.querySelectorAll('body *')) {
            if (el.closest('dialog:not([open]), [hidden]')) continue;
            if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
            const cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden') continue;
            used.add(cs.fontFamily.split(',')[0].trim().replace(/["']/g, ''));
          }
          const loaded = new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/["']/g, '')));
          return [...used].filter((f) => SYSTEM.includes(f) && !loaded.has(f));
        });
        for (const f of unloaded) fail(page, 'fonts', `[${theme}] text is set in ${f}, but no ${f} face loaded (is fonts.css linked?)`);
      }

      const over = await p.evaluate(() => {
        const vw = innerWidth;
        if (document.documentElement.scrollWidth <= vw) return null;
        const culprits = [...document.querySelectorAll('body *')].filter((el) => {
          const r = el.getBoundingClientRect();
          if (r.right <= vw + 0.5 || !r.width) return false;
          for (let a = el.parentElement; a; a = a.parentElement) {
            if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(a).overflowX) && a.getBoundingClientRect().right <= vw + 0.5) return false;
          }
          return true;
        });
        const d = culprits.find((el) => !culprits.includes(el.parentElement)) || culprits[0];
        return { sw: document.documentElement.scrollWidth, el: d ? `${d.tagName.toLowerCase()}${d.className ? '.' + String(d.className).trim().split(/\s+/).join('.') : ''}` : '?' };
      });
      if (over) fail(page, 'overflow', `[${where}] scrollWidth ${over.sw} > ${width} — first culprit ${over.el}`);

      if (width === 393 && theme === 'dark') {
        const small = await p.evaluate((TAP) => {
          const SEL = 'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="tab"], [role="option"]';
          const out = [];
          let n = 0;
          const visible = (el) => {
            if (el.closest('dialog:not([open]), [hidden], [aria-hidden="true"]')) return false;
            const cs = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return cs.visibility !== 'hidden' && cs.display !== 'none' && r.width > 0 && r.height > 0;
          };
          const inline = (el) => el.tagName === 'A' && el.parentElement &&
            [...el.parentElement.childNodes].some((c) => c !== el && c.nodeType === 3 && c.textContent.trim());
          for (const el of document.querySelectorAll(SEL)) {
            if (!visible(el) || el.disabled || inline(el) || el.closest('[data-touch-exempt]')) continue;
            el.scrollIntoView({ block: 'center', inline: 'center' });
            const r = el.getBoundingClientRect();
            const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
            const own = (t) => t && (t === el || el.contains(t) || [...(el.labels || [])].some((l) => l.contains(t)));
            if (!own(document.elementFromPoint(cx, cy))) continue; // covered by an overlay here; not measurable
            const reach = (dx, dy) => { let d = 0; while (d < 80 && own(document.elementFromPoint(cx + dx * (d + 1), cy + dy * (d + 1)))) d++; return d; };
            const w = reach(-1, 0) + reach(1, 0) + 1, h = reach(0, -1) + reach(0, 1) + 1;
            n++;
            if (w < TAP || h < TAP) {
              const name = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('placeholder') || el.id || '').trim().replace(/\s+/g, ' ').slice(0, 28);
              out.push(`${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : ''} "${name}" hit ${w}×${h}`);
            }
          }
          return { n, out };
        }, TAP);
        probed += small.n;
        for (const s of small.out) fail(page, 'touch', s);
        if (VERBOSE) console.log(`  ${page}: ${small.n} controls probed`);
      }
      await ctx.close();
    }
  }
}
await browser.close();

if (failures.length) {
  for (const f of failures) console.log(`✗ ${f}`);
  console.log(`\nexit 2 · error — ${failures.length} failure(s) across ${PAGES.length} pages (${loads} loads, ${probed} controls probed)`);
  process.exit(2);
}
console.log(`✓ ${PAGES.length} pages × 2 themes × 3 widths (${loads} loads): no errors, system fonts loaded, no sideways scroll; ${probed} controls meet the 44px hit area at 393px`);
console.log('\nexit 0 · ok');
