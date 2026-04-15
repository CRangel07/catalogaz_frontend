const currencyMXN = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

const currencyMXNWithoutCents = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 0,
});

export const formatMXN = (value: number) => currencyMXN.format(value);
export const formatMXNNoCents = (value: number) => currencyMXNWithoutCents.format(value);
