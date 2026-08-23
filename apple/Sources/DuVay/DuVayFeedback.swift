// DuVay — Tier 1 feedback, overlays and lists
//
// Contracts: spec/components/w-{alert,alert-dialog,dialog,snackbar,tooltip,
// menu,progress-linear,progress-circular,list,list-item}.json
//
// Dialogs and menus route through SwiftUI's own presentation modifiers rather
// than a hand-built overlay: that is what gives a sheet its platform-correct
// dismiss gesture, a menu its native popover placement, and both their focus
// and VoiceOver behaviour for free.

import SwiftUI
import DuVayTokens

// MARK: - Alert

/// An inline, non-blocking message. Distinct from `DuVayAlertDialog`, which
/// interrupts.
public struct DuVayBanner<Content: View>: View {
    @DuVayPalette private var palette

    private let status: DuVayStatus
    private let title: String?
    private let onDismiss: (() -> Void)?
    private let content: Content

    public init(
        status: DuVayStatus = .info,
        title: String? = nil,
        onDismiss: (() -> Void)? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self.status = status
        self.title = title
        self.onDismiss = onDismiss
        self.content = content()
    }

    public var body: some View {
        HStack(alignment: .top, spacing: DuVayTokens.space3) {
            Image(systemName: icon)
                .font(.system(size: DuVayTokens.iconGlyphMd))
                .foregroundStyle(accent)
                .accessibilityHidden(true)

            VStack(alignment: .leading, spacing: DuVayTokens.space1) {
                if let title {
                    Text(title).font(.system(size: DuVayTokens.fontBase, weight: .semibold))
                }
                content.font(.system(size: DuVayTokens.fontBase))
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            if let onDismiss {
                DuVayIconButton("xmark", label: "Dismiss", size: .sm, action: onDismiss)
            }
        }
        .padding(DuVayTokens.space3)
        .foregroundStyle(palette.text)
        .background(background)
        .clipShape(RoundedRectangle(cornerRadius: DuVayTokens.radius, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: DuVayTokens.radius, style: .continuous)
                .strokeBorder(accent.opacity(0.4), lineWidth: 1)
        )
        // Errors interrupt; everything else is announced when convenient.
        .accessibilityElement(children: .combine)
        .accessibilityAddTraits(.isStaticText)
    }

    private var icon: String {
        switch status {
        case .neutral: return "info.circle.fill"
        case .info: return "info.circle.fill"
        case .success: return "checkmark.circle.fill"
        case .warning: return "exclamationmark.triangle.fill"
        case .error: return "xmark.octagon.fill"
        }
    }

    private var accent: Color {
        switch status {
        case .neutral: return palette.textSubtle
        case .info: return palette.accent
        case .success: return palette.success
        case .warning: return palette.warning
        case .error: return palette.error
        }
    }

    private var background: Color {
        switch status {
        case .neutral: return palette.surfaceContainer
        case .info: return palette.primaryContainer
        case .success: return palette.successContainer
        case .warning: return palette.warningContainer
        case .error: return palette.errorContainer
        }
    }
}

// MARK: - ProgressLinear

public struct DuVayProgressBar: View {
    @DuVayPalette private var palette
    @Environment(\.duvayTheme) private var theme
    @Environment(\.colorScheme) private var scheme

    private let value: Double?
    private let label: String?

    /// A nil value renders the indeterminate variant.
    public init(value: Double? = nil, label: String? = nil) {
        self.value = value
        self.label = label
    }

    public var body: some View {
        Group {
            if let value {
                ProgressView(value: value, total: 1)
            } else {
                ProgressView()
            }
        }
        .progressViewStyle(.linear)
        .tint(theme.accentBg(for: scheme))
        .modifier(ProgressLabel(label: label))
    }
}

// MARK: - ProgressCircular

public struct DuVayProgressRing: View {
    @Environment(\.duvayTheme) private var theme
    @Environment(\.colorScheme) private var scheme

    private let value: Double?
    private let label: String?

    public init(value: Double? = nil, label: String? = nil) {
        self.value = value
        self.label = label
    }

    public var body: some View {
        Group {
            if let value {
                ProgressView(value: value, total: 1)
            } else {
                ProgressView()
            }
        }
        .progressViewStyle(.circular)
        .tint(theme.accentBg(for: scheme))
        .modifier(ProgressLabel(label: label))
    }
}

/// An unlabelled progress indicator is decorative; a labelled one is a status.
private struct ProgressLabel: ViewModifier {
    let label: String?

    func body(content: Content) -> some View {
        if let label {
            content.accessibilityLabel(Text(label))
        } else {
            content.accessibilityHidden(true)
        }
    }
}

// MARK: - Tooltip

public extension View {
    /// Attach a tooltip.
    ///
    /// `.help` is the platform's own mechanism: a hover tooltip on macOS, and
    /// an accessibility hint on iOS where hover does not exist. Drawing a
    /// custom bubble would be wrong on both.
    func duvayTooltip(_ text: String) -> some View {
        help(Text(text))
    }
}

// MARK: - Dialog

public extension View {
    /// A modal sheet.
    ///
    /// iOS gets a sheet with its drag-to-dismiss gesture; macOS gets a proper
    /// window sheet. Both are the system presentation, not a z-index overlay.
    func duvayDialog<Content: View>(
        isPresented: Binding<Bool>,
        @ViewBuilder content: @escaping () -> Content
    ) -> some View {
        sheet(isPresented: isPresented) {
            DuVaySheet(content: content)
        }
    }

    /// A destructive or blocking confirmation.
    ///
    /// Routed through `.alert` so it inherits the platform's button ordering —
    /// which differs between iOS and macOS, and which users notice.
    func duvayAlertDialog(
        _ title: String,
        isPresented: Binding<Bool>,
        message: String? = nil,
        confirmLabel: String = "OK",
        role: ButtonRole? = nil,
        onConfirm: @escaping () -> Void
    ) -> some View {
        alert(title, isPresented: isPresented) {
            Button("Cancel", role: .cancel) {}
            Button(confirmLabel, role: role, action: onConfirm)
        } message: {
            if let message { Text(message) }
        }
    }
}

/// Shared padding and surface for sheet content.
public struct DuVaySheet<Content: View>: View {
    @DuVayPalette private var palette
    private let content: () -> Content

    public init(@ViewBuilder content: @escaping () -> Content) {
        self.content = content
    }

    public var body: some View {
        content()
            .padding(DuVayTokens.space5)
            .background(palette.surface)
    }
}

// MARK: - Snackbar

/// A transient message anchored to the bottom of a container.
///
/// Auto-dismiss is opt-in and never the only way out: a message that vanishes
/// on a timer is unusable for someone reading with a screen reader.
public struct DuVayToast: View {
    @DuVayPalette private var palette

    private let message: String
    private let actionLabel: String?
    private let action: (() -> Void)?

    public init(_ message: String, actionLabel: String? = nil, action: (() -> Void)? = nil) {
        self.message = message
        self.actionLabel = actionLabel
        self.action = action
    }

    public var body: some View {
        HStack(spacing: DuVayTokens.space3) {
            Text(message)
                .font(.system(size: DuVayTokens.fontBase))
                .foregroundStyle(palette.inverseOnSurface)
                .frame(maxWidth: .infinity, alignment: .leading)

            if let actionLabel, let action {
                Button(actionLabel, action: action)
                    .font(.system(size: DuVayTokens.fontBase, weight: .semibold))
                    .foregroundStyle(palette.inversePrimary)
                    .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, DuVayTokens.space4)
        .padding(.vertical, DuVayTokens.space3)
        .background(palette.inverseSurface)
        .clipShape(RoundedRectangle(cornerRadius: DuVayTokens.radius, style: .continuous))
        .shadow(color: palette.shadowColor, radius: 12, y: 4)
        .accessibilityElement(children: .combine)
    }
}

// MARK: - Menu

/// A contextual action menu.
// `Trigger` rather than `Label`: a generic named `Label` shadows SwiftUI's own
// `Label` view inside the body, where the menu items need it.
public struct DuVayMenu<Trigger: View>: View {
    private let label: Trigger
    private let items: [DuVayMenuItem]

    public init(items: [DuVayMenuItem], @ViewBuilder label: () -> Trigger) {
        self.items = items
        self.label = label()
    }

    public var body: some View {
        Menu {
            ForEach(items) { item in
                Button(role: item.destructive ? .destructive : nil, action: item.action) {
                    if let systemImage = item.systemImage {
                        Label(item.title, systemImage: systemImage)
                    } else {
                        Text(item.title)
                    }
                }
                .disabled(item.disabled)
            }
        } label: {
            label
        }
    }
}

public struct DuVayMenuItem: Identifiable {
    public let id = UUID()
    public let title: String
    public let systemImage: String?
    public let destructive: Bool
    public let disabled: Bool
    public let action: () -> Void

    public init(
        _ title: String,
        systemImage: String? = nil,
        destructive: Bool = false,
        disabled: Bool = false,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.systemImage = systemImage
        self.destructive = destructive
        self.disabled = disabled
        self.action = action
    }
}

// MARK: - List

/// A grouped list of rows.
public struct DuVayList<Content: View>: View {
    @DuVayPalette private var palette
    private let content: Content

    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    public var body: some View {
        VStack(spacing: 0) { content }
            .background(palette.surfaceContainer)
            .clipShape(RoundedRectangle(cornerRadius: DuVayTokens.radiusLg, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: DuVayTokens.radiusLg, style: .continuous)
                    .strokeBorder(palette.border, lineWidth: 1)
            )
    }
}

/// A single list row, optionally activating.
public struct DuVayListRow<Leading: View, Trailing: View>: View {
    @DuVayPalette private var palette

    private let title: String
    private let subtitle: String?
    private let action: (() -> Void)?
    private let leading: Leading
    private let trailing: Trailing

    public init(
        _ title: String,
        subtitle: String? = nil,
        action: (() -> Void)? = nil,
        @ViewBuilder leading: () -> Leading = { EmptyView() },
        @ViewBuilder trailing: () -> Trailing = { EmptyView() }
    ) {
        self.title = title
        self.subtitle = subtitle
        self.action = action
        self.leading = leading()
        self.trailing = trailing()
    }

    public var body: some View {
        let row = HStack(spacing: DuVayTokens.space3) {
            leading
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: DuVayTokens.fontBase))
                    .foregroundStyle(palette.text)
                if let subtitle {
                    Text(subtitle)
                        .font(.system(size: DuVayTokens.fontSm))
                        .foregroundStyle(palette.textSubtle)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            trailing
        }
        .padding(.horizontal, DuVayTokens.space4)
        .frame(minHeight: DuVayTokens.touchMin)
        .padding(.vertical, DuVayTokens.space2)

        if let action {
            Button(action: action) { row }
                .buttonStyle(.plain)
                .contentShape(Rectangle())
                .accessibilityElement(children: .combine)
                .accessibilityAddTraits(.isButton)
        } else {
            row.accessibilityElement(children: .combine)
        }
    }
}

// MARK: - AlertDialog

/// A blocking confirmation.
///
/// Named `DuVayAlert` because on Apple platforms "alert" means exactly this —
/// a modal that interrupts. The web framework's inline `w-alert` is
/// `DuVayBanner` here for the same reason; keeping the web's names would have
/// inverted both meanings for an Apple developer.
///
/// Presentation goes through `.alert`, so button ordering, escape handling and
/// VoiceOver focus all follow the platform rather than this library.
public struct DuVayAlert<Trigger: View>: View {
    @Binding private var isPresented: Bool
    private let title: String
    private let message: String?
    private let confirmLabel: String
    private let role: ButtonRole?
    private let onConfirm: () -> Void
    private let trigger: Trigger

    public init(
        _ title: String,
        isPresented: Binding<Bool>,
        message: String? = nil,
        confirmLabel: String = "OK",
        role: ButtonRole? = nil,
        onConfirm: @escaping () -> Void,
        @ViewBuilder trigger: () -> Trigger = { EmptyView() }
    ) {
        self.title = title
        self._isPresented = isPresented
        self.message = message
        self.confirmLabel = confirmLabel
        self.role = role
        self.onConfirm = onConfirm
        self.trigger = trigger()
    }

    public var body: some View {
        trigger.duvayAlertDialog(
            title,
            isPresented: $isPresented,
            message: message,
            confirmLabel: confirmLabel,
            role: role,
            onConfirm: onConfirm
        )
    }
}

// MARK: - Tooltip

/// A hover/long-press hint attached to a control.
///
/// The `.duvayTooltip(_:)` modifier is the ergonomic form; this wrapper exists
/// so the component is nameable and discoverable in the same way as the rest of
/// the library, and so the parity matrix can see it.
public struct DuVayTooltip<Content: View>: View {
    private let text: String
    private let content: Content

    public init(_ text: String, @ViewBuilder content: () -> Content) {
        self.text = text
        self.content = content()
    }

    public var body: some View {
        content.duvayTooltip(text)
    }
}
