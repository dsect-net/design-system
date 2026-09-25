import type { HTMLAttributes, LiHTMLAttributes, ReactNode } from 'react';
import { Badge, type Tone } from './feedback';

/**
 * State, records and the fleet — `.state`, `.record`, `.avatar`, `.agent`
 * from components.css.
 *
 * Colour is never the only carrier: each state has its own shape (and, when
 * live, its own motion), and the label always names it. A state indicator must
 * keep rendering when the thing it describes is down — "stopped" and "unknown"
 * are states it reports, not failures it suffers.
 */

export type AgentState = 'ready' | 'busy' | 'degraded' | 'stopped' | 'alert' | 'unknown';

const stateLabel: Record<AgentState, string> = {
  ready: 'Ready',
  busy: 'Busy',
  degraded: 'Degraded',
  stopped: 'Stopped',
  alert: 'Operator required',
  unknown: 'Unknown',
};

export interface StateIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  state: AgentState;
  /** Say it in the domain's words: "Thinking", "Syncing", "Offline". Defaults per state. */
  children?: ReactNode;
}

export function StateIndicator({ state, className = '', children, ...rest }: StateIndicatorProps) {
  return (
    <span className={['state', `state--${state}`, className].filter(Boolean).join(' ')} {...rest}>
      <i className="state__dot" aria-hidden="true" />
      {children ?? stateLabel[state]}
    </span>
  );
}

/** The Codex goal lifecycle, plus the ADR outcomes. */
export type Lifecycle = 'draft' | 'active' | 'pending-review' | 'completed' | 'archived' | 'ratified' | 'superseded';

const lifecycle: Record<Lifecycle, { tone: Tone; label: string }> = {
  draft: { tone: 'neutral', label: 'Draft' },
  active: { tone: 'info', label: 'Active' },
  'pending-review': { tone: 'warn', label: 'Pending review' },
  completed: { tone: 'ok', label: 'Completed' },
  ratified: { tone: 'ok', label: 'Ratified' },
  archived: { tone: 'slate', label: 'Archived' },
  superseded: { tone: 'slate', label: 'Superseded' },
};

export function Records({ className = '', children, ...rest }: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={['records', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </ul>
  );
}

export interface RecordRowProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'id' | 'title'> {
  /** "HUB-001", "ADR-012". Rendered mono; not the DOM id. */
  recordId: ReactNode;
  codename?: ReactNode;
  title: ReactNode;
  /** Phase, dates — and for superseded records, the successor pointer. */
  meta?: ReactNode;
  status: Lifecycle;
  /** Override the status wording; the tone still follows `status`. */
  statusLabel?: ReactNode;
}

export function RecordRow({ recordId, codename, title, meta, status, statusLabel, className = '', ...rest }: RecordRowProps) {
  const s = lifecycle[status];
  const muted = status === 'archived' || status === 'superseded';
  return (
    <li className={['record', muted ? 'record--archived' : '', className].filter(Boolean).join(' ')} {...rest}>
      <span className="record__id">{recordId}</span>
      <div>
        <div className="record__title">
          {codename && <span className="record__codename">{codename}</span>}
          {title}
        </div>
        {meta && <div className="record__meta">{meta}</div>}
      </div>
      <Badge tone={s.tone}>{statusLabel ?? s.label}</Badge>
    </li>
  );
}

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Used for the monogram fallback. */
  name: string;
  /** Portrait, cropped to the circle. Decorative — the name is shown beside it. */
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ name, src, size = 'md', className = '', ...rest }: AvatarProps) {
  return (
    <span className={['avatar', size !== 'md' ? `avatar--${size}` : '', className].filter(Boolean).join(' ')} aria-hidden="true" {...rest}>
      {src ? <img src={src} alt="" /> : name.trim().charAt(0)}
    </span>
  );
}

export interface AgentCardProps extends HTMLAttributes<HTMLElement> {
  name: string;
  /** What the agent does: "Ecosystem orchestrator". (Not `role`, which is the ARIA attribute.) */
  description: ReactNode;
  state: AgentState;
  stateLabel?: ReactNode;
  avatarSrc?: string;
  /** Mono meta row: [["Node", "Tritium"], ["Tier", "Full"]]. */
  meta?: Array<[ReactNode, ReactNode]>;
}

export function AgentCard({ name, description, state, stateLabel: label, avatarSrc, meta, className = '', ...rest }: AgentCardProps) {
  return (
    <article className={['agent', className].filter(Boolean).join(' ')} {...rest}>
      <Avatar name={name} src={avatarSrc} />
      <div>
        <div className="agent__head">
          <span className="agent__name">{name}</span>
          <StateIndicator state={state}>{label}</StateIndicator>
        </div>
        <div className="agent__role">{description}</div>
        {meta && meta.length > 0 && (
          <div className="agent__meta">
            {meta.map(([k, v], i) => (
              <span key={i}>
                {k} <b>{v}</b>
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
