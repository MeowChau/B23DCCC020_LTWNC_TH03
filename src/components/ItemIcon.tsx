import type { Category } from '@/types';

export function ItemIcon({ category, className = '' }: { category: Category; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {category === 'Thẻ sinh viên' && <><rect x="7" y="12" width="34" height="25" rx="3" /><path d="M7 19h34M28 26h7M28 31h5" /><circle cx="17" cy="27" r="3" /><path d="M12 34c0-5 10-5 10 0" /></>}
      {category === 'Ví – giấy tờ' && <><path d="M9 14h27v23H9a3 3 0 0 1-3-3V14a4 4 0 0 1 4-4h23v4M6 17h30" /><path d="M28 23h12v9H28z" /><circle cx="32" cy="27.5" r=".8" /></>}
      {category === 'Điện thoại' && <><rect x="14" y="5" width="20" height="38" rx="4" /><path d="M20 10h8M15 35h18M23 39h2" /></>}
      {category === 'Chìa khóa' && <><circle cx="18" cy="16" r="9" /><circle cx="16" cy="14" r="2" /><path d="m24 23 15 15-4 4-4-4 2-2-4-4-2 2-4-4 2-2" /></>}
      {category === 'Khác' && <><path d="M10 26v-5a14 14 0 0 1 28 0v5" /><rect x="7" y="24" width="8" height="14" rx="4" /><rect x="33" y="24" width="8" height="14" rx="4" /><path d="M37 38c-2 5-6 5-12 5" /></>}
    </svg>
  );
}
