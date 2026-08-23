// DuVay gallery — internal harness, not a shipped app.
//
// Renders every Tier-1 component so they can be looked at on a device and
// captured for snapshot tests. See CROSS-PLATFORM-PLAN.md: gallery apps are
// explicitly out of scope as products.

package ma.del.duvay.gallery

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.enableEdgeToEdge
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import ma.del.duvay.DuVayTokens
import ma.del.duvay.compose.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // Draw behind the system bars, then inset the content — without this the
        // first row sits under the status bar.
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        setContent {
            // Brand accent rather than Material You, so the gallery shows
            // DuVay's own palette instead of the emulator's wallpaper colours.
            DuVayTheme(accentSource = DuVayAccentSource.Brand) {
                Surface(
                    Modifier.fillMaxSize().safeDrawingPadding(),
                    color = MaterialTheme.colorScheme.background,
                ) {
                    Gallery()
                }
            }
        }
    }
}

@Composable
private fun Section(title: String, content: @Composable () -> Unit) {
    Column(Modifier.padding(vertical = 8.dp)) {
        Text(title, style = MaterialTheme.typography.titleSmall)
        content()
    }
}

@Composable
fun Gallery() {
    var checked by remember { mutableStateOf(true) }
    var switched by remember { mutableStateOf(true) }
    var text by remember { mutableStateOf("") }
    var slider by remember { mutableFloatStateOf(0.4f) }
    var choice by remember { mutableStateOf("a") }

    Column(
        Modifier
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        Text("DuVay — Tier 1", style = MaterialTheme.typography.headlineSmall)

        Section("Buttons") {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                DuVayButton("Filled", onClick = {})
                DuVayButton("Tonal", onClick = {}, variant = DuVayButtonVariant.Tonal)
                DuVayButton("Outlined", onClick = {}, variant = DuVayButtonVariant.Outlined)
            }
        }

        Section("Icon button, icon, badge, chip, avatar") {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                DuVayIconButton(Icons.Filled.Settings, label = "Settings", onClick = {})
                DuVayIcon(Icons.Filled.Settings, label = null)
                DuVayBadge("7")
                DuVayChip("Chip", selected = true, onClick = {})
                DuVayAvatar("Ada Lovelace")
            }
        }

        DuVayDivider(Modifier.fillMaxWidth())

        Section("Selection") {
            DuVayCheckbox("Checkbox", checked, onCheckedChange = { checked = it })
            DuVaySwitch("Switch", switched, onCheckedChange = { switched = it })
            DuVayRadioGroup(
                label = "Radio group",
                selected = choice,
                options = listOf("a" to "Option A", "b" to "Option B"),
                onSelect = { choice = it },
            )
        }

        Section("Slider") { DuVaySlider(slider, onValueChange = { slider = it }, modifier = Modifier.fillMaxWidth()) }

        Section("Text field") {
            DuVayTextField("Label", text, onValueChange = { text = it }, modifier = Modifier.fillMaxWidth(), placeholder = "Type here")
        }

        Section("Progress") {
            DuVayLinearProgress(0.6f, modifier = Modifier.fillMaxWidth())
            DuVayCircularProgress(0.6f)
        }

        Section("Card and list") {
            DuVayCard(Modifier.fillMaxWidth()) {
                Text("Card surface", style = MaterialTheme.typography.bodyMedium)
            }
            DuVayList {
                DuVayListItem("List item", subtitle = "Supporting text")
                DuVayListItem("Another row")
            }
        }

        Section("Feedback") {
            DuVayBanner("An inline banner message.")
            DuVaySnackbar("A transient snackbar.")
        }

        Text(
            "space-1_5=${DuVayTokens.space1_5}  space-15=${DuVayTokens.space15}  touch=${DuVayTokens.touchMin}",
            style = MaterialTheme.typography.labelSmall,
        )
    }
}
