import React from 'react';
import { Trash, User } from 'lucide-react';

interface HeaderProps {
  showRecycleBin: boolean;
  setShowRecycleBin: (show: boolean) => void;
  loadDeletedDocuments: (workspaceId?: string) => void;
  activeWorkspace: any;
}

const Header: React.FC<HeaderProps> = ({
  showRecycleBin,
  setShowRecycleBin,
  loadDeletedDocuments,
  activeWorkspace
}) => (
  <header className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">D</span>
          </div>
          <span className="text-lg font-semibold text-gray-800">Document management system</span>
        </div>
        <nav className="flex space-x-6">
          <button 
            onClick={() => setShowRecycleBin(false)}
            className={`${!showRecycleBin ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Documents
          </button>
          <button 
            onClick={() => {
              setShowRecycleBin(true);
              loadDeletedDocuments(activeWorkspace?._id);
            }}
            className={`flex items-center space-x-1 ${showRecycleBin ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
          >
            
            <span>Recycle Bin</span>
          </button>
        </nav>
      </div>
      <div className="flex items-center space-x-3">
        <User className="w-5 h-5 text-gray-500" />
      </div>
    </div>
  </header>
);

export default Header;