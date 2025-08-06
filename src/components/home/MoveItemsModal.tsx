// components/MoveItemsModal.tsx
import React from "react";
import { Home } from "lucide-react";

interface MoveSelectedItems {
  docs: any[]; // You can type this more strictly based on your document model
  folders: any[];
}

interface Props {
  show: boolean;
  setShow: (val: boolean) => void;
  moveSelectedItems: MoveSelectedItems;
  setMoveSelectedItems: (val: MoveSelectedItems) => void;
  moveItems: (targetFolderId: string) => void;
  renderFolderTree: (folders: any[]) => React.ReactNode;
  moveTargetFolders: any[];
  theme: {
    modal: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    hover: string;
  };
}

const MoveItemsModal: React.FC<Props> = ({
  show,
  setShow,
  moveSelectedItems,
  setMoveSelectedItems,
  moveItems,
  renderFolderTree,
  moveTargetFolders,
  theme,
}) => {
  if (!show) return null;

  const handleCancel = () => {
    setShow(false);
    setMoveSelectedItems({ docs: [], folders: [] });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme.modal} rounded-lg p-6 w-96 max-h-96 overflow-auto`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme.text}`}>
          Move {moveSelectedItems.docs.length + moveSelectedItems.folders.length} item(s)
        </h3>
        <div className="space-y-2 max-h-60 overflow-auto">
          <div
            className={`flex items-center space-x-2 p-2 ${theme.hover} rounded cursor-pointer`}
            onClick={() => moveItems("")}
          >
            <Home className={`w-4 h-4 ${theme.textMuted}`} />
            <span className={`text-sm ${theme.text}`}>Workspace Root</span>
          </div>
          {renderFolderTree(moveTargetFolders)}
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleCancel}
            className={`px-4 py-2 ${theme.textSecondary} hover:text-gray-800`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveItemsModal;
