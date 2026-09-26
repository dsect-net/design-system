# Contributing

This is the UI system the DSECT Hub ships. Changes land by pull request, and the checks decide what "done"
means, not a reviewer's eye.

## Set up

```bash
npm install          # only needed for the rendered smoke test (Playwright)
npm run check        # source checks: zero dependencies, runs in a second
npm run smoke        # renders every page: errors, sideways scroll, 44px hit areas
```

The React layer builds on its own: `cd react && npm install && npm run typecheck && npm run build`.

Open `index.html` in a browser for the gallery. Everything works from `file://` and needs no server.

## What the checks enforce

| Script | Fails when |
|---|---|
| `check` | a `var()` resolves to nothing · a colour literal outside `tokens.css` · a dark colour token with no light value · a text token under 4.5:1 (marks under 3:1) in either theme · a missing font file or licence · a broken local link · a preview without a `@dsCard` group · a `DSECT//` cut that isn't `aria-hidden` · the Untitled UI bridge reading an unknown token or redefining a DSECT one |
| `smoke` | a console error, uncaught exception or failed request · horizontal scroll at 360, 393 or 1280px · an interactive control whose hit area is under 44 × 44px on a touch phone |

Both use the Quantum CLI exit contract, `0` ok · `1` warn · `2` error, and both run in CI on every pull request.

## Adding things

**A token.** Declare it in `tokens.css`, never anywhere else. A colour needs a value in the dark block
*and* the light block. A value that doesn't change with the theme goes in the theme-invariant `:root` block. Run `check`:
contrast is measured for you.

**A component.**

1. Add a section to `components.css` in the house format: a boxed header comment that says what it's for and
   *why* it looks that way, then rules that use tokens only.
2. Colour is never the only signal. A state needs a label, a shape or both.
3. Anything interactive reaches a 44px hit area. If it's drawn smaller, pad it with a transparent `::before`.
4. Show it in a preview (`previews/<name>.html`, opening with `<!-- @dsCard group="…" -->`) and link it from
   `index.html`.
5. Add a typed wrapper in `react/src/components/` and export it from `react/src/index.ts`.

**A page for an app.** Start from `templates/`.

## Rules that aren't negotiable

- **Class names are an API.** The hub and `@dsect/ui` depend on them. Add, alias or fix; never rename.
- **The name is DSECT.** `DSECT//` is a visual treatment only (ADR-012). Nobody draws or regenerates logo
  marks in code; artwork is image-generated and wired in (`brand/README.md`).
- **Brand changes need an ADR.** Palette, typography, the mark and naming are founder decisions
  (Brand Architecture §7). A pull request can propose one; it can't make one.
- **This repository is public.** Sample data only: no hostnames, tailnet names, keys, internal paths or
  security posture in previews, docs or commits.

## Pull requests

The template asks for the checklist that matters here: both themes, a phone width, the two scripts, and
screenshots for anything visual. Keep a pull request to one purpose; a CSS fix and a brand change are two PRs.
