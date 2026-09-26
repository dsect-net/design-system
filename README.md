# DSECT — Design System

Extracted verbatim from `hub.dsect.net` (the DSECT Hub frontend) on 2026-09-20, then extended on
2026-09-25. The extension added the brand layer ratified in ADR-012, built components for tokens that had been
defined but never used, and added a check that measures the principles below instead of asserting them.
This is the UI system that actually ships: tokens, type, components. It is not a redesign or a proposal.

**Open `index.html`** for the gallery: every foundation, component and pattern, theme-toggleable.

## Files

- `tokens.css` — the single source of truth for colour, radius, shadow, font family and safe-area
  tokens. Dark and light themes are both defined, and dark is the estate's home theme. Also here: `color-scheme` (so native
  controls match the theme), the division accents from the Brand Architecture, `--wordmark-cut`, and one
  theme-invariant block for the 4px spacing scale, motion, z-index, the 44px touch floor and the focus ring.
  Every page links this one file and redeclares nothing.
- `fonts.css` + `fonts/` — self-hosted Inter and JetBrains Mono, latin + latin-ext. Both are **variable
  fonts** declared as weight ranges (Inter `wght` 100–900 with an automatic optical-size axis; JetBrains Mono
  400–800), so any weight renders as itself. OFL licences ship alongside. Self-hosted deliberately: the hub
  is the page you open when the network is questionable, and it shouldn't need `fonts.gstatic.com` to render.
- `base.css` — typography scale, layout/container, buttons, cards/panels, forms, links, code/kbd, and the
  two-tier masthead. Generalized from the hub's page-level styles into reusable primitives.
- `components.css` — the shared component library. The original set: badges, empty states, toasts, loading
  indicators, tables, filter bars, progress steps, sidenav. Added 2026-09-25: **state indicator**, **key-value
  list**, **metric / meter / bars / uptime strip**, **terminal + exit chip**, **tabs**, **dialogs** (modal,
  drawer, command palette on native `<dialog>`), **stamp**, **record rows** (goals and ADRs with a lifecycle),
  **avatar + agent card**, the **brand layer** (wordmark treatment, division tags, the cut rule), and, added
  2026-09-26, the **app shell** for the hub as an installed phone app (app bar, bottom tab bar, bottom sheet,
  safe areas, `display-mode: standalone`). Patterns
  are adapted from Untitled UI's anatomy, rebuilt in this estate's idiom: flat rounded rectangles instead of
  pills, mono microtype, hairline borders, tokens only.
- `brand/` — the name rules for implementers, slots for the logo artwork, and the archived superseded mark.
- `untitled/` — `dsect-theme.css`, the bridge that re-themes Untitled UI React onto these tokens (for TRELLIS),
  with its set-up, the measured component edits, and what it can't change.
- `docs/proposals/` — decision memos. The first covers React + Untitled UI + the standalone app.
- `previews/` — one HTML file per category, each a self-contained, theme-toggleable showcase, plus two
  composed patterns (`hub.html`, `quantum.html`) built from nothing but system classes.
- `react/` — `@dsect/ui`, typed React wrappers over the same classes. No new visual decisions.
- `scripts/check.mjs` and `scripts/smoke.mjs` — the verification below.
- `templates/` — starter pages (plain page, dashboard, installed app) with the head set up correctly.

Load order:

```html
<link rel="stylesheet" href="fonts.css">
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="base.css">
<link rel="stylesheet" href="components.css">
```

## Check

`npm run check` (or `node scripts/check.mjs`; zero dependencies, no build step). CI runs it on every pull
request, and also builds `react/` against the CSS.

| Check | Fails when |
|---|---|
| tokens | a `var(--x)` resolves to nothing (no token, no local declaration, no fallback) |
| literals | `base.css` or `components.css` contains a colour literal instead of a token |
| parity | a dark colour token has no light value, or a light token has no dark one |
| contrast | a text token misses WCAG AA 4.5:1 on any text surface, or a mark (focus ring, `//`, division swatch) misses 3:1 — in either theme |
| fonts | `fonts.css` points at a missing file, a face isn't a weight range, or an OFL licence is missing |
| pages | a local link is broken, or a preview lacks its `@dsCard` group |
| ADR-012 | a `.wordmark__cut` is not `aria-hidden` |
| bridge | `untitled/dsect-theme.css` reads a token `tokens.css` doesn't declare, or redefines one it does |

Exit codes follow the Quantum CLI contract: `0` ok · `1` warn · `2` error. `--verbose` prints the full contrast
matrix.

`npm run smoke` (after `npm install`, for Playwright) renders what `check` reads. It loads every page in both themes
at 360, 393 and 1280px and fails on a console error, on sideways scroll, or on an interactive control whose hit
area is under 44 × 44px on a touch phone. CI runs it too.

## Design principles (as embodied by the code, not aspirational)

1. **Tokens only, never literals.** No page or component redeclares `--bg`, `--surface`, `--radius` or
   `--max`. Seven inline copies that happen to agree is not a design system. The check enforces it.
2. **Color is never the only signal.** Every badge, toast and status carries its state in the label text too,
   so it survives colour-blindness and a monochrome screenshot. State indicators go further: each of the six
   states also has its own shape, and live states their own motion.
3. **Flat rectangles, not pills.** This is a dense operations dossier, not a marketing site. Pills read as
   consumer UI. Circles mean exactly two things: a person or agent (avatar), and live state (state dot).
   A square swatch means identity (a division).
4. **Mono for data, sans for prose.** JetBrains Mono is reserved for labels, timestamps, stats, code and
   anything a user compares numerically. Inter carries everything else.
5. **44px is the touch-target floor**, enforced on every interactive control regardless of its visible size
   and bumped to 46px under coarse-pointer media. Where a control is drawn smaller (a badge's ×, a sort
   header, a checkbox), a transparent `::before` pads the hit area without changing what you see.
6. **Motion always degrades.** Every animation has a `prefers-reduced-motion` fallback, and a working
   indicator never just freezes, because freezing reads as "hung", not "done". Under reduced motion, spinners
   and indeterminate bars swap movement for a slow opacity breath.
7. **One mobile nav.** The sidenav does not render below 760px; the app shell owns mobile navigation (the
   composed hub page shows it as a drawer) so there is never a second, competing nav.
8. **The name is DSECT.** `DSECT//` is how it looks, never how it is written (ADR-012). The `//` is always
   `aria-hidden`.

## Brand

ADR-012 was ratified on 2026-09-23. The official name is **DSECT** in all text, and **DSECT//** is the visual
treatment for logo and branding only. The tagline is *Decompose. Then build.* The typographic treatment
(`.wordmark` + `.wordmark__cut`), division accents, and the cut rule are in the system. The logo artwork is
not: since 2026-09-24 it is image-generated from the chosen splash direction and dropped into `brand/`. The
hexagon mark that used to sit at the repo root belonged to the superseded `D//SECT` pack and now lives in
`brand/archive/`. See `brand/README.md`.

## Contributing

`CONTRIBUTING.md` covers set-up, adding tokens and components, and the rules. Agents: `AGENTS.md` (Claude Code
loads it through `CLAUDE.md`). Starter pages for apps are in `templates/`.

## Licence

Code: Apache-2.0 (`LICENSE`). Documentation: CC BY 4.0 (`LICENSE-docs`). Fonts: SIL Open Font License 1.1
(`fonts/OFL-*.txt`).
