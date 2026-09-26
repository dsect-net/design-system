import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Brand layer — `.wordmark`, `.division`, `.rule` from components.css.
 *
 * ADR-012 (ratified 2026-09-23): the name is DSECT in all text. DSECT// is a
 * visual treatment only, so the `//` is rendered aria-hidden by construction —
 * screen readers, search and copy-paste always get "DSECT".
 *
 * This does not draw a logo. Logo artwork lands in brand/ as image files; pass
 * it as `children` to replace the typographic treatment when it does.
 */

export interface WordmarkProps extends HTMLAttributes<HTMLElement> {
  /** Division or product descriptor, set in Ice: "Labs", "Hub". */
  descriptor?: ReactNode;
  /**
   * Show the `//`. Instruments (Tier 4) carry a bare codename and no cut:
   * `<Wordmark name="Nebula" cut={false} />`.
   */
  cut?: boolean;
  /** Defaults to "DSECT". Only instruments change it. */
  name?: ReactNode;
  size?: 'md' | 'lg' | 'xl';
  /** Renders an <a> when set. */
  href?: string;
  /** Artwork (an <img alt="DSECT">) replaces the typographic treatment. */
  children?: ReactNode;
}

export function Wordmark({ descriptor, cut = true, name = 'DSECT', size = 'md', href, className = '', children, ...rest }: WordmarkProps) {
  const cls = ['wordmark', size !== 'md' ? `wordmark--${size}` : '', className].filter(Boolean).join(' ');
  const content = children ?? (
    <>
      {name}
      {cut && <span className="wordmark__cut" aria-hidden="true">//</span>}
      {descriptor && <span className="wordmark__descriptor">{descriptor}</span>}
    </>
  );
  return href ? (
    <a className={cls} href={href} {...rest}>
      {content}
    </a>
  ) : (
    <span className={cls} {...rest}>
      {content}
    </span>
  );
}

export type Division = 'systems' | 'software' | 'labs';

const divisionName: Record<Division, string> = {
  systems: 'DSECT Systems',
  software: 'DSECT Software',
  labs: 'DSECT Labs',
};

export interface DivisionTagProps extends HTMLAttributes<HTMLSpanElement> {
  division: Division;
  /** Defaults to the division's written name, e.g. "DSECT Labs". */
  children?: ReactNode;
}

/** Square swatch + label. Square means identity; a circle means live state. */
export function DivisionTag({ division, className = '', children, ...rest }: DivisionTagProps) {
  return (
    <span className={['division', `division--${division}`, className].filter(Boolean).join(' ')} {...rest}>
      {children ?? divisionName[division]}
    </span>
  );
}

export interface RuleProps extends HTMLAttributes<HTMLHRElement> {
  /** The hairline broken by a `//` — for section boundaries. */
  cut?: boolean;
}

export function Rule({ cut = false, className = '', ...rest }: RuleProps) {
  return <hr className={['rule', cut ? 'rule--cut' : '', className].filter(Boolean).join(' ')} {...rest} />;
}
