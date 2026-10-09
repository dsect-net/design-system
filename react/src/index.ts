/**
 * @dsect/ui — React component layer for the DSECT design system.
 *
 * This package adds NO new visual decisions. Every class it renders comes from
 * the canonical CSS at the repo root (tokens.css, base.css, components.css),
 * which were extracted verbatim from the shipping hub UI. These imports emit
 * the published stylesheet that consumers load from `@dsect/ui/styles.css`.
 */

import '../../tokens.css';
import '../../base.css';
import '../../components.css';

export * from './lib';
export { Dropdown, AvatarDropdown } from './components/dropdown';
export type { DropdownItem, DropdownProps, AvatarDropdownProps } from './components/dropdown';
