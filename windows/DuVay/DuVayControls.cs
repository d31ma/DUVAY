// DuVay — Tier 1 controls (Windows / WinUI 3)
//
// Contracts: spec/components/*.json
//
// Each type derives from the WinUI control it corresponds to rather than
// redrawing one. That keeps Fluent's own press states, reveal focus, theme
// transitions and Narrator semantics, which is the whole reason the plan chose
// WinUI 3 over MAUI or Avalonia.
//
// The accent is a system value on Windows, not ours: the user picks it in
// Settings and the framework exposes it as SystemAccentColor. Controls here
// bind to Fluent's theme resources rather than hard-coding DuVay's teal.

using DuVay.Core;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Automation;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;

namespace DuVay;

public enum DuVayButtonVariant { Filled, Tonal, Outlined, Text, Destructive }

/// <summary>A labelled button.</summary>
public partial class DuVayButton : Button
{
    public static readonly DependencyProperty VariantProperty =
        DependencyProperty.Register(
            nameof(Variant), typeof(DuVayButtonVariant), typeof(DuVayButton),
            new PropertyMetadata(DuVayButtonVariant.Filled, OnVariantChanged));

    public DuVayButtonVariant Variant
    {
        get => (DuVayButtonVariant)GetValue(VariantProperty);
        set => SetValue(VariantProperty, value);
    }

    public DuVayButton()
    {
        CornerRadius = new CornerRadius(DuVayTokens.Radius);
        MinHeight = DuVayTokens.SizeMd;
        Padding = new Thickness(DuVayTokens.Space4, 0, DuVayTokens.Space4, 0);
        ApplyVariant();
    }

    private static void OnVariantChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) =>
        ((DuVayButton)d).ApplyVariant();

    private void ApplyVariant()
    {
        // Fluent ships these styles; using them is what makes the control look
        // native rather than approximately native.
        var key = Variant switch
        {
            DuVayButtonVariant.Filled => "AccentButtonStyle",
            DuVayButtonVariant.Destructive => "AccentButtonStyle",
            _ => "DefaultButtonStyle",
        };
        if (Application.Current?.Resources.TryGetValue(key, out var style) == true && style is Style s)
        {
            Style = s;
        }
    }
}

/// <summary>
/// An icon-only button. The automation name is mandatory because the control
/// carries no text — without it Narrator announces nothing.
/// </summary>
public partial class DuVayIconButton : Button
{
    public DuVayIconButton()
    {
        Width = DuVayTokens.SizeMd;
        Height = DuVayTokens.SizeMd;
        CornerRadius = new CornerRadius(DuVayTokens.Radius);
    }

    public string Label
    {
        get => AutomationProperties.GetName(this);
        set => AutomationProperties.SetName(this, value);
    }
}

/// <summary>A glyph. Decorative unless given a label.</summary>
public partial class DuVayIcon : FontIcon
{
    public DuVayIcon()
    {
        FontSize = DuVayTokens.IconGlyphMd;
        // Decorative by default: a glyph that repeats an adjacent label is
        // noise to a screen reader.
        AutomationProperties.SetAccessibilityView(this, Microsoft.UI.Xaml.Automation.Peers.AccessibilityView.Raw);
    }
}

/// <summary>
/// A horizontal or vertical rule.
/// </summary>
/// <remarks>
/// Composes a <see cref="Border"/> rather than deriving from it: WinUI seals
/// most of its leaf controls, so a design system extends them by wrapping.
/// </remarks>
public partial class DuVayDivider : ContentControl
{
    public DuVayDivider()
    {
        Height = 1;
        HorizontalContentAlignment = HorizontalAlignment.Stretch;
        Content = new Border { Height = 1 };
        AutomationProperties.SetAccessibilityView(this, Microsoft.UI.Xaml.Automation.Peers.AccessibilityView.Raw);
    }
}

/// <summary>A surface container.</summary>
public partial class DuVayCard : ContentControl
{
    public DuVayCard()
    {
        CornerRadius = new CornerRadius(DuVayTokens.RadiusLg);
        Padding = new Thickness(DuVayTokens.Space4);
        BorderThickness = new Thickness(1);
        HorizontalContentAlignment = HorizontalAlignment.Stretch;
    }
}

/// <summary>A compact, rounded label.</summary>
public partial class DuVayChip : ContentControl
{
    public DuVayChip()
    {
        CornerRadius = new CornerRadius(DuVayTokens.RadiusPill);
        Padding = new Thickness(DuVayTokens.Space3, DuVayTokens.Space1, DuVayTokens.Space3, DuVayTokens.Space1);
        BorderThickness = new Thickness(1);
    }
}

/// <summary>A small count or status marker.</summary>
public partial class DuVayInfoBadge : InfoBadge
{
    public DuVayInfoBadge()
    {
        CornerRadius = new CornerRadius(DuVayTokens.RadiusPill);
    }
}

/// <summary>
/// A circular identity marker. Initials come from DuVay.Core so every platform
/// derives them the same way — the rule the conformance suite pins.
/// </summary>
public partial class DuVayPersonPicture : PersonPicture
{
    public string? PersonName
    {
        get => DisplayName;
        set
        {
            DisplayName = value;
            Initials = DuVayValues.Initials(value);
            if (value is not null) AutomationProperties.SetName(this, value);
        }
    }
}

/// <summary>A labelled checkbox.</summary>
public partial class DuVayCheckBox : CheckBox
{
    public DuVayCheckBox() => MinHeight = DuVayTokens.TouchMin;
}

/// <summary>A boolean toggle.</summary>
/// <remarks>
/// <see cref="ToggleSwitch"/> is sealed, so this wraps one and re-exposes the
/// state. <see cref="Inner"/> is public so callers can reach the full control.
/// </remarks>
public partial class DuVayToggleSwitch : ContentControl
{
    public ToggleSwitch Inner { get; }

    public DuVayToggleSwitch()
    {
        Inner = new ToggleSwitch();
        Content = Inner;
        MinHeight = DuVayTokens.TouchMin;
    }

    public bool IsOn
    {
        get => Inner.IsOn;
        set => Inner.IsOn = value;
    }
}

/// <summary>A group of mutually exclusive options.</summary>
public partial class DuVayRadioButtons : RadioButtons
{
}

/// <summary>A continuous value selector.</summary>
public partial class DuVaySlider : Slider
{
}

/// <summary>A single-line text field.</summary>
public partial class DuVayTextField : TextBox
{
    public DuVayTextField()
    {
        CornerRadius = new CornerRadius(DuVayTokens.Radius);
        MinHeight = DuVayTokens.SizeMd;
    }
}

/// <summary>A multi-line text field.</summary>
public partial class DuVayTextArea : TextBox
{
    public DuVayTextArea()
    {
        AcceptsReturn = true;
        TextWrapping = TextWrapping.Wrap;
        MinHeight = 100;
        CornerRadius = new CornerRadius(DuVayTokens.Radius);
    }
}

/// <summary>A single-choice picker.</summary>
public partial class DuVayComboBox : ComboBox
{
    public DuVayComboBox()
    {
        CornerRadius = new CornerRadius(DuVayTokens.Radius);
        MinHeight = DuVayTokens.SizeMd;
    }
}

/// <summary>A predictive text field.</summary>
/// <remarks><see cref="AutoSuggestBox"/> is sealed; this wraps one.</remarks>
public partial class DuVayAutoSuggestBox : ContentControl
{
    public AutoSuggestBox Inner { get; }

    public DuVayAutoSuggestBox()
    {
        Inner = new AutoSuggestBox { CornerRadius = new CornerRadius(DuVayTokens.Radius) };
        Content = Inner;
        HorizontalContentAlignment = HorizontalAlignment.Stretch;
    }
}

/// <summary>A scrollable list container.</summary>
public partial class DuVayListView : ListView
{
}

/// <summary>A single row.</summary>
public partial class DuVayListItem : ListViewItem
{
    public DuVayListItem() => MinHeight = DuVayTokens.TouchMin;
}

/// <summary>A determinate or indeterminate progress bar.</summary>
public partial class DuVayProgressBar : ProgressBar
{
}

/// <summary>A circular progress indicator.</summary>
public partial class DuVayProgressRing : ProgressRing
{
}

/// <summary>An inline, non-blocking message.</summary>
public partial class DuVayInfoBar : InfoBar
{
    public DuVayInfoBar() => CornerRadius = new CornerRadius(DuVayTokens.Radius);
}

/// <summary>A modal surface for arbitrary content.</summary>
public partial class DuVayContentDialog : ContentDialog
{
    public DuVayContentDialog() => CornerRadius = new CornerRadius(DuVayTokens.RadiusLg);
}

/// <summary>A hover/focus hint.</summary>
public partial class DuVayToolTip : ToolTip
{
}

/// <summary>A contextual action menu.</summary>
public partial class DuVayMenuFlyout : MenuFlyout
{
}
