import { defineStore } from 'pinia';
import { markRaw, type Component } from 'vue';

export interface ModalOptions {
  title?: string;
  /** Cierra el modal al hacer click en el backdrop */
  closeOnBackdrop?: boolean;
  /** Cierra el modal al presionar Escape */
  closeOnEsc?: boolean;
  /** Tamaño del modal */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Callback al cerrar (cualquier método) */
  onClose?: () => void;
  /** Callback al confirmar (si aplica) */
  onConfirm?: (...args: unknown[]) => void;
}

export interface ModalInstance {
  id: string;
  component: Component;
  props?: Record<string, unknown>;
  options?: ModalOptions;
}

interface ModalState {
  stack: ModalInstance[];
}

export const useModalStore = defineStore('modal', {
  state: (): ModalState => ({
    stack: [],
  }),

  getters: {
    /** Todos los modales activos */
    activeModals: (state) => state.stack,

    /** El modal más reciente (tope del stack) */
    topModal: (state) => state.stack[state.stack.length - 1] ?? null,

    /** ¿Hay algún modal abierto? */
    hasOpenModal: (state) => state.stack.length > 0,

    /** Cantidad de modales apilados */
    modalCount: (state) => state.stack.length,
  },

  actions: {
    /**
     * Abre un nuevo modal y lo agrega al stack
     * @param component - Componente Vue a renderizar dentro del modal
     * @param props - Props que se pasan al componente
     * @param options - Opciones de comportamiento del modal
     * @returns El ID único del modal creado
     *
     * @example
     * const { open } = useModalStore()
     * open(UserFormModal, { userId: 1 }, { size: 'lg', closeOnEsc: true })
     */
    open(component: Component, props?: Record<string, unknown>, options?: ModalOptions): string {
      const id = `modal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      this.stack.push({
        id,
        // markRaw evita que Vue haga reactivo el componente innecesariamente
        component: markRaw(component),
        props,
        options: {
          closeOnBackdrop: false,
          closeOnEsc: true,
          size: 'md',
          title: '',
          ...options,
        },
      });

      return id;
    },

    /**
     * Cierra el modal más reciente del stack (el del tope)
     */
    closeLast() {
      const last = this.stack[this.stack.length - 1];
      if (!last) return;

      last.options?.onClose?.();
      this.stack.pop();
    },

    /**
     * Cierra un modal específico por su ID
     * @param id - ID del modal a cerrar
     */
    closeById(id: string) {
      const index = this.stack.findIndex((m) => m.id === id);
      if (index === -1) return;

      this.stack[index]!.options?.onClose?.();
      this.stack.splice(index, 1);
    },

    /**
     * Cierra todos los modales del stack
     */
    closeAll() {
      // Llamar onClose en orden inverso (del más reciente al más antiguo)
      [...this.stack].reverse().forEach((m) => m.options?.onClose?.());
      this.stack = [];
    },
  },
});
