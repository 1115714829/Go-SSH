import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X, Maximize2, Minimize2 } from "lucide-react";

interface TerminalLine {
  type: "input" | "output" | "system";
  content: string;
  timestamp?: Date;
}

interface SSHTerminalProps {
  hostname: string;
  username: string;
  onClose?: () => void;
}

export function SSHTerminal({ hostname, username, onClose }: SSHTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: "system",
      content: "Welcome to KasyNode Terminal.",
    },
    {
      type: "system",
      content: "An experimental Web-SSH Terminal.",
    },
    {
      type: "system",
      content: "保护您的服务器，不要随意运行未知代码(URTT)",
      timestamp: new Date(),
    },
    {
      type: "system",
      content: `使用 curl http://kasyisoft.top:5002 部署监控服务 curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh`,
    },
    {
      type: "system",
      content: "root@279e8d308de22c92ea9a1cc2fa8eb1ac2d8.kuvisoft.top -> password",
    },
    {
      type: "system",
      content: `Last login: Wed Oct 22 14:14:00 2025 from 127.0.0.1`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 自动滚动到底部
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    // 添加输入命令
    setLines((prev) => [
      ...prev,
      {
        type: "input",
        content: `[root@${hostname.split("-")[0]} ~]# ${cmd}`,
      },
    ]);

    // 模拟命令响应
    setTimeout(() => {
      let response = "";
      const lowerCmd = cmd.toLowerCase().trim();

      if (lowerCmd === "ls" || lowerCmd === "ll") {
        response = "Desktop  Documents  Downloads  Music  Pictures  Videos  projects  notes.txt";
      } else if (lowerCmd.startsWith("cd")) {
        response = "";
      } else if (lowerCmd === "pwd") {
        response = "/root";
      } else if (lowerCmd === "date") {
        response = new Date().toString();
      } else if (lowerCmd === "whoami") {
        response = username;
      } else if (lowerCmd === "clear") {
        setLines([]);
        return;
      } else if (lowerCmd === "help") {
        response = `Available commands:
  ls, ll      - List directory contents
  pwd         - Print working directory
  cd          - Change directory
  whoami      - Print current user
  date        - Show current date and time
  clear       - Clear terminal
  help        - Show this help message`;
      } else {
        response = `bash: ${cmd}: command not found`;
      }

      if (response) {
        setLines((prev) => [
          ...prev,
          {
            type: "output",
            content: response,
          },
        ]);
      }
    }, 100);

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-[#1a1a1a] ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {/* 顶部工具栏 */}
      <div className="bg-[#2d2d2d] border-b border-[#3d3d3d] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-[#999] text-sm">SSH: {hostname}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-[#999] hover:text-white"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-[#999] hover:text-white"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 终端内容 */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm text-[#d4d4d4] cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, index) => (
          <div key={index} className="mb-1">
            {line.type === "system" && (
              <div className="text-[#4ec9b0]">{line.content}</div>
            )}
            {line.type === "input" && (
              <div className="text-white">{line.content}</div>
            )}
            {line.type === "output" && (
              <div className="text-[#d4d4d4] whitespace-pre-wrap">{line.content}</div>
            )}
          </div>
        ))}

        {/* 当前输入行 */}
        <div className="flex items-center">
          <span className="text-white mr-2">[root@{hostname.split("-")[0]} ~]# </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
