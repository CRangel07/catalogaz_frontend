export type NumericBoolean = 1 | 0;

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Admin {
  id: number;
  name: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  description: string | null;
  price: number;
  stock: number;
  imageName: string | null;
  imageThumbnailUrl: string | null;
  imageFullUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCard {
  id: number;
  name: string;
  code: string;
  price: number;
  stock: number;
  imageThumbnailUrl: string | null;
  isActive: boolean;
}

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  orderId: number;
  productId: number;
}

export interface Order {
  id: number;
  status: OrderStatus;
  total: number;
  notes: string | null;
  customerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemWithProduct {
  id: number;
  quantity: number;
  unitPrice: number;
  product: Product;
}

export interface OrderFull {
  id: number;
  status: OrderStatus;
  total: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  items: OrderItemWithProduct[];
}

export interface CreateOrderItemDto {
  productId: number;
  quantity: number;
}

export interface CreateOrderDto {
  customerId: number;
  notes?: string;
  items: CreateOrderItemDto[];
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface CreateProductDto {
  name: string;
  code: string;
  description?: string;
  price: number;
  stock?: number;
  imageName?: string;
  imageThumbnailUrl?: string;
  imageFullUrl?: string;
}

export interface UpdateProductDto {
  name?: string;
  code?: string;
  description?: string;
  price?: number;
  stock?: number;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
