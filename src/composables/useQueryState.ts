import { ref } from 'vue';

export function useQueryState<T extends Record<string, unknown>>(initial: T) {
  const query = ref<T>({ ...initial });

  function update(partial: Partial<T>) {
    query.value = {
      ...query.value,
      ...partial,
    };
  }

  function reset(newValues?: Partial<T>) {
    query.value = {
      ...initial,
      ...newValues,
    };
  }

  return {
    query,
    update,
    reset,
  };
}
