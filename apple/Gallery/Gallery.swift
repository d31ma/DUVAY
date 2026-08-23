// DuVay gallery — internal harness, not a shipped app.
//
// Renders every Tier-1 component so they can be looked at on a simulator and
// captured for snapshot tests. See CROSS-PLATFORM-PLAN.md: gallery apps are
// explicitly out of scope as products.

import SwiftUI
import DuVay
import DuVayTokens

@main
struct GalleryApp: App {
    var body: some Scene {
        WindowGroup {
            // Brand accent rather than the system one, so the gallery shows
            // DuVay's own palette instead of the simulator's tint.
            GalleryView().duvayAccent(.brand)
        }
    }
}

struct GalleryView: View {
    @DuVayPalette private var palette

    @State private var checked = true
    @State private var switched = true
    @State private var text = ""
    @State private var slider = 40.0
    @State private var choice = "a"
    @State private var pick = "one"

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DuVayTokens.space4) {
                Text("DuVay — Tier 1").font(.title2.bold())

                section("Buttons") {
                    HStack(spacing: DuVayTokens.space2) {
                        DuVayButton("Filled", action: {})
                        DuVayButton("Tonal", variant: .tonal, action: {})
                        DuVayButton("Outlined", variant: .outlined, action: {})
                    }
                }

                section("Icon, badge, chip, avatar") {
                    HStack(spacing: DuVayTokens.space3) {
                        DuVayIconButton("gearshape", label: "Settings", action: {})
                        DuVayIcon("bell")
                        DuVayBadge("7", status: .error)
                        DuVayChip("Chip", selected: true, onTap: {})
                        DuVayAvatar(name: "Ada Lovelace")
                    }
                }

                DuVayDivider()

                section("Selection") {
                    DuVayCheckbox("Checkbox", isOn: $checked)
                    DuVayToggle("Switch", isOn: $switched)
                    DuVayRadioGroup("Radio group", selection: $choice, options: [
                        (value: "a", label: "Option A"),
                        (value: "b", label: "Option B"),
                    ])
                }

                section("Slider") {
                    DuVaySlider("Volume", value: $slider)
                }

                section("Fields") {
                    DuVayTextField("Label", text: $text, placeholder: "Type here")
                    DuVayPicker("Picker", selection: $pick, options: [
                        (value: "one", label: "One"),
                        (value: "two", label: "Two"),
                    ])
                }

                section("Progress") {
                    DuVayProgressBar(value: 0.6, label: "Loading")
                    DuVayProgressRing(value: 0.6, label: "Loading")
                }

                section("Card and list") {
                    DuVayCard { Text("Card surface") }
                    DuVayList {
                        DuVayListRow("List item", subtitle: "Supporting text")
                        DuVayDivider()
                        DuVayListRow("Another row")
                    }
                }

                section("Feedback") {
                    DuVayBanner(status: .success, title: "Saved") { Text("Your changes are saved.") }
                    DuVayToast("A transient message.", actionLabel: "Undo") {}
                }

                Text("space1_5=\(Int(DuVayTokens.space1_5))  space15=\(Int(DuVayTokens.space15))  touch=\(Int(DuVayTokens.touchMin))")
                    .font(.caption)
                    .foregroundStyle(palette.textSubtle)
            }
            .padding(DuVayTokens.space4)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .defaultScrollAnchor(ProcessInfo.processInfo.environment["DUVAY_ANCHOR_BOTTOM"] != nil ? .bottom : .top)
        .background(palette.surface)
    }

    @ViewBuilder
    private func section<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: DuVayTokens.space2) {
            Text(title).font(.caption.weight(.semibold)).foregroundStyle(palette.textSubtle)
            content()
        }
    }
}
