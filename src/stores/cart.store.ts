import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import type { ProductCard } from '@/types/db';

export interface CartItem extends ProductCard {
  qty: number;
}

export const useCartStore = defineStore(
  'catalogaz_cart_store',
  () => {
    const items = ref<CartItem[]>([]);
    const itemsMap = ref(new Map<number, CartItem>());

    const isOpen = ref(false);
    const isConfirmed = ref(false);

    const MIN_QTY = 1;
    const MAX_QTY = 999;

    function rebuildMap(): void {
      const map = new Map<number, CartItem>();
      for (const item of items.value) {
        map.set(item.id, item);
      }
      itemsMap.value = map;
    }

    watch(
      items,
      () => {
        rebuildMap();
      },
      { deep: true, immediate: true }
    );

    const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.qty, 0));

    const totalPrice = computed(() =>
      items.value.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2)
    );

    const isEmpty = computed(() => items.value.length === 0);

    // -------------------------
    // 🛒 ACTIONS
    // -------------------------
    function addItem(product: ProductCard, qty = 1): void {
      const safeQty = Math.max(1, qty);
      const existing = itemsMap.value.get(product.id);

      const limit = Math.min(MAX_QTY, product.maxQuantity ?? MAX_QTY);

      if (existing) {
        const newQty = existing.qty + safeQty;

        if (newQty > limit) return;

        existing.qty = newQty;
      } else {
        const initialQty = Math.min(limit, safeQty);

        if (initialQty < MIN_QTY) return;

        const newItem: CartItem = {
          ...product,
          qty: initialQty,
        };

        items.value.push(newItem);
        itemsMap.value.set(product.id, newItem);
      }

      isOpen.value = true;
    }

    function changeQty(productId: number, delta: number): void {
      const item = itemsMap.value.get(productId);
      if (!item) return;

      const next = item.qty + delta;

      const limit = Math.min(MAX_QTY, item.maxQuantity ?? MAX_QTY);

      if (next < MIN_QTY || next > limit) return;

      item.qty = next;
    }

    function removeItem(productId: number): void {
      items.value = items.value.filter((i) => i.id !== productId);
      itemsMap.value.delete(productId);
    }

    function clearCart(): void {
      items.value = [];
      itemsMap.value.clear();
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
      // state
      MIN_QTY,
      MAX_QTY,
      items,
      isOpen,
      isConfirmed,

      // computed
      totalItems,
      totalPrice,
      isEmpty,

      // actions
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
