import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

/**
 * Buttons — thin wrappers over the canonical `.btn` / `.icon-btn` classes in
 * base.css. Every interactive control keeps the 44px touch-target floor; radius
 * is always var(--radius).
 */

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'md' | 'sm';

type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

type GhostButtonProps = BaseButtonProps & {
  variant: 'ghost';
  size?: 'sm';
};

type StandardButtonProps = BaseButtonProps & {
  variant?: Exclude<ButtonVariant, 'ghost'>;
  size?: ButtonSize;
};

export type ButtonProps = GhostButtonProps | StandardButtonProps;

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  // base.css defines ghost only alongside btn-small
  ghost: 'btn-small ghost',
};

/** Standard button. `primary` uses the ink tokens; `outline` is transparent. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className = '', type = 'button', children, ...rest },
  ref,
) {
  const classes = ['btn', variantClass[variant], size === 'sm' && variant !== 'ghost' ? 'btn-small' : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      {children}
    </button>
  );
});

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: icon-only buttons have no visible label. */
  label: string;
  children: ReactNode;
}

/** 44px square icon button. Always pass a meaningful `label`. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, className = '', type = 'button', children, ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} aria-label={label} className={['icon-btn', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </button>
  );
});
