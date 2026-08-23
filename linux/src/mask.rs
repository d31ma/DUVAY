//! Input-mask grammar.
//!
//! Native reimplementation of `src/components/mask-input.js`, validated against
//! `spec/fixtures/mask.json`.
//!
//! Tokens: `#` digit, `A` letter, `N` alphanumeric, `X` any character.
//! A backslash escapes the next mask character, emitting it literally.

fn is_token(c: char) -> bool {
    matches!(c, '#' | 'A' | 'N' | 'X')
}

fn matches(token: char, c: char) -> bool {
    match token {
        '#' => c.is_ascii_digit(),
        'A' => c.is_alphabetic(),
        'N' => c.is_alphanumeric(),
        'X' => true,
        _ => false,
    }
}

/// Apply `mask` to `value`.
///
/// Input characters that cannot satisfy the current token are skipped, so
/// `AAA-###` over `123abc` yields `abc` — the digits are discarded looking for
/// letters. Output stops as soon as the input runs out.
pub fn apply(mask: &str, value: &str) -> String {
    let input: Vec<char> = value.chars().collect();
    let pattern: Vec<char> = mask.chars().collect();
    let mut index = 0usize;
    let mut output = String::new();

    let mut cursor = 0usize;
    while cursor < pattern.len() {
        let mut token = pattern[cursor];
        let mut escaped = false;
        if token == '\\' && cursor + 1 < pattern.len() {
            cursor += 1;
            token = pattern[cursor];
            escaped = true;
        }

        if escaped {
            if index < input.len() {
                output.push(token);
            }
            cursor += 1;
            continue;
        }

        if !is_token(token) {
            // Literal: emit it while input remains, and consume a matching
            // input character so a pre-formatted value round-trips.
            if index < input.len() {
                output.push(token);
            }
            if index < input.len() && input[index] == token {
                index += 1;
            }
            cursor += 1;
            continue;
        }

        while index < input.len() && !matches(token, input[index]) {
            index += 1;
        }
        if index >= input.len() {
            break;
        }
        output.push(input[index]);
        index += 1;
        cursor += 1;
    }

    output
}

/// Strip a mask's literal characters back out of a formatted value.
pub fn unmask(mask: &str, value: &str) -> String {
    let pattern: Vec<char> = mask.chars().collect();
    let mut literals = Vec::new();

    let mut cursor = 0usize;
    while cursor < pattern.len() {
        let c = pattern[cursor];
        if c == '\\' && cursor + 1 < pattern.len() {
            cursor += 1;
            literals.push(pattern[cursor]);
        } else if !is_token(c) {
            literals.push(c);
        }
        cursor += 1;
    }

    value.chars().filter(|c| !literals.contains(c)).collect()
}
