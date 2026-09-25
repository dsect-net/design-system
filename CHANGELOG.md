# Changelog

## 2026-09-25

Grounded in the ratified brand (ADR-012, Brand Architecture, Identity Spec), the Quantum architecture, and
the hub as it ships. No existing class was renamed, so the hub and `@dsect/ui` keep working.

### Fixed

- **Toasts never animated in.** `components.css` referenced `@keyframes toastIn` but never defined it.
- **Sorted columns showed no arrow.** The selector was `th [aria-sort]` (a descendant); ARIA puts
  `aria-sort` on the `<th>` itself, which is what `@dsect/ui` renders. Both forms now match.
- **Reduced-motion spinner froze**, despite the comment and principle #6 saying it must not. The global
  duration clamp also stopped any fallback. The spinner and indeterminate bar now breathe (opacity only).
- **Nav and sidenav links rendered with browser-default underlines**, and plain links had no styling at all.
  Base link style added; nav and button-shaped anchors opt out.
- **Numeric and action column headers didn't align with their cells** (`th.num` / `th.actions` unstyled).
- **Filter bar select took a full row**, because base.css's form-wide `select { width: 100% }` leaked in.
- **Wide tables pushed pages sideways on phones.** Grid tracks were bare `1fr` (can't shrink below
  content), and `.sr-only` labels escaped `.tbl-scroll`. Tracks are now `minmax(0, 1fr)` and the scroller
  contains its absolutely positioned descendants. Number cells no longer wrap mid-value.
- **Stat strip on phones**: each second-row cell kept a divider and indent.
- **`.tbl--sm` enlarged header labels** to body size.
- **`hidden` lost to component `display` rules**, e.g. a filtered palette item stayed visible.
- **Focus ring drifted**: components restated it in `--emerald` at 2px while base used `--focus-ring` at
  1.5px. Now there is one ring (`--focus-width`, `--focus-ring`) and components only adjust offsets.
- **Touch targets under 44px**: badge ×, filter-chip ×, sort headers, checkbox and masthead links now pad
  their hit area to the floor with a transparent `::before`. Nothing changes visually.
- **Tokens outside tokens.css**: motion tokens moved in from base.css, and the input focus-shadow literal
  became `--focus-soft`.
- **Native controls rendered light-on-dark**: `color-scheme` is now set per theme.
- **Fonts**: the files named `Inter-300-*` / `JetBrainsMono-400-*` are variable fonts, but were declared as ten
  single-weight faces, so in-between weights snapped. They are now four range faces; the historical file
  names are kept so existing URLs don't break. The OFL licences, which the fonts require, now ship with them.

### Added

- Components: state indicator (six states, six shapes, modelled on the Quantum status plane), key-value
  list, metric, meter, bars, uptime strip, terminal + Quantum-CLI exit chip, tabs, modal, drawer, command
  palette, stamp, record rows with the goal/ADR lifecycle, avatar, agent card, and `.badge--slate`.
- Brand layer: `.wordmark__cut` (always `aria-hidden`), `.wordmark__descriptor`, lockups by tier, division
  tags, `.rule` / `.rule--cut`. `brand/README.md` gives the name rules and artwork slots. The superseded hex
  mark moved to `brand/archive/`.
- Tokens: division accents, `--wordmark-cut`, spacing scale, `--dur-enter`, z-index scale, `--tap`,
  `--tap-coarse`, `--focus-width`, `--focus-offset`, `--focus-soft`.
- `.btn.is-destructive`, `.sr-only`, base `code` / `kbd` / `pre`.
- Previews: brand, state & records, data & telemetry, tabs & overlays, space/elevation/motion, and composed
  Hub overview and Quantum fleet patterns. Plus `index.html`, a gallery.
- `@dsect/ui`: `Wordmark`, `DivisionTag`, `Rule`, `StateIndicator`, `Records`/`RecordRow`, `Avatar`,
  `AgentCard`, `KeyValue`, `Metric`, `Meter`, `Bars`, `Uptime`, `ExitChip`, `Terminal`, `Stamp`, `Tabs`,
  `Dialog`; `slate` badge tone.
- `scripts/check.mjs` + CI; `LICENSE` (Apache-2.0), `LICENSE-docs` (CC BY 4.0).

### Changed

- Preview copy no longer carries a tailnet hostname or notes on how a secret is stored; this repository
  is public.
