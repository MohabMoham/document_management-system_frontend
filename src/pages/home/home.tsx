"use client"

import React, { useState, useEffect, createContext, useContext,useCallback } from "react"
import {
  Folder,
  type File,
  Upload,
  Download,
  Trash2,
  Eye,
  Search,
  Plus,
  User,
  Filter,
  RefreshCw,
  Home,
  FileText,
  RotateCcw,
  Trash,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  ArrowLeft,
  Move,
  Moon,
  Sun,
  SortAsc,
  SortDesc,
} from "lucide-react"

import type {
  Workspace,
  FolderItem,
  Document,
  WorkspaceForm,
  FolderForm,
  PreviewDoc,
  ApiConfig
} from "../../types";

import { getMimeTypeFromDataUri, getMimeTypeFromFileName, canPreviewFile } from "../../utils/mimeUtils";
import Header from "../../components/home/header";
import SideBar from "../../components/home/sideBar";
import Breadcrumb from "../../components/home/breadcrumb";
import Toolbar from "../../components/home/toolbar";
import SearchActions from "../../components/home/searchActions";
import FilterPanel from "../../components/home/filterPanel";
import documentsContentArea from "../../components/home/documentsContentArea";
 import { useTheme } from "../../App"; 
 import CreateWorkspaceModal from "../../components/home/CreateWorkspaceModal";
 import CreateFolderModal from "../../components/home/CreateFolderModal";
import UploadDocumentModal from "../../components/home/UploadDocumentModal";
import MoveItemsModal from "../../components/home/MoveItemsModal";
import DocumentPreviewModal from "../../components/home/DocumentPreviewModal";







// Type definitions (same as before)


// Filter and Sort types
type SortField = "name" | "date" | "type" | "size"
type SortOrder = "asc" | "desc"
type FilterType = "all" | "folders" | "documents"
type FilterDate = "all" | "today" | "week" | "month" | "year"

const DocumentWorkspaceUI: React.FC = () => {
  const { isDark } = useTheme()

  // Existing state
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
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])
  const [previewDoc, setPreviewDoc] = useState<PreviewDoc | null>(null)
  const [error, setError] = useState<string>("")

  // New state for filtering and sorting
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [filterDate, setFilterDate] = useState<FilterDate>("all")
  const [showFilters, setShowFilters] = useState<boolean>(false)

  // API Configuration (same as before)
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
      search: `${API_BASE}/documents/search`,
      getDeleted: `${API_BASE}/documents/deleted/list`,
      restore: `${API_BASE}/documents/:id/restore`,
      permanentDelete: `${API_BASE}/documents/:id/permanent`,
      move: `${API_BASE}/documents/:id/move`,
    },
  }

  // Helper function to make authenticated API calls (same as before)
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

  // Filtering and sorting functions
  const filterByDate = (item: FolderItem | Document, dateFilter: FilterDate): boolean => {
    if (dateFilter === "all") return true

    const itemDate = new Date(item.updatedAt || item.createdAt)
    const now = new Date()

    switch (dateFilter) {
      case "today":
        return itemDate.toDateString() === now.toDateString()
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return itemDate >= weekAgo
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return itemDate >= monthAgo
      case "year":
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        return itemDate >= yearAgo
      default:
        return true
    }
  }

  const sortItems = <T extends FolderItem | Document>(items: T[], field: SortField, order: SortOrder): T[] => {
    return [...items].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (field) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "date":
          aValue = new Date(a.updatedAt || a.createdAt)
          bValue = new Date(b.updatedAt || b.createdAt)
          break
        case "type":
          aValue = "type" in a ? a.type : "folder"
          bValue = "type" in b ? b.type : "folder"
          break
        case "size":
          aValue = "metadata" in a ? a.metadata?.size || 0 : 0
          bValue = "metadata" in b ? b.metadata?.size || 0 : 0
          break
        default:
          return 0
      }

      if (aValue < bValue) return order === "asc" ? -1 : 1
      if (aValue > bValue) return order === "asc" ? 1 : -1
      return 0
    })
  }

  // Apply filters and sorting
  const getFilteredAndSortedItems = () => {
    let filteredFolders = folders.filter(
      (folder) =>
        folder.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterType === "all" || filterType === "folders") &&
        filterByDate(folder, filterDate),
    )

    let filteredDocuments = documents.filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterType === "all" || filterType === "documents") &&
        filterByDate(doc, filterDate),
    )

    // Sort items
    filteredFolders = sortItems(filteredFolders, sortField, sortOrder)
    filteredDocuments = sortItems(filteredDocuments, sortField, sortOrder)

    return { filteredFolders, filteredDocuments }
  }

  const getFilteredDeletedItems = () => {
    let filteredDeletedFolders = deletedFolders.filter(
      (folder) =>
        folder.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterType === "all" || filterType === "folders") &&
        filterByDate(folder, filterDate),
    )

    let filteredDeletedDocuments = deletedDocuments.filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterType === "all" || filterType === "documents") &&
        filterByDate(doc, filterDate),
    )

    // Sort items
    filteredDeletedFolders = sortItems(filteredDeletedFolders, sortField, sortOrder)
    filteredDeletedDocuments = sortItems(filteredDeletedDocuments, sortField, sortOrder)

    return { filteredDeletedFolders, filteredDeletedDocuments }
  }

  // Get theme classes
  const getThemeClasses = () => ({
   bg: isDark ? "bg-black" : "bg-gray-100",
    cardBg: isDark ? "bg-black" : "bg-white",
    text: isDark ? "text-gray-100" : "text-gray-800",
    textSecondary: isDark ? "text-gray-300" : "text-gray-600",
    textMuted: isDark ? "text-gray-400" : "text-gray-500",
    border: isDark ? "border-gray-700" : "border-gray-200",
    hover: isDark ? "hover:bg-gray-700" : "hover:bg-gray-50",
    input: isDark ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900",
    button: isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200",
    modal: isDark ? "bg-gray-800" : "bg-white",
  })

  const theme = getThemeClasses()

  // All the existing functions remain the same...
  useEffect(() => {
    loadWorkspaces()
  }, [])

  useEffect(() => {
    if (activeWorkspace && !showRecycleBin) {
      loadWorkspaceContent(activeWorkspace._id)
    }
  }, [activeWorkspace, showRecycleBin])

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

  // Load workspace content (folders and documents) - FIXED VERSION
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

      // Load documents - FIXED LOGIC
      let documentsResponse: { results: Document[] }

      if (folderId) {
        // When inside a folder, get documents specifically for this folder
        const documentsUrl = API_CONFIG.documents.getByFolder.replace(":folderId", folderId)
        console.log("Loading documents for folder:", folderId, "URL:", documentsUrl)
        documentsResponse = await apiCall<{ results: Document[] }>(documentsUrl)
      } else {
        // When at root level, get all workspace documents and filter for root-level ones
        const documentsUrl = API_CONFIG.documents.getByWorkspace.replace(":workspaceId", workspaceId)
        console.log("Loading root documents for workspace:", workspaceId, "URL:", documentsUrl)
        const allDocuments = await apiCall<{ results: Document[] }>(documentsUrl)

        // Filter to show only documents that don't have a folderId (root level documents)
        const rootDocuments = (allDocuments.results || []).filter(
          (doc) => !doc.folderId || doc.folderId === "" || doc.folderId === null,
        )

        documentsResponse = { results: rootDocuments }
      }

      // Filter out deleted documents and set the state
      const activeDocuments = (documentsResponse.results || []).filter((doc) => !doc.deleted)
      console.log("Loaded documents:", activeDocuments.length, "documents")
      setDocuments(activeDocuments)

      // Update current folder and breadcrumb
      if (folderId) {
        try {
          // Get folder details for breadcrumb
          const folderUrl = `${API_BASE}/folders/${folderId}`
          const folder = await apiCall<FolderItem>(folderUrl)
          setCurrentFolder(folder)
          updateBreadcrumb(folder)
        } catch (error) {
          console.error("Error loading folder details:", error)
          // If we can't load folder details, at least set a basic folder object
          setCurrentFolder({
            _id: folderId,
            name: "Unknown Folder",
            workspaceId,
            path: "",
            deleted: false,
            createdAt: "",
            updatedAt: "",
          })
        }
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

  // Enhanced navigate to folder function
  const navigateToFolder = (folder: FolderItem): void => {
    if (activeWorkspace) {
      console.log(`🧭 Navigating to folder: "${folder.name}" (${folder._id})`)
      setCurrentFolder(folder)
      loadWorkspaceContent(activeWorkspace._id, folder._id)
    }
  }

  // Enhanced navigate up function
  const navigateUp = (): void => {
    if (currentFolder && currentFolder.parentFolderId && activeWorkspace) {
      console.log(`⬆️ Navigating up to parent folder: ${currentFolder.parentFolderId}`)
      loadWorkspaceContent(activeWorkspace._id, currentFolder.parentFolderId)
    } else if (currentFolder && activeWorkspace) {
      console.log("🏠 Navigating to workspace root")
      loadWorkspaceContent(activeWorkspace._id)
    }
  }

  // ENHANCED Upload document function with better folder handling
  const uploadDocument = async (file: File, workspaceId: string, targetFolderId?: string | null): Promise<void> => {
    setError("")
    setUploadingFiles((prev) => [...prev, file.name])

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("workspaceId", workspaceId)

      // CRITICAL: Ensure folder ID is properly set
      if (targetFolderId) {
        console.log("📁 Uploading to specific folder:", targetFolderId)
        formData.append("folderId", targetFolderId)
      } else if (currentFolder && currentFolder._id) {
        console.log("📁 Using current folder context:", currentFolder._id, currentFolder.name)
        formData.append("folderId", currentFolder._id)
      } else {
        console.log("🏠 Uploading to workspace root (no folder)")
        // Explicitly set empty folderId for root uploads
        formData.append("folderId", "")
      }

      // Debug: Log all form data
      console.log("📤 Upload FormData contents:")
      for (const [key, value] of (formData as any).entries()) {
        console.log(`  ${key}:`, value)
      }

      const response = await fetch(API_CONFIG.documents.upload, {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Upload response error:", errorText)
        throw new Error(`Upload failed: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log("✅ Upload successful:", result)

      // IMPORTANT: Reload the current view to show the uploaded document
      console.log("🔄 Reloading current folder view...")
      await loadWorkspaceContent(workspaceId, currentFolder?._id)

      // Show success message
      console.log(
        `✅ Document "${file.name}" uploaded successfully to ${currentFolder ? `folder "${currentFolder.name}"` : "workspace root"}`,
      )
    } catch (error) {
      console.error("❌ Error uploading document:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown upload error"
      setError(`Upload failed: ${errorMessage}`)
    } finally {
      setUploadingFiles((prev) => prev.filter((name) => name !== file.name))
    }
  }

  // Move items
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

  // Helper function to verify document is in correct folder
  const verifyDocumentLocation = (doc: Document, expectedFolderId?: string): boolean => {
    if (!expectedFolderId) {
      // Root level - document should have no folderId or empty folderId
      return !doc.folderId || doc.folderId === "" || doc.folderId === null
    } else {
      // Inside folder - document should have matching folderId
      return doc.folderId === expectedFolderId
    }
  }

  // Helper functions


  const getFileIcon = (type: string): JSX.Element => {
    if (type === "folder") return <Folder className="w-4 h-4 text-blue-500" />
    return <FileText className="w-4 h-4 text-gray-500" />
  }

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (activeWorkspace && e.target.files) {
      Array.from(e.target.files).forEach((file) => {
        const targetFolder = currentFolder?._id || null
        console.log("Uploading file to folder:", targetFolder)
        uploadDocument(file, activeWorkspace._id, targetFolder)
      })
      setShowUpload(false)
      e.target.value = ""
    }
  }

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()

    if (activeWorkspace && e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach((file) => {
        const targetFolder = currentFolder?._id || null
        console.log("Dropping file to folder:", targetFolder)
        uploadDocument(file, activeWorkspace._id, targetFolder)
      })
    }
  }

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
  }

  const renderFolderTree = (folders: FolderItem[], level = 0): JSX.Element[] => {
    return folders.map((folder) => (
      <div key={folder._id} style={{ marginLeft: `${level * 20}px` }}>
        <div
          className={`flex items-center space-x-2 p-2 ${theme.hover} rounded cursor-pointer`}
          onClick={() => {
            if (showMoveDialog) {
              moveItems(folder._id)
            }
          }}
        >
          <Folder className="w-4 h-4 text-blue-500" />
          <span className={`text-sm ${theme.text}`}>{folder.name}</span>
        </div>
        {folder.subfolders && renderFolderTree(folder.subfolders, level + 1)}
      </div>
    ))
  }

  // Get filtered and sorted items
  const { filteredFolders, filteredDocuments } = getFilteredAndSortedItems()
  const { filteredDeletedFolders, filteredDeletedDocuments } = getFilteredDeletedItems()

  
  return (
    <div className={`min-h-screen ${theme.bg}`}>
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 mx-6 mt-4">
          <p className="text-sm">{error}</p>
          <button onClick={() => setError("")} className="text-red-500 hover:text-red-700 text-xs underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md mb-4 mx-6 mt-4">
          <p className="text-sm">Uploading: {uploadingFiles.join(", ")}</p>
          {currentFolder && <p className="text-xs text-blue-600 mt-1">Target folder: {currentFolder.name}</p>}
        </div>
      )}

      {/* Header */}
     <Header
  theme={theme}
  showRecycleBin={showRecycleBin}
  setShowRecycleBin={setShowRecycleBin}
  activeWorkspace={activeWorkspace}
  currentFolder={currentFolder}
  loadWorkspaceContent={loadWorkspaceContent}
  loadRecycleBinContent={loadRecycleBinContent}
  ThemeToggle={ThemeToggle}
/>

      <div className="flex h-screen">
        {/* Sidebar - Workspaces */}
       <SideBar
  theme={theme}
  workspaces={workspaces}
  activeWorkspace={activeWorkspace}
  setActiveWorkspace={setActiveWorkspace}
  setShowCreateWorkspace={setShowCreateWorkspace}
  setCurrentFolder={setCurrentFolder}
  setBreadcrumb={setBreadcrumb}
  showRecycleBin={showRecycleBin}
  loadRecycleBinContent={loadRecycleBinContent}
  loadWorkspaceContent={loadWorkspaceContent}
/>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Breadcrumb and Toolbar */}
          <div className={`${theme.cardBg} ${theme.border} border-b p-4`}>
            {/* Breadcrumb */}
            {!showRecycleBin && breadcrumb.length > 0 && (
             <Breadcrumb
  theme={theme}
  breadcrumb={breadcrumb}
  activeWorkspace={activeWorkspace}
  setCurrentFolder={setCurrentFolder}
  setBreadcrumb={setBreadcrumb}
  loadWorkspaceContent={loadWorkspaceContent}
  showRecycleBin={showRecycleBin}
/>
            )}

         <Toolbar
  theme={theme}
  activeWorkspace={activeWorkspace}
  currentFolder={currentFolder}
  showRecycleBin={showRecycleBin}
  navigateUp={navigateUp}
  setShowCreateFolder={setShowCreateFolder}
  setShowUpload={setShowUpload}
  loadRecycleBinContent={loadRecycleBinContent}
  loadWorkspaceContent={loadWorkspaceContent}
/>

            {/* Search, Filters and Actions */}
        <SearchActions
  theme={theme}
  showRecycleBin={showRecycleBin}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  activeWorkspace={activeWorkspace}
  showFilters={showFilters}
  setShowFilters={setShowFilters}
  sortOrder={sortOrder}
  setSortOrder={setSortOrder}
  sortField={sortField}
  selectedDocs={selectedDocs}
  selectedFolders={selectedFolders}
  restoreFolder={restoreFolder}
  restoreDocument={restoreDocument}
  setSelectedDocs={setSelectedDocs}
  setSelectedFolders={setSelectedFolders}
  setMoveSelectedItems={setMoveSelectedItems}
  setShowMoveDialog={setShowMoveDialog}
  loadMoveTargetFolders={loadMoveTargetFolders}
  deleteFolder={deleteFolder}
  deleteDocument={deleteDocument}
/>

            {/* Filter Panel */}
   {showFilters && (
  <FilterPanel
    theme={theme}
    sortField={sortField}
    setSortField={setSortField}
    sortOrder={sortOrder}
    setSortOrder={setSortOrder}
    filterType={filterType}
    setFilterType={setFilterType}
    filterDate={filterDate}
    setFilterDate={setFilterDate}
    setSearchTerm={setSearchTerm}
  />
)}
          </div>

          {/* Content Area */}
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
              // Recycle Bin View
              <div className={theme.cardBg}>
                {filteredDeletedFolders.length === 0 && filteredDeletedDocuments.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <p className={theme.textMuted}>No deleted items found</p>
                  </div>
                ) : (
                  <>
                    {/* Table Header */}
                    <div
                      className={`grid grid-cols-12 gap-4 px-6 py-3 ${isDark ? "bg-gray-700" : "bg-gray-50"} ${theme.border} border-b text-sm font-medium ${theme.textSecondary}`}
                    >
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFolders(filteredDeletedFolders.map((f) => f._id))
                              setSelectedDocs(filteredDeletedDocuments.map((d) => d._id))
                            } else {
                              setSelectedFolders([])
                              setSelectedDocs([])
                            }
                          }}
                          checked={
                            (filteredDeletedFolders.length > 0 || filteredDeletedDocuments.length > 0) &&
                            selectedFolders.length === filteredDeletedFolders.length &&
                            selectedDocs.length === filteredDeletedDocuments.length
                          }
                          className="rounded border-gray-300"
                        />
                      </div>
                      <div className="col-span-4">Name</div>
                      <div className="col-span-2">Type</div>
                      <div className="col-span-2">Size</div>
                      <div className="col-span-2">Deleted</div>
                      <div className="col-span-1">Actions</div>
                    </div>

                    {/* Deleted Folders */}
                    {filteredDeletedFolders.map((folder) => (
                      <div
                        key={`folder-${folder._id}`}
                        className={`grid grid-cols-12 gap-4 px-6 py-3 ${theme.border} border-b ${theme.hover} items-center`}
                      >
                        <div className="col-span-1">
                          <input
                            type="checkbox"
                            checked={selectedFolders.includes(folder._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFolders([...selectedFolders, folder._id])
                              } else {
                                setSelectedFolders(selectedFolders.filter((id) => id !== folder._id))
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </div>
                        <div className="col-span-4 flex items-center space-x-3">
                          <Folder className={`w-4 h-4 ${theme.textMuted}`} />
                          <span className={`text-sm font-medium ${theme.textMuted}`}>{folder.name}</span>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Folder</span>
                        </div>
                        <div className={`col-span-2 text-sm ${theme.textSecondary}`}>Folder</div>
                        <div className={`col-span-2 text-sm ${theme.textSecondary}`}>-</div>
                        <div className={`col-span-2 text-sm ${theme.textSecondary}`}>
                          {folder.deletedAt || "Unknown"}
                        </div>
                        <div className="col-span-1 flex items-center space-x-2">
                          <button
                            onClick={() => restoreFolder(folder._id)}
                            className={`p-1 ${theme.textMuted} hover:text-green-600 hover:bg-green-50 rounded`}
                            title="Restore"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Deleted Documents */}
                    {filteredDeletedDocuments.map((doc) => (
                      <div
                        key={`doc-${doc._id}`}
                        className={`grid grid-cols-12 gap-4 px-6 py-3 ${theme.border} border-b ${theme.hover} items-center`}
                      >
                        <div className="col-span-1">
                          <input
                            type="checkbox"
                            checked={selectedDocs.includes(doc._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDocs([...selectedDocs, doc._id])
                              } else {
                                setSelectedDocs(selectedDocs.filter((id) => id !== doc._id))
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </div>
                        <div className="col-span-4 flex items-center space-x-3">
                          <FileText className={`w-4 h-4 ${theme.textMuted}`} />
                          <span className={`text-sm font-medium ${theme.textMuted}`}>{doc.name}</span>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Document</span>
                        </div>
                        <div className={`col-span-2 text-sm ${theme.textSecondary}`}>Document</div>
                        <div className={`col-span-2 text-sm ${theme.textSecondary}`}>
                          {formatFileSize(doc.metadata?.size)}
                        </div>
                        <div className={`col-span-2 text-sm ${theme.textSecondary}`}>{doc.deletedAt || "Unknown"}</div>
                        <div className="col-span-1 flex items-center space-x-2">
                          <button
                            onClick={() => restoreDocument(doc._id)}
                            className={`p-1 ${theme.textMuted} hover:text-green-600 hover:bg-green-50 rounded`}
                            title="Restore"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => previewDocument(doc._id)}
                            className={`p-1 ${theme.textMuted} hover:text-blue-600 hover:bg-blue-50 rounded`}
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => downloadDocument(doc._id, doc.name)}
                            className={`p-1 ${theme.textMuted} hover:text-blue-600 hover:bg-blue-50 rounded`}
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ) : (
              // Normal View (Folders and Documents)
              <div className={`${theme.cardBg} min-h-full`}>
                {filteredFolders.length === 0 && filteredDocuments.length === 0 ? (
                  <div
                    className={`flex flex-col items-center justify-center h-64 border-2 border-dashed ${theme.border} rounded-lg m-6`}
                  >
                    <Upload className={`w-12 h-12 ${theme.textMuted} mb-4`} />
                    <p className={`${theme.textMuted} text-center`}>
                      {currentFolder ? (
                        <>
                          This folder is empty
                          <br />
                          <span className="text-sm">Drop files here or click Upload to add documents</span>
                        </>
                      ) : (
                        <>
                          No items found
                          <br />
                          <span className="text-sm">Create a folder or upload documents to get started</span>
                        </>
                      )}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Table Header */}
                    <div
                      className={`grid grid-cols-12 gap-4 px-6 py-3 ${isDark ? "bg-gray-700" : "bg-gray-50"} ${theme.border} border-b text-sm font-medium ${theme.textSecondary}`}
                    >
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFolders(filteredFolders.map((f) => f._id))
                              setSelectedDocs(filteredDocuments.map((d) => d._id))
                            } else {
                              setSelectedFolders([])
                              setSelectedDocs([])
                            }
                          }}
                          checked={
                            (filteredFolders.length > 0 || filteredDocuments.length > 0) &&
                            selectedFolders.length === filteredFolders.length &&
                            selectedDocs.length === filteredDocuments.length
                          }
                          className="rounded border-gray-300"
                        />
                      </div>
                      <div className="col-span-4">Name</div>
                      <div className="col-span-2">Type</div>
                      <div className="col-span-2">Size</div>
                      <div className="col-span-2">Modified</div>
                      <div className="col-span-1">Actions</div>
                    </div>

                    {/* Folders */}
                    {filteredFolders.map((folder) => (
                      <div
                        key={`folder-${folder._id}`}
                        className={`grid grid-cols-12 gap-4 px-6 py-3 ${theme.border} border-b ${theme.hover} items-center`}
                      >
                        <div className="col-span-1">
                          <input
                            type="checkbox"
                            checked={selectedFolders.includes(folder._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFolders([...selectedFolders, folder._id])
                              } else {
                                setSelectedFolders(selectedFolders.filter((id) => id !== folder._id))
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </div>
                        <div
                          className="col-span-4 flex items-center space-x-3 cursor-pointer"
                          onClick={() => navigateToFolder(folder)}
                        >
                          <Folder className="w-4 h-4 text-blue-500" />
                          <span className={`text-sm font-medium ${theme.text}`}>{folder.name}</span>
                        </div>
                        <div className={`col-span-2 text-sm ${theme.textSecondary}`}>Folder</div>
                        <div className={`col-span-2 text-sm ${theme.textSecondary}`}>-</div>
                        <div className={`col-span-2 text-sm ${theme.textSecondary}`}>
                          {new Date(folder.updatedAt || folder.createdAt).toLocaleDateString()}
                        </div>
                        <div className="col-span-1 flex items-center space-x-2">
                          <button
                            onClick={() => navigateToFolder(folder)}
                            className={`p-1 ${theme.textMuted} hover:text-blue-600 hover:bg-blue-50 rounded`}
                            title="Open"
                          >
                            <FolderOpen className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to move "${folder.name}" to recycle bin?`)) {
                                deleteFolder(folder._id)
                              }
                            }}
                            className={`p-1 ${theme.textMuted} hover:text-red-600 hover:bg-red-50 rounded`}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Documents */}
                    {filteredDocuments.map((doc) => (
                      <div
                        key={`doc-${doc._id}`}
                        className={`grid grid-cols-12 gap-4 px-6 py-3 ${theme.border} border-b ${theme.hover} items-center`}
                      >
                        <div className="col-span-1">
                          <input
                            type="checkbox"
                            checked={selectedDocs.includes(doc._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDocs([...selectedDocs, doc._id])
                              } else {
                                setSelectedDocs(selectedDocs.filter((id) => id !== doc._id))
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </div>
                        <div className="col-span-4 flex items-center space-x-3">
                          {getFileIcon(doc.type)}
                          <span className={`text-sm font-medium ${theme.text}`}>{doc.name}</span>
                          {currentFolder && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              In Folder
                            </span>
                          )}
                        </div>
                        <div className={`col-span-2 text-sm ${theme.textSecondary}`}>Document</div>
                        <div className={`col-span-2 text-sm ${theme.textSecondary}`}>
                          {formatFileSize(doc.metadata?.size)}
                        </div>
                        <div className={`col-span-2 text-sm ${theme.textSecondary}`}>
                          {new Date(doc.updatedAt || doc.createdAt).toLocaleDateString()}
                        </div>
                        <div className="col-span-1 flex items-center space-x-2">
                          <button
                            onClick={() => previewDocument(doc._id)}
                            className={`p-1 ${theme.textMuted} hover:text-blue-600 hover:bg-blue-50 rounded`}
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => downloadDocument(doc._id, doc.name)}
                            className={`p-1 ${theme.textMuted} hover:text-green-600 hover:bg-green-50 rounded`}
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to move "${doc.name}" to recycle bin?`)) {
                                deleteDocument(doc._id)
                              }
                            }}
                            className={`p-1 ${theme.textMuted} hover:text-red-600 hover:bg-red-50 rounded`}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Workspace Modal */}
      {showCreateWorkspace && (
         <CreateWorkspaceModal
        show={showCreateWorkspace}
        setShow={setShowCreateWorkspace}
        workspaceForm={workspaceForm}
        setWorkspaceForm={setWorkspaceForm}
        createWorkspace={createWorkspace}
        theme={theme}
      />
      )}

      {/* Create Folder Modal */}
      {showCreateFolder && (
             <CreateFolderModal
        show={showCreateFolder}
        setShow={setShowCreateFolder}
        folderForm={folderForm}
        setFolderForm={setFolderForm}
        createFolder={createFolder}
        currentFolder={currentFolder}
        theme={theme}
      />
      )}

      {/* Upload Modal */}
      {showUpload && (
         <UploadDocumentModal
        show={showUpload}
        setShow={setShowUpload}
        handleFileUpload={handleFileUpload}
        uploadingFiles={uploadingFiles}
        currentFolder={currentFolder}
        activeWorkspace={activeWorkspace}
        theme={theme}
      />
      )}

      {/* Move Dialog */}
      {showMoveDialog && (
           <MoveItemsModal
        show={showMoveDialog}
        setShow={setShowMoveDialog}
        moveSelectedItems={moveSelectedItems}
        setMoveSelectedItems={setMoveSelectedItems}
        moveItems={moveItems}
        renderFolderTree={renderFolderTree}
        moveTargetFolders={moveTargetFolders}
        theme={theme}
      />
      )}

      {/* Preview Modal */}
      {previewDoc && (
         <DocumentPreviewModal
    theme={theme}
    previewDoc={previewDoc}
    isDark={isDark}
    showRecycleBin={showRecycleBin}
    restoreDocument={restoreDocument}
    setPreviewDoc={setPreviewDoc}
  />
      )}

  
    </div>
  )
}

// Theme Toggle Component
const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
    </button>
  )
}

export default DocumentWorkspaceUI

