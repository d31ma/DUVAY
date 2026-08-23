// DuVay — token sanity checks (Apple)
//
// The generated token file is machine-written, so these assert the properties
// a generator bug would break: the accent split exists and is distinct from
// the palette's plain border, and every theme resolves.

import Testing
import SwiftUI
@testable import DuVay
import DuVayTokens

@Suite("Generated tokens")
struct TokenTests {

    @Test("every theme resolves to a palette", arguments: DuVayTokens.Theme.allCases)
    func palettes(_ theme: DuVayTokens.Theme) {
        _ = DuVayTokens.palette(for: theme)
    }

    @Test("the decimal spacing step is distinct from the fifteenth step")
    func spacingCollision() {
        // --w-space-1_5 is 6pt; --w-space-15 is 60pt. A naive name conversion
        // collapsed both to `space15` once — this pins them apart.
        #expect(DuVayTokens.space1_5 == 6)
        #expect(DuVayTokens.space15 == 60)
    }

    @Test("outline meets the control-boundary contract")
    func outlineExists() {
        // --w-outline is the WCAG 1.4.11 control boundary and must be a
        // separate token from the decorative --w-border on every platform.
        let light = DuVayTokens.palette(for: .light)
        #expect(light.outline != light.border)
    }

    @Test("touch target clears the HIG floor")
    func touchTarget() {
        #expect(DuVayTokens.touchMin >= 44)
    }
}
