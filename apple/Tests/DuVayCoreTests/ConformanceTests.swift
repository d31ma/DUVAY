// DuVay — Layer 2 conformance suite (Apple)
//
// Loads spec/fixtures/*.json and asserts this platform reproduces every vector.
// These are the same files the Android, Windows and Linux suites read, so a
// disagreement between platforms surfaces here rather than in an application.
//
// A platform is not "at parity" for its tier until this suite is green.

import Foundation
import Testing
@testable import DuVayCore

// MARK: - Fixture decoding

/// A fixture argument: a JSON scalar, or `{"$date": "…"}` for a local date.
enum Value: Decodable, Equatable, CustomStringConvertible {
    case null
    case bool(Bool)
    case number(Double)
    case string(String)
    case date(Date)
    case list([Value])

    private struct DateBox: Decodable { let date: String; enum CodingKeys: String, CodingKey { case date = "$date" } }

    init(from decoder: Decoder) throws {
        let c = try decoder.singleValueContainer()
        if c.decodeNil() { self = .null; return }
        if let v = try? c.decode(Bool.self) { self = .bool(v); return }
        if let v = try? c.decode(Double.self) { self = .number(v); return }
        if let v = try? c.decode(String.self) { self = .string(v); return }
        if let v = try? c.decode([Value].self) { self = .list(v); return }
        if let box = try? c.decode(DateBox.self) {
            guard let parsed = Value.parseLocal(box.date) else {
                throw DecodingError.dataCorruptedError(in: c, debugDescription: "bad $date \(box.date)")
            }
            self = .date(parsed)
            return
        }
        throw DecodingError.dataCorruptedError(in: c, debugDescription: "unsupported fixture value")
    }

    /// `YYYY-MM-DDTHH:mm:ss`, interpreted in the local zone — never UTC.
    static func parseLocal(_ text: String) -> Date? {
        let parts = text.split(separator: "T")
        let ymd = parts[0].split(separator: "-").compactMap { Int($0) }
        let hms = parts.count > 1 ? parts[1].split(separator: ":").compactMap { Int($0) } : [12, 0, 0]
        guard ymd.count == 3, hms.count == 3 else { return nil }
        var c = DateComponents()
        (c.year, c.month, c.day) = (ymd[0], ymd[1], ymd[2])
        (c.hour, c.minute, c.second) = (hms[0], hms[1], hms[2])
        return DuVayCalendar.calendar.date(from: c)
    }

    var asString: String? { if case .string(let s) = self { return s }; return nil }
    var asDate: Date? { if case .date(let d) = self { return d }; return nil }
    var asInt: Int? { if case .number(let n) = self { return Int(n) }; return nil }
    var isNull: Bool { self == .null }

    var description: String {
        switch self {
        case .null: return "null"
        case .bool(let b): return "\(b)"
        case .number(let n): return n == n.rounded() ? "\(Int(n))" : "\(n)"
        case .string(let s): return "\"\(s)\""
        case .date(let d): return "date(\(DuVayCalendar.iso(d)))"
        case .list(let l): return "[\(l.map(\.description).joined(separator: ", "))]"
        }
    }
}

struct Case: Decodable {
    let fn: String
    let args: [Value]
    let expected: Value
}

struct Suite: Decodable {
    let cases: [Case]
}

// MARK: - Encoding results back into fixture space

/// Convert a native result into the fixture's representation so the two can be
/// compared without either side knowing about the other's types.
func encode(_ value: Any?) -> Value {
    switch value {
    case nil: return .null
    case let v as Bool: return .bool(v)
    case let v as Int: return .number(Double(v))
    case let v as Double: return .number(v)
    case let v as String: return .string(v)
    case let v as Date: return .date(v)
    case let v as [Date]: return .list(v.map { .date($0) })
    case let v as [String]: return .list(v.map { .string($0) })
    case let v as [Double]: return .list(v.map { .number($0) })
    default: return .string(String(describing: value!))
    }
}

// MARK: - Dispatch

/// Route one fixture case to its native implementation.
///
/// Unknown function names throw rather than being skipped — a fixture the
/// platform does not implement is a parity gap, not something to pass over.
func invoke(_ c: Case) throws -> Value {
    let a = c.args
    switch c.fn {

    // calendar.json
    case "wCalendarDate":
        return encode(DuVayCalendar.date(a[0].asString))
    case "wCalendarIso":
        return encode(DuVayCalendar.iso(a[0].asDate!))
    case "wCalendarDay":
        return encode(DuVayCalendar.day(a[0].asDate!))
    case "wCalendarAddDays":
        return encode(DuVayCalendar.addDays(a[0].asDate!, a[1].asInt!))
    case "wCalendarAddMonths":
        return encode(DuVayCalendar.addMonths(a[0].asDate!, a[1].asInt!))
    case "wCalendarStartOfWeek":
        return encode(DuVayCalendar.startOfWeek(a[0].asDate!, firstDay: a[1].asInt ?? 0))
    case "wCalendarEndOfWeek":
        return encode(DuVayCalendar.endOfWeek(a[0].asDate!, firstDay: a[1].asInt ?? 0))
    case "wCalendarDays":
        return encode(DuVayCalendar.days(from: a[0].asDate!, to: a[1].asDate!, max: a.count > 2 ? a[2].asInt! : Int.max))
    case "wCalendarMinutes":
        return encode(DuVayCalendar.minutes(a[0].asDate!))
    case "wCalendarHasTime":
        return encode(DuVayCalendar.hasTime(a[0].asString))
    case "wCalendarWeekNumber":
        return encode(DuVayCalendar.weekNumber(a[0].asDate!))
    case "wAllowedBy":
        let rule: [String]? = {
            if case .list(let items) = a[0] { return items.compactMap(\.asString) }
            return nil
        }()
        return encode(DuVayCalendar.allowed(by: rule, value: a[1].asString ?? ""))
    case "wCalendarColor":
        return encode(DuVayCalendar.color(a[0].asString))

    // values.json
    case "wValueList":
        return encode(DuVayValues.valueList(a[0].asString))
    case "wNumberList":
        return encode(DuVayValues.numberList(a[0].asString))
    case "wInitials":
        return encode(DuVayValues.initials(a[0].asString))
    case "wParseIsoDate":
        return encode(DuVayValues.parseIsoDate(a[0].asString))
    case "wIsSameDate":
        return encode(DuVayValues.isSameDate(a[0].asDate, a[1].asDate))
    case "wDateInRange":
        return encode(DuVayValues.dateInRange(a[0].asDate, min: a[1].asDate, max: a[2].asDate))
    case "wSafeUrl":
        return encode(DuVayValues.safeUrl(a[0].asString))

    // mask.json
    case "applyMask":
        return encode(DuVayMask.apply(mask: a[0].asString!, to: a[1].asString!))
    case "unmask":
        return encode(DuVayMask.unmask(mask: a[0].asString!, from: a[1].asString!))

    default:
        struct Unimplemented: Error, CustomStringConvertible {
            let fn: String
            var description: String { "no Apple implementation for fixture function \(fn)" }
        }
        throw Unimplemented(fn: c.fn)
    }
}

// MARK: - Tests

@Suite("Layer 2 conformance")
struct ConformanceTests {

    static func load(_ name: String) throws -> [Case] {
        guard let url = Bundle.module.url(forResource: "Fixtures/\(name)", withExtension: "json") else {
            Issue.record("missing fixture \(name).json — run `bun run fixtures:build`")
            return []
        }
        return try JSONDecoder().decode(Suite.self, from: Data(contentsOf: url)).cases
    }

    @Test("calendar vectors", arguments: try load("calendar"))
    func calendar(_ c: Case) throws {
        #expect(try invoke(c) == c.expected, "\(c.fn)(\(c.args.map(\.description).joined(separator: ", ")))")
    }

    @Test("value vectors", arguments: try load("values"))
    func values(_ c: Case) throws {
        #expect(try invoke(c) == c.expected, "\(c.fn)(\(c.args.map(\.description).joined(separator: ", ")))")
    }

    @Test("mask vectors", arguments: try load("mask"))
    func mask(_ c: Case) throws {
        #expect(try invoke(c) == c.expected, "\(c.fn)(\(c.args.map(\.description).joined(separator: ", ")))")
    }
}
