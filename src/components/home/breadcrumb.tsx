import React from "react";
import { Home, ChevronRight } from "lucide-react";
import type { FolderItem, Workspace } from "../../types";

interface BreadcrumbProps {
  theme: any;
  breadcrumb: FolderItem[];
  activeWorkspace: Workspace | null;
  setCurrentFolder: (folder: FolderItem | null) => void;
  setBreadcrumb: (crumbs: FolderItem[]) => void;
  loadWorkspaceContent: (workspaceId: string, folderId?: string) => void;
  showRecycleBin: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  theme,
  breadcrumb,
  activeWorkspace,
  setCurrentFolder,
  setBreadcrumb,
  loadWorkspaceContent,
  showRecycleBin,
}) => {
  if (showRecycleBin || breadcrumb.length === 0) return null;

  return (
    <div className={`flex items-center space-x-2 mb-4 text-sm ${theme.textSecondary}`}>
      <button
        onClick={() => {
          if (activeWorkspace) {
            setCurrentFolder(null);
            setBreadcrumb([]);
            loadWorkspaceContent(activeWorkspace._id);
          }
        }}
        className="hover:text-blue-600"
      >
        <Home className="w-4 h-4" />
      </button>
      {breadcrumb.map((crumb, index) => (
        <React.Fragment key={crumb._id}>
          <ChevronRight className="w-4 h-4" />
          <button
            onClick={() => {
              if (activeWorkspace) {
                const targetCrumb = breadcrumb[index];
                setCurrentFolder(targetCrumb);
                setBreadcrumb(breadcrumb.slice(0, index + 1));
                loadWorkspaceContent(activeWorkspace._id, targetCrumb._id);
              }
            }}
            className={`hover:text-blue-600 ${index === breadcrumb.length - 1 ? `font-medium ${theme.text}` : ""}`}
          >
            {crumb.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;