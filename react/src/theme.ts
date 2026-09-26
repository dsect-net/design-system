/**
 * Theme helpers. Light is the default (since 2026-09-26): a page with no
 * data-theme attribute renders light. Set data-theme="dark" on <html> for the
 * dark set from tokens.css.
 */

export type Theme = 'dark' | 'light';

export function setTheme(theme: Theme): void {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}
