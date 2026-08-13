<template>
  <div class="flex flex-col items-center gap-3">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup lang="ts">
import QRCode from 'qrcode';

import { ref, watch, onMounted } from 'vue';

export interface QRCodeProps {
  value: string;
  size?: number;
  logoUrl?: string;
  downloadName?: string;
}

const props = withDefaults(defineProps<QRCodeProps>(), {
  size: 220,
  downloadName: 'qr-code',
});

const canvasRef = ref<HTMLCanvasElement | null>(null);

async function generateQR() {
  if (!canvasRef.value) return;

  await QRCode.toCanvas(canvasRef.value, props.value, {
    width: props.size,
    margin: 2,
  });

  if (props.logoUrl) {
    await drawLogo();
  }
}

async function drawLogo() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = props.logoUrl ?? '';

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const size = canvas.width * 0.2;
  const x = (canvas.width - size) / 2;
  const y = (canvas.height - size) / 2;

  // Fondo blanco para mejorar lectura del QR
  ctx.fillStyle = 'white';
  ctx.fillRect(x - 5, y - 5, size + 10, size + 10);

  ctx.drawImage(img, x, y, size, size);
}

// function downloadQR() {
//   const canvas = canvasRef.value;
//   if (!canvas) return;

//   const url = canvas.toDataURL('image/png');

//   const link = document.createElement('a');
//   link.href = url;
//   link.download = `${props.downloadName}.png`;
//   link.click();
// }

watch(
  () => props.value,
  () => generateQR()
);

onMounted(generateQR);
</script>
