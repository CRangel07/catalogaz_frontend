import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';

const getTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export function formatDate(date: Date | string): string {
  return formatInTimeZone(date, getTimezone(), 'cccc dd/MM/yy hh:mm aaa', { locale: es });
}

export function formatDateOnly(date: Date | string) {
  return formatInTimeZone(date, getTimezone(), 'yyyy-MM-dd');
}

export function formatTime(date: Date | string) {
  return formatInTimeZone(date, getTimezone(), 'hh:mm aaa');
}

export const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);

  const diff = (past.getTime() - now.getTime()) / 1000; // en segundos

  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

  const divisions = [
    { amount: 60, unit: 'seconds' },
    { amount: 60, unit: 'minutes' },
    { amount: 24, unit: 'hours' },
    { amount: 7, unit: 'days' },
    { amount: 4.34524, unit: 'weeks' },
    { amount: 12, unit: 'months' },
    { amount: Infinity, unit: 'years' },
  ] as const;

  let duration = diff;

  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return '';
};
