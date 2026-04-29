<template>
  <div class="app-table-wrapper">
    <!-- ── Shell ────────────────────────────────────────────────── -->
    <div
      class="relative rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_rgba(30,58,138,0.07)] overflow-hidden">
      <!-- Top accent bar -->
      <div class="h-0.75 w-full bg-slate-200" />

      <!-- Scroll container (horizontal en mobile) -->
      <div class="overflow-x-auto">
        <table class="w-full text-xs border-collapse">
          <!-- ── THEAD ─────────────────────────────────────────── -->
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/80">
              <th
                v-for="col in columns"
                :key="col.key"
                scope="col"
                :class="[
                  'px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400 whitespace-nowrap select-none',
                  colClasses(col, 'th'),
                ]">
                {{ col.label }}
              </th>

              <!-- Actions header -->
              <th
                v-if="hasActions"
                scope="col"
                :class="[$props.actionsHeaderClass]"
                class="px-5 py-3.5 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400 whitespace-nowrap">
                {{ actionsLabel }}
              </th>
            </tr>
          </thead>

          <!-- ── TBODY: skeleton ───────────────────────────────── -->
          <tbody v-if="loading">
            <tr v-for="n in skeletonRows" :key="n" class="border-b border-slate-50 last:border-0">
              <td
                v-for="col in columns"
                :key="col.key"
                :class="['px-5 py-3.5', col.hideOnMobile ? 'hidden sm:table-cell' : '']">
                <div
                  class="h-3 rounded-full bg-slate-100 animate-pulse"
                  :style="`width: ${55 + Math.random() * 35}%`" />
              </td>
              <td v-if="hasActions" class="px-5 py-3.5">
                <div class="ml-auto h-3 w-16 rounded-full bg-slate-100 animate-pulse" />
              </td>
            </tr>
          </tbody>

          <!-- ── TBODY: empty ──────────────────────────────────── -->
          <tbody v-else-if="!rows.length">
            <tr>
              <td
                :colspan="hasActions ? columns.length + 1 : columns.length"
                class="px-5 py-14 text-center">
                <div class="flex flex-col items-center gap-3">
                  <!-- Empty illustration -->
                  <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                    <FolderOpen class="text-slate-600" />
                  </div>
                  <p class="text-sm font-semibold text-slate-500">{{ emptyText }}</p>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- ── TBODY: data ───────────────────────────────────── -->
          <tbody v-else>
            <tr
              v-for="(row, rowIndex) in rows"
              :key="rowIndex"
              class="group border-b border-slate-50 last:border-0 transition-colors duration-100"
              :class="[
                striped && rowIndex % 2 !== 0 ? 'bg-slate-50/60' : 'bg-white',
                clickable && 'cursor-pointer hover:bg-blue-50/50 active:bg-blue-50',
                !clickable && 'hover:bg-azul/5',
              ]"
              @click="clickable && emit('row-click', row, rowIndex)">
              <!-- Data cells -->
              <td
                v-for="col in columns"
                :key="col.key"
                :class="[
                  'px-5 py-3.5 text-sm text-slate-600 font-semibold leading-tight',
                  colClasses(col, 'td'),
                ]">
                <!-- Custom cell slot: #cell-{key} -->
                <slot
                  v-if="$slots[`cell-${String(col.key)}`]"
                  :name="`cell-${String(col.key)}`"
                  :value="row[col.key]"
                  :row="row"
                  :index="rowIndex" />
                <!-- Default: formatted value -->
                <template v-else>
                  {{ getCellValue(row, col) }}
                </template>
              </td>

              <!-- Actions cell -->
              <td v-if="hasActions" class="px-5 py-3 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1.5">
                  <slot name="actions" :row="row" :index="rowIndex" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Footer slot (paginación, etc.) ───────────────────── -->
      <div v-if="$slots.footer" class="border-t border-slate-100 bg-slate-50/60 px-5 py-3">
        <slot name="footer" :total="rows.length" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Object">
import { FolderOpen } from 'lucide-vue-next';

export interface TableColumn<Row extends object = Record<string, unknown>> {
  key: keyof Row;
  label: string;
  class?: string;
  headerClass?: string;
  cellClass?: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  hideOnMobile?: boolean;
  format?: (value: unknown, row: Row) => string;
}

interface Props {
  columns: TableColumn<T>[];
  rows: T[];
  emptyText?: string;
  hasActions?: boolean;
  actionsHeaderClass?: string;
  actionsLabel?: string;
  loading?: boolean;
  skeletonRows?: number;
  striped?: boolean;
  clickable?: boolean;
}

withDefaults(defineProps<Props>(), {
  emptyText: 'No hay datos para mostrar.',
  hasActions: false,
  actionsLabel: 'Acciones',
  loading: false,
  skeletonRows: 5,
  striped: false,
  clickable: false,
});

const emit = defineEmits<{
  'row-click': [row: T, index: number];
}>();

// ── Helpers ───────────────────────────────────────────────────────────────────
function alignClass(align?: 'left' | 'center' | 'right') {
  return align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
}

function getCellValue(row: T, col: TableColumn<T>): string {
  const raw = row[col.key as keyof T];
  if (col.format) return col.format(raw, row);
  if (raw === null || raw === undefined) return '—';
  return String(raw);
}

function colClasses(col: TableColumn<T>, type: 'th' | 'td') {
  return [
    alignClass(col.align),
    col.width ?? '',
    col.class ?? '',
    type === 'th' ? (col.headerClass ?? '') : (col.cellClass ?? ''),
    col.hideOnMobile ? 'hidden sm:table-cell' : '',
  ]
    .filter(Boolean)
    .join(' ');
}
</script>
