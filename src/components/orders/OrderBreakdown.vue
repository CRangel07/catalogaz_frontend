<template>
  <div class="flex flex-col gap-1">
    <!-- Acción QR -->
    <div class="flex justify-end mb-2" v-if="authStore.isAdmin">
      <ButtonUI
        theme="success"
        size="sm"
        :icon="QrCode"
        :disabled="!allMarked"
        :title="allMarked ? 'Click para generar QR' : 'Todos los items deben estar marcados'"
        @click="handleQR(localOrder)">
        Generar QR
      </ButtonUI>
    </div>

    <!-- Timeline -->
    <div class="relative">
      <div class="absolute left-5.5 top-4 bottom-4 w-0.5 bg-slate-100 z-0" />

      <div class="flex flex-col gap-3">
        <div
          v-for="item in localOrder.items"
          :key="item.id"
          class="relative flex items-start gap-3">
          <!-- Nodo -->
          <div class="relative z-10 shrink-0 mt-3.5">
            <div
              class="w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all duration-300"
              :class="nodeClass(item.status)">
              <Check
                v-if="item.status === 'ready'"
                :size="9"
                class="text-white"
                :stroke-width="3.5" />
              <X
                v-else-if="item.status === 'unavailable'"
                :size="9"
                class="text-white"
                :stroke-width="3.5" />
              <span v-else class="w-1.5 h-1.5 rounded-full bg-slate-300 block" />
            </div>
          </div>

          <!-- Tarjeta -->
          <div
            class="flex-1 rounded-2xl border px-3 py-2.5 transition-all duration-300"
            :class="cardClass(item.status)">
            <div class="flex items-center gap-3">
              <!-- Imagen -->
              <ImageNotFound
                :url="item.product.imageThumbnailUrl"
                :alt="item.product.name"
                class="w-10! h-10! rounded-xl object-cover shrink-0 border border-white/60" />

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p
                  class="font-bold text-sm leading-tight truncate transition-all duration-200"
                  :class="nameClass(item.status)">
                  {{ item.product.name }}
                </p>
                <div class="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span class="font-mono text-[10px] text-slate-400">#{{ item.product.code }}</span>
                  <span class="text-[10px] text-slate-300">·</span>
                  <span
                    class="text-xs font-semibold transition-colors duration-200"
                    :class="priceClass(item.status)">
                    {{ formatMXN(item.unitPrice) }} c/u
                  </span>
                </div>
                <!-- Qty real si fue diferente a la pedida -->
                <div
                  v-if="item.actualQty !== undefined && item.actualQty !== item.quantity"
                  class="flex items-center gap-1 mt-1">
                  <span class="text-[10px] font-semibold text-amber-600">
                    {{ item.actualQty }} de {{ item.quantity }} surtidas
                  </span>
                </div>
              </div>

              <!-- Cantidad -->
              <div
                class="shrink-0 flex flex-col items-center rounded-xl px-2.5 py-1 border transition-all duration-300"
                :class="qtyClass(item.status)">
                <span class="text-xl font-black leading-none tabular-nums">
                  {{ item.actualQty ?? item.quantity }}
                </span>
                <span class="text-[8px] font-bold uppercase tracking-widest mt-0.5 opacity-60"
                  >uds</span
                >
              </div>

              <!-- Switches (admin / pedidos / caja) -->
              <div
                v-if="authStore.isAdmin || authStore.isCajero || authStore.isPedidos"
                class="flex flex-col gap-2 shrink-0">
                <!-- Switch No hay -->
                <div
                  class="flex items-center gap-2 select-none"
                  :class="{
                    'opacity-40 pointer-events-none':
                      item.status === 'ready' || loadingItem[item.id],
                  }">
                  <span
                    class="text-[10px] font-semibold text-slate-400 w-10 text-right leading-none">
                    No hay
                  </span>
                  <div
                    class="relative w-9 h-5 rounded-full transition-all duration-200 cursor-pointer shrink-0"
                    :class="item.status === 'unavailable' ? 'bg-red-500' : 'bg-slate-200'"
                    @click="toggleStatus(item, 'unavailable')">
                    <div
                      class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 flex items-center justify-center"
                      :class="item.status === 'unavailable' ? 'left-4.5' : 'left-0.5'">
                      <Loader2
                        v-if="loadingItem[item.id] && pendingStatus[item.id] === 'unavailable'"
                        :size="9"
                        class="text-slate-400 animate-spin" />
                      <X
                        v-else-if="item.status === 'unavailable'"
                        :size="9"
                        class="text-red-500"
                        :stroke-width="3" />
                    </div>
                  </div>
                </div>

                <!-- Switch Listo -->
                <div
                  class="flex items-center gap-2 select-none"
                  :class="{
                    'opacity-40 pointer-events-none':
                      item.status === 'unavailable' || loadingItem[item.id],
                  }">
                  <span
                    class="text-[10px] font-semibold text-slate-400 w-10 text-right leading-none">
                    Listo
                  </span>
                  <div
                    class="relative w-9 h-5 rounded-full transition-all duration-200 cursor-pointer shrink-0"
                    :class="item.status === 'ready' ? 'bg-emerald-500' : 'bg-slate-200'"
                    @click="toggleStatus(item, 'ready')">
                    <div
                      class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 flex items-center justify-center"
                      :class="item.status === 'ready' ? 'left-4.5' : 'left-0.5'">
                      <Loader2
                        v-if="loadingItem[item.id] && pendingStatus[item.id] === 'ready'"
                        :size="9"
                        class="text-slate-400 animate-spin" />
                      <Check
                        v-else-if="item.status === 'ready'"
                        :size="9"
                        class="text-emerald-500"
                        :stroke-width="3" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Badge (customer) -->
              <div v-else class="shrink-0">
                <span
                  class="text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide whitespace-nowrap"
                  :class="badgeClass(item.status)">
                  {{ statusLabel(item.status) }}
                </span>
              </div>

              <!-- Subtotal -->
              <div class="shrink-0 text-right min-w-14">
                <p class="text-[9px] uppercase tracking-wide font-medium text-slate-400">Total</p>
                <p
                  class="text-sm font-extrabold transition-colors duration-200"
                  :class="nameClass(item.status)">
                  {{ formatMXN((item.actualQty ?? item.quantity) * item.unitPrice) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/assets/logo.png';
import QRCode from '../general/QRCode.vue';
import ButtonUI from '../ui/atoms/ButtonUI.vue';
import ImageNotFound from '../ui/molecules/ImageNotFound.vue';
import ConfirmProduct from '../modal/ConfirmProduct.vue';
import type { ConfirmProductOutcome } from '../modal/ConfirmProduct.vue';

import type { OrderFull, OrderItemFull } from '@/types/db';

import { computed, h, reactive, ref } from 'vue';
import { useModal } from '@/composables/useModal';
import { formatMXN } from '@/helpers/currencyMxn';
import { OrderService } from '@/services/order.service';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import { QrCode, Check, X, Loader2 } from 'lucide-vue-next';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type ItemStatus = 'pending' | 'ready' | 'unavailable';

// Extendemos OrderItemFull localmente para guardar la qty real
type LocalItem = OrderItemFull & { actualQty?: number };

// ─── Stores ───────────────────────────────────────────────────────────────────

const authStore = useAuthStore();
const toast = useToastStore();
const { openModal, closeModal } = useModal();

// ─── Props / Emits ────────────────────────────────────────────────────────────

const props = defineProps<{ order: OrderFull }>();

const emit = defineEmits<{
  'update:order': [order: OrderFull];
}>();

// ─── Copia local ──────────────────────────────────────────────────────────────

const localOrder = ref<OrderFull & { items: LocalItem[] }>({
  ...props.order,
  items: props.order.items.map((i) => ({ ...i })),
});

// ─── Estado de carga ──────────────────────────────────────────────────────────

const allMarked = computed(() => localOrder.value.items.every((i) => i.status !== 'pending'));

const loadingItem = reactive<Record<number, boolean>>({});
const pendingStatus = reactive<Record<number, ItemStatus>>({});

// ─── Verificación con promesa ─────────────────────────────────────────────────
//
// Abrimos ConfirmProduct y le pasamos una función `resolve` como prop.
// El modal la llama con el resultado cuando el usuario confirma o cancela.
// Mientras tanto, awaiteamos la promesa en toggleStatus.
//
// Este patrón evita que ConfirmProduct sepa algo de toggleStatus —
// solo resuelve la promesa con datos y quien la abre decide qué hacer.

function openConfirmModal(item: OrderItemFull): Promise<ConfirmProductOutcome> {
  return new Promise((resolve) => {
    const id = openModal(
      ConfirmProduct,
      {
        item,
        // resolve cierra el modal Y devuelve el resultado a toggleStatus
        resolve: (result: ConfirmProductOutcome) => {
          closeModal(id);
          resolve(result);
        },
      },
      {
        title: 'Verificar producto',
        closeOnBackdrop: false, // forzamos que el usuario decida explícitamente
        closeOnEsc: false,
        size: 'sm',
      }
    );
  });
}

// ─── Toggle de status ─────────────────────────────────────────────────────────

async function toggleStatus(item: LocalItem, newStatus: ItemStatus): Promise<void> {
  // Si ya tiene ese status → revertir a pending
  const targetStatus: ItemStatus = item.status === newStatus ? 'pending' : newStatus;

  const idx = localOrder.value.items.findIndex((i) => i.id === item.id);
  if (idx === -1) return;

  // Solo pedimos verificación cuando se quiere marcar como READY
  // Para 'unavailable' o revertir a 'pending' no hace falta verificar
  let actualQty = item.quantity;

  if (targetStatus === 'ready') {
    const result = await openConfirmModal(item);

    // Si el usuario cerró el modal o canceló → abortamos sin cambios
    if (!result.confirmed) return;

    actualQty = result.actualQty;
  }

  const previousStatus = localOrder.value.items[idx]!.status;
  const previousQty = localOrder.value.items[idx]!.actualQty;

  // Actualización optimista
  localOrder.value.items[idx]!.status = targetStatus;
  localOrder.value.items[idx]!.actualQty = actualQty;
  loadingItem[item.id] = true;
  pendingStatus[item.id] = newStatus;

  try {
    const updated = await OrderService.updateItemStatus(
      localOrder.value.id,
      item.id,
      targetStatus,
      // Pasamos la qty real al backend si fue diferente
      actualQty !== item.quantity ? actualQty : undefined
    );

    localOrder.value.items[idx]!.status = updated.status;

    if (updated.orderResolved === 'ready') {
      localOrder.value.status = 'ready';
      toast.success('¡Pedido completo! Todos los items resueltos.');
    }

    emit('update:order', localOrder.value);
  } catch (e) {
    // Revertir optimismo
    localOrder.value.items[idx]!.status = previousStatus;
    localOrder.value.items[idx]!.actualQty = previousQty;
    toast.error(String(e));
  } finally {
    loadingItem[item.id] = false;
    delete pendingStatus[item.id];
  }
}

// ─── QR ──────────────────────────────────────────────────────────────────────

function handleQR(order: OrderFull & { items: LocalItem[] }): void {
  const instructionQR = order.items
    .filter((i) => i.status === 'ready')
    .map((i) => `${i.actualQty ?? i.quantity}*${i.product.code}`)
    .join('\r');

  const content = h('div', { class: 'flex flex-col items-center gap-2' }, [
    h(
      'p',
      {
        class:
          'text-xs uppercase font-semibold rounded-xl text-yellow-800 text-center bg-yellow-200 p-3 whitespace-pre-line',
      },
      'Escanea en Compucaja para agregar productos Listos\n\nNo olvides revisar existencias suficientes en Compucaja'
    ),
    h(QRCode, {
      value: instructionQR,
      size: 300,
      logoUrl: Logo,
      downloadName: `${order.id}${order.customer.name}`,
    }),
  ]);

  openModal(content, {}, { closeOnBackdrop: true });
}

// ─── Clases dinámicas ─────────────────────────────────────────────────────────

function nodeClass(status: ItemStatus): string {
  if (status === 'ready') return 'bg-emerald-500 border-emerald-500';
  if (status === 'unavailable') return 'bg-red-500 border-red-500';
  return 'bg-white border-slate-200';
}
function cardClass(status: ItemStatus): string {
  if (status === 'ready') return 'bg-emerald-50 border-emerald-200';
  if (status === 'unavailable') return 'bg-red-50/70 border-red-200';
  return 'bg-white border-slate-100 shadow-sm';
}
function nameClass(status: ItemStatus): string {
  if (status === 'ready') return 'text-emerald-800';
  if (status === 'unavailable') return 'text-red-400 line-through';
  return 'text-azul';
}
function priceClass(status: ItemStatus): string {
  if (status === 'ready') return 'text-emerald-600';
  if (status === 'unavailable') return 'text-red-400';
  return 'text-azul/70';
}
function qtyClass(status: ItemStatus): string {
  if (status === 'ready') return 'bg-emerald-100 border-emerald-200 text-emerald-700';
  if (status === 'unavailable') return 'bg-red-100 border-red-200 text-red-500';
  return 'bg-naranja/5 border-naranja/20 text-naranja';
}
function badgeClass(status: ItemStatus): string {
  if (status === 'ready') return 'bg-emerald-100 text-emerald-700';
  if (status === 'unavailable') return 'bg-red-100 text-red-600';
  return 'bg-slate-100 text-slate-500';
}
function statusLabel(status: ItemStatus): string {
  const map: Record<ItemStatus, string> = {
    pending: 'Pendiente',
    ready: 'Listo',
    unavailable: 'No hay',
  };
  return map[status];
}
</script>
