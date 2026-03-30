import { ref } from 'vue';
import type { CreateProductDto, UpdateProductDto } from '@/services/product.service';
import type { Product } from '@/types/db';
import { ProductService } from '@/services/product.service';

export function useProducts() {
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
      return true;
    } catch (e) {
      error.value = (e as Error).message;
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
      const idx = products.value.findIndex((p) => p.id === id);
      if (idx !== -1) products.value[idx] = updated;
      return true;
    } catch (e) {
      error.value = (e as Error).message;
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
      return true;
    } catch (e) {
      error.value = (e as Error).message;
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
