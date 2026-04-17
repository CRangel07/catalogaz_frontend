import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { ProductCard } from '@/types/db';

export interface CartItem extends ProductCard {
  qty: number;
}

export const useCartStore = defineStore(
  'catalogaz_cart_store',
  () => {
    const items = ref<CartItem[]>([]);
    const isOpen = ref(false);
    const isConfirmed = ref(false);
    const MIN_QTY = 1;
    const MAX_QTY = 999;

    const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.qty, 0));

    const totalPrice = computed(() =>
      items.value.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2)
    );

    const isEmpty = computed(() => items.value.length === 0);

    function addItem(product: ProductCard, qty = 1): void {
      const existing = items.value.find((i) => i.id === product.id);

      if (existing) {
        existing.qty = Math.min(MAX_QTY, existing.qty + qty);
      } else {
        items.value.push({ ...product, qty });
      }

      isOpen.value = true;
    }

    function changeQty(productId: number, delta: number): void {
      const item = items.value.find((i) => i.id === productId);
      if (!item) return;

      const next = item.qty + delta;

      if (next < MIN_QTY) {
        return;
      } else if (next <= MAX_QTY) {
        item.qty = next;
      }
    }

    function removeItem(productId: number): void {
      items.value = items.value.filter((i) => i.id !== productId);
    }

    function clearCart(): void {
      items.value = [];
    }

    function confirmOrder(): void {
      isConfirmed.value = true;
      clearCart();
    }

    function resetConfirmation(): void {
      isConfirmed.value = false;
      isOpen.value = false;
    }

    return {
      MIN_QTY,
      MAX_QTY,
      items,
      isOpen,
      isConfirmed,
      totalItems,
      totalPrice,
      isEmpty,
      addItem,
      changeQty,
      removeItem,
      clearCart,
      confirmOrder,
      resetConfirmation,
    };
  },
  {
    persist: true,
  }
);
