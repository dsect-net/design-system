import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

/**
 * Forms — `.input`, `.check-toggle` from base.css.
 *
 * Text inputs get the soft custom focus ring from base.css (the sharp
 * --focus-ring outline is reserved for non-text controls: on a 44px field it
 * reads as an error, not focus). iOS auto-zoom is already blocked at 16px.
 */

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, id, className = '', ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `tf-${autoId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <div>
      <label htmlFor={inputId} className="text-label" style={{ display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={['input', className].filter(Boolean).join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        {...rest}
      />
      {hint && !error && (
        <div id={hintId} className="text-small" style={{ marginTop: 6 }}>
          {hint}
        </div>
      )}
      {error && (
        <div id={errorId} className="text-small" style={{ marginTop: 6, color: 'var(--red)' }}>
          {error}
        </div>
      )}
    </div>
  );
});

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, error, id, className = '', ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `ta-${autoId}`;
  return (
    <div>
      <label htmlFor={inputId} className="text-label" style={{ display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <textarea
        ref={ref}
        id={inputId}
        className={className || undefined}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {hint && !error && (
        <div className="text-small" style={{ marginTop: 6 }}>
          {hint}
        </div>
      )}
      {error && (
        <div className="text-small" style={{ marginTop: 6, color: 'var(--red)' }}>
          {error}
        </div>
      )}
    </div>
  );
});

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: ReactNode;
  children: ReactNode;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, id, children, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `sel-${autoId}`;
  return (
    <div>
      <label htmlFor={inputId} className="text-label" style={{ display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <select ref={ref} id={inputId} {...rest}>
        {children}
      </select>
    </div>
  );
});

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
}

/** Custom checkbox from base.css (`.check-toggle`). Native look, tinted accent elsewhere. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className = '', ...rest },
  ref,
) {
  return (
    <label className={['check-toggle', className].filter(Boolean).join(' ')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <input ref={ref} type="checkbox" {...rest} />
      <span className="text-body">{label}</span>
    </label>
  );
});
