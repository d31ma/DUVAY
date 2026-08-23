// DuVay — attribute value parsing
//
// Native reimplementation of the shared helpers in src/components/utils.js,
// validated against spec/fixtures/values.json.

import Foundation

public enum DuVayValues {

    /// Parse a comma-separated list or a JSON array into trimmed, non-empty entries.
    public static func valueList(_ value: String?) -> [String] {
        let text = (value ?? "").trimmingCharacters(in: .whitespaces)
        guard !text.isEmpty else { return [] }

        if text.hasPrefix("[") {
            if let data = text.data(using: .utf8),
               let parsed = try? JSONSerialization.jsonObject(with: data),
               let array = parsed as? [Any] {
                return array.map { String(describing: $0).trimmingCharacters(in: .whitespaces) }
                    .filter { !$0.isEmpty }
            }
            // Malformed JSON that still looks like a list is salvaged by hand,
            // matching the web behaviour for hand-authored attribute values.
            guard text.hasSuffix("]") else { return [] }
            return text.dropFirst().dropLast()
                .split(separator: ",", omittingEmptySubsequences: false)
                .map {
                    $0.trimmingCharacters(in: .whitespaces)
                        .trimmingCharacters(in: CharacterSet(charactersIn: "\"'"))
                }
                .filter { !$0.isEmpty }
        }

        return text.split(separator: ",", omittingEmptySubsequences: false)
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }
    }

    /// The finite numbers in a value list, or `fallback` when there are none.
    public static func numberList(_ value: String?, fallback: [Double] = []) -> [Double] {
        let numbers = valueList(value).compactMap(Double.init).filter { $0.isFinite }
        return numbers.isEmpty ? fallback : numbers
    }

    /// Up to two uppercase initials from a name.
    public static func initials(_ value: String?) -> String {
        (value ?? "")
            .split(whereSeparator: \.isWhitespace)
            .compactMap(\.first)
            .prefix(2)
            .map { String($0).uppercased() }
            .joined()
    }

    /// `YYYY-MM-DD` for a local date.
    public static func isoDate(_ date: Date) -> String { DuVayCalendar.iso(date) }

    /// Parse `YYYY-MM-DD` into local midnight, rejecting overflowed dates.
    public static func parseIsoDate(_ value: String?) -> Date? {
        guard let value, let m = try? /^(\d{4})-(\d{2})-(\d{2})$/.wholeMatch(in: value) else { return nil }
        var parts = DateComponents()
        parts.year = Int(m.1)
        parts.month = Int(m.2)
        parts.day = Int(m.3)
        let cal = DuVayCalendar.calendar
        guard let date = cal.date(from: parts) else { return nil }
        let check = cal.dateComponents([.year, .month, .day], from: date)
        guard check.year == parts.year, check.month == parts.month, check.day == parts.day else { return nil }
        return date
    }

    /// Whether two dates fall on the same calendar day.
    public static func isSameDate(_ a: Date?, _ b: Date?) -> Bool {
        guard let a, let b else { return false }
        return DuVayCalendar.calendar.isDate(a, inSameDayAs: b)
    }

    /// Whether a date sits within an inclusive range. Nil bounds are ignored.
    public static func dateInRange(_ date: Date?, min: Date?, max: Date?) -> Bool {
        guard let date else { return false }
        if let min, date < min { return false }
        if let max, date > max { return false }
        return true
    }

    /// A URL safe to navigate to.
    ///
    /// Trust boundary: only http/https survive, plus relative references. This
    /// is what keeps `javascript:` and `data:` payloads out of href sinks, so
    /// the fixture suite pins it on every platform.
    public static func safeUrl(_ value: String?) -> String {
        let raw = (value ?? "").trimmingCharacters(in: .whitespaces)
        guard !raw.isEmpty else { return "" }
        // Control characters are used to smuggle a scheme past naive parsers.
        if raw.unicodeScalars.contains(where: { $0.value <= 0x1f || $0.value == 0x7f }) { return "" }

        guard let url = URL(string: raw, relativeTo: URL(string: "https://duvay.invalid/")) else { return "" }
        guard let scheme = url.scheme?.lowercased() else { return "" }
        return scheme == "http" || scheme == "https" ? raw : ""
    }
}
