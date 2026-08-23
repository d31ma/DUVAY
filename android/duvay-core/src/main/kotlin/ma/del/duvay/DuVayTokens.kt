// DuVay design tokens — GENERATED, do not edit.
// Source of truth: tokens/**/*.json. Regenerate with `bun run tokens:native`.

package ma.del.duvay

object DuVayTokens {

    // Dimensions (dp)
    const val fontXs: Double = 12.0
    const val fontSm: Double = 12.0
    const val fontBase: Double = 14.0
    const val fontMd: Double = 15.0
    const val fontLg: Double = 17.0
    const val fontXl: Double = 20.0
    const val font2xl: Double = 24.0
    const val font3xl: Double = 36.0
    const val space1: Double = 4.0
    const val space1_5: Double = 6.0
    const val space2: Double = 8.0
    const val space3: Double = 12.0
    const val space4: Double = 16.0
    const val space5: Double = 20.0
    const val space6: Double = 24.0
    const val space7: Double = 28.0
    const val space8: Double = 32.0
    const val space9: Double = 36.0
    const val space10: Double = 40.0
    const val space11: Double = 44.0
    const val space12: Double = 48.0
    const val space13: Double = 52.0
    const val space14: Double = 56.0
    const val space15: Double = 60.0
    const val space16: Double = 64.0
    const val space20: Double = 80.0
    const val spaceXs: Double = 4.0
    const val spaceSm: Double = 8.0
    const val spaceMd: Double = 12.0
    const val spaceLg: Double = 16.0
    const val spaceXl: Double = 20.0
    const val space2xl: Double = 24.0
    const val space3xl: Double = 32.0
    const val touchMin: Double = 44.0
    const val sizeXs: Double = 28.0
    const val sizeSm: Double = 32.0
    const val sizeMd: Double = 40.0
    const val sizeLg: Double = 48.0
    const val sizeXl: Double = 56.0
    const val sizeIconXs: Double = 28.0
    const val sizeIconSm: Double = 32.0
    const val sizeIconMd: Double = 40.0
    const val sizeIconLg: Double = 48.0
    const val sizeIconXl: Double = 56.0
    const val commandMaxWidth: Double = 512.0
    const val commandListMaxHeight: Double = 320.0
    const val commandInputMinHeight: Double = 36.0
    const val commandItemMinHeight: Double = 40.0
    const val commandContentGap: Double = 1.0
    const val pieSize: Double = 192.0
    const val videoSeekWidth: Double = 64.0
    const val videoVolumeWidth: Double = 80.0
    const val iconGlyphXs: Double = 14.0
    const val iconGlyphSm: Double = 16.0
    const val iconGlyphMd: Double = 20.0
    const val iconGlyphLg: Double = 24.0
    const val iconGlyphXl: Double = 28.0
    const val radiusSm: Double = 2.0
    const val radius: Double = 4.0
    const val radiusMd: Double = 6.0
    const val radiusLg: Double = 8.0
    const val radiusXl: Double = 12.0
    const val radiusPill: Double = 999.0
    const val focusRingWidth: Double = 2.0
    const val focusRingOffset: Double = 2.0
    const val topbarHeight: Double = 56.0
    const val sidebarWidth: Double = 232.0
    const val drawerWidth: Double = 256.0
    const val drawerRailWidth: Double = 72.0
    const val mobileNavHeight: Double = 64.0
    const val gridGutter: Double = 24.0
    const val containerMax: Double = 1200.0
    const val motionDistanceX: Double = 24.0
    const val motionDistanceY: Double = 12.0
    const val appBarBackdropBlur: Double = 16.0

    // Durations (milliseconds)
    const val motionDurationFastMs: Int = 120
    const val motionDurationMs: Int = 180
    const val motionDurationSlowMs: Int = 260

    // Scalars
    const val highlightOpacity: Double = 0.35
    const val heatmapHoverScale: Double = 1.08
    const val pieHoverScale: Double = 1.02
    const val textHighEmphasisOpacity: Double = 0.87
    const val textMediumEmphasisOpacity: Double = 0.6
    const val textDisabledOpacity: Double = 0.38
    const val zSticky: Double = 10.0
    const val zOverlay: Double = 50.0
    const val zModal: Double = 55.0
    const val zDropdown: Double = 60.0
    const val zToast: Double = 9000.0

    enum class Theme(val id: String) {
        LIGHT("light"),
        DARK("dark"),
        AUTO("auto"),
        HIGH_CONTRAST("high-contrast");
    }

    /** sRGB colour packed as 0xAARRGGBB. */
    data class Palette(
        val accent: Long,
        val accentBg: Long,
        val appBarFrosted: Long,
        val border: Long,
        val divider: Long,
        val error: Long,
        val errorContainer: Long,
        val highlightColor: Long,
        val hover: Long,
        val inverseOnSurface: Long,
        val inversePrimary: Long,
        val inverseSurface: Long,
        val onAccent: Long,
        val onError: Long,
        val onErrorContainer: Long,
        val onPrimary: Long,
        val onPrimaryContainer: Long,
        val onSecondaryContainer: Long,
        val onSuccess: Long,
        val onSuccessContainer: Long,
        val onTertiaryContainer: Long,
        val onWarning: Long,
        val onWarningContainer: Long,
        val outline: Long,
        val primary: Long,
        val primaryContainer: Long,
        val primaryMuted: Long,
        val scrim: Long,
        val secondary: Long,
        val secondaryContainer: Long,
        val selected: Long,
        val selectedText: Long,
        val shadowColor: Long,
        val sidebar: Long,
        val success: Long,
        val successContainer: Long,
        val surface: Long,
        val surfaceContainer: Long,
        val surfaceContainerHigh: Long,
        val surfaceContainerLow: Long,
        val surfaceRaised: Long,
        val tertiaryContainer: Long,
        val text: Long,
        val textMuted: Long,
        val textSubtle: Long,
        val textVerySubtle: Long,
        val toolbar: Long,
        val videoPoster: Long,
        val warning: Long,
        val warningContainer: Long
    )

    val LIGHT_PALETTE = Palette(
        accent = 0xFF1F6F8BL,
        accentBg = 0xFF1F6F8BL,
        appBarFrosted = 0xD6F8FAF9L,
        border = 0xFFD0DBD8L,
        divider = 0xFFD8E0DEL,
        error = 0xFFB3261EL,
        errorContainer = 0xFFF9DEDCL,
        highlightColor = 0xFFC47800L,
        hover = 0xFFEAF1EFL,
        inverseOnSurface = 0xFFF4EFF4L,
        inversePrimary = 0xFF83CDE3L,
        inverseSurface = 0xFF313033L,
        onAccent = 0xFFFFFFFFL,
        onError = 0xFFFFFFFFL,
        onErrorContainer = 0xFF410E0BL,
        onPrimary = 0xFFFFFFFFL,
        onPrimaryContainer = 0xFF073544L,
        onSecondaryContainer = 0xFF273733L,
        onSuccess = 0xFFFFFFFFL,
        onSuccessContainer = 0xFF1B5E20L,
        onTertiaryContainer = 0xFF493116L,
        onWarning = 0xFF2A1800L,
        onWarningContainer = 0xFF493116L,
        outline = 0xFF7E8C88L,
        primary = 0xFF1F6F8BL,
        primaryContainer = 0xFFD7EDF4L,
        primaryMuted = 0xFFD7EDF4L,
        scrim = 0x66000000L,
        secondary = 0xFF4F635EL,
        secondaryContainer = 0xFFE6ECE9L,
        selected = 0xFFDCEFF3L,
        selectedText = 0xFF102F3AL,
        shadowColor = 0x1F182125L,
        sidebar = 0xFFEEF3F1L,
        success = 0xFF2E7D32L,
        successContainer = 0xFFE8F5E9L,
        surface = 0xFFF8FAF9L,
        surfaceContainer = 0xFFEDF3F1L,
        surfaceContainerHigh = 0xFFE5ECE9L,
        surfaceContainerLow = 0xFFF3F7F5L,
        surfaceRaised = 0xFFE5ECE9L,
        tertiaryContainer = 0xFFF4E4C7L,
        text = 0xFF182125L,
        textMuted = 0xFF526066L,
        textSubtle = 0xFF526066L,
        textVerySubtle = 0xFF7B878CL,
        toolbar = 0xFFF1F5F4L,
        videoPoster = 0xFF000000L,
        warning = 0xFFC47800L,
        warningContainer = 0xFFF4E4C7L
    )

    val DARK_PALETTE = Palette(
        accent = 0xFF83CDE3L,
        accentBg = 0xFF83CDE3L,
        appBarFrosted = 0xD61C2224L,
        border = 0xFF3A464AL,
        divider = 0xFF313B3EL,
        error = 0xFFF2B8B5L,
        errorContainer = 0xFF8C1D18L,
        highlightColor = 0xFFFFB86BL,
        hover = 0x0DFFFFFFL,
        inverseOnSurface = 0xFF313033L,
        inversePrimary = 0xFF1F6F8BL,
        inverseSurface = 0xFFF4EFF4L,
        onAccent = 0xFF08323FL,
        onError = 0xFF410E0BL,
        onErrorContainer = 0xFFF9DEDCL,
        onPrimary = 0xFF08323FL,
        onPrimaryContainer = 0xFFE8F8FCL,
        onSecondaryContainer = 0xFFDCE7E4L,
        onSuccess = 0xFF0B2E0EL,
        onSuccessContainer = 0xFFE8F5E9L,
        onTertiaryContainer = 0xFFFFE2B8L,
        onWarning = 0xFF3D2200L,
        onWarningContainer = 0xFFFFE2B8L,
        outline = 0xFF6C7B7FL,
        primary = 0xFF83CDE3L,
        primaryContainer = 0x2E83CDE3L,
        primaryMuted = 0x2E83CDE3L,
        scrim = 0x99000000L,
        secondary = 0xFFADC9C2L,
        secondaryContainer = 0xFF2F3B3AL,
        selected = 0x2E83CDE3L,
        selectedText = 0xFF9FD8E6L,
        shadowColor = 0x66000000L,
        sidebar = 0xFF161C1EL,
        success = 0xFF81C784L,
        successContainer = 0xFF1B5E20L,
        surface = 0xFF1C2224L,
        surfaceContainer = 0x0DFFFFFFL,
        surfaceContainerHigh = 0xFF222A2DL,
        surfaceContainerLow = 0xFF161C1EL,
        surfaceRaised = 0xFF222A2DL,
        tertiaryContainer = 0xFF5A4630L,
        text = 0xFFEEEEEEL,
        textMuted = 0x99FFFFFFL,
        textSubtle = 0x99FFFFFFL,
        textVerySubtle = 0x8CFFFFFFL,
        toolbar = 0xFF222A2DL,
        videoPoster = 0xFF000000L,
        warning = 0xFFFFB86BL,
        warningContainer = 0xFF5A4630L
    )

    val AUTO_PALETTE = Palette(
        accent = 0xFF83CDE3L,
        accentBg = 0xFF83CDE3L,
        appBarFrosted = 0xD61C2224L,
        border = 0xFF3A464AL,
        divider = 0xFF313B3EL,
        error = 0xFFF2B8B5L,
        errorContainer = 0xFF8C1D18L,
        highlightColor = 0xFFFFB86BL,
        hover = 0x0DFFFFFFL,
        inverseOnSurface = 0xFF313033L,
        inversePrimary = 0xFF1F6F8BL,
        inverseSurface = 0xFFF4EFF4L,
        onAccent = 0xFF08323FL,
        onError = 0xFF410E0BL,
        onErrorContainer = 0xFFF9DEDCL,
        onPrimary = 0xFF08323FL,
        onPrimaryContainer = 0xFFE8F8FCL,
        onSecondaryContainer = 0xFFDCE7E4L,
        onSuccess = 0xFF0B2E0EL,
        onSuccessContainer = 0xFFE8F5E9L,
        onTertiaryContainer = 0xFFFFE2B8L,
        onWarning = 0xFF3D2200L,
        onWarningContainer = 0xFFFFE2B8L,
        outline = 0xFF6C7B7FL,
        primary = 0xFF83CDE3L,
        primaryContainer = 0x2E83CDE3L,
        primaryMuted = 0x00000000L,
        scrim = 0x99000000L,
        secondary = 0xFFADC9C2L,
        secondaryContainer = 0xFF2F3B3AL,
        selected = 0x2E83CDE3L,
        selectedText = 0xFF9FD8E6L,
        shadowColor = 0x66000000L,
        sidebar = 0xFF161C1EL,
        success = 0xFF81C784L,
        successContainer = 0xFF1B5E20L,
        surface = 0xFF1C2224L,
        surfaceContainer = 0x0DFFFFFFL,
        surfaceContainerHigh = 0xFF222A2DL,
        surfaceContainerLow = 0xFF161C1EL,
        surfaceRaised = 0x00000000L,
        tertiaryContainer = 0xFF5A4630L,
        text = 0xFFEEEEEEL,
        textMuted = 0x00000000L,
        textSubtle = 0x99FFFFFFL,
        textVerySubtle = 0x8CFFFFFFL,
        toolbar = 0xFF222A2DL,
        videoPoster = 0xFF000000L,
        warning = 0xFFFFB86BL,
        warningContainer = 0xFF5A4630L
    )

    val HIGH_CONTRAST_PALETTE = Palette(
        accent = 0xFF003A4FL,
        accentBg = 0xFF003A4FL,
        appBarFrosted = 0xF5FFFFFFL,
        border = 0xFF4A5559L,
        divider = 0xFF6E7A80L,
        error = 0xFF730009L,
        errorContainer = 0xFFFFD5D2L,
        highlightColor = 0xFF6E3F00L,
        hover = 0xFFD4E3E8L,
        inverseOnSurface = 0xFFFFFFFFL,
        inversePrimary = 0xFF83CDE3L,
        inverseSurface = 0xFF000000L,
        onAccent = 0xFFFFFFFFL,
        onError = 0xFFFFFFFFL,
        onErrorContainer = 0xFF2C0001L,
        onPrimary = 0xFFFFFFFFL,
        onPrimaryContainer = 0xFF001820L,
        onSecondaryContainer = 0xFF0C1815L,
        onSuccess = 0xFFFFFFFFL,
        onSuccessContainer = 0xFF052807L,
        onTertiaryContainer = 0xFF2A1800L,
        onWarning = 0xFFFFFFFFL,
        onWarningContainer = 0xFF2A1800L,
        outline = 0xFF4A5559L,
        primary = 0xFF003A4FL,
        primaryContainer = 0xFFB6E2EEL,
        primaryMuted = 0xFFB6E2EEL,
        scrim = 0x99000000L,
        secondary = 0xFF244D44L,
        secondaryContainer = 0xFFD6E1DEL,
        selected = 0xFFB6E2EEL,
        selectedText = 0xFF001820L,
        shadowColor = 0x47000000L,
        sidebar = 0xFFFFFFFFL,
        success = 0xFF145017L,
        successContainer = 0xFFC6ECC8L,
        surface = 0xFFFFFFFFL,
        surfaceContainer = 0xFFEEF2F1L,
        surfaceContainerHigh = 0xFFE5EBE9L,
        surfaceContainerLow = 0xFFF6F8F7L,
        surfaceRaised = 0xFFE5EBE9L,
        tertiaryContainer = 0xFFFFD9A8L,
        text = 0xFF000000L,
        textMuted = 0xFF1F2A30L,
        textSubtle = 0xFF1F2A30L,
        textVerySubtle = 0xFF3E4A50L,
        toolbar = 0xFFFFFFFFL,
        videoPoster = 0xFF000000L,
        warning = 0xFF6E3F00L,
        warningContainer = 0xFFFFD9A8L
    )

    fun palette(theme: Theme): Palette = when (theme) {
        Theme.LIGHT -> LIGHT_PALETTE
        Theme.DARK -> DARK_PALETTE
        Theme.AUTO -> AUTO_PALETTE
        Theme.HIGH_CONTRAST -> HIGH_CONTRAST_PALETTE
    }
}
