export type NumericBoolean = 1 | 0;

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'cancelled';

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

export type Product = {
  id: number;
  name: string;
  code: string;
  description: string | null;
  price: number;
  normalPrice: number | null;
  maxQuantity: number | null;
  imageName: string | null;
  imageThumbnailUrl: string | null;
  imageFullUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface ProductCard {
  id: number;
  name: string;
  code: string;
  price: number;
  imageThumbnailUrl: string | null;
  maxQuantity: number | null;
  isActive: boolean;
}

// _____________________ ORDENES __________________________

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  orderId: number;
  productId: number;
  status: ItemStatus;
}

export type OrderItemFull = {
  id: number;
  quantity: number;
  unitPrice: number;
  status: ItemStatus;
  orderId: number;
  product: {
    id: number;
    name: string;
    code: string;
    imageThumbnailUrl: string | null;
  };
  orderResolved?: OrderStatus;
};

export type ItemStatus = 'pending' | 'ready' | 'unavailable';

// Tipo individual de un item con su producto expandido

export interface Order {
  id: number;
  status: OrderStatus;
  total: number;
  notes: string | null;
  customerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFull {
  id: number;
  status: OrderStatus;
  total: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  items: OrderItemFull[];
}

export interface CreateOrderItemDto {
  productId: number;
  quantity: number;
}

export interface CreateOrderDto {
  notes?: string;
  items: CreateOrderItemDto[];
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

// _____________________________________________________________

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

export interface DashboardSummary {
  sales: { today: number; changePercent: number };
  orders: { today: number; pending: number };
  products: { activeCount: number };
  customers: { activeCount: number; newThisWeek: number };
  recentOrders: {
    id: number;
    status: string;
    total: number;
    createdAt: string;
    customer: { id: number; name: string };
  }[];
  topProducts: {
    productId: number;
    code: string;
    name: string;
    soldQty: number;
    revenue: number;
  }[];
}

// _______________ EXCEL TYPES UPLOAD ______________

export interface SkippedRow {
  rowNumber: number;
  reason: string;
  rawData: unknown[];
}

export interface ImportingExcelResult {
  message: string;
  summary: {
    deactivated: number;
    imported: number;
    skipped: number;
    total: number;
    updated: number;
  };
  errors?: SkippedRow[];
}

// __________ PAGINATION _____________

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
