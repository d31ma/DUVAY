const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;

function fallbackDate(fallback) {
  return fallback ? new Date(fallback) : null;
}

function partsToDate(match) {
  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4] || 0),
    Number(match[5] || 0),
    Number(match[6] || 0),
  );
}

// Rejects overflowed calendar dates (2024-02-31 rolls into March).
function matchesParts(date, match) {
  return date.getFullYear() === Number(match[1])
    && date.getMonth() === Number(match[2]) - 1
    && date.getDate() === Number(match[3]);
}

export function wCalendarDate(value, fallback = null) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return new Date(value);
  if (typeof value === 'number' && Number.isFinite(value)) return new Date(value);
  if (typeof value !== 'string') return fallbackDate(fallback);

  const match = value.trim().match(ISO_DATE_RE);
  if (!match) return fallbackDate(fallback);

  const date = partsToDate(match);
  return matchesParts(date, match) ? date : fallbackDate(fallback);
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
  // Round to whole days first: a span crossing a daylight-saving change is an
  // hour short of a whole number of days, which would truncate the week down.
  const days = Math.round((target - weekStart) / 86400000);
  return Math.floor(days / 7) + 1;
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

/* Invoke a user-supplied accessor without letting it break rendering. */
export function wCallSafe(fn, ...args) {
  try {
    return fn(...args);
  } catch {
    return undefined;
  }
}

/* Vuetify's `allowed-dates` / `allowed-months` / `allowed-years` accept either
   an array of permitted values or a predicate function. `null`/`undefined`
   means "no restriction"; a throwing predicate fails open. */
export function wAllowedBy(rule, value) {
  if (rule == null) return true;
  if (typeof rule === 'function') return wCallSafe(rule, value) !== false;
  if (Array.isArray(rule)) return rule.some((item) => String(item) === String(value));
  return true;
}

/* Normalise an `events` / `event-color` entry into a list of CSS colours. */
export function wEventColorList(value) {
  if (Array.isArray(value)) return value.map((item) => wCalendarColor(item, 'primary'));
  if (typeof value === 'string' && value) return [wCalendarColor(value, 'primary')];
  return [];
}

function wDayCell(date, adjacent) {
  return {
    type: 'day',
    date,
    iso: wCalendarIso(date),
    day: date.getDate(),
    adjacent,
    weekday: date.getDay(),
  };
}

// `fill` is what an out-of-month cell collapses to when adjacent days are
// hidden: a laid-out placeholder ('spacer') or nothing at all ('empty').
function wMonthCell(date, showAdjacent, outside, fill) {
  if (!outside) return wDayCell(date, false);
  if (showAdjacent) return wDayCell(date, true);
  return { type: fill, weekday: date.getDay() };
}

function wChunkWeeks(cells, first, firstDay, weekdays) {
  const weekOne = wCalendarStartOfWeek(first, firstDay);
  const rows = [];
  for (let index = 0; index < cells.length; index += 7) {
    const week = cells.slice(index, index + 7);
    rows.push({
      weekStart: wCalendarAddDays(weekOne, index),
      cells: weekdays ? week.filter((cell) => weekdays.includes(cell.weekday)) : week,
    });
  }
  return rows;
}

/* Build the week rows of a month grid.
   options: { year, month (1-12), firstDayOfWeek, showAdjacentMonths,
              weeksInMonth ('static' pads to six rows), weekdays (0-6 filter) }
   Returns [{ weekStart: Date, cells: [{ type, date, iso, day, adjacent, weekday }] }]. */
export function wMonthRows(options = {}) {
  const year = options.year;
  const month = options.month;
  const firstDay = options.firstDayOfWeek || 0;
  const showAdjacent = Boolean(options.showAdjacentMonths);
  const staticWeeks = options.weeksInMonth === 'static';
  const first = new Date(year, month - 1, 1, 12);
  const offset = (first.getDay() - firstDay + 7) % 7;
  const total = new Date(year, month, 0).getDate();
  const cells = [];

  for (let lead = offset; lead > 0; lead -= 1) {
    cells.push(wMonthCell(new Date(year, month - 1, 1 - lead, 12), showAdjacent, true, 'spacer'));
  }
  for (let day = 1; day <= total; day += 1) {
    cells.push(wMonthCell(new Date(year, month - 1, day, 12), showAdjacent, false, 'spacer'));
  }

  const target = (staticWeeks ? 6 : Math.ceil(cells.length / 7)) * 7;
  const trailing = staticWeeks ? 'spacer' : 'empty';
  for (let day = 1; cells.length < target; day += 1) {
    cells.push(wMonthCell(new Date(year, month, day, 12), showAdjacent, true, trailing));
  }

  return wChunkWeeks(cells, first, firstDay, options.weekdays);
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
