package ui

import (
    "image/color"
    "fyne.io/fyne/v2"
    "fyne.io/fyne/v2/theme"
)

// LightTheme is a simple white-background, black-text theme approximating the Figma light style.
type LightTheme struct{}

// NewLightTheme creates a new light theme instance.
func NewLightTheme() fyne.Theme { return &LightTheme{} }

// Color overrides key colors to enforce white BG and black FG.
func (t *LightTheme) Color(name fyne.ThemeColorName, variant fyne.ThemeVariant) color.Color {
    switch name {
    case theme.ColorNameBackground:
        return color.NRGBA{R: 255, G: 255, B: 255, A: 255}
    case theme.ColorNameForeground:
        return color.NRGBA{R: 0, G: 0, B: 0, A: 255}
    case theme.ColorNameDisabled:
        // 统一禁用态为浅灰文本，避免黑底黑字
        return color.NRGBA{R: 150, G: 150, B: 150, A: 255}
    case theme.ColorNamePrimary:
        // Use a neutral blue for primary accents
        return color.NRGBA{R: 30, G: 120, B: 240, A: 255}
    case theme.ColorNameFocus:
        // 轻微焦点环
        return color.NRGBA{R: 30, G: 120, B: 240, A: 128}
    case theme.ColorNameHover:
        return color.NRGBA{R: 245, G: 245, B: 245, A: 255}
    // removed duplicate disabled case
    case theme.ColorNamePlaceHolder:
        return color.NRGBA{R: 140, G: 140, B: 140, A: 255}
    case theme.ColorNameButton:
        return color.NRGBA{R: 255, G: 255, B: 255, A: 255}
    case theme.ColorNameInputBackground:
        return color.NRGBA{R: 255, G: 255, B: 255, A: 255}
    case theme.ColorNameSelection:
        return color.NRGBA{R: 230, G: 240, B: 255, A: 255}
    case theme.ColorNameSeparator:
        return color.NRGBA{R: 220, G: 220, B: 220, A: 255}
    case theme.ColorNameShadow:
        // Lighter overlay shadow to avoid black modal feel
        return color.NRGBA{R: 0, G: 0, B: 0, A: 24}
    case theme.ColorNameOverlayBackground:
        // 关键：将叠加层改为不透明白色，彻底移除黑灰透明感
        return color.NRGBA{R: 255, G: 255, B: 255, A: 255}
    // Dialog-specific colors are not exposed directly by the theme API,
    // but ensuring foreground/background above stays white/black will make
    // dialog content adhere to light style.
    default:
        return theme.DefaultTheme().Color(name, variant)
    }
}

// Icon falls back to the default theme icons.
func (t *LightTheme) Icon(name fyne.ThemeIconName) fyne.Resource {
    return theme.DefaultTheme().Icon(name)
}

// Font falls back to the default theme fonts.
func (t *LightTheme) Font(style fyne.TextStyle) fyne.Resource {
    return theme.DefaultTheme().Font(style)
}

// Size falls back to the default theme sizes.
func (t *LightTheme) Size(name fyne.ThemeSizeName) float32 {
    return theme.DefaultTheme().Size(name)
}