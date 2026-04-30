import type { Admin } from '@/types/db';

import { http } from './http';
import type { CreateAdmin, UpdateAdmin } from '@/types/validation';

const BASE = '/admin';

// ─── Service ──────────────────────────────────────────────────────────────────

export const AdminService = {
  getAll(): Promise<Admin[]> {
    return http.get<Admin[]>(BASE);
  },

  getOne(id: number): Promise<Admin> {
    return http<Admin>(`${BASE}/${id}`);
  },

  create(dto: CreateAdmin): Promise<Admin> {
    return http<Admin>(BASE, { method: 'POST', body: dto });
  },

  update(id: number, dto: UpdateAdmin): Promise<Admin> {
    return http<Admin>(`${BASE}/${id}`, { method: 'PATCH', body: dto });
  },

  delete(id: number): Promise<void> {
    return http<void>(`${BASE}/${id}`, { method: 'DELETE' });
  },
};
