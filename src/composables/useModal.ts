import type { Component } from 'vue';

import { storeToRefs } from 'pinia';
import { useModalStore, type ModalOptions } from '@/stores/modal';

export function useModal() {
  const store = useModalStore();

  const { topModal, modalCount, hasOpenModal } = storeToRefs(store);

  function openModal(
    component: Component,
    props?: Record<string, unknown>,
    options?: ModalOptions
  ): string {
    return store.open(component, props, options);
  }

  function closeModal(id?: string) {
    if (id) {
      store.closeById(id);
    } else {
      store.closeLast();
    }
  }

  function closeAllModals() {
    store.closeAll();
  }

  return {
    openModal,
    closeModal,
    closeAllModals,
    topModal,
    modalCount,
    hasOpenModal,
  };
}
