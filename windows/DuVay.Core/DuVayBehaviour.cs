// DuVay — shared behaviour (Windows/.NET)
//
// Native reimplementation of the calendar, value-parsing and input-mask logic
// in src/components/, validated against spec/fixtures/*.json.
//
// Dates are DateTime with DateTimeKind.Unspecified — civil wall-clock values
// with no zone, matching the web implementation's use of local Date components
// and making these functions timezone-independent by construction.

using System.Globalization;
using System.Text;

namespace DuVay.Core;

public static class DuVayCalendar
{
    /// <summary>
    /// Parse <c>YYYY-MM-DD[ HH:mm[:ss]]</c>.
    /// Overflowed calendar dates are rejected rather than rolled over:
    /// <c>2024-02-31</c> is null, not 2 March.
    /// </summary>
    public static DateTime? Date(string? value, DateTime? fallback = null)
    {
        if (value is null) return fallback;
        var text = value.Trim();
        string[] formats = ["yyyy-MM-dd", "yyyy-MM-dd HH:mm", "yyyy-MM-dd'T'HH:mm",
                            "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd'T'HH:mm:ss",
                            "yyyy-MM-dd H:mm", "yyyy-MM-dd'T'H:mm",
                            "yyyy-MM-dd H:mm:ss", "yyyy-MM-dd'T'H:mm:ss"];
        // ParseExact rejects impossible dates outright, which is the behaviour
        // the fixtures pin — no separate overflow check is needed.
        return DateTime.TryParseExact(text, formats, CultureInfo.InvariantCulture,
                                      DateTimeStyles.None, out var parsed)
            ? parsed
            : fallback;
    }

    /// <summary><c>YYYY-MM-DD</c>.</summary>
    public static string Iso(DateTime date) => date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

    /// <summary>
    /// The date's calendar day, anchored at noon — so day-granular comparisons
    /// survive a daylight-saving transition when these values are later zoned.
    /// </summary>
    public static DateTime Day(DateTime date) => date.Date.AddHours(12);

    public static DateTime AddDays(DateTime date, int amount) => Day(date).AddDays(amount);

    /// <summary>
    /// Add months, clamping the day to the target month's length.
    /// 31 January + 1 month is 28 February (29 in a leap year), never 3 March.
    /// <c>DateTime.AddMonths</c> already clamps, which is what is required.
    /// </summary>
    public static DateTime AddMonths(DateTime date, int amount) => Day(date).AddMonths(amount);

    /// <summary>Start of the week containing <paramref name="date"/>. 0 = Sunday.</summary>
    public static DateTime StartOfWeek(DateTime date, int firstDay = 0)
    {
        var start = Day(date);
        var weekday = (int)start.DayOfWeek; // already 0 = Sunday
        var offset = ((weekday - firstDay) % 7 + 7) % 7;
        return start.AddDays(-offset);
    }

    public static DateTime EndOfWeek(DateTime date, int firstDay = 0) =>
        StartOfWeek(date, firstDay).AddDays(6);

    /// <summary>Every day from start to end inclusive, capped at <paramref name="max"/>.</summary>
    public static List<DateTime> Days(DateTime start, DateTime end, int max = int.MaxValue)
    {
        var result = new List<DateTime>();
        var cursor = Day(start);
        var finish = Day(end);
        while (cursor <= finish && result.Count < max)
        {
            result.Add(cursor);
            cursor = cursor.AddDays(1);
        }
        return result;
    }

    /// <summary>Minutes since midnight.</summary>
    public static int Minutes(DateTime date) => date.Hour * 60 + date.Minute;

    /// <summary>Whether a raw value carries a time as well as a date.</summary>
    public static bool HasTime(string? value) =>
        value is not null && System.Text.RegularExpressions.Regex.IsMatch(value, @"[ T]\d{1,2}:\d{2}");

    /// <summary>
    /// Week number, counting from the week containing <paramref name="firstDayOfYear"/> January.
    /// Mirrors the web implementation exactly, including its year-boundary
    /// behaviour — parity means matching DuVay, not matching ISO-8601.
    /// </summary>
    public static int WeekNumber(DateTime date, int firstDay = 1, int firstDayOfYear = 4)
    {
        var target = Day(date);
        var anchor = new DateTime(target.Year, 1, firstDayOfYear, 12, 0, 0);
        var weekStart = StartOfWeek(anchor, firstDay);

        if (target < weekStart)
        {
            return WeekNumber(new DateTime(target.Year - 1, 12, 31, 12, 0, 0), firstDay, firstDayOfYear);
        }
        var elapsed = Math.Round((target - weekStart).TotalDays);
        return (int)(elapsed / 7) + 1;
    }

    /// <summary>Whether a value satisfies an allow-list. A null rule permits everything.</summary>
    public static bool AllowedBy(IReadOnlyList<string>? rule, string value) =>
        rule is null || rule.Any(item => item == value);

    /// <summary>Normalise an event colour into a CSS-ready token reference.</summary>
    public static string Color(string? value, string fallback = "primary")
    {
        var raw = (string.IsNullOrEmpty(value) ? fallback : value).Trim();
        if (raw.Length == 0) return $"var(--w-{fallback})";
        string[] literals = ["#", "rgb", "hsl", "oklch", "var("];
        if (literals.Any(raw.StartsWith) || raw is "transparent" or "currentColor") return raw;
        return $"var(--w-{raw})";
    }
}

public static class DuVayValues
{
    /// <summary>Parse a comma-separated list or a JSON array into trimmed, non-empty entries.</summary>
    public static List<string> ValueList(string? value)
    {
        var text = value?.Trim() ?? "";
        if (text.Length == 0) return [];

        if (text.StartsWith('['))
        {
            // Hand-authored attribute values are often not valid JSON, so a
            // bracketed list is salvaged by splitting rather than rejected.
            if (!text.EndsWith(']')) return [];
            return text[1..^1]
                .Split(',')
                .Select(item => item.Trim().Trim('"', '\''))
                .Where(item => item.Length > 0)
                .ToList();
        }

        return text.Split(',').Select(item => item.Trim()).Where(item => item.Length > 0).ToList();
    }

    /// <summary>The finite numbers in a value list, or <paramref name="fallback"/> when there are none.</summary>
    public static List<double> NumberList(string? value, List<double>? fallback = null)
    {
        var numbers = ValueList(value)
            .Select(item => double.TryParse(item, NumberStyles.Float, CultureInfo.InvariantCulture, out var n)
                ? (double?)n : null)
            .Where(n => n.HasValue && double.IsFinite(n.Value))
            .Select(n => n!.Value)
            .ToList();
        return numbers.Count > 0 ? numbers : fallback ?? [];
    }

    /// <summary>Up to two uppercase initials from a name.</summary>
    public static string Initials(string? value) =>
        string.Concat((value ?? "")
            .Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries)
            .Select(part => part[0])
            .Take(2))
            .ToUpperInvariant();

    /// <summary>Parse <c>YYYY-MM-DD</c> into midnight, rejecting overflowed dates.</summary>
    public static DateTime? ParseIsoDate(string? value)
    {
        if (value is null || value.Length != 10) return null;
        return DateTime.TryParseExact(value, "yyyy-MM-dd", CultureInfo.InvariantCulture,
                                      DateTimeStyles.None, out var parsed)
            ? parsed
            : null;
    }

    /// <summary>Whether two dates fall on the same calendar day.</summary>
    public static bool IsSameDate(DateTime? a, DateTime? b) =>
        a.HasValue && b.HasValue && a.Value.Date == b.Value.Date;

    /// <summary>Whether a date sits within an inclusive range. Null bounds are ignored.</summary>
    public static bool DateInRange(DateTime? date, DateTime? min, DateTime? max)
    {
        if (!date.HasValue) return false;
        if (min.HasValue && date.Value < min.Value) return false;
        if (max.HasValue && date.Value > max.Value) return false;
        return true;
    }

    /// <summary>
    /// A URL safe to navigate to. Trust boundary: only http/https survive, plus
    /// relative references. This is what keeps <c>javascript:</c> and
    /// <c>data:</c> payloads out of link sinks.
    /// </summary>
    public static string SafeUrl(string? value)
    {
        var raw = value?.Trim() ?? "";
        if (raw.Length == 0) return "";
        // Control characters are used to smuggle a scheme past naive parsers.
        if (raw.Any(c => c <= 0x1f || c == 0x7f)) return "";

        if (!Uri.TryCreate(new Uri("https://duvay.invalid/"), raw, out var resolved)) return "";
        var scheme = resolved.Scheme.ToLowerInvariant();
        return scheme is "http" or "https" ? raw : "";
    }
}

public static class DuVayMask
{
    private static bool IsToken(char c) => c is '#' or 'A' or 'N' or 'X';

    private static bool Matches(char token, char c) => token switch
    {
        '#' => char.IsAsciiDigit(c),
        'A' => char.IsLetter(c),
        'N' => char.IsLetterOrDigit(c),
        'X' => true,
        _ => false,
    };

    /// <summary>
    /// Apply <paramref name="mask"/> to <paramref name="value"/>. Input
    /// characters that cannot satisfy the current token are skipped, so
    /// <c>AAA-###</c> over <c>123abc</c> yields <c>abc</c>.
    /// </summary>
    public static string Apply(string mask, string value)
    {
        var input = value.ToCharArray();
        var index = 0;
        var output = new StringBuilder();

        var cursor = 0;
        while (cursor < mask.Length)
        {
            var token = mask[cursor];
            var escaped = false;
            if (token == '\\' && cursor + 1 < mask.Length)
            {
                cursor++;
                token = mask[cursor];
                escaped = true;
            }

            if (escaped)
            {
                if (index < input.Length) output.Append(token);
                cursor++;
                continue;
            }

            if (!IsToken(token))
            {
                // Literal: emit while input remains, and consume a matching
                // input character so a pre-formatted value round-trips.
                if (index < input.Length) output.Append(token);
                if (index < input.Length && input[index] == token) index++;
                cursor++;
                continue;
            }

            while (index < input.Length && !Matches(token, input[index])) index++;
            if (index >= input.Length) break;
            output.Append(input[index]);
            index++;
            cursor++;
        }

        return output.ToString();
    }

    /// <summary>Strip a mask's literal characters back out of a formatted value.</summary>
    public static string Unmask(string mask, string value)
    {
        var literals = new HashSet<char>();
        var cursor = 0;
        while (cursor < mask.Length)
        {
            var c = mask[cursor];
            if (c == '\\' && cursor + 1 < mask.Length)
            {
                cursor++;
                literals.Add(mask[cursor]);
            }
            else if (!IsToken(c))
            {
                literals.Add(c);
            }
            cursor++;
        }
        return new string(value.Where(c => !literals.Contains(c)).ToArray());
    }
}
