// DuVay — theme environment
//
// Mirrors the web framework's `w-theme` attribute: one environment value that
// every component reads its palette from, with `auto` following the system
// appearance exactly as `prefers-color-scheme` does on the web.
//
// The system accent is honoured by default. The plan is explicit that on each
// OS the accent is a system value, not ours: iOS and macOS supply a highlight
// colour the user chose, and a component that hard-codes DuVay's teal looks
// foreign. `.duvayAccent(.brand)` opts back into the brand accent when an app
// wants its own identity to win.

import SwiftUI
import DuVayTokens

// MARK: - Accent source

public enum DuVayAccentSource: Sendable, Equatable {
    /// Follow the accent the user picked in System Settings. The default.
    case system
    /// Use DuVay's own accent, identical on every platform.
    case brand
    /// An explicit colour, for apps with their own brand.
    case custom(Color)
}

// MARK: - Theme

public struct DuVayThemeContext: Sendable {
    public var theme: DuVayTokens.Theme
    public var accentSource: DuVayAccentSource

    public init(theme: DuVayTokens.Theme = .auto, accentSource: DuVayAccentSource = .system) {
        self.theme = theme
        self.accentSource = accentSource
    }

    /// The palette for this theme, resolving `auto` against the supplied scheme.
    public func palette(for colorScheme: ColorScheme) -> DuVayTokens.Palette {
        let resolved: DuVayTokens.Theme = theme == .auto
            ? (colorScheme == .dark ? .dark : .light)
            : theme
        return DuVayTokens.palette(for: resolved)
    }

    /// The accent fill. Distinct from `accentText` — the split is deliberate.
    public func accentBg(for colorScheme: ColorScheme) -> Color {
        switch accentSource {
        case .system: return .accentColor
        case .brand: return palette(for: colorScheme).accentBg
        case .custom(let color): return color
        }
    }

    /// Accent-coloured *text* drawn on a surface.
    ///
    /// libadwaita's split: the fill accent and the text accent have different
    /// contrast duties, and conflating them is the most common accessibility
    /// failure in themed systems. See `--w-accent` / `--w-accent-bg`.
    public func accentText(for colorScheme: ColorScheme) -> Color {
        switch accentSource {
        case .system: return .accentColor
        case .brand: return palette(for: colorScheme).accent
        case .custom(let color): return color
        }
    }
}

private struct DuVayThemeKey: EnvironmentKey {
    static let defaultValue = DuVayThemeContext()
}

public extension EnvironmentValues {
    var duvayTheme: DuVayThemeContext {
        get { self[DuVayThemeKey.self] }
        set { self[DuVayThemeKey.self] = newValue }
    }
}

public extension View {
    /// Set the DuVay theme for this subtree.
    func duvayTheme(_ theme: DuVayTokens.Theme) -> some View {
        transformEnvironment(\.duvayTheme) { $0.theme = theme }
    }

    /// Choose where the accent colour comes from.
    func duvayAccent(_ source: DuVayAccentSource) -> some View {
        transformEnvironment(\.duvayTheme) { $0.accentSource = source }
    }
}

// MARK: - Palette access

/// Reads the resolved palette, so a component never touches `DuVayTokens`
/// directly and never has to know how `auto` resolves.
@propertyWrapper
public struct DuVayPalette: DynamicProperty {
    @Environment(\.duvayTheme) private var context
    @Environment(\.colorScheme) private var colorScheme

    public init() {}

    public var wrappedValue: DuVayTokens.Palette { context.palette(for: colorScheme) }

    /// The surrounding theme, for components that need the accent split.
    public var projectedValue: (context: DuVayThemeContext, scheme: ColorScheme) {
        (context, colorScheme)
    }
}
