// DuVay for Apple — Tier 2 components.
//
// Tier 2 is added one component at a time across all five platforms, so no
// platform races ahead of the others (CROSS-PLATFORM-PLAN.md, Phase 6+).
//
// Each of these wraps the SwiftUI primitive a native app would reach for, so
// press behaviour, focus order and VoiceOver come from the OS rather than from
// a redrawn control.

import SwiftUI
import UniformTypeIdentifiers
import DuVayTokens

// MARK: - EmptyState

/// A placeholder for a view with nothing in it: icon, headline, supporting
/// copy, and at most one action.
///
/// Modelled on `ContentUnavailableView`, which is the system's own answer to
/// this and carries the right accessibility semantics — but built directly so
/// the palette and the action styling stay DuVay's.
public struct DuVayEmptyState<Action: View>: View {
    @DuVayPalette private var palette

    private let title: String
    private let message: String?
    private let systemImage: String?
    private let action: Action

    public init(
        _ title: String,
        message: String? = nil,
        systemImage: String? = nil,
        @ViewBuilder action: () -> Action
    ) {
        self.title = title
        self.message = message
        self.systemImage = systemImage
        self.action = action()
    }

    public var body: some View {
        VStack(spacing: DuVayTokens.space3) {
            if let systemImage {
                Image(systemName: systemImage)
                    .font(.system(size: DuVayTokens.font2xl))
                    .foregroundStyle(palette.textSubtle)
                    // The headline already says it; repeating it as an image
                    // label would double every announcement.
                    .accessibilityHidden(true)
            }

            Text(title)
                .font(.system(size: DuVayTokens.fontLg, weight: .semibold))
                .foregroundStyle(palette.text)
                .multilineTextAlignment(.center)

            if let message {
                Text(message)
                    .font(.system(size: DuVayTokens.fontSm))
                    .foregroundStyle(palette.textSubtle)
                    .multilineTextAlignment(.center)
            }

            action
        }
        .padding(DuVayTokens.space6)
        .frame(maxWidth: .infinity)
    }
}

public extension DuVayEmptyState where Action == EmptyView {
    init(_ title: String, message: String? = nil, systemImage: String? = nil) {
        self.init(title, message: message, systemImage: systemImage) { EmptyView() }
    }
}

// MARK: - Skeleton

/// A loading placeholder.
///
/// The shimmer is suppressed under Reduce Motion, where a looping animation is
/// exactly what the setting exists to stop; the placeholder stays visible as a
/// static block so the layout still reads as pending.
public struct DuVaySkeleton: View {
    @DuVayPalette private var palette
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var shimmering = false

    private let width: CGFloat?
    private let height: CGFloat
    private let radius: CGFloat

    public init(width: CGFloat? = nil, height: CGFloat = 16, radius: CGFloat = DuVayTokens.radiusSm) {
        self.width = width
        self.height = height
        self.radius = radius
    }

    public var body: some View {
        RoundedRectangle(cornerRadius: radius, style: .continuous)
            .fill(palette.surfaceContainerHigh)
            .frame(width: width, height: height)
            .opacity(shimmering ? 0.55 : 1)
            .animation(
                reduceMotion ? nil : .easeInOut(duration: 1).repeatForever(autoreverses: true),
                value: shimmering
            )
            .onAppear { if !reduceMotion { shimmering = true } }
            // Placeholder content is not information; a screen reader should
            // hear the loading state from the container, not from each block.
            .accessibilityHidden(true)
    }
}

// MARK: - Breadcrumbs

public struct DuVayBreadcrumbItem: Identifiable, Hashable, Sendable {
    public let id: String
    public let title: String

    public init(id: String? = nil, title: String) {
        self.id = id ?? title
        self.title = title
    }
}

/// A trail of ancestor locations, the last of which is the current one.
public struct DuVayBreadcrumbs: View {
    @DuVayPalette private var palette

    private let items: [DuVayBreadcrumbItem]
    private let onSelect: (DuVayBreadcrumbItem) -> Void

    public init(_ items: [DuVayBreadcrumbItem], onSelect: @escaping (DuVayBreadcrumbItem) -> Void = { _ in }) {
        self.items = items
        self.onSelect = onSelect
    }

    public var body: some View {
        HStack(spacing: DuVayTokens.space2) {
            ForEach(Array(items.enumerated()), id: \.element.id) { index, item in
                let isCurrent = index == items.count - 1

                if isCurrent {
                    Text(item.title)
                        .font(.system(size: DuVayTokens.fontSm, weight: .semibold))
                        .foregroundStyle(palette.text)
                        // The trailing crumb is where you already are, so it is
                        // not a link — but it must still be announced as the
                        // current page rather than as plain text.
                        .accessibilityAddTraits(.isHeader)
                } else {
                    Button(item.title) { onSelect(item) }
                        .buttonStyle(.plain)
                        .font(.system(size: DuVayTokens.fontSm))
                        .foregroundStyle(palette.accent)

                    Text("/")
                        .font(.system(size: DuVayTokens.fontSm))
                        .foregroundStyle(palette.textSubtle)
                        .accessibilityHidden(true)
                }
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel("Breadcrumb")
    }
}

// MARK: - Rating

/// A star rating, readable or editable.
///
/// The whole control is one accessibility element with an adjustable value, so
/// VoiceOver users change it by swiping rather than by finding five separate
/// buttons — which is how the system's own rating controls behave.
public struct DuVayRating: View {
    @DuVayPalette private var palette

    @Binding private var value: Int
    private let count: Int
    private let editable: Bool

    public init(value: Binding<Int>, count: Int = 5, editable: Bool = true) {
        self._value = value
        self.count = count
        self.editable = editable
    }

    public init(value: Int, count: Int = 5) {
        self._value = .constant(value)
        self.count = count
        self.editable = false
    }

    public var body: some View {
        HStack(spacing: DuVayTokens.space1) {
            ForEach(1...max(count, 1), id: \.self) { index in
                Image(systemName: index <= value ? "star.fill" : "star")
                    .foregroundStyle(index <= value ? palette.warning : palette.textSubtle)
                    .onTapGesture { if editable { value = index } }
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Rating")
        .accessibilityValue("\(value) of \(count)")
        .accessibilityAdjustableAction { direction in
            guard editable else { return }
            switch direction {
            case .increment: value = min(value + 1, count)
            case .decrement: value = max(value - 1, 0)
            @unknown default: break
            }
        }
    }
}

// MARK: - Pagination

/// Page navigation for a paged collection.
public struct DuVayPagination: View {
    @DuVayPalette private var palette

    @Binding private var page: Int
    private let pageCount: Int

    public init(page: Binding<Int>, pageCount: Int) {
        self._page = page
        self.pageCount = pageCount
    }

    public var body: some View {
        HStack(spacing: DuVayTokens.space2) {
            Button {
                page = max(1, page - 1)
            } label: {
                Image(systemName: "chevron.left")
            }
            .buttonStyle(.plain)
            .disabled(page <= 1)
            .accessibilityLabel("Previous page")

            Text("\(page) / \(max(pageCount, 1))")
                .font(.system(size: DuVayTokens.fontSm))
                .foregroundStyle(palette.text)
                .monospacedDigit()

            Button {
                page = min(pageCount, page + 1)
            } label: {
                Image(systemName: "chevron.right")
            }
            .buttonStyle(.plain)
            .disabled(page >= pageCount)
            .accessibilityLabel("Next page")
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel("Pagination")
    }
}

// MARK: - Tabs

public struct DuVayTabItem<Value: Hashable>: Identifiable {
    public let id: Value
    public let title: String
    public let systemImage: String?

    public init(id: Value, title: String, systemImage: String? = nil) {
        self.id = id
        self.title = title
        self.systemImage = systemImage
    }
}

/// A tabbed container.
///
/// Wraps SwiftUI's own `TabView`, so the platform decides what a tab strip
/// looks like — a segmented row on iPhone, a sidebar on iPad and macOS — and
/// VoiceOver's tab-navigation rotor keeps working.
public struct DuVayTabView<Value: Hashable, Content: View>: View {
    @Binding private var selection: Value
    private let items: [DuVayTabItem<Value>]
    private let content: (Value) -> Content

    public init(
        selection: Binding<Value>,
        items: [DuVayTabItem<Value>],
        @ViewBuilder content: @escaping (Value) -> Content
    ) {
        self._selection = selection
        self.items = items
        self.content = content
    }

    public var body: some View {
        TabView(selection: $selection) {
            ForEach(items) { item in
                content(item.id)
                    .tabItem {
                        if let image = item.systemImage {
                            Label(item.title, systemImage: image)
                        } else {
                            Text(item.title)
                        }
                    }
                    .tag(item.id)
            }
        }
    }
}

// MARK: - ExpansionPanel

/// A titled section that expands to reveal its content.
///
/// SwiftUI's `DisclosureGroup` already carries the expanded/collapsed state in
/// the accessibility tree and animates under the system's motion settings, so
/// this styles it rather than rebuilding it.
public struct DuVayDisclosureGroup<Content: View>: View {
    @DuVayPalette private var palette
    @Binding private var isExpanded: Bool

    private let title: String
    private let content: Content

    public init(_ title: String, isExpanded: Binding<Bool>, @ViewBuilder content: () -> Content) {
        self.title = title
        self._isExpanded = isExpanded
        self.content = content()
    }

    public var body: some View {
        DisclosureGroup(isExpanded: $isExpanded) {
            content
                .padding(.top, DuVayTokens.space2)
        } label: {
            Text(title)
                .font(.system(size: DuVayTokens.fontBase, weight: .medium))
                .foregroundStyle(palette.text)
        }
        .padding(DuVayTokens.space3)
        .background(palette.surface)
        .clipShape(RoundedRectangle(cornerRadius: DuVayTokens.radius, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DuVayTokens.radius, style: .continuous)
                .strokeBorder(palette.outline, lineWidth: 1)
        )
    }
}

// MARK: - Popover

/// Transient content anchored to a control.
///
/// A modifier rather than a container: SwiftUI attaches popovers to the view
/// they belong to, and the system owns the arrow, the dismissal gesture and the
/// focus handoff. Wrapping it in a box of our own would break all three.
public struct DuVayPopover<PopoverContent: View>: ViewModifier {
    @Binding private var isPresented: Bool
    private let popoverContent: () -> PopoverContent

    public init(isPresented: Binding<Bool>, @ViewBuilder content: @escaping () -> PopoverContent) {
        self._isPresented = isPresented
        self.popoverContent = content
    }

    public func body(content: Content) -> some View {
        content.popover(isPresented: $isPresented) {
            popoverContent()
                .padding(DuVayTokens.space4)
        }
    }
}

public extension View {
    /// Present DuVay-styled popover content anchored to this view.
    func duvayPopover<PopoverContent: View>(
        isPresented: Binding<Bool>,
        @ViewBuilder content: @escaping () -> PopoverContent
    ) -> some View {
        modifier(DuVayPopover(isPresented: isPresented, content: content))
    }
}

// MARK: - AppBar

/// The bar at the top of a screen: title, and leading/trailing accessories.
///
/// A view rather than a `.toolbar` modifier, because DuVay's AppBar is a
/// component an application composes, not a navigation-stack decoration. It is
/// marked as a header so VoiceOver's landmark navigation finds it.
public struct DuVayNavigationBar<Leading: View, Trailing: View>: View {
    @DuVayPalette private var palette

    private let title: String
    private let leading: Leading
    private let trailing: Trailing

    public init(
        _ title: String,
        @ViewBuilder leading: () -> Leading,
        @ViewBuilder trailing: () -> Trailing
    ) {
        self.title = title
        self.leading = leading()
        self.trailing = trailing()
    }

    public var body: some View {
        HStack(spacing: DuVayTokens.space3) {
            leading
            Text(title)
                .font(.system(size: DuVayTokens.fontLg, weight: .semibold))
                .foregroundStyle(palette.text)
                .accessibilityAddTraits(.isHeader)
            Spacer(minLength: 0)
            trailing
        }
        .padding(.horizontal, DuVayTokens.space4)
        .frame(minHeight: DuVayTokens.touchMin)
        .background(palette.surface)
    }
}

public extension DuVayNavigationBar where Leading == EmptyView, Trailing == EmptyView {
    init(_ title: String) {
        self.init(title, leading: { EmptyView() }, trailing: { EmptyView() })
    }
}

// MARK: - Toolbar

/// A row of actions.
///
/// Grouped as one accessibility container so VoiceOver announces it as a
/// toolbar and can jump past it, rather than treating the buttons as loose
/// siblings of the content around them.
public struct DuVayToolbar<Content: View>: View {
    @DuVayPalette private var palette
    private let content: Content

    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    public var body: some View {
        HStack(spacing: DuVayTokens.space2) {
            content
        }
        .padding(.horizontal, DuVayTokens.space3)
        .frame(minHeight: DuVayTokens.touchMin)
        .background(palette.surfaceContainer)
        .accessibilityElement(children: .contain)
        .accessibilityLabel("Toolbar")
    }
}

// MARK: - NumberInput

/// A numeric field with increment and decrement controls.
///
/// The steppers are a `Stepper`, which is the system's own control for this and
/// already handles press-and-hold repeat and the VoiceOver increment gestures.
/// Clamping lives here so the value can never leave the range through either
/// route.
public struct DuVayStepperField: View {
    @DuVayPalette private var palette

    @Binding private var value: Double
    private let label: String
    private let range: ClosedRange<Double>
    private let step: Double

    public init(
        _ label: String,
        value: Binding<Double>,
        in range: ClosedRange<Double> = 0...100,
        step: Double = 1
    ) {
        self.label = label
        self._value = value
        self.range = range
        self.step = step
    }

    public var body: some View {
        Stepper(value: $value, in: range, step: step) {
            HStack {
                Text(label)
                    .font(.system(size: DuVayTokens.fontSm))
                    .foregroundStyle(palette.textSubtle)
                Spacer(minLength: DuVayTokens.space2)
                Text(value.formatted())
                    .font(.system(size: DuVayTokens.fontBase))
                    .foregroundStyle(palette.text)
                    .monospacedDigit()
            }
        }
        .accessibilityValue(value.formatted())
    }
}

// MARK: - OTP

/// A one-time-code field.
///
/// One text field, not N boxes. `.oneTimeCode` is what lets iOS offer the code
/// from Messages above the keyboard, and a row of single-character fields
/// breaks both that and VoiceOver, which would announce six unlabelled inputs.
/// The boxes below are presentation over a single value.
public struct DuVayOTPField: View {
    @DuVayPalette private var palette
    @FocusState private var focused: Bool

    @Binding private var code: String
    private let length: Int

    public init(code: Binding<String>, length: Int = 6) {
        self._code = code
        self.length = length
    }

    public var body: some View {
        ZStack {
            TextField("", text: $code)
                .textContentType(.oneTimeCode)
                #if os(iOS)
                .keyboardType(.numberPad)
                #endif
                .focused($focused)
                .opacity(0.02)
                .onChange(of: code) { _, next in
                    let digits = next.filter(\.isNumber)
                    code = String(digits.prefix(length))
                }

            HStack(spacing: DuVayTokens.space2) {
                ForEach(0..<length, id: \.self) { index in
                    let character = index < code.count
                        ? String(Array(code)[index])
                        : ""
                    Text(character)
                        .font(.system(size: DuVayTokens.fontLg, weight: .medium))
                        .frame(width: DuVayTokens.touchMin, height: DuVayTokens.touchMin)
                        .background(palette.surfaceContainer)
                        .clipShape(RoundedRectangle(cornerRadius: DuVayTokens.radius, style: .continuous))
                        .overlay(
                            RoundedRectangle(cornerRadius: DuVayTokens.radius, style: .continuous)
                                .strokeBorder(palette.outline, lineWidth: 1)
                        )
                }
            }
            .allowsHitTesting(false)
            // The boxes are a picture of the value; the field behind them is
            // the control.
            .accessibilityHidden(true)
        }
        .contentShape(Rectangle())
        .onTapGesture { focused = true }
        .accessibilityLabel("One-time code")
        .accessibilityValue(code.isEmpty ? "Empty" : code.map(String.init).joined(separator: " "))
    }
}

// MARK: - Autocomplete

/// A text field that filters a list of suggestions.
public struct DuVayAutocomplete: View {
    @DuVayPalette private var palette
    @FocusState private var focused: Bool

    @Binding private var text: String
    private let label: String
    private let suggestions: [String]
    private let onSelect: (String) -> Void

    public init(
        _ label: String,
        text: Binding<String>,
        suggestions: [String],
        onSelect: @escaping (String) -> Void = { _ in }
    ) {
        self.label = label
        self._text = text
        self.suggestions = suggestions
        self.onSelect = onSelect
    }

    private var matches: [String] {
        guard !text.isEmpty else { return [] }
        return suggestions.filter { $0.localizedCaseInsensitiveContains(text) }
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: DuVayTokens.space1) {
            DuVayTextField(label, text: $text)
                .focused($focused)

            if focused && !matches.isEmpty {
                VStack(alignment: .leading, spacing: 0) {
                    ForEach(matches, id: \.self) { match in
                        Button(match) {
                            text = match
                            onSelect(match)
                            focused = false
                        }
                        .buttonStyle(.plain)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(DuVayTokens.space2)
                    }
                }
                .background(palette.surfaceContainerHigh)
                .clipShape(RoundedRectangle(cornerRadius: DuVayTokens.radius, style: .continuous))
                // Announced as a list so VoiceOver reports how many matches
                // there are before the user starts moving through them.
                .accessibilityElement(children: .contain)
                .accessibilityLabel("\(matches.count) suggestions")
            }
        }
    }
}

// MARK: - FileInput

/// A control that opens the system file importer.
///
/// `.fileImporter` is the only route that works under the sandbox: it returns
/// security-scoped URLs the app is actually allowed to read.
public struct DuVayFileImporter: View {
    @State private var presenting = false

    private let label: String
    private let allowedContentTypes: [UTType]
    private let allowsMultiple: Bool
    private let onPick: ([URL]) -> Void

    public init(
        _ label: String = "Choose files",
        allowedContentTypes: [UTType] = [.item],
        allowsMultiple: Bool = false,
        onPick: @escaping ([URL]) -> Void
    ) {
        self.label = label
        self.allowedContentTypes = allowedContentTypes
        self.allowsMultiple = allowsMultiple
        self.onPick = onPick
    }

    public var body: some View {
        DuVayButton(variant: .outlined, action: { presenting = true }) { Text(label) }
            .fileImporter(
                isPresented: $presenting,
                allowedContentTypes: allowedContentTypes,
                allowsMultipleSelection: allowsMultiple
            ) { result in
                if case .success(let urls) = result { onPick(urls) }
            }
    }
}

// MARK: - BottomSheet

/// A sheet that rises from the bottom edge.
///
/// Presentation detents are what make this a bottom sheet rather than a full
/// modal, and they are the system's: the drag-to-resize behaviour, the grabber
/// and the VoiceOver dismissal action all come with them.
public struct DuVayBottomSheet<SheetContent: View>: ViewModifier {
    @Binding private var isPresented: Bool
    private let sheetContent: () -> SheetContent

    public init(isPresented: Binding<Bool>, @ViewBuilder content: @escaping () -> SheetContent) {
        self._isPresented = isPresented
        self.sheetContent = content
    }

    public func body(content: Content) -> some View {
        content.sheet(isPresented: $isPresented) {
            sheetContent()
                .padding(DuVayTokens.space4)
                #if os(iOS)
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
                #endif
        }
    }
}

public extension View {
    /// Present DuVay-styled bottom-sheet content.
    func duvayBottomSheet<SheetContent: View>(
        isPresented: Binding<Bool>,
        @ViewBuilder content: @escaping () -> SheetContent
    ) -> some View {
        modifier(DuVayBottomSheet(isPresented: isPresented, content: content))
    }
}

// MARK: - BottomNavigation

/// The primary destinations of an app, along the bottom edge.
///
/// A `TabView` in its default style: on iOS that *is* the bottom tab bar, and
/// using it means the selection state, the badge support and VoiceOver's tab
/// semantics come from the platform rather than from a row of buttons.
public struct DuVayTabBar<Value: Hashable, Content: View>: View {
    @Binding private var selection: Value
    private let items: [DuVayTabItem<Value>]
    private let content: (Value) -> Content

    public init(
        selection: Binding<Value>,
        items: [DuVayTabItem<Value>],
        @ViewBuilder content: @escaping (Value) -> Content
    ) {
        self._selection = selection
        self.items = items
        self.content = content
    }

    public var body: some View {
        TabView(selection: $selection) {
            ForEach(items) { item in
                content(item.id)
                    .tabItem { Label(item.title, systemImage: item.systemImage ?? "circle") }
                    .tag(item.id)
            }
        }
    }
}

// MARK: - NavigationDrawer

/// A persistent list of destinations beside the content.
///
/// `NavigationSplitView` is the platform's own adaptive answer: a sidebar on
/// macOS and iPad, a slide-over on iPhone. Rebuilding it would mean
/// reimplementing that adaptation and losing the system's focus handling.
public struct DuVaySidebar<Value: Hashable, Detail: View>: View {
    @Binding private var selection: Value?
    private let items: [DuVayTabItem<Value>]
    private let detail: (Value?) -> Detail

    public init(
        selection: Binding<Value?>,
        items: [DuVayTabItem<Value>],
        @ViewBuilder detail: @escaping (Value?) -> Detail
    ) {
        self._selection = selection
        self.items = items
        self.detail = detail
    }

    public var body: some View {
        NavigationSplitView {
            List(items, selection: $selection) { item in
                if let image = item.systemImage {
                    Label(item.title, systemImage: image).tag(item.id)
                } else {
                    Text(item.title).tag(item.id)
                }
            }
        } detail: {
            detail(selection)
        }
    }
}

// MARK: - Stepper (progress through steps)

public struct DuVayStepItem: Identifiable, Sendable {
    public let id: String
    public let title: String

    public init(id: String? = nil, title: String) {
        self.id = id ?? title
        self.title = title
    }
}

/// Progress through an ordered sequence of steps.
///
/// Named `DuVayStepper` to match the contract, and deliberately not SwiftUI's
/// `Stepper`, which is a numeric +/- control — that one is `DuVayStepperField`.
/// The whole strip is one accessibility element reporting "step 2 of 4", which
/// is the information a screen-reader user needs; announcing four separate
/// labels would not convey position.
public struct DuVayStepper: View {
    @DuVayPalette private var palette

    private let steps: [DuVayStepItem]
    private let current: Int

    public init(steps: [DuVayStepItem], current: Int) {
        self.steps = steps
        self.current = current
    }

    public var body: some View {
        HStack(spacing: DuVayTokens.space2) {
            ForEach(Array(steps.enumerated()), id: \.element.id) { index, step in
                let done = index < current
                let active = index == current

                Circle()
                    .fill(done || active ? palette.accentBg : palette.surfaceContainerHigh)
                    .frame(width: DuVayTokens.space6, height: DuVayTokens.space6)
                    .overlay(
                        Text("\(index + 1)")
                            .font(.system(size: DuVayTokens.fontXs, weight: .semibold))
                            .foregroundStyle(done || active ? palette.onAccent : palette.textSubtle)
                    )

                Text(step.title)
                    .font(.system(size: DuVayTokens.fontSm, weight: active ? .semibold : .regular))
                    .foregroundStyle(active ? palette.text : palette.textSubtle)

                if index < steps.count - 1 {
                    Rectangle()
                        .fill(palette.outline)
                        .frame(height: 1)
                        .frame(maxWidth: .infinity)
                }
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Progress")
        .accessibilityValue("Step \(min(current + 1, steps.count)) of \(steps.count): \(steps.indices.contains(current) ? steps[current].title : "")")
    }
}

// MARK: - DatePicker

/// A date field.
///
/// SwiftUI's `DatePicker` carries the locale's calendar, the first day of the
/// week and the VoiceOver rotor for each component. Reimplementing a calendar
/// grid would mean reimplementing all three.
public struct DuVayDatePicker: View {
    @Binding private var date: Date
    private let label: String
    private let range: ClosedRange<Date>?

    public init(_ label: String, date: Binding<Date>, in range: ClosedRange<Date>? = nil) {
        self.label = label
        self._date = date
        self.range = range
    }

    public var body: some View {
        Group {
            if let range {
                DatePicker(label, selection: $date, in: range, displayedComponents: .date)
            } else {
                DatePicker(label, selection: $date, displayedComponents: .date)
            }
        }
    }
}

// MARK: - TimePicker

/// A time-of-day field.
public struct DuVayTimePicker: View {
    @Binding private var date: Date
    private let label: String

    public init(_ label: String, date: Binding<Date>) {
        self.label = label
        self._date = date
    }

    public var body: some View {
        DatePicker(label, selection: $date, displayedComponents: .hourAndMinute)
    }
}

// MARK: - Table

public struct DuVayTableColumn<Row>: Identifiable {
    public let id: String
    public let title: String
    public let value: (Row) -> String

    public init(id: String? = nil, title: String, value: @escaping (Row) -> String) {
        self.id = id ?? title
        self.title = title
        self.value = value
    }
}

/// A data grid.
///
/// Built from a `Grid` rather than SwiftUI's `Table`, which is macOS- and
/// iPadOS-only: the contract requires this to work on iPhone too. Each cell
/// carries its column name so VoiceOver announces "Name, Ada" rather than a
/// bare value with no header context.
public struct DuVayTable<Row: Identifiable>: View {
    @DuVayPalette private var palette

    private let rows: [Row]
    private let columns: [DuVayTableColumn<Row>]

    public init(_ rows: [Row], columns: [DuVayTableColumn<Row>]) {
        self.rows = rows
        self.columns = columns
    }

    public var body: some View {
        Grid(alignment: .leading, horizontalSpacing: DuVayTokens.space4, verticalSpacing: DuVayTokens.space2) {
            GridRow {
                ForEach(columns) { column in
                    Text(column.title)
                        .font(.system(size: DuVayTokens.fontXs, weight: .semibold))
                        .foregroundStyle(palette.textSubtle)
                        .accessibilityAddTraits(.isHeader)
                }
            }
            Divider()
            ForEach(rows) { row in
                GridRow {
                    ForEach(columns) { column in
                        Text(column.value(row))
                            .font(.system(size: DuVayTokens.fontSm))
                            .foregroundStyle(palette.text)
                            .accessibilityLabel("\(column.title), \(column.value(row))")
                    }
                }
            }
        }
        .padding(DuVayTokens.space3)
    }
}
