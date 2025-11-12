package main

import (
    "fmt"
    "fyne.io/fyne/v2"
    "fyne.io/fyne/v2/app"
    "fyne.io/fyne/v2/container"
    "fyne.io/fyne/v2/widget"
    "go-ssh/client/client"
    ui "go-ssh/client/ui"
)
// main 启动 Fyne 原生桌面应用客户端。
// 前端仅负责 UI 展现与轻量 API 调用，数据与连接由后端统一管理。
func main() {
    fmt.Println("[INFO] 启动SSH客户端程序...")
    
    a := app.New()
    // 使用白底黑字的主题，贴近 Figma 设计
    a.Settings().SetTheme(ui.NewLightTheme())
    w := a.NewWindow("Go-SSH Client")
    w.Resize(fyne.NewSize(1200, 800))
    w.CenterOnScreen()
    
    fmt.Println("[INFO] 创建主窗口完成，尺寸: 1200x800")

    api := &client.APIClient{Addr: "localhost:8089"}

    // 1. 顶部菜单栏（Figma Header复刻）
    header := ui.NewHeader(ui.HeaderProps{
        OnNewConnection: func(){ showConnectDialog(w, api) },
        OnOpenConnectionMgr: func(){
            // TODO: replace mock connections with service/ListConnections()
            conns := []ui.Connection{
                {ID:"1", Name:"WSL", Type:"connection"},
                {ID:"2", Name:"服务器A", Type:"connection"},
                {ID:"f1", Name:"上海（用户ID7）", Type:"folder"},
            }
            dlg := ui.NewConnectionManagerModal(ui.ConnectionManagerProps{
                Window: w,
                Connections: conns,
                OnConnect: func(c ui.Connection){
                    fmt.Printf("[UI] 选择连接: %s (%s)\n", c.Name, c.ID)
                    // TODO: 调用后端 Connect 协议并在右侧创建终端标签
                },
            })
            dlg.Show()
        },
        OnOpenTerminal: func(){ /* 可切换到终端区域 */ },
        OnPing: func() (bool, string, error) {
            fmt.Println("[USER] 点击了测试连接按钮，开始请求后端 Ping...")
            resp, err := api.Ping()
            fmt.Printf("[DEBUG] Ping 返回: resp=%+v, err=%v\n", resp, err)
            if err != nil { return false, "", err }
            if resp.Ok { return true, "pong", nil }
            return false, resp.Message, nil
        },
    }, w)
    
    // 2. 左侧设备信息区
    deviceInfoPanel := createDeviceInfoPanel(api)
    
    // 右侧终端面板（TabBar封装）
    tabbar := ui.NewTabBar(nil, func(title string){ fmt.Println("[UI] 关闭标签:", title) })
    // 设置添加终端按钮逻辑（避免自引用初始化）
    tabbar.AddBtn.OnTapped = func(){
        tabbar.AddTerminalTab("终端", ui.NewLocalTerminal())
    }
    tabbar.DebugPopulate()

    // 主布局：顶部菜单 + 下方左右可拖动分区
    rightPane := container.NewBorder(tabbar.HeaderBar(), nil, nil, nil, tabbar.Tabs)
    split := container.NewHSplit(deviceInfoPanel, rightPane)
    split.Offset = 0.25 // 初始左侧占比 25%
    mainContent := container.NewBorder(
        header, // 顶部
        nil,    // 底部
        nil,    // 左侧（由 split 承载）
        nil,    // 右侧
        split,  // 中间区域为可拖动分割
    )

    fmt.Println("[INFO] 创建UI组件完成，准备显示主界面")
    
    w.SetContent(mainContent)
    fmt.Println("[INFO] 主界面设置完成，准备显示窗口")
    
    w.ShowAndRun()
}

// remove old menuBar; replaced by Figma-like header component

// createDeviceInfoPanel 创建设备信息面板
func createDeviceInfoPanel(api *client.APIClient) *fyne.Container {
    // 标题
    title := widget.NewLabel("设备信息")
    title.TextStyle = fyne.TextStyle{Bold: true}
    
    // 硬件信息组
    hwGroup := widget.NewCard("硬件信息", "",
        container.NewVBox(
            widget.NewLabel("CPU: 待获取"),
            widget.NewLabel("内存: 待获取"),
            widget.NewLabel("磁盘: 待获取"),
            widget.NewLabel("系统: 待获取"),
        ),
    )
    
    // 网络信息组
    netGroup := widget.NewCard("网络信息", "",
        container.NewVBox(
            widget.NewLabel("主机名: 待获取"),
            widget.NewLabel("IP地址: 待获取"),
            widget.NewLabel("MAC地址: 待获取"),
            widget.NewLabel("连接状态: 未连接"),
        ),
    )
    
    // 刷新按钮
    refreshBtn := widget.NewButton("刷新信息", func() {
        // TODO: 实现获取设备信息逻辑
    })
    
    content := container.NewVBox(
        title,
        hwGroup,
        netGroup,
        refreshBtn,
    )
    
    // 设置固定宽度
    scroll := container.NewScroll(content)
    scroll.SetMinSize(fyne.NewSize(200, 0))
    
    return container.NewBorder(nil, nil, nil, nil, scroll)
}

// createTerminalPanel 创建终端面板
func createTerminalPanel() *fyne.Container {
    // 标签页容器
    tabs := container.NewAppTabs()
    
    // 默认标签页
    welcomeTab := container.NewTabItem("欢迎", 
        container.NewCenter(
            widget.NewLabel("请新建连接以开始使用终端"),
        ),
    )
    tabs.Append(welcomeTab)
    
    // 添加新标签页按钮
    addTabBtn := widget.NewButton("+ 新终端", func() {
        // TODO: 实现新建终端标签页逻辑
    })
    
    // 终端控制栏
    controlBar := container.NewBorder(
        nil, nil,
        addTabBtn, nil,
        nil,
    )
    
    return container.NewBorder(
        controlBar, // 顶部控制栏
        nil, nil, nil,
        tabs,       // 终端内容区
    )
}

// showConnectDialog 显示连接对话框
func showConnectDialog(window fyne.Window, api *client.APIClient) {
    fmt.Println("[UI] 打开连接对话框")

    // 表单输入（确保遵循主题的白底黑字）
    hostEntry := widget.NewEntry()
    hostEntry.SetPlaceHolder("例如: 192.168.1.100")

    portEntry := widget.NewEntry()
    portEntry.SetText("22")

    userEntry := widget.NewEntry()
    userEntry.SetPlaceHolder("用户名")

    passEntry := widget.NewPasswordEntry()
    passEntry.SetPlaceHolder("密码")

    keyEntry := widget.NewEntry()
    keyEntry.SetPlaceHolder("私钥文件路径（可选）")

    form := widget.NewForm(
        widget.NewFormItem("主机", hostEntry),
        widget.NewFormItem("端口", portEntry),
        widget.NewFormItem("用户名", userEntry),
        widget.NewFormItem("密码", passEntry),
        widget.NewFormItem("私钥路径", keyEntry),
    )

    // 使用 Fyne 原生对话框，自动渲染白色面板背景与可读文本
    ui.ShowConfirm(window, "新建连接", form, "连接", "取消", func(confirmed bool){
        if !confirmed {
            fmt.Println("[UI] 取消连接")
            return
        }
        fmt.Printf("[UI] 尝试连接: host=%s port=%s user=%s key=%s\n", hostEntry.Text, portEntry.Text, userEntry.Text, keyEntry.Text)
        // TODO: 实现连接逻辑，调用后端 Connect 协议
    })
}
