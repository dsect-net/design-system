# Eidolon — paper sub-style

This folder is a **sub-style**. It is not the hub dossier.

The core system (`tokens.css`, `base.css`, `components.css`) stays flat, rectangular, and mono. Eidolon is a private character app: warm paper, a curtain red, brass, Fraunces for names, Outfit for the rest. Those choices would break the hub's principles if they were mixed into the core files, so they live here.

Untitled UI React is still the component kit. Eidolon does not invent a second set of checkboxes, selects, tags, avatars, or button groups. It retints the kit.

## What the app uses

| Job | Untitled component |
|---|---|
| Search | `Input` with a leading icon |
| Cards or list | `ButtonGroup` + `ButtonGroupItem`, icon only |
| Sort | `NativeSelect` |
| Kept only | `Checkbox` |
| Tag filter | `TagGroup` / `TagList` / `Tag` |
| Person | `Avatar`, or the painted mark when there is no portrait |
| Tag chip | `Badge` |
| Empty shelf | `EmptyState` |
| Opening | `LoadingIndicator` |

## Tokens

`tokens.css` declares `--eidolon-*` only. It does not redefine `--fg`, `--bg`, or anything in `tokens.css`. The app maps these onto Untitled's semantic slots in its own theme file (`src/styles/uui-theme.css`), so a primary button is curtain, not Untitled purple, and not the hub's ink button.

## Motion

`motion.css` is the small set: a rise when a card or row appears, a brass shimmer while someone is writing, a wash on a portrait that is still painting. Every animation is off under `prefers-reduced-motion: reduce`.

Do not import this folder from a hub page.
