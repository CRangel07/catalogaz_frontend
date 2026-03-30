import { http } from './http';

import type { Product } from '@/types/db';

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  image: File;
}

export interface UpdateProductDto extends Partial<Omit<CreateProductDto, 'image'>> {
  image?: File;
}

export const ProductService = {
  getAll(): Promise<Product[]> {
    return http<Product[]>('/products');
  },

  getOne(id: number): Promise<Product> {
    return http<Product>(`/products/${id}`);
  },

  create(dto: CreateProductDto): Promise<Product> {
    const form = new FormData();
    form.append('name', dto.name);
    form.append('description', dto.description);
    form.append('price', String(dto.price));
    form.append('image', dto.image);
    return http<Product>('/products', { method: 'POST', body: form });
  },

  update(id: number, dto: UpdateProductDto): Promise<Product> {
    const form = new FormData();
    if (dto.name) form.append('name', dto.name);
    if (dto.description) form.append('description', dto.description);
    if (dto.price) form.append('price', String(dto.price));
    if (dto.image) form.append('image', dto.image);
    return http<Product>(`/products/${id}`, { method: 'PATCH', body: form });
  },

  delete(id: number): Promise<void> {
    return http<void>(`/products/${id}`, { method: 'DELETE' });
  },
};
