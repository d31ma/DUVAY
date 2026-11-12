# Offline states

Status: approved 2026-11-11. Requested by Mesail (CADUCEUS ADR 0006,
request D1). Built in slices; this file is the spec every slice follows.

DuVay gives an app that keeps a copy of its data on the device four
ready-made pieces for the offline states:

| Piece | Web | Apple (SwiftUI) | Android (Compose) | Windows (WinUI 3) | Linux (GTK 4) |
| --- | --- | --- | --- | --- | --- |
| Sync status bar | `w-sync-status` | `DuVaySyncStatus` | `DuVaySyncStatus` | `DuVaySyncStatus` | `duvay_sync_status` |
| Send status of one item | `w-send-status` | `DuVaySendStatus` | `DuVaySendStatus` | `DuVaySendStatus` | `duvay_send_status` |
| Space used | `w-storage-meter` | `DuVayStorageMeter` | `DuVayStorageMeter` | `DuVayStorageMeter` | `duvay_storage_meter` |
| "Needs your attention" list | a pattern of existing parts | the same pattern | the same pattern | the same pattern | the same pattern |
| Shared text helpers | `WOfflineText` | `DuVayOfflineText` | `DuVayOfflineText` | `DuVayOfflineText` | `offline_text` |
| Shared announcer | `WLiveAnnouncer` | `DuVayAnnouncer` | `DuVayAnnouncer` | `DuVayAnnouncer` | `duvay_announce` |

Nothing that exists changes. No breaking change.

## 1. Rules for every piece

1. Every state shows an icon and words. No state is shown by colour alone.
2. Contrast: text 4.5:1, icons and the meter bar against its track 3:1, in
   light, dark and high contrast, on all six web skins (web, ios, android,
   macos, windows, linux) and on each native platform.
3. None of the pieces takes keyboard focus. Buttons the app puts in them
   keep their normal tab order, and their touch targets stay 44 by 44 px on
   touch screens.
4. Every visible text has an English default and can be replaced, so an app
   can translate it. Placeholders are `{time}` and `{count}` (and `{current}`
   and `{total}` in the queue text). Every text with a count also has plural
   forms (see "Plural forms" below). An empty state text leaves the state
   words out.
5. Times follow the user's language and its 12 or 24 hour habit; an app can
   choose with `hour-cycle` (`h11`, `h12`, `h23`, `h24`). The language is the
   closest `lang` (on the element or a parent), then the page's `lang`.
   Layout mirrors for right-to-left languages.
6. With reduced motion, nothing spins: a still icon replaces the spinner.
7. Announcements are polite, never interrupting. Nothing announces on
   first display. A burst of changes makes one announcement, not many.
8. Size on the web: each element stays under 3 KB minified and gzipped.

## 2. Shared helpers (slice S0)

### Text decisions (`WOfflineText`)
The decisions are the same on every platform and are checked by the vectors
in `spec/fixtures/offline.json`. Each platform turns them into words with its
own date and number formatter.

- `timeStyle(date, now)` gives:
  - `clock`: the same calendar day ("08:12"),
  - `weekday`: 1 to 6 calendar days before ("Mon 08:12"),
  - `date`: any other day of the same year ("3 Nov at 08:12"); a future day
    counts here too,
  - `date-year`: another year ("3 Nov 2025 at 08:12"),
  - `none`: no valid time (show nothing).
  Days are counted by local calendar day, not by 24-hour periods.
- `byteParts(count)` gives `{ value, unit, fractionDigits }`: decimal units
  (1 kB = 1000 bytes), kilobyte at least (`kilobyte`, `megabyte`,
  `gigabyte`, `terabyte`), one decimal below 10 and none from 10. A negative
  count counts as 0. Shown as "0 kB", "1.5 kB", "312 MB", "1.2 GB".
- `fill(template, values)` replaces `{name}` with the value; unknown names
  stay as they are.
- `textNames(name, category)` gives the attribute names to look up for a
  count text, in order: `<name>-text-<category>`, `<name>-text-other`,
  `<name>-text`. The first one set wins, else the built-in default.
- `queueParts(sent, pending)` gives `{ current: sent + 1, total: sent +
  pending }` while something waits ("3 of 4"), else nothing.
- `hourCycle(value)` keeps `h11`, `h12`, `h23` or `h24`, and gives "" (the
  locale's habit) for anything else.
- Web only: `time(iso, locale, now?, hourCycle?)`, `bytes(count, locale)`,
  `number(count, locale)`, `countText(element, name, count, fallback)`,
  `pluralAttributes(names)`, `locale(element)` (the closest `lang`, then the
  page's `lang`, then `en`). Hours are shown with two digits.

### Plural forms
Each text with `{count}` (or a total) can have one attribute per plural
category of the user's language: `<name>-text-zero`, `-one`, `-two`, `-few`,
`-many`, `-other`. The category comes from `Intl.PluralRules` for the
element's language (native platforms use their own plural rules). The lookup
order is `textNames()` above, so an app may set only `-one` and `-other`, or
only the plain `<name>-text` as before. The English defaults have no plural
forms, so nothing changes for an app that sets none. Example: `attention-
text-one="{count} item needs your attention"` and `attention-text-other=
"{count} items need your attention"`.

### Announcer (`WLiveAnnouncer`)
One shared, visually hidden polite message line per page
(`<div id="w-live-announcer" role="status" aria-live="polite"
aria-atomic="true" class="w-sr-only">`), added on first use.

- `announce(key, text, delayMs = 0)`: says `text` once after `delayMs`;
  later calls with the same key inside that time replace the text.
- `tally(key, template, delayMs = 1000)`: counts calls with the same key
  inside the time, then says the template with `{count}` once. `template`
  may also be a function that takes the count and returns the template, for
  plural forms.
- `cancel(key)`: drops a waiting message.
- The time window starts at the first call and is never made longer, so a
  steady stream of changes still speaks once per window. Messages of several
  keys that are due together are joined into one announcement. Saying the
  same text again is announced again.

Native platforms build the same rules on their own announcement API (see
section 6).

## 3. Sync status (`w-sync-status`, slice S1)

Shows whether the app is online and how fresh the device copy is, for
example "Offline · updated 08:12 · 3 waiting to send".

Attributes:

| Attribute | Values | Default | Meaning |
| --- | --- | --- | --- |
| `state` | `online`, `syncing`, `offline`, `locked`, `sending`, `sent` | `online` | The connection and copy state |
| `updated-at` | ISO 8601 time | none | Last successful sync |
| `pending` | whole number | `0` | Items waiting to send (with `sending`: the item being sent counts as waiting) |
| `attention` | whole number | `0` | Items that need the user |
| `sent` | whole number | `0` | Items sent in this round: "3 of 4" with `sending`, "4 sent" with `sent` |
| `progress` | 0 to 1 | none | A thin line along the bottom of the bar while `syncing` or `sending` |
| `sent-timeout` | milliseconds | `4000` | How long the `sent` summary stays; `0` keeps it |
| `hour-cycle` | `h11`, `h12`, `h23`, `h24` | the locale's habit | 12 or 24 hours for `{time}` |
| `variant` | `bar`, `chip` | `bar` | Full-width bar, or a small pill for headers |
| `sticky` | boolean | off | Pins the bar to the top of its scroll container |
| `show-online` | boolean | off | Also shows the bar when online with nothing waiting |
| `icon`, `icon-set` | icon name; `false` hides it | built-in icon | Replaces the icon |
| `offline-text` | text | `Offline` | |
| `syncing-text` | text | `Updating…` | |
| `sending-text` | text | `Sending…` | |
| `online-text` | text | `Up to date` | Also the words of `sent` |
| `locked-text` | text | `Locked. Sign in to open the copy on this device.` | |
| `updated-text` | text with `{time}` | `updated {time}` | Left out when `updated-at` is empty |
| `syncing-updated-text` | text with `{time}` | the `updated-text` | The time text while `syncing`, for example `Getting changes since {time}` |
| `pending-text` | text with `{count}` | `{count} waiting to send` | Left out when `pending` is 0, and while `sending` |
| `attention-text` | text with `{count}` | `Needs your attention: {count}` | Left out when `attention` is 0 |
| `queue-text` | text with `{current}`, `{total}` | `{current} of {total}` | While `sending`; the plural form follows `{total}`; left out when `pending` is 0 |
| `sent-text` | text with `{count}` | `{count} sent` | In `sent` with no attention; left out when `sent` is 0 |
| `others-sent-text` | text with `{count}` | `{count} others sent` | In `sent` when `attention` is above 0 |
| `offline-announce-text` | text with `{time}` | the `offline-text` | Announced when the state turns `offline` |
| `locked-announce-text` | text with `{time}` | the `locked-text` | Announced when the state turns `locked` |
| `sent-announce-text` | text with `{count}` | `Up to date. {count} sent.` | Announced when the state turns `sent` with `sent` above 0 |
| `back-online-text` | text | `Back online` | Announced when the state leaves `offline` or `locked` for `online`, `syncing` or `sending` |

Every count text (`pending`, `attention`, `queue`, `sent`, `others-sent`,
`sent-announce`) also takes the plural forms `<name>-text-zero` to
`<name>-text-other` (section 2, "Plural forms"). An announce text with
`{time}` falls back to the state words when `updated-at` is empty.

Slots: `actions` (the app's buttons, for example "Sign in" or "Show"),
`prepend` (a custom icon).

Events: none. The app's own buttons carry the actions. The bar itself is
never a button and has no link mode: an app that opens a sync panel from
the bar puts a "Details" button in `actions` (the docs page shows it). On a
narrow screen one button stays on the line of the text, and the text wraps
beside it; wider actions move under the text.

The order of the parts: state words, the time, the queue ("3 of 4", only
while `sending`), the waiting count (not while `sending`), the attention
count, the sent count (only in `sent`).

A round of sending, as an app sets it:
1. `state="sending" sent="0" pending="4"`: "Sending… · 1 of 4".
2. after each item: `sent` up by one, `pending` down by one: "Sending… · 3 of
   4".
3. `state="sent" sent="4" pending="0"`: "Up to date · 4 sent", announced
   once as "Up to date. 4 sent.", hidden after `sent-timeout`. With
   `show-online` it then shows "Up to date". With `attention` above 0 it
   shows "Up to date · Needs your attention: 1 · 3 others sent" and stays
   until `attention` is 0. The next round starts with another state.

What the user sees:
- `offline`: a cloud-off icon on the neutral surface.
- `syncing`: a small spinner; a still icon with reduced motion. With
  `progress`, a 2 px line in the primary colour along the bottom; it moves
  only without reduced motion.
- `sending`: a small spinner (a still arrow icon with reduced motion), then
  "3 of 4". With `progress`, the same line as `syncing`.
- `locked`: a lock icon on the warning container colour.
- `online`: hidden while `pending` and `attention` are 0, unless
  `show-online` is set; then a check icon and "Up to date".
- `sent`: a check icon, "Up to date · 4 sent", for `sent-timeout`, then as
  `online`.

What a screen reader hears:
- The visible text is not a live region, so updates to the time and the
  counts are never announced.
- The element owns one hidden `role="status"` line. It speaks only when
  `state` changes: "Offline" (or `offline-announce-text`), "Back online",
  the locked text (or `locked-announce-text`), "Up to date. 4 sent." (once,
  when the state turns `sent`). Changes within 2 seconds collapse into the
  last one, so a network that goes on and off five times in 2 seconds makes
  one announcement, or none if it ends where it started. `syncing` and
  `sending` themselves are not announced, and neither are the queue
  progress, the counts, the time or the end of the `sent` summary.
- Never `role="alert"`.

## 4. Send status (`w-send-status`, slice S2)

Shows the state of one message or list row that was written on the device.

| Attribute | Values | Default | Meaning |
| --- | --- | --- | --- |
| `state` | empty, `waiting`, `sending`, `failed`, `sent` | empty | Empty shows nothing |
| `reason` | text | none | Shown after the failed text |
| `written-at` | ISO 8601 time | none | With `sent`, shows "Written offline at {time}"; `sent` without it shows nothing |
| `announce` | `on`, `off` | `on` | `off` stops the failure announcement |
| `icon`, `icon-set` | icon name; `false` hides it | built-in icon | |
| `waiting-text` | text | `Waiting to send` | |
| `sending-text` | text | `Sending…` | |
| `failed-text` | text | `Not sent` | |
| `written-text` | text with `{time}` | `Written offline at {time}` | |
| `failed-announce-text` | text with `{count}` | `{count} not sent. Needs your attention.` | Also `failed-announce-text-zero` to `-other` (plural forms) |
| `hour-cycle` | `h11`, `h12`, `h23`, `h24` | the locale's habit | 12 or 24 hours for the written time |

Slots: `actions` (for example Edit, Retry, Send by email, Discard).

The name is "waiting", not "queued": Mesail already uses "Queued" for its
server's mail queue.

What the user sees: a small inline line. `waiting`: a clock icon, muted
text. `sending`: a spinner (a still icon with reduced motion). `failed`: an
error icon and error-coloured text, a "·" separator, then the reason. When
the reason does not fit, it moves to the next line and the separator stays
at the end of the failed text, so no line starts with "·". `sent` with
`written-at`: a muted note.

What a screen reader hears: the text is read with its row; it is not a live
region. A change to `failed` is counted through the shared announcer (key
`w-send-status`, 1 second): 20 rows failing at once make one announcement,
"20 not sent. Needs your attention." `waiting`, `sending` and `sent` are
never announced (an app's message list announces new messages itself).
A row first shown already failed is not announced.

## 5. Space used (`w-storage-meter`, slice S3)

| Attribute | Values | Default | Meaning |
| --- | --- | --- | --- |
| `value` | bytes | `0` | Space used |
| `max` | bytes | `0` | The budget; 0 shows the value without a bar fill |
| `label` | text | `Space used on this device` | Visible label and accessible name |
| `warn-at` | 0 to 1 | `0.8` | From this share: warning colour and the warn text |
| `full-at` | 0 to 1 | `0.95` | From this share: error colour and the full text |
| `value-text` | text with `{used}`, `{max}` | `{used} of {max} used` | |
| `warn-text` | text | `Almost full` | |
| `full-text` | text | `Full` | |

What the user sees: the label, a bar (DuVay's linear progress style), and
"312 MB of 1 GB used". A value above `max` fills the bar and counts as full.
For several domains, show one meter per domain row.

`w-storage-meter` has no count texts: `{used}` and `{max}` are byte sizes,
and `Intl.NumberFormat` writes their units in the right form.

What a screen reader hears: `role="meter"` with `aria-valuemin`,
`aria-valuemax`, `aria-valuenow` and `aria-valuetext` ("312 MB of 1 GB used,
almost full"). It is not live and not focusable.

## 6. "Needs your attention" list (pattern, slice S2)

No new element. Built from existing parts:

- `w-list` with an `aria-label` ("Needs your attention").
- One `w-list-item item-role="none" wrap no-prepend-space` per refused
  item: `title` = the first words of the item, `subtitle` = where it
  belongs (for example the conversation), and in the default or `append`
  content a `w-send-status state="failed" reason="…"` plus the action
  buttons. `wrap` shows the whole title on more lines instead of cutting
  it; `no-prepend-space` lets the text start at the row padding, because
  these rows have no icon.
- Each button's name says what it acts on: the visible word ("Retry") plus
  `aria-describedby` pointing to the item's title.
- When the list is empty: `w-empty-state` with the title "Nothing needs your
  attention". The title is a real heading element (`<h2>` by default; set
  `heading-level` to fit the page).

The docs page shows a working example, and a test covers it. A gap found in
`w-list-item` is fixed in the same slice, without a change to its Core
contract.

## 7. Native platforms (slices N1 to N4)

Each platform builds the three pieces, the shared helpers and the list
pattern with the same names, states, defaults and texts as the web, in the
platform's own style. Native pieces take the same inputs as typed
parameters (for example `state: DuVaySyncState`, `updatedAt: Date?`,
`pending: Int`), plus the text overrides.

| | Apple | Android | Windows | Linux |
| --- | --- | --- | --- | --- |
| Source files | `apple/Sources/DuVayCore/DuVayOfflineText.swift`, `apple/Sources/DuVay/DuVayOffline.swift` | `android/duvay-core/.../DuVayOfflineText.kt`, `android/duvay-compose/.../DuVayOffline.kt` | `windows/DuVay.Core/DuVayOfflineText.cs`, `windows/DuVay/DuVayOffline.cs` | `linux/src/offline_text.rs`, `linux/src/offline.rs` (GTK part behind `gtk`) |
| Announce | `AccessibilityNotification.Announcement(text).post()` | one `liveRegion = LiveRegionMode.Polite` text in a `DuVayAnnouncerHost` | `AutomationPeer.RaiseNotificationEvent(…, MostRecent, text, activityId)`; the activity id is the key | `gtk::Accessible::announce(text, AccessibleAnnouncementPriority::Medium)` |
| Meter | `Gauge` or `ProgressView` with `accessibilityValue` | `LinearProgressIndicator` with `progressBarRangeInfo` and `stateDescription` | `ProgressBar` with automation name and value text | `gtk::LevelBar` (accessible role meter) |
| Time words | `Date.FormatStyle` | `java.time` `DateTimeFormatter.ofLocalizedTime` | `DateTime.ToString` with the culture | the decision from `offline_text`; words from GLib `DateTime.format` |

Exact file names follow each platform folder's existing layout (see
`CROSS-PLATFORM-PLAN.md`). The conformance suites gain an `offline` suite
that asserts `spec/fixtures/offline.json`. The snapshot suites gain cases
for every state of each piece, in light and dark.

These are the first DuVay pieces with announcement code on native
platforms. The screen-reader pass (VoiceOver, TalkBack, Narrator, Orca) is
done by a person and recorded in `spec/core-contract.json`
`verification.<platform>` as `ACCESSIBILITY-PASS.md` describes.

## 8. Core contract (last slice)

The three pieces go into `spec/core-contract.json` only after the web and
all four native slices are merged: a contract entry makes `bun run verify`
require the piece on every platform. The last slice adds the three entries,
runs `bun run spec:build` and `bun run parity:emit`, and checks
`bun run verify`.

## 9. Out of scope

- Screens that belong to the app: the edit-conflict screen, the sign-out
  warning with waiting items, the one-time "not sent" notice after access is
  lost, "Not on this device". Apps build them from `w-dialog`,
  `w-empty-state` and the pieces above.
- A meter split into one coloured part per domain.
- Relative times that change on their own ("5 minutes ago").
