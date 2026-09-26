## What and why

<!-- One purpose per pull request: what changes, and what it is for. -->

## Kind

- [ ] Token (`tokens.css`)
- [ ] Component or fix (`base.css`, `components.css`)
- [ ] React layer (`react/`)
- [ ] Brand: palette, type, mark or naming. **Needs an ADR** (Brand Architecture §7); link it:
- [ ] Docs, previews, templates or tooling

## Checklist

- [ ] `npm run check` exits 0
- [ ] `npm run smoke` exits 0 (no errors, no sideways scroll at 360/393/1280, 44px hit areas on touch)
- [ ] `react/`: `npm run typecheck && npm run build`, if CSS classes or `react/` changed
- [ ] No class renamed (add, alias or fix: the hub and `@dsect/ui` depend on them)
- [ ] Any new state carries a label or shape, not colour alone
- [ ] New or changed components are shown in a preview linked from `index.html`
- [ ] Public repository: sample data only (no hostnames, tailnet names, keys or internal paths)
- [ ] The name is written DSECT; any `DSECT//` cut is `aria-hidden`; no logo drawn in code

## Screenshots

<!-- Anything visual: dark and light, plus a phone width (393 or 360). -->
