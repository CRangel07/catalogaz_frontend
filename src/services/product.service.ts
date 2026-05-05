import { http } from './http';

import type {
  Product,
  ProductImage,
  UpdateProductDto,
  CreateProductDto,
  PaginatedResponse,
  ProductUnavailable,
  ImportingExcelResult,
  ProductLine,
} from '@/types/db';

export const ProductService = {
  getAll(query?: Record<string, unknown>): Promise<PaginatedResponse<Product>> {
    let paramsRecord: Record<string, string> = {};
    if (query) {
      paramsRecord = Object.entries(query).reduce(
        (acc, [k, v]) => {
          if (v === null || v === undefined) return acc;
          acc[k] = String(v);
          return acc;
        },
        {} as Record<string, string>
      );
    }
    const params = new URLSearchParams(paramsRecord);
    return http<PaginatedResponse<Product>>(`/products${query ? `?${params.toString()}` : ''}`);
  },

  getOne(id: number): Promise<Product> {
    return http<Product>(`/products/${id}`);
  },

  getLines(): Promise<ProductLine[]> {
    return http<ProductLine[]>(`/lines`);
  },

  getUnavailable(): Promise<PaginatedResponse<ProductUnavailable>> {
    return http<PaginatedResponse<ProductUnavailable>>(`/products/unavailable`);
  },

  create(dto: CreateProductDto & ProductImage): Promise<Product> {
    const form = new FormData();
    form.append('name', dto.name);
    form.append('code', dto.code);
    form.append('description', dto.description ?? '');
    form.append('price1', String(dto.price1));
    form.append('price4', String(dto.price4));
    form.append('image', dto.image ?? '');
    return http<Product>('/products', { method: 'POST', body: form });
  },

  update(id: number, dto: UpdateProductDto): Promise<Product> {
    const form = new FormData();
    if (dto.name) form.append('name', dto.name);
    if (dto.code) form.append('code', dto.code);
    if (dto.description) form.append('description', dto.description);
    if (dto.price1) form.append('price1', String(dto.price1));
    if (dto.price4) form.append('price4', String(dto.price4));
    if (dto.image) form.append('image', dto.image);
    form.append('isActive', String(dto.isActive));
    return http<Product>(`/products/${id}`, { method: 'PATCH', body: form });
  },

  delete(id: number): Promise<void> {
    return http<void>(`/products/${id}`, { method: 'DELETE' });
  },

  importProductsExcel(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return http.post<ImportingExcelResult>(`/products/import-excel`, formData);
  },

  importProducMatricial(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return http.post<unknown>(`/price-list/upload`, formData);
  },

  downloadProductsTemplate(): Promise<unknown> {
    return http<unknown>(`/products/excel-template`);
  },
};
