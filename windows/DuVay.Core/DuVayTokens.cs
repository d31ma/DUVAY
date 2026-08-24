// DuVay design tokens — GENERATED, do not edit.
// Source of truth: tokens/**/*.json. Regenerate with `bun run tokens:native`.

namespace DuVay.Core;

/// <summary>DuVay design tokens, resolved per theme.</summary>
public static class DuVayTokens
{
    // Dimensions (device-independent pixels)
    public const double FontXs = 12;
    public const double FontSm = 12;
    public const double FontBase = 14;
    public const double FontMd = 15;
    public const double FontLg = 17;
    public const double FontXl = 20;
    public const double Font2xl = 24;
    public const double Font3xl = 36;
    public const double Space1 = 4;
    public const double Space1_5 = 6;
    public const double Space2 = 8;
    public const double Space3 = 12;
    public const double Space4 = 16;
    public const double Space5 = 20;
    public const double Space6 = 24;
    public const double Space7 = 28;
    public const double Space8 = 32;
    public const double Space9 = 36;
    public const double Space10 = 40;
    public const double Space11 = 44;
    public const double Space12 = 48;
    public const double Space13 = 52;
    public const double Space14 = 56;
    public const double Space15 = 60;
    public const double Space16 = 64;
    public const double Space20 = 80;
    public const double SpaceXs = 4;
    public const double SpaceSm = 8;
    public const double SpaceMd = 12;
    public const double SpaceLg = 16;
    public const double SpaceXl = 20;
    public const double Space2xl = 24;
    public const double Space3xl = 32;
    public const double TouchMin = 44;
    public const double SizeXs = 28;
    public const double SizeSm = 32;
    public const double SizeMd = 40;
    public const double SizeLg = 48;
    public const double SizeXl = 56;
    public const double SizeIconXs = 28;
    public const double SizeIconSm = 32;
    public const double SizeIconMd = 40;
    public const double SizeIconLg = 48;
    public const double SizeIconXl = 56;
    public const double CommandMaxWidth = 512;
    public const double CommandListMaxHeight = 320;
    public const double CommandInputMinHeight = 36;
    public const double CommandItemMinHeight = 40;
    public const double CommandContentGap = 1;
    public const double PieSize = 192;
    public const double VideoSeekWidth = 64;
    public const double VideoVolumeWidth = 80;
    public const double IconGlyphXs = 14;
    public const double IconGlyphSm = 16;
    public const double IconGlyphMd = 20;
    public const double IconGlyphLg = 24;
    public const double IconGlyphXl = 28;
    public const double RadiusSm = 2;
    public const double Radius = 4;
    public const double RadiusMd = 6;
    public const double RadiusLg = 8;
    public const double RadiusXl = 12;
    public const double RadiusPill = 999;
    public const double FocusRingWidth = 2;
    public const double FocusRingOffset = 2;
    public const double TopbarHeight = 56;
    public const double SidebarWidth = 232;
    public const double DrawerWidth = 256;
    public const double DrawerRailWidth = 72;
    public const double MobileNavHeight = 64;
    public const double GridGutter = 24;
    public const double ContainerMax = 1200;
    public const double MotionDistanceX = 24;
    public const double MotionDistanceY = 12;
    public const double AppBarBackdropBlur = 16;
    public const double SkinSwitchTrackW = 40;
    public const double SkinSwitchTrackH = 14;
    public const double SkinSwitchThumb = 18;
    public const double SkinSwitchPad = 0;

    // Durations (milliseconds)
    public const int MotionDurationFastDuration = 120;
    public const int MotionDurationDuration = 180;
    public const int MotionDurationSlowDuration = 260;

    // Scalars
    public const double HighlightOpacity = 0.35;
    public const double HeatmapHoverScale = 1.08;
    public const double PieHoverScale = 1.02;
    public const double TextHighEmphasisOpacity = 0.87;
    public const double TextMediumEmphasisOpacity = 0.6;
    public const double TextDisabledOpacity = 0.38;
    public const double ZSticky = 10;
    public const double ZOverlay = 50;
    public const double ZModal = 55;
    public const double ZDropdown = 60;
    public const double ZToast = 9000;
}

public enum DuVayTheme
{
    Light,
    Dark,
    Auto,
    HighContrast
}

/// <summary>An sRGB colour with straight alpha.</summary>
public readonly record struct DuVayColor(byte R, byte G, byte B, double A)
{
    public string ToHex() => $"#{R:X2}{G:X2}{B:X2}";
}

public sealed class DuVayPalette
{
    public required DuVayColor Accent { get; init; }
    public required DuVayColor AccentBg { get; init; }
    public required DuVayColor AppBarFrosted { get; init; }
    public required DuVayColor Border { get; init; }
    public required DuVayColor Divider { get; init; }
    public required DuVayColor Error { get; init; }
    public required DuVayColor ErrorContainer { get; init; }
    public required DuVayColor HighlightColor { get; init; }
    public required DuVayColor Hover { get; init; }
    public required DuVayColor InverseOnSurface { get; init; }
    public required DuVayColor InversePrimary { get; init; }
    public required DuVayColor InverseSurface { get; init; }
    public required DuVayColor OnAccent { get; init; }
    public required DuVayColor OnError { get; init; }
    public required DuVayColor OnErrorContainer { get; init; }
    public required DuVayColor OnPrimary { get; init; }
    public required DuVayColor OnPrimaryContainer { get; init; }
    public required DuVayColor OnScrim { get; init; }
    public required DuVayColor OnSecondaryContainer { get; init; }
    public required DuVayColor OnSuccess { get; init; }
    public required DuVayColor OnSuccessContainer { get; init; }
    public required DuVayColor OnTertiaryContainer { get; init; }
    public required DuVayColor OnWarning { get; init; }
    public required DuVayColor OnWarningContainer { get; init; }
    public required DuVayColor Outline { get; init; }
    public required DuVayColor Primary { get; init; }
    public required DuVayColor PrimaryContainer { get; init; }
    public required DuVayColor PrimaryMuted { get; init; }
    public required DuVayColor Scrim { get; init; }
    public required DuVayColor Secondary { get; init; }
    public required DuVayColor SecondaryContainer { get; init; }
    public required DuVayColor Selected { get; init; }
    public required DuVayColor SelectedText { get; init; }
    public required DuVayColor ShadowColor { get; init; }
    public required DuVayColor Sidebar { get; init; }
    public required DuVayColor Success { get; init; }
    public required DuVayColor SuccessContainer { get; init; }
    public required DuVayColor Surface { get; init; }
    public required DuVayColor SurfaceContainer { get; init; }
    public required DuVayColor SurfaceContainerHigh { get; init; }
    public required DuVayColor SurfaceContainerLow { get; init; }
    public required DuVayColor SurfaceRaised { get; init; }
    public required DuVayColor TertiaryContainer { get; init; }
    public required DuVayColor Text { get; init; }
    public required DuVayColor TextMuted { get; init; }
    public required DuVayColor TextSubtle { get; init; }
    public required DuVayColor TextVerySubtle { get; init; }
    public required DuVayColor Toolbar { get; init; }
    public required DuVayColor VideoPoster { get; init; }
    public required DuVayColor Warning { get; init; }
    public required DuVayColor WarningContainer { get; init; }

    public static readonly DuVayPalette Light = new()
    {
        Accent = new(31, 111, 139, 1),
        AccentBg = new(31, 111, 139, 1),
        AppBarFrosted = new(248, 250, 249, 0.84),
        Border = new(208, 219, 216, 1),
        Divider = new(216, 224, 222, 1),
        Error = new(179, 38, 30, 1),
        ErrorContainer = new(249, 222, 220, 1),
        HighlightColor = new(196, 120, 0, 1),
        Hover = new(234, 241, 239, 1),
        InverseOnSurface = new(244, 239, 244, 1),
        InversePrimary = new(131, 205, 227, 1),
        InverseSurface = new(49, 48, 51, 1),
        OnAccent = new(255, 255, 255, 1),
        OnError = new(255, 255, 255, 1),
        OnErrorContainer = new(65, 14, 11, 1),
        OnPrimary = new(255, 255, 255, 1),
        OnPrimaryContainer = new(7, 53, 68, 1),
        OnScrim = new(255, 255, 255, 1),
        OnSecondaryContainer = new(39, 55, 51, 1),
        OnSuccess = new(255, 255, 255, 1),
        OnSuccessContainer = new(27, 94, 32, 1),
        OnTertiaryContainer = new(73, 49, 22, 1),
        OnWarning = new(42, 24, 0, 1),
        OnWarningContainer = new(73, 49, 22, 1),
        Outline = new(126, 140, 136, 1),
        Primary = new(31, 111, 139, 1),
        PrimaryContainer = new(215, 237, 244, 1),
        PrimaryMuted = new(215, 237, 244, 1),
        Scrim = new(0, 0, 0, 0.4),
        Secondary = new(79, 99, 94, 1),
        SecondaryContainer = new(230, 236, 233, 1),
        Selected = new(220, 239, 243, 1),
        SelectedText = new(16, 47, 58, 1),
        ShadowColor = new(24, 33, 37, 0.12),
        Sidebar = new(238, 243, 241, 1),
        Success = new(46, 125, 50, 1),
        SuccessContainer = new(232, 245, 233, 1),
        Surface = new(248, 250, 249, 1),
        SurfaceContainer = new(237, 243, 241, 1),
        SurfaceContainerHigh = new(229, 236, 233, 1),
        SurfaceContainerLow = new(243, 247, 245, 1),
        SurfaceRaised = new(229, 236, 233, 1),
        TertiaryContainer = new(244, 228, 199, 1),
        Text = new(24, 33, 37, 1),
        TextMuted = new(82, 96, 102, 1),
        TextSubtle = new(82, 96, 102, 1),
        TextVerySubtle = new(123, 135, 140, 1),
        Toolbar = new(241, 245, 244, 1),
        VideoPoster = new(0, 0, 0, 1),
        Warning = new(196, 120, 0, 1),
        WarningContainer = new(244, 228, 199, 1)
    };

    public static readonly DuVayPalette Dark = new()
    {
        Accent = new(131, 205, 227, 1),
        AccentBg = new(131, 205, 227, 1),
        AppBarFrosted = new(28, 34, 36, 0.84),
        Border = new(58, 70, 74, 1),
        Divider = new(49, 59, 62, 1),
        Error = new(242, 184, 181, 1),
        ErrorContainer = new(140, 29, 24, 1),
        HighlightColor = new(255, 184, 107, 1),
        Hover = new(255, 255, 255, 0.05),
        InverseOnSurface = new(49, 48, 51, 1),
        InversePrimary = new(31, 111, 139, 1),
        InverseSurface = new(244, 239, 244, 1),
        OnAccent = new(8, 50, 63, 1),
        OnError = new(65, 14, 11, 1),
        OnErrorContainer = new(249, 222, 220, 1),
        OnPrimary = new(8, 50, 63, 1),
        OnPrimaryContainer = new(232, 248, 252, 1),
        OnScrim = new(255, 255, 255, 1),
        OnSecondaryContainer = new(220, 231, 228, 1),
        OnSuccess = new(11, 46, 14, 1),
        OnSuccessContainer = new(232, 245, 233, 1),
        OnTertiaryContainer = new(255, 226, 184, 1),
        OnWarning = new(61, 34, 0, 1),
        OnWarningContainer = new(255, 226, 184, 1),
        Outline = new(108, 123, 127, 1),
        Primary = new(131, 205, 227, 1),
        PrimaryContainer = new(131, 205, 227, 0.18),
        PrimaryMuted = new(131, 205, 227, 0.18),
        Scrim = new(0, 0, 0, 0.6),
        Secondary = new(173, 201, 194, 1),
        SecondaryContainer = new(47, 59, 58, 1),
        Selected = new(131, 205, 227, 0.18),
        SelectedText = new(159, 216, 230, 1),
        ShadowColor = new(0, 0, 0, 0.4),
        Sidebar = new(22, 28, 30, 1),
        Success = new(129, 199, 132, 1),
        SuccessContainer = new(27, 94, 32, 1),
        Surface = new(28, 34, 36, 1),
        SurfaceContainer = new(255, 255, 255, 0.05),
        SurfaceContainerHigh = new(34, 42, 45, 1),
        SurfaceContainerLow = new(22, 28, 30, 1),
        SurfaceRaised = new(34, 42, 45, 1),
        TertiaryContainer = new(90, 70, 48, 1),
        Text = new(238, 238, 238, 1),
        TextMuted = new(255, 255, 255, 0.6),
        TextSubtle = new(255, 255, 255, 0.6),
        TextVerySubtle = new(255, 255, 255, 0.55),
        Toolbar = new(34, 42, 45, 1),
        VideoPoster = new(0, 0, 0, 1),
        Warning = new(255, 184, 107, 1),
        WarningContainer = new(90, 70, 48, 1)
    };

    public static readonly DuVayPalette Auto = new()
    {
        Accent = new(131, 205, 227, 1),
        AccentBg = new(131, 205, 227, 1),
        AppBarFrosted = new(28, 34, 36, 0.84),
        Border = new(58, 70, 74, 1),
        Divider = new(49, 59, 62, 1),
        Error = new(242, 184, 181, 1),
        ErrorContainer = new(140, 29, 24, 1),
        HighlightColor = new(255, 184, 107, 1),
        Hover = new(255, 255, 255, 0.05),
        InverseOnSurface = new(49, 48, 51, 1),
        InversePrimary = new(31, 111, 139, 1),
        InverseSurface = new(244, 239, 244, 1),
        OnAccent = new(8, 50, 63, 1),
        OnError = new(65, 14, 11, 1),
        OnErrorContainer = new(249, 222, 220, 1),
        OnPrimary = new(8, 50, 63, 1),
        OnPrimaryContainer = new(232, 248, 252, 1),
        OnScrim = new(255, 255, 255, 1),
        OnSecondaryContainer = new(220, 231, 228, 1),
        OnSuccess = new(11, 46, 14, 1),
        OnSuccessContainer = new(232, 245, 233, 1),
        OnTertiaryContainer = new(255, 226, 184, 1),
        OnWarning = new(61, 34, 0, 1),
        OnWarningContainer = new(255, 226, 184, 1),
        Outline = new(108, 123, 127, 1),
        Primary = new(131, 205, 227, 1),
        PrimaryContainer = new(131, 205, 227, 0.18),
        PrimaryMuted = new(0, 0, 0, 0),
        Scrim = new(0, 0, 0, 0.6),
        Secondary = new(173, 201, 194, 1),
        SecondaryContainer = new(47, 59, 58, 1),
        Selected = new(131, 205, 227, 0.18),
        SelectedText = new(159, 216, 230, 1),
        ShadowColor = new(0, 0, 0, 0.4),
        Sidebar = new(22, 28, 30, 1),
        Success = new(129, 199, 132, 1),
        SuccessContainer = new(27, 94, 32, 1),
        Surface = new(28, 34, 36, 1),
        SurfaceContainer = new(255, 255, 255, 0.05),
        SurfaceContainerHigh = new(34, 42, 45, 1),
        SurfaceContainerLow = new(22, 28, 30, 1),
        SurfaceRaised = new(0, 0, 0, 0),
        TertiaryContainer = new(90, 70, 48, 1),
        Text = new(238, 238, 238, 1),
        TextMuted = new(0, 0, 0, 0),
        TextSubtle = new(255, 255, 255, 0.6),
        TextVerySubtle = new(255, 255, 255, 0.55),
        Toolbar = new(34, 42, 45, 1),
        VideoPoster = new(0, 0, 0, 1),
        Warning = new(255, 184, 107, 1),
        WarningContainer = new(90, 70, 48, 1)
    };

    public static readonly DuVayPalette HighContrast = new()
    {
        Accent = new(0, 58, 79, 1),
        AccentBg = new(0, 58, 79, 1),
        AppBarFrosted = new(255, 255, 255, 0.96),
        Border = new(74, 85, 89, 1),
        Divider = new(110, 122, 128, 1),
        Error = new(115, 0, 9, 1),
        ErrorContainer = new(255, 213, 210, 1),
        HighlightColor = new(110, 63, 0, 1),
        Hover = new(212, 227, 232, 1),
        InverseOnSurface = new(255, 255, 255, 1),
        InversePrimary = new(131, 205, 227, 1),
        InverseSurface = new(0, 0, 0, 1),
        OnAccent = new(255, 255, 255, 1),
        OnError = new(255, 255, 255, 1),
        OnErrorContainer = new(44, 0, 1, 1),
        OnPrimary = new(255, 255, 255, 1),
        OnPrimaryContainer = new(0, 24, 32, 1),
        OnScrim = new(255, 255, 255, 1),
        OnSecondaryContainer = new(12, 24, 21, 1),
        OnSuccess = new(255, 255, 255, 1),
        OnSuccessContainer = new(5, 40, 7, 1),
        OnTertiaryContainer = new(42, 24, 0, 1),
        OnWarning = new(255, 255, 255, 1),
        OnWarningContainer = new(42, 24, 0, 1),
        Outline = new(74, 85, 89, 1),
        Primary = new(0, 58, 79, 1),
        PrimaryContainer = new(182, 226, 238, 1),
        PrimaryMuted = new(182, 226, 238, 1),
        Scrim = new(0, 0, 0, 0.6),
        Secondary = new(36, 77, 68, 1),
        SecondaryContainer = new(214, 225, 222, 1),
        Selected = new(182, 226, 238, 1),
        SelectedText = new(0, 24, 32, 1),
        ShadowColor = new(0, 0, 0, 0.28),
        Sidebar = new(255, 255, 255, 1),
        Success = new(20, 80, 23, 1),
        SuccessContainer = new(198, 236, 200, 1),
        Surface = new(255, 255, 255, 1),
        SurfaceContainer = new(238, 242, 241, 1),
        SurfaceContainerHigh = new(229, 235, 233, 1),
        SurfaceContainerLow = new(246, 248, 247, 1),
        SurfaceRaised = new(229, 235, 233, 1),
        TertiaryContainer = new(255, 217, 168, 1),
        Text = new(0, 0, 0, 1),
        TextMuted = new(31, 42, 48, 1),
        TextSubtle = new(31, 42, 48, 1),
        TextVerySubtle = new(62, 74, 80, 1),
        Toolbar = new(255, 255, 255, 1),
        VideoPoster = new(0, 0, 0, 1),
        Warning = new(110, 63, 0, 1),
        WarningContainer = new(255, 217, 168, 1)
    };

    public static DuVayPalette For(DuVayTheme theme) => theme switch
    {
        DuVayTheme.Light => Light,
        DuVayTheme.Dark => Dark,
        DuVayTheme.Auto => Auto,
        DuVayTheme.HighContrast => HighContrast,
        _ => throw new ArgumentOutOfRangeException(nameof(theme)),
    };
}
