// components/UploadDocumentModal.tsx
import React from "react";
import { Folder, Upload, RefreshCw } from "lucide-react";

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingFiles: string[];
  currentFolder?: { name: string };
  activeWorkspace?: { title: string };
  theme: {
    modal: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
  };
}

const UploadDocumentModal: React.FC<Props> = ({
  show,
  setShow,
  handleFileUpload,
  uploadingFiles,
  currentFolder,
  activeWorkspace,
  theme,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme.modal} rounded-lg p-6 w-96`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme.text}`}>
          Upload Document
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Folder className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Upload Destination</p>
                <p className="text-xs text-blue-600">
                  {currentFolder ? (
                    <>📁 {currentFolder.name}</>
                  ) : (
                    <>🏠 {activeWorkspace?.title} (Root)</>
                  )}
                </p>
              </div>
            </div>
            {currentFolder && (
              <p className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                Files will be uploaded directly to this folder
              </p>
            )}
          </div>

          <div
            className={`border-2 border-dashed ${theme.border} rounded-lg p-6 text-center hover:border-blue-400 transition-colors`}
          >
            <Upload className={`w-12 h-12 ${theme.textMuted} mx-auto mb-4`} />
            <p className={`text-sm ${theme.textSecondary} mb-2`}>
              Drop files here or click to browse
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Choose Files
            </label>
            <p className={`text-xs ${theme.textMuted} mt-2`}>
              Multiple files supported
            </p>
          </div>

          {uploadingFiles.length > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <RefreshCw className="w-4 h-4 animate-spin text-yellow-600" />
                <p className="text-sm font-medium text-yellow-800">
                  Uploading {uploadingFiles.length} file(s)...
                </p>
              </div>
              <div className="space-y-1">
                {uploadingFiles.map((fileName) => (
                  <div key={fileName} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-yellow-700">{fileName}</span>
                  </div>
                ))}
              </div>
              {currentFolder && (
                <p className="text-xs text-yellow-600 mt-2 italic">
                  → Uploading to: {currentFolder.name}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setShow(false)}
            className={`px-4 py-2 ${theme.textSecondary} hover:text-gray-800 transition-colors`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentModal;
