import {
  CustomerService,
  type CreateCustomerDto,
  type UpdateCustomerDto,
} from '@/services/client.service';

import type { Customer, PaginatedResponse } from '@/types/db';

import { ref } from 'vue';
import { useToastStore } from '@/stores/toast.store';

export function useCustomers() {
  const toast = useToastStore();

  const customers = ref<PaginatedResponse<Customer>>({
    data: [],
    limit: 0,
    page: 0,
    total: 0,
    totalPages: 0,
  });
  const customer = ref<Customer | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchCustomers() {
    loading.value = true;
    error.value = null;
    try {
      customers.value = await CustomerService.getAll();
    } catch (e) {
      error.value = (e as Error).message;
      toast.error(error.value, 6000);
    } finally {
      loading.value = false;
    }
  }

  async function fetchCustomer(id: number) {
    loading.value = true;
    error.value = null;
    try {
      customer.value = await CustomerService.getOne(id);
    } catch (e) {
      error.value = (e as Error).message;
      toast.error('No se pudieron cargar los clientes');
    } finally {
      loading.value = false;
    }
  }

  async function createCustomer(dto: CreateCustomerDto): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      const created = await CustomerService.create(dto);
      customers.value.data.push(created);
      toast.success('Cliente Creado Correctamente');
      return true;
    } catch (e) {
      error.value = (e as Error).message;
      toast.error((e as Error).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function updateCustomer(id: number, dto: UpdateCustomerDto): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      const updated = await CustomerService.update(id, dto);
      const idx = customers.value.data.findIndex((p) => p.id == id);
      if (idx !== -1) customers.value.data[idx] = updated;
      toast.success('Cliente Actualizado Correctamente');
      return true;
    } catch (e) {
      error.value = (e as Error).message;
      toast.error((e as Error).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteCustomer(id: number): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      await CustomerService.delete(id);
      customers.value.data = customers.value.data.filter((p) => p.id !== id);
      toast.success('Cliente Desactivado Correctamente');
      return true;
    } catch (e) {
      error.value = (e as Error).message;
      toast.error((e as Error).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    customers,
    customer,
    loading,
    error,
    fetchCustomers,
    fetchCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
