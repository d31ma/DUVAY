// DuVay for Android — Tier 2 components.
//
// Tier 2 is added one component at a time across all five platforms, so no
// platform races ahead of the others (CROSS-PLATFORM-PLAN.md, Phase 6+).
//
// Each of these composes the Material 3 primitive an Android app would already
// reach for, so touch feedback, focus order and TalkBack come from the platform
// rather than from a redrawn control.

package ma.del.duvay.compose

import android.provider.Settings

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowLeft
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.selection.toggleable
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.TopAppBar
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.MenuAnchorType
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerState
import androidx.compose.material3.DrawerState
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationDrawerItem
import androidx.compose.material3.TimePicker
import androidx.compose.material3.TimePickerState
import ma.del.duvay.DuVayTokens

/** A placeholder for a screen with nothing on it. */
@Composable
fun DuVayEmptyState(
    title: String,
    modifier: Modifier = Modifier,
    message: String? = null,
    action: (@Composable () -> Unit)? = null,
) {
    Column(
        modifier = modifier.fillMaxWidth().padding(DuVayTokens.space6.duvayDp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(DuVayTokens.space3.duvayDp),
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium,
            textAlign = TextAlign.Center,
            modifier = Modifier.semantics { heading() },
        )
        if (message != null) {
            Text(
                text = message,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center,
            )
        }
        action?.invoke()
    }
}

/**
 * A loading placeholder.
 *
 * The pulse stops when the system reports that animations are disabled, which
 * is the setting a looping shimmer is most likely to violate. The block stays
 * visible so the layout still reads as pending.
 */
@Composable
fun DuVaySkeleton(
    modifier: Modifier = Modifier,
    height: Double = 16.0,
    radius: Double = DuVayTokens.radiusSm,
) {
    // The real signal: "Remove animations" in Accessibility settings sets the
    // animator duration scale to 0. Compose has no reduce-motion flag of its
    // own, so read the platform's.
    val resolver = LocalContext.current.contentResolver
    val reduceMotion = Settings.Global.getFloat(
        resolver,
        Settings.Global.ANIMATOR_DURATION_SCALE,
        1f,
    ) == 0f
    val alpha = if (reduceMotion) {
        1f
    } else {
        val transition = rememberInfiniteTransition(label = "duvay-skeleton")
        val animated by transition.animateFloat(
            initialValue = 1f,
            targetValue = 0.55f,
            animationSpec = infiniteRepeatable(tween(1000), RepeatMode.Reverse),
            label = "duvay-skeleton-alpha",
        )
        animated
    }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(height.duvayDp)
            .clip(RoundedCornerShape(radius.duvayDp))
            .alpha(alpha)
            .background(MaterialTheme.colorScheme.surfaceContainerHigh)
            // Placeholder content is not information; the loading state is
            // announced by the container, not by every block in it.
            .clearAndSetSemantics { },
    )
}

data class DuVayBreadcrumbItem(val id: String, val title: String)

/** A trail of ancestor locations, the last of which is the current one. */
@Composable
fun DuVayBreadcrumbs(
    items: List<DuVayBreadcrumbItem>,
    modifier: Modifier = Modifier,
    onSelect: (DuVayBreadcrumbItem) -> Unit = {},
) {
    Row(
        modifier = modifier.semantics { contentDescription = "Breadcrumb" },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(DuVayTokens.space1.duvayDp),
    ) {
        items.forEachIndexed { index, item ->
            val isCurrent = index == items.lastIndex
            if (isCurrent) {
                // Where you already are is not a link, but it is still the
                // heading of the current location.
                Text(
                    text = item.title,
                    style = MaterialTheme.typography.labelLarge,
                    modifier = Modifier.semantics { heading() },
                )
            } else {
                TextButton(onClick = { onSelect(item) }) { Text(item.title) }
                Text(
                    text = "/",
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.clearAndSetSemantics { },
                )
            }
        }
    }
}

/**
 * A star rating.
 *
 * Collapsed into a single semantics node with a state description, so TalkBack
 * announces "3 of 5" rather than reading five separate stars.
 */
@Composable
fun DuVayRating(
    value: Int,
    modifier: Modifier = Modifier,
    count: Int = 5,
    onValueChange: ((Int) -> Unit)? = null,
) {
    Row(
        modifier = modifier.semantics {
            contentDescription = "Rating"
            stateDescription = "$value of $count"
        },
        horizontalArrangement = Arrangement.spacedBy(DuVayTokens.space1.duvayDp),
    ) {
        for (index in 1..count) {
            val filled = index <= value
            Icon(
                imageVector = Icons.Filled.Star,
                contentDescription = null,
                tint = if (filled) {
                    MaterialTheme.colorScheme.tertiary
                } else {
                    MaterialTheme.colorScheme.onSurfaceVariant
                },
                modifier = Modifier
                    .size(DuVayTokens.iconGlyphSm.duvayDp)
                    .then(
                        if (onValueChange != null) {
                            Modifier.clickable { onValueChange(index) }
                        } else {
                            Modifier
                        },
                    ),
            )
        }
    }
}

/** Page navigation for a paged collection. */
@Composable
fun DuVayPagination(
    page: Int,
    pageCount: Int,
    modifier: Modifier = Modifier,
    onPageChange: (Int) -> Unit = {},
) {
    Row(
        modifier = modifier.semantics { contentDescription = "Pagination" },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(DuVayTokens.space2.duvayDp),
    ) {
        IconButton(onClick = { onPageChange((page - 1).coerceAtLeast(1)) }, enabled = page > 1) {
            Icon(Icons.Filled.KeyboardArrowLeft, contentDescription = "Previous page")
        }
        Text("$page / ${pageCount.coerceAtLeast(1)}", style = MaterialTheme.typography.bodyMedium)
        IconButton(
            onClick = { onPageChange((page + 1).coerceAtMost(pageCount)) },
            enabled = page < pageCount,
        ) {
            Icon(Icons.Filled.KeyboardArrowRight, contentDescription = "Next page")
        }
    }
}

data class DuVayTabItem(val id: String, val title: String)

/**
 * A tab strip.
 *
 * Material's own [TabRow] carries the tab/tablist semantics TalkBack expects
 * and the indicator animation, so this selects and styles it rather than
 * drawing a row of buttons.
 */
@Composable
fun DuVayTabRow(
    items: List<DuVayTabItem>,
    selectedId: String,
    modifier: Modifier = Modifier,
    onSelect: (DuVayTabItem) -> Unit = {},
) {
    val selectedIndex = items.indexOfFirst { it.id == selectedId }.coerceAtLeast(0)
    TabRow(selectedTabIndex = selectedIndex, modifier = modifier) {
        items.forEachIndexed { index, item ->
            Tab(
                selected = index == selectedIndex,
                onClick = { onSelect(item) },
                text = { Text(item.title) },
            )
        }
    }
}

/**
 * A titled section that expands to reveal its content.
 *
 * The header is a single toggleable node, so TalkBack announces the collapsed
 * or expanded state on the control the user activates rather than leaving it
 * to be inferred from what appeared below.
 */
@Composable
fun DuVayExpansionPanel(
    title: String,
    expanded: Boolean,
    modifier: Modifier = Modifier,
    onExpandedChange: (Boolean) -> Unit = {},
    content: @Composable () -> Unit,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(DuVayTokens.radius.duvayDp))
            .background(MaterialTheme.colorScheme.surface),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .toggleable(
                    value = expanded,
                    role = Role.Button,
                    onValueChange = onExpandedChange,
                )
                .padding(DuVayTokens.space3.duvayDp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(title, style = MaterialTheme.typography.bodyLarge)
            Icon(
                imageVector = if (expanded) Icons.Filled.KeyboardArrowUp else Icons.Filled.KeyboardArrowDown,
                // The toggleable row already announces its state; labelling the
                // chevron too would say it twice.
                contentDescription = null,
            )
        }
        if (expanded) {
            Column(Modifier.padding(DuVayTokens.space3.duvayDp)) { content() }
        }
    }
}

/**
 * Transient content anchored to a control.
 *
 * Material's [Popup] owns the window placement, the outside-tap dismissal and
 * the focus handoff. `focusable = true` is what lets TalkBack move into the
 * content instead of leaving it stranded behind the anchor.
 */
@Composable
fun DuVayPopup(
    expanded: Boolean,
    modifier: Modifier = Modifier,
    onDismissRequest: () -> Unit = {},
    content: @Composable () -> Unit,
) {
    if (!expanded) return
    Popup(
        alignment = Alignment.BottomStart,
        onDismissRequest = onDismissRequest,
        properties = PopupProperties(focusable = true, dismissOnBackPress = true),
    ) {
        Column(
            modifier = modifier
                .clip(RoundedCornerShape(DuVayTokens.radius.duvayDp))
                .background(MaterialTheme.colorScheme.surfaceContainerHigh)
                .padding(DuVayTokens.space4.duvayDp),
        ) {
            content()
        }
    }
}

/** The bar at the top of a screen. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DuVayTopAppBar(
    title: String,
    modifier: Modifier = Modifier,
    navigationIcon: (@Composable () -> Unit)? = null,
    actions: @Composable RowScope.() -> Unit = {},
) {
    TopAppBar(
        title = { Text(title, modifier = Modifier.semantics { heading() }) },
        modifier = modifier,
        navigationIcon = { navigationIcon?.invoke() },
        actions = actions,
    )
}

/**
 * A row of actions.
 *
 * Grouped as one traversal node so TalkBack announces a toolbar and can move
 * past it, rather than treating each button as a sibling of the content.
 */
@Composable
fun DuVayToolbar(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.surfaceContainer)
            .padding(horizontal = DuVayTokens.space3.duvayDp)
            .semantics { contentDescription = "Toolbar" },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(DuVayTokens.space2.duvayDp),
        content = content,
    )
}

/**
 * A numeric field with increment and decrement controls.
 *
 * Clamping lives here rather than in the callback so the value cannot leave the
 * range through either the buttons or the keyboard.
 */
@Composable
fun DuVayNumberField(
    label: String,
    value: Double,
    modifier: Modifier = Modifier,
    range: ClosedFloatingPointRange<Double> = 0.0..100.0,
    step: Double = 1.0,
    onValueChange: (Double) -> Unit = {},
) {
    fun clamp(next: Double) = next.coerceIn(range.start, range.endInclusive)

    Row(
        modifier = modifier.semantics { stateDescription = value.toString() },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(DuVayTokens.space2.duvayDp),
    ) {
        Text(label, style = MaterialTheme.typography.bodyMedium)
        IconButton(
            onClick = { onValueChange(clamp(value - step)) },
            enabled = value > range.start,
        ) {
            Icon(Icons.Filled.KeyboardArrowDown, contentDescription = "Decrease $label")
        }
        Text(value.toString(), style = MaterialTheme.typography.bodyLarge)
        IconButton(
            onClick = { onValueChange(clamp(value + step)) },
            enabled = value < range.endInclusive,
        ) {
            Icon(Icons.Filled.KeyboardArrowUp, contentDescription = "Increase $label")
        }
    }
}

/**
 * A one-time-code field.
 *
 * One field, not N boxes: the autofill hint is what lets Android offer an SMS
 * code, and a row of single-character inputs would break it and give TalkBack
 * six unlabelled controls. The boxes are presentation over one value.
 */
@Composable
fun DuVayOTPField(
    code: String,
    modifier: Modifier = Modifier,
    length: Int = 6,
    onCodeChange: (String) -> Unit = {},
) {
    Box(modifier = modifier) {
        BasicTextField(
            value = code,
            onValueChange = { next -> onCodeChange(next.filter(Char::isDigit).take(length)) },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
            modifier = Modifier
                .fillMaxWidth()
                // androidx.compose.ui.autofill.ContentType is still internal in
                // this Compose version, so the SMS-OTP autofill hint cannot be
                // declared here yet; NumberPassword at least gets the right
                // keyboard and keeps the code off the suggestion strip.
                .semantics { contentDescription = "One-time code" },
            decorationBox = {
                Row(horizontalArrangement = Arrangement.spacedBy(DuVayTokens.space2.duvayDp)) {
                    for (index in 0 until length) {
                        Box(
                            modifier = Modifier
                                .size(DuVayTokens.touchMin.duvayDp)
                                .clip(RoundedCornerShape(DuVayTokens.radius.duvayDp))
                                .background(MaterialTheme.colorScheme.surfaceContainer),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(code.getOrNull(index)?.toString().orEmpty())
                        }
                    }
                }
            },
        )
    }
}

/**
 * A text field that filters a list of suggestions.
 *
 * Built on [ExposedDropdownMenuBox], which owns the anchoring and the combobox
 * semantics TalkBack expects.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DuVayAutocomplete(
    label: String,
    value: String,
    suggestions: List<String>,
    modifier: Modifier = Modifier,
    onValueChange: (String) -> Unit = {},
    onSelect: (String) -> Unit = {},
) {
    var expanded by remember { mutableStateOf(false) }
    val matches = remember(value, suggestions) {
        if (value.isEmpty()) emptyList() else suggestions.filter { it.contains(value, ignoreCase = true) }
    }

    ExposedDropdownMenuBox(
        expanded = expanded && matches.isNotEmpty(),
        onExpandedChange = { expanded = it },
        modifier = modifier,
    ) {
        DuVayTextField(
            label = label,
            value = value,
            onValueChange = {
                onValueChange(it)
                expanded = true
            },
            modifier = Modifier.menuAnchor(MenuAnchorType.PrimaryEditable),
        )
        ExposedDropdownMenu(expanded = expanded && matches.isNotEmpty(), onDismissRequest = { expanded = false }) {
            matches.forEach { match ->
                DropdownMenuItem(
                    text = { Text(match) },
                    onClick = {
                        onSelect(match)
                        expanded = false
                    },
                )
            }
        }
    }
}

/**
 * A control that opens the system document picker.
 *
 * `OpenDocument` is the Storage Access Framework contract, which is the only
 * route that yields a URI the app may actually read on modern Android.
 */
@Composable
fun DuVayFilePicker(
    label: String = "Choose file",
    modifier: Modifier = Modifier,
    mimeTypes: Array<String> = arrayOf("*/*"),
    onPick: (Uri?) -> Unit = {},
) {
    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.OpenDocument(),
        onResult = onPick,
    )
    DuVayButton(
        text = label,
        onClick = { launcher.launch(mimeTypes) },
        modifier = modifier,
        variant = DuVayButtonVariant.Outlined,
    )
}

/**
 * A sheet that rises from the bottom edge.
 *
 * Material's own [ModalBottomSheet] brings the drag handle, the scrim and the
 * back-press and accessibility dismissal actions.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DuVayModalBottomSheet(
    visible: Boolean,
    modifier: Modifier = Modifier,
    onDismissRequest: () -> Unit = {},
    content: @Composable ColumnScope.() -> Unit,
) {
    if (!visible) return
    ModalBottomSheet(
        onDismissRequest = onDismissRequest,
        modifier = modifier,
        sheetState = rememberModalBottomSheetState(),
        content = content,
    )
}

/**
 * The primary destinations of an app, along the bottom edge.
 *
 * Material's own [NavigationBar] carries the selection state, the badge slot
 * and the TalkBack semantics for a bottom bar.
 */
@Composable
fun DuVayNavigationBar(
    items: List<DuVayTabItem>,
    selectedId: String,
    modifier: Modifier = Modifier,
    onSelect: (DuVayTabItem) -> Unit = {},
) {
    NavigationBar(modifier = modifier) {
        items.forEach { item ->
            NavigationBarItem(
                selected = item.id == selectedId,
                onClick = { onSelect(item) },
                icon = { Icon(Icons.Filled.Star, contentDescription = null) },
                label = { Text(item.title) },
            )
        }
    }
}

/**
 * A slide-in list of destinations.
 *
 * [ModalNavigationDrawer] owns the scrim, the swipe gesture, the back-press
 * handling and the focus trap.
 */
@Composable
fun DuVayNavigationDrawer(
    items: List<DuVayTabItem>,
    selectedId: String,
    drawerState: DrawerState,
    modifier: Modifier = Modifier,
    onSelect: (DuVayTabItem) -> Unit = {},
    content: @Composable () -> Unit,
) {
    ModalNavigationDrawer(
        drawerState = drawerState,
        modifier = modifier,
        drawerContent = {
            ModalDrawerSheet {
                items.forEach { item ->
                    NavigationDrawerItem(
                        label = { Text(item.title) },
                        selected = item.id == selectedId,
                        onClick = { onSelect(item) },
                    )
                }
            }
        },
        content = content,
    )
}

data class DuVayStepItem(val id: String, val title: String)

/**
 * Progress through an ordered sequence of steps.
 *
 * One semantics node reporting "Step 2 of 4": position is the information a
 * TalkBack user needs, and four separate labels would not convey it.
 */
@Composable
fun DuVayStepper(
    steps: List<DuVayStepItem>,
    current: Int,
    modifier: Modifier = Modifier,
) {
    val safeCurrent = current.coerceIn(0, (steps.size - 1).coerceAtLeast(0))
    Row(
        modifier = modifier.fillMaxWidth().semantics {
            contentDescription = "Progress"
            stateDescription = "Step ${safeCurrent + 1} of ${steps.size}: ${steps.getOrNull(safeCurrent)?.title.orEmpty()}"
        },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(DuVayTokens.space2.duvayDp),
    ) {
        steps.forEachIndexed { index, step ->
            val reached = index <= safeCurrent
            Text(
                text = "${index + 1}",
                style = MaterialTheme.typography.labelSmall,
                color = if (reached) {
                    MaterialTheme.colorScheme.primary
                } else {
                    MaterialTheme.colorScheme.onSurfaceVariant
                },
            )
            Text(
                text = step.title,
                style = MaterialTheme.typography.bodySmall,
                color = if (index == safeCurrent) {
                    MaterialTheme.colorScheme.onSurface
                } else {
                    MaterialTheme.colorScheme.onSurfaceVariant
                },
            )
        }
    }
}

/**
 * A date field.
 *
 * Material's [DatePicker] brings the locale's calendar, the first day of the
 * week and the input-mode toggle.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DuVayDatePicker(
    state: DatePickerState,
    modifier: Modifier = Modifier,
) {
    DatePicker(state = state, modifier = modifier)
}

/** A time-of-day field. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DuVayTimePicker(
    state: TimePickerState,
    modifier: Modifier = Modifier,
) {
    TimePicker(state = state, modifier = modifier)
}

data class DuVayTableColumn<T>(val title: String, val value: (T) -> String)

/**
 * A data grid.
 *
 * Each cell carries its column name, so TalkBack announces "Name, Ada" rather
 * than a bare value with no header context.
 */
@Composable
fun <T> DuVayTable(
    rows: List<T>,
    columns: List<DuVayTableColumn<T>>,
    modifier: Modifier = Modifier,
) {
    Column(modifier = modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(DuVayTokens.space2.duvayDp),
            horizontalArrangement = Arrangement.spacedBy(DuVayTokens.space4.duvayDp),
        ) {
            columns.forEach { column ->
                Text(
                    text = column.title,
                    style = MaterialTheme.typography.labelSmall,
                    modifier = Modifier.weight(1f).semantics { heading() },
                )
            }
        }
        HorizontalDivider()
        rows.forEach { row ->
            Row(
                modifier = Modifier.fillMaxWidth().padding(DuVayTokens.space2.duvayDp),
                horizontalArrangement = Arrangement.spacedBy(DuVayTokens.space4.duvayDp),
            ) {
                columns.forEach { column ->
                    val cell = column.value(row)
                    Text(
                        text = cell,
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier
                            .weight(1f)
                            .semantics { contentDescription = "${column.title}, $cell" },
                    )
                }
            }
        }
    }
}
