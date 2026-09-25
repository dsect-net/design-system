import { useEffect, useId, useRef, useState } from 'react';
import type { DialogHTMLAttributes, KeyboardEvent, ReactNode } from 'react';

/**
 * Tabs and dialogs — `.tabs`, `.modal`, `.drawer`, `.dialog__*` from
 * components.css.
 *
 * Dialogs are a native <dialog> opened with showModal(): focus is trapped, Esc
 * closes, the page behind is inert, and it renders in the top layer. The
 * command palette (`.palette`) is CSS-only for now; its combobox behaviour is
 * app-specific.
 */

export interface TabItem {
  id: string;
  label: ReactNode;
  /** Count or status shown after the label (e.g. a small Badge). */
  badge?: ReactNode;
  panel: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  /** Accessible name of the tablist. */
  label: string;
  /** Controlled selection. */
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, label, value, defaultValue, onChange, className = '' }: TabsProps) {
  const base = useId();
  const [inner, setInner] = useState(defaultValue ?? tabs[0]?.id);
  const selected = value ?? inner;
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (id: string, focus = false) => {
    if (value === undefined) setInner(id);
    onChange?.(id);
    if (focus) refs.current[tabs.findIndex((t) => t.id === id)]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
    if (n === null) return;
    e.preventDefault();
    select(tabs[(n + tabs.length) % tabs.length].id, true);
  };

  return (
    <div className={className || undefined}>
      <div className="tabs" role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${t.id}`}
            aria-selected={t.id === selected}
            aria-controls={`${base}-panel-${t.id}`}
            tabIndex={t.id === selected ? 0 : -1}
            onClick={() => select(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {t.label}
            {t.badge}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" id={`${base}-panel-${t.id}`} aria-labelledby={`${base}-tab-${t.id}`} tabIndex={0} hidden={t.id !== selected}>
          {t.panel}
        </div>
      ))}
    </div>
  );
}

export interface DialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'open' | 'onClose'> {
  open: boolean;
  /** Called for Esc, the close button, and a click on the backdrop. */
  onClose: () => void;
  /** 'modal' centres; 'drawer' slides in from the inline end. */
  variant?: 'modal' | 'drawer';
  title: ReactNode;
  closeLabel?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function Dialog({ open, onClose, variant = 'modal', title, closeLabel = 'Close', footer, className = '', children, ...rest }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={[variant, className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // the backdrop
      }}
      {...rest}
    >
      <div className="dialog__head">
        <h2 className="dialog__title" id={titleId}>
          {title}
        </h2>
        <button type="button" className="icon-btn" aria-label={closeLabel} onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="dialog__body">{children}</div>
      {footer && <div className="dialog__foot">{footer}</div>}
    </dialog>
  );
}
