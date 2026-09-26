# Untitled UI React, in DSECT's theme

`dsect-theme.css` is the bridge between this design system and
[Untitled UI React](https://github.com/untitleduico/react) (MIT; React 19, Tailwind v4, React Aria). It serves
TRELLIS (HUB-015): *"DSECT's theme lives in one file that maps Untitled UI's tokens onto the DSECT palette."*

It maps Untitled's **semantic** tokens (`--color-text-primary`, `--color-bg-brand-solid`, …) onto DSECT's
tokens (`var(--fg)`, `var(--ink-btn-bg)`, …). It does not re-tint Untitled's colour ramps. So:

- **`tokens.css` stays the single source of truth.** Change a DSECT token and both kits move.
- **DSECT's `data-theme` drives both kits.** Never apply Untitled's `.dark-mode` class. The bridge redefines
  Tailwind's `dark:` variant to follow DSECT's dark theme.
- **Contrast is inherited.** Every pair the bridge creates is a pair `scripts/check.mjs` already measures in
  both themes. The check also enforces that the bridge reads only real DSECT tokens and redefines none of them.

## Set-up (Tailwind v4 entry CSS)

```css
@import "tailwindcss";
@import "<untitled>/styles/theme.css";
@import "<untitled>/styles/typography.css";
@import "<design-system>/fonts.css";
@import "<design-system>/tokens.css";
@import "<design-system>/untitled/dsect-theme.css";
@import "<design-system>/base.css" layer(base);
@import "<design-system>/components.css" layer(components);

@plugin "@tailwindcss/typography";
@plugin "tailwindcss-react-aria-components";
@plugin "tailwindcss-animate";
```

Do **not** import Untitled's `globals.css`: it defines `dark:` as `.dark-mode`, and the bridge replaces that.
Copy its two `@utility` blocks (`scrollbar-hide`, `transition-inherit-all`) and the `label` /
`focus-input-within` variants into your entry file instead.

**Layers are not optional.** Unlayered rules beat every Tailwind utility, whatever the specificity. The spike
measured it: with `base.css` unlayered, DSECT's `a { color }` overrode Untitled's link-button colour. The text
went from the accent (11.79:1) to `--fg` (16.66:1), which proves the utility lost. That is the same trap
Nebula's port hit.

## Component edits (measured)

The bridge can't fix a colour a component hard-codes. These edits are needed on copied components. Each was
measured in the spike (Chromium, 393 and 1100px, both themes):

| Component | Edit | Before → after (dark / light) |
|---|---|---|
| `buttons/button.tsx` (primary) | `text-white` → `text-primary_on-brand`, and `*:data-icon:text-white/…` → `…text-primary_on-brand/…` | **1.09:1** → 17.98:1 / 19.90:1 |
| `toggle/toggle.tsx` knob | `bg-fg-white` → `isSelected ? "bg-fg-white" : "bg-fg-quaternary"` | off: **1.13:1 / 1.10:1** → 5.57:1 / 7.03:1 (on stays 17.98 / 19.90) |
| `buttons/close-button.tsx` (`dark` variant, over images) | `text-fg-white` → `text-white`: over a photo it must stay white in both themes | not measured |
| Checkbox tick, radio dot | none: fixed in the bridge (`--color-fg-white` → `--ink-btn-fg`) | tick 17.98:1 / 19.90:1 |

Primary destructive buttons (`bg-error-solid text-white`) pass unedited: 4.83:1 / 8.31:1.

## What the bridge does not change

- **Sizes.** Untitled buttons measure sm 36, md 40, **lg 44**, xl 48px; inputs are 40px until **lg (44px)**.
  The hub's `touch_test` floor is 44px, so a DSECT wrapper should default both to `lg`.
- **Radius on controls.** Buttons and inputs use `rounded-lg`, which is 8px in both systems. DSECT controls are
  6px (`--radius`). `rounded-xl` / `2xl` cards are flattened to 8px by the bridge. `--radius-lg` itself is a
  shared property name and must not be redefined here (the check enforces it).
- **Badge typography.** Untitled badges are sans, sentence case. DSECT badges are mono microtype. The colours
  match through the bridge, but the letterforms don't. For status, prefer `@dsect/ui`'s `Badge` /
  `StateIndicator`. Never use the `pill-*` badge types: DSECT is flat rectangles.
- **Hues outside the palette.** `orange` and `pink` utility ramps are left upstream on purpose. Pink belongs
  to a ring-fenced brand, not DSECT.

## Cost, from the spike

The spike is Vite 6, React 19.3, Tailwind 4.3.3 and React Aria Components 1.21. It renders a page with Button,
Badge, Input, Select, Checkbox, Toggle and Tooltip, next to `@dsect/ui`:

- JS: 540 kB (163 kB gzip) for React, React Aria and the components. The page's own code is a few kB.
- CSS: 194 kB (30 kB gzip). Tailwind scanned every copied file, demos and stories included; copying only the
  components in use shrinks it.
- Width: 393 and 360px viewports, no horizontal overflow (checked at a plain viewport, not device emulation).

## Where the spike lives

It isn't committed: vendored third-party components don't belong here until TRELLIS picks the shared kit's home.
To reproduce it, copy `components/base`, `components/foundations`, `utils`, `hooks` and `styles` from Untitled UI
React into a Vite + React 19 + Tailwind 4 app with an `@/` alias, use the entry CSS above, and apply the edits
in the table.
