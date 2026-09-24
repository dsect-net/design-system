import type { HTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

/**
 * Navigation patterns — `.steps`, `.sidenav`, `.filterbar` from components.css.
 *
 * The sidenav does NOT render below 760px (components.css hides it there):
 * mobile navigation is owned by the app shell, never duplicated.
 */

export interface Step {
  title: ReactNode;
  desc?: ReactNode;
  state: 'done' | 'current' | 'upcoming';
}

export interface StepsProps extends HTMLAttributes<HTMLOListElement> {
  steps: Step[];
  orientation?: 'h' | 'v';
}

export function Steps({ steps, orientation = 'h', className = '', ...rest }: StepsProps) {
  return (
    <ol className={['steps', orientation === 'v' ? 'steps--v' : 'steps--h', className].filter(Boolean).join(' ')} {...rest}>
      {steps.map((s, i) => (
        <li
          key={i}
          className={['steps__item', s.state === 'done' ? 'steps__item--done' : '', s.state === 'current' ? 'steps__item--current' : '']
            .filter(Boolean)
            .join(' ')}
          aria-current={s.state === 'current' ? 'step' : undefined}
        >
          <span className="steps__ind" aria-hidden="true">
            <span>{i + 1}</span>
          </span>
          <span className="steps__body">
            <span className="steps__title">{s.title}</span>
            <span className="steps__desc">{s.desc}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

export interface SideNavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface SideNavSection {
  heading?: string;
  items: SideNavItem[];
}

export interface SideNavProps extends HTMLAttributes<HTMLElement> {
  head?: ReactNode;
  sections: SideNavSection[];
  foot?: ReactNode;
  /** Icon rail: labels become accessible names + tooltips. */
  slim?: boolean;
}

export function SideNav({ head, sections, foot, slim = false, className = '', ...rest }: SideNavProps) {
  return (
    <nav aria-label="Primary" className={['sidenav', slim ? 'sidenav--slim' : '', className].filter(Boolean).join(' ')} {...rest}>
      {head && <div className="sidenav__head">{head}</div>}
      <div className="sidenav__body">
        {sections.map((sec, si) => (
          <div key={si}>
            {sec.heading && <p className="sidenav__sub">{sec.heading}</p>}
            {si > 0 && <hr className="sidenav__divider" />}
            {sec.items.map((item) => (
              <a
                key={item.href + item.label}
                href={item.href}
                className={item.active ? 'active' : undefined}
                aria-current={item.active ? 'page' : undefined}
                title={slim ? item.label : undefined}
                onClick={item.onClick}
              >
                {item.icon && (
                  <span className="sidenav__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span className="sidenav__label">{item.label}</span>
              </a>
            ))}
          </div>
        ))}
      </div>
      {foot && <div className="sidenav__foot">{foot}</div>}
    </nav>
  );
}

export interface FilterChipData {
  id: string;
  label: ReactNode;
}

export interface FilterBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Applied-filter chips with individual removal. */
  applied?: FilterChipData[];
  onRemoveFilter?: (id: string) => void;
  onClearAll?: () => void;
  clearLabel?: string;
  children: ReactNode;
}

export function FilterBar({
  applied = [],
  onRemoveFilter,
  onClearAll,
  clearLabel = 'Clear all',
  className = '',
  children,
  ...rest
}: FilterBarProps) {
  return (
    <div className={['filterbar', className].filter(Boolean).join(' ')} role="search" {...rest}>
      <div className="filterbar__content">{children}</div>
      {applied.length > 0 && (
        <div className="filterbar__applied">
          {applied.map((chip) => (
            <span key={chip.id} className="filter-chip">
              {chip.label}
              {onRemoveFilter && (
                <button type="button" aria-label={`Remove filter`} onClick={() => onRemoveFilter(chip.id)}>
                  ×
                </button>
              )}
            </span>
          ))}
          {onClearAll && (
            <button type="button" className="filterbar__clear" onClick={onClearAll}>
              {clearLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export interface FilterBarActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/** Right-hand actions zone of the filter bar. */
export function FilterBarActions({ className = '', children, ...rest }: FilterBarActionsProps) {
  return (
    <div className={['filterbar__actions', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

export type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export function SearchInput({ ...rest }: SearchInputProps) {
  return <input {...rest} type="search" aria-label={rest['aria-label'] ?? 'Search'} />;
}

export type FilterSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function FilterSelect({ children, ...rest }: FilterSelectProps) {
  return <select {...rest}>{children}</select>;
}
