//! DuVay — GTK snapshot suite (Linux)
//!
//! The plan requires a snapshot suite per platform before a tier may be
//! published as supported. This is the Linux one.
//!
//! A binary rather than a `#[test]`, because GTK must be initialised on the
//! main thread and libtest runs every test on a spawned one — on macOS that is
//! a hard assertion failure, not a warning. `cargo run --bin duvay-snapshot`
//! keeps GTK on the thread it demands.
//!
//! What is captured is the widget tree — type, CSS classes, accessible role and
//! label — rather than pixels. GTK's rasterisation depends on the theme, the
//! font stack and the GSK renderer in use, none of which are the library's
//! business; a pixel suite would report the machine rather than the widget.
//! The structural tree is exactly what DuVay controls, and it is what a
//! regression in this layer looks like: a lost CSS class, a dropped accessible
//! role, a control that stopped being an `AdwEntryRow`.
//!
//!     cargo run --features gtk --bin duvay-snapshot -- --check
//!     cargo run --features gtk --bin duvay-snapshot -- --record

#![cfg(feature = "gtk")]

use gtk4 as gtk;
use gtk::prelude::*;
use std::fmt::Write as _;
use std::path::{Path, PathBuf};

use duvay::widgets::{
    duvay_button, duvay_checkbox, duvay_init, duvay_switch, duvay_text_field, ButtonVariant,
};

/// One line per widget: indentation, type, CSS classes, accessible role.
fn describe(widget: &gtk::Widget, depth: usize, out: &mut String) {
    let mut classes = widget
        .css_classes()
        .iter()
        .map(|c| c.to_string())
        .collect::<Vec<_>>();
    // GTK's own ordering is not guaranteed stable between versions; the set is
    // what matters, so sort it and make the diff meaningful.
    classes.sort();

    let _ = writeln!(
        out,
        "{:indent$}{} [{}] role={:?}",
        "",
        widget.type_().name(),
        classes.join(" "),
        widget.accessible_role(),
        indent = depth * 2,
    );

    let mut child = widget.first_child();
    while let Some(node) = child {
        describe(&node, depth + 1, out);
        child = node.next_sibling();
    }
}

fn snapshot_of(widget: &impl IsA<gtk::Widget>) -> String {
    let mut out = String::new();
    describe(widget.as_ref(), 0, &mut out);
    out
}

fn store_dir() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/snapshots")
}

fn main() {
    let record = std::env::args().any(|a| a == "--record");

    if gtk::init().is_err() {
        // A display is required to instantiate widgets at all. Report it rather
        // than passing: a suite that could not run has not verified anything.
        eprintln!("duvay-snapshot: no display available — GTK could not initialise");
        std::process::exit(2);
    }
    duvay_init();

    let cases: Vec<(&str, String)> = vec![
        (
            "button-filled",
            snapshot_of(&duvay_button("Filled", ButtonVariant::Filled)),
        ),
        (
            "button-outlined",
            snapshot_of(&duvay_button("Outlined", ButtonVariant::Outlined)),
        ),
        ("checkbox", snapshot_of(&duvay_checkbox("Checkbox"))),
        ("switch", snapshot_of(&duvay_switch())),
        ("text-field", snapshot_of(&duvay_text_field("Label"))),
    ];

    let dir = store_dir();
    if record {
        std::fs::create_dir_all(&dir).expect("create snapshot directory");
        for (name, body) in &cases {
            std::fs::write(dir.join(format!("{name}.txt")), body).expect("write snapshot");
        }
        println!("✓ recorded {} GTK snapshots", cases.len());
        return;
    }

    let mut failures = 0;
    for (name, body) in &cases {
        let path = dir.join(format!("{name}.txt"));
        match std::fs::read_to_string(&path) {
            // A missing recording fails rather than silently passing: it would
            // otherwise go green on a machine that has never seen the widget.
            Err(_) => {
                eprintln!("✗ {name}: no recording — run with --record");
                failures += 1;
            }
            Ok(recorded) if recorded != *body => {
                eprintln!("✗ {name}: widget tree changed\n--- recorded\n{recorded}--- current\n{body}");
                failures += 1;
            }
            Ok(_) => println!("✓ {name}"),
        }
    }

    if failures > 0 {
        eprintln!("{failures} GTK snapshot(s) differ");
        std::process::exit(1);
    }
    println!("✓ {} GTK snapshots match", cases.len());
}
