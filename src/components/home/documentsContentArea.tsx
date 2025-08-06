// components/DocumentContentArea.tsx

import {
  RefreshCw,
  Upload,
  RotateCcw,
  Folder,
  FolderOpen,
  Trash2,
  FileText,
  Eye,
  Download
} from "lucide-react"
import React from "react"

interface DocumentContentAreaProps {
  theme: any
  isDark: boolean
  loading: boolean
  activeWorkspace: any
  showRecycleBin: boolean
  currentFolder: any

  // Data
  filteredFolders: any[]
  filteredDocuments: any[]
  filteredDeletedFolders: any[]
  filteredDeletedDocuments: any[]

  // Selection
  selectedFolders: string[]
  selectedDocs: string[]
  setSelectedFolders: (ids: string[]) => void
  setSelectedDocs: (ids: string[]) => void

  // Actions
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
  restoreFolder: (id: string) => void
  restoreDocument: (id: string) => void
  previewDocument: (id: string) => void
  downloadDocument: (id: string, name: string) => void
  deleteFolder: (id: string) => void
  deleteDocument: (id: string) => void
  navigateToFolder: (folder: any) => void

  // Utils
  getFileIcon: (type: string) => React.ReactNode
  formatFileSize: (size: number) => string
}

const DocumentContentArea: React.FC<DocumentContentAreaProps> = ({
  theme,
  isDark,
  loading,
  activeWorkspace,
  showRecycleBin,
  currentFolder,
  filteredFolders,
  filteredDocuments,
  filteredDeletedFolders,
  filteredDeletedDocuments,
  selectedFolders,
  selectedDocs,
  setSelectedFolders,
  setSelectedDocs,
  handleDragOver,
  handleDrop,
  restoreFolder,
  restoreDocument,
  previewDocument,
  downloadDocument,
  deleteFolder,
  deleteDocument,
  navigateToFolder,
  getFileIcon,
  formatFileSize
}) => {
  const allFoldersSelected = filteredFolders.length > 0 && selectedFolders.length === filteredFolders.length
  const allDocsSelected = filteredDocuments.length > 0 && selectedDocs.length === filteredDocuments.length
  const allDeletedFoldersSelected =
    filteredDeletedFolders.length > 0 && selectedFolders.length === filteredDeletedFolders.length
  const allDeletedDocsSelected =
    filteredDeletedDocuments.length > 0 && selectedDocs.length === filteredDeletedDocuments.length

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>, isDeletedView = false) => {
    if (e.target.checked) {
      if (isDeletedView) {
        setSelectedFolders(filteredDeletedFolders.map((f) => f._id))
        setSelectedDocs(filteredDeletedDocuments.map((d) => d._id))
      } else {
        setSelectedFolders(filteredFolders.map((f) => f._id))
        setSelectedDocs(filteredDocuments.map((d) => d._id))
      }
    } else {
      setSelectedFolders([])
      setSelectedDocs([])
    }
  }

  return (
    <div className="flex-1 overflow-auto" onDragOver={handleDragOver} onDrop={handleDrop}>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <RefreshCw className={`w-6 h-6 animate-spin ${theme.textMuted}`} />
          <span className={`ml-2 ${theme.textMuted}`}>Loading...</span>
        </div>
      ) : !activeWorkspace ? (
        <div className="flex items-center justify-center h-32">
          <p className={theme.textMuted}>Please select a workspace to view content</p>
        </div>
      ) : showRecycleBin ? (
        <DeletedView
          theme={theme}
          isDark={isDark}
          folders={filteredDeletedFolders}
          documents={filteredDeletedDocuments}
          selectedFolders={selectedFolders}
          selectedDocs={selectedDocs}
          handleSelectAll={handleSelectAll}
          restoreFolder={restoreFolder}
          restoreDocument={restoreDocument}
          previewDocument={previewDocument}
          downloadDocument={downloadDocument}
        />
      ) : (
        <NormalView
          theme={theme}
          isDark={isDark}
          folders={filteredFolders}
          documents={filteredDocuments}
          selectedFolders={selectedFolders}
          selectedDocs={selectedDocs}
          currentFolder={currentFolder}
          handleSelectAll={handleSelectAll}
          deleteFolder={deleteFolder}
          deleteDocument={deleteDocument}
          navigateToFolder={navigateToFolder}
          previewDocument={previewDocument}
          downloadDocument={downloadDocument}
          getFileIcon={getFileIcon}
          formatFileSize={formatFileSize}
        />
      )}
    </div>
  )
}

export default DocumentContentArea

// You can further extract <DeletedView /> and <NormalView /> into separate files if you want
