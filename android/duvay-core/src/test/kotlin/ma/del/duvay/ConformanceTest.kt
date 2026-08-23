// DuVay — Layer 2 conformance suite (Android/JVM)
//
// Reads spec/fixtures/*.json — the same files the Apple, Windows and Linux
// suites read — and asserts this platform reproduces every vector. A
// disagreement between platforms surfaces here rather than in an application.
//
// Runs on the JVM with no Android SDK and no emulator, which is the whole
// reason duvay-core is a plain Kotlin module.

package ma.del.duvay

import java.io.File
import java.time.LocalDateTime
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.fail

/* ── A minimal JSON reader ────────────────────────────────────────────────
 * The fixtures are a closed, machine-generated format: objects, arrays,
 * strings, numbers, booleans and null. Pulling in a serialization library and
 * its plugin for that is more moving parts than the ~60 lines below, and the
 * repo's whole premise is a thin dependency graph.
 */
private class Json(private val src: String) {
    private var i = 0

    fun parse(): Any? = value().also { ws() }

    private fun ws() { while (i < src.length && src[i].isWhitespace()) i++ }

    private fun value(): Any? {
        ws()
        return when (src[i]) {
            '{' -> obj()
            '[' -> arr()
            '"' -> str()
            't' -> { i += 4; true }
            'f' -> { i += 5; false }
            'n' -> { i += 4; null }
            else -> num()
        }
    }

    private fun obj(): Map<String, Any?> {
        val map = LinkedHashMap<String, Any?>()
        i++ // {
        ws()
        if (src[i] == '}') { i++; return map }
        while (true) {
            ws()
            val key = str()
            ws()
            i++ // :
            map[key] = value()
            ws()
            if (src[i] == ',') { i++; continue }
            i++ // }
            return map
        }
    }

    private fun arr(): List<Any?> {
        val list = mutableListOf<Any?>()
        i++ // [
        ws()
        if (src[i] == ']') { i++; return list }
        while (true) {
            list += value()
            ws()
            if (src[i] == ',') { i++; continue }
            i++ // ]
            return list
        }
    }

    private fun str(): String {
        val sb = StringBuilder()
        i++ // opening quote
        while (src[i] != '"') {
            if (src[i] == '\\') {
                i++
                when (val e = src[i]) {
                    'n' -> sb.append('\n'); 't' -> sb.append('\t'); 'r' -> sb.append('\r')
                    'b' -> sb.append('\b'); 'f' -> sb.append('')
                    'u' -> { sb.append(src.substring(i + 1, i + 5).toInt(16).toChar()); i += 4 }
                    else -> sb.append(e)
                }
            } else {
                sb.append(src[i])
            }
            i++
        }
        i++ // closing quote
        return sb.toString()
    }

    private fun num(): Double {
        val start = i
        while (i < src.length && (src[i].isDigit() || src[i] in "-+.eE")) i++
        return src.substring(start, i).toDouble()
    }
}

/* ── Fixture values ──────────────────────────────────────────────────── */

/** `{"$date": "YYYY-MM-DDTHH:mm:ss"}` denotes a local wall-clock date. */
private fun decode(raw: Any?): Any? = when {
    raw is Map<*, *> && raw.containsKey("\$date") -> LocalDateTime.parse(raw["\$date"] as String)
    raw is List<*> -> raw.map { decode(it) }
    else -> raw
}

/** Convert a native result back into the fixture's representation. */
private fun encode(value: Any?): Any? = when (value) {
    null -> null
    is LocalDateTime -> mapOf("\$date" to value.toString().let { if (it.length == 16) "$it:00" else it })
    is List<*> -> value.map { encode(it) }
    is Int -> value.toDouble()
    else -> value
}

private data class Case(val fn: String, val args: List<Any?>, val expected: Any?)

private fun load(name: String): List<Case> {
    // Read from spec/ directly rather than a copy: a fixture change must not be
    // able to pass here while the shared contract has moved on.
    val file = File("../../spec/fixtures/$name.json")
    if (!file.exists()) fail("missing ${file.path} — run `bun run fixtures:build`")
    @Suppress("UNCHECKED_CAST")
    val doc = Json(file.readText()).parse() as Map<String, Any?>
    @Suppress("UNCHECKED_CAST")
    val cases = doc["cases"] as List<Map<String, Any?>>
    return cases.map {
        Case(
            fn = it["fn"] as String,
            args = (it["args"] as List<Any?>).map { a -> decode(a) },
            expected = it["expected"],
        )
    }
}

/* ── Dispatch ────────────────────────────────────────────────────────── */

private fun date(a: Any?) = a as? LocalDateTime
private fun str(a: Any?) = a as? String
private fun int(a: Any?) = (a as? Double)?.toInt()

private fun invoke(c: Case): Any? {
    val a = c.args
    return when (c.fn) {
        // calendar.json
        "wCalendarDate" -> DuVayCalendar.date(str(a[0]))
        "wCalendarIso" -> DuVayCalendar.iso(date(a[0])!!)
        "wCalendarDay" -> DuVayCalendar.day(date(a[0])!!)
        "wCalendarAddDays" -> DuVayCalendar.addDays(date(a[0])!!, int(a[1])!!)
        "wCalendarAddMonths" -> DuVayCalendar.addMonths(date(a[0])!!, int(a[1])!!)
        "wCalendarStartOfWeek" -> DuVayCalendar.startOfWeek(date(a[0])!!, int(a.getOrNull(1)) ?: 0)
        "wCalendarEndOfWeek" -> DuVayCalendar.endOfWeek(date(a[0])!!, int(a.getOrNull(1)) ?: 0)
        "wCalendarDays" -> DuVayCalendar.days(date(a[0])!!, date(a[1])!!, int(a.getOrNull(2)) ?: Int.MAX_VALUE)
        "wCalendarMinutes" -> DuVayCalendar.minutes(date(a[0])!!)
        "wCalendarHasTime" -> DuVayCalendar.hasTime(str(a[0]))
        "wCalendarWeekNumber" -> DuVayCalendar.weekNumber(date(a[0])!!)
        "wAllowedBy" -> DuVayCalendar.allowedBy(
            (a[0] as? List<*>)?.map { it as String },
            str(a[1]) ?: "",
        )
        "wCalendarColor" -> DuVayCalendar.color(str(a[0]))

        // values.json
        "wValueList" -> DuVayValues.valueList(str(a[0]))
        "wNumberList" -> DuVayValues.numberList(str(a[0]))
        "wInitials" -> DuVayValues.initials(str(a[0]))
        "wParseIsoDate" -> DuVayValues.parseIsoDate(str(a[0]))
        "wIsSameDate" -> DuVayValues.isSameDate(date(a[0]), date(a[1]))
        "wDateInRange" -> DuVayValues.dateInRange(date(a[0]), date(a[1]), date(a[2]))
        "wSafeUrl" -> DuVayValues.safeUrl(str(a[0]))

        // mask.json
        "applyMask" -> DuVayMask.apply(str(a[0])!!, str(a[1])!!)
        "unmask" -> DuVayMask.unmask(str(a[0])!!, str(a[1])!!)

        // A fixture with no implementation is a parity gap, not something to skip.
        else -> fail("no Android implementation for fixture function ${c.fn}")
    }
}

/* ── Tests ───────────────────────────────────────────────────────────── */

class ConformanceTest {

    private fun run(suite: String) {
        val cases = load(suite)
        check(cases.isNotEmpty()) { "$suite.json has no cases" }
        for (c in cases) {
            assertEquals(c.expected, encode(invoke(c)), "${c.fn}(${c.args.joinToString(", ")})")
        }
        println("✓ $suite: ${cases.size} vectors")
    }

    @Test fun calendar() = run("calendar")
    @Test fun values() = run("values")
    @Test fun mask() = run("mask")
}
