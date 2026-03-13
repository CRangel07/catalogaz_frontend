import { useModalStore, type ModalOptions } from '@/stores/modal';

import type { Component } from 'vue';

/**
 * Composable de conveniencia para manejar modales desde cualquier componente.
 *
 * @example
 * const { openModal, closeModal, closeAllModals } = useModal()
 *
 * // Abrir un modal
 * openModal(ConfirmModal, { message: '¿Estás seguro?' }, { size: 'sm' })
 *
 * // Abrir y guardar el ID para cerrar específicamente
 * const id = openModal(UserFormModal, { userId: 5 })
 * closeModal(id)
 */
export function useModal() {
  const store = useModalStore();

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
    topModal: store.topModal,
    modalCount: store.modalCount,
    hasOpenModal: store.hasOpenModal,
  };
}
