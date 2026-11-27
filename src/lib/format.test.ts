import { expect, it } from 'vitest';
import { formatDate, formatTime } from './format';

it('định dạng ngày theo thứ tự ngày, tháng, năm', () => {
  expect(formatDate('2026-11-05')).toBe('05/11/2026');
});

it('hiển thị thời điểm theo giờ Việt Nam', () => {
  expect(formatTime(new Date('2026-11-05T08:02:03Z'))).toBe('15:02:03');
});
