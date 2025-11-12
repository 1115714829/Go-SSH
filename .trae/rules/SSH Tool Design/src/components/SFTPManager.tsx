import { useState } from "react";
import { 
  FolderOpen, 
  File, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw,
  Home,
  ArrowLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  Archive,
  Video,
  Music
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

interface FileItem {
  name: string;
  type: "file" | "directory";
  size: string;
  modified: string;
  permissions: string;
}

interface SFTPState {
  currentPath: string;
  files: FileItem[];
  selectedFiles: Set<string>;
}

interface SFTPManagerProps {
  hostname: string;
  username: string;
  sftpState: SFTPState;
  onUpdateState: (updater: (prevState: SFTPState) => SFTPState) => void;
}

export type { FileItem };

export function SFTPManager({ hostname, username, sftpState, onUpdateState }: SFTPManagerProps) {
  const { currentPath, files, selectedFiles } = sftpState;

  const getFileIcon = (item: FileItem) => {
    if (item.type === "directory") {
      return <FolderOpen className="w-4 h-4 text-yellow-600" />;
    }
    
    const ext = item.name.split(".").pop()?.toLowerCase();
    if (["txt", "log", "conf", "yaml", "yml", "json", "xml"].includes(ext || "")) {
      return <FileText className="w-4 h-4 text-blue-500" />;
    }
    if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext || "")) {
      return <ImageIcon className="w-4 h-4 text-green-500" />;
    }
    if (["tar", "gz", "zip", "rar", "7z"].includes(ext || "")) {
      return <Archive className="w-4 h-4 text-orange-500" />;
    }
    if (["mp4", "avi", "mkv", "mov"].includes(ext || "")) {
      return <Video className="w-4 h-4 text-purple-500" />;
    }
    if (["mp3", "wav", "flac", "ogg"].includes(ext || "")) {
      return <Music className="w-4 h-4 text-pink-500" />;
    }
    
    return <File className="w-4 h-4 text-gray-500" />;
  };

  const handleFileClick = (fileName: string, type: string) => {
    if (type === "directory") {
      // 模拟进入目录
      if (fileName === "..") {
        const pathParts = currentPath.split("/").filter(p => p);
        pathParts.pop();
        onUpdateState(prevState => ({ ...prevState, currentPath: "/" + pathParts.join("/") }));
      } else {
        onUpdateState(prevState => ({ ...prevState, currentPath: currentPath + "/" + fileName }));
      }
    } else {
      // 切换文件选中状态
      const newSelected = new Set(selectedFiles);
      if (newSelected.has(fileName)) {
        newSelected.delete(fileName);
      } else {
        newSelected.add(fileName);
      }
      onUpdateState(prevState => ({ ...prevState, selectedFiles: newSelected }));
    }
  };

  const handleUpload = () => {
    console.log("上传文件");
    // TODO: 实现文件上传功能
  };

  const handleDownload = () => {
    console.log("下载文件:", Array.from(selectedFiles));
    // TODO: 实现文件下载功能
  };

  const handleDelete = () => {
    console.log("删除文件:", Array.from(selectedFiles));
    // TODO: 实现文件删除功能
  };

  const handleRefresh = () => {
    console.log("刷新文件列表");
    // TODO: 实现刷新功能
  };

  const pathSegments = currentPath.split("/").filter(p => p);

  return (
    <div className="h-full flex flex-col bg-white border-t border-border">
      {/* 工具栏 */}
      <div className="px-3 py-2 border-b border-border flex items-center gap-2 bg-[#f8f9fa]">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2"
          onClick={() => onUpdateState(prevState => ({ ...prevState, currentPath: "/home/root" }))}
        >
          <Home className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2"
          onClick={() => {
            const pathParts = currentPath.split("/").filter(p => p);
            pathParts.pop();
            onUpdateState(prevState => ({ ...prevState, currentPath: "/" + pathParts.join("/") }));
          }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </Button>
        <div className="flex-1 flex items-center gap-1 text-xs text-[#666] overflow-x-auto">
          <Home className="w-3 h-3 flex-shrink-0" />
          {pathSegments.map((segment, index) => (
            <div key={index} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <span className="whitespace-nowrap">{segment}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={handleUpload}
          >
            <Upload className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={handleDownload}
            disabled={selectedFiles.size === 0}
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={handleDelete}
            disabled={selectedFiles.size === 0}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* 文件列表头部 */}
      <div className="px-3 py-1.5 border-b border-border bg-[#f8f9fa] flex items-center text-[10px] text-[#999]">
        <div className="w-8 flex-shrink-0"></div>
        <div className="flex-1 min-w-0">文件名</div>
        <div className="w-24 flex-shrink-0 text-right">大小</div>
        <div className="w-32 flex-shrink-0 text-right">修改时间</div>
        <div className="w-24 flex-shrink-0 text-right">权限</div>
      </div>

      {/* 文件列表 */}
      <ScrollArea className="flex-1">
        <div className="px-3">
          {files.map((file, index) => (
            <div
              key={index}
              className={`py-2 flex items-center text-xs border-b border-border/50 cursor-pointer hover:bg-gray-50 ${
                selectedFiles.has(file.name) ? "bg-blue-50" : ""
              }`}
              onClick={() => handleFileClick(file.name, file.type)}
            >
              <div className="w-8 flex-shrink-0">
                {getFileIcon(file)}
              </div>
              <div className="flex-1 min-w-0 truncate text-[#333]">
                {file.name}
              </div>
              <div className="w-24 flex-shrink-0 text-right text-[#666]">
                {file.size}
              </div>
              <div className="w-32 flex-shrink-0 text-right text-[#666]">
                {file.modified}
              </div>
              <div className="w-24 flex-shrink-0 text-right text-[#999] font-mono text-[10px]">
                {file.permissions}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* 状态栏 */}
      <div className="px-3 py-1.5 border-t border-border bg-[#f8f9fa] flex items-center justify-between text-[10px] text-[#666]">
        <div>
          {selectedFiles.size > 0 ? `已选择 ${selectedFiles.size} 个文件` : `共 ${files.length} 个项目`}
        </div>
        <div>
          {username}@{hostname}:{currentPath}
        </div>
      </div>
    </div>
  );
}