import { http } from './http';

import type { CreateOrderDto, OrderFull, UpdateOrderStatusDto } from '@/types/db';

const BASE = '/orders';

export const OrderService = {
  getAllAdmin(): Promise<OrderFull[]> {
    return http<OrderFull[]>(BASE);
  },

  getMyOrders(): Promise<OrderFull[]> {
    return http<OrderFull[]>(`${BASE}/my-orders`);
  },

  getOne(id: number): Promise<OrderFull> {
    return http<OrderFull>(`${BASE}/${id}`);
  },

  create(dto: CreateOrderDto): Promise<OrderFull> {
    return http<OrderFull>(`${BASE}`, { method: 'POST', body: dto });
  },

  update(id: number, dto: UpdateOrderStatusDto): Promise<OrderFull> {
    return http<OrderFull>(`${BASE}/${id}`, { method: 'PATCH', body: dto });
  },

  delete(id: number): Promise<void> {
    return http<void>(`${BASE}/${id}`, { method: 'DELETE' });
  },
};
