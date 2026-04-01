const currencyMXN = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

export const formatMXN = (value: number) => currencyMXN.format(value);
