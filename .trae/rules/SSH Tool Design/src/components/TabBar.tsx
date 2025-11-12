import { X } from "lucide-react";
import { Button } from "./ui/button";

interface Tab {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onTabClose: (id: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange, onTabClose }: TabBarProps) {
  return (
    <div className="h-10 bg-[#f0f0f0] border-b border-border flex items-center gap-1 px-2 overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-t cursor-pointer group ${
            activeTab === tab.id ? "bg-white" : "bg-transparent hover:bg-[#e8e8e8]"
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="text-sm whitespace-nowrap">{tab.label}</span>
          {tabs.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
