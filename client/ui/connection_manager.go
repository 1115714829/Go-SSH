package ui

// ConnectionManager approximates the Figma modal for managing connections.
// It shows a scrollable list and basic toolbar with checkboxes, and supports
// select and double-click to connect callbacks.

import (
	"fmt"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/dialog"
	"fyne.io/fyne/v2/widget"
)

type Connection struct {
	ID   string
	Name string
	Type string // "connection" or "folder"
}

type ConnectionManagerProps struct {
	Window      fyne.Window
	Connections []Connection
	OnConnect   func(conn Connection)
}

// NewConnectionManagerModal creates a modal-like dialog using Fyne components.
func NewConnectionManagerModal(props ConnectionManagerProps) dialog.Dialog {
	title := widget.NewLabel("连接管理器")
	title.TextStyle = fyne.TextStyle{Bold: true}

	// Toolbar checkboxes (approximate)
	showDeleted := widget.NewCheck("显示已删除", func(v bool) {})

	toolbar := container.NewHBox(showDeleted)

	// List area
	list := widget.NewList(
		func() int { return len(props.Connections) },
		func() fyne.CanvasObject {
			return container.NewHBox(
				widget.NewIcon(nil),
				widget.NewLabel("name"),
			)
		},
		func(i widget.ListItemID, o fyne.CanvasObject) {
			conn := props.Connections[i]
			// Replace icon based on type
			box := o.(*fyne.Container)
			if len(box.Objects) >= 2 {
				label := box.Objects[1].(*widget.Label)
				label.SetText(conn.Name)
			}
		},
	)

	// On item selection, double-click not directly supported; emulate with connect button
	var selectedIndex int = -1
	list.OnSelected = func(id widget.ListItemID) {
		selectedIndex = int(id)
		fmt.Printf("[UI] 选中连接索引: %d\n", selectedIndex)
	}

	connectBtn := widget.NewButton("连接", func() {
		if selectedIndex >= 0 && selectedIndex < len(props.Connections) {
			if props.OnConnect != nil {
				props.OnConnect(props.Connections[selectedIndex])
			}
		}
	})

	content := container.NewBorder(
		container.NewVBox(title, toolbar), // top
		connectBtn,                        // bottom
		nil, nil,
		list,
	)

	// 统一包装的自定义对话框，确保尺寸与日志一致
	return ShowCustom(props.Window, "连接管理器", "关闭", content)
}

// NOTE: Using nil icons as placeholder; can replace with theme icons later for richer visuals.
