export const THEME_KEY = 'ptit-found-theme';
const THEME_EVENT = 'ptit-found-theme-change';
const DARK_PREFERENCE = '(prefers-color-scheme: dark)';

type Theme = 'light' | 'dark';

export const themeInitScript = `try {
  const theme = localStorage.getItem(${JSON.stringify(THEME_KEY)});
  if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
} catch {}`;

export function getTheme(): Theme {
  const theme = document.documentElement.dataset.theme;
  if (theme === 'light' || theme === 'dark') return theme;
  return window.matchMedia(DARK_PREFERENCE).matches ? 'dark' : 'light';
}

export function subscribeToTheme(listener: () => void) {
  const preference = window.matchMedia(DARK_PREFERENCE);

  function handleStorage(event: StorageEvent) {
    if (event.key !== THEME_KEY && event.key !== null) return;
    if (event.newValue === 'light' || event.newValue === 'dark') {
      document.documentElement.dataset.theme = event.newValue;
    } else {
      delete document.documentElement.dataset.theme;
    }
    listener();
  }

  preference.addEventListener('change', listener);
  window.addEventListener('storage', handleStorage);
  window.addEventListener(THEME_EVENT, listener);
  return () => {
    preference.removeEventListener('change', listener);
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(THEME_EVENT, listener);
  };
}

export function toggleTheme() {
  const next = getTheme() === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // The selected theme still applies when browser storage is disabled.
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}
