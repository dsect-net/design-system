/**
 * Theme helpers. The system is dark-first: dark is the default (no attribute).
 * Set `data-theme="light"` on <html> for the light theme from tokens.css.
 */

export type Theme = 'dark' | 'light';

export function setTheme(theme: Theme): void {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}
