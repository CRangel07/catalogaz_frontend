export type NumericBoolean = 1 | 0;

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'cancelled';

// _____________________ ADMINISTRADORES __________________________

export type AdminRole = 'admin' | 'pedidos' | 'caja';

export interface Admin {
  name: string;
  id: number;
  username: string;
  password: string;
  role: AdminRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// _____________________ PRODUCTOS __________________________

export type Product = {
  name: string;
  code: string;
  description: string | null;
  price1: number;
  price4: number;
  salePrice: number | null;
  isOffer: boolean;
  maxQuantity: number | null;
  imageName: string | null;
  imageThumbnailUrl: string | null;
  imageFullUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  id: number;
  unitId: number | null;
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

export type CreateProductDto = Pick<
  Product,
  'name' | 'code' | 'description' | 'price1' | 'price4'
> & {
  imageName?: string;
  imageThumbnailUrl?: string;
  imageFullUrl?: string;
};

export type ProductImage = {
  image: File | null;
};

export type UpdateProductDto = Partial<CreateProductDto> &
  ProductImage & {
    isActive?: boolean;
  };

export interface ProductUnavailable {
  product: {
    name: string;
    code: string;
    imageThumbnailUrl: string | null;
  };
  quantity: number;
  order: {
    id: number;
    createdAt: Date;
  };
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
