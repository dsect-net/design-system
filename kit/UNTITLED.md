# Untitled UI in the kit

The components under `kit/src/components` are copied from [Untitled UI React](https://github.com/untitleduico/react) (MIT). They are not rewritten.

`untitled/dsect-theme.css` maps Untitled's semantic colors onto DSECT tokens. Two hard-coded colors sit past that bridge, and those are the only source edits:

| File | Edit |
|---|---|
| `src/components/base/buttons/button.tsx` | Primary label and icon: `text-white` → `text-primary_on-brand`. Destructive buttons stay `text-white`. |
| `src/components/base/toggle/toggle.tsx` | Knob: `bg-fg-white` when on, `bg-fg-quaternary` when off. |

Do not change sizes, radius, or copy. Default controls in the gallery to `lg` so the hit area stays 44px. Do not use `pill-*` badges. Do not import Untitled's `globals.css`.

Utility ramps (`bg-utility-*`, orange, pink) are left as Untitled shipped them.
