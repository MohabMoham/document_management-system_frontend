import React from 'react';
import { Plus, Folder } from 'lucide-react';
import { Workspace } from '../types';

interface SidebarProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  setActiveWorkspace: (ws: Workspace) => void;
  showRecycleBin: boolean;
  loadDeletedDocuments: (workspaceId: string) => void;
  setShowCreateWorkspace: (show: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  workspaces,
  activeWorkspace,
  setActiveWorkspace,
  showRecycleBin,
  loadDeletedDocuments,
  setShowCreateWorkspace
}) => (
  <div className="w-64 bg-white border-r border-gray-200 p-4">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-800">Workspaces</h2>
      <button
        onClick={() => setShowCreateWorkspace(true)}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <Plus className="w-4 h-4 text-gray-600" />
      </button>
    </div>
    <div className="space-y-2">
      {workspaces.map(workspace => (
        <div
          key={workspace._id}
          onClick={() => {
            setActiveWorkspace(workspace);
            if (showRecycleBin) {
              loadDeletedDocuments(workspace._id);
            }
          }}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            activeWorkspace?._id === workspace._id
              ? 'bg-blue-50 border border-blue-200'
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Folder className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">{workspace.title || workspace.name}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{workspace.type}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Sidebar;