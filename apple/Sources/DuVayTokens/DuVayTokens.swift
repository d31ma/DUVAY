// DuVay design tokens — GENERATED, do not edit.
// Source of truth: tokens/**/*.json. Regenerate with `bun run tokens:native`.

import SwiftUI

public enum DuVayTokens {

    // MARK: - Dimensions (points)
    public static let fontXs: CGFloat = 12
    public static let fontSm: CGFloat = 12
    public static let fontBase: CGFloat = 14
    public static let fontMd: CGFloat = 15
    public static let fontLg: CGFloat = 17
    public static let fontXl: CGFloat = 20
    public static let font2xl: CGFloat = 24
    public static let font3xl: CGFloat = 36
    public static let space1: CGFloat = 4
    public static let space1_5: CGFloat = 6
    public static let space2: CGFloat = 8
    public static let space3: CGFloat = 12
    public static let space4: CGFloat = 16
    public static let space5: CGFloat = 20
    public static let space6: CGFloat = 24
    public static let space7: CGFloat = 28
    public static let space8: CGFloat = 32
    public static let space9: CGFloat = 36
    public static let space10: CGFloat = 40
    public static let space11: CGFloat = 44
    public static let space12: CGFloat = 48
    public static let space13: CGFloat = 52
    public static let space14: CGFloat = 56
    public static let space15: CGFloat = 60
    public static let space16: CGFloat = 64
    public static let space20: CGFloat = 80
    public static let spaceXs: CGFloat = 4
    public static let spaceSm: CGFloat = 8
    public static let spaceMd: CGFloat = 12
    public static let spaceLg: CGFloat = 16
    public static let spaceXl: CGFloat = 20
    public static let space2xl: CGFloat = 24
    public static let space3xl: CGFloat = 32
    public static let touchMin: CGFloat = 44
    public static let sizeXs: CGFloat = 28
    public static let sizeSm: CGFloat = 32
    public static let sizeMd: CGFloat = 40
    public static let sizeLg: CGFloat = 48
    public static let sizeXl: CGFloat = 56
    public static let sizeIconXs: CGFloat = 28
    public static let sizeIconSm: CGFloat = 32
    public static let sizeIconMd: CGFloat = 40
    public static let sizeIconLg: CGFloat = 48
    public static let sizeIconXl: CGFloat = 56
    public static let commandMaxWidth: CGFloat = 512
    public static let commandListMaxHeight: CGFloat = 320
    public static let commandInputMinHeight: CGFloat = 36
    public static let commandItemMinHeight: CGFloat = 40
    public static let commandContentGap: CGFloat = 1
    public static let pieSize: CGFloat = 192
    public static let videoSeekWidth: CGFloat = 64
    public static let videoVolumeWidth: CGFloat = 80
    public static let iconGlyphXs: CGFloat = 14
    public static let iconGlyphSm: CGFloat = 16
    public static let iconGlyphMd: CGFloat = 20
    public static let iconGlyphLg: CGFloat = 24
    public static let iconGlyphXl: CGFloat = 28
    public static let radiusSm: CGFloat = 2
    public static let radius: CGFloat = 4
    public static let radiusMd: CGFloat = 6
    public static let radiusLg: CGFloat = 8
    public static let radiusXl: CGFloat = 12
    public static let radiusPill: CGFloat = 999
    public static let focusRingWidth: CGFloat = 2
    public static let focusRingOffset: CGFloat = 2
    public static let topbarHeight: CGFloat = 56
    public static let sidebarWidth: CGFloat = 232
    public static let drawerWidth: CGFloat = 256
    public static let drawerRailWidth: CGFloat = 72
    public static let mobileNavHeight: CGFloat = 64
    public static let gridGutter: CGFloat = 24
    public static let containerMax: CGFloat = 1200
    public static let motionDistanceX: CGFloat = 24
    public static let motionDistanceY: CGFloat = 12
    public static let appBarBackdropBlur: CGFloat = 16

    // MARK: - Durations (seconds)
    public static let motionDurationFast: TimeInterval = 0.12
    public static let motionDuration: TimeInterval = 0.18
    public static let motionDurationSlow: TimeInterval = 0.26

    // MARK: - Scalars
    public static let highlightOpacity: Double = 0.35
    public static let heatmapHoverScale: Double = 1.08
    public static let pieHoverScale: Double = 1.02
    public static let textHighEmphasisOpacity: Double = 0.87
    public static let textMediumEmphasisOpacity: Double = 0.6
    public static let textDisabledOpacity: Double = 0.38
    public static let zSticky: Double = 10
    public static let zOverlay: Double = 50
    public static let zModal: Double = 55
    public static let zDropdown: Double = 60
    public static let zToast: Double = 9000

    // MARK: - Themes

    public enum Theme: String, CaseIterable, Sendable {
        case light = "light"
        case dark = "dark"
        case auto = "auto"
        case highContrast = "high-contrast"
    }

    public struct Palette: Sendable {
        public let accent: Color
        public let accentBg: Color
        public let appBarFrosted: Color
        public let border: Color
        public let divider: Color
        public let error: Color
        public let errorContainer: Color
        public let highlightColor: Color
        public let hover: Color
        public let inverseOnSurface: Color
        public let inversePrimary: Color
        public let inverseSurface: Color
        public let onAccent: Color
        public let onError: Color
        public let onErrorContainer: Color
        public let onPrimary: Color
        public let onPrimaryContainer: Color
        public let onSecondaryContainer: Color
        public let onSuccess: Color
        public let onSuccessContainer: Color
        public let onTertiaryContainer: Color
        public let onWarning: Color
        public let onWarningContainer: Color
        public let outline: Color
        public let primary: Color
        public let primaryContainer: Color
        public let primaryMuted: Color
        public let scrim: Color
        public let secondary: Color
        public let secondaryContainer: Color
        public let selected: Color
        public let selectedText: Color
        public let shadowColor: Color
        public let sidebar: Color
        public let success: Color
        public let successContainer: Color
        public let surface: Color
        public let surfaceContainer: Color
        public let surfaceContainerHigh: Color
        public let surfaceContainerLow: Color
        public let surfaceRaised: Color
        public let tertiaryContainer: Color
        public let text: Color
        public let textMuted: Color
        public let textSubtle: Color
        public let textVerySubtle: Color
        public let toolbar: Color
        public let videoPoster: Color
        public let warning: Color
        public let warningContainer: Color
    }

    public static let lightPalette = Palette(
        accent: Color(.sRGB, red: 0.1216, green: 0.4353, blue: 0.5451, opacity: 1),
        accentBg: Color(.sRGB, red: 0.1216, green: 0.4353, blue: 0.5451, opacity: 1),
        appBarFrosted: Color(.sRGB, red: 0.9725, green: 0.9804, blue: 0.9765, opacity: 0.84),
        border: Color(.sRGB, red: 0.8157, green: 0.8588, blue: 0.8471, opacity: 1),
        divider: Color(.sRGB, red: 0.8471, green: 0.8784, blue: 0.8706, opacity: 1),
        error: Color(.sRGB, red: 0.702, green: 0.149, blue: 0.1176, opacity: 1),
        errorContainer: Color(.sRGB, red: 0.9765, green: 0.8706, blue: 0.8627, opacity: 1),
        highlightColor: Color(.sRGB, red: 0.7686, green: 0.4706, blue: 0, opacity: 1),
        hover: Color(.sRGB, red: 0.9176, green: 0.9451, blue: 0.9373, opacity: 1),
        inverseOnSurface: Color(.sRGB, red: 0.9569, green: 0.9373, blue: 0.9569, opacity: 1),
        inversePrimary: Color(.sRGB, red: 0.5137, green: 0.8039, blue: 0.8902, opacity: 1),
        inverseSurface: Color(.sRGB, red: 0.1922, green: 0.1882, blue: 0.2, opacity: 1),
        onAccent: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 1),
        onError: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 1),
        onErrorContainer: Color(.sRGB, red: 0.2549, green: 0.0549, blue: 0.0431, opacity: 1),
        onPrimary: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 1),
        onPrimaryContainer: Color(.sRGB, red: 0.0275, green: 0.2078, blue: 0.2667, opacity: 1),
        onSecondaryContainer: Color(.sRGB, red: 0.1529, green: 0.2157, blue: 0.2, opacity: 1),
        onSuccess: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 1),
        onSuccessContainer: Color(.sRGB, red: 0.1059, green: 0.3686, blue: 0.1255, opacity: 1),
        onTertiaryContainer: Color(.sRGB, red: 0.2863, green: 0.1922, blue: 0.0863, opacity: 1),
        onWarning: Color(.sRGB, red: 0.1647, green: 0.0941, blue: 0, opacity: 1),
        onWarningContainer: Color(.sRGB, red: 0.2863, green: 0.1922, blue: 0.0863, opacity: 1),
        outline: Color(.sRGB, red: 0.4941, green: 0.549, blue: 0.5333, opacity: 1),
        primary: Color(.sRGB, red: 0.1216, green: 0.4353, blue: 0.5451, opacity: 1),
        primaryContainer: Color(.sRGB, red: 0.8431, green: 0.9294, blue: 0.9569, opacity: 1),
        primaryMuted: Color(.sRGB, red: 0.8431, green: 0.9294, blue: 0.9569, opacity: 1),
        scrim: Color(.sRGB, red: 0, green: 0, blue: 0, opacity: 0.4),
        secondary: Color(.sRGB, red: 0.3098, green: 0.3882, blue: 0.3686, opacity: 1),
        secondaryContainer: Color(.sRGB, red: 0.902, green: 0.9255, blue: 0.9137, opacity: 1),
        selected: Color(.sRGB, red: 0.8627, green: 0.9373, blue: 0.9529, opacity: 1),
        selectedText: Color(.sRGB, red: 0.0627, green: 0.1843, blue: 0.2275, opacity: 1),
        shadowColor: Color(.sRGB, red: 0.0941, green: 0.1294, blue: 0.1451, opacity: 0.12),
        sidebar: Color(.sRGB, red: 0.9333, green: 0.9529, blue: 0.9451, opacity: 1),
        success: Color(.sRGB, red: 0.1804, green: 0.4902, blue: 0.1961, opacity: 1),
        successContainer: Color(.sRGB, red: 0.9098, green: 0.9608, blue: 0.9137, opacity: 1),
        surface: Color(.sRGB, red: 0.9725, green: 0.9804, blue: 0.9765, opacity: 1),
        surfaceContainer: Color(.sRGB, red: 0.9294, green: 0.9529, blue: 0.9451, opacity: 1),
        surfaceContainerHigh: Color(.sRGB, red: 0.898, green: 0.9255, blue: 0.9137, opacity: 1),
        surfaceContainerLow: Color(.sRGB, red: 0.9529, green: 0.9686, blue: 0.9608, opacity: 1),
        surfaceRaised: Color(.sRGB, red: 0.898, green: 0.9255, blue: 0.9137, opacity: 1),
        tertiaryContainer: Color(.sRGB, red: 0.9569, green: 0.8941, blue: 0.7804, opacity: 1),
        text: Color(.sRGB, red: 0.0941, green: 0.1294, blue: 0.1451, opacity: 1),
        textMuted: Color(.sRGB, red: 0.3216, green: 0.3765, blue: 0.4, opacity: 1),
        textSubtle: Color(.sRGB, red: 0.3216, green: 0.3765, blue: 0.4, opacity: 1),
        textVerySubtle: Color(.sRGB, red: 0.4824, green: 0.5294, blue: 0.549, opacity: 1),
        toolbar: Color(.sRGB, red: 0.9451, green: 0.9608, blue: 0.9569, opacity: 1),
        videoPoster: Color(.sRGB, red: 0, green: 0, blue: 0, opacity: 1),
        warning: Color(.sRGB, red: 0.7686, green: 0.4706, blue: 0, opacity: 1),
        warningContainer: Color(.sRGB, red: 0.9569, green: 0.8941, blue: 0.7804, opacity: 1)
    )

    public static let darkPalette = Palette(
        accent: Color(.sRGB, red: 0.5137, green: 0.8039, blue: 0.8902, opacity: 1),
        accentBg: Color(.sRGB, red: 0.5137, green: 0.8039, blue: 0.8902, opacity: 1),
        appBarFrosted: Color(.sRGB, red: 0.1098, green: 0.1333, blue: 0.1412, opacity: 0.84),
        border: Color(.sRGB, red: 0.2275, green: 0.2745, blue: 0.2902, opacity: 1),
        divider: Color(.sRGB, red: 0.1922, green: 0.2314, blue: 0.2431, opacity: 1),
        error: Color(.sRGB, red: 0.949, green: 0.7216, blue: 0.7098, opacity: 1),
        errorContainer: Color(.sRGB, red: 0.549, green: 0.1137, blue: 0.0941, opacity: 1),
        highlightColor: Color(.sRGB, red: 1, green: 0.7216, blue: 0.4196, opacity: 1),
        hover: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 0.05),
        inverseOnSurface: Color(.sRGB, red: 0.1922, green: 0.1882, blue: 0.2, opacity: 1),
        inversePrimary: Color(.sRGB, red: 0.1216, green: 0.4353, blue: 0.5451, opacity: 1),
        inverseSurface: Color(.sRGB, red: 0.9569, green: 0.9373, blue: 0.9569, opacity: 1),
        onAccent: Color(.sRGB, red: 0.0314, green: 0.1961, blue: 0.2471, opacity: 1),
        onError: Color(.sRGB, red: 0.2549, green: 0.0549, blue: 0.0431, opacity: 1),
        onErrorContainer: Color(.sRGB, red: 0.9765, green: 0.8706, blue: 0.8627, opacity: 1),
        onPrimary: Color(.sRGB, red: 0.0314, green: 0.1961, blue: 0.2471, opacity: 1),
        onPrimaryContainer: Color(.sRGB, red: 0.9098, green: 0.9725, blue: 0.9882, opacity: 1),
        onSecondaryContainer: Color(.sRGB, red: 0.8627, green: 0.9059, blue: 0.8941, opacity: 1),
        onSuccess: Color(.sRGB, red: 0.0431, green: 0.1804, blue: 0.0549, opacity: 1),
        onSuccessContainer: Color(.sRGB, red: 0.9098, green: 0.9608, blue: 0.9137, opacity: 1),
        onTertiaryContainer: Color(.sRGB, red: 1, green: 0.8863, blue: 0.7216, opacity: 1),
        onWarning: Color(.sRGB, red: 0.2392, green: 0.1333, blue: 0, opacity: 1),
        onWarningContainer: Color(.sRGB, red: 1, green: 0.8863, blue: 0.7216, opacity: 1),
        outline: Color(.sRGB, red: 0.4235, green: 0.4824, blue: 0.498, opacity: 1),
        primary: Color(.sRGB, red: 0.5137, green: 0.8039, blue: 0.8902, opacity: 1),
        primaryContainer: Color(.sRGB, red: 0.5137, green: 0.8039, blue: 0.8902, opacity: 0.18),
        primaryMuted: Color(.sRGB, red: 0.5137, green: 0.8039, blue: 0.8902, opacity: 0.18),
        scrim: Color(.sRGB, red: 0, green: 0, blue: 0, opacity: 0.6),
        secondary: Color(.sRGB, red: 0.6784, green: 0.7882, blue: 0.7608, opacity: 1),
        secondaryContainer: Color(.sRGB, red: 0.1843, green: 0.2314, blue: 0.2275, opacity: 1),
        selected: Color(.sRGB, red: 0.5137, green: 0.8039, blue: 0.8902, opacity: 0.18),
        selectedText: Color(.sRGB, red: 0.6235, green: 0.8471, blue: 0.902, opacity: 1),
        shadowColor: Color(.sRGB, red: 0, green: 0, blue: 0, opacity: 0.4),
        sidebar: Color(.sRGB, red: 0.0863, green: 0.1098, blue: 0.1176, opacity: 1),
        success: Color(.sRGB, red: 0.5059, green: 0.7804, blue: 0.5176, opacity: 1),
        successContainer: Color(.sRGB, red: 0.1059, green: 0.3686, blue: 0.1255, opacity: 1),
        surface: Color(.sRGB, red: 0.1098, green: 0.1333, blue: 0.1412, opacity: 1),
        surfaceContainer: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 0.05),
        surfaceContainerHigh: Color(.sRGB, red: 0.1333, green: 0.1647, blue: 0.1765, opacity: 1),
        surfaceContainerLow: Color(.sRGB, red: 0.0863, green: 0.1098, blue: 0.1176, opacity: 1),
        surfaceRaised: Color(.sRGB, red: 0.1333, green: 0.1647, blue: 0.1765, opacity: 1),
        tertiaryContainer: Color(.sRGB, red: 0.3529, green: 0.2745, blue: 0.1882, opacity: 1),
        text: Color(.sRGB, red: 0.9333, green: 0.9333, blue: 0.9333, opacity: 1),
        textMuted: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 0.6),
        textSubtle: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 0.6),
        textVerySubtle: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 0.55),
        toolbar: Color(.sRGB, red: 0.1333, green: 0.1647, blue: 0.1765, opacity: 1),
        videoPoster: Color(.sRGB, red: 0, green: 0, blue: 0, opacity: 1),
        warning: Color(.sRGB, red: 1, green: 0.7216, blue: 0.4196, opacity: 1),
        warningContainer: Color(.sRGB, red: 0.3529, green: 0.2745, blue: 0.1882, opacity: 1)
    )

    public static let autoPalette = Palette(
        accent: Color(.sRGB, red: 0.5137, green: 0.8039, blue: 0.8902, opacity: 1),
        accentBg: Color(.sRGB, red: 0.5137, green: 0.8039, blue: 0.8902, opacity: 1),
        appBarFrosted: Color(.sRGB, red: 0.1098, green: 0.1333, blue: 0.1412, opacity: 0.84),
        border: Color(.sRGB, red: 0.2275, green: 0.2745, blue: 0.2902, opacity: 1),
        divider: Color(.sRGB, red: 0.1922, green: 0.2314, blue: 0.2431, opacity: 1),
        error: Color(.sRGB, red: 0.949, green: 0.7216, blue: 0.7098, opacity: 1),
        errorContainer: Color(.sRGB, red: 0.549, green: 0.1137, blue: 0.0941, opacity: 1),
        highlightColor: Color(.sRGB, red: 1, green: 0.7216, blue: 0.4196, opacity: 1),
        hover: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 0.05),
        inverseOnSurface: Color(.sRGB, red: 0.1922, green: 0.1882, blue: 0.2, opacity: 1),
        inversePrimary: Color(.sRGB, red: 0.1216, green: 0.4353, blue: 0.5451, opacity: 1),
        inverseSurface: Color(.sRGB, red: 0.9569, green: 0.9373, blue: 0.9569, opacity: 1),
        onAccent: Color(.sRGB, red: 0.0314, green: 0.1961, blue: 0.2471, opacity: 1),
        onError: Color(.sRGB, red: 0.2549, green: 0.0549, blue: 0.0431, opacity: 1),
        onErrorContainer: Color(.sRGB, red: 0.9765, green: 0.8706, blue: 0.8627, opacity: 1),
        onPrimary: Color(.sRGB, red: 0.0314, green: 0.1961, blue: 0.2471, opacity: 1),
        onPrimaryContainer: Color(.sRGB, red: 0.9098, green: 0.9725, blue: 0.9882, opacity: 1),
        onSecondaryContainer: Color(.sRGB, red: 0.8627, green: 0.9059, blue: 0.8941, opacity: 1),
        onSuccess: Color(.sRGB, red: 0.0431, green: 0.1804, blue: 0.0549, opacity: 1),
        onSuccessContainer: Color(.sRGB, red: 0.9098, green: 0.9608, blue: 0.9137, opacity: 1),
        onTertiaryContainer: Color(.sRGB, red: 1, green: 0.8863, blue: 0.7216, opacity: 1),
        onWarning: Color(.sRGB, red: 0.2392, green: 0.1333, blue: 0, opacity: 1),
        onWarningContainer: Color(.sRGB, red: 1, green: 0.8863, blue: 0.7216, opacity: 1),
        outline: Color(.sRGB, red: 0.4235, green: 0.4824, blue: 0.498, opacity: 1),
        primary: Color(.sRGB, red: 0.5137, green: 0.8039, blue: 0.8902, opacity: 1),
        primaryContainer: Color(.sRGB, red: 0.5137, green: 0.8039, blue: 0.8902, opacity: 0.18),
        primaryMuted: Color(.sRGB, red: 0, green: 0, blue: 0, opacity: 0),
        scrim: Color(.sRGB, red: 0, green: 0, blue: 0, opacity: 0.6),
        secondary: Color(.sRGB, red: 0.6784, green: 0.7882, blue: 0.7608, opacity: 1),
        secondaryContainer: Color(.sRGB, red: 0.1843, green: 0.2314, blue: 0.2275, opacity: 1),
        selected: Color(.sRGB, red: 0.5137, green: 0.8039, blue: 0.8902, opacity: 0.18),
        selectedText: Color(.sRGB, red: 0.6235, green: 0.8471, blue: 0.902, opacity: 1),
        shadowColor: Color(.sRGB, red: 0, green: 0, blue: 0, opacity: 0.4),
        sidebar: Color(.sRGB, red: 0.0863, green: 0.1098, blue: 0.1176, opacity: 1),
        success: Color(.sRGB, red: 0.5059, green: 0.7804, blue: 0.5176, opacity: 1),
        successContainer: Color(.sRGB, red: 0.1059, green: 0.3686, blue: 0.1255, opacity: 1),
        surface: Color(.sRGB, red: 0.1098, green: 0.1333, blue: 0.1412, opacity: 1),
        surfaceContainer: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 0.05),
        surfaceContainerHigh: Color(.sRGB, red: 0.1333, green: 0.1647, blue: 0.1765, opacity: 1),
        surfaceContainerLow: Color(.sRGB, red: 0.0863, green: 0.1098, blue: 0.1176, opacity: 1),
        surfaceRaised: Color(.sRGB, red: 0, green: 0, blue: 0, opacity: 0),
        tertiaryContainer: Color(.sRGB, red: 0.3529, green: 0.2745, blue: 0.1882, opacity: 1),
        text: Color(.sRGB, red: 0.9333, green: 0.9333, blue: 0.9333, opacity: 1),
        textMuted: Color(.sRGB, red: 0, green: 0, blue: 0, opacity: 0),
        textSubtle: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 0.6),
        textVerySubtle: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 0.55),
        toolbar: Color(.sRGB, red: 0.1333, green: 0.1647, blue: 0.1765, opacity: 1),
        videoPoster: Color(.sRGB, red: 0, green: 0, blue: 0, opacity: 1),
        warning: Color(.sRGB, red: 1, green: 0.7216, blue: 0.4196, opacity: 1),
        warningContainer: Color(.sRGB, red: 0.3529, green: 0.2745, blue: 0.1882, opacity: 1)
    )

    public static let highContrastPalette = Palette(
        accent: Color(.sRGB, red: 0, green: 0.2275, blue: 0.3098, opacity: 1),
        accentBg: Color(.sRGB, red: 0, green: 0.2275, blue: 0.3098, opacity: 1),
        appBarFrosted: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 0.96),
        border: Color(.sRGB, red: 0.2902, green: 0.3333, blue: 0.349, opacity: 1),
        divider: Color(.sRGB, red: 0.4314, green: 0.4784, blue: 0.502, opacity: 1),
        error: Color(.sRGB, red: 0.451, green: 0, blue: 0.0353, opacity: 1),
        errorContainer: Color(.sRGB, red: 1, green: 0.8353, blue: 0.8235, opacity: 1),
        highlightColor: Color(.sRGB, red: 0.4314, green: 0.2471, blue: 0, opacity: 1),
        hover: Color(.sRGB, red: 0.8314, green: 0.8902, blue: 0.9098, opacity: 1),
        inverseOnSurface: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 1),
        inversePrimary: Color(.sRGB, red: 0.5137, green: 0.8039, blue: 0.8902, opacity: 1),
        inverseSurface: Color(.sRGB, red: 0, green: 0, blue: 0, opacity: 1),
        onAccent: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 1),
        onError: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 1),
        onErrorContainer: Color(.sRGB, red: 0.1725, green: 0, blue: 0.0039, opacity: 1),
        onPrimary: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 1),
        onPrimaryContainer: Color(.sRGB, red: 0, green: 0.0941, blue: 0.1255, opacity: 1),
        onSecondaryContainer: Color(.sRGB, red: 0.0471, green: 0.0941, blue: 0.0824, opacity: 1),
        onSuccess: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 1),
        onSuccessContainer: Color(.sRGB, red: 0.0196, green: 0.1569, blue: 0.0275, opacity: 1),
        onTertiaryContainer: Color(.sRGB, red: 0.1647, green: 0.0941, blue: 0, opacity: 1),
        onWarning: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 1),
        onWarningContainer: Color(.sRGB, red: 0.1647, green: 0.0941, blue: 0, opacity: 1),
        outline: Color(.sRGB, red: 0.2902, green: 0.3333, blue: 0.349, opacity: 1),
        primary: Color(.sRGB, red: 0, green: 0.2275, blue: 0.3098, opacity: 1),
        primaryContainer: Color(.sRGB, red: 0.7137, green: 0.8863, blue: 0.9333, opacity: 1),
        primaryMuted: Color(.sRGB, red: 0.7137, green: 0.8863, blue: 0.9333, opacity: 1),
        scrim: Color(.sRGB, red: 0, green: 0, blue: 0, opacity: 0.6),
        secondary: Color(.sRGB, red: 0.1412, green: 0.302, blue: 0.2667, opacity: 1),
        secondaryContainer: Color(.sRGB, red: 0.8392, green: 0.8824, blue: 0.8706, opacity: 1),
        selected: Color(.sRGB, red: 0.7137, green: 0.8863, blue: 0.9333, opacity: 1),
        selectedText: Color(.sRGB, red: 0, green: 0.0941, blue: 0.1255, opacity: 1),
        shadowColor: Color(.sRGB, red: 0, green: 0, blue: 0, opacity: 0.28),
        sidebar: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 1),
        success: Color(.sRGB, red: 0.0784, green: 0.3137, blue: 0.0902, opacity: 1),
        successContainer: Color(.sRGB, red: 0.7765, green: 0.9255, blue: 0.7843, opacity: 1),
        surface: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 1),
        surfaceContainer: Color(.sRGB, red: 0.9333, green: 0.949, blue: 0.9451, opacity: 1),
        surfaceContainerHigh: Color(.sRGB, red: 0.898, green: 0.9216, blue: 0.9137, opacity: 1),
        surfaceContainerLow: Color(.sRGB, red: 0.9647, green: 0.9725, blue: 0.9686, opacity: 1),
        surfaceRaised: Color(.sRGB, red: 0.898, green: 0.9216, blue: 0.9137, opacity: 1),
        tertiaryContainer: Color(.sRGB, red: 1, green: 0.851, blue: 0.6588, opacity: 1),
        text: Color(.sRGB, red: 0, green: 0, blue: 0, opacity: 1),
        textMuted: Color(.sRGB, red: 0.1216, green: 0.1647, blue: 0.1882, opacity: 1),
        textSubtle: Color(.sRGB, red: 0.1216, green: 0.1647, blue: 0.1882, opacity: 1),
        textVerySubtle: Color(.sRGB, red: 0.2431, green: 0.2902, blue: 0.3137, opacity: 1),
        toolbar: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 1),
        videoPoster: Color(.sRGB, red: 0, green: 0, blue: 0, opacity: 1),
        warning: Color(.sRGB, red: 0.4314, green: 0.2471, blue: 0, opacity: 1),
        warningContainer: Color(.sRGB, red: 1, green: 0.851, blue: 0.6588, opacity: 1)
    )

    public static func palette(for theme: Theme) -> Palette {
        switch theme {
        case .light: return lightPalette
        case .dark: return darkPalette
        case .auto: return autoPalette
        case .highContrast: return highContrastPalette
        }
    }
}
