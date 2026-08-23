// DuVay design tokens — GENERATED, do not edit.
// Source of truth: tokens/**/*.json. Regenerate with `bun run tokens:native`.

#![allow(dead_code)]

/// Dimensions in logical pixels.
pub mod dimension {
    pub const FONT_XS: f64 = 12.0;
    pub const FONT_SM: f64 = 12.0;
    pub const FONT_BASE: f64 = 14.0;
    pub const FONT_MD: f64 = 15.0;
    pub const FONT_LG: f64 = 17.0;
    pub const FONT_XL: f64 = 20.0;
    pub const FONT_2XL: f64 = 24.0;
    pub const FONT_3XL: f64 = 36.0;
    pub const SPACE_1: f64 = 4.0;
    pub const SPACE_1_5: f64 = 6.0;
    pub const SPACE_2: f64 = 8.0;
    pub const SPACE_3: f64 = 12.0;
    pub const SPACE_4: f64 = 16.0;
    pub const SPACE_5: f64 = 20.0;
    pub const SPACE_6: f64 = 24.0;
    pub const SPACE_7: f64 = 28.0;
    pub const SPACE_8: f64 = 32.0;
    pub const SPACE_9: f64 = 36.0;
    pub const SPACE_10: f64 = 40.0;
    pub const SPACE_11: f64 = 44.0;
    pub const SPACE_12: f64 = 48.0;
    pub const SPACE_13: f64 = 52.0;
    pub const SPACE_14: f64 = 56.0;
    pub const SPACE_15: f64 = 60.0;
    pub const SPACE_16: f64 = 64.0;
    pub const SPACE_20: f64 = 80.0;
    pub const SPACE_XS: f64 = 4.0;
    pub const SPACE_SM: f64 = 8.0;
    pub const SPACE_MD: f64 = 12.0;
    pub const SPACE_LG: f64 = 16.0;
    pub const SPACE_XL: f64 = 20.0;
    pub const SPACE_2XL: f64 = 24.0;
    pub const SPACE_3XL: f64 = 32.0;
    pub const TOUCH_MIN: f64 = 44.0;
    pub const SIZE_XS: f64 = 28.0;
    pub const SIZE_SM: f64 = 32.0;
    pub const SIZE_MD: f64 = 40.0;
    pub const SIZE_LG: f64 = 48.0;
    pub const SIZE_XL: f64 = 56.0;
    pub const SIZE_ICON_XS: f64 = 28.0;
    pub const SIZE_ICON_SM: f64 = 32.0;
    pub const SIZE_ICON_MD: f64 = 40.0;
    pub const SIZE_ICON_LG: f64 = 48.0;
    pub const SIZE_ICON_XL: f64 = 56.0;
    pub const COMMAND_MAX_WIDTH: f64 = 512.0;
    pub const COMMAND_LIST_MAX_HEIGHT: f64 = 320.0;
    pub const COMMAND_INPUT_MIN_HEIGHT: f64 = 36.0;
    pub const COMMAND_ITEM_MIN_HEIGHT: f64 = 40.0;
    pub const COMMAND_CONTENT_GAP: f64 = 1.0;
    pub const PIE_SIZE: f64 = 192.0;
    pub const VIDEO_SEEK_WIDTH: f64 = 64.0;
    pub const VIDEO_VOLUME_WIDTH: f64 = 80.0;
    pub const ICON_GLYPH_XS: f64 = 14.0;
    pub const ICON_GLYPH_SM: f64 = 16.0;
    pub const ICON_GLYPH_MD: f64 = 20.0;
    pub const ICON_GLYPH_LG: f64 = 24.0;
    pub const ICON_GLYPH_XL: f64 = 28.0;
    pub const RADIUS_SM: f64 = 2.0;
    pub const RADIUS: f64 = 4.0;
    pub const RADIUS_MD: f64 = 6.0;
    pub const RADIUS_LG: f64 = 8.0;
    pub const RADIUS_XL: f64 = 12.0;
    pub const RADIUS_PILL: f64 = 999.0;
    pub const FOCUS_RING_WIDTH: f64 = 2.0;
    pub const FOCUS_RING_OFFSET: f64 = 2.0;
    pub const TOPBAR_HEIGHT: f64 = 56.0;
    pub const SIDEBAR_WIDTH: f64 = 232.0;
    pub const DRAWER_WIDTH: f64 = 256.0;
    pub const DRAWER_RAIL_WIDTH: f64 = 72.0;
    pub const MOBILE_NAV_HEIGHT: f64 = 64.0;
    pub const GRID_GUTTER: f64 = 24.0;
    pub const CONTAINER_MAX: f64 = 1200.0;
    pub const MOTION_DISTANCE_X: f64 = 24.0;
    pub const MOTION_DISTANCE_Y: f64 = 12.0;
    pub const APP_BAR_BACKDROP_BLUR: f64 = 16.0;
}

/// Durations in milliseconds.
pub mod duration {
    pub const MOTION_DURATION_FAST: u32 = 120;
    pub const MOTION_DURATION: u32 = 180;
    pub const MOTION_DURATION_SLOW: u32 = 260;
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Theme {
    Light,
    Dark,
    Auto,
    HighContrast,
}

impl Theme {
    pub fn id(self) -> &'static str {
        match self {
            Theme::Light => "light",
            Theme::Dark => "dark",
            Theme::Auto => "auto",
            Theme::HighContrast => "high-contrast",
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Rgba { pub r: u8, pub g: u8, pub b: u8, pub a: f32 }

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Palette {
    pub accent: Rgba,
    pub accent_bg: Rgba,
    pub app_bar_frosted: Rgba,
    pub border: Rgba,
    pub divider: Rgba,
    pub error: Rgba,
    pub error_container: Rgba,
    pub highlight_color: Rgba,
    pub hover: Rgba,
    pub inverse_on_surface: Rgba,
    pub inverse_primary: Rgba,
    pub inverse_surface: Rgba,
    pub on_accent: Rgba,
    pub on_error: Rgba,
    pub on_error_container: Rgba,
    pub on_primary: Rgba,
    pub on_primary_container: Rgba,
    pub on_secondary_container: Rgba,
    pub on_success: Rgba,
    pub on_success_container: Rgba,
    pub on_tertiary_container: Rgba,
    pub on_warning: Rgba,
    pub on_warning_container: Rgba,
    pub outline: Rgba,
    pub primary: Rgba,
    pub primary_container: Rgba,
    pub primary_muted: Rgba,
    pub scrim: Rgba,
    pub secondary: Rgba,
    pub secondary_container: Rgba,
    pub selected: Rgba,
    pub selected_text: Rgba,
    pub shadow_color: Rgba,
    pub sidebar: Rgba,
    pub success: Rgba,
    pub success_container: Rgba,
    pub surface: Rgba,
    pub surface_container: Rgba,
    pub surface_container_high: Rgba,
    pub surface_container_low: Rgba,
    pub surface_raised: Rgba,
    pub tertiary_container: Rgba,
    pub text: Rgba,
    pub text_muted: Rgba,
    pub text_subtle: Rgba,
    pub text_very_subtle: Rgba,
    pub toolbar: Rgba,
    pub video_poster: Rgba,
    pub warning: Rgba,
    pub warning_container: Rgba,
}

pub const LIGHT: Palette = Palette {
    accent: Rgba { r: 31, g: 111, b: 139, a: 1.0000 },
    accent_bg: Rgba { r: 31, g: 111, b: 139, a: 1.0000 },
    app_bar_frosted: Rgba { r: 248, g: 250, b: 249, a: 0.8400 },
    border: Rgba { r: 208, g: 219, b: 216, a: 1.0000 },
    divider: Rgba { r: 216, g: 224, b: 222, a: 1.0000 },
    error: Rgba { r: 179, g: 38, b: 30, a: 1.0000 },
    error_container: Rgba { r: 249, g: 222, b: 220, a: 1.0000 },
    highlight_color: Rgba { r: 196, g: 120, b: 0, a: 1.0000 },
    hover: Rgba { r: 234, g: 241, b: 239, a: 1.0000 },
    inverse_on_surface: Rgba { r: 244, g: 239, b: 244, a: 1.0000 },
    inverse_primary: Rgba { r: 131, g: 205, b: 227, a: 1.0000 },
    inverse_surface: Rgba { r: 49, g: 48, b: 51, a: 1.0000 },
    on_accent: Rgba { r: 255, g: 255, b: 255, a: 1.0000 },
    on_error: Rgba { r: 255, g: 255, b: 255, a: 1.0000 },
    on_error_container: Rgba { r: 65, g: 14, b: 11, a: 1.0000 },
    on_primary: Rgba { r: 255, g: 255, b: 255, a: 1.0000 },
    on_primary_container: Rgba { r: 7, g: 53, b: 68, a: 1.0000 },
    on_secondary_container: Rgba { r: 39, g: 55, b: 51, a: 1.0000 },
    on_success: Rgba { r: 255, g: 255, b: 255, a: 1.0000 },
    on_success_container: Rgba { r: 27, g: 94, b: 32, a: 1.0000 },
    on_tertiary_container: Rgba { r: 73, g: 49, b: 22, a: 1.0000 },
    on_warning: Rgba { r: 42, g: 24, b: 0, a: 1.0000 },
    on_warning_container: Rgba { r: 73, g: 49, b: 22, a: 1.0000 },
    outline: Rgba { r: 126, g: 140, b: 136, a: 1.0000 },
    primary: Rgba { r: 31, g: 111, b: 139, a: 1.0000 },
    primary_container: Rgba { r: 215, g: 237, b: 244, a: 1.0000 },
    primary_muted: Rgba { r: 215, g: 237, b: 244, a: 1.0000 },
    scrim: Rgba { r: 0, g: 0, b: 0, a: 0.4000 },
    secondary: Rgba { r: 79, g: 99, b: 94, a: 1.0000 },
    secondary_container: Rgba { r: 230, g: 236, b: 233, a: 1.0000 },
    selected: Rgba { r: 220, g: 239, b: 243, a: 1.0000 },
    selected_text: Rgba { r: 16, g: 47, b: 58, a: 1.0000 },
    shadow_color: Rgba { r: 24, g: 33, b: 37, a: 0.1200 },
    sidebar: Rgba { r: 238, g: 243, b: 241, a: 1.0000 },
    success: Rgba { r: 46, g: 125, b: 50, a: 1.0000 },
    success_container: Rgba { r: 232, g: 245, b: 233, a: 1.0000 },
    surface: Rgba { r: 248, g: 250, b: 249, a: 1.0000 },
    surface_container: Rgba { r: 237, g: 243, b: 241, a: 1.0000 },
    surface_container_high: Rgba { r: 229, g: 236, b: 233, a: 1.0000 },
    surface_container_low: Rgba { r: 243, g: 247, b: 245, a: 1.0000 },
    surface_raised: Rgba { r: 229, g: 236, b: 233, a: 1.0000 },
    tertiary_container: Rgba { r: 244, g: 228, b: 199, a: 1.0000 },
    text: Rgba { r: 24, g: 33, b: 37, a: 1.0000 },
    text_muted: Rgba { r: 82, g: 96, b: 102, a: 1.0000 },
    text_subtle: Rgba { r: 82, g: 96, b: 102, a: 1.0000 },
    text_very_subtle: Rgba { r: 123, g: 135, b: 140, a: 1.0000 },
    toolbar: Rgba { r: 241, g: 245, b: 244, a: 1.0000 },
    video_poster: Rgba { r: 0, g: 0, b: 0, a: 1.0000 },
    warning: Rgba { r: 196, g: 120, b: 0, a: 1.0000 },
    warning_container: Rgba { r: 244, g: 228, b: 199, a: 1.0000 },
};

pub const DARK: Palette = Palette {
    accent: Rgba { r: 131, g: 205, b: 227, a: 1.0000 },
    accent_bg: Rgba { r: 131, g: 205, b: 227, a: 1.0000 },
    app_bar_frosted: Rgba { r: 28, g: 34, b: 36, a: 0.8400 },
    border: Rgba { r: 58, g: 70, b: 74, a: 1.0000 },
    divider: Rgba { r: 49, g: 59, b: 62, a: 1.0000 },
    error: Rgba { r: 242, g: 184, b: 181, a: 1.0000 },
    error_container: Rgba { r: 140, g: 29, b: 24, a: 1.0000 },
    highlight_color: Rgba { r: 255, g: 184, b: 107, a: 1.0000 },
    hover: Rgba { r: 255, g: 255, b: 255, a: 0.0500 },
    inverse_on_surface: Rgba { r: 49, g: 48, b: 51, a: 1.0000 },
    inverse_primary: Rgba { r: 31, g: 111, b: 139, a: 1.0000 },
    inverse_surface: Rgba { r: 244, g: 239, b: 244, a: 1.0000 },
    on_accent: Rgba { r: 8, g: 50, b: 63, a: 1.0000 },
    on_error: Rgba { r: 65, g: 14, b: 11, a: 1.0000 },
    on_error_container: Rgba { r: 249, g: 222, b: 220, a: 1.0000 },
    on_primary: Rgba { r: 8, g: 50, b: 63, a: 1.0000 },
    on_primary_container: Rgba { r: 232, g: 248, b: 252, a: 1.0000 },
    on_secondary_container: Rgba { r: 220, g: 231, b: 228, a: 1.0000 },
    on_success: Rgba { r: 11, g: 46, b: 14, a: 1.0000 },
    on_success_container: Rgba { r: 232, g: 245, b: 233, a: 1.0000 },
    on_tertiary_container: Rgba { r: 255, g: 226, b: 184, a: 1.0000 },
    on_warning: Rgba { r: 61, g: 34, b: 0, a: 1.0000 },
    on_warning_container: Rgba { r: 255, g: 226, b: 184, a: 1.0000 },
    outline: Rgba { r: 108, g: 123, b: 127, a: 1.0000 },
    primary: Rgba { r: 131, g: 205, b: 227, a: 1.0000 },
    primary_container: Rgba { r: 131, g: 205, b: 227, a: 0.1800 },
    primary_muted: Rgba { r: 131, g: 205, b: 227, a: 0.1800 },
    scrim: Rgba { r: 0, g: 0, b: 0, a: 0.6000 },
    secondary: Rgba { r: 173, g: 201, b: 194, a: 1.0000 },
    secondary_container: Rgba { r: 47, g: 59, b: 58, a: 1.0000 },
    selected: Rgba { r: 131, g: 205, b: 227, a: 0.1800 },
    selected_text: Rgba { r: 159, g: 216, b: 230, a: 1.0000 },
    shadow_color: Rgba { r: 0, g: 0, b: 0, a: 0.4000 },
    sidebar: Rgba { r: 22, g: 28, b: 30, a: 1.0000 },
    success: Rgba { r: 129, g: 199, b: 132, a: 1.0000 },
    success_container: Rgba { r: 27, g: 94, b: 32, a: 1.0000 },
    surface: Rgba { r: 28, g: 34, b: 36, a: 1.0000 },
    surface_container: Rgba { r: 255, g: 255, b: 255, a: 0.0500 },
    surface_container_high: Rgba { r: 34, g: 42, b: 45, a: 1.0000 },
    surface_container_low: Rgba { r: 22, g: 28, b: 30, a: 1.0000 },
    surface_raised: Rgba { r: 34, g: 42, b: 45, a: 1.0000 },
    tertiary_container: Rgba { r: 90, g: 70, b: 48, a: 1.0000 },
    text: Rgba { r: 238, g: 238, b: 238, a: 1.0000 },
    text_muted: Rgba { r: 255, g: 255, b: 255, a: 0.6000 },
    text_subtle: Rgba { r: 255, g: 255, b: 255, a: 0.6000 },
    text_very_subtle: Rgba { r: 255, g: 255, b: 255, a: 0.5500 },
    toolbar: Rgba { r: 34, g: 42, b: 45, a: 1.0000 },
    video_poster: Rgba { r: 0, g: 0, b: 0, a: 1.0000 },
    warning: Rgba { r: 255, g: 184, b: 107, a: 1.0000 },
    warning_container: Rgba { r: 90, g: 70, b: 48, a: 1.0000 },
};

pub const AUTO: Palette = Palette {
    accent: Rgba { r: 131, g: 205, b: 227, a: 1.0000 },
    accent_bg: Rgba { r: 131, g: 205, b: 227, a: 1.0000 },
    app_bar_frosted: Rgba { r: 28, g: 34, b: 36, a: 0.8400 },
    border: Rgba { r: 58, g: 70, b: 74, a: 1.0000 },
    divider: Rgba { r: 49, g: 59, b: 62, a: 1.0000 },
    error: Rgba { r: 242, g: 184, b: 181, a: 1.0000 },
    error_container: Rgba { r: 140, g: 29, b: 24, a: 1.0000 },
    highlight_color: Rgba { r: 255, g: 184, b: 107, a: 1.0000 },
    hover: Rgba { r: 255, g: 255, b: 255, a: 0.0500 },
    inverse_on_surface: Rgba { r: 49, g: 48, b: 51, a: 1.0000 },
    inverse_primary: Rgba { r: 31, g: 111, b: 139, a: 1.0000 },
    inverse_surface: Rgba { r: 244, g: 239, b: 244, a: 1.0000 },
    on_accent: Rgba { r: 8, g: 50, b: 63, a: 1.0000 },
    on_error: Rgba { r: 65, g: 14, b: 11, a: 1.0000 },
    on_error_container: Rgba { r: 249, g: 222, b: 220, a: 1.0000 },
    on_primary: Rgba { r: 8, g: 50, b: 63, a: 1.0000 },
    on_primary_container: Rgba { r: 232, g: 248, b: 252, a: 1.0000 },
    on_secondary_container: Rgba { r: 220, g: 231, b: 228, a: 1.0000 },
    on_success: Rgba { r: 11, g: 46, b: 14, a: 1.0000 },
    on_success_container: Rgba { r: 232, g: 245, b: 233, a: 1.0000 },
    on_tertiary_container: Rgba { r: 255, g: 226, b: 184, a: 1.0000 },
    on_warning: Rgba { r: 61, g: 34, b: 0, a: 1.0000 },
    on_warning_container: Rgba { r: 255, g: 226, b: 184, a: 1.0000 },
    outline: Rgba { r: 108, g: 123, b: 127, a: 1.0000 },
    primary: Rgba { r: 131, g: 205, b: 227, a: 1.0000 },
    primary_container: Rgba { r: 131, g: 205, b: 227, a: 0.1800 },
    primary_muted: Rgba { r: 0, g: 0, b: 0, a: 0.0000 },
    scrim: Rgba { r: 0, g: 0, b: 0, a: 0.6000 },
    secondary: Rgba { r: 173, g: 201, b: 194, a: 1.0000 },
    secondary_container: Rgba { r: 47, g: 59, b: 58, a: 1.0000 },
    selected: Rgba { r: 131, g: 205, b: 227, a: 0.1800 },
    selected_text: Rgba { r: 159, g: 216, b: 230, a: 1.0000 },
    shadow_color: Rgba { r: 0, g: 0, b: 0, a: 0.4000 },
    sidebar: Rgba { r: 22, g: 28, b: 30, a: 1.0000 },
    success: Rgba { r: 129, g: 199, b: 132, a: 1.0000 },
    success_container: Rgba { r: 27, g: 94, b: 32, a: 1.0000 },
    surface: Rgba { r: 28, g: 34, b: 36, a: 1.0000 },
    surface_container: Rgba { r: 255, g: 255, b: 255, a: 0.0500 },
    surface_container_high: Rgba { r: 34, g: 42, b: 45, a: 1.0000 },
    surface_container_low: Rgba { r: 22, g: 28, b: 30, a: 1.0000 },
    surface_raised: Rgba { r: 0, g: 0, b: 0, a: 0.0000 },
    tertiary_container: Rgba { r: 90, g: 70, b: 48, a: 1.0000 },
    text: Rgba { r: 238, g: 238, b: 238, a: 1.0000 },
    text_muted: Rgba { r: 0, g: 0, b: 0, a: 0.0000 },
    text_subtle: Rgba { r: 255, g: 255, b: 255, a: 0.6000 },
    text_very_subtle: Rgba { r: 255, g: 255, b: 255, a: 0.5500 },
    toolbar: Rgba { r: 34, g: 42, b: 45, a: 1.0000 },
    video_poster: Rgba { r: 0, g: 0, b: 0, a: 1.0000 },
    warning: Rgba { r: 255, g: 184, b: 107, a: 1.0000 },
    warning_container: Rgba { r: 90, g: 70, b: 48, a: 1.0000 },
};

pub const HIGH_CONTRAST: Palette = Palette {
    accent: Rgba { r: 0, g: 58, b: 79, a: 1.0000 },
    accent_bg: Rgba { r: 0, g: 58, b: 79, a: 1.0000 },
    app_bar_frosted: Rgba { r: 255, g: 255, b: 255, a: 0.9600 },
    border: Rgba { r: 74, g: 85, b: 89, a: 1.0000 },
    divider: Rgba { r: 110, g: 122, b: 128, a: 1.0000 },
    error: Rgba { r: 115, g: 0, b: 9, a: 1.0000 },
    error_container: Rgba { r: 255, g: 213, b: 210, a: 1.0000 },
    highlight_color: Rgba { r: 110, g: 63, b: 0, a: 1.0000 },
    hover: Rgba { r: 212, g: 227, b: 232, a: 1.0000 },
    inverse_on_surface: Rgba { r: 255, g: 255, b: 255, a: 1.0000 },
    inverse_primary: Rgba { r: 131, g: 205, b: 227, a: 1.0000 },
    inverse_surface: Rgba { r: 0, g: 0, b: 0, a: 1.0000 },
    on_accent: Rgba { r: 255, g: 255, b: 255, a: 1.0000 },
    on_error: Rgba { r: 255, g: 255, b: 255, a: 1.0000 },
    on_error_container: Rgba { r: 44, g: 0, b: 1, a: 1.0000 },
    on_primary: Rgba { r: 255, g: 255, b: 255, a: 1.0000 },
    on_primary_container: Rgba { r: 0, g: 24, b: 32, a: 1.0000 },
    on_secondary_container: Rgba { r: 12, g: 24, b: 21, a: 1.0000 },
    on_success: Rgba { r: 255, g: 255, b: 255, a: 1.0000 },
    on_success_container: Rgba { r: 5, g: 40, b: 7, a: 1.0000 },
    on_tertiary_container: Rgba { r: 42, g: 24, b: 0, a: 1.0000 },
    on_warning: Rgba { r: 255, g: 255, b: 255, a: 1.0000 },
    on_warning_container: Rgba { r: 42, g: 24, b: 0, a: 1.0000 },
    outline: Rgba { r: 74, g: 85, b: 89, a: 1.0000 },
    primary: Rgba { r: 0, g: 58, b: 79, a: 1.0000 },
    primary_container: Rgba { r: 182, g: 226, b: 238, a: 1.0000 },
    primary_muted: Rgba { r: 182, g: 226, b: 238, a: 1.0000 },
    scrim: Rgba { r: 0, g: 0, b: 0, a: 0.6000 },
    secondary: Rgba { r: 36, g: 77, b: 68, a: 1.0000 },
    secondary_container: Rgba { r: 214, g: 225, b: 222, a: 1.0000 },
    selected: Rgba { r: 182, g: 226, b: 238, a: 1.0000 },
    selected_text: Rgba { r: 0, g: 24, b: 32, a: 1.0000 },
    shadow_color: Rgba { r: 0, g: 0, b: 0, a: 0.2800 },
    sidebar: Rgba { r: 255, g: 255, b: 255, a: 1.0000 },
    success: Rgba { r: 20, g: 80, b: 23, a: 1.0000 },
    success_container: Rgba { r: 198, g: 236, b: 200, a: 1.0000 },
    surface: Rgba { r: 255, g: 255, b: 255, a: 1.0000 },
    surface_container: Rgba { r: 238, g: 242, b: 241, a: 1.0000 },
    surface_container_high: Rgba { r: 229, g: 235, b: 233, a: 1.0000 },
    surface_container_low: Rgba { r: 246, g: 248, b: 247, a: 1.0000 },
    surface_raised: Rgba { r: 229, g: 235, b: 233, a: 1.0000 },
    tertiary_container: Rgba { r: 255, g: 217, b: 168, a: 1.0000 },
    text: Rgba { r: 0, g: 0, b: 0, a: 1.0000 },
    text_muted: Rgba { r: 31, g: 42, b: 48, a: 1.0000 },
    text_subtle: Rgba { r: 31, g: 42, b: 48, a: 1.0000 },
    text_very_subtle: Rgba { r: 62, g: 74, b: 80, a: 1.0000 },
    toolbar: Rgba { r: 255, g: 255, b: 255, a: 1.0000 },
    video_poster: Rgba { r: 0, g: 0, b: 0, a: 1.0000 },
    warning: Rgba { r: 110, g: 63, b: 0, a: 1.0000 },
    warning_container: Rgba { r: 255, g: 217, b: 168, a: 1.0000 },
};

pub fn palette(theme: Theme) -> Palette {
    match theme {
        Theme::Light => LIGHT,
        Theme::Dark => DARK,
        Theme::Auto => AUTO,
        Theme::HighContrast => HIGH_CONTRAST,
    }
}
