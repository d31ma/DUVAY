//! DuVay — design system for GTK4 / libadwaita.
//!
//! `tokens` is generated from `tokens/**/*.json` by `bun run tokens:native`;
//! `calendar`, `values` and `mask` are native reimplementations of the shared
//! behaviour, validated against `spec/fixtures/*.json`.

pub mod tokens;
pub mod calendar;
pub mod values;
pub mod mask;

/// GTK4 / libadwaita widgets. Gated so tokens and behaviour still build on a
/// machine without a GTK development stack.
#[cfg(feature = "gtk")]
pub mod widgets;
