import React from 'react';
import { Upload, RefreshCw, RotateCcw, Trash2, Download, Settings } from 'lucide-react';

interface ToolbarProps {
  showRecycleBin: boolean;
  activeWorkspace: any;
  selectedDocs: string[];
  setSelectedDocs: (ids: string[]) => void;
  filteredDocuments: any[];
  documents: any[];
  loadDocuments: (workspaceId: string) => void;
  loadDeletedDocuments: (workspaceId: string) => void;
  deleteDocument: (id: string) => void;
  restoreDocument: (id: string) => void;
  permanentlyDeleteDocument: (id: string) => void;
  downloadDocument: (id: string, name: string) => void;
  setShowUpload: (show: boolean) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  showRecycleBin,
  activeWorkspace,
  selectedDocs,
  setSelectedDocs,
  filteredDocuments,
  documents,
  loadDocuments,
  loadDeletedDocuments,
  deleteDocument,
  restoreDocument,
  permanentlyDeleteDocument,
  downloadDocument,
  setShowUpload
}) => (
  <div className="bg-white border-b border-gray-200 p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-800">
          {activeWorkspace?.name || 'Select Workspace'}
        </h1>
        <span className="text-sm text-gray-500">
          {showRecycleBin ? 'Deleted Documents' : 'Documents'}
        </span>
      </div>
      <div className="flex items-center space-x-3">
        {!showRecycleBin && (
          <button
            onClick={() => setShowUpload(true)}
            disabled={!activeWorkspace}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
        )}
        <button
          onClick={() => {
            if (activeWorkspace) {
              if (showRecycleBin) {
                loadDeletedDocuments(activeWorkspace._id);
              } else {
                loadDocuments(activeWorkspace._id);
              }
            }
          }}
          disabled={!activeWorkspace}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
    {/* ...search and actions can be added here as needed... */}
  </div>
);

export default Toolbar;