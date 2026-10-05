/**
 * Component exports without the stylesheet.
 *
 * `index.ts` imports the canonical CSS and re-exports this module, which is
 * what a published consumer wants. An app that already loads tokens, base and
 * components in CSS layers (the kit does) imports from here instead, so those
 * stylesheets are not pulled in a second time, unlayered, where they would
 * beat Tailwind utilities.
 */

export { Button, IconButton } from './components/buttons';
export type { ButtonProps, IconButtonProps } from './components/buttons';

export { Card, Panel, PanelHead, PanelBody } from './components/surfaces';
export type { CardProps, PanelProps } from './components/surfaces';

export { Badge, EmptyState, Spinner, Loading, ProgressBar, Skeleton, Toast, Toaster } from './components/feedback';
export type {
  BadgeProps,
  EmptyStateProps,
  SpinnerProps,
  ProgressBarProps,
  ToastData,
  ToastProps,
  ToasterProps,
  Tone,
} from './components/feedback';

export { Table, Th, Td, TableUserCell } from './components/data';
export type { TableProps, ThProps, TdProps, SortDir } from './components/data';

export { TextField, TextArea, SelectField, Checkbox } from './components/forms';
export type { TextFieldProps, TextAreaProps, SelectFieldProps, CheckboxProps } from './components/forms';

export { Steps, SideNav, FilterBar, FilterBarActions, SearchInput, FilterSelect } from './components/navigation';
export type {
  Step,
  StepsProps,
  SideNavItem,
  SideNavSection,
  SideNavProps,
  FilterChipData,
  FilterBarProps,
} from './components/navigation';

export { Wordmark, DivisionTag, Rule } from './components/brand';
export type { WordmarkProps, Division, DivisionTagProps, RuleProps } from './components/brand';

export { StateIndicator, Records, RecordRow, Avatar, AgentCard } from './components/status';
export type { AgentState, StateIndicatorProps, Lifecycle, RecordRowProps, AvatarProps, AgentCardProps } from './components/status';

export { KeyValue, Metric, Meter, Bars, Uptime, ExitChip, Terminal, Stamp } from './components/telemetry';
export type {
  KeyValueItem,
  KeyValueProps,
  MetricProps,
  MeterProps,
  BarsProps,
  UptimeTick,
  UptimeProps,
  ExitCode,
  TerminalProps,
  StampProps,
} from './components/telemetry';

export { Tabs, Dialog } from './components/overlays';
export type { TabItem, TabsProps, DialogProps } from './components/overlays';

export { AppShell, AppBar, TabBar } from './components/app';
export type { AppShellProps, AppBarProps, TabBarItem, TabBarProps } from './components/app';

export { setTheme, getTheme } from './theme';
export type { Theme } from './theme';
