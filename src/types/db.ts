export type NumericBoolean = 1 | 0;

// ─── Entidades de base de datos ──────────────────────────────────────────────

export interface Product {
  id: string;
  brand: string;
  name: string;
  description?: string | null;
  price: number;
  originalPrice?: number | null;
  imageUrl: string;
  available: NumericBoolean;
  detail?: string | null;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  status: NumericBoolean;
}

export type OrderStatus = 'pendiente' | 'preparacion' | 'listo' | 'cancelado';

export interface Order {
  id: string;
  clientName: string;
  items: string;
  status: OrderStatus;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'vendedor';
}
