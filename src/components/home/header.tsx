import React from "react";
import { Trash, User } from "lucide-react";

interface HeaderProps {
  theme: any;
  showRecycleBin: boolean;
  setShowRecycleBin: (show: boolean) => void;
  activeWorkspace: any;
  currentFolder: any;
  loadWorkspaceContent: (workspaceId: string, folderId?: string) => void;
  loadRecycleBinContent: () => void;
  ThemeToggle: React.FC;
}

const Header: React.FC<HeaderProps> = ({
  theme,
  showRecycleBin,
  setShowRecycleBin,
  activeWorkspace,
  currentFolder,
  loadWorkspaceContent,
  loadRecycleBinContent,
  ThemeToggle,
}) => (
  <header className={`${theme.cardBg} ${theme.border} border-b px-6 py-4`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">D</span>
          </div>
          <span className={`text-lg font-semibold ${theme.text}`}>Document Management System</span>
        </div>
        <nav className="flex space-x-6">
          <button
            onClick={() => {
              setShowRecycleBin(false);
              if (activeWorkspace) {
                loadWorkspaceContent(activeWorkspace._id, currentFolder?._id);
              }
            }}
            className={`${!showRecycleBin ? "text-blue-600 font-medium" : `${theme.textSecondary} hover:text-gray-800`}`}
          >
            Documents
          </button>
          <button
            onClick={() => {
              setShowRecycleBin(true);
              loadRecycleBinContent();
            }}
            className={`flex items-center space-x-1 ${showRecycleBin ? "text-blue-600 font-medium" : `${theme.textSecondary} hover:text-gray-800`}`}
          >
            <Trash className="w-4 h-4" />
            <span>Recycle Bin</span>
          </button>
        </nav>
      </div>
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <User className={`w-5 h-5 ${theme.textMuted}`} />
      </div>
    </div>
  </header>
);

export default Header;