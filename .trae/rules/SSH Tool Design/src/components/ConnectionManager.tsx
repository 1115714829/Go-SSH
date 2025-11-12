import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Server,
} from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";

interface Connection {
  id: string;
  name: string;
  type: "connection" | "folder";
  children?: Connection[];
  expanded?: boolean;
}

interface ConnectionManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect?: (connection: Connection) => void;
}

export function ConnectionManager({
  open,
  onOpenChange,
  onConnect,
}: ConnectionManagerProps) {
  const [showDeleted, setShowDeleted] = useState(false);
  const [closeAfterConnect, setCloseAfterConnect] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(
    null
  );

  // 模拟连接数据
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "1",
      name: "On5ov34xk6mtmnto",
      type: "connection",
    },
    {
      id: "2",
      name: "On5ov34xk6mtmnto",
      type: "connection",
    },
    {
      id: "3",
      name: "1wq7d6wd3tman7xp",
      type: "connection",
    },
    {
      id: "4",
      name: "1wq7d6wd3tman7xp",
      type: "connection",
    },
    {
      id: "5",
      name: "7tcr2kvc5owta2d8",
      type: "connection",
    },
    {
      id: "6",
      name: "8j31bu3x54az9r3z",
      type: "connection",
    },
    {
      id: "7",
      name: "8j31bu3x54az9r3z",
      type: "connection",
    },
    {
      id: "8",
      name: "bj17e7lrz5rzo91a",
      type: "connection",
    },
    {
      id: "9",
      name: "bvg2fq7yq6z2af3a",
      type: "connection",
    },
    {
      id: "10",
      name: "ilbfj73keadkkqgu",
      type: "connection",
    },
    {
      id: "11",
      name: "IT之圣堂客",
      type: "connection",
    },
    {
      id: "12",
      name: "k9ktuwqcy2ztrh2e",
      type: "connection",
    },
    {
      id: "13",
      name: "k9ktuwqcy2ztrh2e",
      type: "connection",
    },
    {
      id: "14",
      name: "nc42pkixa63zmq31",
      type: "connection",
    },
    {
      id: "15",
      name: "sxgo6dmvcqas3sb7",
      type: "connection",
    },
    {
      id: "16",
      name: "v335e6st4eutecye",
      type: "connection",
    },
    {
      id: "17",
      name: "WSL",
      type: "connection",
    },
    {
      id: "folder1",
      name: "上海（用户ID7）",
      type: "folder",
      expanded: false,
      children: [],
    },
    {
      id: "folder2",
      name: "欧博云客服服务器",
      type: "folder",
      expanded: false,
      children: [],
    },
    {
      id: "folder3",
      name: "保定",
      type: "folder",
      expanded: false,
      children: [],
    },
    {
      id: "folder4",
      name: "定州",
      type: "folder",
      expanded: false,
      children: [],
    },
    {
      id: "folder5",
      name: "山西",
      type: "folder",
      expanded: false,
      children: [],
    },
    {
      id: "folder6",
      name: "广东深圳（用户ID16）",
      type: "folder",
      expanded: false,
      children: [],
    },
    {
      id: "folder7",
      name: "廊坊盒子",
      type: "folder",
      expanded: false,
      children: [],
    },
    {
      id: "folder8",
      name: "张家口",
      type: "folder",
      expanded: false,
      children: [],
    },
  ]);

  const toggleFolder = (id: string) => {
    setConnections((prev) =>
      prev.map((conn) =>
        conn.id === id && conn.type === "folder"
          ? { ...conn, expanded: !conn.expanded }
          : conn
      )
    );
  };

  const handleConnectionClick = (connection: Connection) => {
    setSelectedConnection(connection.id);
  };

  const handleConnectionDoubleClick = (connection: Connection) => {
    if (connection.type === "connection") {
      if (closeAfterConnect) {
        onOpenChange(false);
      }
      onConnect?.(connection);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] h-[600px] p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-3 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            连接管理器
          </DialogTitle>
          <DialogDescription className="sr-only">
            管理和连接到SSH服务器
          </DialogDescription>
        </DialogHeader>

        {/* 工具栏 */}
        <div className="px-3 py-2 border-b bg-[#f8f9fa] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="show-deleted"
              checked={showDeleted}
              onCheckedChange={(checked) => setShowDeleted(checked as boolean)}
            />
            <label
              htmlFor="show-deleted"
              className="text-xs cursor-pointer select-none"
            >
              显示已删除
            </label>
          </div>
        </div>

        {/* 连接列表 */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="px-4 py-1.5 bg-[#f0f0f0] border-b">
              <div className="flex items-center gap-1.5 text-xs text-[#666]">
                <Folder className="w-3.5 h-3.5 text-yellow-600" />
                <span>连接</span>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="px-2 py-1">
                {connections.map((connection) => (
                  <div
                    key={connection.id}
                    className={`flex items-center gap-1 px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer rounded ${
                      selectedConnection === connection.id
                        ? "bg-blue-50 hover:bg-blue-100"
                        : ""
                    }`}
                    onClick={() => handleConnectionClick(connection)}
                    onDoubleClick={() => handleConnectionDoubleClick(connection)}
                  >
                    {connection.type === "folder" ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFolder(connection.id);
                          }}
                          className="p-0.5 hover:bg-gray-200 rounded"
                        >
                          {connection.expanded ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </button>
                        {connection.expanded ? (
                          <FolderOpen className="w-3.5 h-3.5 text-yellow-600" />
                        ) : (
                          <Folder className="w-3.5 h-3.5 text-yellow-600" />
                        )}
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3" />
                        <Folder className="w-3.5 h-3.5 text-yellow-600" />
                      </>
                    )}
                    <span className="flex-1">{connection.name}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* 底部 */}
        <div className="px-4 py-2 border-t bg-[#f8f9fa] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#666]">
            <span>专业版</span>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="close-after-connect"
              checked={closeAfterConnect}
              onCheckedChange={(checked) =>
                setCloseAfterConnect(checked as boolean)
              }
            />
            <label
              htmlFor="close-after-connect"
              className="text-xs cursor-pointer select-none"
            >
              连接后关闭窗口
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
