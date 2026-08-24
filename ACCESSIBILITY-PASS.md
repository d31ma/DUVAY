# Manual accessibility pass — runbook and AI handoff

The last thing standing between `tier-2-code-complete` and a publishable status
on the four native platforms. `scripts/platform-parity.mjs` refuses a publishable
claim without a signed record, so this is also the only route to shipping.

---

## Can an AI do this instead of a person?

**It can do most of the work. It cannot sign the result, and it should not be
asked to.**

The distinction is not bureaucratic. It is about what is actually being checked.

**Machine-checkable, and already automated:** whether a control exposes a role, a
name and a state. That is what `bun run test:a11y` asserts on the web (axe, every
element, once per skin), what the four snapshot suites capture, and what an agent
can capture on any platform by dumping the accessibility tree. If this is all you
verify, you have verified nothing new — the gates already cover it.

**What the manual pass adds, and what no tree dump shows:**

- Whether the announcement is *comprehensible*. `"Rating, 3 of 5"` and
  `"star star star outline outline"` both have complete metadata. Only one is
  usable.
- **Order.** Does the reading order match the visual order, and does it still
  make sense when the skin changes chrome heights?
- **Focus after a transition.** When a dialog closes, where does focus land? A
  tree dump taken afterwards shows *a* focused node; only a person notices it is
  the wrong one.
- **Verbosity.** Whether a list of 40 rows announces its position, or drowns the
  user in repeated boilerplate.
- **The live-region judgement.** Whether a toast interrupts at the right moment,
  or stomps on what the user was reading.

An agent that drives VoiceOver and reports "all controls have accessible names"
has re-run the automated gate through a slower interface. Treating that as the
manual pass would put a signature on the one attestation in this repo that no
tool can produce — which is precisely what the gate was added to prevent.

**So: use an agent for the capture, and have a person read the capture and
sign.** That is a real reduction in effort — most of the time in a pass goes on
driving the harness, not on judging — and it keeps the signature honest.

---

## What the agent captures, per platform

The accessibility tree is the *input* a screen reader speaks from. Capturing it
is mechanical, diffable, and worth doing; it just is not the pass.

| Platform | Harness | Tree capture | Verified here |
|---|---|---|---|
| Android | `bun run android:gallery` | `adb shell uiautomator dump` | ✅ yes |
| iOS | `bun run ios:gallery` | XCUITest attributes, or Accessibility Inspector | ✗ not tried |
| macOS | `swift run Gallery` (`apple/Gallery`) | Accessibility Inspector, AXUIElement | ✗ not tried |
| Windows | `bun run windows:gate` builds; needs a desktop session | UIA via `inspect.exe` / Accessibility Insights | ✗ not tried |
| Linux | `cargo run --features gtk --bin duvay-snapshot` | AT-SPI2 via `pyatspi` / Accerciser | ✗ not tried |

Two findings from actually trying this on Android, so nobody repeats them:

- **`uiautomator dump` works** and yields `content-desc`, `text`, `class`,
  `checkable`/`checked`, `clickable`, `enabled`, `focusable`/`focused`,
  `scrollable`, `selected`, `password` and `bounds`. That is the full set a
  screen reader reads from, and `bounds` gives you reading order.
- **TalkBack does not log its utterances to logcat** at default verbosity. It is
  enabled with:

  ```
  adb shell settings put secure enabled_accessibility_services \
    com.google.android.marvin.talkback/com.google.android.marvin.talkback.TalkBackService
  adb shell settings put secure accessibility_enabled 1
  ```

  …and it runs, but `adb logcat` shows only lifecycle noise. **There is no
  speech transcript to scrape.** Any plan that assumed one needs rewriting.

The Windows row has a further constraint already documented in
`windows/DuVay.Snapshots`: the SSH gate runs with `UserInteractive: False`, so
Narrator cannot be driven from it at all. That platform needs someone at the
machine, or a remote desktop session.

---

## The contract being checked

Do not write a separate checklist — it would drift. Every component's contract is
already in `spec/components/<name>.json` under `accessibility`:

```json
{ "role": "button", "nameFrom": ["label", "text", "slotted content", "aria-label"],
  "keyboard": ["Enter", "Space"] }
```

25 Tier-1 components, 46 in total. `states` in the same file lists what each
control must distinguish: `default`, `hover`, `focus-visible`, `pressed`,
`disabled`, `loading`, `readonly`, `error`.

Beyond the per-component contract, the plan requires four whole-app checks per
release, none of which a tree dump can answer:

1. System accent changed **while the app is running** — does it repaint?
2. Light/dark switched while running — does it repaint?
3. RTL layout.
4. The screen-reader pass itself.

---

## Signing off

A publishable status needs a record in `spec/core-contract.json`, or
`platform-parity.mjs` fails:

```json
"verification": {
  "apple": {
    "method": "manual",
    "screenReader": "VoiceOver",
    "version": "macOS 26.5 / iOS 26.5",
    "verifiedBy": "<name>",
    "date": "2026-08-23",
    "note": "Free-text. Record what was wrong as well as what passed."
  }
}
```

`method` is required and the two values are not interchangeable. `automated`
takes `tool` and `command` instead of `screenReader`/`verifiedBy` — that is how
the web's axe gate is recorded, and it exists so an automated run can never be
filed as though a person had driven a screen reader.

Then move the platform's `status` to `tier-1-complete` or `tier-2-complete`, and
`bun run verify` will let it through.

---

## Handoff prompt

Paste this into a fresh agent session on a machine with the relevant toolchain.
It asks for capture and triage only — it does not ask the agent to conclude that
the platform passed.

> You are preparing evidence for a manual accessibility pass on the DuVay design
> system. A human will read what you produce and decide whether the platform
> passes; **you are not making that judgement, and you must not claim the pass
> was performed.**
>
> Target platform: **<apple | android | windows | linux>**
>
> 1. Read `CROSS-PLATFORM-PLAN.md` and `ACCESSIBILITY-PASS.md` for context, then
>    read every `spec/components/*.json` and collect the `accessibility` and
>    `states` blocks. That is the contract — do not invent a checklist.
> 2. Launch that platform's gallery harness (see the table in
>    `ACCESSIBILITY-PASS.md`). If it will not launch, stop and report why rather
>    than substituting a different surface.
> 3. Enable the platform's screen reader, then for each Tier-1 component capture
>    the accessibility tree: role, accessible name, value, state, and the
>    geometric order of the nodes.
> 4. Produce `a11y-capture-<platform>.md` containing, per component:
>    - the captured role / name / value / state
>    - the role and `nameFrom` the spec requires
>    - **MATCH** or **MISMATCH**, and for a mismatch the exact difference
>    - reading order as captured, flagged where it diverges from visual order
> 5. Separately list every question a tree dump cannot answer and that the human
>    must judge live — at minimum: focus placement after each overlay closes,
>    announcement verbosity on the longest list in the gallery, and whether the
>    toast live-region interrupts sensibly.
> 6. Report honestly what you could not capture and why. On Android in
>    particular, do not attempt to scrape TalkBack speech from logcat — it is not
>    logged; capture the tree with `uiautomator dump` instead.
>
> Do not edit `spec/core-contract.json`. Do not add a `verification` entry. Do
> not change any platform's `status`. Those are the human's to write once they
> have read your capture.
