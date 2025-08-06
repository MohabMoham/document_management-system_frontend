// components/CreateWorkspaceModal.tsx
import React from "react";

interface WorkspaceForm {
  name: string;
  type: "Education" | "Work" | "Personal" | "Other";
  description: string;
}

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
  workspaceForm: WorkspaceForm;
  setWorkspaceForm: React.Dispatch<React.SetStateAction<WorkspaceForm>>;
  createWorkspace: (data: WorkspaceForm) => void;
  theme: {
    modal: string;
    text: string;
    textSecondary: string;
    input: string;
  };
}

const CreateWorkspaceModal: React.FC<Props> = ({
  show,
  setShow,
  workspaceForm,
  setWorkspaceForm,
  createWorkspace,
  theme,
}) => {
  if (!show) return null;

  const handleCancel = () => {
    setShow(false);
    setWorkspaceForm({ name: "", type: "Education", description: "" });
  };

  const handleCreate = () => {
    if (workspaceForm.name.trim()) {
      createWorkspace(workspaceForm);
      handleCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme.modal} rounded-lg p-6 w-96`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme.text}`}>
          Create New Workspace
        </h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>
              Workspace Name
            </label>
            <input
              type="text"
              value={workspaceForm.name}
              onChange={(e) =>
                setWorkspaceForm({ ...workspaceForm, name: e.target.value })
              }
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
              placeholder="Enter workspace name"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>
              Type
            </label>
            <select
              value={workspaceForm.type}
              onChange={(e) =>
                setWorkspaceForm({
                  ...workspaceForm,
                  type: e.target.value as WorkspaceForm["type"],
                })
              }
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
            >
              <option value="Education">Education</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme.textSecondary} mb-1`}>
              Description
            </label>
            <textarea
              value={workspaceForm.description}
              onChange={(e) =>
                setWorkspaceForm({ ...workspaceForm, description: e.target.value })
              }
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
              rows={3}
              placeholder="Optional description"
            />
          </div>
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
            disabled={!workspaceForm.name.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Create Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;
