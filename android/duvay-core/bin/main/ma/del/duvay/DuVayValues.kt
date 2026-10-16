// DuVay — attribute value parsing and input masks (Android/JVM)
//
// Native reimplementation of src/components/utils.js and the mask grammar in
// src/components/mask-input.js, validated against spec/fixtures/values.json
// and spec/fixtures/mask.json.

package ma.del.duvay

import java.net.URI
import java.time.LocalDate
import java.time.LocalDateTime

object DuVayValues {

    /** Parse a comma-separated list or a JSON array into trimmed, non-empty entries. */
    fun valueList(value: String?): List<String> {
        val text = value?.trim().orEmpty()
        if (text.isEmpty()) return emptyList()

        if (text.startsWith("[")) {
            // Hand-authored attribute values are often not valid JSON, so a
            // bracketed list is salvaged by splitting rather than rejected.
            if (!text.endsWith("]")) return emptyList()
            return text.substring(1, text.length - 1)
                .split(",")
                .map { it.trim().trim('"', '\'') }
                .filter { it.isNotEmpty() }
        }

        return text.split(",").map { it.trim() }.filter { it.isNotEmpty() }
    }

    /** The finite numbers in a value list, or [fallback] when there are none. */
    fun numberList(value: String?, fallback: List<Double> = emptyList()): List<Double> {
        val numbers = valueList(value).mapNotNull { it.toDoubleOrNull() }.filter { it.isFinite() }
        return numbers.ifEmpty { fallback }
    }

    /** Up to two uppercase initials from a name. */
    fun initials(value: String?): String =
        value.orEmpty()
            .split(Regex("""\s+"""))
            .mapNotNull { it.firstOrNull() }
            .take(2)
            .joinToString("")
            .uppercase()

    /** `YYYY-MM-DD` for a date. */
    fun isoDate(date: LocalDateTime): String = DuVayCalendar.iso(date)

    /** Parse `YYYY-MM-DD` into midnight, rejecting overflowed dates. */
    fun parseIsoDate(value: String?): LocalDateTime? {
        val m = value?.let { Regex("""^(\d{4})-(\d{2})-(\d{2})$""").matchEntire(it) } ?: return null
        val (y, mo, d) = m.destructured
        return runCatching { LocalDate.of(y.toInt(), mo.toInt(), d.toInt()).atStartOfDay() }.getOrNull()
    }

    /** Whether two dates fall on the same calendar day. */
    fun isSameDate(a: LocalDateTime?, b: LocalDateTime?): Boolean =
        a != null && b != null && a.toLocalDate() == b.toLocalDate()

    /** Whether a date sits within an inclusive range. Null bounds are ignored. */
    fun dateInRange(date: LocalDateTime?, min: LocalDateTime?, max: LocalDateTime?): Boolean {
        if (date == null) return false
        if (min != null && date.isBefore(min)) return false
        if (max != null && date.isAfter(max)) return false
        return true
    }

    /**
     * A URL safe to navigate to.
     *
     * Trust boundary: only http/https survive, plus relative references. This
     * keeps `javascript:` and `data:` payloads out of link sinks, so the
     * fixture suite pins it identically on every platform.
     */
    fun safeUrl(value: String?): String {
        val raw = value?.trim().orEmpty()
        if (raw.isEmpty()) return ""
        // Control characters are used to smuggle a scheme past naive parsers.
        if (raw.any { it.code <= 0x1f || it.code == 0x7f }) return ""

        val resolved = runCatching { URI("https://duvay.invalid/").resolve(raw) }.getOrNull() ?: return ""
        val scheme = resolved.scheme?.lowercase() ?: return ""
        return if (scheme == "http" || scheme == "https") raw else ""
    }
}

object DuVayMask {

    private fun isToken(c: Char) = c == '#' || c == 'A' || c == 'N' || c == 'X'

    private fun matches(token: Char, c: Char): Boolean = when (token) {
        '#' -> c.isDigit()
        'A' -> c.isLetter()
        'N' -> c.isLetterOrDigit()
        'X' -> true
        else -> false
    }

    /**
     * Apply [mask] to [value].
     *
     * Input characters that cannot satisfy the current token are skipped, so
     * `AAA-###` over `123abc` yields `abc`. Output stops when input runs out.
     */
    fun apply(mask: String, value: String): String {
        val input = value.toCharArray()
        var index = 0
        val output = StringBuilder()

        var cursor = 0
        while (cursor < mask.length) {
            var token = mask[cursor]
            var escaped = false
            if (token == '\\' && cursor + 1 < mask.length) {
                cursor++
                token = mask[cursor]
                escaped = true
            }

            if (escaped) {
                if (index < input.size) output.append(token)
                cursor++
                continue
            }

            if (!isToken(token)) {
                // Literal: emit while input remains, and consume a matching
                // input character so a pre-formatted value round-trips.
                if (index < input.size) output.append(token)
                if (index < input.size && input[index] == token) index++
                cursor++
                continue
            }

            while (index < input.size && !matches(token, input[index])) index++
            if (index >= input.size) break
            output.append(input[index])
            index++
            cursor++
        }

        return output.toString()
    }

    /** Strip a mask's literal characters back out of a formatted value. */
    fun unmask(mask: String, value: String): String {
        val literals = mutableSetOf<Char>()
        var cursor = 0
        while (cursor < mask.length) {
            val c = mask[cursor]
            if (c == '\\' && cursor + 1 < mask.length) {
                cursor++
                literals += mask[cursor]
            } else if (!isToken(c)) {
                literals += c
            }
            cursor++
        }
        return value.filterNot { it in literals }
    }
}
