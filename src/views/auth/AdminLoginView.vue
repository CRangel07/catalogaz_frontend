<template>
  <AuthLayout>
    <!-- Encabezado -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Panel de administración</h2>
      <p class="text-slate-500 text-sm mt-1">Ingresa tus credenciales para continuar.</p>
    </div>

    <!-- Separador visual -->
    <div class="mt-8 pt-6 border-t border-slate-200">
      <p class="text-center text-sm text-slate-400">
        ¿Eres cliente?
        <RouterLink to="/auth/cliente" class="text-slate-700 font-medium hover:underline">
          Accede aquí
        </RouterLink>
      </p>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import ButtonUI from '@/components/ui/atoms/ButtonUI.vue';
import AppInput from '@/components/ui/forms/AppInput.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { LoginAdminSchema } from '@/types/validation';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-vue-next';

const router = useRouter();

const { isSubmitting, defineField, handleSubmit } = useForm({ validationSchema: LoginAdminSchema });

const [username, usernameAttrs] = defineField('username');
</script>
