/**
 * @dsect/ui — React component layer for the DSECT design system.
 *
 * This package adds NO new visual decisions. Every class it renders comes from
 * the canonical CSS at the repo root (tokens.css, base.css, components.css),
 * which were extracted verbatim from the shipping hub UI. These imports emit
 * the published stylesheet that consumers load from `@dsect/ui/styles.css`.
 */

import '../../tokens.css';
import '../../base.css';
import '../../components.css';

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

export { setTheme, getTheme } from './theme';
export type { Theme } from './theme';
