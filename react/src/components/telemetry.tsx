import { Fragment } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

/**
 * Data and telemetry — `.kv`, `.metric`, `.meter`, `.bars`, `.uptime`,
 * `.term`, `.exit`, `.stamp` from components.css.
 *
 * A chart is never the only place a number lives: Bars and Uptime require a
 * `label` that states the summary in words (it becomes the aria-label).
 */

export interface KeyValueItem {
  label: ReactNode;
  value: ReactNode;
  /** Mono, tabular — for values a reader compares. */
  numeric?: boolean;
}

export interface KeyValueProps extends HTMLAttributes<HTMLDListElement> {
  items: KeyValueItem[];
}

export function KeyValue({ items, className = '', ...rest }: KeyValueProps) {
  return (
    <dl className={['kv', className].filter(Boolean).join(' ')} {...rest}>
      {items.map((it, i) => (
        <Fragment key={i}>
          <dt>{it.label}</dt>
          <dd className={it.numeric ? 'num' : undefined}>{it.value}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

export interface MetricProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  /** Include the direction in the text ("▲ 18 ms vs 24h"). */
  delta?: ReactNode;
  /** Sentiment is separate from direction: latency going up is 'bad'. */
  sentiment?: 'good' | 'bad';
}

export function Metric({ label, value, unit, delta, sentiment, className = '', ...rest }: MetricProps) {
  return (
    <div className={['metric', className].filter(Boolean).join(' ')} {...rest}>
      <span className="metric__label">{label}</span>
      <span className="metric__value">
        {value}
        {unit && <span className="metric__unit">{unit}</span>}
      </span>
      {delta && <span className={['metric__delta', sentiment ? `metric__delta--${sentiment}` : ''].filter(Boolean).join(' ')}>{delta}</span>}
    </div>
  );
}

export interface MeterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label: ReactNode;
  /** The reading in words and numbers: "38.4 / 48 GB · 80%". */
  value: ReactNode;
  /** 0–100, drives the bar only. */
  percent: number;
  level?: 'ok' | 'warn' | 'err';
}

export function Meter({ label, value, percent, level = 'ok', className = '', ...rest }: MeterProps) {
  const pct = Math.max(0, Math.min(100, percent));
  return (
    <div className={['meter', className].filter(Boolean).join(' ')} {...rest}>
      <span className="meter__label">{label}</span>
      <span className="meter__value">{value}</span>
      {/* the value text carries the number; the bar is its picture */}
      <div className={['progbar', level !== 'ok' ? `progbar--${level}` : ''].filter(Boolean).join(' ')} aria-hidden="true">
        <i style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export interface BarsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Normalised 0–1. */
  values: number[];
  /** The summary in words — required. */
  label: string;
  /** Mark a column hot (e.g. a peak) or down (e.g. a failure). */
  tone?: (value: number, index: number) => 'hot' | 'down' | undefined;
  size?: 'md' | 'lg';
}

export function Bars({ values, label, tone, size = 'md', className = '', ...rest }: BarsProps) {
  return (
    <div className={['bars', size === 'lg' ? 'bars--lg' : '', className].filter(Boolean).join(' ')} role="img" aria-label={label} {...rest}>
      {values.map((v, i) => {
        const t = tone?.(v, i);
        return <i key={i} className={t ? `is-${t}` : undefined} style={{ '--v': Math.max(0, Math.min(1, v)) } as CSSProperties} />;
      })}
    </div>
  );
}

export type UptimeTick = 'up' | 'warn' | 'down' | 'none';

export interface UptimeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  ticks: UptimeTick[];
  /** The summary in words — required: "90 days: 86 up, 2 degraded, 1 down". */
  label: string;
  /** Optional [start, middle, end] captions under the strip. */
  legend?: [ReactNode, ReactNode, ReactNode];
}

export function Uptime({ ticks, label, legend, className = '', ...rest }: UptimeProps) {
  return (
    <div className={className || undefined} {...rest}>
      <div className="uptime" role="img" aria-label={label}>
        {ticks.map((t, i) => (
          <i key={i} className={t === 'up' ? undefined : `is-${t}`} />
        ))}
      </div>
      {legend && (
        <div className="uptime__legend" aria-hidden="true">
          <span>{legend[0]}</span>
          <span>{legend[1]}</span>
          <span>{legend[2]}</span>
        </div>
      )}
    </div>
  );
}

/** The Quantum CLI contract: 0 ok · 1 warn · 2 error. */
export type ExitCode = 0 | 1 | 2;
const exitWord: Record<ExitCode, string> = { 0: 'ok', 1: 'warn', 2: 'error' };
const exitClass: Record<ExitCode, string> = { 0: 'exit--ok', 1: 'exit--warn', 2: 'exit--err' };

export function ExitChip({ code, className = '', ...rest }: { code: ExitCode } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={['exit', exitClass[code], className].filter(Boolean).join(' ')} {...rest}>
      exit {code} · {exitWord[code]}
    </span>
  );
}

export interface TerminalProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  exit?: ExitCode;
  /** Pre-formatted output; colour spans with t-ok / t-warn / t-err / t-dim / t-accent / t-prompt / t-cmd. */
  children: ReactNode;
}

export function Terminal({ title, exit, className = '', children, ...rest }: TerminalProps) {
  return (
    <figure className={['term', className].filter(Boolean).join(' ')} {...rest}>
      <figcaption className="term__bar">
        <span className="term__title">{title}</span>
        {exit !== undefined && <ExitChip code={exit} />}
      </figcaption>
      <pre className="term__body">
        <code>{children}</code>
      </pre>
    </figure>
  );
}

export interface StampProps extends HTMLAttributes<HTMLSpanElement> {
  /** Corner, relative to a parent with .has-stamp. */
  placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  /** Pop in (e.g. a freshly captured timestamp). */
  isNew?: boolean;
}

export function Stamp({ placement = 'top-start', isNew = false, className = '', children, ...rest }: StampProps) {
  const [edge, side] = placement.split('-');
  return (
    <span
      className={['stamp', side === 'end' ? 'stamp--end' : '', edge === 'bottom' ? 'stamp--bottom' : '', isNew ? 'is-new' : '', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </span>
  );
}
