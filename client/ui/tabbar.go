package ui

// TabBar replicates the Figma TabBar with closable tabs and an add button.
// We use Fyne's AppTabs for tabbed UI, and provide simple APIs to add/remove tabs.

import (
	"fmt"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
)

type TabBar struct {
	Tabs    *container.AppTabs
	AddBtn  *widget.Button
	OnAdd   func()
	OnClose func(tabTitle string)
	// Quick toggle buttons
	ToggleSFTPBtn     *widget.Button
	ToggleExplorerBtn *widget.Button
}

// NewTabBar creates a TabBar with an "+ 新终端" button.
func NewTabBar(onAdd func(), onClose func(tabTitle string)) *TabBar {
	t := &TabBar{
		Tabs: container.NewAppTabs(),
		AddBtn: widget.NewButton("+ 新终端", func() {
			if onAdd != nil {
				onAdd()
			}
		}),
		OnAdd:   onAdd,
		OnClose: onClose,
	}
	t.ToggleSFTPBtn = widget.NewButton("隐藏SFTP", func() {
		// TODO: hook this to actual SFTP panel visibility
		fmt.Println("[USER] 点击了隐藏SFTP按钮（占位）")
	})
	t.ToggleExplorerBtn = widget.NewButton("隐藏资源管理器", func() {
		// TODO: hook this to actual explorer panel visibility
		fmt.Println("[USER] 点击了隐藏资源管理器按钮（占位）")
	})
	return t
}

// AddTerminalTab appends a new terminal tab.
func (t *TabBar) AddTerminalTab(title string, content fyne.CanvasObject) {
	tab := container.NewTabItem(title, content)
	t.Tabs.Append(tab)
	t.Tabs.Select(tab)
}

// CloseCurrent closes the currently selected tab (if any).
func (t *TabBar) CloseCurrent() {
	sel := t.Tabs.Selected()
	if sel == nil {
		return
	}
	title := sel.Text
	t.Tabs.Remove(sel)
	if t.OnClose != nil {
		t.OnClose(title)
	}
}

// HeaderBar returns a control bar to place above the tabs, including add button.
func (t *TabBar) HeaderBar() *fyne.Container {
	closeBtn := widget.NewButton("关闭当前", func() { t.CloseCurrent() })
	controls := container.NewHBox(t.AddBtn, t.ToggleSFTPBtn, t.ToggleExplorerBtn)
	return container.NewBorder(nil, nil, controls, closeBtn, nil)
}

// DebugPopulate adds a welcome tab for initial state.
func (t *TabBar) DebugPopulate() {
	t.AddTerminalTab("欢迎", container.NewCenter(widget.NewLabel("请新建连接以开始使用终端")))
	fmt.Println("[UI] TabBar 初始化完成，包含默认欢迎标签")
}
