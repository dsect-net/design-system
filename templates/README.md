# Templates

Starting points for a new page or app. Copy one, fix the four stylesheet paths, delete what you don't need.
Every visual value comes from the system; the templates declare none, only layout.

| File | For |
|---|---|
| `page.html` | A single page: masthead with the `DSECT//` lockup, a lede, a panel, the cut-rule footer. No section nav. |
| `dashboard.html` | An operations page: utility bar, masthead nav, sidenav, stat strip, table, aside. Below 900px the masthead nav becomes a drawer, so there is one mobile nav. |
| `app.html` + `manifest.webmanifest` | The hub as an installed phone app: app bar, tab bar, bottom sheet, safe areas. |

## What's already set up in each `<head>`, and why

- **`viewport-fit=cover`.** Without it every `env(safe-area-inset-*)` is 0 and content sits under the notch.
- **`theme-color`.** This is `--bg`'s value copied as a literal, because meta tags can't read CSS. The theme script
  swaps it with the theme.
- **Light by default.** `data-theme="light"` is on `<html>`; the toggle switches to `dark`.
- **Pre-paint theme script.** It applies a saved `dsect-theme` before the first frame, so a dark-theme reader
  never sees a light flash, and keeps `theme-color` in step. It uses `localStorage` for one viewer's preference only, inside `try` so private
  mode can't break the page.
- **Stylesheet order:** `fonts.css`, `tokens.css`, `base.css`, `components.css`. In a Tailwind app, load them
  as `untitled/README.md` describes instead, with `base.css` and `components.css` in layers.

## Before shipping one

- Replace the names: `Product`, `Title`, the sample rows.
- Keep the name rules: `DSECT` in text; the `//` stays `aria-hidden`.
- `manifest.webmanifest` has no icons yet. Add the `2.1` / `2.2` app icons from `brand/` once the artwork exists.
  Until then a browser won't offer to install the app.
- Serve the app over HTTPS (or the tailnet's), not `file://`, for install and the service worker. The hub's
  service worker must never cache `/api/`.
