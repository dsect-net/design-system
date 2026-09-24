import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react';

/**
 * Operational tables — `.tbl-*` from components.css.
 *
 * On mobile the table scrolls horizontally inside its own wrapper rather than
 * collapsing to cards: for operational tables the column set IS the
 * information. Numeric cells render in mono with tabular numerals.
 */

export interface TableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  /** Mono micro-count shown beside the title (e.g. "26 services"). */
  count?: ReactNode;
  size?: 'md' | 'sm';
  footer?: ReactNode;
  children: ReactNode;
}

export function Table({ title, count, size = 'md', footer, className = '', children, ...rest }: TableProps) {
  return (
    <div className={['tbl-wrap', className].filter(Boolean).join(' ')} {...rest}>
      {(title || count) && (
        <div className="tbl-head">
          {title && <h3>{title}</h3>}
          {count && <span className="count">{count}</span>}
        </div>
      )}
      <div className="tbl-scroll">
        <table className={['tbl', size === 'sm' ? 'tbl--sm' : ''].filter(Boolean).join(' ')}>{children}</table>
      </div>
      {footer && <div className="tbl-foot">{footer}</div>}
    </div>
  );
}

export type SortDir = 'asc' | 'desc';

export interface ThProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Make the header sortable; renders the canonical sort button anatomy. */
  sortable?: boolean;
  sortDir?: SortDir;
  onSort?: () => void;
  sortLabel?: string;
  children: ReactNode;
}

export function Th({ sortable = false, sortDir, onSort, sortLabel = 'Sort', children, ...rest }: ThProps) {
  return (
    <th aria-sort={sortable ? (sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : 'none') : undefined} {...rest}>
      {sortable ? (
        <button type="button" data-sort={sortDir} aria-label={typeof children === 'string' ? `${sortLabel}: ${children}` : sortLabel} onClick={onSort}>
          {children}
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export interface TdProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Numeric data: mono, right-aligned, tabular numerals. */
  numeric?: boolean;
  /** Row actions: 44px touch targets, right-aligned, no wrap. */
  actions?: boolean;
  children: ReactNode;
}

export function Td({ numeric = false, actions = false, className = '', children, ...rest }: TdProps) {
  return (
    <td
      className={[numeric ? 'num' : '', actions ? 'actions' : '', className].filter(Boolean).join(' ') || undefined}
      {...rest}
    >
      {children}
    </td>
  );
}

/** User cell: avatar (initials or image) + name. */
export function TableUserCell({ name, avatar, initials }: { name: ReactNode; avatar?: string; initials?: string }) {
  return (
    <span className="tbl-cell-user">
      <span className="tbl-avatar" aria-hidden="true">
        {avatar ? <img src={avatar} alt="" /> : (initials ?? '??')}
      </span>
      <span>{name}</span>
    </span>
  );
}
