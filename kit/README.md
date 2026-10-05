# DSECT kit

The React gallery. It renders every `@dsect/ui` component, the three templates (page, dashboard, installed app), and the Untitled UI controls this system actually uses.

The HTML files at the repo root stay. `scripts/check.mjs` and `scripts/smoke.mjs` render those. They are the CSS contract. New pages are React, and they start here.

## Run

```bash
cd kit
npm install
npm run dev
```

`npm run typecheck` and `npm run build` are what CI runs. The production build is a static site. `kit/Dockerfile` (context: the repo root) serves it with nginx. `kit/compose.yaml` publishes the loopback bind. A push to `main` also pushes the same image tag the compose file names.

## Untitled UI

Vendored under `src/components` from Untitled UI React (MIT). Recolored only, and only where the bridge cannot reach a hard-coded color. See `UNTITLED.md`. Do not import Untitled's `globals.css`.
