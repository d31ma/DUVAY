// DuVay — calendar arithmetic
//
// A native reimplementation of src/components/calendar-utils.js. It is
// deliberately NOT a port of the JavaScript: the plan's shared-behaviour
// mechanism is the language-neutral fixture suite in spec/fixtures, and each
// platform writes idiomatic code that satisfies it. DuVayCoreTests asserts
// every vector, so divergence is a test failure rather than a surprise.
//
// All arithmetic is in the current calendar and local time, matching the web
// implementation's use of local Date components.

import Foundation

public enum DuVayCalendar {

    /// The calendar every operation runs in. Local, Gregorian, current locale.
    public static var calendar: Calendar {
        var cal = Calendar(identifier: .gregorian)
        cal.timeZone = TimeZone.current
        return cal
    }

    // MARK: - Parsing

    // Computed, not stored: Regex is not Sendable, so a static stored property
    // is rejected under Swift 6 strict concurrency.
    private static var isoPattern: Regex<(Substring, Substring, Substring, Substring, Substring?, Substring?, Substring?)> {
        /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
    }

    /// Parse `YYYY-MM-DD[ HH:mm[:ss]]` into a local date.
    ///
    /// Overflowed calendar dates are rejected rather than rolled over:
    /// `2024-02-31` is nil, not 2 March. That is the behaviour the fixtures pin.
    public static func date(_ value: String?, fallback: Date? = nil) -> Date? {
        guard let value, let m = try? isoPattern.wholeMatch(in: value.trimmingCharacters(in: .whitespaces)) else {
            return fallback
        }
        var parts = DateComponents()
        parts.year = Int(m.1)
        parts.month = Int(m.2)
        parts.day = Int(m.3)
        parts.hour = m.4.flatMap { Int($0) } ?? 0
        parts.minute = m.5.flatMap { Int($0) } ?? 0
        parts.second = m.6.flatMap { Int($0) } ?? 0

        guard let result = calendar.date(from: parts) else { return fallback }
        // Reject overflow: Foundation would happily roll 31 February forward.
        let check = calendar.dateComponents([.year, .month, .day], from: result)
        guard check.year == parts.year, check.month == parts.month, check.day == parts.day else {
            return fallback
        }
        return result
    }

    /// `YYYY-MM-DD` for a local date.
    public static func iso(_ date: Date) -> String {
        let c = calendar.dateComponents([.year, .month, .day], from: date)
        return String(format: "%04d-%02d-%02d", c.year!, c.month!, c.day!)
    }

    // MARK: - Normalisation

    /// The date's calendar day, anchored at noon.
    ///
    /// Noon rather than midnight so that a day-granular comparison survives a
    /// daylight-saving transition, which can make midnight ambiguous or absent.
    public static func day(_ date: Date) -> Date {
        var c = calendar.dateComponents([.year, .month, .day], from: date)
        c.hour = 12
        c.minute = 0
        c.second = 0
        c.nanosecond = 0
        return calendar.date(from: c)!
    }

    // MARK: - Arithmetic

    public static func addDays(_ date: Date, _ amount: Int) -> Date {
        calendar.date(byAdding: .day, value: amount, to: day(date))!
    }

    /// Add months, clamping the day to the target month's length.
    ///
    /// 31 January + 1 month is 28 February (29 in a leap year), never 3 March.
    public static func addMonths(_ date: Date, _ amount: Int) -> Date {
        let wanted = calendar.component(.day, from: date)
        var first = calendar.dateComponents([.year, .month], from: date)
        first.day = 1
        first.hour = 12
        first.minute = 0
        first.second = 0
        let shifted = calendar.date(byAdding: .month, value: amount, to: calendar.date(from: first)!)!
        let lastDay = calendar.range(of: .day, in: .month, for: shifted)!.count
        return calendar.date(byAdding: .day, value: min(wanted, lastDay) - 1, to: shifted)!
    }

    /// Start of the week containing `date`. `firstDay` is 0=Sunday … 6=Saturday.
    public static func startOfWeek(_ date: Date, firstDay: Int = 0) -> Date {
        let start = day(date)
        // Calendar.component(.weekday) is 1-based from Sunday; JS getDay() is 0-based.
        let weekday = calendar.component(.weekday, from: start) - 1
        let offset = ((weekday - firstDay) % 7 + 7) % 7
        return addDays(start, -offset)
    }

    public static func endOfWeek(_ date: Date, firstDay: Int = 0) -> Date {
        addDays(startOfWeek(date, firstDay: firstDay), 6)
    }

    /// Every day from `start` to `end` inclusive, capped at `max` entries.
    public static func days(from start: Date, to end: Date, max: Int = Int.max) -> [Date] {
        var result: [Date] = []
        var cursor = day(start)
        let finish = day(end)
        while cursor <= finish && result.count < max {
            result.append(cursor)
            cursor = addDays(cursor, 1)
        }
        return result
    }

    /// Minutes since local midnight.
    public static func minutes(_ date: Date) -> Int {
        let c = calendar.dateComponents([.hour, .minute], from: date)
        return c.hour! * 60 + c.minute!
    }

    /// Whether a raw value carries a time component as well as a date.
    public static func hasTime(_ value: String?) -> Bool {
        guard let value else { return false }
        return value.contains(/[ T]\d{1,2}:\d{2}/)
    }

    /// Week number, counting from the week containing `firstDayOfYear` January.
    ///
    /// Mirrors the web implementation exactly, including its year-boundary
    /// behaviour — parity means matching DuVay, not matching ISO-8601.
    public static func weekNumber(_ date: Date, firstDay: Int = 1, firstDayOfYear: Int = 4) -> Int {
        let target = day(date)
        let year = calendar.component(.year, from: target)
        var anchor = DateComponents()
        anchor.year = year
        anchor.month = 1
        anchor.day = firstDayOfYear
        anchor.hour = 12
        let weekStart = startOfWeek(calendar.date(from: anchor)!, firstDay: firstDay)

        if target < weekStart {
            var lastYear = DateComponents()
            lastYear.year = year - 1
            lastYear.month = 12
            lastYear.day = 31
            lastYear.hour = 12
            return weekNumber(calendar.date(from: lastYear)!, firstDay: firstDay, firstDayOfYear: firstDayOfYear)
        }

        // Round to whole days first: a span crossing a daylight-saving change
        // is an hour short of a whole number of days, which would truncate down.
        let elapsed = (target.timeIntervalSince(weekStart) / 86_400).rounded()
        return Int(elapsed / 7) + 1
    }

    // MARK: - Rules

    /// Whether `value` satisfies an allow-list. A nil rule permits everything.
    public static func allowed(by rule: [String]?, value: String) -> Bool {
        guard let rule else { return true }
        return rule.contains { $0 == value }
    }

    /// Normalise an event colour into a CSS-ready token reference.
    public static func color(_ value: String?, fallback: String = "primary") -> String {
        let raw = (value?.isEmpty == false ? value! : fallback).trimmingCharacters(in: .whitespaces)
        if raw.isEmpty { return "var(--w-\(fallback))" }
        for prefix in ["#", "rgb", "hsl", "oklch", "var("] where raw.hasPrefix(prefix) {
            return raw
        }
        if raw == "transparent" || raw == "currentColor" { return raw }
        return "var(--w-\(raw))"
    }
}
