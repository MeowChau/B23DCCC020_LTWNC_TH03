'use client';

import { useActionState } from 'react';
import { loginAction } from '@/app/login/actions';

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, action, pending] = useActionState(loginAction, {});
  return (
    <form action={action} className="stack-form">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required />
      </div>
      <div className="field">
        <label htmlFor="password">Mật khẩu</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {state.error && <p className="form-message" role="alert">{state.error}</p>}
      <button className="button" type="submit" disabled={pending}>Đăng nhập</button>
    </form>
  );
}
