import { ref } from 'vue';
import { defineStore } from 'pinia';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number; // ms
}

let _id = 0;

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([]);

  function push(message: string, type: ToastType = 'info', duration = 4000) {
    const id = ++_id;
    toasts.value.push({ id, message, type, duration });

    setTimeout(() => remove(id), duration);
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  // Atajos semánticos
  const success = (msg: string, duration?: number) => push(msg, 'success', duration);
  const error = (msg: string, duration?: number) => push(msg, 'error', duration);
  const info = (msg: string, duration?: number) => push(msg, 'info', duration);
  const warning = (msg: string, duration?: number) => push(msg, 'warning', duration);

  return { toasts, push, remove, success, error, info, warning };
});
