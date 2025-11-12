package ui

// Header component replicates the Figma Header layout using Fyne v2 widgets.
// It provides navigation (连接管理器/远程终端), search toggle, new connection,
// settings/help buttons, and a right-side status area. Callbacks are injected
// from the caller to keep the UI layer lightweight and focused on presentation.

import (
	"fmt"
	"image/color"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
)

// HeaderProps defines the callbacks for Header interactions.
type HeaderProps struct {
	OnNewConnection     func()
	OnOpenConnectionMgr func()
	OnOpenTerminal      func()
	// Optional: backend ping to verify service availability
	OnPing func() (ok bool, msg string, err error)
}

// NewHeader creates a Figma-like header.
// Note: Fyne does not support CSS variants; we approximate visual style using
// containers, labels, and spacers while keeping layout hierarchy aligned to the design.
func NewHeader(props HeaderProps, window fyne.Window) *fyne.Container {
	// Brand area: square with "EN" + title EasyNode
	brandSquare := NewSquareBadge("EN", 32, color.NRGBA{R: 255, G: 165, B: 0, A: 255}, color.NRGBA{R: 255, G: 255, B: 255, A: 255})
	brand := container.NewHBox(
		brandSquare,
		widget.NewLabel("EasyNode"),
	)

	// Navigation buttons
	connMgrBtn := widget.NewButton("连接管理器", func() {
		if props.OnOpenConnectionMgr != nil {
			props.OnOpenConnectionMgr()
		}
	})
	terminalBtn := widget.NewButton("远程终端", func() {
		if props.OnOpenTerminal != nil {
			props.OnOpenTerminal()
		}
	})
	nav := container.NewHBox(connMgrBtn, terminalBtn)

	// Search toggle
	searchEntry := widget.NewEntry()
	searchEntry.SetPlaceHolder("快捷搜索连接...")
	searchEntry.Hide()
	searchBtn := widget.NewButton("搜索", func() {
		fmt.Println("[USER] 点击了搜索切换按钮")
		if searchEntry.Visible() {
			searchEntry.Hide()
		} else {
			searchEntry.Show()
			// 尝试将焦点置于搜索框，提升体验
			window.Canvas().Focus(searchEntry)
			fmt.Println("[UI] 搜索框已显示并尝试获得焦点")
		}
	})

	// New connection
	newConnBtn := widget.NewButton("新建连接", func() {
		fmt.Println("[USER] 点击了新建连接按钮")
		if props.OnNewConnection != nil {
			props.OnNewConnection()
		}
	})

	// Settings & Help
	settingsBtn := widget.NewButton("设置", func() { fmt.Println("[USER] 点击了设置按钮") })
	helpBtn := widget.NewButton("帮助", func() { fmt.Println("[USER] 点击了帮助按钮") })

	// Right-side status and badges (approximation)
	versionLabel := container.NewHBox(
		widget.NewLabel("版本更新中"),
		NewBadge("即将发布", color.NRGBA{R: 255, G: 165, B: 0, A: 255}, color.NRGBA{R: 255, G: 255, B: 255, A: 255}),
		widget.NewLabel("1115714829"),
		NewBadge("SVIP", color.NRGBA{R: 200, G: 200, B: 200, A: 255}, color.NRGBA{R: 0, G: 0, B: 0, A: 255}),
	)

	// Optional ping to backend
	pingBtn := widget.NewButton("测试连接", nil)
	loading := widget.NewProgressBarInfinite()
	loading.Hide()
	pingBtn.OnTapped = func() {
		fmt.Println("[USER] 点击了测试连接按钮（Header）")
		if props.OnPing == nil {
			return
		}
		pingBtn.Disable()
		loading.Show()
		go func() {
			ok, msg, err := props.OnPing()
			fyne.Do(func() {
				loading.Hide()
				pingBtn.Enable()
				if err != nil {
					ShowError(window, err)
					return
				}
				if ok {
					ShowInfo(window, "连接测试", "成功: "+msg)
				} else {
					ShowError(window, fmt.Errorf("失败: %s", msg))
				}
			})
		}()
	}

	left := container.NewHBox(brand, nav)
	right := container.NewHBox(searchBtn, searchEntry, newConnBtn, settingsBtn, helpBtn, versionLabel, container.NewHBox(pingBtn, loading))

	header := container.NewBorder(nil, nil, left, right, nil)
	return container.NewPadded(header)
}
