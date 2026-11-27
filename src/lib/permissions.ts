import type { Role } from '@/types';

export type Action = 'post:view' | 'post:create' | 'post:resolve' | 'post:moderate';

export function can(role: Role | undefined, action: Action): boolean {
  if (action === 'post:view') return true;
  if (action === 'post:moderate') return role === 'admin';
  return role === 'member' && (action === 'post:create' || action === 'post:resolve');
}
