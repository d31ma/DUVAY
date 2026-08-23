// DuVay — Layer 2 conformance suite (Windows/.NET)
//
// Reads spec/fixtures/*.json — the same files the Apple, Android and Linux
// suites read — and asserts this platform reproduces every vector.
//
// Targets net9.0 rather than net9.0-windows so it runs on any CI runner; the
// WinUI 3 control library is separate and Windows-only.

using System.Globalization;
using System.Text.Json;
using DuVay.Core;
using Xunit;

namespace DuVay.Core.Tests;

public class ConformanceTests
{
    /// <summary>`{"$date": "YYYY-MM-DDTHH:mm:ss"}` denotes a civil wall-clock date.</summary>
    private static DateTime? AsDate(JsonElement e) =>
        e.ValueKind == JsonValueKind.Object && e.TryGetProperty("$date", out var d)
            ? DateTime.ParseExact(d.GetString()!, "yyyy-MM-dd'T'HH:mm:ss", CultureInfo.InvariantCulture)
            : null;

    private static string? AsString(JsonElement e) =>
        e.ValueKind == JsonValueKind.String ? e.GetString() : null;

    private static int? AsInt(JsonElement e) =>
        e.ValueKind == JsonValueKind.Number ? e.GetInt32() : null;

    /// <summary>Encode a native result back into the fixture's representation.</summary>
    private static string Encode(object? value) => value switch
    {
        null => "null",
        bool b => b ? "true" : "false",
        string s => JsonSerializer.Serialize(s),
        int i => i.ToString(CultureInfo.InvariantCulture),
        double d => JsonSerializer.Serialize(d),
        DateTime dt => JsonSerializer.Serialize(new Dictionary<string, string>
        {
            ["$date"] = dt.ToString("yyyy-MM-dd'T'HH:mm:ss", CultureInfo.InvariantCulture),
        }),
        List<DateTime> list => "[" + string.Join(",", list.Select(x => Encode(x))) + "]",
        List<string> list => "[" + string.Join(",", list.Select(x => Encode(x))) + "]",
        List<double> list => "[" + string.Join(",", list.Select(x => Encode(x))) + "]",
        _ => throw new InvalidOperationException($"cannot encode {value.GetType()}"),
    };

    /// <summary>Normalise a fixture's expected value into the same textual form.</summary>
    private static string Expected(JsonElement e) => e.ValueKind switch
    {
        JsonValueKind.Null => "null",
        JsonValueKind.True => "true",
        JsonValueKind.False => "false",
        JsonValueKind.String => JsonSerializer.Serialize(e.GetString()),
        JsonValueKind.Number => JsonSerializer.Serialize(e.GetDouble()),
        JsonValueKind.Array => "[" + string.Join(",", e.EnumerateArray().Select(Expected)) + "]",
        JsonValueKind.Object when e.TryGetProperty("$date", out var d) =>
            JsonSerializer.Serialize(new Dictionary<string, string> { ["$date"] = d.GetString()! }),
        _ => e.GetRawText(),
    };

    private static object? Invoke(string fn, JsonElement[] a) => fn switch
    {
        // calendar.json
        "wCalendarDate" => DuVayCalendar.Date(AsString(a[0])),
        "wCalendarIso" => DuVayCalendar.Iso(AsDate(a[0])!.Value),
        "wCalendarDay" => DuVayCalendar.Day(AsDate(a[0])!.Value),
        "wCalendarAddDays" => DuVayCalendar.AddDays(AsDate(a[0])!.Value, AsInt(a[1])!.Value),
        "wCalendarAddMonths" => DuVayCalendar.AddMonths(AsDate(a[0])!.Value, AsInt(a[1])!.Value),
        "wCalendarStartOfWeek" => DuVayCalendar.StartOfWeek(AsDate(a[0])!.Value, a.Length > 1 ? AsInt(a[1]) ?? 0 : 0),
        "wCalendarEndOfWeek" => DuVayCalendar.EndOfWeek(AsDate(a[0])!.Value, a.Length > 1 ? AsInt(a[1]) ?? 0 : 0),
        "wCalendarDays" => DuVayCalendar.Days(AsDate(a[0])!.Value, AsDate(a[1])!.Value,
                                              a.Length > 2 ? AsInt(a[2])!.Value : int.MaxValue),
        "wCalendarMinutes" => DuVayCalendar.Minutes(AsDate(a[0])!.Value),
        "wCalendarHasTime" => DuVayCalendar.HasTime(AsString(a[0])),
        "wCalendarWeekNumber" => DuVayCalendar.WeekNumber(AsDate(a[0])!.Value),
        "wAllowedBy" => DuVayCalendar.AllowedBy(
            a[0].ValueKind == JsonValueKind.Array
                ? a[0].EnumerateArray().Select(x => x.GetString()!).ToList()
                : null,
            AsString(a[1]) ?? ""),
        "wCalendarColor" => DuVayCalendar.Color(AsString(a[0])),

        // values.json
        "wValueList" => DuVayValues.ValueList(AsString(a[0])),
        "wNumberList" => DuVayValues.NumberList(AsString(a[0])),
        "wInitials" => DuVayValues.Initials(AsString(a[0])),
        "wParseIsoDate" => DuVayValues.ParseIsoDate(AsString(a[0])),
        "wIsSameDate" => DuVayValues.IsSameDate(AsDate(a[0]), AsDate(a[1])),
        "wDateInRange" => DuVayValues.DateInRange(AsDate(a[0]), AsDate(a[1]), AsDate(a[2])),
        "wSafeUrl" => DuVayValues.SafeUrl(AsString(a[0])),

        // mask.json
        "applyMask" => DuVayMask.Apply(AsString(a[0])!, AsString(a[1])!),
        "unmask" => DuVayMask.Unmask(AsString(a[0])!, AsString(a[1])!),

        // A fixture with no implementation is a parity gap, not something to skip.
        _ => throw new Xunit.Sdk.XunitException($"no Windows implementation for fixture function {fn}"),
    };

    private static void Run(string suite)
    {
        // Read from spec/ directly rather than a copy: a fixture change must not
        // be able to pass here while the shared contract has moved on.
        var path = Path.Combine(AppContext.BaseDirectory, "../../../../../spec/fixtures", $"{suite}.json");
        Assert.True(File.Exists(path), $"missing {path} — run `bun run fixtures:build`");

        using var doc = JsonDocument.Parse(File.ReadAllText(path));
        var cases = doc.RootElement.GetProperty("cases").EnumerateArray().ToList();
        Assert.NotEmpty(cases);

        foreach (var c in cases)
        {
            var fn = c.GetProperty("fn").GetString()!;
            var args = c.GetProperty("args").EnumerateArray().ToArray();
            var actual = Encode(Invoke(fn, args));
            var expected = Expected(c.GetProperty("expected"));
            Assert.True(actual == expected, $"{fn}: expected {expected}, actual {actual}");
        }
    }

    [Fact] public void CalendarVectors() => Run("calendar");
    [Fact] public void ValueVectors() => Run("values");
    [Fact] public void MaskVectors() => Run("mask");
}
