//! Attribute value parsing.
//!
//! Native reimplementation of the shared helpers in `src/components/utils.js`,
//! validated against `spec/fixtures/values.json`.

use crate::calendar::{self, DateTime};

/// Parse a comma-separated list or a JSON array into trimmed, non-empty entries.
pub fn value_list(value: Option<&str>) -> Vec<String> {
    let text = value.unwrap_or("").trim();
    if text.is_empty() {
        return Vec::new();
    }

    if text.starts_with('[') {
        // Hand-authored attribute values are often not valid JSON, so a
        // bracketed list is salvaged by splitting rather than rejected.
        if !text.ends_with(']') {
            return Vec::new();
        }
        return text[1..text.len() - 1]
            .split(',')
            .map(|item| item.trim().trim_matches(['"', '\'']).to_string())
            .filter(|item| !item.is_empty())
            .collect();
    }

    text.split(',')
        .map(|item| item.trim().to_string())
        .filter(|item| !item.is_empty())
        .collect()
}

/// The finite numbers in a value list, or `fallback` when there are none.
pub fn number_list(value: Option<&str>, fallback: Vec<f64>) -> Vec<f64> {
    let numbers: Vec<f64> = value_list(value)
        .iter()
        .filter_map(|item| item.parse::<f64>().ok())
        .filter(|n| n.is_finite())
        .collect();
    if numbers.is_empty() { fallback } else { numbers }
}

/// Up to two uppercase initials from a name.
pub fn initials(value: Option<&str>) -> String {
    value
        .unwrap_or("")
        .split_whitespace()
        .filter_map(|part| part.chars().next())
        .take(2)
        .collect::<String>()
        .to_uppercase()
}

/// Parse `YYYY-MM-DD` into midnight, rejecting overflowed dates.
pub fn parse_iso_date(value: Option<&str>) -> Option<DateTime> {
    let text = value?;
    if text.len() != 10 {
        return None;
    }
    let dt = calendar::date(text)?;
    Some(DateTime { hour: 0, minute: 0, second: 0, ..dt })
}

/// Whether two dates fall on the same calendar day.
pub fn is_same_date(a: Option<&DateTime>, b: Option<&DateTime>) -> bool {
    match (a, b) {
        (Some(a), Some(b)) => a.year == b.year && a.month == b.month && a.day == b.day,
        _ => false,
    }
}

/// Whether a date sits within an inclusive range. `None` bounds are ignored.
pub fn date_in_range(date: Option<&DateTime>, min: Option<&DateTime>, max: Option<&DateTime>) -> bool {
    let Some(date) = date else { return false };
    if let Some(min) = min {
        if date < min {
            return false;
        }
    }
    if let Some(max) = max {
        if date > max {
            return false;
        }
    }
    true
}

/// A URL safe to navigate to.
///
/// Trust boundary: only http/https survive, plus relative references. This is
/// what keeps `javascript:` and `data:` payloads out of link sinks, so the
/// fixture suite pins it identically on every platform.
pub fn safe_url(value: Option<&str>) -> String {
    let raw = value.unwrap_or("").trim();
    if raw.is_empty() {
        return String::new();
    }
    // Control characters are used to smuggle a scheme past naive parsers.
    if raw.chars().any(|c| (c as u32) <= 0x1f || (c as u32) == 0x7f) {
        return String::new();
    }

    // A scheme is `ALPHA *( ALPHA / DIGIT / "+" / "-" / "." ) ":"` appearing
    // before any `/`, `?` or `#`. Anything without one is a relative reference
    // and therefore inherits the page's own (http/https) origin.
    let scheme_end = raw.find(':');
    let path_start = raw.find(['/', '?', '#']);
    let has_scheme = match (scheme_end, path_start) {
        (Some(colon), Some(path)) => colon < path,
        (Some(_), None) => true,
        _ => false,
    };
    if !has_scheme {
        return raw.to_string();
    }

    let scheme = raw[..scheme_end.unwrap()].to_ascii_lowercase();
    let valid = !scheme.is_empty()
        && scheme.starts_with(|c: char| c.is_ascii_alphabetic())
        && scheme.chars().all(|c| c.is_ascii_alphanumeric() || matches!(c, '+' | '-' | '.'));
    if valid && (scheme == "http" || scheme == "https") {
        raw.to_string()
    } else {
        String::new()
    }
}
