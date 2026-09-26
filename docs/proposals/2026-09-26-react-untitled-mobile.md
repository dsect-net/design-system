# React, Untitled UI and the standalone app — exploration

**Date:** 2026-09-26 · **Feeds:** HUB-015 TRELLIS, Phase 0 · **Status:** proposal; the decisions at the end are
the founder's.

TRELLIS asks whether the hub moves to `@dsect/ui` (hand-written React over this repo's CSS), to Untitled UI
React re-themed for DSECT, or to a combination. It also asks whether the result can serve DSECT's web and mobile
apps. This note answers from the design-system side, with a working spike and measured numbers rather than
opinion.

## Recommendation: combine them, in three layers

1. **Tokens.** `tokens.css` is the only place a value is declared, for every consumer: plain-CSS pages,
   `@dsect/ui`, Untitled UI, and later the native apps.
2. **Bridge.** `untitled/dsect-theme.css` maps Untitled's semantic tokens onto DSECT's (see `untitled/README.md`).
   It reads only DSECT tokens and redefines none of them; `scripts/check.mjs` enforces both.
3. **One component API.** Apps import `@dsect/ui`. Behind it:
   - **DSECT-specific and presentational pieces stay hand-written** over this repo's classes: badge, state
     indicator, metric/meter/bars/uptime, terminal, record rows, agent card, wordmark, app shell. They are the
     DSECT look, and Untitled has no equivalent or a mismatched one (its badges are sans, sentence-case pills).
   - **Hard interactive widgets come from Untitled UI / React Aria.** That means Select and ComboBox, Menu,
     Tooltip, DatePicker and Popover. They are re-themed by the bridge, carry the component edits below, and are
     wrapped with DSECT defaults: `lg` size (44px), no pill types.

**Why.** React Aria's keyboard and screen-reader behaviour for comboboxes, menus and popovers is the part
hand-written components get wrong most often, and it is exactly what the hub keeps re-implementing. Meanwhile the
things that make DSECT look like DSECT stay DSECT's. App authors see one API either way.

**Costs, stated plainly.** Any app using the Untitled half takes Tailwind v4 as a build dependency. CSS layers
become mandatory in those apps. The kit has two styling idioms inside it (classes and utilities), hidden behind
one API.

**Alternatives.** *`@dsect/ui` only* has zero dependencies, but every complex widget stays hand-rolled, which is
the hub's current pain. *Untitled only* gives the fastest breadth, but DSECT's own components would still be
custom, and the look drifts to Untitled's defaults: pills, sans badges, 36px controls.

## Evidence: the spike

Untitled UI React's real components (Button, Badge, Input, Select, Checkbox, Toggle, Tooltip) were rendered beside
`@dsect/ui`, themed only by the bridge. Vite 6, React 19.3, Tailwind 4.3.3, React Aria Components 1.21; measured in
Chromium at 393 and 1100px, both themes.

| Finding | Measured |
|---|---|
| One `data-theme` switch re-themes both kits | yes, by construction (`dark:` redefined, `.dark-mode` never used) |
| Upstream primary button in dark (white text on DSECT's ink fill) | **1.09:1**; after the one-word edit, 17.98:1 |
| Checkbox tick on its fill | fixed in the bridge alone: 17.98:1 / 19.90:1 |
| Toggle knob, *off* (upstream, both themes) | **1.13:1 / 1.10:1**; after a one-line edit, 5.57:1 / 7.03:1 |
| Destructive button | 4.83:1 / 8.31:1, unedited |
| `base.css` imported unlayered | DSECT's `a { color }` beat Untitled's link-button utility (accent 11.79:1 → `--fg` 16.66:1). Layers are required. |
| Control heights | buttons sm 36, md 40, **lg 44**, xl 48; inputs 40, **lg 44**. Default to `lg`. |
| Shared property name | `--radius-lg` exists in both `tokens.css` and Tailwind (both 8px). The bridge must not redefine it; the check enforces this. |
| Overflow at 393 / 360 (plain viewport) | none |
| Weight | 540 kB JS (163 kB gzip) including React + React Aria; 194 kB CSS (30 kB gzip) with every copied file scanned |

This agrees with the TRELLIS Phase 1 pilot's findings (`text-white` on brand fills fails; unlayered resets beat
utilities). It adds the toggle-knob failure, the `--radius-lg` name collision, and the approach of mapping
*semantic* tokens instead of ramps. With semantic mapping, contrast is inherited from pairs this repo already
measures.

## Mobile and the standalone app

**In the system now** (`components.css` → APP SHELL; `previews/app.html`; React `AppShell`, `AppBar`, `TabBar`,
`Dialog variant="sheet"`):

- A `100dvh` shell with a compact app bar and a bottom **tab bar** in thumb reach. The tab bar is sticky, not
  fixed, so nothing scrolls under it. It renders only below 760px; a page uses it *or* the hamburger drawer
  (one mobile nav).
- **Bottom sheets** as the phone's modal (native `<dialog>`, capped at 85% height).
- **Safe areas** via `viewport-fit=cover` + `env(safe-area-inset-*)`, and `display-mode: standalone` rules: no
  rubber-band overscroll, `.app-only` / `.browser-only`.
- `touch-action: manipulation` (no double-tap delay) and the system's own `:active` states instead of the grey
  tap flash.
- **Verified** at plain 393 and 360px viewports: no overflow, every tab ≥ 72×58px, content never under the tab
  bar, simulated notch and home-indicator insets pad both bars, sheets take focus and close on Esc.
- **Not verified:** the `display-mode: standalone` rules. This Chromium ignores that media emulation, so they
  need a check on a real installed PWA.

**Next, not built:**

- **Native apps get tokens only.** Untitled can't serve Kotlin/Compose (Pebble, Entangle), as TRELLIS already
  concluded. The step that serves them is a *generated* token export from `tokens.css` for a Compose theme:
  generated, never hand-kept, so it can't become a rival source.
- **Manifest and service worker are the hub's, not the system's.** The system supplies the manifest colours
  (`#0A0C10` dark / `#FFFFFF` light, copied from `--bg` because a manifest can't read CSS) and the icon slots in
  `brand/README.md` (2.1 / 2.2, pending artwork). The hub keeps "the service worker never caches `/api/`".
- **Breakpoints.** The hub has 24 `@media` widths; this system uses 600 / 760 / 900 / 1100; Tailwind defaults to
  640 / 768 / 1024 / 1280; Untitled adds 320 and 600.

## Decisions for the founder

> **Decided 2026-09-26:** both themes stay, and **light is the default** (TRELLIS Phase 0 asked "dark-only or dark +
> light"). `data-theme="dark"` switches every token, the Untitled bridge's `dark:` variant included.

1. **Kit shape:** combine (recommended) · `@dsect/ui` only · Untitled only.
2. **The primary action's fill in the Untitled half:** DSECT's ink (the hub's `btn-primary`; the bridge's
   default), or Terminal Green with Obsidian text (the TRELLIS pilot; 7.41:1). Either way it is one look; this
   is the choice of which.
3. **Breakpoints:** adopt three canonical widths. The suggestion is 600 (phone, matching Untitled's `xs`), 768
   (tab bar ↔ sidenav) and 1024 (content + aside); the existing 760 / 1100 move to them.
4. **Installed-app nav:** the bottom tab bar (plus a "More" sheet), or keep the hamburger drawer. Not both.
5. **Where the kit lives:** TRELLIS recommends the hub repo's `web/` until a second app adopts it. The tokens
   and the bridge stay here either way; every app reads them from this repo.
