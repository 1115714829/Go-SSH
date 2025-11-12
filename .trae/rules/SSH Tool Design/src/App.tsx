import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { TabBar } from "./components/TabBar";
import { SystemMonitor } from "./components/SystemMonitor";
import { SSHTerminal } from "./components/SSHTerminal";
import { SFTPManager, FileItem } from "./components/SFTPManager";
import { SSHConnectionDialog, SSHConfig } from "./components/SSHConnectionDialog";
import { ConnectionManager } from "./components/ConnectionManager";
import { ChevronLeft, ChevronRight, FolderOpen } from "lucide-react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./components/ui/resizable";

interface SFTPState {
  currentPath: string;
  files: FileItem[];
  selectedFiles: Set<string>;
}

interface SystemStats {
  hostname: string;
  ip: string;
  uptime: string;
  cpu: number;
  load: {
    one: number;
    five: number;
    fifteen: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  swap: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  disks: Array<{
    name: string;
    percentage: number;
    used: string;
    total: string;
  }>;
  network: {
    upload: number;
    download: number;
  };
  networkInterfaces: Array<{
    name: string;
    upload: number;
    download: number;
  }>;
  platform: string;
  cores: number;
  processor: string;
  processes: Array<{
    pid: number;
    name: string;
    cpu: number;
    memory: number;
    user: string;
  }>;
}

interface Tab {
  id: string;
  label: string;
  hostname: string;
  username: string;
  sftpState: SFTPState;
  systemStats: SystemStats;
}

export default function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectionManagerOpen, setConnectionManagerOpen] = useState(false);
  const [showMonitor, setShowMonitor] = useState(true);
  const [showSFTP, setShowSFTP] = useState(false);
  
  // 初始SFTP状态
  const getInitialSFTPState = (): SFTPState => ({
    currentPath: "/home/root",
    files: [
      { name: "..", type: "directory", size: "-", modified: "-", permissions: "drwxr-xr-x" },
      { name: "documents", type: "directory", size: "-", modified: "2025-10-20 14:32", permissions: "drwxr-xr-x" },
      { name: "downloads", type: "directory", size: "-", modified: "2025-10-25 09:15", permissions: "drwxr-xr-x" },
      { name: "projects", type: "directory", size: "-", modified: "2025-10-26 16:45", permissions: "drwxr-xr-x" },
      { name: "config.yaml", type: "file", size: "2.3 KB", modified: "2025-10-27 08:20", permissions: "-rw-r--r--" },
      { name: "deploy.sh", type: "file", size: "1.8 KB", modified: "2025-10-26 11:30", permissions: "-rwxr-xr-x" },
      { name: "nginx.conf", type: "file", size: "5.7 KB", modified: "2025-10-25 14:10", permissions: "-rw-r--r--" },
      { name: "server.log", type: "file", size: "128 MB", modified: "2025-10-27 10:15", permissions: "-rw-r--r--" },
      { name: "backup.tar.gz", type: "file", size: "450 MB", modified: "2025-10-24 22:00", permissions: "-rw-r--r--" },
      { name: "avatar.png", type: "file", size: "256 KB", modified: "2025-10-23 15:45", permissions: "-rw-r--r--" },
      { name: "video.mp4", type: "file", size: "1.2 GB", modified: "2025-10-22 18:30", permissions: "-rw-r--r--" },
    ],
    selectedFiles: new Set(),
  });
  
  // 初始系统监控数据
  const getInitialSystemStats = (hostname: string): SystemStats => ({
    hostname: hostname,
    ip: "127.0.0.1",
    uptime: "1天05小时29分",
    cpu: 0.69,
    load: {
      one: 0.15,
      five: 0.22,
      fifteen: 0.18,
    },
    memory: {
      used: 0.246,
      total: 0.48,
      percentage: 51,
    },
    swap: {
      used: 0,
      total: 2.0,
      percentage: 0,
    },
    disk: {
      used: 157.7,
      total: 186.3,
      percentage: 85,
    },
    disks: [
      {
        name: "白云盘(1/6)",
        percentage: 81,
        used: "157.7G",
        total: "186.3G",
      },
      {
        name: "热血(e/8)",
        percentage: 2,
        used: "1.9G",
        total: "313.3G",
      },
    ],
    network: {
      upload: 157.7,
      download: 186.3,
    },
    networkInterfaces: [
      {
        name: "eth0",
        upload: 157.7,
        download: 186.3,
      },
      {
        name: "eth1",
        upload: 45.2,
        download: 89.6,
      },
      {
        name: "lo",
        upload: 0.5,
        download: 0.5,
      },
    ],
    platform: "CentOS 7 x86_64",
    cores: 48,
    processor: "Intel(R) Xeon(R) CPU E5-2680 v4",
    processes: [
      { pid: 1234, name: "node", cpu: 12.5, memory: 8.3, user: "root" },
      { pid: 5678, name: "nginx", cpu: 5.2, memory: 3.1, user: "www-data" },
      { pid: 9012, name: "mysql", cpu: 8.7, memory: 15.2, user: "mysql" },
      { pid: 3456, name: "redis-server", cpu: 2.1, memory: 4.5, user: "redis" },
      { pid: 7890, name: "docker", cpu: 3.8, memory: 6.7, user: "root" },
      { pid: 2345, name: "sshd", cpu: 0.5, memory: 1.2, user: "root" },
      { pid: 6789, name: "systemd", cpu: 0.3, memory: 2.1, user: "root" },
      { pid: 1357, name: "python3", cpu: 4.2, memory: 5.8, user: "www-data" },
      { pid: 2468, name: "php-fpm", cpu: 3.1, memory: 7.3, user: "www-data" },
      { pid: 3690, name: "apache2", cpu: 2.9, memory: 4.9, user: "www-data" },
    ],
  });
  
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      label: "ms-hb-shijiazhuang-ct48",
      hostname: "ms-hb-shijiazhuang-ct48",
      username: "root",
      sftpState: getInitialSFTPState(),
      systemStats: getInitialSystemStats("ms-hb-shijiazhuang-ct48"),
    },
  ]);
  const [activeTab, setActiveTab] = useState("1");

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setTabs((prevTabs) =>
        prevTabs.map((tab) => ({
          ...tab,
          systemStats: {
            ...tab.systemStats,
            cpu: Math.random() * 5,
            load: {
              one: 0.1 + Math.random() * 0.3,
              five: 0.15 + Math.random() * 0.2,
              fifteen: 0.12 + Math.random() * 0.15,
            },
            memory: {
              ...tab.systemStats.memory,
              percentage: 50 + Math.random() * 10,
            },
            swap: {
              ...tab.systemStats.swap,
              percentage: Math.random() * 5,
            },
            network: {
              upload: 100 + Math.random() * 150,
              download: 150 + Math.random() * 200,
            },
            networkInterfaces: tab.systemStats.networkInterfaces.map((iface) => ({
              ...iface,
              upload: Math.random() * 200,
              download: Math.random() * 300,
            })),
            processes: tab.systemStats.processes.map((proc) => ({
              ...proc,
              cpu: Math.random() * 15,
              memory: Math.random() * 20,
            })),
          },
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleNewConnection = () => {
    setDialogOpen(true);
  };

  const handleConnect = (config: SSHConfig) => {
    const newTab: Tab = {
      id: Date.now().toString(),
      label: `${config.username}@${config.host}`,
      hostname: config.host,
      username: config.username,
      sftpState: getInitialSFTPState(),
      systemStats: getInitialSystemStats(config.host),
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const handleTabClose = (id: string) => {
    const newTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(newTabs);
    if (activeTab === id && newTabs.length > 0) {
      setActiveTab(newTabs[0].id);
    }
  };

  // 更新当前标签的SFTP状态
  const updateCurrentTabSFTPState = (updater: (prevState: SFTPState) => SFTPState) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTab
          ? { ...tab, sftpState: updater(tab.sftpState) }
          : tab
      )
    );
  };

  const currentTab = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="h-screen flex flex-col">
      <Header 
        onNewConnection={handleNewConnection}
        onOpenConnectionManager={() => setConnectionManagerOpen(true)}
        connectionManagerOpen={connectionManagerOpen}
      />
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onTabClose={handleTabClose}
      />
      <div className="flex-1 flex overflow-hidden relative">
        {showMonitor && (
          <div className="w-[220px] flex-shrink-0">
            <SystemMonitor 
              stats={currentTab ? currentTab.systemStats : getInitialSystemStats("ms-hb-shijiazhuang-ct48")} 
              sshAddress={currentTab ? `${currentTab.username}@${currentTab.hostname}` : ""}
            />
          </div>
        )}
        
        {/* 切换按钮 - 位于左侧面板和终端之间 */}
        <div className="absolute left-[220px] top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1" style={{ left: showMonitor ? '220px' : '0px' }}>
          <button
            onClick={() => setShowMonitor(!showMonitor)}
            className="w-5 h-10 bg-red-500 hover:bg-red-600 text-white rounded-r flex items-center justify-center shadow-md transition-colors"
            title={showMonitor ? "隐藏监控面板" : "显示监控面板"}
          >
            {showMonitor ? (
              <ChevronLeft className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={() => setShowSFTP(!showSFTP)}
            className={`w-5 h-10 ${showSFTP ? 'bg-blue-600' : 'bg-blue-500'} hover:bg-blue-600 text-white rounded-r flex items-center justify-center shadow-md transition-colors`}
            title={showSFTP ? "关闭SFTP" : "打开SFTP"}
          >
            <FolderOpen className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {currentTab && (
            showSFTP ? (
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={60} minSize={30}>
                  <SSHTerminal
                    hostname={currentTab.hostname}
                    username={currentTab.username}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={40} minSize={20}>
                  <SFTPManager
                    hostname={currentTab.hostname}
                    username={currentTab.username}
                    sftpState={currentTab.sftpState}
                    onUpdateState={updateCurrentTabSFTPState}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              <SSHTerminal
                hostname={currentTab.hostname}
                username={currentTab.username}
              />
            )
          )}
        </div>
      </div>
      <SSHConnectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConnect={handleConnect}
      />
      <ConnectionManager
        open={connectionManagerOpen}
        onOpenChange={setConnectionManagerOpen}
        onConnect={(connection) => {
          // 从连接管理器连接时创建新标签
          const newTab: Tab = {
            id: Date.now().toString(),
            label: connection.name,
            hostname: connection.name,
            username: "root",
            sftpState: getInitialSFTPState(),
            systemStats: getInitialSystemStats(connection.name),
          };
          setTabs([...tabs, newTab]);
          setActiveTab(newTab.id);
        }}
      />
    </div>
  );
}