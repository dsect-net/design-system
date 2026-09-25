import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Cards and panels — `.card` / `.panel` from base.css.
 *
 * A card lifts on hover: it is a destination. A panel does not: it is a
 * container you read, not click through.
 */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Play the entrance animation on mount. */
  entering?: boolean;
  children: ReactNode;
}

export function Card({ entering = false, className = '', children, ...rest }: CardProps) {
  return (
    <div className={['card', entering ? 'is-entering' : '', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Panel({ className = '', children, ...rest }: PanelProps) {
  return (
    <div className={['panel', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

export function PanelHead({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['panel-head', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

export function PanelBody({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['panel-body', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}
