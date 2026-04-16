import type { PaginatedResponse, Product } from '@/types/db';
import type { CreateProductDto, UpdateProductDto } from '@/services/product.service';

import { ref } from 'vue';
import { useToastStore } from '@/stores/toast.store';
import { ProductService } from '@/services/product.service';
import type { BasicSearch } from '@/components/filters/types';

export function useProducts() {
  const toast = useToastStore();

  const productsData = ref<PaginatedResponse<Product>>({
    data: [],
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  });
  const product = ref<Product | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchProducts(query?: BasicSearch) {
    loading.value = true;
    error.value = null;
    try {
      productsData.value = await ProductService.getAll(query);
    } catch (e) {
      error.value = (e as Error).message;
      toast.error(error.value, 6000);
    } finally {
      loading.value = false;
    }
  }

  async function fetchProduct(id: number) {
    loading.value = true;
    error.value = null;
    try {
      product.value = await ProductService.getOne(id);
    } catch (e) {
      error.value = (e as Error).message;
      toast.error('No se pudieron cargar los productos');
    } finally {
      loading.value = false;
    }
  }

  async function createProduct(dto: CreateProductDto): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      const created = await ProductService.create(dto);
      productsData.value.data.push(created);
      toast.success('Producto Creado Correctamente');
      return true;
    } catch (e) {
      error.value = (e as Error).message;
      toast.error((e as Error).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function updateProduct(id: number, dto: UpdateProductDto): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      const updated = await ProductService.update(id, dto);
      const idx = productsData.value.data.findIndex((p) => p.id == id);
      if (idx !== -1) productsData.value.data[idx] = updated;
      toast.success('Producto Actualizado Correctamente');
      return true;
    } catch (e) {
      error.value = (e as Error).message;
      toast.error((e as Error).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteProduct(id: number): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      await ProductService.delete(id);
      productsData.value.data = productsData.value.data.filter((p) => p.id !== id);
      toast.success('Producto Desactivado Correctamente');
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
    productsData,
    product,
    loading,
    error,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
