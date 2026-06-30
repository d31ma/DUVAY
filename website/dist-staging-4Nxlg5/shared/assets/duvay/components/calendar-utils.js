const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;

export function wCalendarDate(value, fallback = null) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return new Date(value);
  if (typeof value === 'number' && Number.isFinite(value)) return new Date(value);
  if (typeof value !== 'string') return fallback ? new Date(fallback) : null;

  const match = value.trim().match(ISO_DATE_RE);
  if (!match) return fallback ? new Date(fallback) : null;

  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4] || 0),
    Number(match[5] || 0),
    Number(match[6] || 0),
  );
  if (
    date.getFullYear() !== Number(match[1])
    || date.getMonth() !== Number(match[2]) - 1
    || date.getDate() !== Number(match[3])
  ) return fallback ? new Date(fallback) : null;

  return date;
}

export function wCalendarIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function wCalendarDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
}

export function wCalendarAddDays(date, amount) {
  const next = wCalendarDay(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function wCalendarAddMonths(date, amount) {
  const day = date.getDate();
  const next = new Date(date.getFullYear(), date.getMonth() + amount, 1, 12);
  const last = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(day, last));
  return next;
}

export function wCalendarStartOfWeek(date, firstDay = 0) {
  const start = wCalendarDay(date);
  const offset = (start.getDay() - firstDay + 7) % 7;
  return wCalendarAddDays(start, -offset);
}

export function wCalendarEndOfWeek(date, firstDay = 0) {
  return wCalendarAddDays(wCalendarStartOfWeek(date, firstDay), 6);
}

export function wCalendarDays(start, end, max = Number.MAX_SAFE_INTEGER) {
  const days = [];
  let cursor = wCalendarDay(start);
  const finish = wCalendarDay(end);
  while (cursor <= finish && days.length < max) {
    days.push(cursor);
    cursor = wCalendarAddDays(cursor, 1);
  }
  return days;
}

export function wCalendarMinutes(date) {
  return date.getHours() * 60 + date.getMinutes();
}

export function wCalendarHasTime(value) {
  return typeof value === 'string' && /[ T]\d{1,2}:\d{2}/.test(value);
}

export function wCalendarWeekNumber(date, firstDay = 1, firstDayOfYear = 4) {
  const target = wCalendarDay(date);
  const yearStart = new Date(target.getFullYear(), 0, firstDayOfYear, 12);
  const weekStart = wCalendarStartOfWeek(yearStart, firstDay);
  if (target < weekStart) {
    return wCalendarWeekNumber(new Date(target.getFullYear() - 1, 11, 31, 12), firstDay, firstDayOfYear);
  }
  return Math.floor((target - weekStart) / 86400000 / 7) + 1;
}

export function wCalendarJson(value, fallback = []) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return value;
  const source = String(value || '').trim();
  if (!source) return fallback;
  try {
    const parsed = JSON.parse(source);
    return parsed == null ? fallback : parsed;
  } catch {
    return fallback;
  }
}

export function wCalendarColor(value, fallback = 'primary') {
  const color = String(value || fallback).trim();
  if (!color) return `var(--w-${fallback})`;
  if (
    color.startsWith('#')
    || color.startsWith('rgb')
    || color.startsWith('hsl')
    || color.startsWith('oklch')
    || color.startsWith('var(')
    || color === 'transparent'
    || color === 'currentColor'
  ) return color;
  return `var(--w-${color})`;
}
