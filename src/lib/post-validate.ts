import { CATEGORIES, KINDS, PLACES } from '@/data/posts';

export const CONTACT_TYPES = ['Zalo', 'SĐT', 'Email'] as const;

export interface PostInput {
  title: string;
  kind: string;
  category: string;
  place: string;
  date: string;
  description: string;
  contactType: string;
  contact: string;
}

export type PostErrors = Partial<Record<keyof PostInput, string>>;

export interface PostFormState {
  errors: PostErrors;
  values: Partial<PostInput>;
  message?: string;
  ok?: boolean;
}

export function toPostInput(raw: FormData | Partial<Record<keyof PostInput, unknown>>): PostInput {
  function read(key: keyof PostInput, fallback = '') {
    const value = raw instanceof FormData ? raw.get(key) : raw[key];
    return typeof value === 'string' ? value : fallback;
  }
  return {
    title: read('title'), kind: read('kind'), category: read('category'), place: read('place'),
    date: read('date'), description: read('description'), contactType: read('contactType', 'Zalo'),
    contact: read('contact'),
  };
}

export function today(): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
}

function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function validatePost(input: PostInput): PostErrors {
  const errors: PostErrors = {};
  const title = input.title.trim();
  if (title.length < 5) errors.title = 'Tiêu đề tối thiểu 5 ký tự';
  else if (title.length > 80) errors.title = 'Tiêu đề tối đa 80 ký tự';
  if (!KINDS.some((kind) => kind === input.kind)) errors.kind = 'Hãy chọn loại tin';
  if (!CATEGORIES.some((category) => category === input.category)) errors.category = 'Hãy chọn danh mục';
  if (!PLACES.some((place) => place === input.place)) errors.place = 'Hãy chọn địa điểm';
  if (!isCalendarDate(input.date)) errors.date = 'Hãy chọn ngày';
  else if (input.date > today()) errors.date = 'Ngày không được ở tương lai';
  if (input.description.trim().length < 20) errors.description = 'Mô tả tối thiểu 20 ký tự';

  const contact = input.contact.trim();
  switch (input.contactType) {
    case 'Zalo':
      if (!/^0\d{9}$/.test(contact)) errors.contact = 'Số Zalo gồm 10 chữ số, bắt đầu bằng 0';
      break;
    case 'SĐT':
      if (!/^0\d{9}$/.test(contact)) errors.contact = 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0';
      break;
    case 'Email':
      if (!/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(contact)) errors.contact = 'Email không hợp lệ';
      break;
    default:
      errors.contact = 'Hãy chọn loại liên hệ';
  }
  return errors;
}
