import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Server } from "lucide-react";

interface SSHConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (config: SSHConfig) => void;
}

export interface SSHConfig {
  host: string;
  port: string;
  username: string;
  password: string;
}

export function SSHConnectionDialog({ open, onOpenChange, onConnect }: SSHConnectionDialogProps) {
  const [config, setConfig] = useState<SSHConfig>({
    host: "127.0.0.1",
    port: "22",
    username: "root",
    password: "",
  });

  const handleConnect = () => {
    onConnect(config);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            SSH 连接配置
          </DialogTitle>
          <DialogDescription>
            输入SSH服务器信息以建立连接
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="host">主机地址</Label>
            <Input
              id="host"
              placeholder="192.168.1.100 或 example.com"
              value={config.host}
              onChange={(e) => setConfig({ ...config, host: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="port">端口</Label>
            <Input
              id="port"
              placeholder="22"
              value={config.port}
              onChange={(e) => setConfig({ ...config, port: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              placeholder="root"
              value={config.username}
              onChange={(e) => setConfig({ ...config, username: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              placeholder="输入密码"
              value={config.password}
              onChange={(e) => setConfig({ ...config, password: e.target.value })}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleConnect}>
            连接
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
