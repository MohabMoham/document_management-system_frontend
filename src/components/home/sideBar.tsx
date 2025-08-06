import React from "react";
import { Folder, Plus } from "lucide-react";
import type { Workspace } from "../../types";

interface SideBarProps {
  theme: any;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  setActiveWorkspace: (ws: Workspace) => void;
  setShowCreateWorkspace: (show: boolean) => void;
  setCurrentFolder: (folder: any) => void;
  setBreadcrumb: (crumbs: any[]) => void;
  showRecycleBin: boolean;
  loadRecycleBinContent: () => void;
  loadWorkspaceContent: (workspaceId: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({
  theme,
  workspaces,
  activeWorkspace,
  setActiveWorkspace,
  setShowCreateWorkspace,
  setCurrentFolder,
  setBreadcrumb,
  showRecycleBin,
  loadRecycleBinContent,
  loadWorkspaceContent,
}) => (
  <div className={`w-64 ${theme.cardBg} ${theme.border} border-r p-4`}>
    <div className="flex items-center justify-between mb-4">
      <h2 className={`text-lg font-semibold ${theme.text}`}>Workspaces</h2>
      <button onClick={() => setShowCreateWorkspace(true)} className={`p-1 ${theme.hover} rounded`}>
        <Plus className={`w-4 h-4 ${theme.textSecondary}`} />
      </button>
    </div>
    <div className="space-y-2">
      {workspaces.map((workspace) => (
        <div
          key={workspace._id}
          onClick={() => {
            setActiveWorkspace(workspace);
            setCurrentFolder(null);
            setBreadcrumb([]);
            if (showRecycleBin) {
              loadRecycleBinContent();
            } else {
              loadWorkspaceContent(workspace._id);
            }
          }}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            activeWorkspace?._id === workspace._id ? "bg-blue-50 border border-blue-200" : theme.hover
          }`}
        >
          <div className="flex items-center space-x-2">
            <Folder className="w-4 h-4 text-blue-500" />
            <span className={`text-sm font-medium ${theme.text}`}>{workspace.title}</span>
          </div>
          <p className={`text-xs ${theme.textMuted} mt-1`}>{workspace.type}</p>
        </div>
      ))}
    </div>
  </div>
);

export default SideBar;