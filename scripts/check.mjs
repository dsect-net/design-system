#!/usr/bin/env node
// DSECT design system — verification.
//
// The principles in README.md are claims; this script measures them. Zero
// dependencies, no build step: `node scripts/check.mjs` (or `npm run check`).
//
// Exit codes follow the Quantum CLI contract: 0 ok · 1 warn · 2 error.
//   --verbose   print the full contrast matrix, not just failures

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const VERBOSE = process.argv.includes('--verbose');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

const errors = [];
const warnings = [];
const passed = [];
const err = (area, msg) => errors.push(`${area}: ${msg}`);
const warn = (area, msg) => warnings.push(`${area}: ${msg}`);
const ok = (area, msg) => passed.push(`${area}: ${msg}`);

// ---------------------------------------------------------------- inputs
const STYLESHEETS = ['base.css', 'components.css', 'untitled/dsect-theme.css'];
const previews = readdirSync(join(ROOT, 'previews')).filter((f) => f.endsWith('.html')).sort();
// pages a preview embeds (e.g. the app shell in an iframe): checked for tokens and links, not gallery cards
const embedded = existsSync(join(ROOT, 'previews', 'app'))
  ? readdirSync(join(ROOT, 'previews', 'app')).filter((f) => f.endsWith('.html')).map((f) => `previews/app/${f}`)
  : [];
const templates = existsSync(join(ROOT, 'templates'))
  ? readdirSync(join(ROOT, 'templates')).filter((f) => f.endsWith('.html')).map((f) => `templates/${f}`)
  : [];
const HTML = ['index.html', ...previews.map((f) => `previews/${f}`), ...embedded, ...templates];

// ---------------------------------------------------------------- tokens.css
// Blocks are flat (no nesting, no @media), so a single-level parse is exact.
function parseBlocks(css) {
  const blocks = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(stripComments(css)))) {
    const decls = {};
    for (const d of m[2].split(';')) {
      const i = d.indexOf(':');
      if (i > 0) decls[d.slice(0, i).trim()] = d.slice(i + 1).trim();
    }
    blocks.push({ selector: m[1].trim(), decls });
  }
  return blocks;
}
const tokenBlocks = parseBlocks(read('tokens.css'));
// The DEFAULT theme's block is the one that also matches a bare :root
// (":root,:root[data-theme=…]"); the other theme's block only overrides it.
const themeBlocks = tokenBlocks.filter((b) => /\[data-theme="(light|dark)"\]/.test(b.selector));
const baseBlock = themeBlocks.find((b) => b.selector.split(',').some((s) => s.trim() === ':root'));
const overBlock = themeBlocks.find((b) => b !== baseBlock);
const scaleBlock = tokenBlocks.find((b) => b.selector === ':root');
if (!baseBlock || !overBlock || !scaleBlock) {
  err('tokens', 'expected a default theme block (:root,:root[data-theme=…]), the other theme\'s block, and a theme-invariant :root block');
}
const DEFAULT_THEME = /data-theme="(\w+)"/.exec(baseBlock?.selector ?? '')?.[1] ?? '?';
const onlyTokens = (decls) => Object.fromEntries(Object.entries(decls).filter(([k]) => k.startsWith('--')));
const base = { ...onlyTokens(scaleBlock?.decls ?? {}), ...onlyTokens(baseBlock?.decls ?? {}) };
const over = { ...base, ...onlyTokens(overBlock?.decls ?? {}) };
const light = DEFAULT_THEME === 'light' ? base : over;
const dark = DEFAULT_THEME === 'light' ? over : base;
const DECLARED = new Set(Object.keys(dark));

// ---------------------------------------------------------------- 1. every var() resolves
// A reference resolves if tokens.css declares it, the same file declares it
// (component-scoped props such as --state, --avatar), or it carries a fallback.
{
  let refs = 0;
  const unresolved = new Map();
  const files = [...STYLESHEETS, ...HTML];
  for (const f of files) {
    const src = read(f);
    const local = new Set([
      ...[...src.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]),
      ...[...src.matchAll(/setProperty\(\s*['"](--[\w-]+)/g)].map((m) => m[1]),
    ]);
    for (const m of src.matchAll(/var\(\s*(--[\w-]+)\s*(,)?/g)) {
      const [, name, fallback] = m;
      if (name.endsWith('-')) continue; // built at runtime, e.g. 'var(--space-' + n + ')'
      refs++;
      if (DECLARED.has(name) || local.has(name) || fallback) continue;
      unresolved.set(`${f} → ${name}`, true);
    }
  }
  for (const k of unresolved.keys()) err('tokens', `unresolved ${k}`);
  if (!unresolved.size) ok('tokens', `${DECLARED.size} declared; ${refs} var() references across ${files.length} files all resolve`);
}

// ---------------------------------------------------------------- 2. no literals outside tokens.css
{
  const LITERAL = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/;
  let n = 0;
  for (const f of STYLESHEETS) {
    for (const { selector, decls } of parseBlocks(read(f))) {
      for (const [prop, value] of Object.entries(decls)) {
        n++;
        if (LITERAL.test(value)) err('literals', `${f} ${selector.split('\n').pop().trim()} { ${prop}: ${value} }`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith('literals'))) ok('literals', `${n} declarations in ${STYLESHEETS.join(', ')} — no colour literals; tokens only`);
}

// ---------------------------------------------------------------- 3. theme parity
// A colour token in the default theme's block must be restated in the other
// theme's block, or that theme silently inherits the default's colour.
{
  const COLOURISH = /#[0-9a-fA-F]{3,8}\b|rgba?\(/;
  const overOwn = new Set(Object.keys(onlyTokens(overBlock?.decls ?? {})));
  const baseOwn = onlyTokens(baseBlock?.decls ?? {});
  const other = DEFAULT_THEME === 'light' ? 'dark' : 'light';
  const missing = Object.entries(baseOwn).filter(([k, v]) => COLOURISH.test(v) && !overOwn.has(k)).map(([k]) => k);
  for (const k of missing) err('parity', `${k} has a ${DEFAULT_THEME} colour but no ${other} value`);
  const extra = [...overOwn].filter((k) => !(k in baseOwn));
  for (const k of extra) err('parity', `${k} exists only in the ${other} theme`);
  if (!missing.length && !extra.length) ok('parity', `default theme is ${DEFAULT_THEME}; every colour token has a ${other} counterpart (${overOwn.size} ${other} tokens)`);
}

// ---------------------------------------------------------------- 4. contrast (WCAG 2.x)
{
  const resolveToken = (t, v, depth = 0) => {
    const m = /^var\((--[\w-]+)\)$/.exec(v ?? '');
    return m && depth < 8 ? resolveToken(t, t[m[1]], depth + 1) : v;
  };
  const hex = (t, name) => {
    const v = resolveToken(t, t[name]);
    return /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(v ?? '') ? v : null;
  };
  const lum = (h) => {
    let s = h.slice(1);
    if (s.length === 3) s = [...s].map((c) => c + c).join('');
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

  // text on the four surfaces text actually sits on
  const TEXT = ['--fg', '--fg-2', '--fg-3', '--fg-4', '--fg-5', '--emerald', '--amber', '--red', '--slate', '--accent', '--division-labs'];
  const TEXT_SURFACES = ['--bg', '--bg-2', '--surface', '--bg-3'];
  // non-text marks (focus ring, the decorative //, division swatches): 3:1
  const MARKS = ['--focus-ring', '--wordmark-cut', '--division-labs', '--division-systems', '--division-software'];
  const MARK_SURFACES = ['--bg', '--bg-2', '--surface'];
  const PAIRS = [['--ink-btn-fg', '--ink-btn-bg', 4.5], ['--ink-btn-fg', '--ink-btn-hover', 4.5]];

  let checked = 0;
  let worst = { r: Infinity };
  for (const [theme, t] of [['dark', dark], ['light', light]]) {
    const run = (fg, bg, min) => {
      const a = hex(t, fg), b = hex(t, bg);
      if (!a || !b) return;
      const r = ratio(a, b);
      checked++;
      if (r < worst.r) worst = { r, desc: `${theme} ${fg} on ${bg}` };
      const line = `${theme.padEnd(5)} ${fg.padEnd(18)} on ${bg.padEnd(16)} ${r.toFixed(2)}:1 (min ${min})`;
      if (r < min) err('contrast', line);
      else if (VERBOSE) passed.push(`contrast: ${line}`);
    };
    for (const fg of TEXT) for (const bg of TEXT_SURFACES) run(fg, bg, 4.5);
    for (const fg of MARKS) for (const bg of MARK_SURFACES) run(fg, bg, 3);
    for (const [fg, bg, min] of PAIRS) run(fg, bg, min);
  }
  if (!errors.some((e) => e.startsWith('contrast'))) ok('contrast', `${checked} pairs meet WCAG AA (text 4.5:1, marks 3:1); tightest ${worst.r.toFixed(2)}:1 — ${worst.desc}`);
}

// ---------------------------------------------------------------- 5. fonts
{
  const fontsCss = read('fonts.css');
  const urls = [...fontsCss.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1].replace(/['"]/g, ''));
  for (const u of urls) if (!existsSync(join(ROOT, u))) err('fonts', `fonts.css points at missing ${u}`);
  const files = readdirSync(join(ROOT, 'fonts'));
  for (const f of files.filter((x) => x.endsWith('.woff2'))) if (!urls.includes(`fonts/${f}`)) warn('fonts', `fonts/${f} is never loaded`);
  for (const lic of ['OFL-Inter.txt', 'OFL-JetBrainsMono.txt']) if (!files.includes(lic)) err('fonts', `missing licence fonts/${lic} (OFL requires it to ship with the fonts)`);
  if (!/font-weight:\s*\d+\s+\d+/.test(fontsCss)) err('fonts', 'faces should declare a weight RANGE for the variable files');
  if (!errors.some((e) => e.startsWith('fonts'))) ok('fonts', `${urls.length} faces, all files present, OFL licences shipped`);
}

// ---------------------------------------------------------------- 6. pages: links, cards, gallery
{
  const GROUPS = ['Foundations', 'Brand', 'Components', 'Patterns'];
  let links = 0;
  for (const f of HTML) {
    const src = read(f);
    for (const m of src.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const u = m[1];
      if (/^(#|https?:|mailto:|data:|javascript:)/.test(u) || u === './') continue;
      links++;
      if (!existsSync(join(ROOT, dirname(f), u.split(/[?#]/)[0]))) err('links', `${f} → ${u} does not exist`);
    }
    if (/^previews\/[^/]+\.html$/.test(f)) {
      const card = /^<!-- @dsCard group="([^"]+)" -->/.exec(src);
      if (!card) err('previews', `${f} must open with <!-- @dsCard group="…" -->`);
      else if (!GROUPS.includes(card[1])) err('previews', `${f} has unknown group "${card[1]}" (use ${GROUPS.join(', ')})`);
      for (const sheet of ['fonts.css', 'tokens.css', 'base.css']) if (!src.includes(`../${sheet}`)) err('previews', `${f} does not load ../${sheet}`);
    }
  }
  const index = read('index.html');
  for (const p of previews) if (!index.includes(`previews/${p}`)) warn('gallery', `index.html does not link previews/${p}`);
  if (!errors.some((e) => /^(links|previews)/.test(e))) ok('pages', `${HTML.length} pages, ${links} local links resolve, every preview carries a @dsCard group`);
}

// ---------------------------------------------------------------- 7. ADR-012: the // is visual only
// Every wordmark cut must be hidden from assistive tech, so the name read,
// indexed and copied is always "DSECT".
{
  const sources = [...HTML];
  const reactDir = join(ROOT, 'react', 'src');
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
  if (existsSync(reactDir)) sources.push(...walk(reactDir).filter((p) => p.endsWith('.tsx')).map((p) => relative(ROOT, p)));
  let cuts = 0;
  for (const f of sources) {
    for (const m of read(f).matchAll(/<[^<>]*class(?:Name)?="wordmark__cut"[^<>]*>/g)) {
      cuts++;
      if (!/aria-hidden(="true"|=\{true\})?[\s>/]/.test(m[0])) err('ADR-012', `${f}: wordmark__cut without aria-hidden — ${m[0]}`);
    }
  }
  if (!errors.some((e) => e.startsWith('ADR-012'))) ok('ADR-012', `${cuts} wordmark cuts, all aria-hidden — the name read aloud is always "DSECT"`);
}

// ---------------------------------------------------------------- 8. the Untitled UI bridge
// untitled/dsect-theme.css may only POINT at DSECT tokens, and must never
// redefine one: --radius-lg is the same property name in tokens.css and in
// Tailwind, and a bridge that "flattened" it would silently reshape every card.
if (existsSync(join(ROOT, 'untitled', 'dsect-theme.css'))) {
  const bridge = stripComments(read('untitled/dsect-theme.css'));
  const used = [...new Set([...bridge.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]))];
  const defined = [...new Set([...bridge.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]))];
  for (const u of used) if (!DECLARED.has(u)) err('bridge', `untitled/dsect-theme.css reads ${u}, which tokens.css does not declare`);
  for (const d of defined) if (DECLARED.has(d)) err('bridge', `untitled/dsect-theme.css redefines DSECT token ${d}`);
  if (!errors.some((e) => e.startsWith('bridge'))) ok('bridge', `maps ${defined.length} Untitled UI tokens onto ${used.length} DSECT tokens; redefines none of DSECT's`);
}

// ---------------------------------------------------------------- report
for (const p of passed) console.log(`✓ ${p}`);
for (const w of warnings) console.log(`! ${w}`);
for (const e of errors) console.log(`✗ ${e}`);
const code = errors.length ? 2 : warnings.length ? 1 : 0;
console.log(`\nexit ${code} · ${['ok', 'warn', 'error'][code]} — ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(code);
