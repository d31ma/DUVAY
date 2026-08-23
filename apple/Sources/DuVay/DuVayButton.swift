// DuVay — Button (Tier 1)
//
// Contract: spec/components/w-btn.json
//
// Native rendering, not a reskinned web button: this is a SwiftUI Button with
// the platform's own press behaviour, hit testing and accessibility. The plan's
// invariant is design parity, not pixel parity — chasing the latter destroys
// the native feel the native track exists to buy.

import SwiftUI
import DuVayTokens

public enum DuVayButtonVariant: String, Sendable, CaseIterable {
    case filled, tonal, outlined, text, elevated, danger
}

public enum DuVayControlSize: String, Sendable, CaseIterable {
    case xs, sm, md, lg, xl

    var height: CGFloat {
        switch self {
        case .xs: return DuVayTokens.sizeXs
        case .sm: return DuVayTokens.sizeSm
        case .md: return DuVayTokens.sizeMd
        case .lg: return DuVayTokens.sizeLg
        case .xl: return DuVayTokens.sizeXl
        }
    }

    var glyph: CGFloat {
        switch self {
        case .xs: return DuVayTokens.iconGlyphXs
        case .sm: return DuVayTokens.iconGlyphSm
        case .md: return DuVayTokens.iconGlyphMd
        case .lg: return DuVayTokens.iconGlyphLg
        case .xl: return DuVayTokens.iconGlyphXl
        }
    }
}

public struct DuVayButton<Label: View>: View {
    @DuVayPalette private var palette
    @Environment(\.isEnabled) private var isEnabled

    private let variant: DuVayButtonVariant
    private let size: DuVayControlSize
    private let isLoading: Bool
    private let block: Bool
    private let action: () -> Void
    private let label: Label

    public init(
        variant: DuVayButtonVariant = .filled,
        size: DuVayControlSize = .md,
        loading: Bool = false,
        block: Bool = false,
        action: @escaping () -> Void,
        @ViewBuilder label: () -> Label
    ) {
        self.variant = variant
        self.size = size
        self.isLoading = loading
        self.block = block
        self.action = action
        self.label = label()
    }

    public var body: some View {
        Button(action: action) {
            HStack(spacing: DuVayTokens.space2) {
                if isLoading {
                    ProgressView()
                        .controlSize(.small)
                        .tint(foreground)
                }
                label
            }
            .font(.system(size: DuVayTokens.fontBase, weight: .medium))
            .frame(maxWidth: block ? .infinity : nil)
            .frame(height: size.height)
            .padding(.horizontal, DuVayTokens.space4)
            .foregroundStyle(foreground)
            .background(background)
            .clipShape(RoundedRectangle(cornerRadius: DuVayTokens.radius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: DuVayTokens.radius, style: .continuous)
                    .strokeBorder(border, lineWidth: variant == .outlined ? 1 : 0)
            )
            .shadow(
                color: variant == .elevated ? palette.shadowColor : .clear,
                radius: variant == .elevated ? 8 : 0,
                y: variant == .elevated ? 2 : 0
            )
        }
        .buttonStyle(.plain)
        // A loading button stays in the accessibility tree but stops
        // responding, matching the web component's `loading` semantics.
        .disabled(isLoading || !isEnabled)
        .opacity(isEnabled ? 1 : DuVayTokens.textDisabledOpacity)
        .accessibilityAddTraits(.isButton)
        .accessibilityValue(isLoading ? Text("Loading") : Text(""))
        // The 44pt floor is a HIG requirement, not a style choice; a small
        // button keeps its visual size but grows its hit target.
        .contentShape(Rectangle())
        .frame(minHeight: DuVayTokens.touchMin)
    }

    private var foreground: Color {
        switch variant {
        case .filled: return palette.onAccent
        case .danger: return palette.onError
        case .tonal: return palette.onPrimaryContainer
        case .outlined, .text: return palette.accent
        case .elevated: return palette.text
        }
    }

    private var background: Color {
        switch variant {
        case .filled: return palette.accentBg
        case .danger: return palette.error
        case .tonal: return palette.primaryContainer
        case .outlined, .text: return .clear
        case .elevated: return palette.surfaceContainerHigh
        }
    }

    private var border: Color {
        variant == .outlined ? palette.outline : .clear
    }
}

public extension DuVayButton where Label == Text {
    /// Convenience for the common text-only button.
    init(
        _ title: String,
        variant: DuVayButtonVariant = .filled,
        size: DuVayControlSize = .md,
        loading: Bool = false,
        block: Bool = false,
        action: @escaping () -> Void
    ) {
        self.init(variant: variant, size: size, loading: loading, block: block, action: action) {
            Text(title)
        }
    }
}
