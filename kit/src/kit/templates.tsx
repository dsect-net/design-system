import { AppBar, AppShell, Badge, Button, Card, KeyValue, Panel, PanelBody, PanelHead, Rule, SideNav, StateIndicator, Table, TabBar, Td, Th, Wordmark } from "../../../react/src/lib";

export function PageTemplate() {
  return (
    <Card>
      <Wordmark descriptor="Labs" size="lg" />
      <h2>A page</h2>
      <p>One subject, a lede, a panel, and the cut rule. No section nav.</p>
      <Panel>
        <PanelHead>Note</PanelHead>
        <PanelBody>
          <p>Sample copy only. Replace the names before this ships as a product.</p>
        </PanelBody>
      </Panel>
      <Rule />
      <p className="text-small">Decompose. Then build.</p>
    </Card>
  );
}

export function DashboardTemplate() {
  return (
    <div className="kit-block">
      <Wordmark descriptor="Hub" />
      <div className="kit-dash">
        <SideNav
          sections={[
            {
              items: [
                { label: "Checks", href: "#templates", active: true, onClick: (event) => event.preventDefault() },
                { label: "Log", href: "#templates", onClick: (event) => event.preventDefault() },
              ],
            },
          ]}
        />
        <div className="kit-block">
          <div className="kit-row">
            <Card>
              <KeyValue
                items={[
                  { label: "Checks", value: "26", numeric: true },
                  { label: "Failing", value: "1", numeric: true },
                ]}
              />
            </Card>
            <Badge tone="warn" dot>
              1 degraded
            </Badge>
          </div>
          <Table title="Checks" count="3">
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>State</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>api</Td>
                <Td>
                  <StateIndicator state="ready" />
                </Td>
              </tr>
              <tr>
                <Td>queue</Td>
                <Td>
                  <StateIndicator state="degraded" />
                </Td>
              </tr>
              <tr>
                <Td>web</Td>
                <Td>
                  <StateIndicator state="ready" />
                </Td>
              </tr>
            </tbody>
          </Table>
          <Button variant="outline" size="sm">
            Open the log
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AppTemplate() {
  return (
    <div className="kit-phone">
      <AppShell
        appBar={<AppBar title="Hub" subtitle="Quantum · sample" />}
        tabBar={
          <TabBar
            current="home"
            items={[
              { id: "home", label: "Home", icon: <Dot /> },
              { id: "checks", label: "Checks", icon: <Dot /> },
              { id: "you", label: "You", icon: <Dot /> },
            ]}
          />
        }
      >
        <p>The tab bar is the phone nav. One nav, not two.</p>
        <StateIndicator state="ready" />
      </AppShell>
    </div>
  );
}

function Dot() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="4" fill="currentColor" />
    </svg>
  );
}
