# DSECT Hub — Design System

Extracted verbatim from `hub.dsect.net` (the DSECT ops hub frontend at `/var/www/dsect-hub/`)
on 2026-09-20. This is the UI system that actually ships — tokens, type, components — not a
redesign or a proposal.

## Files

- `tokens.css` — the single source of truth for color, radius, shadow, font-family and safe-area
  tokens. Dark and light themes both defined; dark is the estate's home theme. Every page in the
  hub links this one file and redeclares nothing.
- `fonts.css` + `fonts/` — self-hosted Inter (300/400/500/600/700) and JetBrains Mono (400/500),
  latin + latin-ext subsets. Self-hosted deliberately: the hub is the page you open when the
  network is questionable, and it shouldn't need `fonts.gstatic.com` to render.
- `base.css` — typography scale, layout/container, buttons, cards/panels, forms, and the
  two-tier masthead pattern. Generalized from the hub's page-level styles into reusable
  primitives.
- `components.css` — the shared component library: badges, empty states, toasts, loading
  indicators (spinner/progress/skeleton), tables, filter bars, progress steps, sidebar nav.
  Patterns are adapted from Untitled UI's anatomy, rebuilt in this estate's idiom — flat rounded
  rectangles instead of pills, mono microtype, hairline borders, tokens only.
- `previews/` — one HTML file per category, each a self-contained, theme-toggleable showcase.

## Design principles (as embodied by the code, not aspirational)

1. **Tokens only, never literals.** No page or component redeclares `--bg`, `--surface`,
   `--radius` or `--max`. Seven inline copies that happen to agree is not a design system.
2. **Color is never the only signal.** Every badge/toast/status carries its state in the label
   text too, so it survives colour-blindness and a monochrome screenshot.
3. **Flat rectangles, not pills.** This is a dense operations dossier, not a marketing site —
   pills read as consumer UI.
4. **Mono for data, sans for prose.** JetBrains Mono is reserved for labels, timestamps, stats
   and anything a user compares numerically. Inter carries everything else.
5. **44px is the touch-target floor**, enforced on every interactive control regardless of its
   visible size, bumped to 46px under coarse-pointer media.
6. **Motion always degrades.** Every animation has a `prefers-reduced-motion` fallback, and a
   stopped spinner never just freezes — freezing reads as "hung," not "done."
7. **One mobile nav.** The sidebar does not render below 760px; `shell-nav.js` owns mobile
   navigation so there is never a second, competing nav.

## Not included here

Brand identity (the `DSECT` wordmark, "The Cut" mark, tagline) is a separate, still-pending
decision (`ADR-012`, status: Pending Review) and isn't part of this extraction — this covers the
UI system the hub already ships, not the brand identity layered on top of it.
