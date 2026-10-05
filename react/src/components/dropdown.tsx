import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Avatar } from './status';

/**
 * Dropdown — DSECT-styled dropdown menu.
 *
 * Adapted from Untitled UI's DropdownAvatar pattern, rebuilt with DSECT
 * design tokens and without external dependencies (no react-aria).
 *
 * Uses native <details> for accessibility where possible, with React state
 * for controlled behavior.
 */

export interface DropdownItem {
  id: string;
  label: ReactNode;
  /** Icon element to show before the label. */
  icon?: ReactNode;
  /** Keyboard shortcut hint (e.g., "⌘K"). */
  shortcut?: string;
  onSelect?: () => void;
}

export interface DropdownProps {
  /** The trigger element (e.g., an Avatar button). */
  trigger: ReactNode;
  /** Menu items. */
  items: DropdownItem[];
  /** Optional header content (e.g., user info). */
  header?: ReactNode;
  /** Optional footer content (e.g., sign out button). */
  footer?: ReactNode;
  className?: string;
}

export function Dropdown({ trigger, items, header, footer, className = '' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={['dropdown', className].filter(Boolean).join(' ')} data-open={open}>
      <button
        type="button"
        className="dropdown__trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {trigger}
      </button>
      {open && (
        <div className="dropdown__menu" role="menu">
          {header && <div className="dropdown__header">{header}</div>}
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="dropdown__item"
              role="menuitem"
              onClick={() => {
                item.onSelect?.();
                setOpen(false);
              }}
            >
              {item.icon && <span className="dropdown__item-icon">{item.icon}</span>}
              <span className="dropdown__item-label">{item.label}</span>
              {item.shortcut && <kbd className="dropdown__item-shortcut">{item.shortcut}</kbd>}
            </button>
          ))}
          {footer && <div className="dropdown__footer">{footer}</div>}
        </div>
      )}
    </div>
  );
}

/**
 * AvatarDropdown — User account menu with avatar trigger.
 *
 * DSECT adaptation of Untitled UI's DropdownAvatar component.
 * Shows user info header, menu items, and optional footer actions.
 */

export interface AvatarDropdownProps {
  /** User's display name. */
  name: string;
  /** User's email or subtitle. */
  email?: string;
  /** Avatar image URL. */
  avatarSrc?: string;
  /** Online status indicator. */
  status?: 'online' | 'offline' | 'away';
  /** Menu items. */
  items: DropdownItem[];
  /** Footer content (e.g., Sign out button). */
  footer?: ReactNode;
  className?: string;
}

export function AvatarDropdown({
  name,
  email,
  avatarSrc,
  status,
  items,
  footer,
  className = '',
}: AvatarDropdownProps) {
  return (
    <Dropdown
      className={['avatar-dropdown', className].filter(Boolean).join(' ')}
      trigger={<Avatar name={name} src={avatarSrc} size="sm" />}
      header={
        <div className="avatar-dropdown__user">
          <Avatar name={name} src={avatarSrc} size="md" />
          <div className="avatar-dropdown__user-info">
            <div className="avatar-dropdown__user-name">
              {name}
              {status && (
                <span className={`status-dot status-dot--${status}`} aria-label={status} />
              )}
            </div>
            {email && <div className="avatar-dropdown__user-email">{email}</div>}
          </div>
        </div>
      }
      items={items}
      footer={footer}
    />
  );
}
