import { useState } from "react";
import { Button as UButton } from "@/components/base/buttons/button";
import { Badge as UBadge } from "@/components/base/badges/badges";
import { Checkbox as UCheckbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import { Toggle } from "@/components/base/toggle/toggle";
import { Tooltip } from "@/components/base/tooltip/tooltip";
import {
  Button,
  Wordmark,
  setTheme,
  type Theme,
} from "../../../react/src/lib";
import { Catalog } from "./catalog";
import { AppTemplate, DashboardTemplate, PageTemplate } from "./templates";

type Section = "components" | "untitled" | "templates";
type Template = "page" | "dashboard" | "app";

const sections: { id: Section; label: string }[] = [
  { id: "components", label: "Components" },
  { id: "untitled", label: "Untitled" },
  { id: "templates", label: "Templates" },
];

export function App() {
  const [theme, set] = useState<Theme>("light");
  const [section, setSection] = useState<Section>("components");
  const [template, setTemplate] = useState<Template>("page");

  function chooseTheme(next: Theme) {
    set(next);
    setTheme(next);
  }

  return (
    <>
      <header className="kit-top">
        <Wordmark descriptor="Kit" href="#components" />
        <nav className="kit-nav" aria-label="Kit">
          {sections.map((item) => (
            <Button
              key={item.id}
              variant={section === item.id ? "primary" : "outline"}
              size="sm"
              aria-current={section === item.id ? "page" : undefined}
              onClick={() => setSection(item.id)}
            >
              {item.label}
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={() => chooseTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
        </nav>
      </header>
      <main className="kit-main">
        {section === "components" ? <Catalog /> : null}
        {section === "untitled" ? <Untitled /> : null}
        {section === "templates" ? (
          <Templates which={template} onWhich={setTemplate} />
        ) : null}
      </main>
    </>
  );
}

function Untitled() {
  return (
    <section className="kit-block" id="untitled">
      <h1>Untitled UI</h1>
      <p className="kit-lede">
        These are the Untitled UI React components, default size large so the hit area stays at 44 pixels.
        Color comes from the DSECT bridge. The only edits are the two contrast fixes the bridge cannot do on
        its own: primary button text, and the toggle knob when it is off. No pills.
      </p>
      <div className="kit-row">
        <UButton size="lg" color="primary">
          Save
        </UButton>
        <UButton size="lg" color="secondary">
          Cancel
        </UButton>
        <Tooltip title="Writes the record on this machine.">
          <UButton size="lg" color="tertiary">
            Why
          </UButton>
        </Tooltip>
      </div>
      <div className="kit-row">
        <UBadge type="color" color="brand" size="md">
          Brand
        </UBadge>
        <UBadge type="color" color="gray" size="md">
          Neutral
        </UBadge>
        <UBadge type="color" color="error" size="md">
          Error
        </UBadge>
      </div>
      <Input label="Service" hint="A public name. Nothing private." placeholder="hub" size="lg" />
      <NativeSelect
        label="Division"
        size="lg"
        options={[
          { label: "Labs", value: "labs" },
          { label: "Software", value: "software" },
          { label: "Systems", value: "systems" },
        ]}
      />
      <UCheckbox label="Keep a local copy" size="md" />
      <Toggle label="Alerts" hint="Page the on-call when a check fails." size="md" />
    </section>
  );
}

function Templates({ which, onWhich }: { which: Template; onWhich: (next: Template) => void }) {
  return (
    <section className="kit-block" id="templates">
      <h1>Templates</h1>
      <p className="kit-lede">
        Starting points in React. Copy one into an app. The HTML files under <code>templates/</code> stay as the
        CSS reference the check renders.
      </p>
      <div className="kit-row">
        <Button variant={which === "page" ? "primary" : "outline"} size="sm" onClick={() => onWhich("page")}>
          Page
        </Button>
        <Button variant={which === "dashboard" ? "primary" : "outline"} size="sm" onClick={() => onWhich("dashboard")}>
          Dashboard
        </Button>
        <Button variant={which === "app" ? "primary" : "outline"} size="sm" onClick={() => onWhich("app")}>
          App
        </Button>
      </div>
      {which === "page" ? <PageTemplate /> : null}
      {which === "dashboard" ? <DashboardTemplate /> : null}
      {which === "app" ? <AppTemplate /> : null}
    </section>
  );
}

