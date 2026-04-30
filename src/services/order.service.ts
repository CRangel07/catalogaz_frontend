import { http } from './http';
import type { CreateOrderDto, OrderFull, OrderItemFull, UpdateOrderStatusDto } from '@/types/db';

const BASE = '/orders';

// ─── Tipos del service ────────────────────────────────────────────────────────

export type ItemStatus = 'pending' | 'ready' | 'unavailable';

export interface UpdateItemStatusDto {
  status: ItemStatus;
  actualQty?: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

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
    return http<OrderFull>(BASE, { method: 'POST', body: dto });
  },

  update(id: number, dto: UpdateOrderStatusDto): Promise<OrderFull> {
    return http<OrderFull>(`${BASE}/${id}/status`, { method: 'PATCH', body: dto });
  },

  // PATCH /orders/:orderId/items/:itemId/status
  updateItemStatus(
    orderId: number,
    itemId: number,
    status: ItemStatus,
    actualQty?: number
  ): Promise<OrderItemFull> {
    return http<OrderItemFull>(`${BASE}/${orderId}/items/${itemId}/status`, {
      method: 'PATCH',
      body: { status, ...(actualQty !== undefined && { actualQty }) } satisfies UpdateItemStatusDto,
    });
  },

  delete(id: number): Promise<void> {
    return http<void>(`${BASE}/${id}`, { method: 'DELETE' });
  },
};
