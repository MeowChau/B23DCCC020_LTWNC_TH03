'use client';

import { useSyncExternalStore } from 'react';
import { getTheme, subscribeToTheme, toggleTheme } from '@/lib/theme';

const getServerTheme = () => 'light' as const;

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme) === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Chế độ tối"
      aria-pressed={dark}
      title={dark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
    >
      <span className="theme-icon" aria-hidden="true" />
      <span className="theme-state" aria-hidden="true">{dark ? 'Tối' : 'Sáng'}</span>
    </button>
  );
}
