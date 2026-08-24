package ma.del.duvay.compose

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import app.cash.paparazzi.DeviceConfig
import app.cash.paparazzi.Paparazzi
import ma.del.duvay.DuVayTokens
import org.junit.Rule
import org.junit.Test

/**
 * DuVay — Compose snapshot suite (Android).
 *
 * The plan requires a snapshot suite per platform before a tier may be
 * published as supported. This is the Android one.
 *
 * Paparazzi renders Compose through layoutlib on the JVM, so this needs no
 * emulator and no device — the same reason `:duvay-core` is kept off Android
 * for the conformance suite. It draws with a bundled font and a pinned device
 * config, which is what makes the output reproducible across machines.
 *
 *     gradle :duvay-compose:recordPaparazziDebug   re-record
 *     gradle :duvay-compose:verifyPaparazziDebug   assert
 */
class SnapshotTest {

    @get:Rule
    val paparazzi = Paparazzi(
        // Pinned rather than defaulted: a device change silently invalidates
        // every recording, and that should be a deliberate edit.
        deviceConfig = DeviceConfig.PIXEL_5,
        // Dark mode is exercised by passing the theme explicitly below, so the
        // device itself stays light and the diff stays about the component.
        showSystemUi = false,
    )

    @Test
    fun buttonVariants() {
        paparazzi.snapshot {
            DuVayTheme(theme = DuVayTokens.Theme.LIGHT) {
                Column(
                    modifier = Modifier.background(Color.White).padding(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    DuVayButton(text = "Filled", onClick = {}, variant = DuVayButtonVariant.Filled)
                    DuVayButton(text = "Outlined", onClick = {}, variant = DuVayButtonVariant.Outlined)
                    DuVayButton(text = "Text", onClick = {}, variant = DuVayButtonVariant.Text)
                }
            }
        }
    }

    @Test
    fun selectionControls() {
        paparazzi.snapshot {
            DuVayTheme(theme = DuVayTokens.Theme.LIGHT) {
                Column(
                    modifier = Modifier.background(Color.White).padding(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    DuVayCheckbox(label = "Checkbox", checked = true, onCheckedChange = {})
                    DuVaySwitch(label = "Switch", checked = true, onCheckedChange = {})
                }
            }
        }
    }

    @Test
    fun textField() {
        paparazzi.snapshot {
            DuVayTheme(theme = DuVayTokens.Theme.LIGHT) {
                Column(modifier = Modifier.background(Color.White).padding(8.dp)) {
                    DuVayTextField(label = "Label", value = "Ada", onValueChange = {})
                }
            }
        }
    }

    /**
     * Dark is a separate palette with its own contrast guarantees rather than a
     * recolour of light, so it gets its own recording.
     */
    @Test
    fun buttonsDark() {
        paparazzi.snapshot {
            DuVayTheme(theme = DuVayTokens.Theme.DARK) {
                Column(
                    modifier = Modifier.background(Color.Black).padding(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    DuVayButton(text = "Filled", onClick = {}, variant = DuVayButtonVariant.Filled)
                    DuVayButton(text = "Outlined", onClick = {}, variant = DuVayButtonVariant.Outlined)
                }
            }
        }
    }
}
