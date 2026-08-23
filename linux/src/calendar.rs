//! Calendar arithmetic.
//!
//! A native reimplementation of `src/components/calendar-utils.js`, validated
//! against `spec/fixtures/calendar.json`.
//!
//! Dates are plain civil (wall-clock) values with no timezone, matching the web
//! implementation's use of local `Date` components. Implementing the calendar
//! directly — rather than depending on `chrono` — keeps the crate's dependency
//! graph empty in its default configuration, which is what lets the conformance
//! suite run anywhere.

use std::cmp::Ordering;

/// A civil date-time: no zone, no leap seconds.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct DateTime {
    pub year: i32,
    pub month: u32,
    pub day: u32,
    pub hour: u32,
    pub minute: u32,
    pub second: u32,
}

impl PartialOrd for DateTime {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for DateTime {
    fn cmp(&self, other: &Self) -> Ordering {
        (self.year, self.month, self.day, self.hour, self.minute, self.second).cmp(&(
            other.year,
            other.month,
            other.day,
            other.hour,
            other.minute,
            other.second,
        ))
    }
}

impl DateTime {
    pub fn new(year: i32, month: u32, day: u32, hour: u32, minute: u32, second: u32) -> Option<Self> {
        if !(1..=12).contains(&month) || day == 0 || day > days_in_month(year, month) {
            return None;
        }
        if hour > 23 || minute > 59 || second > 59 {
            return None;
        }
        Some(Self { year, month, day, hour, minute, second })
    }

    /// `YYYY-MM-DD`.
    pub fn iso(&self) -> String {
        format!("{:04}-{:02}-{:02}", self.year, self.month, self.day)
    }

    /// `YYYY-MM-DDTHH:MM:SS`, the fixture wire format.
    pub fn iso_full(&self) -> String {
        format!(
            "{:04}-{:02}-{:02}T{:02}:{:02}:{:02}",
            self.year, self.month, self.day, self.hour, self.minute, self.second
        )
    }
}

pub fn is_leap(year: i32) -> bool {
    (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
}

pub fn days_in_month(year: i32, month: u32) -> u32 {
    match month {
        1 | 3 | 5 | 7 | 8 | 10 | 12 => 31,
        4 | 6 | 9 | 11 => 30,
        2 if is_leap(year) => 29,
        2 => 28,
        _ => 0,
    }
}

/// Days since 1970-01-01, for day arithmetic and weekday derivation.
fn to_epoch_day(y: i32, m: u32, d: u32) -> i64 {
    // Howard Hinnant's civil-from-days algorithm, inverted.
    let y = if m <= 2 { y - 1 } else { y } as i64;
    let era = if y >= 0 { y } else { y - 399 } / 400;
    let yoe = y - era * 400;
    let mp = ((m + 9) % 12) as i64;
    let doy = (153 * mp + 2) / 5 + d as i64 - 1;
    let doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    era * 146_097 + doe - 719_468
}

fn from_epoch_day(days: i64) -> (i32, u32, u32) {
    let z = days + 719_468;
    let era = if z >= 0 { z } else { z - 146_096 } / 146_097;
    let doe = z - era * 146_097;
    let yoe = (doe - doe / 1460 + doe / 36_524 - doe / 146_096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = (doy - (153 * mp + 2) / 5 + 1) as u32;
    let m = if mp < 10 { mp + 3 } else { mp - 9 } as u32;
    ((if m <= 2 { y + 1 } else { y }) as i32, m, d)
}

/// Weekday, 0 = Sunday … 6 = Saturday, matching JavaScript's `getDay()`.
fn weekday(dt: &DateTime) -> i64 {
    (to_epoch_day(dt.year, dt.month, dt.day) + 4).rem_euclid(7)
}

/// Parse `YYYY-MM-DD[ HH:mm[:ss]]`.
///
/// Overflowed calendar dates are rejected rather than rolled over:
/// `2024-02-31` is `None`, not 2 March.
pub fn date(value: &str) -> Option<DateTime> {
    let text = value.trim();
    let bytes = text.as_bytes();
    if bytes.len() < 10 || bytes[4] != b'-' || bytes[7] != b'-' {
        return None;
    }
    let year: i32 = text.get(0..4)?.parse().ok()?;
    let month: u32 = text.get(5..7)?.parse().ok()?;
    let day: u32 = text.get(8..10)?.parse().ok()?;

    let (mut hour, mut minute, mut second) = (0, 0, 0);
    if bytes.len() > 10 {
        if bytes[10] != b' ' && bytes[10] != b'T' {
            return None;
        }
        let time = text.get(11..)?;
        let mut segments = time.split(':');
        hour = segments.next()?.parse().ok()?;
        minute = segments.next()?.parse().ok()?;
        second = match segments.next() {
            Some(s) => s.parse().ok()?,
            None => 0,
        };
        if segments.next().is_some() {
            return None;
        }
    }
    DateTime::new(year, month, day, hour, minute, second)
}

/// The date's calendar day, anchored at noon.
///
/// Noon rather than midnight so day-granular comparisons survive a
/// daylight-saving transition when these values are later zoned.
pub fn day(dt: &DateTime) -> DateTime {
    DateTime { hour: 12, minute: 0, second: 0, ..*dt }
}

pub fn add_days(dt: &DateTime, amount: i64) -> DateTime {
    let base = day(dt);
    let (year, month, d) = from_epoch_day(to_epoch_day(base.year, base.month, base.day) + amount);
    DateTime { year, month, day: d, hour: 12, minute: 0, second: 0 }
}

/// Add months, clamping the day to the target month's length.
/// 31 January + 1 month is 28 February (29 in a leap year), never 3 March.
pub fn add_months(dt: &DateTime, amount: i64) -> DateTime {
    let total = dt.year as i64 * 12 + (dt.month as i64 - 1) + amount;
    let year = total.div_euclid(12) as i32;
    let month = total.rem_euclid(12) as u32 + 1;
    let last = days_in_month(year, month);
    DateTime { year, month, day: dt.day.min(last), hour: 12, minute: 0, second: 0 }
}

/// Start of the week containing `dt`. `first_day` is 0 = Sunday … 6 = Saturday.
pub fn start_of_week(dt: &DateTime, first_day: i64) -> DateTime {
    let start = day(dt);
    let offset = (weekday(&start) - first_day).rem_euclid(7);
    add_days(&start, -offset)
}

pub fn end_of_week(dt: &DateTime, first_day: i64) -> DateTime {
    add_days(&start_of_week(dt, first_day), 6)
}

/// Every day from `start` to `end` inclusive, capped at `max` entries.
pub fn days(start: &DateTime, end: &DateTime, max: usize) -> Vec<DateTime> {
    let mut out = Vec::new();
    let mut cursor = day(start);
    let finish = day(end);
    while cursor <= finish && out.len() < max {
        out.push(cursor);
        cursor = add_days(&cursor, 1);
    }
    out
}

/// Minutes since midnight.
pub fn minutes(dt: &DateTime) -> u32 {
    dt.hour * 60 + dt.minute
}

/// Whether a raw value carries a time as well as a date.
pub fn has_time(value: Option<&str>) -> bool {
    let Some(text) = value else { return false };
    let bytes = text.as_bytes();
    // Looking for `[ T]H:MM` or `[ T]HH:MM`.
    bytes.iter().enumerate().any(|(i, &c)| {
        if c != b' ' && c != b'T' {
            return false;
        }
        let rest = &bytes[i + 1..];
        let digits = rest.iter().take_while(|b| b.is_ascii_digit()).count();
        (1..=2).contains(&digits)
            && rest.get(digits) == Some(&b':')
            && rest.get(digits + 1..digits + 3).is_some_and(|d| d.iter().all(u8::is_ascii_digit))
    })
}

/// Week number, counting from the week containing `first_day_of_year` January.
///
/// Mirrors the web implementation exactly, including its year-boundary
/// behaviour — parity means matching DuVay, not matching ISO-8601.
pub fn week_number(dt: &DateTime, first_day: i64, first_day_of_year: u32) -> u32 {
    let target = day(dt);
    let anchor = DateTime { year: target.year, month: 1, day: first_day_of_year, hour: 12, minute: 0, second: 0 };
    let week_start = start_of_week(&anchor, first_day);

    if target < week_start {
        let prev = DateTime { year: target.year - 1, month: 12, day: 31, hour: 12, minute: 0, second: 0 };
        return week_number(&prev, first_day, first_day_of_year);
    }
    let elapsed = to_epoch_day(target.year, target.month, target.day)
        - to_epoch_day(week_start.year, week_start.month, week_start.day);
    (elapsed / 7) as u32 + 1
}

/// Whether `value` satisfies an allow-list. `None` permits everything.
pub fn allowed_by(rule: Option<&[String]>, value: &str) -> bool {
    match rule {
        None => true,
        Some(items) => items.iter().any(|item| item == value),
    }
}

/// Normalise an event colour into a CSS-ready token reference.
pub fn color(value: Option<&str>, fallback: &str) -> String {
    let raw = value.filter(|v| !v.is_empty()).unwrap_or(fallback).trim().to_string();
    if raw.is_empty() {
        return format!("var(--w-{fallback})");
    }
    let literal = ["#", "rgb", "hsl", "oklch", "var("].iter().any(|p| raw.starts_with(p))
        || raw == "transparent"
        || raw == "currentColor";
    if literal { raw } else { format!("var(--w-{raw})") }
}
