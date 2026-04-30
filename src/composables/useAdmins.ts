import type { Admin } from '@/types/db';
import type { CreateAdmin, UpdateAdmin } from '@/types/validation';

import { ref } from 'vue';
import { AdminService } from '@/services/admin.service';
import { useToastStore } from '@/stores/toast.store';

export function useAdmins() {
  const toast = useToastStore();

  const admins = ref<Admin[]>([]);
  const admin = ref<Admin | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  async function fetchAdmins() {
    loading.value = true;
    error.value = null;
    try {
      admins.value = await AdminService.getAll();
    } catch (e) {
      error.value = (e as Error).message;
      toast.error(error.value, 6000);
    } finally {
      loading.value = false;
    }
  }

  async function fetchAdmin(id: number) {
    loading.value = true;
    error.value = null;
    try {
      admin.value = await AdminService.getOne(id);
    } catch (e) {
      error.value = (e as Error).message;
      toast.error('No se pudo obtener ese administrador');
    } finally {
      loading.value = false;
    }
  }

  async function createAdmin(dto: CreateAdmin): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      const created = await AdminService.create(dto);
      admins.value.push(created);
      toast.success(`Administrador ${dto.name} con usuario ${dto.username} creado correctamente`);
      return true;
    } catch (e) {
      error.value = (e as Error).message;
      toast.error((e as Error).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function updateAdmin(id: number, dto: UpdateAdmin): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      const updated = await AdminService.update(id, dto);
      const idx = admins.value.findIndex((p) => p.id == id);
      if (idx !== -1) admins.value[idx] = updated;
      toast.success('Admin actualizado correctamente');
      return true;
    } catch (e) {
      error.value = (e as Error).message;
      toast.error((e as Error).message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteAdmin(id: number): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      await AdminService.delete(id);
      admins.value = admins.value.filter((p) => p.id !== id);
      toast.success('Administrador Eliminado Correctamente');
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
    admin,
    error,
    admins,
    loading,
    fetchAdmin,
    fetchAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
  };
}
