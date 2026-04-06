import type { Product } from '@/types/db';
import type { CreateProductDto, UpdateProductDto } from '@/services/product.service';

import { ref } from 'vue';
import { useToastStore } from '@/stores/toast.store';
import { ProductService } from '@/services/product.service';

export function useProducts() {
  const toast = useToastStore();

  const products = ref<Product[]>([]);
  const product = ref<Product | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchProducts() {
    loading.value = true;
    error.value = null;
    try {
      products.value = await ProductService.getAll();
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
      products.value.push(created);
      toast.success('Producto Creado Correctamente');
      fetchProducts();
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
      const idx = products.value.findIndex((p) => p.id == id);
      if (idx !== -1) products.value[idx] = updated;
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
      products.value = products.value.filter((p) => p.id !== id);
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
    products,
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
