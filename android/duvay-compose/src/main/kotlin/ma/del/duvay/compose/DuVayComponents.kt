// DuVay — Tier 1 components (Android / Jetpack Compose)
//
// Contracts: spec/components/*.json
//
// These wrap Material 3 rather than redrawing it. M3's widgets already carry
// the platform's ripple, touch-target expansion, TalkBack semantics and
// motion-physics; DuVay's job here is naming, token mapping and the accessible
// defaults the contract requires.

package ma.del.duvay.compose

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.PlainTooltip
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Snackbar
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TooltipBox
import androidx.compose.material3.TooltipDefaults
import androidx.compose.material3.rememberTooltipState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import ma.del.duvay.DuVayTokens
import androidx.compose.material3.Button as M3Button
import androidx.compose.material3.Checkbox as M3Checkbox
import androidx.compose.material3.Switch as M3Switch
import androidx.compose.material3.Slider as M3Slider
import androidx.compose.material3.Badge as M3Badge

enum class DuVayButtonVariant { Filled, Tonal, Outlined, Text }

// MARK: Button

@Composable
fun DuVayButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: DuVayButtonVariant = DuVayButtonVariant.Filled,
    enabled: Boolean = true,
    loading: Boolean = false,
) {
    // A loading button stays announced but stops responding, matching the web
    // component's `loading` semantics.
    val active = enabled && !loading
    val content: @Composable RowScope.() -> Unit = {
        if (loading) {
            CircularProgressIndicator(
                modifier = Modifier.size(DuVayTokens.iconGlyphSm.duvayDp),
                strokeWidth = 2.dpCompat(),
            )
        }
        Text(text)
    }
    when (variant) {
        DuVayButtonVariant.Filled -> M3Button(onClick, modifier, active, content = content)
        DuVayButtonVariant.Tonal -> FilledTonalButton(onClick, modifier, active, content = content)
        DuVayButtonVariant.Outlined -> OutlinedButton(onClick, modifier, active, content = content)
        DuVayButtonVariant.Text -> TextButton(onClick, modifier, active, content = content)
    }
}

private fun Int.dpCompat() = this.toDouble().duvayDp

// MARK: IconButton

/**
 * An icon-only button. [label] is required rather than optional: the control
 * carries no text, so there is no fallback for TalkBack.
 */
@Composable
fun DuVayIconButton(
    icon: ImageVector,
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    IconButton(onClick = onClick, modifier = modifier, enabled = enabled) {
        Icon(imageVector = icon, contentDescription = label)
    }
}

// MARK: Icon

/** Decorative by default — a null description hides it from TalkBack. */
@Composable
fun DuVayIcon(icon: ImageVector, modifier: Modifier = Modifier, label: String? = null) {
    Icon(imageVector = icon, contentDescription = label, modifier = modifier)
}

// MARK: Divider

@Composable
fun DuVayDivider(modifier: Modifier = Modifier) {
    HorizontalDivider(modifier = modifier, color = MaterialTheme.colorScheme.outlineVariant)
}

// MARK: Card

@Composable
fun DuVayCard(
    modifier: Modifier = Modifier,
    elevated: Boolean = false,
    content: @Composable ColumnScope.() -> Unit,
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(DuVayTokens.radiusLg.duvayDp),
        elevation = CardDefaults.cardElevation(
            defaultElevation = if (elevated) DuVayTokens.space1.duvayDp else 0.0.duvayDp,
        ),
    ) {
        Column(Modifier.padding(DuVayTokens.space4.duvayDp), content = content)
    }
}

// MARK: Chip

@Composable
fun DuVayChip(
    text: String,
    modifier: Modifier = Modifier,
    selected: Boolean = false,
    onClick: (() -> Unit)? = null,
) {
    // A chip with no handler is a label, not a button, and must not claim a
    // clickable role that does nothing.
    if (onClick == null) {
        AssistChip(onClick = {}, label = { Text(text) }, modifier = modifier, enabled = false)
    } else {
        FilterChip(selected = selected, onClick = onClick, label = { Text(text) }, modifier = modifier)
    }
}

// MARK: Badge

@Composable
fun DuVayBadge(text: String, modifier: Modifier = Modifier) {
    M3Badge(modifier = modifier) { Text(text) }
}

// MARK: Avatar

@Composable
fun DuVayAvatar(name: String?, modifier: Modifier = Modifier) {
    // Initials come from duvay-core so web and native agree on the algorithm —
    // the same rule the conformance suite pins.
    val initials = ma.del.duvay.DuVayValues.initials(name)
    Surface(
        modifier = modifier.size(DuVayTokens.sizeMd.duvayDp),
        shape = CircleShape,
        color = MaterialTheme.colorScheme.primaryContainer,
    ) {
        Box(contentAlignment = Alignment.Center) {
            Text(
                text = initials,
                color = MaterialTheme.colorScheme.onPrimaryContainer,
                modifier = Modifier.semantics { name?.let { contentDescription = it } },
            )
        }
    }
}

// MARK: Checkbox

@Composable
fun DuVayCheckbox(
    label: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    Row(
        modifier = modifier.defaultMinSize(minHeight = DuVayTokens.touchMin.duvayDp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        M3Checkbox(checked = checked, onCheckedChange = onCheckedChange, enabled = enabled)
        Text(label)
    }
}

// MARK: Switch

@Composable
fun DuVaySwitch(
    label: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .defaultMinSize(minHeight = DuVayTokens.touchMin.duvayDp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Text(label)
        M3Switch(checked = checked, onCheckedChange = onCheckedChange, enabled = enabled)
    }
}

// MARK: RadioGroup

@Composable
fun <T> DuVayRadioGroup(
    label: String,
    selected: T,
    options: List<Pair<T, String>>,
    onSelect: (T) -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(modifier) {
        Text(label, style = MaterialTheme.typography.labelLarge)
        options.forEach { (value, text) ->
            Row(
                modifier = Modifier.defaultMinSize(minHeight = DuVayTokens.touchMin.duvayDp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                RadioButton(selected = selected == value, onClick = { onSelect(value) })
                Text(text)
            }
        }
    }
}

// MARK: Slider

@Composable
fun DuVaySlider(
    value: Float,
    onValueChange: (Float) -> Unit,
    modifier: Modifier = Modifier,
    valueRange: ClosedFloatingPointRange<Float> = 0f..1f,
) {
    M3Slider(value = value, onValueChange = onValueChange, modifier = modifier, valueRange = valueRange)
}

// MARK: TextField

@Composable
fun DuVayTextField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "",
    error: String? = null,
    secure: Boolean = false,
    enabled: Boolean = true,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier,
        enabled = enabled,
        label = { Text(label) },
        placeholder = { Text(placeholder) },
        isError = error != null,
        // The message is wired as supporting text so TalkBack reads it as part
        // of the field rather than as a stray node it may never reach.
        supportingText = error?.let { { Text(it) } },
        visualTransformation = if (secure) PasswordVisualTransformation() else VisualTransformation.None,
        singleLine = true,
    )
}

// MARK: TextArea

@Composable
fun DuVayTextArea(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    minLines: Int = 4,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier,
        label = { Text(label) },
        minLines = minLines,
        singleLine = false,
    )
}

// MARK: Select

@OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)
@Composable
fun <T> DuVayDropdown(
    label: String,
    selected: T,
    options: List<Pair<T, String>>,
    onSelect: (T) -> Unit,
    modifier: Modifier = Modifier,
) {
    var expanded by remember { mutableStateOf(false) }
    val selectedLabel = options.firstOrNull { it.first == selected }?.second ?: ""

    ExposedDropdownMenuBox(expanded = expanded, onExpandedChange = { expanded = it }, modifier = modifier) {
        OutlinedTextField(
            value = selectedLabel,
            onValueChange = {},
            readOnly = true,
            label = { Text(label) },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
            modifier = Modifier.menuAnchor(androidx.compose.material3.MenuAnchorType.PrimaryNotEditable),
        )
        // ExposedDropdownMenu is a member of ExposedDropdownMenuBoxScope, not
        // of ExposedDropdownMenuDefaults.
        ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            options.forEach { (value, text) ->
                DropdownMenuItem(text = { Text(text) }, onClick = {
                    onSelect(value)
                    expanded = false
                })
            }
        }
    }
}

// MARK: Menu

data class DuVayMenuItem(val title: String, val enabled: Boolean = true, val onClick: () -> Unit)

@Composable
fun DuVayMenu(expanded: Boolean, items: List<DuVayMenuItem>, onDismiss: () -> Unit) {
    DropdownMenu(expanded = expanded, onDismissRequest = onDismiss) {
        items.forEach { item ->
            DropdownMenuItem(text = { Text(item.title) }, enabled = item.enabled, onClick = item.onClick)
        }
    }
}

// MARK: Progress

@Composable
fun DuVayLinearProgress(progress: Float? = null, modifier: Modifier = Modifier) {
    if (progress == null) LinearProgressIndicator(modifier)
    else LinearProgressIndicator(progress = { progress }, modifier = modifier)
}

@Composable
fun DuVayCircularProgress(progress: Float? = null, modifier: Modifier = Modifier) {
    if (progress == null) CircularProgressIndicator(modifier)
    else CircularProgressIndicator(progress = { progress }, modifier = modifier)
}

// MARK: List

@Composable
fun DuVayList(modifier: Modifier = Modifier, content: @Composable ColumnScope.() -> Unit) {
    Column(modifier, content = content)
}

@Composable
fun DuVayListItem(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
) {
    ListItem(
        modifier = modifier,
        headlineContent = { Text(title) },
        supportingContent = subtitle?.let { { Text(it) } },
    )
}

// MARK: Feedback

@Composable
fun DuVayBanner(text: String, modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(DuVayTokens.radius.duvayDp),
        color = MaterialTheme.colorScheme.primaryContainer,
    ) {
        Text(text, Modifier.padding(DuVayTokens.space3.duvayDp))
    }
}

@Composable
fun DuVaySnackbar(message: String, modifier: Modifier = Modifier) {
    Snackbar(modifier) { Text(message) }
}

@Composable
fun DuVayAlertDialog(
    title: String,
    message: String? = null,
    confirmLabel: String = "OK",
    onConfirm: () -> Unit,
    onDismiss: () -> Unit,
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title) },
        text = message?.let { { Text(it) } },
        confirmButton = { TextButton(onClick = onConfirm) { Text(confirmLabel) } },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } },
    )
}

@OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)
@Composable
fun DuVayTooltip(text: String, content: @Composable () -> Unit) {
    TooltipBox(
        positionProvider = TooltipDefaults.rememberPlainTooltipPositionProvider(),
        tooltip = { PlainTooltip { Text(text) } },
        state = rememberTooltipState(),
        content = content,
    )
}

// MARK: Dialog

/**
 * A modal surface for arbitrary content.
 *
 * Distinct from [DuVayAlertDialog], which is the confirm/cancel shape. This one
 * carries whatever the caller puts in it, matching the web `w-dialog`.
 */
@Composable
fun DuVayDialog(
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier,
    title: String? = null,
    content: @Composable ColumnScope.() -> Unit,
) {
    androidx.compose.ui.window.Dialog(onDismissRequest = onDismiss) {
        Surface(
            modifier = modifier,
            shape = RoundedCornerShape(DuVayTokens.radiusXl.duvayDp),
            color = MaterialTheme.colorScheme.surface,
        ) {
            Column(Modifier.padding(DuVayTokens.space5.duvayDp)) {
                title?.let {
                    Text(it, style = MaterialTheme.typography.headlineSmall)
                }
                content()
            }
        }
    }
}
