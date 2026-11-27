import { describe, expect, it } from 'vitest';
import { can } from './permissions';
import type { Action } from './permissions';

const actions: Action[] = ['post:view', 'post:create', 'post:resolve', 'post:moderate'];

describe('Quyền trên tin đăng', () => {
  it('khách chỉ được xem tin', () => {
    expect(actions.filter((action) => can(undefined, action))).toEqual(['post:view']);
  });
  it('thành viên được đăng tin và đánh dấu đã nhận lại', () => {
    expect(actions.filter((action) => can('member', action))).toEqual(['post:view', 'post:create', 'post:resolve']);
  });
  it('quản trị viên được kiểm duyệt và không được đăng hay đánh dấu tin', () => {
    expect(actions.filter((action) => can('admin', action))).toEqual(['post:view', 'post:moderate']);
  });
});
