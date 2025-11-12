import { useState, useEffect } from "react";
import { Server, Network } from "lucide-react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ProcessManager } from "./ProcessManager";

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

interface SystemMonitorProps {
  stats: SystemStats;
  sshAddress: string;
}

export function SystemMonitor({ stats, sshAddress }: SystemMonitorProps) {
  // 网络流量历史数据
  const [networkHistory, setNetworkHistory] = useState<Array<{ upload: number; download: number }>>(
    Array(20).fill({ upload: 0, download: 0 })
  );
  
  // 选中的网卡
  const [selectedInterface, setSelectedInterface] = useState<string>(
    stats.networkInterfaces[0]?.name || "eth0"
  );

  const currentInterface = stats.networkInterfaces.find(
    (iface) => iface.name === selectedInterface
  ) || stats.networkInterfaces[0];

  useEffect(() => {
    if (currentInterface) {
      setNetworkHistory((prev) => {
        const newHistory = [...prev.slice(1), { upload: currentInterface.upload, download: currentInterface.download }];
        return newHistory;
      });
    }
  }, [currentInterface?.upload, currentInterface?.download]);

  return (
    <div className="h-full bg-[#f8f9fa] border-r border-border overflow-y-auto">
      <div className="p-2.5 space-y-2">
        {/* 主机信息 */}
        <Card className="p-2.5 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
            <span className="text-[#666] text-xs">主机</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-start gap-2">
              <span className="text-[#999] text-[10px] flex-shrink-0">地址</span>
              <span className="text-[#333] text-[10px] text-right break-all">{sshAddress}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-[#999] text-[10px] flex-shrink-0">在线</span>
              <span className="text-[#333] text-[10px] whitespace-nowrap">{stats.uptime}</span>
            </div>
            {/* 设备基础信息 */}
            <div className="pt-2 space-y-1 border-t border-border/50">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[#999] text-[10px] flex-shrink-0">名称</span>
                <span className="text-[#333] text-[10px] text-right break-all">{stats.hostname}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#999] text-[10px] flex-shrink-0">核心</span>
                <span className="text-[#333] text-[10px]">{stats.cores}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-[#999] text-[10px] flex-shrink-0">型号</span>
                <span className="text-[#333] text-[10px] text-right break-all">
                  {stats.processor}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[#999] text-[10px] flex-shrink-0">频率</span>
                <span className="text-[#333] text-[10px] whitespace-nowrap">@ 2.40GHz</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-[#999] text-[10px] flex-shrink-0">架构</span>
                <span className="text-[#333] text-[10px] text-right break-all">{stats.platform}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 系统负载 */}
        <Card className="p-2.5 space-y-1">
          <div className="text-[#666] text-xs">负载</div>
          <div className="flex justify-between text-[10px]">
            <div className="flex flex-col items-center">
              <span className="text-[#999]">1分钟</span>
              <span className="text-[#333]">{stats.load.one.toFixed(2)}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#999]">5分钟</span>
              <span className="text-[#333]">{stats.load.five.toFixed(2)}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#999]">15分钟</span>
              <span className="text-[#333]">{stats.load.fifteen.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* CPU - 紧凑显示 */}
        <Card className="p-2 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[#666] text-xs">CPU</span>
            <span className="text-[#333] text-[10px]">{stats.cpu.toFixed(2)}%</span>
          </div>
          <Progress value={stats.cpu} className="h-1" />
        </Card>

        {/* 内存 - 紧凑显示 */}
        <Card className="p-2 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[#666] text-xs">内存</span>
            <span className="text-[#333] text-[10px]">{stats.memory.percentage.toFixed(0)}%</span>
          </div>
          <Progress value={stats.memory.percentage} className="h-1" />
          <div className="flex justify-between text-[10px] text-[#999]">
            <span>{stats.memory.used.toFixed(2)}G</span>
            <span>{stats.memory.total.toFixed(2)}G</span>
          </div>
        </Card>

        {/* 交换 - 紧凑显示 */}
        <Card className="p-2 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[#666] text-xs">交换</span>
            <span className="text-[#333] text-[10px]">{stats.swap.percentage.toFixed(0)}%</span>
          </div>
          <Progress value={stats.swap.percentage} className="h-1" />
          <div className="flex justify-between text-[10px] text-[#999]">
            <span>{stats.swap.used.toFixed(2)}G</span>
            <span>{stats.swap.total.toFixed(2)}G</span>
          </div>
        </Card>

        {/* 磁盘 - 紧凑显示 */}
        {stats.disks.map((disk, index) => (
          <Card key={index} className="p-2 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[#666] text-xs">磁盘({index + 1})</span>
              <span className={`text-[10px] ${disk.percentage > 80 ? "text-red-500" : "text-green-500"}`}>
                {disk.percentage}%
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-[#999]">
              <span className="truncate">{disk.used}</span>
              <span className="whitespace-nowrap ml-1">{disk.total}</span>
            </div>
          </Card>
        ))}

        {/* 网络 - 带折线图和网卡选择 */}
        <Card className="p-2.5 space-y-2">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-[#666] flex-shrink-0" />
              <span className="text-[#666] text-xs">网络</span>
            </div>
            <Select value={selectedInterface} onValueChange={setSelectedInterface}>
              <SelectTrigger className="h-5 w-[80px] text-[10px] px-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stats.networkInterfaces.map((iface) => (
                  <SelectItem key={iface.name} value={iface.name} className="text-[10px]">
                    {iface.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-orange-500">↑ {currentInterface?.upload.toFixed(2) || 0} KB/s</span>
              <span className="text-green-500">↓ {currentInterface?.download.toFixed(2) || 0} KB/s</span>
            </div>
            {/* 网络流量折线图 */}
            <div className="h-12 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={networkHistory}>
                  <Line
                    type="monotone"
                    dataKey="upload"
                    stroke="#f97316"
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="download"
                    stroke="#22c55e"
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* 进程资源管理 */}
        <ProcessManager processes={stats.processes} />
      </div>
    </div>
  );
}
