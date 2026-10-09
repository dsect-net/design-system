import { useState } from "react";
import {
  AgentCard,
  Avatar,
  Badge,
  Bars,
  Button,
  Card,
  Checkbox,
  Dialog,
  DivisionTag,
  EmptyState,
  ExitChip,
  FilterBar,
  FilterBarActions,
  FilterSelect,
  IconButton,
  KeyValue,
  Loading,
  Meter,
  Metric,
  Panel,
  PanelBody,
  PanelHead,
  ProgressBar,
  RecordRow,
  Records,
  Rule,
  SearchInput,
  SelectField,
  SideNav,
  Skeleton,
  Spinner,
  Stamp,
  StateIndicator,
  Steps,
  Table,
  TableUserCell,
  Tabs,
  Td,
  Terminal,
  TextArea,
  TextField,
  Th,
  Toast,
  Toaster,
  Uptime,
  Wordmark,
  type ToastData,
} from "../../../react/src/lib";

export function Catalog() {
  const [dialog, setDialog] = useState<"modal" | "sheet" | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [chips, setChips] = useState([{ id: "ready", label: "Ready" }]);

  function notify() {
    const id = String(Date.now());
    setToasts((current) => [...current, { id, title: "Saved", text: "Sample only. Nothing left this page.", tone: "ok" }]);
  }

  return (
    <>
      <section className="kit-block" id="brand">
        <h1>Components</h1>
        <p className="kit-lede">
          Every control in this section is <code>@dsect/ui</code>. It renders the classes in <code>base.css</code> and{" "}
          <code>components.css</code>. Sample names only. Nothing here invents a color.
        </p>
        <WordmarkRow />
        <div className="kit-row">
          <DivisionTag division="systems">Systems</DivisionTag>
          <DivisionTag division="software">Software</DivisionTag>
          <DivisionTag division="labs">Labs</DivisionTag>
        </div>
        <Rule />
      </section>

      <section className="kit-block" id="actions">
        <h2>Actions</h2>
        <div className="kit-row">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost" size="sm">
            Ghost
          </Button>
          <IconButton label="More">+</IconButton>
        </div>
        <div className="kit-row">
          <Badge tone="ok" dot>
            Ready
          </Badge>
          <Badge tone="warn" dot>
            Degraded
          </Badge>
          <Badge tone="err" dot>
            Alert
          </Badge>
          <Badge tone="info">Info</Badge>
          <Badge tone="slate">Archived</Badge>
          <Badge tone="neutral" onDismiss={() => undefined} dismissLabel="Dismiss sample">
            Neutral
          </Badge>
        </div>
      </section>

      <section className="kit-block" id="state">
        <h2>State</h2>
        <div className="kit-row">
          <StateIndicator state="ready" />
          <StateIndicator state="busy">Syncing</StateIndicator>
          <StateIndicator state="degraded" />
          <StateIndicator state="stopped" />
          <StateIndicator state="alert" />
          <StateIndicator state="unknown" />
        </div>
        <div className="kit-row">
          <Spinner label="Loading sample" />
          <Loading>loading</Loading>
        </div>
        <ProgressBar value={64} label="Sample progress, 64 percent" />
        <ProgressBar label="Sample progress, still working" />
        <Skeleton style={{ width: "40%" }} />
      </section>

      <section className="kit-block" id="feedback">
        <h2>Feedback</h2>
        <EmptyState
          mark="∅"
          title="Nothing queued"
          text="Sample empty state. The mark is a character, not an illustration."
          actions={
            <Button variant="outline" size="sm" onClick={notify}>
              Raise a notice
            </Button>
          }
        />
        <Toast toast={{ id: "inline", title: "Inline notice", text: "The stack below is the live one.", tone: "info" }} />
        <Toaster toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />
      </section>

      <section className="kit-block" id="surfaces">
        <h2>Surfaces</h2>
        <Card className="has-stamp">
          <Stamp placement="top-end">sample</Stamp>
          <h2>Services</h2>
          <KeyValue
            items={[
              { label: "Node", value: "quantum" },
              { label: "Uptime", value: "99.98%", numeric: true },
              { label: "Build", value: "kit" },
            ]}
          />
        </Card>
        <Panel>
          <PanelHead>Note</PanelHead>
          <PanelBody>
            <p>A panel is a quieter card. Use it for a note, not a dashboard tile.</p>
          </PanelBody>
        </Panel>
      </section>

      <section className="kit-block" id="data">
        <h2>Data</h2>
        <div className="kit-row">
          <Metric label="Latency" value="42" unit="ms" delta="▼ 18 ms vs yesterday" sentiment="good" />
          <Meter label="Disk, 64 percent used" value="64%" percent={64} />
        </div>
        <Bars label="Seven samples, the last one down" values={[0.4, 0.55, 0.5, 0.7, 0.66, 0.8, 0.2]} tone={(_value, index) => (index === 6 ? "down" : undefined)} />
        <Uptime
          label="Eight days: six up, one degraded, one down"
          ticks={["up", "up", "up", "warn", "up", "up", "down", "up"]}
          legend={["8d", "4d", "now"]}
        />
        <div className="kit-row">
          <ExitChip code={0} />
          <ExitChip code={1} />
          <ExitChip code={2} />
        </div>
        <Table title="Services" count="3 monitored">
          <thead>
            <tr>
              <Th>Service</Th>
              <Th>Uptime</Th>
              <Th>State</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <TableUserCell name="Ada" initials="A" />
              </Td>
              <Td numeric>99.98%</Td>
              <Td>
                <StateIndicator state="ready" />
              </Td>
            </tr>
            <tr>
              <Td>quantum</Td>
              <Td numeric>99.90%</Td>
              <Td>
                <StateIndicator state="busy">Indexing</StateIndicator>
              </Td>
            </tr>
            <tr>
              <Td>nebula</Td>
              <Td numeric>98.10%</Td>
              <Td>
                <StateIndicator state="degraded" />
              </Td>
            </tr>
          </tbody>
        </Table>
        <Terminal title="check" exit={0}>
          <span className="t-dim">sample</span> tokens ok
        </Terminal>
      </section>

      <section className="kit-block" id="records">
        <h2>Records</h2>
        <div className="kit-row">
          <Avatar name="Ada" />
          <AgentCard
            name="Quantum"
            description="Sample agent card. The codename is the name."
            state="ready"
            meta={[
              ["Tier", "Sample"],
              ["Seat", "Kit"],
            ]}
          />
        </div>
        <Records>
          <RecordRow recordId="ADR-012" codename="Name" title="The written name is DSECT" status="ratified" meta="Sample row" />
          <RecordRow recordId="KIT-001" title="React gallery" status="active" meta="This page" />
        </Records>
      </section>

      <section className="kit-block" id="forms">
        <h2>Forms</h2>
        <TextField label="Display name" hint="Shown on the masthead." placeholder="Ada" />
        <TextArea label="Note" hint="A short sample." placeholder="Decompose. Then build." rows={3} />
        <SelectField label="Division" defaultValue="labs">
          <option value="labs">Labs</option>
          <option value="software">Software</option>
          <option value="systems">Systems</option>
        </SelectField>
        <Checkbox label="Email when a service degrades" />
      </section>

      <section className="kit-block" id="navigation">
        <h2>Navigation</h2>
        <Steps
          steps={[
            { title: "Tokens", desc: "One source", state: "done" },
            { title: "Components", desc: "This page", state: "current" },
            { title: "Ship", desc: "A React app", state: "upcoming" },
          ]}
        />
        <FilterBar
          applied={chips}
          onRemoveFilter={(id) => setChips((current) => current.filter((chip) => chip.id !== id))}
          onClearAll={() => setChips([])}
        >
          <SearchInput aria-label="Search services" placeholder="Search" className="input" />
          <FilterSelect aria-label="State" defaultValue="any">
            <option value="any">Any state</option>
            <option value="ready">Ready</option>
            <option value="degraded">Degraded</option>
          </FilterSelect>
          <FilterBarActions>
            <Button variant="outline" size="sm" onClick={() => setChips([{ id: "ready", label: "Ready" }])}>
              Apply
            </Button>
          </FilterBarActions>
        </FilterBar>
        <SideNav
          head="Kit"
          sections={[
            {
              heading: "Look",
              items: [
                { label: "Components", href: "#brand", active: true, onClick: stay },
                { label: "Untitled", href: "#untitled", onClick: stay },
                { label: "Templates", href: "#templates", onClick: stay },
              ],
            },
          ]}
        />
        <Tabs
          label="Sample sections"
          tabs={[
            { id: "now", label: "Now", panel: <p>The selected panel.</p> },
            { id: "next", label: "Next", badge: <Badge tone="info" size="sm">1</Badge>, panel: <p>A second panel.</p> },
          ]}
        />
        <div className="kit-row">
          <Button variant="outline" onClick={() => setDialog("modal")}>
            Open a dialog
          </Button>
          <Button variant="outline" onClick={() => setDialog("sheet")}>
            Open a sheet
          </Button>
        </div>
        <Dialog
          open={dialog === "modal"}
          onClose={() => setDialog(null)}
          title="Sample dialog"
          footer={
            <Button size="sm" onClick={() => setDialog(null)}>
              Close
            </Button>
          }
        >
          <p>Native dialog. Esc closes it. Sample copy only.</p>
        </Dialog>
        <Dialog open={dialog === "sheet"} variant="sheet" onClose={() => setDialog(null)} title="Sample sheet">
          <p>The phone sheet. Same component, variant sheet.</p>
        </Dialog>
      </section>
    </>
  );
}

function WordmarkRow() {
  return (
    <div className="kit-row">
      <Wordmark descriptor="Kit" href="#brand" />
      <Wordmark name="Nebula" cut={false} />
    </div>
  );
}

function stay(event: { preventDefault: () => void }) {
  event.preventDefault();
}
