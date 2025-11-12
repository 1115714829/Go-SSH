package ui

import (
	"image/color"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/canvas"
	"fyne.io/fyne/v2/container"
)

// NewBadge creates a small rounded badge with background color and text.
func NewBadge(text string, bg color.NRGBA, fg color.NRGBA) *fyne.Container {
	rect := canvas.NewRectangle(bg)
	rect.SetMinSize(fyne.NewSize(72, 24))
	t := canvas.NewText(text, fg)
	t.Alignment = fyne.TextAlignCenter
	t.TextStyle = fyne.TextStyle{Bold: true}
	t.TextSize = 12
	return container.NewMax(rect, container.NewCenter(t))
}

// NewSquareBadge creates a square badge used for brand initials.
func NewSquareBadge(text string, size float32, bg color.NRGBA, fg color.NRGBA) *fyne.Container {
	rect := canvas.NewRectangle(bg)
	rect.SetMinSize(fyne.NewSize(size, size))
	t := canvas.NewText(text, fg)
	t.Alignment = fyne.TextAlignCenter
	t.TextStyle = fyne.TextStyle{Bold: true}
	t.TextSize = 14
	return container.NewMax(rect, container.NewCenter(t))
}
