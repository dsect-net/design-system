# `@dsect/ui` — React layer for the DSECT design system

Typed React components over the canonical design-system CSS. This package makes
**zero new visual decisions**: every class it renders comes from `tokens.css`,
`base.css`, and `components.css` at the repo root, which were extracted verbatim
from the shipping hub UI. Import the published stylesheet alongside the
components to get the full system styles.

## Install

```bash
npm install @dsect/ui
```

Requires React 18+ (peer dependency).

## Use

```tsx
import '@dsect/ui/styles.css';
import { Button, Card, Badge, Table, Th, Td, StateIndicator, setTheme } from '@dsect/ui';

function Services() {
  return (
    <Card>
      <Badge tone="ok" dot>All systems go</Badge>
      <Table title="Services" count="26 monitored">
        <thead>
          <tr>
            <Th>Service</Th>
            <Th>Uptime</Th>
            <Th>State</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>hub</Td>
            <Td numeric>99.98%</Td>
            <Td><StateIndicator state="ready" /></Td>
          </tr>
        </tbody>
      </Table>
      <Button variant="primary">Restart</Button>
    </Card>
  );
}
```

## Theming

Dark is the estate's home theme and the default — no attribute needed. For light:

```tsx
import { setTheme } from '@dsect/ui';
setTheme('light'); // sets data-theme="light" on <html>
```

## Principles (embodied, not aspirational)

These come from the system itself; this package just obeys them:

1. **Tokens only, never literals.** No component redeclares a color, radius, or font.
2. **Color is never the only signal.** Badges and toasts state their status in text too.
3. **Flat rectangles, not pills.** Dense operations dossier, not a marketing site.
4. **Mono for data, sans for prose.** JetBrains Mono for labels, timestamps, stats.
5. **44px is the touch-target floor**, enforced on every interactive control.
6. **Motion always degrades.** Every animation has a `prefers-reduced-motion` fallback.

7. **The name is DSECT.** ADR-012 was ratified 2026-09-23: `DSECT//` is a visual treatment only.
   `<Wordmark>` renders the `//` `aria-hidden` by construction, so assistive tech always reads "DSECT".
   Logo artwork is not drawn here; pass the image as `<Wordmark>`'s children when it exists.

```tsx
<Wordmark href="/" descriptor="Hub" />           {/* DSECT// Hub */}
<Wordmark name="Nebula" cut={false} />            {/* an instrument: codename only */}
```

## Components

- **Buttons:** `Button` (primary / outline in sm/md, ghost in sm), `IconButton` (label required)
- **Surfaces:** `Card` (lifts on hover — a destination), `Panel` + `PanelHead`/`PanelBody` (a container you read)
- **Feedback:** `Badge` (ok/warn/err/info, dot, dismissible), `EmptyState`, `Spinner`, `Loading`, `ProgressBar`, `Skeleton`, `Toast` + `Toaster` (render one `Toaster` per app)
- **Data:** `Table` (title, mono count, footer), `Th` (sortable), `Td` (numeric, actions), `TableUserCell`
- **Forms:** `TextField`, `TextArea`, `SelectField`, `Checkbox`
- **Navigation:** `Steps` (h/v), `SideNav` (hidden below 760px by design — mobile nav belongs to the app shell), `FilterBar` (+ `FilterBarActions`, `SearchInput`, `FilterSelect`, applied-filter chips)
- **Brand:** `Wordmark` (entity / division / product / instrument lockups), `DivisionTag`, `Rule` (plain or cut)
- **State & fleet:** `StateIndicator` (ready / busy / degraded / stopped / alert / unknown — shape + label, not colour alone), `Records` + `RecordRow` (goal and ADR lifecycle → badge), `Avatar` (monogram fallback), `AgentCard`
- **Telemetry:** `KeyValue`, `Metric`, `Meter`, `Bars` and `Uptime` (both require a `label` summary), `Terminal` + `ExitChip` (Quantum CLI 0 ok / 1 warn / 2 error), `Stamp`
- **Overlays:** `Tabs` (roving tabindex, arrow keys), `Dialog` (native `<dialog>`, `modal` or `drawer`). The command palette is CSS-only (`.palette`).

## Developing

```bash
npm install
npm run typecheck
npm run build   # emits dist/ with JS, CSS, and types
```

## License

Apache-2.0 (see repo root LICENSE).
