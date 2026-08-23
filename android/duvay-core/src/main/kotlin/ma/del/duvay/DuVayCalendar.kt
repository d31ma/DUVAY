// DuVay — calendar arithmetic (Android/JVM)
//
// A native reimplementation of src/components/calendar-utils.js, validated
// against spec/fixtures/calendar.json. Not a port: the plan's shared-behaviour
// mechanism is the fixture suite, and each platform writes idiomatic code that
// satisfies it.
//
// Everything is java.time.LocalDateTime — wall-clock with no zone. The web
// implementation works in local Date components, and LocalDateTime is the
// exact JVM analogue, which makes these functions timezone-independent by
// construction rather than by convention.

package ma.del.duvay

import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit

object DuVayCalendar {

    private val ISO = Regex("""^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$""")

    /**
     * Parse `YYYY-MM-DD[ HH:mm[:ss]]`.
     *
     * Overflowed calendar dates are rejected rather than rolled over:
     * `2024-02-31` is null, not 2 March.
     */
    fun date(value: String?, fallback: LocalDateTime? = null): LocalDateTime? {
        val m = value?.trim()?.let { ISO.matchEntire(it) } ?: return fallback
        val (y, mo, d, h, mi, s) = m.destructured
        val year = y.toInt()
        val month = mo.toInt()
        val day = d.toInt()

        // LocalDate.of throws on an impossible date, which is the rejection the
        // fixtures expect — no separate overflow check is needed.
        val date = runCatching { LocalDate.of(year, month, day) }.getOrNull() ?: return fallback
        return date.atTime(
            h.ifEmpty { "0" }.toInt(),
            mi.ifEmpty { "0" }.toInt(),
            s.ifEmpty { "0" }.toInt(),
        )
    }

    /** `YYYY-MM-DD`. */
    fun iso(date: LocalDateTime): String = date.toLocalDate().toString()

    /**
     * The date's calendar day, anchored at noon.
     *
     * Noon rather than midnight so day-granular comparisons survive a
     * daylight-saving transition when these values are later zoned.
     */
    fun day(date: LocalDateTime): LocalDateTime = date.toLocalDate().atTime(12, 0, 0)

    fun addDays(date: LocalDateTime, amount: Int): LocalDateTime = day(date).plusDays(amount.toLong())

    /**
     * Add months, clamping the day to the target month's length.
     * 31 January + 1 month is 28 February (29 in a leap year), never 3 March.
     * `LocalDate.plusMonths` already clamps, which is the behaviour required.
     */
    fun addMonths(date: LocalDateTime, amount: Int): LocalDateTime =
        date.toLocalDate().plusMonths(amount.toLong()).atTime(12, 0, 0)

    /** Start of the week containing [date]. [firstDay] is 0=Sunday … 6=Saturday. */
    fun startOfWeek(date: LocalDateTime, firstDay: Int = 0): LocalDateTime {
        val start = day(date)
        // DayOfWeek is 1=Monday..7=Sunday; the web uses 0=Sunday..6=Saturday.
        val weekday = start.dayOfWeek.value % 7
        val offset = ((weekday - firstDay) % 7 + 7) % 7
        return start.minusDays(offset.toLong())
    }

    fun endOfWeek(date: LocalDateTime, firstDay: Int = 0): LocalDateTime =
        startOfWeek(date, firstDay).plusDays(6)

    /** Every day from [start] to [end] inclusive, capped at [max] entries. */
    fun days(start: LocalDateTime, end: LocalDateTime, max: Int = Int.MAX_VALUE): List<LocalDateTime> {
        val result = mutableListOf<LocalDateTime>()
        var cursor = day(start)
        val finish = day(end)
        while (!cursor.isAfter(finish) && result.size < max) {
            result += cursor
            cursor = cursor.plusDays(1)
        }
        return result
    }

    /** Minutes since midnight. */
    fun minutes(date: LocalDateTime): Int = date.hour * 60 + date.minute

    /** Whether a raw value carries a time as well as a date. */
    fun hasTime(value: String?): Boolean =
        value != null && Regex("""[ T]\d{1,2}:\d{2}""").containsMatchIn(value)

    /**
     * Week number, counting from the week containing [firstDayOfYear] January.
     *
     * Mirrors the web implementation exactly, including its year-boundary
     * behaviour — parity means matching DuVay, not matching ISO-8601.
     */
    fun weekNumber(date: LocalDateTime, firstDay: Int = 1, firstDayOfYear: Int = 4): Int {
        val target = day(date)
        val anchor = LocalDate.of(target.year, 1, firstDayOfYear).atTime(12, 0)
        val weekStart = startOfWeek(anchor, firstDay)

        if (target.isBefore(weekStart)) {
            return weekNumber(LocalDate.of(target.year - 1, 12, 31).atTime(12, 0), firstDay, firstDayOfYear)
        }
        val elapsed = ChronoUnit.DAYS.between(weekStart, target)
        return (elapsed / 7).toInt() + 1
    }

    /** Whether [value] satisfies an allow-list. A null rule permits everything. */
    fun allowedBy(rule: List<String>?, value: String): Boolean =
        rule?.any { it == value } ?: true

    /** Normalise an event colour into a CSS-ready token reference. */
    fun color(value: String?, fallback: String = "primary"): String {
        val raw = (value?.takeIf { it.isNotEmpty() } ?: fallback).trim()
        if (raw.isEmpty()) return "var(--w-$fallback)"
        val literal = raw.startsWith("#") || raw.startsWith("rgb") || raw.startsWith("hsl") ||
            raw.startsWith("oklch") || raw.startsWith("var(") ||
            raw == "transparent" || raw == "currentColor"
        return if (literal) raw else "var(--w-$raw)"
    }

    /** Destructuring for the six ISO capture groups. */
    private operator fun <T> List<T>.component6(): T = this[5]
}
