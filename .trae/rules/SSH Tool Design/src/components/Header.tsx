import { useState } from "react";
import { Button } from "./ui/button";
import { Plus, Settings, HelpCircle, Search } from "lucide-react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

interface HeaderProps {
  onNewConnection: () => void;
  onOpenConnectionManager: () => void;
  connectionManagerOpen?: boolean;
}

export function Header({ onNewConnection, onOpenConnectionManager, connectionManagerOpen }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="h-14 border-b border-border bg-white flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
            <span className="text-white">EN</span>
          </div>
          <span>EasyNode</span>
        </div>
        <nav className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onOpenConnectionManager}
            className={connectionManagerOpen ? "bg-gray-100" : ""}
          >
            连接管理器
          </Button>
          <Button variant="ghost" size="sm" className="text-blue-500">
            远程终端
          </Button>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        {showSearch ? (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="快捷搜索连接..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => {
                if (!searchQuery) setShowSearch(false);
              }}
              className="h-8 pl-9 pr-3 w-[200px]"
              autoFocus
            />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(true)}
          >
            <Search className="w-4 h-4" />
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onNewConnection}>
          <Plus className="w-4 h-4 mr-1" />
          新建连接
        </Button>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <HelpCircle className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-sm">版本更新中</span>
          <Badge variant="outline" className="bg-orange-500 text-white border-orange-500">
            即将发布
          </Badge>
          <span className="text-sm">1115714829</span>
          <Badge variant="secondary">SVIP</Badge>
        </div>
      </div>
    </div>
  );
}
