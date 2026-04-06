<template>
  <AuthLayout>
    <!-- Paso 1: Teléfono -->
    <template v-if="step === 'phone'">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-naranja tracking-tight">Bienvenido</h2>
        <p class="text-slate-500 text-sm mt-1">
          Ingresa tu número de WhatsApp para recibir tu código de acceso.
        </p>
      </div>

      <form class="flex flex-col gap-5" @submit.prevent="handleRequestOtp">
        <div class="flex flex-col gap-1.5">
          <label for="phone" class="text-sm font-medium text-slate-700">
            Número de WhatsApp <span class="text-red-500">*</span>
          </label>

          <!-- Selector de lada + input teléfono -->
          <div class="flex gap-2">
            <div
              class="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 shrink-0">
              <span>🇲🇽</span>
              <span class="font-medium">+52</span>
            </div>
            <input
              id="phone"
              v-model="phone"
              type="tel"
              inputmode="numeric"
              placeholder="5512345678"
              maxlength="10"
              :class="[
                'flex-1 px-3 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400',
                'outline-none transition-colors bg-white',
                'focus:ring-2 focus:ring-slate-900 focus:border-transparent',
                phoneError ? 'border-red-400' : 'border-slate-300 hover:border-slate-400',
              ]" />
          </div>
          <p v-if="phoneError" class="text-xs text-red-500">{{ phoneError }}</p>
          <p v-else class="text-xs text-slate-500">Ejemplo: 5512345678 (10 dígitos, sin lada)</p>
        </div>

        <!-- Error global -->
        <div
          v-if="globalError"
          class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle class="w-4 h-4 text-red-500 shrink-0" />
          <p class="text-red-600 text-sm">{{ globalError }}</p>
        </div>

        <ButtonUI
          :icon="MessageCircle"
          :loading="isLoading"
          type="submit"
          theme="success"
          full-width
          class="mt-1">
          Enviar código por WhatsApp
        </ButtonUI>
      </form>
    </template>

    <!-- Paso 2: OTP -->
    <template v-else-if="step === 'otp'">
      <div class="mb-8">
        <!-- Botón volver -->
        <button
          type="button"
          class="flex items-center gap-1.5 text-slate-500 text-sm hover:text-slate-800 transition-colors mb-6 -ml-1"
          @click="goBack">
          <ArrowLeft class="w-4 h-4" />
          Cambiar número
        </button>

        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Revisa tu WhatsApp</h2>
        <p class="text-slate-500 text-sm mt-1">
          Enviamos un código de 6 dígitos al número
          <span class="font-medium text-slate-700">+52 {{ phone }}</span>
        </p>
      </div>

      <form class="flex flex-col gap-5" @submit.prevent="handleVerifyOtp">
        <!-- Inputs OTP individuales -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-slate-700">
            Código de verificación <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-2 justify-between">
            <input
              v-for="(_, index) in otpDigits"
              :key="index"
              :ref="(el) => setOtpRef(el, index)"
              v-model="otpDigits[index]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              :class="[
                'w-full aspect-square text-center text-xl font-bold rounded-lg border',
                'outline-none transition-colors bg-white text-slate-900',
                'focus:ring-2 focus:ring-slate-900 focus:border-transparent',
                otpError ? 'border-red-400' : 'border-slate-300',
              ]"
              @input="handleOtpInput($event, index)"
              @keydown="handleOtpKeydown($event, index)"
              @paste="handleOtpPaste" />
          </div>
          <p v-if="otpError" class="text-xs text-red-500">{{ otpError }}</p>
        </div>

        <!-- Error global -->
        <div
          v-if="globalError"
          class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle class="w-4 h-4 text-red-500 shrink-0" />
          <p class="text-red-600 text-sm">{{ globalError }}</p>
        </div>

        <ButtonUI
          type="submit"
          :loading="isLoading"
          :disabled="otpCode.length < 6"
          full-width
          theme="cyan"
          class="mt-1">
          Verificar y entrar
        </ButtonUI>

        <!-- Reenviar código -->
        <div class="text-center">
          <button
            v-if="resendCooldown === 0"
            type="button"
            class="text-sm text-slate-700 font-medium hover:underline"
            @click="handleResend">
            Reenviar código
          </button>
          <p v-else class="text-sm text-slate-400">Reenviar en {{ resendCooldown }}s</p>
        </div>
      </form>
    </template>

    <!-- Separador -->
    <div class="mt-8 pt-6 border-t border-slate-200">
      <p class="text-center text-sm text-slate-400">
        ¿Eres administrador?
        <RouterLink
          :to="{ name: 'catalogAz_admin-login' }"
          class="text-slate-700 font-medium hover:underline">
          Inicia sesión aquí
        </RouterLink>
      </p>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthLayout from '@/layouts/AuthLayout.vue';

import { useRouter } from 'vue-router';
import { ref, computed, onUnmounted } from 'vue';
import { MessageCircle, AlertCircle, ArrowLeft } from 'lucide-vue-next';
import ButtonUI from '@/components/ui/atoms/ButtonUI.vue';
// import AppButton from '@/components/ui/AppButton.vue';

type Step = 'phone' | 'otp';

const router = useRouter();

// --- Paso actual ---
const step = ref<Step>('phone');

// --- Paso 1: Teléfono ---
const phone = ref('');
const phoneError = ref('');

// --- Paso 2: OTP ---
const otpDigits = ref<string[]>(['', '', '', '', '', '']);
const otpRefs = ref<(HTMLInputElement | null)[]>([]);
const otpError = ref('');

// --- Estado compartido ---
const globalError = ref('');
const isLoading = ref(false);

// --- Cooldown para reenviar OTP ---
const resendCooldown = ref(0);
let cooldownInterval: ReturnType<typeof setInterval> | null = null;

// OTP como string concatenado
const otpCode = computed(() => otpDigits.value.join(''));

// --- Helpers para refs dinámicos ---
function setOtpRef(el: unknown, index: number) {
  if (el instanceof HTMLInputElement) {
    otpRefs.value[index] = el;
  }
}

// --- Paso 1: Solicitar OTP ---
function validatePhone(): boolean {
  phoneError.value = '';
  const digits = phone.value.replace(/\D/g, '');
  if (!digits) {
    phoneError.value = 'El número de teléfono es requerido.';
    return false;
  }
  if (digits.length !== 10) {
    phoneError.value = 'Ingresa exactamente 10 dígitos sin lada.';
    return false;
  }
  return true;
}

async function handleRequestOtp() {
  globalError.value = '';
  if (!validatePhone()) return;

  isLoading.value = true;
  try {
    // TODO: conectar con useCustomerAuth composable
    // await authService.requestOtp(`+52${phone.value}`)
    step.value = 'otp';
    startCooldown(60);
  } catch {
    globalError.value = 'No pudimos enviar el código. Intenta de nuevo.';
  } finally {
    isLoading.value = false;
  }
}

// --- Paso 2: Verificar OTP ---
async function handleVerifyOtp() {
  globalError.value = '';
  otpError.value = '';

  if (otpCode.value.length < 6) {
    otpError.value = 'Ingresa los 6 dígitos del código.';
    return;
  }

  isLoading.value = true;
  try {
    // TODO: conectar con useCustomerAuth composable
    // await authService.verifyOtp(`+52${phone.value}`, otpCode.value)
    await router.push('/catalogo');
  } catch {
    globalError.value = 'Código incorrecto o expirado. Intenta de nuevo.';
    otpDigits.value = ['', '', '', '', '', ''];
    otpRefs.value[0]?.focus();
  } finally {
    isLoading.value = false;
  }
}

// --- Manejo de inputs OTP ---
function handleOtpInput(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  const value = input.value.replace(/\D/g, '');
  otpDigits.value[index] = value.slice(-1);

  if (value && index < 5) {
    otpRefs.value[index + 1]?.focus();
  }
}

function handleOtpKeydown(event: KeyboardEvent, index: number) {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpRefs.value[index - 1]?.focus();
  }
}

function handleOtpPaste(event: ClipboardEvent) {
  event.preventDefault();
  const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) ?? '';
  pasted.split('').forEach((char, i) => {
    otpDigits.value[i] = char;
  });
  const lastFilled = Math.min(pasted.length, 5);
  otpRefs.value[lastFilled]?.focus();
}

// --- Reenviar OTP ---
async function handleResend() {
  globalError.value = '';
  isLoading.value = true;
  try {
    // TODO: conectar con useCustomerAuth composable
    // await authService.requestOtp(`+52${phone.value}`)
    startCooldown(60);
  } catch {
    globalError.value = 'No pudimos reenviar el código. Intenta de nuevo.';
  } finally {
    isLoading.value = false;
  }
}

function startCooldown(seconds: number) {
  resendCooldown.value = seconds;
  cooldownInterval = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0 && cooldownInterval) {
      clearInterval(cooldownInterval);
    }
  }, 1000);
}

// --- Volver al paso 1 ---
function goBack() {
  step.value = 'phone';
  globalError.value = '';
  otpDigits.value = ['', '', '', '', '', ''];
  otpError.value = '';
}

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval);
});
</script>
