import { countMonths, formatMonth, formatPeriod } from './experience-period.js';

const month = (year: number, monthIndex: number) => new Date(Date.UTC(year, monthIndex, 1));

describe('formatMonth', () => {
  it('returns a capitalised Russian month name with the year', () => {
    expect(formatMonth(month(2026, 1))).toBe('Февраль 2026');
    expect(formatMonth(month(2025, 9))).toBe('Октябрь 2025');
  });
});

describe('formatPeriod', () => {
  it('joins start and end months', () => {
    expect(formatPeriod(month(2026, 1), month(2026, 7))).toBe('Февраль 2026 — Август 2026');
  });

  it('uses the ongoing label when there is no end date', () => {
    expect(formatPeriod(month(2025, 4), null)).toBe('Май 2025 — настоящее время');
  });
});

describe('countMonths', () => {
  it('counts both the start and the end month', () => {
    expect(countMonths(month(2026, 1), month(2026, 7))).toBe(7);
  });

  it('handles a job that crosses a year boundary', () => {
    expect(countMonths(month(2025, 11), month(2026, 0))).toBe(2);
  });

  it('counts an ongoing job up to the given date', () => {
    expect(countMonths(month(2026, 1), null, new Date('2026-10-08T12:00:00Z'))).toBe(9);
  });

  it('returns 0 instead of a negative value when dates are reversed', () => {
    expect(countMonths(month(2026, 5), month(2026, 1))).toBe(0);
  });
});
