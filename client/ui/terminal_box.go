package ui

import (
    "image/color"
    "fyne.io/fyne/v2"
    "fyne.io/fyne/v2/canvas"
    "fyne.io/fyne/v2/container"
)

// NewTerminalPlaceholder returns a black background terminal-like box with white monospace text.
func NewTerminalPlaceholder(text string) *fyne.Container {
    bg := canvas.NewRectangle(color.NRGBA{R:0, G:0, B:0, A:255})
    bg.SetMinSize(fyne.NewSize(600, 400))
    t := canvas.NewText(text, color.NRGBA{R:255, G:255, B:255, A:255})
    t.TextStyle.Monospace = true
    t.TextSize = 14
    return container.NewMax(bg, container.NewCenter(t))
}