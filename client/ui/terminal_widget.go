package ui

import (
    "fyne.io/fyne/v2"
    terminal "github.com/fyne-io/terminal"
)

func NewLocalTerminal() fyne.CanvasObject {
    t := terminal.New()
    go t.RunLocalShell()
    return t
}
