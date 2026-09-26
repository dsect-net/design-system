import type { HTMLAttributes, ReactNode } from 'react';

/**
 * App shell — `.app`, `.appbar`, `.tabbar` from components.css.
 *
 * For the hub as an installed, standalone phone app. The page needs
 * `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
 * or the safe-area insets are all 0. The tab bar renders only below 760px (where
 * the sidenav stops), and a page uses it OR a hamburger drawer — never both.
 * Bottom sheets are `<Dialog variant="sheet">`.
 */

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  appBar?: ReactNode;
  tabBar?: ReactNode;
  children: ReactNode;
}

export function AppShell({ appBar, tabBar, className = '', children, ...rest }: AppShellProps) {
  return (
    <div className={['app', className].filter(Boolean).join(' ')} {...rest}>
      {appBar}
      <main className="app__main">{children}</main>
      {tabBar}
    </div>
  );
}

export interface AppBarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  /** Mono micro-line under the title: "Quantum · full node". */
  subtitle?: ReactNode;
  /** Before the title, e.g. a back IconButton. */
  leading?: ReactNode;
  /** After the title: IconButtons. */
  actions?: ReactNode;
}

export function AppBar({ title, subtitle, leading, actions, className = '', ...rest }: AppBarProps) {
  return (
    <header className={['appbar', className].filter(Boolean).join(' ')} {...rest}>
      {leading}
      <h1 className="appbar__title">
        {title}
        {subtitle && <span className="appbar__sub">{subtitle}</span>}
      </h1>
      {actions}
    </header>
  );
}

export interface TabBarItem {
  id: string;
  label: ReactNode;
  /** A 22px icon; decorative — the label names the tab. */
  icon: ReactNode;
  /** Renders a link when set, otherwise a button (e.g. "More" opening a sheet). */
  href?: string;
  onSelect?: () => void;
  /** Count or status, e.g. <Badge tone="warn" size="sm">1</Badge>. */
  badge?: ReactNode;
}

export interface TabBarProps extends HTMLAttributes<HTMLElement> {
  items: TabBarItem[];
  /** id of the current tab: gets aria-current="page" and the emerald mark. */
  current?: string;
  /** Accessible name of the nav landmark. */
  label?: string;
}

export function TabBar({ items, current, label = 'Primary', className = '', ...rest }: TabBarProps) {
  return (
    <nav className={['tabbar', className].filter(Boolean).join(' ')} aria-label={label} {...rest}>
      {items.map((it) => {
        const here = it.id === current ? 'page' : undefined;
        const inner = (
          <>
            <span aria-hidden="true" style={{ display: 'contents' }}>
              {it.icon}
            </span>
            {it.label}
            {it.badge}
          </>
        );
        return it.href ? (
          <a key={it.id} href={it.href} aria-current={here} onClick={it.onSelect}>
            {inner}
          </a>
        ) : (
          <button key={it.id} type="button" aria-current={here} onClick={it.onSelect}>
            {inner}
          </button>
        );
      })}
    </nav>
  );
}
