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
