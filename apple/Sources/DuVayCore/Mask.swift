// DuVay — input-mask grammar
//
// Native reimplementation of src/components/mask-input.js, validated against
// spec/fixtures/mask.json.
//
// Tokens:  # digit   A letter   N alphanumeric   X any character
// A backslash escapes the next mask character, emitting it literally.

import Foundation

public enum DuVayMask {

    private static func isToken(_ char: Character) -> Bool {
        char == "#" || char == "A" || char == "N" || char == "X"
    }

    private static func matches(_ token: Character, _ char: Character) -> Bool? {
        switch token {
        case "#": return char.isNumber
        case "A": return char.isLetter
        case "N": return char.isLetter || char.isNumber
        case "X": return true
        default: return nil // not a token — a literal
        }
    }

    /// Apply `mask` to `value`, emitting literals as they are reached.
    ///
    /// Input characters that cannot satisfy the current token are skipped, so
    /// `AAA-###` over `123abc` yields `abc` — the digits are discarded looking
    /// for letters. Output stops as soon as the input runs out.
    public static func apply(mask: String, to value: String) -> String {
        let input = Array(value)
        var index = 0
        var output = ""

        var cursor = mask.startIndex
        while cursor < mask.endIndex {
            var token = mask[cursor]
            var escaped = false
            if token == "\\", mask.index(after: cursor) < mask.endIndex {
                cursor = mask.index(after: cursor)
                token = mask[cursor]
                escaped = true
            }

            if escaped {
                if index < input.count { output.append(token) }
                cursor = mask.index(after: cursor)
                continue
            }

            guard isToken(token) else {
                // Literal: emit it while input remains, and consume a matching
                // input character so a pre-formatted value round-trips.
                if index < input.count { output.append(token) }
                if index < input.count, input[index] == token { index += 1 }
                cursor = mask.index(after: cursor)
                continue
            }

            while index < input.count, matches(token, input[index]) == false { index += 1 }
            if index >= input.count { break }
            output.append(input[index])
            index += 1
            cursor = mask.index(after: cursor)
        }

        return output
    }

    /// Strip a mask's literal characters back out of a formatted value.
    public static func unmask(mask: String, from value: String) -> String {
        var literals = Set<Character>()
        let tokens: Set<Character> = ["#", "A", "N", "X"]

        var cursor = mask.startIndex
        while cursor < mask.endIndex {
            let char = mask[cursor]
            if char == "\\", mask.index(after: cursor) < mask.endIndex {
                cursor = mask.index(after: cursor)
                literals.insert(mask[cursor])
            } else if !tokens.contains(char) {
                literals.insert(char)
            }
            cursor = mask.index(after: cursor)
        }

        return String(value.filter { !literals.contains($0) })
    }
}
