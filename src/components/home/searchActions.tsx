import React from "react";
import {
  Search,
  Filter,
  ChevronDown,
  SortAsc,
  SortDesc,
  RotateCcw,
  Move,
  Trash2,
} from "lucide-react";

interface SearchActionsProps {
  theme: any;
  showRecycleBin: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeWorkspace: any;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  sortField: string;
  selectedDocs: string[];
  selectedFolders: string[];
  restoreFolder: (id: string) => void;
  restoreDocument: (id: string) => void;
  setSelectedDocs: (ids: string[]) => void;
  setSelectedFolders: (ids: string[]) => void;
  setMoveSelectedItems: (items: { docs: string[]; folders: string[] }) => void;
  setShowMoveDialog: (show: boolean) => void;
  loadMoveTargetFolders: () => void;
  deleteFolder: (id: string) => void;
  deleteDocument: (id: string) => void;
}

const SearchActions: React.FC<SearchActionsProps> = ({
  theme,
  showRecycleBin,
  searchTerm,
  setSearchTerm,
  activeWorkspace,
  showFilters,
  setShowFilters,
  sortOrder,
  setSortOrder,
  sortField,
  selectedDocs,
  selectedFolders,
  restoreFolder,
  restoreDocument,
  setSelectedDocs,
  setSelectedFolders,
  setMoveSelectedItems,
  setShowMoveDialog,
  loadMoveTargetFolders,
  deleteFolder,
  deleteDocument,
}) => (
  <div className="flex items-center space-x-4 mt-4">
    <div className="relative flex-1 max-w-md">
      <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textMuted}`} />
      <input
        type="text"
        placeholder={`Search ${showRecycleBin ? "deleted items" : "folders and documents"}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={!activeWorkspace}
        className={`pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full disabled:cursor-not-allowed ${theme.input}`}
      />
    </div>

    {/* Filter and Sort Controls */}
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center space-x-1 px-3 py-2 ${theme.textSecondary} ${theme.hover} rounded-lg`}
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        <ChevronDown
          className={`w-4 h-4 transform transition-transform ${showFilters ? "rotate-180" : ""}`}
        />
      </button>

      <button
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        className={`flex items-center space-x-1 px-3 py-2 ${theme.textSecondary} ${theme.hover} rounded-lg`}
      >
        {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
        <span>{sortField}</span>
      </button>
    </div>

    <div className="flex items-center space-x-2">
      {(selectedDocs.length > 0 || selectedFolders.length > 0) && (
        <>
          {showRecycleBin ? (
            <button
              onClick={() => {
                selectedFolders.forEach((id) => restoreFolder(id));
                selectedDocs.forEach((id) => restoreDocument(id));
                setSelectedDocs([]);
                setSelectedFolders([]);
              }}
              className="flex items-center space-x-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restore ({selectedDocs.length + selectedFolders.length})</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setMoveSelectedItems({ docs: selectedDocs, folders: selectedFolders });
                  setShowMoveDialog(true);
                  loadMoveTargetFolders();
                }}
                className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Move className="w-4 h-4" />
                <span>Move ({selectedDocs.length + selectedFolders.length})</span>
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Are you sure you want to move ${selectedDocs.length + selectedFolders.length} item(s) to recycle bin?`,
                    )
                  ) {
                    selectedFolders.forEach((id) => deleteFolder(id));
                    selectedDocs.forEach((id) => deleteDocument(id));
                    setSelectedDocs([]);
                    setSelectedFolders([]);
                  }
                }}
                className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete ({selectedDocs.length + selectedFolders.length})</span>
              </button>
            </>
          )}
        </>
      )}
    </div>
  </div>
);

export default SearchActions;