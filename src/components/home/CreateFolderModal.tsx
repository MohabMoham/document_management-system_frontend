// components/CreateFolderModal.tsx
import React from "react";

interface FolderForm {
  name: string;
  description: string;
  parentFolderId?: string;
}

interface CurrentFolder {
  name: string;
  _id: string;
}

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
  folderForm: FolderForm;
  setFolderForm: React.Dispatch<React.SetStateAction<FolderForm>>;
  createFolder: (data: FolderForm) => void;
  currentFolder?: CurrentFolder;
  theme: {
    modal: string;
    text: string;
    textSecondary: string;
    input: string;
  };
}

const CreateFolderModal: React.FC<Props> = ({
  show,
  setShow,
  folderForm,
  setFolderForm,
  createFolder,
  currentFolder,
  theme,
}) => {
  if (!show) return null;

  const handleCancel = () => {
    setShow(false);
    setFolderForm({ name: "", description: "", parentFolderId: undefined });
  };

  const handleCreate = () => {
    if (folderForm.name.trim()) {
      createFolder(folderForm);
      handleCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme.modal} rounded-lg p-6 w-96`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme.text}`}>
          Create New Folder
        </h3>
        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium ${theme.textSecondary} mb-1`}
            >
              Folder Name
            </label>
            <input
              type="text"
              value={folderForm.name}
              onChange={(e) =>
                setFolderForm({ ...folderForm, name: e.target.value })
              }
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
              placeholder="Enter folder name"
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${theme.textSecondary} mb-1`}
            >
              Description
            </label>
            <textarea
              value={folderForm.description}
              onChange={(e) =>
                setFolderForm({ ...folderForm, description: e.target.value })
              }
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
              rows={3}
              placeholder="Optional description"
            />
          </div>
          {currentFolder && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                This folder will be created inside:{" "}
                <strong>{currentFolder.name}</strong>
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleCancel}
            className={`px-4 py-2 ${theme.textSecondary} hover:text-gray-800`}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!folderForm.name.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Create Folder
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;
