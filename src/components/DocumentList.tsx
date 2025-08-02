import React from 'react';
import { RefreshCw, RotateCcw, Eye, Download, Trash2, Settings, FileText, Folder } from 'lucide-react';
import { Document } from '../types';

interface DocumentListProps {
  loading: boolean;
  activeWorkspace: any;
  filteredDocuments: Document[];
  selectedDocs: string[];
  setSelectedDocs: (ids: string[]) => void;
  showRecycleBin: boolean;
  getFileIcon: (type: string) => JSX.Element;
  restoreDocument: (id: string) => void;
  previewDocument: (id: string) => void;
  downloadDocument: (id: string, name: string) => void;
  permanentlyDeleteDocument: (id: string) => void;
  deleteDocument: (id: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  loading,
  activeWorkspace,
  filteredDocuments,
  selectedDocs,
  setSelectedDocs,
  showRecycleBin,
  getFileIcon,
  restoreDocument,
  previewDocument,
  downloadDocument,
  permanentlyDeleteDocument,
  deleteDocument,
}) => (
  <div className="flex-1 overflow-auto">
    {loading ? (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Loading documents...</span>
      </div>
    ) : !activeWorkspace ? (
      <div className="flex items-center justify-center h-32">
        <p className="text-gray-500">Please select a workspace to view documents</p>
      </div>
    ) : filteredDocuments.length === 0 ? (
      <div className="flex items-center justify-center h-32">
        <p className="text-gray-500">
          {showRecycleBin ? 'No deleted documents found' : 'No documents found'}
        </p>
      </div>
    ) : (
      <div className="bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
          <div className="col-span-1">
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedDocs(filteredDocuments.map(doc => doc._id));
                } else {
                  setSelectedDocs([]);
                }
              }}
              checked={filteredDocuments.length > 0 && selectedDocs.length === filteredDocuments.length}
              className="rounded border-gray-300"
            />
          </div>
          <div className="col-span-4">Name</div>
          <div className="col-span-2">{showRecycleBin ? 'Deleted' : 'Modified'}</div>
          <div className="col-span-2">By</div>
          <div className="col-span-3">Actions</div>
        </div>

        {/* Document Rows */}
        {filteredDocuments.map(doc => (
          <div
            key={doc._id}
            className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 hover:bg-gray-50 items-center"
          >
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={selectedDocs.includes(doc._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedDocs([...selectedDocs, doc._id]);
                  } else {
                    setSelectedDocs(selectedDocs.filter(id => id !== doc._id));
                  }
                }}
                className="rounded border-gray-300"
              />
            </div>
            <div className="col-span-4 flex items-center space-x-3">
              {getFileIcon(doc.type)}
              <span className={`text-sm font-medium ${showRecycleBin ? 'text-gray-500' : 'text-gray-900'}`}>
                {doc.name}
              </span>
              {showRecycleBin && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  Deleted
                </span>
              )}
            </div>
            <div className="col-span-2 text-sm text-gray-600">
              {showRecycleBin 
                ? (doc.deletedAt || 'Unknown')
                : (doc.modifiedAt || doc.updatedAt || doc.createdAt)
              }
            </div>
            <div className="col-span-2 text-sm text-gray-600">
              {doc.owner || doc.uploadedBy || 'Unknown'}
            </div>
            <div className="col-span-3 flex items-center space-x-2">
              {showRecycleBin ? (
                <>
                  <button
                    onClick={() => restoreDocument(doc._id)}
                    className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                    title="Restore"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => previewDocument(doc._id)}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => downloadDocument(doc._id, doc.name)}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to permanently delete "${doc.name}"? This action cannot be undone.`)) {
                        permanentlyDeleteDocument(doc._id);
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete Forever"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => previewDocument(doc._id)}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => downloadDocument(doc._id, doc.name)}
                    className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to move "${doc.name}" to recycle bin?`)) {
                        deleteDocument(doc._id);
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Move to Recycle Bin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded">
                    <Settings className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default DocumentList;