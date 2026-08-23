//! DuVay — Layer 2 conformance suite (Linux).
//!
//! Reads `spec/fixtures/*.json` — the same files the Apple, Android and Windows
//! suites read — and asserts this platform reproduces every vector.
//!
//! Needs no GTK: the crate's default feature set is tokens plus behaviour, so
//! this runs on any machine, which is what makes the shared contract cheap to
//! enforce in CI.

use duvay::{calendar, mask, values};
use duvay::calendar::DateTime;
use serde_json::Value;

/// `{"$date": "YYYY-MM-DDTHH:mm:ss"}` denotes a civil (wall-clock) date.
fn as_date(v: &Value) -> Option<DateTime> {
    let text = v.get("$date")?.as_str()?;
    calendar::date(text)
}

fn as_str(v: &Value) -> Option<&str> {
    v.as_str()
}

fn as_int(v: &Value) -> Option<i64> {
    v.as_i64()
}

/// Encode a date back into the fixture's representation.
fn date_value(dt: &DateTime) -> Value {
    serde_json::json!({ "$date": dt.iso_full() })
}

fn invoke(fnname: &str, args: &[Value]) -> Value {
    match fnname {
        // calendar.json
        "wCalendarDate" => match as_str(&args[0]).and_then(calendar::date) {
            Some(dt) => date_value(&dt),
            None => Value::Null,
        },
        "wCalendarIso" => Value::String(as_date(&args[0]).unwrap().iso()),
        "wCalendarDay" => date_value(&calendar::day(&as_date(&args[0]).unwrap())),
        "wCalendarAddDays" => {
            date_value(&calendar::add_days(&as_date(&args[0]).unwrap(), as_int(&args[1]).unwrap()))
        }
        "wCalendarAddMonths" => {
            date_value(&calendar::add_months(&as_date(&args[0]).unwrap(), as_int(&args[1]).unwrap()))
        }
        "wCalendarStartOfWeek" => date_value(&calendar::start_of_week(
            &as_date(&args[0]).unwrap(),
            args.get(1).and_then(as_int).unwrap_or(0),
        )),
        "wCalendarEndOfWeek" => date_value(&calendar::end_of_week(
            &as_date(&args[0]).unwrap(),
            args.get(1).and_then(as_int).unwrap_or(0),
        )),
        "wCalendarDays" => Value::Array(
            calendar::days(
                &as_date(&args[0]).unwrap(),
                &as_date(&args[1]).unwrap(),
                args.get(2).and_then(as_int).unwrap_or(i64::MAX) as usize,
            )
            .iter()
            .map(date_value)
            .collect(),
        ),
        "wCalendarMinutes" => Value::from(calendar::minutes(&as_date(&args[0]).unwrap())),
        "wCalendarHasTime" => Value::Bool(calendar::has_time(as_str(&args[0]))),
        "wCalendarWeekNumber" => Value::from(calendar::week_number(&as_date(&args[0]).unwrap(), 1, 4)),
        "wAllowedBy" => {
            let rule: Option<Vec<String>> = args[0]
                .as_array()
                .map(|items| items.iter().filter_map(|i| i.as_str().map(str::to_string)).collect());
            Value::Bool(calendar::allowed_by(rule.as_deref(), as_str(&args[1]).unwrap_or("")))
        }
        "wCalendarColor" => Value::String(calendar::color(as_str(&args[0]), "primary")),

        // values.json
        "wValueList" => Value::Array(
            values::value_list(as_str(&args[0])).into_iter().map(Value::String).collect(),
        ),
        "wNumberList" => Value::Array(
            values::number_list(as_str(&args[0]), Vec::new())
                .into_iter()
                .map(|n| Value::from(n))
                .collect(),
        ),
        "wInitials" => Value::String(values::initials(as_str(&args[0]))),
        "wParseIsoDate" => match values::parse_iso_date(as_str(&args[0])) {
            Some(dt) => date_value(&dt),
            None => Value::Null,
        },
        "wIsSameDate" => Value::Bool(values::is_same_date(
            as_date(&args[0]).as_ref(),
            as_date(&args[1]).as_ref(),
        )),
        "wDateInRange" => Value::Bool(values::date_in_range(
            as_date(&args[0]).as_ref(),
            as_date(&args[1]).as_ref(),
            as_date(&args[2]).as_ref(),
        )),
        "wSafeUrl" => Value::String(values::safe_url(as_str(&args[0]))),

        // mask.json
        "applyMask" => Value::String(mask::apply(as_str(&args[0]).unwrap(), as_str(&args[1]).unwrap())),
        "unmask" => Value::String(mask::unmask(as_str(&args[0]).unwrap(), as_str(&args[1]).unwrap())),

        // A fixture with no implementation is a parity gap, not something to skip.
        other => panic!("no Linux implementation for fixture function {other}"),
    }
}

/// Numbers arrive from JSON as f64; compare numerically so 34 == 34.0.
fn equivalent(actual: &Value, expected: &Value) -> bool {
    match (actual, expected) {
        (Value::Number(a), Value::Number(b)) => a.as_f64() == b.as_f64(),
        (Value::Array(a), Value::Array(b)) => {
            a.len() == b.len() && a.iter().zip(b).all(|(x, y)| equivalent(x, y))
        }
        _ => actual == expected,
    }
}

fn run(suite: &str) {
    // Read from spec/ directly rather than a copy: a fixture change must not be
    // able to pass here while the shared contract has moved on.
    let path = format!("../spec/fixtures/{suite}.json");
    let text = std::fs::read_to_string(&path)
        .unwrap_or_else(|e| panic!("missing {path} ({e}) — run `bun run fixtures:build`"));
    let doc: Value = serde_json::from_str(&text).expect("fixture is not valid JSON");
    let cases = doc["cases"].as_array().expect("fixture has no cases");
    assert!(!cases.is_empty(), "{suite}.json has no cases");

    for case in cases {
        let name = case["fn"].as_str().unwrap();
        let args = case["args"].as_array().unwrap();
        let expected = &case["expected"];
        let actual = invoke(name, args);
        assert!(
            equivalent(&actual, expected),
            "{name}({args:?})\n  expected: {expected}\n  actual:   {actual}"
        );
    }
    println!("✓ {suite}: {} vectors", cases.len());
}

#[test]
fn calendar_vectors() {
    run("calendar");
}

#[test]
fn value_vectors() {
    run("values");
}

#[test]
fn mask_vectors() {
    run("mask");
}
