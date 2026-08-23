// DuVay — theme bridge (Android)
//
// Maps DuVay's semantic palette onto Material 3's ColorScheme so every M3
// widget inside a DuVayTheme is already the right colour. That is the plan's
// Android strategy: map DuVay semantic → md.sys.*, inherit dynamic colour, and
// do not redraw controls that already exist.

package ma.del.duvay.compose

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import ma.del.duvay.DuVayTokens

/** Tokens are plain Doubles in duvay-core; Compose wants Dp. */
val Double.duvayDp: Dp get() = this.dp

/** Tokens are packed 0xAARRGGBB Longs in duvay-core; Compose wants Color. */
fun Long.toComposeColor(): Color = Color(this.toULong() shl 32)

/** The DuVay palette in effect, for the handful of tokens M3 has no slot for. */
val LocalDuVayPalette = staticCompositionLocalOf {
    DuVayTokens.palette(DuVayTokens.Theme.LIGHT)
}

/**
 * Whether the accent comes from the system or from DuVay.
 *
 * `System` is the default because the plan is explicit: on each OS the accent
 * is a system value, not ours. Android supplies Material You dynamic colour
 * from the user's wallpaper, and a library that hard-codes its own teal over
 * that looks foreign on the device.
 */
enum class DuVayAccentSource { System, Brand }

@Composable
fun DuVayTheme(
    theme: DuVayTokens.Theme = DuVayTokens.Theme.AUTO,
    accentSource: DuVayAccentSource = DuVayAccentSource.System,
    content: @Composable () -> Unit,
) {
    val dark = when (theme) {
        DuVayTokens.Theme.DARK -> true
        DuVayTokens.Theme.LIGHT, DuVayTokens.Theme.HIGH_CONTRAST -> false
        DuVayTokens.Theme.AUTO -> isSystemInDarkTheme()
    }
    val resolved = when {
        theme == DuVayTokens.Theme.HIGH_CONTRAST -> DuVayTokens.Theme.HIGH_CONTRAST
        dark -> DuVayTokens.Theme.DARK
        else -> DuVayTokens.Theme.LIGHT
    }
    val palette = DuVayTokens.palette(resolved)

    // Dynamic colour needs Android 12; below that, and whenever the app asks
    // for the brand accent, DuVay's own palette drives the scheme.
    val dynamicAvailable = Build.VERSION.SDK_INT >= Build.VERSION_CODES.S
    val context = LocalContext.current
    val scheme = when {
        accentSource == DuVayAccentSource.System && dynamicAvailable ->
            if (dark) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)

        dark -> darkColorScheme(
            primary = palette.accentBg.toComposeColor(),
            onPrimary = palette.onAccent.toComposeColor(),
            primaryContainer = palette.primaryContainer.toComposeColor(),
            onPrimaryContainer = palette.onPrimaryContainer.toComposeColor(),
            secondaryContainer = palette.secondaryContainer.toComposeColor(),
            onSecondaryContainer = palette.onSecondaryContainer.toComposeColor(),
            error = palette.error.toComposeColor(),
            onError = palette.onError.toComposeColor(),
            errorContainer = palette.errorContainer.toComposeColor(),
            onErrorContainer = palette.onErrorContainer.toComposeColor(),
            background = palette.surface.toComposeColor(),
            onBackground = palette.text.toComposeColor(),
            surface = palette.surface.toComposeColor(),
            onSurface = palette.text.toComposeColor(),
            surfaceVariant = palette.surfaceContainer.toComposeColor(),
            onSurfaceVariant = palette.textSubtle.toComposeColor(),
            surfaceContainerLowest = palette.surface.toComposeColor(),
            surfaceContainerLow = palette.surfaceContainerLow.toComposeColor(),
            surfaceContainer = palette.surfaceContainer.toComposeColor(),
            surfaceContainerHigh = palette.surfaceContainerHigh.toComposeColor(),
            surfaceContainerHighest = palette.surfaceContainerHigh.toComposeColor(),
            // --w-outline is the WCAG 1.4.11 control boundary; M3's `outline`
            // slot is exactly the same role, so they map one-to-one.
            outline = palette.outline.toComposeColor(),
            outlineVariant = palette.border.toComposeColor(),
            inverseSurface = palette.inverseSurface.toComposeColor(),
            inverseOnSurface = palette.inverseOnSurface.toComposeColor(),
            inversePrimary = palette.inversePrimary.toComposeColor(),
            scrim = palette.scrim.toComposeColor(),
        )

        else -> lightColorScheme(
            primary = palette.accentBg.toComposeColor(),
            onPrimary = palette.onAccent.toComposeColor(),
            primaryContainer = palette.primaryContainer.toComposeColor(),
            onPrimaryContainer = palette.onPrimaryContainer.toComposeColor(),
            secondaryContainer = palette.secondaryContainer.toComposeColor(),
            onSecondaryContainer = palette.onSecondaryContainer.toComposeColor(),
            error = palette.error.toComposeColor(),
            onError = palette.onError.toComposeColor(),
            errorContainer = palette.errorContainer.toComposeColor(),
            onErrorContainer = palette.onErrorContainer.toComposeColor(),
            background = palette.surface.toComposeColor(),
            onBackground = palette.text.toComposeColor(),
            surface = palette.surface.toComposeColor(),
            onSurface = palette.text.toComposeColor(),
            surfaceVariant = palette.surfaceContainer.toComposeColor(),
            onSurfaceVariant = palette.textSubtle.toComposeColor(),
            surfaceContainerLowest = palette.surface.toComposeColor(),
            surfaceContainerLow = palette.surfaceContainerLow.toComposeColor(),
            surfaceContainer = palette.surfaceContainer.toComposeColor(),
            surfaceContainerHigh = palette.surfaceContainerHigh.toComposeColor(),
            surfaceContainerHighest = palette.surfaceContainerHigh.toComposeColor(),
            outline = palette.outline.toComposeColor(),
            outlineVariant = palette.border.toComposeColor(),
            inverseSurface = palette.inverseSurface.toComposeColor(),
            inverseOnSurface = palette.inverseOnSurface.toComposeColor(),
            inversePrimary = palette.inversePrimary.toComposeColor(),
            scrim = palette.scrim.toComposeColor(),
        )
    }

    CompositionLocalProvider(LocalDuVayPalette provides palette) {
        MaterialTheme(colorScheme = scheme, content = content)
    }
}
