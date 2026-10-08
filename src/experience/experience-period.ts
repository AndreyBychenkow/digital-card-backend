const MONTH_NAMES = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
] as const;

export const ONGOING_LABEL = 'настоящее время';

/**
 * Dates in the database are the first day of a month. Everything here works in UTC,
 * otherwise a server in a western timezone would show the previous month.
 */
export function formatMonth(date: Date): string {
  const name = MONTH_NAMES[date.getUTCMonth()];
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${date.getUTCFullYear()}`;
}

/** "Февраль 2026 — Август 2026", or "Май 2025 — настоящее время" for an ongoing job. */
export function formatPeriod(startDate: Date, endDate: Date | null): string {
  const end = endDate ? formatMonth(endDate) : ONGOING_LABEL;
  return `${formatMonth(startDate)} — ${end}`;
}

/**
 * Number of calendar months the job covers, counting both the start and the end month.
 * An ongoing job is counted up to `now`.
 */
export function countMonths(startDate: Date, endDate: Date | null, now: Date = new Date()): number {
  const end = endDate ?? now;
  const months =
    (end.getUTCFullYear() - startDate.getUTCFullYear()) * 12 +
    (end.getUTCMonth() - startDate.getUTCMonth());
  return Math.max(months + 1, 0);
}
