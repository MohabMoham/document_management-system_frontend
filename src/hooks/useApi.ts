
"use client"

import { useState } from "react"
import type { Workspace, Document, FolderItem, WorkspaceForm, FolderForm, PreviewDoc, ApiConfig } from "@/types"

export function useDocumentManagement() {
  // State
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [currentFolder, setCurrentFolder] = useState<FolderItem | null>(null)
  const [breadcrumb, setBreadcrumb] = useState<FolderItem[]>([])
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [deletedFolders, setDeletedFolders] = useState<FolderItem[]>([])
  const [deletedDocuments, setDeletedDocuments] = useState<Document[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])
  const [workspaceForm, setWorkspaceForm] = useState<WorkspaceForm>({
    name: "",
    type: "Education",
    description: "",
  })
  const [folderForm, setFolderForm] = useState<FolderForm>({
    name: "",
    description: "",
    parentFolderId: undefined,
  })
  const [showCreateWorkspace, setShowCreateWorkspace] = useState<boolean>(false)
  const [showCreateFolder, setShowCreateFolder] = useState<boolean>(false)
  const [showUpload, setShowUpload] = useState<boolean>(false)
  const [showRecycleBin, setShowRecycleBin] = useState<boolean>(false)
  const [showMoveDialog, setShowMoveDialog] = useState<boolean>(false)
  const [moveTargetFolders, setMoveTargetFolders] = useState<FolderItem[]>([])
  const [moveSelectedItems, setMoveSelectedItems] = useState<{ docs: string[]; folders: string[] }>({
    docs: [],
    folders: [],
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])
  const [previewDoc, setPreviewDoc] = useState<PreviewDoc | null>(null)
  const [error, setError] = useState<string>("")

  // API Configuration
  const API_BASE = "http://localhost:3000/api"
  const API_CONFIG: ApiConfig = {
    workspaces: {
      create: `${API_BASE}/workspaces`,
      getAll: `${API_BASE}/workspaces`,
      getById: `${API_BASE}/workspaces/:id`,
      update: `${API_BASE}/workspaces/:id`,
      delete: `${API_BASE}/workspaces/:id`,
    },
    folders: {
      create: `${API_BASE}/folders`,
      getByWorkspace: `${API_BASE}/folders/workspace/:workspaceId`,
      getTree: `${API_BASE}/folders/workspace/:workspaceId/tree`,
      update: `${API_BASE}/folders/:id`,
      delete: `${API_BASE}/folders/:id`,
      restore: `${API_BASE}/folders/:id/restore`,
      permanentDelete: `${API_BASE}/folders/:id/permanent`,
      getDeleted: `${API_BASE}/folders/deleted/list`,
      search: `${API_BASE}/folders/search/query`,
    },
    documents: {
      create: `${API_BASE}/documents`,
      getAll: `${API_BASE}/documents`,
      getByFolder: `${API_BASE}/documents/folder/:folderId`,
      update: `${API_BASE}/documents/:id`,
      delete: `${API_BASE}/documents/:id`,
      upload: `${API_BASE}/documents/upload`,
      download: `${API_BASE}/documents/:id/download`,
      preview: `${API_BASE}/documents/:id/preview`,
      getByWorkspace: `${API_BASE}/documents/workspace/:workspaceId`,
      getWithStructure: `${API_BASE}/documents/workspace/:workspaceId/structure`,
      search: `${API_BASE}/documents/search/query`,
      getDeleted: `${API_BASE}/documents/deleted/list`,
      restore: `${API_BASE}/documents/:id/restore`,
      permanentDelete: `${API_BASE}/documents/:id/permanent`,
      move: `${API_BASE}/documents/:id/move`,
    },
  }

  // Helper function to make authenticated API calls
  const apiCall = async <T = any>(url: string, options: RequestInit = {}): Promise<T> => {
    const config: RequestInit = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.text()
          errorMessage += ` - ${errorData}`
        } catch (e) {
          console.error("Could not parse error response")
        }
        throw new Error(errorMessage)
      }

      const data: T = await response.json()
      return data
    } catch (error) {
      console.error("API call failed:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setError(`API Error: ${errorMessage}`)
      throw error
    }
  }

  // Load workspaces
  const loadWorkspaces = async (): Promise<void> => {
    setLoading(true)
    setError("")
    try {
      const data = await apiCall<Workspace[]>(API_CONFIG.workspaces.getAll)
      setWorkspaces(data)
      if (data.length > 0) {
        setActiveWorkspace(data[0])
      }
    } catch (error) {
      console.error("Error loading workspaces:", error)
    }
    setLoading(false)
  }

  // Load workspace content (folders and documents)
  const loadWorkspaceContent = async (workspaceId: string, folderId?: string): Promise<void> => {
    setLoading(true)
    setError("")
    try {
      // Load folders
      let foldersUrl = API_CONFIG.folders.getByWorkspace.replace(":workspaceId", workspaceId)
      if (folderId) {
        foldersUrl += `?parentFolderId=${folderId}`
      }

      const foldersResponse = await apiCall<{ results: FolderItem[] }>(foldersUrl)
      setFolders(foldersResponse.results || [])

      // Load documents
      let documentsUrl: string
      if (folderId) {
        documentsUrl = API_CONFIG.documents.getByFolder.replace(":folderId", folderId)
      } else {
        documentsUrl = API_CONFIG.documents.getByWorkspace.replace(":workspaceId", workspaceId)
      }

      const documentsResponse = await apiCall<{ results: Document[] }>(documentsUrl)
      setDocuments((documentsResponse.results || []).filter((doc) => !doc.deleted))

      // Update current folder and breadcrumb
      if (folderId) {
        const folder = await apiCall<FolderItem>(API_CONFIG.folders.getByWorkspace.replace(":workspaceId", folderId))
        setCurrentFolder(folder)
        updateBreadcrumb(folder)
      } else {
        setCurrentFolder(null)
        setBreadcrumb([])
      }
    } catch (error) {
      console.error("Error loading workspace content:", error)
      setFolders([])
      setDocuments([])
    }
    setLoading(false)
  }

  // Update breadcrumb navigation
  const updateBreadcrumb = async (folder: FolderItem): Promise<void> => {
    const crumbs: FolderItem[] = []
    let current = folder

    while (current) {
      crumbs.unshift(current)
      if (current.parentFolderId) {
        try {
          current = await apiCall<FolderItem>(`${API_BASE}/folders/${current.parentFolderId}`)
        } catch {
          break
        }
      } else {
        break
      }
    }

    setBreadcrumb(crumbs)
  }

  // Create workspace
  const createWorkspace = async (workspaceData: WorkspaceForm): Promise<void> => {
    setError("")
    try {
      const payload = {
        title: workspaceData.name,
        type: workspaceData.type,
        description: workspaceData.description,
      }
      await apiCall<Workspace>(API_CONFIG.workspaces.create, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      await loadWorkspaces()
    } catch (error) {
      console.error("Error creating workspace:", error)
    }
  }

  // Create folder
  const createFolder = async (folderData: FolderForm): Promise<void> => {
    setError("")
    if (!activeWorkspace) return

    try {
      const payload = {
        workspaceId: activeWorkspace._id,
        parentFolderId: currentFolder?._id || folderData.parentFolderId,
        name: folderData.name,
        description: folderData.description,
      }

      await apiCall<FolderItem>(API_CONFIG.folders.create, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      await loadWorkspaceContent(activeWorkspace._id, currentFolder?._id)
    } catch (error) {
      console.error("Error creating folder:", error)
    }
  }

  // Navigate to folder
  const navigateToFolder = (folder: FolderItem): void => {
    if (activeWorkspace) {
      setCurrentFolder(folder)
      loadWorkspaceContent(activeWorkspace._id, folder._id)
    }
  }

  // Navigate up (back to parent folder)
  const navigateUp = (): void => {
    if (currentFolder && currentFolder.parentFolderId && activeWorkspace) {
      loadWorkspaceContent(activeWorkspace._id, currentFolder.parentFolderId)
    } else if (currentFolder && activeWorkspace) {
      // Go to workspace root
      loadWorkspaceContent(activeWorkspace._id)
    }
  }

  // Upload document
  const uploadDocument = async (file: File, workspaceId: string, folderId?: string | null): Promise<void> => {
    setError("")
    setUploadingFiles((prev) => [...prev, file.name])

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("workspaceId", workspaceId)

      // Only add folderId if it exists and is a valid ObjectId
      if (folderId && folderId !== "null" && /^[a-f\d]{24}$/i.test(folderId)) {
        formData.append("folderId", folderId)
      }

      const response = await fetch(API_CONFIG.documents.upload, {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Upload failed: ${response.status} - ${errorText}`)
      }

      // Reload current view after successful upload
      await loadWorkspaceContent(workspaceId, currentFolder?._id)
    } catch (error) {
      console.error("Error uploading document:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown upload error"
      setError(`Upload failed: ${errorMessage}`)
    } finally {
      setUploadingFiles((prev) => prev.filter((name) => name !== file.name))
    }
  }

  // Move documents/folders
  const moveItems = async (targetFolderId: string): Promise<void> => {
    setError("")
    try {
      // Move documents
      for (const docId of moveSelectedItems.docs) {
        const url = API_CONFIG.documents.move.replace(":id", docId)
        await apiCall(url, {
          method: "PUT",
          body: JSON.stringify({ targetFolderId }),
        })
      }

      // Move folders
      for (const folderId of moveSelectedItems.folders) {
        const url = API_CONFIG.folders.update.replace(":id", folderId)
        await apiCall(url, {
          method: "PUT",
          body: JSON.stringify({ parentFolderId: targetFolderId }),
        })
      }

      // Refresh current view
      if (activeWorkspace) {
        await loadWorkspaceContent(activeWorkspace._id, currentFolder?._id)
      }
      setShowMoveDialog(false)
      setMoveSelectedItems({ docs: [], folders: [] })
      setSelectedDocs([])
      setSelectedFolders([])
    } catch (error) {
      console.error("Error moving items:", error)
    }
  }

  // Load folders for move dialog
  const loadMoveTargetFolders = async (): Promise<void> => {
    if (!activeWorkspace) return

    try {
      const url = API_CONFIG.folders.getTree.replace(":workspaceId", activeWorkspace._id)
      const folders = await apiCall<FolderItem[]>(url)
      setMoveTargetFolders(folders)
    } catch (error) {
      console.error("Error loading target folders:", error)
    }
  }

  // Delete operations
  const deleteFolder = async (folderId: string): Promise<void> => {
    setError("")
    try {
      const url = API_CONFIG.folders.delete.replace(":id", folderId)
      await apiCall(url, { method: "DELETE" })

      if (activeWorkspace) {
        await loadWorkspaceContent(activeWorkspace._id, currentFolder?._id)
      }
    } catch (error) {
      console.error("Error deleting folder:", error)
    }
  }

  const deleteDocument = async (documentId: string): Promise<void> => {
    setError("")
    try {
      const url = API_CONFIG.documents.delete.replace(":id", documentId)
      await apiCall(url, { method: "DELETE" })

      if (activeWorkspace) {
        await loadWorkspaceContent(activeWorkspace._id, currentFolder?._id)
      }
    } catch (error) {
      console.error("Error deleting document:", error)
    }
  }

  // Load recycle bin content
  const loadRecycleBinContent = async (): Promise<void> => {
    setLoading(true)
    setError("")
    try {
      let foldersUrl = API_CONFIG.folders.getDeleted
      let documentsUrl = API_CONFIG.documents.getDeleted

      if (activeWorkspace) {
        foldersUrl += `?workspaceId=${activeWorkspace._id}`
        documentsUrl += `?workspaceId=${activeWorkspace._id}`
      }

      const [foldersResponse, documentsResponse] = await Promise.all([
        apiCall<{ results: FolderItem[] }>(foldersUrl),
        apiCall<{ results: Document[] }>(documentsUrl),
      ])

      setDeletedFolders(foldersResponse.results || [])
      setDeletedDocuments(documentsResponse.results || [])
    } catch (error) {
      console.error("Error loading recycle bin content:", error)
      setDeletedFolders([])
      setDeletedDocuments([])
    }
    setLoading(false)
  }

  // Restore operations
  const restoreFolder = async (folderId: string): Promise<void> => {
    setError("")
    try {
      const url = API_CONFIG.folders.restore.replace(":id", folderId)
      await apiCall(url, { method: "PUT" })

      await loadRecycleBinContent()
    } catch (error) {
      console.error("Error restoring folder:", error)
    }
  }

  const restoreDocument = async (documentId: string): Promise<void> => {
    setError("")
    try {
      const url = API_CONFIG.documents.restore.replace(":id", documentId)
      await apiCall(url, { method: "PUT" })

      await loadRecycleBinContent()
    } catch (error) {
      console.error("Error restoring document:", error)
    }
  }

  // Download and preview operations
  const downloadDocument = async (documentId: string, documentName: string): Promise<void> => {
    setError("")
    try {
      const url = API_CONFIG.documents.download.replace(":id", documentId)

      const response = await fetch(url, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`)
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = documentName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error("Error downloading document:", error)
    }
  }

  const previewDocument = async (documentId: string): Promise<void> => {
    setError("")
    setPreviewDoc({ id: documentId, loading: true })

    try {
      const url = API_CONFIG.documents.preview.replace(":id", documentId)
      const data = await apiCall<{ dataUri: string }>(url)

      const dataUri = data.dataUri
      const mimeType = getMimeTypeFromDataUri(dataUri)

      const allDocs = [...documents, ...deletedDocuments]
      setPreviewDoc({
        id: documentId,
        dataUri: dataUri,
        mimeType: mimeType,
        name: allDocs.find((d) => d._id === documentId)?.name || "Document",
      })
    } catch (error) {
      console.error("Error previewing document:", error)

      const allDocs = [...documents, ...deletedDocuments]
      setPreviewDoc({
        id: documentId,
        error: error instanceof Error ? error.message : "Unknown error",
        name: allDocs.find((d) => d._id === documentId)?.name || "Document",
      })
    }
  }

  // Helper functions
  const getMimeTypeFromDataUri = (dataUri: string): string => {
    if (!dataUri || typeof dataUri !== "string") return "application/octet-stream"
    const match = dataUri.match(/data:([^;]+);base64,/)
    return match ? match[1] : "application/octet-stream"
  }

  return {
    // State
    activeWorkspace,
    workspaces,
    currentFolder,
    breadcrumb,
    folders,
    documents,
    deletedFolders,
    deletedDocuments,
    searchTerm,
    selectedDocs,
    selectedFolders,
    workspaceForm,
    folderForm,
    showCreateWorkspace,
    showCreateFolder,
    showUpload,
    showRecycleBin,
    showMoveDialog,
    moveTargetFolders,
    moveSelectedItems,
    loading,
    uploadingFiles,
    previewDoc,
    error,

    // Setters
    setActiveWorkspace,
    setCurrentFolder,
    setSearchTerm,
    setSelectedDocs,
    setSelectedFolders,
    setWorkspaceForm,
    setFolderForm,
    setShowCreateWorkspace,
    setShowCreateFolder,
    setShowUpload,
    setShowRecycleBin,
    setShowMoveDialog,
    setMoveSelectedItems,
    setError,
    setPreviewDoc,

    // API functions
    loadWorkspaces,
    createWorkspace,
    loadWorkspaceContent,
    createFolder,
    navigateToFolder,
    navigateUp,
    uploadDocument,
    moveItems,
    deleteFolder,
    deleteDocument,
    loadRecycleBinContent,
    restoreFolder,
    restoreDocument,
    downloadDocument,
    previewDocument,
    loadMoveTargetFolders,
  }
}
