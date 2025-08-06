import React from "react";
import { ArrowLeft, Folder, Upload, RefreshCw } from "lucide-react";
import type { Workspace, FolderItem } from "../../types";

interface ToolbarProps {
  theme: any;
  activeWorkspace: Workspace | null;
  currentFolder: FolderItem | null;
  showRecycleBin: boolean;
  navigateUp: () => void;
  setShowCreateFolder: (show: boolean) => void;
  setShowUpload: (show: boolean) => void;
  loadRecycleBinContent: () => void;
  loadWorkspaceContent: (workspaceId: string, folderId?: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  theme,
  activeWorkspace,
  currentFolder,
  showRecycleBin,
  navigateUp,
  setShowCreateFolder,
  setShowUpload,
  loadRecycleBinContent,
  loadWorkspaceContent,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <h1 className={`text-xl font-semibold ${theme.text}`}>
        {activeWorkspace?.title || "Select Workspace"}
      </h1>
      <span className={`text-sm ${theme.textMuted}`}>
        {showRecycleBin ? "Recycle Bin" : currentFolder ? currentFolder.name : "Root"}
      </span>
      {currentFolder && (
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          📁 {currentFolder.name}
        </span>
      )}
    </div>

    <div className="flex items-center space-x-3">
      {!showRecycleBin && currentFolder && (
        <button
          onClick={navigateUp}
          className={`flex items-center space-x-2 px-3 py-2 ${theme.textSecondary} ${theme.hover} rounded-lg`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      )}
      {!showRecycleBin && (
        <>
          <button
            onClick={() => setShowCreateFolder(true)}
            disabled={!activeWorkspace}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Folder className="w-4 h-4" />
            <span>New Folder</span>
          </button>
          <button
            onClick={() => setShowUpload(true)}
            disabled={!activeWorkspace}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
        </>
      )}
      <button
        onClick={() => {
          if (activeWorkspace) {
            if (showRecycleBin) {
              loadRecycleBinContent();
            } else {
              loadWorkspaceContent(activeWorkspace._id, currentFolder?._id);
            }
          }
        }}
        disabled={!activeWorkspace}
        className={`p-2 ${theme.textSecondary} ${theme.hover} rounded-lg disabled:text-gray-400 disabled:cursor-not-allowed`}
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default Toolbar;