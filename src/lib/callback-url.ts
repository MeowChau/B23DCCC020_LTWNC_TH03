const base = 'http://ptit-found.local';

export function safeCallbackUrl(value: string): string {
  if (!value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u0020\u007f]/.test(value)) {
    return '/my-posts';
  }
  const url = new URL(value, base);
  if (url.origin !== base || url.pathname === '/login' || url.pathname.startsWith('/api/')) return '/my-posts';
  return url.pathname + url.search + url.hash;
}
