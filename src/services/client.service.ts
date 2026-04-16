import { http } from './http';

import type { Customer, PaginatedResponse } from '@/types/db';

export interface CreateCustomerDto {
  name: string;
  phone: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

export const CustomerService = {
  getAll(): Promise<PaginatedResponse<Customer>> {
    return http<PaginatedResponse<Customer>>('/customers');
  },

  getOne(id: number): Promise<Customer> {
    return http<Customer>(`/customers/${id}`);
  },

  create(dto: CreateCustomerDto): Promise<Customer> {
    return http<Customer>('/customers', { method: 'POST', body: dto });
  },

  update(id: number, dto: UpdateCustomerDto): Promise<Customer> {
    return http<Customer>(`/customers/${id}`, { method: 'PATCH', body: dto });
  },

  delete(id: number): Promise<void> {
    return http<void>(`/customers/${id}`, { method: 'DELETE' });
  },
};
