<template>
  <AuthLayout>
    <!-- Encabezado -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Panel de administración</h2>
      <p class="text-slate-500 text-sm mt-1">Ingresa tus credenciales para continuar.</p>
    </div>

    <form @submit.prevent="onSubmit" class="flex flex-col gap-3">
      <input
        id="phone"
        type="text"
        v-model="username"
        v-bind="usernameAttrs"
        placeholder="Ingresa usuario"
        :class="[
          'flex-1 px-3 py-2.5 rounded-lg block w-full border text-sm text-slate-900 placeholder:text-slate-400',
          'outline-none transition-colors bg-white',
          'focus:ring-2 focus:ring-slate-900 focus:border-transparent',
        ]" />
      <span v-if="errors.username" :class="errorClass">{{ errors.username }}</span>
      <input
        id="phone"
        type="password"
        v-model="password"
        v-bind="passwordAttrs"
        placeholder="Ingresa contraseña"
        :class="[
          'flex-1 px-3 py-2.5 rounded-lg block w-full border text-sm text-slate-900 placeholder:text-slate-400',
          'outline-none transition-colors bg-white',
          'focus:ring-2 focus:ring-slate-900 focus:border-transparent',
        ]" />
      <span v-if="errors.password" :class="errorClass">{{ errors.password }}</span>
      <ButtonUI theme="cyan" type="submit"> Ingresar </ButtonUI>
    </form>

    <!-- Separador visual -->
    <div class="mt-8 pt-6 border-t border-slate-200">
      <p class="text-center text-sm text-slate-400">
        ¿Eres cliente?
        <RouterLink
          :to="{ name: 'catalogAz_customer-login' }"
          class="text-slate-700 font-medium hover:underline">
          Accede aquí
        </RouterLink>
      </p>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import ButtonUI from '@/components/ui/atoms/ButtonUI.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

import { useForm } from 'vee-validate';
import { LoginAdminSchema } from '@/types/validation';
import { toTypedSchema } from '@vee-validate/zod';

const errorClass = 'text-red-400 text-xs';

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(LoginAdminSchema),
});

const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');

const onSubmit = () => handleSubmit(() => {});
</script>
