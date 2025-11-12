import { useState } from "react";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  user: string;
}

interface ProcessManagerProps {
  processes: Process[];
  onKillProcess?: (pid: number) => void;
}

export function ProcessManager({ processes, onKillProcess }: ProcessManagerProps) {
  const [sortBy, setSortBy] = useState<"cpu" | "memory">("cpu");

  const sortedProcesses = [...processes].sort((a, b) => {
    if (sortBy === "cpu") return b.cpu - a.cpu;
    return b.memory - a.memory;
  });

  return (
    <Card className="p-2.5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[#666] text-xs">进程资源</span>
          <div className="flex gap-1">
            <Button
              variant={sortBy === "cpu" ? "secondary" : "ghost"}
              size="sm"
              className="h-5 text-[10px] px-2"
              onClick={() => setSortBy("cpu")}
            >
              CPU
            </Button>
            <Button
              variant={sortBy === "memory" ? "secondary" : "ghost"}
              size="sm"
              className="h-5 text-[10px] px-2"
              onClick={() => setSortBy("memory")}
            >
              内存
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[200px]">
          <div className="space-y-1">
            {sortedProcesses.slice(0, 20).map((process) => (
              <div
                key={process.pid}
                className="flex items-center justify-between gap-2 p-1.5 hover:bg-accent/50 rounded text-[10px] group"
              >
                <div className="flex-1 min-w-0">
                  <div className="truncate text-[#333]">{process.name}</div>
                  <div className="text-[#999] text-[9px]">PID: {process.pid} | {process.user}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-orange-500">{process.cpu.toFixed(1)}%</div>
                    <div className="text-green-500">{process.memory.toFixed(1)}%</div>
                  </div>
                  {onKillProcess && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 opacity-0 group-hover:opacity-100"
                      onClick={() => onKillProcess(process.pid)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
