import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Feedback patterns — badges, empty states, toasts, loading indicators.
 * Canonical classes live in components.css; this file only maps them to props.
 *
 * Colour is never the only carrier of state: every badge/toast also states its
 * state in text, so it survives colour-blindness and monochrome screenshots.
 */

export type Tone = 'ok' | 'warn' | 'err' | 'info' | 'slate' | 'neutral';

const toneClass: Record<Tone, string> = {
  ok: 'badge--ok',
  warn: 'badge--warn',
  err: 'badge--err',
  info: 'badge--info',
  slate: 'badge--slate',
  neutral: '',
};

const toastToneClass: Record<Tone, string> = {
  ok: 'toast--ok',
  warn: 'toast--warn',
  err: 'toast--err',
  info: 'toast--info',
  slate: '', // muted is a badge state (archived, superseded); a toast is never muted
  neutral: '',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: 'md' | 'sm';
  /** Status dot before the label (uses the ::before modifier, no extra node). */
  dot?: boolean;
  /** Render a dismiss button. Label it for screen readers. */
  onDismiss?: () => void;
  dismissLabel?: string;
  children: ReactNode;
}

export function Badge({
  tone = 'neutral',
  size = 'md',
  dot = false,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={['badge', toneClass[tone], size === 'sm' ? 'badge--sm' : '', dot ? 'badge--dot' : '', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
      {onDismiss && (
        <button type="button" className="badge__close" aria-label={dismissLabel} onClick={onDismiss}>
          ×
        </button>
      )}
    </span>
  );
}

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Mono mark shown in the icon box (e.g. "∅", "?", "!"). No illustration set exists. */
  mark?: ReactNode;
  title: ReactNode;
  text?: ReactNode;
  actions?: ReactNode;
  /** Compact variant for inside a card. */
  inline?: boolean;
}

export function EmptyState({ mark, title, text, actions, inline = false, className = '', ...rest }: EmptyStateProps) {
  return (
    <div className={['empty', inline ? 'empty--inline' : '', className].filter(Boolean).join(' ')} {...rest}>
      {mark !== undefined && <div className="empty__mark">{mark}</div>}
      <div className="empty__title">{title}</div>
      {text && <div className="empty__text">{text}</div>}
      {actions && <div className="empty__actions">{actions}</div>}
    </div>
  );
}

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label for the loading region. */
  label?: string;
}

export function Spinner({ size = 'md', label = 'Loading', className = '', ...rest }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={['spinner', size === 'sm' ? 'spinner--sm' : '', size === 'lg' ? 'spinner--lg' : '', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  );
}

/** Labelled loading row: spinner + mono uppercase text. */
export function Loading({ className = '', children = 'loading', ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={['loading', className].filter(Boolean).join(' ')} role="status" {...rest}>
      <Spinner label="" />
      {children}
    </span>
  );
}

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** 0–100. Omit for indeterminate. */
  value?: number;
  label?: string;
}

export function ProgressBar({ value, label = 'Progress', className = '', ...rest }: ProgressBarProps) {
  const indeterminate = value === undefined;
  return (
    <div
      className={['progbar', indeterminate ? 'progbar--indeterminate' : '', className].filter(Boolean).join(' ')}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : Math.max(0, Math.min(100, value))}
      {...rest}
    >
      <i style={indeterminate ? undefined : { width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

/** Content placeholder for a shape whose data hasn't arrived yet. */
export function Skeleton({ className = '', style, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={['skel', 'skel--line', className].filter(Boolean).join(' ')} style={style} {...rest} />;
}

export interface ToastData {
  id: string;
  title: ReactNode;
  text?: ReactNode;
  tone?: Tone;
}

export interface ToastProps {
  toast: ToastData;
  onDismiss?: (id: string) => void;
}

const toastIcon: Record<Tone, string> = {
  ok: '✓',
  warn: '!',
  err: '×',
  info: 'i',
  slate: '•',
  neutral: '•',
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const tone = toast.tone ?? 'neutral';
  return (
    <div className={['toast', toastToneClass[tone]].filter(Boolean).join(' ')} role="status">
      <div className="toast__icon" aria-hidden="true">
        {toastIcon[tone]}
      </div>
      <div className="toast__body">
        <div className="toast__title">{toast.title}</div>
        {toast.text && <div className="toast__text">{toast.text}</div>}
      </div>
      {onDismiss && (
        <button type="button" className="toast__close" aria-label="Dismiss notification" onClick={() => onDismiss(toast.id)}>
          ×
        </button>
      )}
    </div>
  );
}

export interface ToasterProps {
  toasts: ToastData[];
  onDismiss?: (id: string) => void;
}

/**
 * Fixed toast stack. Renders the `#toastWrap` container from components.css —
 * render at most one per app (the positioning is ID-based and clears the
 * mobile orb). Auto-dismiss timing is the app's job; pass `onDismiss`.
 */
export function Toaster({ toasts, onDismiss }: ToasterProps) {
  if (toasts.length === 0) return null;
  return (
    <div id="toastWrap" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
