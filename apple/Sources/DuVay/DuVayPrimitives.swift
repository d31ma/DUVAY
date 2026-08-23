// DuVay — Tier 1 primitives
//
// Contracts: spec/components/w-{icon,divider,badge,avatar,chip,card}.json
//
// These are the components the plan calls "binding and theming, not invention":
// each maps onto an existing native construct, so the work is wiring DuVay's
// tokens and accessibility contract to SwiftUI rather than reimplementing
// layout.

import SwiftUI
import DuVayCore
import DuVayTokens

// MARK: - Icon

/// An SF Symbol sized from the DuVay glyph scale.
///
/// Decorative by default: an icon that repeats an adjacent label is noise to a
/// screen reader, so it is hidden unless the caller supplies a label.
public struct DuVayIcon: View {
    @DuVayPalette private var palette

    private let systemName: String
    private let size: DuVayControlSize
    private let label: String?
    private let tint: Color?

    public init(_ systemName: String, size: DuVayControlSize = .md, label: String? = nil, tint: Color? = nil) {
        self.systemName = systemName
        self.size = size
        self.label = label
        self.tint = tint
    }

    public var body: some View {
        Image(systemName: systemName)
            .font(.system(size: size.glyph))
            .foregroundStyle(tint ?? palette.text)
            .modifier(AccessibleGlyph(label: label))
    }
}

/// Hides a glyph from assistive tech unless it carries meaning of its own.
private struct AccessibleGlyph: ViewModifier {
    let label: String?

    func body(content: Content) -> some View {
        if let label {
            content.accessibilityLabel(Text(label))
        } else {
            content.accessibilityHidden(true)
        }
    }
}

// MARK: - Divider

public struct DuVayDivider: View {
    @DuVayPalette private var palette
    private let axis: Axis

    public init(_ axis: Axis = .horizontal) { self.axis = axis }

    public var body: some View {
        Rectangle()
            .fill(palette.divider)
            .frame(
                width: axis == .vertical ? 1 : nil,
                height: axis == .horizontal ? 1 : nil
            )
            // A divider is presentational: it must not appear in the
            // accessibility tree as an unlabelled element.
            .accessibilityHidden(true)
    }
}

// MARK: - Badge

public enum DuVayStatus: String, Sendable, CaseIterable {
    case neutral, info, success, warning, error
}

/// A small count or status marker.
public struct DuVayBadge: View {
    @DuVayPalette private var palette

    private let text: String
    private let status: DuVayStatus

    public init(_ text: String, status: DuVayStatus = .neutral) {
        self.text = text
        self.status = status
    }

    public var body: some View {
        Text(text)
            .font(.system(size: DuVayTokens.fontXs, weight: .semibold))
            .padding(.horizontal, DuVayTokens.space2)
            .padding(.vertical, DuVayTokens.space1)
            .foregroundStyle(foreground)
            .background(background)
            .clipShape(Capsule())
            // Announced as a status so a count change is spoken without
            // stealing focus.
            .accessibilityAddTraits(.isStaticText)
    }

    private var foreground: Color {
        switch status {
        case .neutral: return palette.text
        case .info: return palette.onPrimaryContainer
        case .success: return palette.onSuccessContainer
        case .warning: return palette.onWarningContainer
        case .error: return palette.onErrorContainer
        }
    }

    private var background: Color {
        switch status {
        case .neutral: return palette.surfaceContainerHigh
        case .info: return palette.primaryContainer
        case .success: return palette.successContainer
        case .warning: return palette.warningContainer
        case .error: return palette.errorContainer
        }
    }
}

// MARK: - Avatar

/// A circular identity marker, falling back to initials then to a glyph.
public struct DuVayAvatar: View {
    @DuVayPalette private var palette

    private let name: String?
    private let image: Image?
    private let size: DuVayControlSize

    public init(name: String? = nil, image: Image? = nil, size: DuVayControlSize = .md) {
        self.name = name
        self.image = image
        self.size = size
    }

    public var body: some View {
        ZStack {
            Circle().fill(palette.primaryContainer)
            if let image {
                image.resizable().scaledToFill()
            } else if let initials, !initials.isEmpty {
                Text(initials)
                    .font(.system(size: size.glyph * 0.8, weight: .semibold))
                    .foregroundStyle(palette.onPrimaryContainer)
            } else {
                Image(systemName: "person.fill")
                    .font(.system(size: size.glyph))
                    .foregroundStyle(palette.onPrimaryContainer)
            }
        }
        .frame(width: size.height, height: size.height)
        .clipShape(Circle())
        // The name is the accessible label; without one the avatar is decorative.
        .accessibilityElement()
        .modifier(AccessibleGlyph(label: name))
    }

    /// Initials come from DuVayCore so web and native agree on the algorithm —
    /// the same rule the conformance suite pins.
    private var initials: String? {
        name.map { DuVayValues.initials($0) }
    }
}

// MARK: - Chip

public struct DuVayChip: View {
    @DuVayPalette private var palette

    private let text: String
    private let selected: Bool
    private let onTap: (() -> Void)?
    private let onDismiss: (() -> Void)?

    public init(
        _ text: String,
        selected: Bool = false,
        onTap: (() -> Void)? = nil,
        onDismiss: (() -> Void)? = nil
    ) {
        self.text = text
        self.selected = selected
        self.onTap = onTap
        self.onDismiss = onDismiss
    }

    public var body: some View {
        HStack(spacing: DuVayTokens.space1) {
            Text(text).font(.system(size: DuVayTokens.fontSm))
            if let onDismiss {
                Button(action: onDismiss) {
                    Image(systemName: "xmark")
                        .font(.system(size: DuVayTokens.iconGlyphXs, weight: .bold))
                }
                .buttonStyle(.plain)
                .accessibilityLabel(Text("Remove \(text)"))
            }
        }
        .padding(.horizontal, DuVayTokens.space3)
        .frame(height: DuVayTokens.sizeSm)
        .foregroundStyle(selected ? palette.onAccent : palette.text)
        .background(selected ? palette.accentBg : palette.surfaceContainerHigh)
        .clipShape(Capsule())
        .overlay(
            Capsule().strokeBorder(selected ? .clear : palette.outline, lineWidth: 1)
        )
        .contentShape(Capsule())
        .modifier(TapIfInteractive(onTap: onTap, selected: selected))
    }
}

/// A chip with no tap handler is a label, not a button — and must not claim
/// the button trait, or a screen reader promises an action that does not exist.
private struct TapIfInteractive: ViewModifier {
    let onTap: (() -> Void)?
    let selected: Bool

    func body(content: Content) -> some View {
        if let onTap {
            content
                .onTapGesture(perform: onTap)
                .accessibilityAddTraits(selected ? [.isButton, .isSelected] : .isButton)
        } else {
            content
        }
    }
}

// MARK: - Card

/// A surface container. Elevation comes from the theme's shadow colour so it
/// stays correct in dark and high-contrast.
public struct DuVayCard<Content: View>: View {
    @DuVayPalette private var palette

    private let elevated: Bool
    private let bordered: Bool
    private let content: Content

    public init(elevated: Bool = false, bordered: Bool = true, @ViewBuilder content: () -> Content) {
        self.elevated = elevated
        self.bordered = bordered
        self.content = content()
    }

    public var body: some View {
        content
            .padding(DuVayTokens.space4)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(palette.surfaceContainer)
            .clipShape(RoundedRectangle(cornerRadius: DuVayTokens.radiusLg, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: DuVayTokens.radiusLg, style: .continuous)
                    .strokeBorder(bordered ? palette.border : .clear, lineWidth: 1)
            )
            .shadow(
                color: elevated ? palette.shadowColor : .clear,
                radius: elevated ? 12 : 0,
                y: elevated ? 4 : 0
            )
    }
}
