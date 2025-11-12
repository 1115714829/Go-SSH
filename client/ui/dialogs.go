package ui

import (
    "fmt"
    "fyne.io/fyne/v2"
    "fyne.io/fyne/v2/dialog"
)

// ShowInfo 显示统一的信息对话框，并记录日志
func ShowInfo(win fyne.Window, title, message string) {
    fmt.Printf("[DIALOG] Info: %s - %s\n", title, message)
    dialog.ShowInformation(title, message, win)
}

// ShowError 显示统一的错误对话框，并记录日志
func ShowError(win fyne.Window, err error) {
    fmt.Printf("[DIALOG] Error: %v\n", err)
    dialog.ShowError(err, win)
}

// ShowConfirm 显示统一的自定义确认表单对话框，统一尺寸与日志
func ShowConfirm(win fyne.Window, title string, content fyne.CanvasObject, confirmLabel, cancelLabel string, onConfirm func(bool)) dialog.Dialog {
    fmt.Printf("[DIALOG] Open Confirm: %s\n", title)
    d := dialog.NewCustomConfirm(title, confirmLabel, cancelLabel, content, func(confirmed bool) {
        fmt.Printf("[DIALOG] Confirm result for '%s': %v\n", title, confirmed)
        if onConfirm != nil {
            onConfirm(confirmed)
        }
    }, win)
    d.Resize(fyne.NewSize(500, 380))
    d.Show()
    return d
}

// ShowCustom 显示统一的自定义模态对话框，统一尺寸与日志
func ShowCustom(win fyne.Window, title, dismissLabel string, content fyne.CanvasObject) dialog.Dialog {
    fmt.Printf("[DIALOG] Open Custom: %s\n", title)
    d := dialog.NewCustom(title, dismissLabel, content, win)
    d.Resize(fyne.NewSize(500, 380))
    d.Show()
    return d
}

