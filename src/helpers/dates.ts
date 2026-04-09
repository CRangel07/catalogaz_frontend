import { formatInTimeZone } from 'date-fns-tz';

const getTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export function formatDate(date: Date | string) {
  return formatInTimeZone(date, getTimezone(), 'dd/MM/yyyy hh:mm:ss aaa');
}

export function formatDateOnly(date: Date | string) {
  return formatInTimeZone(date, getTimezone(), 'yyyy-MM-dd');
}

export function formatTime(date: Date | string) {
  return formatInTimeZone(date, getTimezone(), 'hh:mm aaa');
}
