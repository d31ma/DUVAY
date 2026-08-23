// DuVay — Tier 1 form controls
//
// Contracts: spec/components/w-{checkbox,switch,slider,text-field,textarea,
// radio-group,select,icon-btn}.json
//
// Each wraps the platform's own control rather than redrawing it. That is the
// point of the native track: a SwiftUI Toggle already has the right press
// behaviour, VoiceOver semantics and Dynamic Type response, and reimplementing
// it would lose all three while looking almost right.

import SwiftUI
import DuVayTokens

// MARK: - IconButton

/// A square, icon-only button.
///
/// The visible glyph is smaller than the hit target on purpose: HIG requires
/// 44pt of touchable area, but a 44pt glyph looks enormous.
public struct DuVayIconButton: View {
    @DuVayPalette private var palette
    @Environment(\.isEnabled) private var isEnabled

    private let systemName: String
    private let label: String
    private let size: DuVayControlSize
    private let variant: DuVayButtonVariant
    private let action: () -> Void

    public init(
        _ systemName: String,
        label: String,
        size: DuVayControlSize = .md,
        variant: DuVayButtonVariant = .text,
        action: @escaping () -> Void
    ) {
        self.systemName = systemName
        self.label = label
        self.size = size
        self.variant = variant
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            Image(systemName: systemName)
                .font(.system(size: size.glyph))
                .frame(width: size.height, height: size.height)
                .foregroundStyle(variant == .filled ? palette.onAccent : palette.text)
                .background(variant == .filled ? palette.accentBg : .clear)
                .clipShape(RoundedRectangle(cornerRadius: DuVayTokens.radius, style: .continuous))
        }
        .buttonStyle(.plain)
        .contentShape(Rectangle())
        .frame(minWidth: DuVayTokens.touchMin, minHeight: DuVayTokens.touchMin)
        .opacity(isEnabled ? 1 : DuVayTokens.textDisabledOpacity)
        // An icon-only control carries no text, so the label is mandatory in
        // the initialiser rather than optional — there is no fallback.
        .accessibilityLabel(Text(label))
    }
}

// MARK: - Checkbox

public struct DuVayCheckbox: View {
    @DuVayPalette private var palette
    @Environment(\.isEnabled) private var isEnabled

    @Binding private var isOn: Bool
    private let label: String

    public init(_ label: String, isOn: Binding<Bool>) {
        self.label = label
        self._isOn = isOn
    }

    public var body: some View {
        Button {
            isOn.toggle()
        } label: {
            HStack(spacing: DuVayTokens.space2) {
                ZStack {
                    RoundedRectangle(cornerRadius: DuVayTokens.radiusSm, style: .continuous)
                        .strokeBorder(isOn ? .clear : palette.outline, lineWidth: 1)
                        .background(
                            RoundedRectangle(cornerRadius: DuVayTokens.radiusSm, style: .continuous)
                                .fill(isOn ? palette.accentBg : .clear)
                        )
                    if isOn {
                        Image(systemName: "checkmark")
                            .font(.system(size: DuVayTokens.iconGlyphXs, weight: .bold))
                            .foregroundStyle(palette.onAccent)
                    }
                }
                .frame(width: 20, height: 20)

                Text(label)
                    .font(.system(size: DuVayTokens.fontBase))
                    .foregroundStyle(palette.text)
            }
        }
        .buttonStyle(.plain)
        .contentShape(Rectangle())
        .frame(minHeight: DuVayTokens.touchMin, alignment: .leading)
        .opacity(isEnabled ? 1 : DuVayTokens.textDisabledOpacity)
        // The whole row is one control to assistive tech, not a box plus a
        // separate label.
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text(label))
        .accessibilityAddTraits(isOn ? [.isButton, .isSelected] : .isButton)
        .accessibilityValue(Text(isOn ? "Checked" : "Unchecked"))
    }
}

// MARK: - Switch

/// A boolean toggle.
///
/// Wraps SwiftUI's `Toggle`, which already renders as a UISwitch on iOS and an
/// NSSwitch on macOS — exactly the "native widgets per platform" the plan asks
/// for, and free of the geometry the web skin has to hand-build.
public struct DuVayToggle: View {
    @DuVayPalette private var palette
    @Environment(\.duvayTheme) private var theme
    @Environment(\.colorScheme) private var scheme

    @Binding private var isOn: Bool
    private let label: String

    public init(_ label: String, isOn: Binding<Bool>) {
        self.label = label
        self._isOn = isOn
    }

    public var body: some View {
        Toggle(isOn: $isOn) {
            Text(label)
                .font(.system(size: DuVayTokens.fontBase))
                .foregroundStyle(palette.text)
        }
        .tint(theme.accentBg(for: scheme))
        .frame(minHeight: DuVayTokens.touchMin)
    }
}

// MARK: - RadioGroup

public struct DuVayRadioGroup<Value: Hashable>: View {
    @DuVayPalette private var palette

    @Binding private var selection: Value
    private let label: String
    private let options: [(value: Value, label: String)]

    public init(_ label: String, selection: Binding<Value>, options: [(value: Value, label: String)]) {
        self.label = label
        self._selection = selection
        self.options = options
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: DuVayTokens.space2) {
            Text(label)
                .font(.system(size: DuVayTokens.fontSm, weight: .medium))
                .foregroundStyle(palette.textSubtle)

            ForEach(options, id: \.value) { option in
                Button {
                    selection = option.value
                } label: {
                    HStack(spacing: DuVayTokens.space2) {
                        ZStack {
                            Circle()
                                .strokeBorder(
                                    selection == option.value ? palette.accentBg : palette.outline,
                                    lineWidth: selection == option.value ? 6 : 1
                                )
                        }
                        .frame(width: 20, height: 20)

                        Text(option.label)
                            .font(.system(size: DuVayTokens.fontBase))
                            .foregroundStyle(palette.text)
                    }
                }
                .buttonStyle(.plain)
                .contentShape(Rectangle())
                .frame(minHeight: DuVayTokens.touchMin, alignment: .leading)
                .accessibilityElement(children: .ignore)
                .accessibilityLabel(Text(option.label))
                .accessibilityAddTraits(selection == option.value ? [.isButton, .isSelected] : .isButton)
            }
        }
        // The group needs its own label so VoiceOver announces what the options
        // belong to before reading them.
        .accessibilityElement(children: .contain)
        .accessibilityLabel(Text(label))
    }
}

// MARK: - Slider

public struct DuVaySlider: View {
    @DuVayPalette private var palette
    @Environment(\.duvayTheme) private var theme
    @Environment(\.colorScheme) private var scheme

    @Binding private var value: Double
    private let label: String
    private let range: ClosedRange<Double>
    private let step: Double?

    public init(_ label: String, value: Binding<Double>, in range: ClosedRange<Double> = 0...100, step: Double? = nil) {
        self.label = label
        self._value = value
        self.range = range
        self.step = step
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: DuVayTokens.space1) {
            Text(label)
                .font(.system(size: DuVayTokens.fontSm, weight: .medium))
                .foregroundStyle(palette.textSubtle)

            Group {
                if let step {
                    Slider(value: $value, in: range, step: step)
                } else {
                    Slider(value: $value, in: range)
                }
            }
            .tint(theme.accentBg(for: scheme))
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(Text(label))
    }
}

// MARK: - TextField

public enum DuVayFieldVariant: String, Sendable, CaseIterable {
    case outlined, filled, underlined
}

public struct DuVayTextField: View {
    @DuVayPalette private var palette
    @Environment(\.isEnabled) private var isEnabled
    @FocusState private var focused: Bool

    @Binding private var text: String
    private let label: String
    private let placeholder: String
    private let variant: DuVayFieldVariant
    private let error: String?
    private let secure: Bool

    public init(
        _ label: String,
        text: Binding<String>,
        placeholder: String = "",
        variant: DuVayFieldVariant = .outlined,
        error: String? = nil,
        secure: Bool = false
    ) {
        self.label = label
        self._text = text
        self.placeholder = placeholder
        self.variant = variant
        self.error = error
        self.secure = secure
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: DuVayTokens.space1) {
            Text(label)
                .font(.system(size: DuVayTokens.fontSm, weight: .medium))
                .foregroundStyle(error == nil ? palette.textSubtle : palette.error)

            Group {
                if secure {
                    SecureField(placeholder, text: $text)
                } else {
                    TextField(placeholder, text: $text)
                }
            }
            .textFieldStyle(.plain)
            .font(.system(size: DuVayTokens.fontBase))
            .foregroundStyle(palette.text)
            .focused($focused)
            .padding(.horizontal, variant == .underlined ? 0 : DuVayTokens.space3)
            .frame(height: DuVayTokens.sizeMd)
            .background(variant == .filled ? palette.surfaceContainerHigh : .clear)
            .overlay(alignment: .bottom) { underline }
            .overlay { outline }
            .clipShape(RoundedRectangle(cornerRadius: shapeRadius, style: .continuous))

            if let error {
                Text(error)
                    .font(.system(size: DuVayTokens.fontXs))
                    .foregroundStyle(palette.error)
            }
        }
        .opacity(isEnabled ? 1 : DuVayTokens.textDisabledOpacity)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(Text(label))
        // The error is part of the control's value to a screen reader, not a
        // separate node it might never reach.
        .accessibilityValue(Text(error.map { "\(text). Error: \($0)" } ?? text))
    }

    private var shapeRadius: CGFloat {
        variant == .underlined ? 0 : DuVayTokens.radius
    }

    /// --w-outline, not --w-border: this is the control boundary and carries
    /// the WCAG 1.4.11 3:1 contract.
    private var strokeColor: Color {
        if error != nil { return palette.error }
        return focused ? palette.accentBg : palette.outline
    }

    @ViewBuilder private var outline: some View {
        if variant == .outlined {
            RoundedRectangle(cornerRadius: DuVayTokens.radius, style: .continuous)
                .strokeBorder(strokeColor, lineWidth: focused ? 2 : 1)
        }
    }

    @ViewBuilder private var underline: some View {
        if variant != .outlined {
            Rectangle()
                .fill(strokeColor)
                .frame(height: focused ? 2 : 1)
        }
    }
}

// MARK: - TextArea

public struct DuVayTextArea: View {
    @DuVayPalette private var palette
    @FocusState private var focused: Bool

    @Binding private var text: String
    private let label: String
    private let minHeight: CGFloat

    public init(_ label: String, text: Binding<String>, minHeight: CGFloat = 100) {
        self.label = label
        self._text = text
        self.minHeight = minHeight
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: DuVayTokens.space1) {
            Text(label)
                .font(.system(size: DuVayTokens.fontSm, weight: .medium))
                .foregroundStyle(palette.textSubtle)

            TextEditor(text: $text)
                .font(.system(size: DuVayTokens.fontBase))
                .foregroundStyle(palette.text)
                .scrollContentBackground(.hidden)
                .focused($focused)
                .padding(DuVayTokens.space2)
                .frame(minHeight: minHeight)
                .background(palette.surface)
                .overlay(
                    RoundedRectangle(cornerRadius: DuVayTokens.radius, style: .continuous)
                        .strokeBorder(focused ? palette.accentBg : palette.outline, lineWidth: focused ? 2 : 1)
                )
                .clipShape(RoundedRectangle(cornerRadius: DuVayTokens.radius, style: .continuous))
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(Text(label))
    }
}

// MARK: - Select

/// A single-choice picker.
///
/// Delegates to SwiftUI's `Picker`, which becomes a menu on macOS and a wheel
/// or menu on iOS depending on context — the platform's own affordance rather
/// than a redrawn dropdown.
public struct DuVayPicker<Value: Hashable>: View {
    @DuVayPalette private var palette

    @Binding private var selection: Value
    private let label: String
    private let options: [(value: Value, label: String)]

    public init(_ label: String, selection: Binding<Value>, options: [(value: Value, label: String)]) {
        self.label = label
        self._selection = selection
        self.options = options
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: DuVayTokens.space1) {
            Text(label)
                .font(.system(size: DuVayTokens.fontSm, weight: .medium))
                .foregroundStyle(palette.textSubtle)

            Picker(label, selection: $selection) {
                ForEach(options, id: \.value) { option in
                    Text(option.label).tag(option.value)
                }
            }
            .labelsHidden()
            .pickerStyle(.menu)
            .tint(palette.text)
            .padding(.horizontal, DuVayTokens.space2)
            .frame(height: DuVayTokens.sizeMd)
            .frame(maxWidth: .infinity, alignment: .leading)
            .overlay(
                RoundedRectangle(cornerRadius: DuVayTokens.radius, style: .continuous)
                    .strokeBorder(palette.outline, lineWidth: 1)
            )
        }
        .accessibilityLabel(Text(label))
    }
}
