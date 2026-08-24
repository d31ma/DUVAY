// DuVay for Windows — Tier 2 controls.
//
// Tier 2 is added one component at a time across all five platforms, so no
// platform races ahead of the others (CROSS-PLATFORM-PLAN.md, Phase 6+).
//
// Several WinUI types are sealed, so where a control cannot be subclassed it is
// composed instead — the same strategy the Tier 1 controls already use, and the
// reason the control-surface snapshot records each control's base type.

using DuVay.Core;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Automation;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;

namespace DuVay;

/// <summary>A placeholder for a view with nothing in it.</summary>
public partial class DuVayEmptyState : ContentControl
{
    private readonly TextBlock _title = new();
    private readonly TextBlock _message = new();
    private readonly StackPanel _root = new();

    public DuVayEmptyState()
    {
        _root.Orientation = Orientation.Vertical;
        _root.Spacing = DuVayTokens.Space3;
        _root.HorizontalAlignment = HorizontalAlignment.Center;

        _title.FontSize = DuVayTokens.FontLg;
        _title.TextAlignment = TextAlignment.Center;
        // The headline names the state, so it is the heading of this region
        // rather than one more run of text.
        AutomationProperties.SetHeadingLevel(_title, Microsoft.UI.Xaml.Automation.Peers.AutomationHeadingLevel.Level2);

        _message.FontSize = DuVayTokens.FontSm;
        _message.TextAlignment = TextAlignment.Center;
        _message.Visibility = Visibility.Collapsed;

        _root.Children.Add(_title);
        _root.Children.Add(_message);

        Padding = new Thickness(DuVayTokens.Space6);
        HorizontalContentAlignment = HorizontalAlignment.Stretch;
        Content = _root;
    }

    public string Title
    {
        get => _title.Text;
        set => _title.Text = value;
    }

    public string Message
    {
        get => _message.Text;
        set
        {
            _message.Text = value;
            _message.Visibility = string.IsNullOrEmpty(value) ? Visibility.Collapsed : Visibility.Visible;
        }
    }
}

/// <summary>A loading placeholder.</summary>
public partial class DuVaySkeleton : ContentControl
{
    public DuVaySkeleton()
    {
        Height = 16;
        HorizontalContentAlignment = HorizontalAlignment.Stretch;
        Content = new Border { CornerRadius = new CornerRadius(DuVayTokens.RadiusSm) };
        // Placeholder content is not information: the loading state is
        // announced by the container, so Narrator should skip the block.
        AutomationProperties.SetAccessibilityView(this, Microsoft.UI.Xaml.Automation.Peers.AccessibilityView.Raw);
    }
}

/// <summary>A trail of ancestor locations, the last of which is the current one.</summary>
public partial class DuVayBreadcrumbBar : ContentControl
{
    private readonly StackPanel _root = new();

    public DuVayBreadcrumbBar()
    {
        _root.Orientation = Orientation.Horizontal;
        _root.Spacing = DuVayTokens.Space2;
        AutomationProperties.SetName(this, "Breadcrumb");
        Content = _root;
    }

    /// <summary>Replace the trail. The final entry is the current location.</summary>
    public void SetItems(params string[] items)
    {
        _root.Children.Clear();
        for (var index = 0; index < items.Length; index++)
        {
            var isCurrent = index == items.Length - 1;
            if (isCurrent)
            {
                // Where you already are is not a link; offering it as one would
                // give keyboard users a no-op stop.
                _root.Children.Add(new TextBlock { Text = items[index], FontSize = DuVayTokens.FontSm });
                continue;
            }

            _root.Children.Add(new HyperlinkButton { Content = items[index], Padding = new Thickness(0) });

            var separator = new TextBlock { Text = "/", FontSize = DuVayTokens.FontSm };
            AutomationProperties.SetAccessibilityView(separator, Microsoft.UI.Xaml.Automation.Peers.AccessibilityView.Raw);
            _root.Children.Add(separator);
        }
    }
}

/// <summary>A star rating.</summary>
/// <remarks>
/// Composes <see cref="RatingControl"/> rather than subclassing it: the WinUI
/// type is sealed. Composition also keeps the automation name on the wrapper,
/// so Narrator reads the rating once instead of once per star.
/// </remarks>
public partial class DuVayRatingControl : ContentControl
{
    private readonly RatingControl _inner = new();

    public DuVayRatingControl()
    {
        _inner.IsClearEnabled = true;
        _inner.IsReadOnly = false;
        AutomationProperties.SetName(this, "Rating");
        Content = _inner;
    }

    public RatingControl Inner => _inner;

    public double Value
    {
        get => _inner.Value;
        set => _inner.Value = value;
    }

    public int MaxRating
    {
        get => _inner.MaxRating;
        set => _inner.MaxRating = value;
    }
}

/// <summary>Page navigation for a paged collection.</summary>
public partial class DuVayPagination : ContentControl
{
    private readonly Button _previous = new();
    private readonly Button _next = new();
    private readonly TextBlock _label = new();
    private int _page = 1;
    private int _pageCount = 1;

    public DuVayPagination()
    {
        var root = new StackPanel
        {
            Orientation = Orientation.Horizontal,
            Spacing = DuVayTokens.Space2,
            VerticalAlignment = VerticalAlignment.Center,
        };

        _previous.Content = ""; // Segoe Fluent chevron left
        _next.Content = "";     // Segoe Fluent chevron right
        AutomationProperties.SetName(_previous, "Previous page");
        AutomationProperties.SetName(_next, "Next page");

        _previous.Click += (_, _) => Page = _page - 1;
        _next.Click += (_, _) => Page = _page + 1;

        root.Children.Add(_previous);
        root.Children.Add(_label);
        root.Children.Add(_next);

        AutomationProperties.SetName(this, "Pagination");
        Content = root;
        Sync();
    }

    public int Page
    {
        get => _page;
        set
        {
            _page = System.Math.Clamp(value, 1, System.Math.Max(_pageCount, 1));
            Sync();
        }
    }

    public int PageCount
    {
        get => _pageCount;
        set
        {
            _pageCount = System.Math.Max(value, 1);
            Sync();
        }
    }

    private void Sync()
    {
        _label.Text = $"{_page} / {_pageCount}";
        _previous.IsEnabled = _page > 1;
        _next.IsEnabled = _page < _pageCount;
    }
}

/// <summary>A tabbed container.</summary>
/// <remarks>
/// Composes WinUI's <see cref="TabView"/>: the type is sealed, and it already
/// carries tab reordering, the close affordance and the UIA tab semantics
/// Narrator expects.
/// </remarks>
public partial class DuVayTabView : ContentControl
{
    private readonly TabView _inner = new();

    public DuVayTabView()
    {
        _inner.IsAddTabButtonVisible = false;
        _inner.TabWidthMode = TabViewWidthMode.SizeToContent;
        Content = _inner;
    }

    public TabView Inner => _inner;

    /// <summary>Append a tab. The header is what Narrator announces.</summary>
    public TabViewItem AddTab(string header, object content)
    {
        var tab = new TabViewItem { Header = header, Content = content, IsClosable = false };
        _inner.TabItems.Add(tab);
        return tab;
    }
}

/// <summary>A titled section that expands to reveal its content.</summary>
/// <remarks>
/// WinUI's <see cref="Expander"/> owns the expanded state, the chevron and the
/// UIA ExpandCollapse pattern, so this styles it rather than rebuilding it.
/// </remarks>
public partial class DuVayExpander : ContentControl
{
    private readonly Expander _inner = new();

    public DuVayExpander()
    {
        _inner.HorizontalAlignment = HorizontalAlignment.Stretch;
        _inner.HorizontalContentAlignment = HorizontalAlignment.Stretch;
        Content = _inner;
    }

    public Expander Inner => _inner;

    public object Header
    {
        get => _inner.Header;
        set => _inner.Header = value;
    }

    public object Body
    {
        get => _inner.Content;
        set => _inner.Content = value;
    }

    public bool IsExpanded
    {
        get => _inner.IsExpanded;
        set => _inner.IsExpanded = value;
    }
}

/// <summary>Transient content anchored to a control.</summary>
/// <remarks>
/// Wraps <see cref="Flyout"/> rather than drawing a panel: the system owns
/// placement, light-dismiss and — the part that is easy to get wrong by hand —
/// returning focus to the anchor when it closes.
/// </remarks>
public partial class DuVayFlyout
{
    private readonly Flyout _inner = new();

    public DuVayFlyout()
    {
        _inner.Placement = Microsoft.UI.Xaml.Controls.Primitives.FlyoutPlacementMode.Bottom;
    }

    public Flyout Inner => _inner;

    public object Body
    {
        get => _inner.Content;
        set => _inner.Content = value as FrameworkElement;
    }

    /// <summary>Attach to the control the content belongs to.</summary>
    public void AttachTo(FrameworkElement anchor) => Microsoft.UI.Xaml.Controls.Primitives.FlyoutBase.SetAttachedFlyout(anchor, _inner);

    public void ShowAt(FrameworkElement anchor) => _inner.ShowAt(anchor);
}

/// <summary>The bar at the top of a window.</summary>
public partial class DuVayTitleBar : ContentControl
{
    private readonly TextBlock _title = new();
    private readonly StackPanel _root = new();

    public DuVayTitleBar()
    {
        _root.Orientation = Orientation.Horizontal;
        _root.Spacing = DuVayTokens.Space3;
        _root.VerticalAlignment = VerticalAlignment.Center;

        _title.FontSize = DuVayTokens.FontLg;
        // The bar names the screen, so it is a heading rather than loose text.
        AutomationProperties.SetHeadingLevel(_title, Microsoft.UI.Xaml.Automation.Peers.AutomationHeadingLevel.Level1);
        _root.Children.Add(_title);

        MinHeight = DuVayTokens.TouchMin;
        Padding = new Thickness(DuVayTokens.Space4, 0, DuVayTokens.Space4, 0);
        HorizontalContentAlignment = HorizontalAlignment.Stretch;
        Content = _root;
    }

    public string Title
    {
        get => _title.Text;
        set => _title.Text = value;
    }

    /// <summary>Append an accessory after the title.</summary>
    public void AddAccessory(UIElement element) => _root.Children.Add(element);
}

/// <summary>A row of actions.</summary>
/// <remarks>
/// Composed rather than derived from <see cref="CommandBar"/>, which is sealed.
/// The toolbar name lives on the wrapper so Narrator announces the group once
/// and can move past it.
/// </remarks>
public partial class DuVayCommandBar : ContentControl
{
    private readonly StackPanel _root = new();

    public DuVayCommandBar()
    {
        _root.Orientation = Orientation.Horizontal;
        _root.Spacing = DuVayTokens.Space2;
        _root.VerticalAlignment = VerticalAlignment.Center;

        MinHeight = DuVayTokens.TouchMin;
        Padding = new Thickness(DuVayTokens.Space3, 0, DuVayTokens.Space3, 0);
        AutomationProperties.SetName(this, "Toolbar");
        AutomationProperties.SetLandmarkType(this, Microsoft.UI.Xaml.Automation.Peers.AutomationLandmarkType.Custom);
        Content = _root;
    }

    public void AddCommand(UIElement element) => _root.Children.Add(element);
}

/// <summary>A numeric field with increment and decrement controls.</summary>
/// <remarks>
/// Composes <see cref="NumberBox"/>, which is sealed. The spin buttons, the
/// expression evaluation and the UIA RangeValue pattern all come with it.
/// </remarks>
public partial class DuVayNumberBox : ContentControl
{
    private readonly NumberBox _inner = new();

    public DuVayNumberBox()
    {
        _inner.SpinButtonPlacementMode = NumberBoxSpinButtonPlacementMode.Inline;
        // Clamp rather than reject: the range is the contract, and silently
        // refusing a typed value leaves the box showing something invalid.
        _inner.ValidationMode = NumberBoxValidationMode.InvalidInputOverwritten;
        Content = _inner;
    }

    public NumberBox Inner => _inner;

    public string Label
    {
        get => _inner.Header as string ?? string.Empty;
        set => _inner.Header = value;
    }

    public double Value
    {
        get => _inner.Value;
        set => _inner.Value = value;
    }

    public double Minimum
    {
        get => _inner.Minimum;
        set => _inner.Minimum = value;
    }

    public double Maximum
    {
        get => _inner.Maximum;
        set => _inner.Maximum = value;
    }
}

/// <summary>A one-time-code field.</summary>
/// <remarks>
/// One <see cref="TextBox"/>, not N boxes: a row of single-character inputs
/// would give Narrator six unlabelled controls and break paste. The boxes are
/// drawn by the template over a single value.
/// </remarks>
public partial class DuVayOTPField : ContentControl
{
    private readonly TextBox _inner = new();
    private int _length = 6;

    public DuVayOTPField()
    {
        _inner.InputScope = new Microsoft.UI.Xaml.Input.InputScope
        {
            Names = { new Microsoft.UI.Xaml.Input.InputScopeName(Microsoft.UI.Xaml.Input.InputScopeNameValue.NumericPin) },
        };
        _inner.MaxLength = _length;
        _inner.TextAlignment = TextAlignment.Center;
        _inner.FontSize = DuVayTokens.FontLg;
        _inner.TextChanged += (_, _) => Filter();
        AutomationProperties.SetName(this, "One-time code");
        Content = _inner;
    }

    public TextBox Inner => _inner;

    public int Length
    {
        get => _length;
        set
        {
            _length = System.Math.Max(value, 1);
            _inner.MaxLength = _length;
            Filter();
        }
    }

    public string Code => _inner.Text;

    private void Filter()
    {
        var digits = new string(System.Linq.Enumerable.ToArray(
            System.Linq.Enumerable.Take(
                System.Linq.Enumerable.Where(_inner.Text, char.IsDigit), _length)));
        if (digits != _inner.Text) _inner.Text = digits;
    }
}

/// <summary>A control that opens the system file picker.</summary>
/// <remarks>
/// The picker needs the window handle: in WinUI 3 a <c>FileOpenPicker</c> is
/// not attached to a window automatically, and initialising it is the caller's
/// job because only they know which window this control lives in.
/// </remarks>
public partial class DuVayFilePicker : ContentControl
{
    private readonly Button _inner = new();

    public DuVayFilePicker()
    {
        _inner.Content = "Choose file";
        Content = _inner;
    }

    public Button Inner => _inner;

    public string Label
    {
        get => _inner.Content as string ?? string.Empty;
        set => _inner.Content = value;
    }
}

/// <summary>A sheet that rises from the bottom edge.</summary>
/// <remarks>
/// WinUI has no bottom-sheet primitive, so this is a <see cref="ContentDialog"/>
/// aligned to the bottom edge. Using the dialog rather than a bare overlay is
/// what supplies the focus trap, the Escape handling and the modal announcement.
/// </remarks>
public partial class DuVayBottomSheet : ContentControl
{
    private readonly ContentDialog _inner = new();

    public DuVayBottomSheet()
    {
        _inner.VerticalAlignment = VerticalAlignment.Bottom;
        _inner.HorizontalAlignment = HorizontalAlignment.Stretch;
        _inner.CornerRadius = new CornerRadius(DuVayTokens.RadiusLg, DuVayTokens.RadiusLg, 0, 0);
    }

    public ContentDialog Inner => _inner;

    public object Body
    {
        get => _inner.Content;
        set => _inner.Content = value;
    }

    public string Title
    {
        get => _inner.Title as string ?? string.Empty;
        set => _inner.Title = value;
    }
}

/// <summary>The primary destinations of an app.</summary>
/// <remarks>
/// Composes <see cref="NavigationView"/>, which is sealed. It is the same
/// control for both the drawer and the bottom-bar cases on Windows — the pane
/// display mode is what differs — so the Core contract's BottomNavigation and
/// NavigationDrawer both map here, with the mode set explicitly.
/// </remarks>
public partial class DuVayNavigationView : ContentControl
{
    private readonly NavigationView _inner = new();

    public DuVayNavigationView()
    {
        _inner.IsSettingsVisible = false;
        _inner.IsBackButtonVisible = NavigationViewBackButtonVisible.Auto;
        _inner.PaneDisplayMode = NavigationViewPaneDisplayMode.Auto;
        Content = _inner;
    }

    public NavigationView Inner => _inner;

    /// <summary>Show the destinations as a slide-in drawer.</summary>
    public void UseDrawer() => _inner.PaneDisplayMode = NavigationViewPaneDisplayMode.LeftMinimal;

    /// <summary>Show the destinations as a persistent side rail.</summary>
    public void UseRail() => _inner.PaneDisplayMode = NavigationViewPaneDisplayMode.LeftCompact;

    public NavigationViewItem AddDestination(string label)
    {
        var item = new NavigationViewItem { Content = label };
        AutomationProperties.SetName(item, label);
        _inner.MenuItems.Add(item);
        return item;
    }
}

/// <summary>Progress through an ordered sequence of steps.</summary>
/// <remarks>
/// Reported as one element with a position value: "Step 2 of 4" is what a
/// Narrator user needs, and four separate labels would not convey it.
/// </remarks>
public partial class DuVayStepper : ContentControl
{
    private readonly StackPanel _root = new();
    private string[] _steps = System.Array.Empty<string>();
    private int _current;

    public DuVayStepper()
    {
        _root.Orientation = Orientation.Horizontal;
        _root.Spacing = DuVayTokens.Space3;
        AutomationProperties.SetName(this, "Progress");
        Content = _root;
    }

    public void SetSteps(params string[] steps)
    {
        _steps = steps;
        Sync();
    }

    public int Current
    {
        get => _current;
        set
        {
            _current = System.Math.Clamp(value, 0, System.Math.Max(_steps.Length - 1, 0));
            Sync();
        }
    }

    private void Sync()
    {
        _root.Children.Clear();
        for (var index = 0; index < _steps.Length; index++)
        {
            var label = new TextBlock
            {
                Text = $"{index + 1}. {_steps[index]}",
                FontSize = DuVayTokens.FontSm,
            };
            // The strip announces itself as a whole, so the individual labels
            // stay out of the UIA tree.
            AutomationProperties.SetAccessibilityView(label, Microsoft.UI.Xaml.Automation.Peers.AccessibilityView.Raw);
            _root.Children.Add(label);
        }

        var position = _steps.Length == 0 ? string.Empty
            : $"Step {_current + 1} of {_steps.Length}: {_steps[_current]}";
        AutomationProperties.SetHelpText(this, position);
    }
}

/// <summary>A date field.</summary>
/// <remarks>
/// Composes <see cref="CalendarDatePicker"/>, which is sealed and already
/// carries the locale's calendar system and first day of the week.
/// </remarks>
public partial class DuVayCalendarDatePicker : ContentControl
{
    private readonly CalendarDatePicker _inner = new();

    public DuVayCalendarDatePicker()
    {
        _inner.IsTodayHighlighted = true;
        Content = _inner;
    }

    public CalendarDatePicker Inner => _inner;

    public string Label
    {
        get => _inner.Header as string ?? string.Empty;
        set => _inner.Header = value;
    }

    public System.DateTimeOffset? Date
    {
        get => _inner.Date;
        set => _inner.Date = value;
    }
}

/// <summary>A time-of-day field.</summary>
public partial class DuVayTimePicker : ContentControl
{
    private readonly TimePicker _inner = new();

    public DuVayTimePicker()
    {
        // 12- versus 24-hour is a locale decision, not ours.
        _inner.ClockIdentifier = "24HourClock";
        Content = _inner;
    }

    public TimePicker Inner => _inner;

    public string Label
    {
        get => _inner.Header as string ?? string.Empty;
        set => _inner.Header = value;
    }

    public System.TimeSpan Time
    {
        get => _inner.Time;
        set => _inner.Time = value;
    }
}

/// <summary>A data grid.</summary>
/// <remarks>
/// WinUI ships no DataGrid, so this is a <see cref="ListView"/> with a header
/// row. ListView virtualises and exposes real item semantics, which a stack of
/// panels would not.
/// </remarks>
public partial class DuVayDataGrid : ContentControl
{
    private readonly ListView _rows = new();
    private readonly StackPanel _header = new();
    private readonly StackPanel _root = new();

    public DuVayDataGrid()
    {
        _header.Orientation = Orientation.Horizontal;
        _header.Spacing = DuVayTokens.Space4;
        _header.Padding = new Thickness(DuVayTokens.Space2);

        _root.Orientation = Orientation.Vertical;
        _root.Children.Add(_header);
        _root.Children.Add(_rows);

        AutomationProperties.SetName(this, "Table");
        Content = _root;
    }

    public ListView Rows => _rows;

    public void SetColumns(params string[] titles)
    {
        _header.Children.Clear();
        foreach (var title in titles)
        {
            var cell = new TextBlock { Text = title, FontSize = DuVayTokens.FontXs };
            AutomationProperties.SetHeadingLevel(cell, Microsoft.UI.Xaml.Automation.Peers.AutomationHeadingLevel.Level3);
            _header.Children.Add(cell);
        }
    }
}
