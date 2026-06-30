/* DuVay shared component helpers */

export function wBoolAttr(host, name, fallback = false) {
  const value = host.getAttribute(name);
  if (value == null) return fallback;
  return value !== 'false' && value !== '0';
}

export function wNumberAttr(host, name, fallback) {
  const value = Number(host.getAttribute(name));
  return Number.isFinite(value) ? value : fallback;
}

export function wValue(host, fallback = '') {
  return host.getAttribute('value') ?? fallback;
}

export function wValueList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item ?? '').trim()).filter(Boolean);
  }

  const text = String(value || '').trim();
  if (!text) return [];

  if (text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed)
        ? parsed.map((item) => String(item ?? '').trim()).filter(Boolean)
        : [];
    } catch {
      if (!text.endsWith(']')) return [];
      return text.slice(1, -1).split(',').map((item) => item.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    }
  }

  return text.split(',').map((item) => item.trim()).filter(Boolean);
}

export function wNumberList(value, fallback = []) {
  const values = wValueList(value)
    .map((item) => Number.parseFloat(item))
    .filter(Number.isFinite);
  return values.length ? values : fallback;
}

export function wRows(value) {
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (Array.isArray(item)) return item.join('|');
      return String(item ?? '').trim();
    }).filter(Boolean);
  }

  const text = String(value || '').trim();
  if (!text) return [];

  if (text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? wRows(parsed) : [];
    } catch {
      if (!text.endsWith(']')) return [];
      return wRows(text.slice(1, -1));
    }
  }

  const separator = text.includes(';') ? ';' : ',';
  return text.split(separator).map((item) => item.trim()).filter(Boolean);
}

export function wFields(row) {
  if (Array.isArray(row)) return row.map((item) => String(item ?? '').trim());
  return String(row || '').split('|').map((item) => item.trim());
}

export function wParseRecords(value, headers = []) {
  if (Array.isArray(value)) return value;

  const text = String(value || '').trim();
  if (!text) return [];

  if (text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      if (!text.endsWith(']')) return [];
      const inner = text.slice(1, -1).trim();
      if (!inner) return [];
      return wRows(inner).map((row) => {
        const fields = wFields(row);
        if (!headers.length) return fields;
        return headers.reduce((record, header, index) => {
          record[header] = fields[index] ?? '';
          return record;
        }, {});
      });
    }
  }
  return wRows(text).map((row) => {
    const fields = wFields(row);
    if (!headers.length) return fields;
    return headers.reduce((record, header, index) => {
      record[header] = fields[index] ?? '';
      return record;
    }, {});
  });
}

export function wRecordValue(record, key, index = 0) {
  if (Array.isArray(record)) return record[index] ?? '';
  if (record && typeof record === 'object') return record[key] ?? Object.values(record)[index] ?? '';
  return record ?? '';
}

export function wEscapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function wInitials(value) {
  return String(value || '')
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function wIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/* Parse an ISO date string (YYYY-MM-DD) into a local Date at midnight.
   Returns null if the string is invalid or out of range. */
export function wParseIsoDate(value) {
  if (!value || typeof value !== 'string') return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }
  return date;
}

/* Format a Date with a simple token pattern.
   Supported tokens: yyyy/yy, MM/M, dd/d. */
export function wFormatDate(date, format) {
  if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return String(format || 'yyyy-MM-dd')
    .replace(/yyyy/g, String(year))
    .replace(/yy/g, String(year).slice(-2))
    .replace(/MM/g, pad(month))
    .replace(/M(?!M)/g, String(month))
    .replace(/dd/g, pad(day))
    .replace(/d(?!d)/g, String(day));
}

/* Parse a comma-separated list of ISO dates into Date objects. */
export function wParseDateList(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => wParseIsoDate(item.trim()))
    .filter(Boolean);
}

/* Compare two Dates by calendar day (year, month, date). */
export function wIsSameDate(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

/* Check whether a date is within an inclusive min/max range.
   Null bounds are ignored. */
export function wDateInRange(date, min, max) {
  if (!date) return false;
  const time = date.getTime();
  if (min && time < min.getTime()) return false;
  if (max && time > max.getTime()) return false;
  return true;
}

/* Check whether a date falls strictly between two inclusive bounds. */
export function wDateBetween(date, start, end) {
  if (!date || !start || !end) return false;
  const time = date.getTime();
  const s = start.getTime();
  const e = end.getTime();
  return time >= Math.min(s, e) && time <= Math.max(s, e);
}

export function wClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function wMaskValue(value, mask) {
  if (!mask) return value;
  const raw = String(value || '').replace(/\W/g, '');
  let index = 0;
  let output = '';
  for (const token of mask) {
    const char = raw[index];
    if (!char) break;
    if (token === '#') {
      if (!/\d/.test(char)) { index += 1; continue; }
      output += char;
      index += 1;
    } else if (token === 'A') {
      if (!/[a-z]/i.test(char)) { index += 1; continue; }
      output += char.toUpperCase();
      index += 1;
    } else if (token === '*') {
      output += char;
      index += 1;
    } else {
      output += token;
    }
  }
  return output;
}

export function wPrimitiveBoolAttr(host, name, fallback = false) {
  const value = host.getAttribute(name);
  if (value == null) return fallback;
  return value !== 'false' && value !== '0';
}

export function wPrimitiveValue(host, fallback = '') {
  return host.getAttribute('value') ?? fallback;
}
