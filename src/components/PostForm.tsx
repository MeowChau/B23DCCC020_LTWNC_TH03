'use client';

import { useActionState } from 'react';
import type { ReactNode } from 'react';
import { CATEGORIES, KINDS, PLACES } from '@/data/posts';
import { CONTACT_TYPES } from '@/lib/post-validate';
import type { PostFormState, PostInput } from '@/lib/post-validate';

type PostAction = (prev: PostFormState, formData: FormData) => Promise<PostFormState>;
const initialState: PostFormState = { errors: {}, values: {} };

function Field({ name, label, error, full, children }: {
  name: keyof PostInput; label: string; error?: string; full?: boolean; children: ReactNode;
}) {
  return <div className={full ? 'field field-full' : 'field'}>
    <label htmlFor={`post-${name}`}>{label}</label>
    {children}
    {error && <p id={`post-${name}-error`} className="form-errors" role="alert">{error}</p>}
  </div>;
}

export function PostForm({ action }: { action: PostAction }) {
  const [state, formAction, pending] = useActionState(action, initialState);
  function attributes(name: keyof PostInput) {
    return {
      name, id: `post-${name}`,
      defaultValue: state.values[name] ?? (name === 'contactType' ? 'Zalo' : ''),
      'aria-invalid': Boolean(state.errors[name]),
      'aria-describedby': state.errors[name] ? `post-${name}-error` : undefined,
    };
  }
  const selectors = [
    { name: 'kind', label: 'Loại tin', options: KINDS },
    { name: 'category', label: 'Danh mục', options: CATEGORIES },
    { name: 'place', label: 'Địa điểm', options: PLACES },
  ] as const;
  return (
    <form key={JSON.stringify(state.values)} action={formAction} className="post-form" noValidate>
      <div className="form-grid">
        <Field name="title" label="Tiêu đề" error={state.errors.title} full>
          <input {...attributes('title')} placeholder="Ví dụ: Mất ví da màu nâu" />
        </Field>
        {selectors.map(({ name, label, options }) => <Field key={name} name={name} label={label} error={state.errors[name]}>
          <select {...attributes(name)}>
            <option value="">-- Chọn --</option>
            {options.map((option) => <option key={option}>{option}</option>)}
          </select>
        </Field>)}
        <Field name="date" label="Ngày" error={state.errors.date}>
          <input {...attributes('date')} type="date" />
        </Field>
        <Field name="description" label="Mô tả" error={state.errors.description} full>
          <textarea {...attributes('description')} placeholder="Mô tả món đồ và nơi bạn mất hoặc nhặt được." rows={3} />
        </Field>
        <Field name="contactType" label="Loại liên hệ" error={state.errors.contactType}>
          <select {...attributes('contactType')}>
            {CONTACT_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
        </Field>
        <Field name="contact" label="Thông tin liên hệ" error={state.errors.contact}>
          <input {...attributes('contact')} />
        </Field>
      </div>
      <button type="submit" className="button" disabled={pending}>{pending ? 'Đang gửi…' : 'Đăng tin'}</button>
      {state.message && <p className={state.ok ? 'form-message success' : 'form-message'} role={state.ok ? 'status' : 'alert'}>
        {state.message}
      </p>}
    </form>
  );
}
