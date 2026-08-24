//! DuVay — Tier 1 widgets (GTK4 / libadwaita).
//!
//! Contracts: `spec/components/*.json`.
//!
//! Gated behind the `gtk` feature so the crate's tokens and behaviour still
//! build and test on a machine with no GTK development stack.
//!
//! These construct real GTK widgets and attach DuVay's style classes rather
//! than drawing anything. GNOME's own theming, input handling and Orca
//! semantics come from the widget; DuVay contributes naming, the token
//! stylesheet, and the accessibility defaults the contract requires.
//!
//! The accent is a system value here, not ours: libadwaita exposes the user's
//! choice through `AdwStyleManager:accent-color`, and `duvay_init` opts into it
//! rather than hard-coding DuVay's teal. Never assume the accent is blue.

// The crate is published as `libadwaita`; `adw` is the conventional alias and
// matches the C library's namespace.
use libadwaita as adw;
use adw::prelude::*;
use gtk4 as gtk;
use gtk::prelude::*;

/// Load DuVay's generated stylesheet and adopt the system colour scheme.
///
/// Call once after `adw::init`. `tokens.css` is generated from `tokens/**` by
/// `bun run tokens:native`, so the GTK palette cannot drift from the web one.
pub fn duvay_init() {
    let provider = gtk::CssProvider::new();
    provider.load_from_string(include_str!("../resources/tokens.css"));
    if let Some(display) = gtk::gdk::Display::default() {
        gtk::style_context_add_provider_for_display(
            &display,
            &provider,
            gtk::STYLE_PROVIDER_PRIORITY_APPLICATION,
        );
    }
}

/// Which visual treatment a button takes.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ButtonVariant {
    Filled,
    Tonal,
    Outlined,
    Text,
    Destructive,
}

impl ButtonVariant {
    /// libadwaita ships these style classes; using them is what makes the
    /// button look native rather than approximately native.
    fn css_class(self) -> Option<&'static str> {
        match self {
            ButtonVariant::Filled => Some("suggested-action"),
            ButtonVariant::Destructive => Some("destructive-action"),
            ButtonVariant::Tonal => Some("pill"),
            ButtonVariant::Outlined => Some("outline"),
            ButtonVariant::Text => Some("flat"),
        }
    }
}

/// A labelled button.
pub fn duvay_button(label: &str, variant: ButtonVariant) -> gtk::Button {
    let button = gtk::Button::with_label(label);
    if let Some(class) = variant.css_class() {
        button.add_css_class(class);
    }
    button.add_css_class("duvay-button");
    button
}

/// An icon-only button.
///
/// `label` is required, not optional: the control carries no text, so without
/// it Orca announces nothing at all.
pub fn duvay_icon_button(icon_name: &str, label: &str) -> gtk::Button {
    let button = gtk::Button::from_icon_name(icon_name);
    button.set_tooltip_text(Some(label));
    button.update_property(&[gtk::accessible::Property::Label(label)]);
    button.add_css_class("flat");
    button
}

/// A standalone icon. Decorative unless given a label.
pub fn duvay_icon(icon_name: &str, label: Option<&str>) -> gtk::Image {
    let image = gtk::Image::from_icon_name(icon_name);
    match label {
        Some(text) => image.update_property(&[gtk::accessible::Property::Label(text)]),
        // Presentation role keeps a decorative glyph out of the a11y tree.
        None => image.set_accessible_role(gtk::AccessibleRole::Presentation),
    }
    image
}

/// A horizontal or vertical rule.
pub fn duvay_separator(orientation: gtk::Orientation) -> gtk::Separator {
    let separator = gtk::Separator::new(orientation);
    separator.set_accessible_role(gtk::AccessibleRole::Presentation);
    separator
}

/// A surface container.
pub fn duvay_card() -> gtk::Box {
    let container = gtk::Box::new(gtk::Orientation::Vertical, crate::tokens::dimension::SPACE_3 as i32);
    container.add_css_class("card");
    container.add_css_class("duvay-card");
    container.set_margin_top(crate::tokens::dimension::SPACE_4 as i32);
    container
}

/// A compact, rounded label. Interactive only when given a handler.
pub fn duvay_chip(label: &str) -> gtk::Label {
    let chip = gtk::Label::new(Some(label));
    chip.add_css_class("duvay-chip");
    chip.add_css_class("pill");
    chip
}

/// A small count or status marker.
pub fn duvay_badge(text: &str) -> gtk::Label {
    let badge = gtk::Label::new(Some(text));
    badge.add_css_class("duvay-badge");
    badge.add_css_class("numeric");
    badge
}

/// A circular identity marker. Initials come from [`crate::values::initials`]
/// so every platform derives them the same way.
pub fn duvay_avatar(name: Option<&str>, size: i32) -> adw::Avatar {
    let initials = crate::values::initials(name);
    let avatar = adw::Avatar::new(size, Some(&initials), true);
    if let Some(text) = name {
        // AdwAvatar reaches Accessible through GtkWidget, so upcast first.
        avatar
            .upcast_ref::<gtk::Widget>()
            .update_property(&[gtk::accessible::Property::Label(text)]);
    }
    avatar
}

/// A labelled checkbox.
pub fn duvay_checkbox(label: &str) -> gtk::CheckButton {
    gtk::CheckButton::with_label(label)
}

/// A boolean toggle.
pub fn duvay_switch() -> gtk::Switch {
    gtk::Switch::new()
}

/// A group of mutually exclusive options.
///
/// Returns the container; GTK models radio behaviour by grouping
/// `CheckButton`s rather than with a dedicated widget.
pub fn duvay_radio_group(label: &str, options: &[&str]) -> gtk::Box {
    let container = gtk::Box::new(gtk::Orientation::Vertical, 0);
    container.update_property(&[gtk::accessible::Property::Label(label)]);
    container.set_accessible_role(gtk::AccessibleRole::RadioGroup);

    let mut first: Option<gtk::CheckButton> = None;
    for option in options {
        let button = gtk::CheckButton::with_label(option);
        match &first {
            Some(group) => button.set_group(Some(group)),
            None => first = Some(button.clone()),
        }
        container.append(&button);
    }
    container
}

/// A continuous value selector.
pub fn duvay_slider(min: f64, max: f64, step: f64) -> gtk::Scale {
    gtk::Scale::with_range(gtk::Orientation::Horizontal, min, max, step)
}

/// A single-line text field.
pub fn duvay_text_field(label: &str) -> adw::EntryRow {
    let row = adw::EntryRow::builder().title(label).build();
    row
}

/// A multi-line text field.
pub fn duvay_text_area() -> gtk::TextView {
    let view = gtk::TextView::new();
    view.set_wrap_mode(gtk::WrapMode::WordChar);
    view.add_css_class("duvay-textarea");
    view
}

/// A single-choice picker.
pub fn duvay_combo_row(label: &str, options: &[&str]) -> adw::ComboRow {
    let model = gtk::StringList::new(options);
    adw::ComboRow::builder().title(label).model(&model).build()
}

/// A scrollable list container.
pub fn duvay_list_box() -> gtk::ListBox {
    let list = gtk::ListBox::new();
    list.add_css_class("boxed-list");
    list.set_selection_mode(gtk::SelectionMode::None);
    list
}

/// A single activatable row.
pub fn duvay_action_row(title: &str, subtitle: Option<&str>) -> adw::ActionRow {
    let builder = adw::ActionRow::builder().title(title);
    match subtitle {
        Some(text) => builder.subtitle(text).build(),
        None => builder.build(),
    }
}

/// A determinate or indeterminate progress bar.
pub fn duvay_progress_bar(fraction: Option<f64>) -> gtk::ProgressBar {
    let bar = gtk::ProgressBar::new();
    match fraction {
        Some(value) => bar.set_fraction(value),
        None => bar.pulse(),
    }
    bar
}

/// A spinner, GTK's circular progress indicator.
pub fn duvay_spinner() -> gtk::Spinner {
    let spinner = gtk::Spinner::new();
    spinner.start();
    spinner
}

/// An inline, non-blocking message.
pub fn duvay_banner(text: &str) -> adw::Banner {
    adw::Banner::new(text)
}

/// A transient message. libadwaita's toast overlay owns dismissal timing.
pub fn duvay_toast(text: &str) -> adw::Toast {
    adw::Toast::new(text)
}

/// A modal window for arbitrary content.
pub fn duvay_dialog(title: &str) -> adw::Dialog {
    let dialog = adw::Dialog::new();
    dialog.set_title(title);
    dialog
}

/// A confirm / cancel dialog.
pub fn duvay_alert_dialog(heading: &str, body: &str) -> adw::AlertDialog {
    let dialog = adw::AlertDialog::new(Some(heading), Some(body));
    dialog.add_response("cancel", "Cancel");
    dialog.add_response("confirm", "OK");
    dialog.set_default_response(Some("confirm"));
    dialog.set_close_response("cancel");
    dialog
}

/// Attach a hover/focus hint to any widget.
pub fn duvay_tooltip(widget: &impl IsA<gtk::Widget>, text: &str) {
    widget.as_ref().set_tooltip_text(Some(text));
}

/// A contextual action menu.
pub fn duvay_popover_menu(items: &[(&str, &str)]) -> gtk::PopoverMenu {
    let menu = gtk::gio::Menu::new();
    for (label, action) in items {
        menu.append(Some(label), Some(action));
    }
    gtk::PopoverMenu::from_model(Some(&menu))
}

/* ── Tier 2 ───────────────────────────────────────────────────────────────
 *
 * Tier 2 is added one component at a time across all five platforms, so no
 * platform races ahead of the others (CROSS-PLATFORM-PLAN.md, Phase 6+).
 *
 * Where libadwaita already has the pattern — AdwStatusPage is GNOME's own empty
 * state — DuVay wraps it rather than redrawing it, so the widget keeps GNOME's
 * spacing, focus behaviour and Orca semantics.
 */

/// An empty state: GNOME's own `AdwStatusPage`, styled by DuVay's tokens.
pub fn duvay_status_page(title: &str, description: Option<&str>) -> adw::StatusPage {
    let page = adw::StatusPage::new();
    page.set_title(title);
    if let Some(text) = description {
        page.set_description(Some(text));
    }
    page.add_css_class("duvay-status-page");
    page
}

/// A loading placeholder.
///
/// No animation: GTK has no reduce-motion signal that a widget can read
/// portably, and a looping shimmer that cannot be turned off is worse than a
/// static block. The `duvay-skeleton` class is the hook if an application wants
/// to add one under its own control.
pub fn duvay_skeleton(width: i32, height: i32) -> gtk::Box {
    let block = gtk::Box::new(gtk::Orientation::Horizontal, 0);
    block.set_size_request(width, height);
    block.add_css_class("duvay-skeleton");
    // Placeholder content is not information; the loading state belongs to the
    // container, so Orca should skip the block entirely.
    block.set_accessible_role(gtk::AccessibleRole::Presentation);
    block
}

/// A trail of ancestor locations, the last of which is the current one.
///
/// The trailing crumb is a label rather than a button: it is where you already
/// are, so making it activatable would offer a no-op to keyboard users.
pub fn duvay_breadcrumbs(items: &[&str]) -> gtk::Box {
    let row = gtk::Box::new(gtk::Orientation::Horizontal, 4);
    row.add_css_class("duvay-breadcrumbs");
    row.update_property(&[gtk::accessible::Property::Label("Breadcrumb")]);

    let last = items.len().saturating_sub(1);
    for (index, item) in items.iter().enumerate() {
        if index == last {
            let current = gtk::Label::new(Some(item));
            current.add_css_class("duvay-breadcrumb-current");
            row.append(&current);
        } else {
            let link = gtk::Button::with_label(item);
            link.add_css_class("flat");
            link.add_css_class("duvay-breadcrumb");
            row.append(&link);

            let separator = gtk::Label::new(Some("/"));
            separator.add_css_class("dim-label");
            separator.set_accessible_role(gtk::AccessibleRole::Presentation);
            row.append(&separator);
        }
    }
    row
}

/// A star rating.
///
/// Exposed as one widget with a value rather than as N buttons, so Orca
/// announces the rating instead of reading five stars.
pub fn duvay_rating(value: u32, count: u32) -> gtk::Box {
    let row = gtk::Box::new(gtk::Orientation::Horizontal, 2);
    row.add_css_class("duvay-rating");
    row.update_property(&[
        gtk::accessible::Property::Label("Rating"),
        gtk::accessible::Property::ValueNow(f64::from(value)),
        gtk::accessible::Property::ValueMin(0.0),
        gtk::accessible::Property::ValueMax(f64::from(count)),
    ]);

    for index in 1..=count.max(1) {
        let star = gtk::Image::from_icon_name(if index <= value {
            "starred-symbolic"
        } else {
            "non-starred-symbolic"
        });
        star.set_accessible_role(gtk::AccessibleRole::Presentation);
        row.append(&star);
    }
    row
}

/// Page navigation for a paged collection.
pub fn duvay_pagination(page: u32, page_count: u32) -> gtk::Box {
    let row = gtk::Box::new(gtk::Orientation::Horizontal, 6);
    row.add_css_class("duvay-pagination");
    row.update_property(&[gtk::accessible::Property::Label("Pagination")]);

    let previous = gtk::Button::from_icon_name("go-previous-symbolic");
    previous.add_css_class("flat");
    previous.set_sensitive(page > 1);
    previous.update_property(&[gtk::accessible::Property::Label("Previous page")]);
    row.append(&previous);

    let label = gtk::Label::new(Some(&format!("{page} / {}", page_count.max(1))));
    label.add_css_class("numeric");
    row.append(&label);

    let next = gtk::Button::from_icon_name("go-next-symbolic");
    next.add_css_class("flat");
    next.set_sensitive(page < page_count);
    next.update_property(&[gtk::accessible::Property::Label("Next page")]);
    row.append(&next);

    row
}

/// A tab strip backed by `AdwViewSwitcher`.
///
/// GNOME's own switcher adapts between a wide title-bar strip and a narrow
/// bottom bar, and carries the tablist semantics Orca expects. The caller owns
/// the `AdwViewStack`, because the pages are the application's, not ours.
pub fn duvay_view_switcher(stack: &adw::ViewStack) -> adw::ViewSwitcher {
    let switcher = adw::ViewSwitcher::new();
    switcher.set_stack(Some(stack));
    switcher.set_policy(adw::ViewSwitcherPolicy::Wide);
    switcher.add_css_class("duvay-view-switcher");
    switcher
}

/// A titled row that expands to reveal its children.
///
/// `AdwExpanderRow` already exposes the expanded state to Orca and animates
/// under GNOME's own motion settings, so this styles it rather than rebuilding
/// the disclosure behaviour.
pub fn duvay_expander_row(title: &str, subtitle: Option<&str>) -> adw::ExpanderRow {
    let row = adw::ExpanderRow::new();
    row.set_title(title);
    if let Some(text) = subtitle {
        row.set_subtitle(text);
    }
    row.add_css_class("duvay-expander-row");
    row
}

/// Transient content anchored to a widget.
///
/// GTK owns the placement, the outside-click dismissal and the focus handoff;
/// the caller attaches it with `set_parent` on the anchor it belongs to.
pub fn duvay_popover(child: &impl IsA<gtk::Widget>) -> gtk::Popover {
    let popover = gtk::Popover::new();
    popover.set_child(Some(child));
    popover.set_autohide(true);
    popover.add_css_class("duvay-popover");
    popover
}

/// The bar at the top of a window.
///
/// `AdwHeaderBar` is what a GNOME application uses, so window controls, the
/// title and the adaptive behaviour all come from the platform.
pub fn duvay_header_bar(title: &str) -> adw::HeaderBar {
    let bar = adw::HeaderBar::new();
    let title_widget = adw::WindowTitle::new(title, "");
    bar.set_title_widget(Some(&title_widget));
    bar.add_css_class("duvay-header-bar");
    bar
}

/// A row of actions.
///
/// Given the toolbar role explicitly: a `GtkBox` is a generic container, and
/// without this Orca would announce the buttons as loose siblings of the
/// content rather than as a group it can skip.
pub fn duvay_toolbar() -> gtk::Box {
    let bar = gtk::Box::new(gtk::Orientation::Horizontal, 6);
    bar.add_css_class("toolbar");
    bar.add_css_class("duvay-toolbar");
    bar.set_accessible_role(gtk::AccessibleRole::Toolbar);
    bar.update_property(&[gtk::accessible::Property::Label("Toolbar")]);
    bar
}

/// A numeric row with increment and decrement controls.
///
/// `AdwSpinRow` is GNOME's own answer, so the repeat-on-hold behaviour, the
/// numeric keypad handling and the Orca spinbutton semantics come from the
/// platform. The adjustment carries the range, so the value cannot leave it
/// through either the buttons or the keyboard.
pub fn duvay_spin_row(title: &str, min: f64, max: f64, step: f64) -> adw::SpinRow {
    let adjustment = gtk::Adjustment::new(min, min, max, step, step, 0.0);
    let row = adw::SpinRow::new(Some(&adjustment), step, 0);
    row.set_title(title);
    row.add_css_class("duvay-spin-row");
    row
}

/// A one-time-code field.
///
/// One entry, not N boxes. A row of single-character fields would give Orca
/// six unlabelled inputs and break the platform's own paste handling; the
/// `duvay-otp` class is the hook for drawing the boxes in CSS over one value.
pub fn duvay_otp_field(length: u32) -> adw::EntryRow {
    let row = adw::EntryRow::new();
    row.set_title("One-time code");
    row.set_input_purpose(gtk::InputPurpose::Digits);
    row.set_max_width_chars(length as i32);
    row.add_css_class("duvay-otp");
    row.add_css_class("numeric");
    row
}

/// A text field that filters a list of suggestions.
///
/// GTK4 dropped `GtkEntryCompletion` and `AdwEntryRow` has no completion of its
/// own, so the suggestion model is returned alongside the row rather than
/// stashed on it with `set_data` — the caller replaces its contents as the
/// query changes, and the type stays checked.
pub fn duvay_autocomplete(title: &str, suggestions: &[&str]) -> (adw::EntryRow, gtk::StringList) {
    let row = adw::EntryRow::new();
    row.set_title(title);
    row.add_css_class("duvay-autocomplete");
    (row, gtk::StringList::new(suggestions))
}

/// A control that opens the system file chooser.
///
/// `GtkFileDialog` is the portal-backed API, which is what returns a readable
/// file under Flatpak; the older `GtkFileChooserDialog` does not.
pub fn duvay_file_chooser(title: &str) -> gtk::FileDialog {
    let dialog = gtk::FileDialog::new();
    dialog.set_title(title);
    dialog.set_modal(true);
    dialog
}

/// A sheet that rises from the bottom edge.
///
/// A dialog rather than a hand-rolled overlay: `AdwDialog` presents as a bottom
/// sheet on narrow windows and brings the drag handle, the Escape handling and
/// the focus trap with it.
pub fn duvay_bottom_sheet(title: &str, child: &impl IsA<gtk::Widget>) -> adw::Dialog {
    let dialog = adw::Dialog::new();
    dialog.set_title(title);
    dialog.set_child(Some(child));
    dialog.set_presentation_mode(adw::DialogPresentationMode::BottomSheet);
    dialog.add_css_class("duvay-bottom-sheet");
    dialog
}

/// The primary destinations of an app, along the bottom edge.
///
/// `AdwViewSwitcherBar` is the narrow-window half of GNOME's switcher pattern,
/// and it pairs with the same `AdwViewStack` a wide `duvay_view_switcher` uses,
/// so an application can show either without duplicating its pages.
pub fn duvay_view_switcher_bar(stack: &adw::ViewStack) -> adw::ViewSwitcherBar {
    let bar = adw::ViewSwitcherBar::new();
    bar.set_stack(Some(stack));
    bar.add_css_class("duvay-view-switcher-bar");
    bar
}

/// A persistent list of destinations beside the content.
///
/// `AdwNavigationSplitView` collapses to a single pane on narrow windows by
/// itself, which is the behaviour that would otherwise have to be rebuilt —
/// along with its focus handling and back gesture.
pub fn duvay_navigation_split_view(
    sidebar: &impl IsA<gtk::Widget>,
    content: &impl IsA<gtk::Widget>,
) -> adw::NavigationSplitView {
    let view = adw::NavigationSplitView::new();
    view.set_sidebar(Some(&adw::NavigationPage::new(sidebar, "Navigation")));
    view.set_content(Some(&adw::NavigationPage::new(content, "Content")));
    view.add_css_class("duvay-navigation-split-view");
    view
}

/// Progress through an ordered sequence of steps.
///
/// Exposed as a single progress element reporting "Step 2 of 4": position is
/// what an Orca user needs, and a row of labels would not convey it.
pub fn duvay_stepper(steps: &[&str], current: u32) -> gtk::Box {
    let row = gtk::Box::new(gtk::Orientation::Horizontal, 8);
    row.add_css_class("duvay-stepper");
    row.set_accessible_role(gtk::AccessibleRole::ProgressBar);

    let total = steps.len() as u32;
    let safe = current.min(total.saturating_sub(1));
    row.update_property(&[
        gtk::accessible::Property::Label("Progress"),
        gtk::accessible::Property::ValueNow(f64::from(safe + 1)),
        gtk::accessible::Property::ValueMin(1.0),
        gtk::accessible::Property::ValueMax(f64::from(total.max(1))),
        gtk::accessible::Property::ValueText(&format!(
            "Step {} of {}: {}",
            safe + 1,
            total,
            steps.get(safe as usize).copied().unwrap_or_default()
        )),
    ]);

    for (index, step) in steps.iter().enumerate() {
        let label = gtk::Label::new(Some(&format!("{}. {step}", index + 1)));
        if index as u32 == safe {
            label.add_css_class("heading");
        } else {
            label.add_css_class("dim-label");
        }
        // The strip announces itself as a whole, so the individual labels stay
        // out of the accessibility tree.
        label.set_accessible_role(gtk::AccessibleRole::Presentation);
        row.append(&label);
    }
    row
}

/// A date field.
///
/// `GtkCalendar` carries the locale's first day of the week and month names, so
/// the grid is never rebuilt by hand.
pub fn duvay_date_picker() -> gtk::Calendar {
    let calendar = gtk::Calendar::new();
    calendar.add_css_class("duvay-date-picker");
    calendar
}

/// A time-of-day field.
///
/// Two spin buttons rather than a drawn clock face: they are keyboard-operable
/// and Orca reads them as spin buttons with values, which a custom clock would
/// not be without a full accessible implementation.
pub fn duvay_time_picker() -> gtk::Box {
    let row = gtk::Box::new(gtk::Orientation::Horizontal, 4);
    row.add_css_class("duvay-time-picker");
    row.update_property(&[gtk::accessible::Property::Label("Time")]);

    let hours = gtk::SpinButton::with_range(0.0, 23.0, 1.0);
    hours.set_wrap(true);
    hours.update_property(&[gtk::accessible::Property::Label("Hour")]);

    let separator = gtk::Label::new(Some(":"));
    separator.set_accessible_role(gtk::AccessibleRole::Presentation);

    let minutes = gtk::SpinButton::with_range(0.0, 59.0, 1.0);
    minutes.set_wrap(true);
    minutes.update_property(&[gtk::accessible::Property::Label("Minute")]);

    row.append(&hours);
    row.append(&separator);
    row.append(&minutes);
    row
}

/// A data grid.
///
/// `GtkColumnView` is the GTK4 list widget: it recycles rows, so a large table
/// stays responsive, and it exposes real column semantics to Orca. The caller
/// supplies the model and the column factories, because the cell content is the
/// application's.
pub fn duvay_column_view(model: &impl IsA<gtk::SelectionModel>) -> gtk::ColumnView {
    let view = gtk::ColumnView::new(Some(model.clone().upcast()));
    view.set_show_row_separators(true);
    view.set_show_column_separators(false);
    view.add_css_class("duvay-column-view");
    view
}
