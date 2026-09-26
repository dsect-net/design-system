# Brand — for anyone (or any agent) building UI

The brand decisions are made elsewhere; this folder is where they meet the UI system.
Everything here follows **ADR-012** (ratified 2026-09-23) and the DSECT Brand Architecture.

## The name

| Write | Where |
|---|---|
| `DSECT` | All running text, code, handles, domains, package scopes, documents, `alt` text |
| `DSECT//` | **Only** as the visual treatment: the logo, and the `.wordmark` in mastheads and footers |

- Said *dee-sect*; it reads as *dissect*, which is the point: decompose, then build.
- Never `D//SECT`, `D-SECT` or `D/SECT`. The `//` is a path separator, so it can't live in a hostname,
  a package scope or a shell command. That contradiction is why ADR-012 exists.
- In markup the `//` is always `aria-hidden="true"`, so screen readers, search engines and copy-paste get
  `DSECT`. `scripts/check.mjs` fails the build if a `.wordmark__cut` isn't hidden, and the React
  `<Wordmark>` renders it hidden by construction.

```html
<a class="wordmark" href="/">DSECT<span class="wordmark__cut" aria-hidden="true">//</span></a>
<a class="wordmark" href="/">DSECT<span class="wordmark__cut" aria-hidden="true">//</span><span class="wordmark__descriptor">Hub</span></a>
```

## Naming anything new

> The DSECT name is earned by external exposure. If someone outside the company will see it, it carries
> the name. If it is an instrument the operator drives, it gets a codename.

| Tier | Written | Visual |
|---|---|---|
| 1 · Entity | DSECT | `DSECT//` |
| 2 · Division | DSECT Systems · DSECT Software · DSECT Labs | `DSECT//` + division in Ice, `.division--*` swatch |
| 3 · Product | DSECT + a plain noun: DSECT Hub | `DSECT//` + descriptor |
| 4 · Instrument | Codename alone: Nebula, Reeve, Quantum | codename in Inter 600, no `//`, no prefix |

Avoid `-ly`, `-ify`, `-io`, a `-hub` suffix, invented portmanteaus, "AI" in a name, and anything that needs
punctuation to make sense. Promoting an instrument to a product is an ADR, not a rename.

Division accents: only Labs has an assigned hue (`--division-labs`). Systems and Software inherit the entity
accent until an ADR assigns one. Ring-fenced brands that deliberately don't show the parent are out of scope for
this system, and their colours don't belong in `tokens.css`.

## Logo artwork — not drawn here

As of 2026-09-24 the logo is image-generated from the chosen splash direction: `DSECT` in wide, extended
geometric caps with an even, thin stroke, trailed by `//` (two tall, steep parallel bars, ice-blue to steel-blue).
**This system does not draw marks.** The previous SVG marks are superseded and must not be rebuilt or rolled out.

When artwork lands, it goes in this folder under these names, and replaces the typographic treatment by
going *inside* the same `.wordmark` element:

| File | Size | Use |
|---|---|---|
| `1.1-wordmark-dark.png` / `-light.png` | 2400 × 600, transparent | masthead, docs, signatures |
| `1.3-text-dark.png` / `-light.png` | 2400 × 600, transparent | `DSECT` alone, where the mark is nearby |
| `1.4-mark-dark.png` / `-light.png` | 1024², transparent | the `//` alone: stamps, watermarks, loaders; must read at 16px |
| `2.1-app-icon.png` | 1024², full-bleed, no rounded corners | PWA / home screen |
| `2.2-app-icon-maskable.png` | 1024², art inside the central 80% | Android adaptive icon |
| `3.1-og-image.png` | 1200 × 630, text inside the middle 1000 × 500 | link previews |

*Dark* means for dark backgrounds (light ink); *light* means for light backgrounds.

```html
<a class="wordmark" href="/">
  <picture>
    <source srcset="brand/1.1-wordmark-light.png" media="(prefers-color-scheme: light)">
    <img src="brand/1.1-wordmark-dark.png" alt="DSECT" width="2400" height="600">
  </picture>
</a>
```

`alt="DSECT"`, never `DSECT//`: the image *shows* the treatment, the text *is* the name.

## archive/

`archive/d-sect-hex-mark-2026-08-29.svg` is the hexagon-and-slashes mark from the superseded `D//SECT` brand
asset pack. It is kept as history, not for use: history is not retro-edited, it is archived with a pointer to
its successor, and the successor is ADR-012 plus the artwork above.
