import type { CreateOrderDto, OrderFull, UpdateOrderStatusDto } from '@/types/db';

import { ref } from 'vue';
import { useToastStore } from '@/stores/toast.store';
import { OrderService } from '@/services/order.service';

export function useOrders() {
  const toast = useToastStore();

  const orders = ref<OrderFull[]>([]);
  const order = ref<OrderFull | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  async function fetchOrdersAdm() {
    loading.value = true;
    error.value = null;
    try {
      orders.value = await OrderService.getAllAdmin();
    } catch (e) {
      error.value = (e as Error).message;
      toast.error(error.value, 6000);
    } finally {
      loading.value = false;
    }
  }

  async function fetchOrdersCustomer() {
    loading.value = true;
    error.value = null;
    try {
      orders.value = await OrderService.getMyOrders();
    } catch (e) {
      error.value = (e as Error).message;
      toast.error(error.value, 6000);
    } finally {
      loading.value = false;
    }
  }

  async function fetchOrder(id: number) {
    loading.value = true;
    error.value = null;
    try {
      order.value = await OrderService.getOne(id);
    } catch (e) {
      error.value = (e as Error).message;
      toast.error('No se logró cargar la orden');
    } finally {
      loading.value = false;
    }
  }

  async function createOrder(dto: CreateOrderDto): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      const created = await OrderService.create(dto);
      orders.value.push(created);
      toast.success('Orden Creada Correctamente');
      return true;
    } catch (e) {
      error.value = (e as Error).message;
      toast.error((e as Error).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function updateOrder(id: number, dto: UpdateOrderStatusDto): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      const updated = await OrderService.update(id, dto);
      const idx = orders.value.findIndex((p) => p.id == id);
      if (idx !== -1) orders.value[idx] = updated;
      toast.success('Orden Actualizada Correctamente');
      return true;
    } catch (e) {
      error.value = (e as Error).message;
      toast.error((e as Error).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteOrder(id: number): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      await OrderService.delete(id);
      orders.value = orders.value.filter((p) => p.id !== id);
      toast.success('Orden Eliminada Correctamente');
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
    order,
    error,
    orders,
    loading,
    fetchOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    fetchOrdersAdm,
    fetchOrdersCustomer,
  };
}
