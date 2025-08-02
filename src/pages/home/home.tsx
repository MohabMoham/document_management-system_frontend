import React, { useState, useEffect } from 'react';
import { Workspace, Document, WorkspaceForm, PreviewDoc } from '../../types';
import { getMimeTypeFromDataUri, getMimeTypeFromFileName, canPreviewFile } from '../../utils/mimeUtils';
import { useApi } from '../../hooks/useApi';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Toolbar from '../../components/Toolbar';
import DocumentList from '../../components/DocumentList';


import { 
  Folder, 
  File, 
  Upload, 
  Download, 
  Trash2, 
  Eye, 
  Search, 
  Plus, 
  Edit3, 
  Settings,
  User,
  Calendar,
  Filter,
  RefreshCw,
  Home,
  FileText,
  RotateCcw,
  Trash
} from 'lucide-react';

const DocumentWorkspaceUI: React.FC = () => {
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [deletedDocuments, setDeletedDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [workspaceForm, setWorkspaceForm] = useState<WorkspaceForm>({ 
    name: '', 
    type: 'Education', 
    description: '' 
  });
  const [showCreateWorkspace, setShowCreateWorkspace] = useState<boolean>(false);
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [showRecycleBin, setShowRecycleBin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewDoc, setPreviewDoc] = useState<PreviewDoc | null>(null);
  const [error, setError] = useState<string>('');

  // API Configuration - Updated with recycle bin endpoints
  const API_BASE = 'http://localhost:3000/api';
  const API_CONFIG = {
    workspaces: {
      create: `${API_BASE}/workspaces`,
      getAll: `${API_BASE}/workspaces`,
      getById: `${API_BASE}/workspaces/:id`,
      update: `${API_BASE}/workspaces/:id`,
      delete: `${API_BASE}/workspaces/:id`
    },
    documents: {
      create: `${API_BASE}/documents`,
      getAll: `${API_BASE}/documents`,
      update: `${API_BASE}/documents/:id`,
      delete: `${API_BASE}/documents/:id`,
      upload: `${API_BASE}/documents/upload`,
      download: `${API_BASE}/documents/download/:id`,
      preview: `${API_BASE}/documents/:id/preview`,
      getByWorkspace: `${API_BASE}/workspace/:workspaceId`,
      search: `${API_BASE}/documents/search`,
      // New recycle bin endpoints
      getDeleted: `${API_BASE}/documents/deleted`,
      restore: `${API_BASE}/documents/:id/restore`,
      permanentDelete: `${API_BASE}/documents/:id/permanent`
    }
  };

  // Helper function to make authenticated API calls with cookies
  const apiCall = async <T = any>(url: string, options: RequestInit = {}): Promise<T> => {
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      console.log('Making API call to:', url, 'with config:', config);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.text();
          console.error('Server error response:', errorData);
          errorMessage += ` - ${errorData}`;
        } catch (e) {
          console.error('Could not parse error response');
        }
        throw new Error(errorMessage);
      }
      
      const data: T = await response.json();
      console.log('API response:', data);
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`API Error: ${errorMessage}`);
      throw error;
    }
  };



  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (activeWorkspace) {
      loadDocuments(activeWorkspace._id);
    }
  }, [activeWorkspace]);

  // Load workspaces
  const loadWorkspaces = async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const data = await apiCall<Workspace[]>(API_CONFIG.workspaces.getAll);
      setWorkspaces(data);

      if (data.length > 0) {
        setActiveWorkspace(data[0]);
      }
    } catch (error) {
      console.error('Error loading workspaces:', error);
    }
    setLoading(false);
  };

  // Create workspace
  const createWorkspace = async (workspaceData: WorkspaceForm): Promise<void> => {
    setError('');
    try {

        const payload = {
      title: workspaceData.name,
      type: workspaceData.type,
      description: workspaceData.description,
    };
      const newWorkspace = await apiCall<Workspace>(API_CONFIG.workspaces.create, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      console.log('Creating workspace:', workspaceData);
      await loadWorkspaces();
    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  // Load documents (non-deleted)
  const loadDocuments = async (workspaceId: string): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      console.log('Loading documents for workspace:', workspaceId);
      const url = API_CONFIG.documents.getByWorkspace.replace(':workspaceId', workspaceId);
      console.log('API URL:', url);
      
      const data = await apiCall<Document[] | { documents: Document[] }>(url);
      console.log('Documents loaded:', data);
      
      const documents = Array.isArray(data) ? data : (data.documents || []);
      setDocuments(documents.filter(doc => !doc.deleted));
    } catch (error) {
      console.error('Error loading documents:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('500')) {
        setError('Server error while loading documents. Please check server logs.');
      } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError(`Failed to load documents: ${errorMessage}`);
      }
      setDocuments([]);
    }
    setLoading(false);
  };

  // Load deleted documents for recycle bin
  const loadDeletedDocuments = async (workspaceId?: string): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      console.log('Loading deleted documents');
      let url = API_CONFIG.documents.getDeleted;
      if (workspaceId) {
        url += `?workspaceId=${workspaceId}`;
      }
      
      const data = await apiCall<Document[] | { documents: Document[] }>(url);
      console.log('Deleted documents loaded:', data);
      
      const documents = Array.isArray(data) ? data : (data.documents || []);
      setDeletedDocuments(documents.filter(doc => doc.deleted));
    } catch (error) {
      console.error('Error loading deleted documents:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Failed to load deleted documents: ${errorMessage}`);
      setDeletedDocuments([]);
    }
    setLoading(false);
  };

  // Upload document
  const uploadDocument = async (file: File, workspaceId: string): Promise<void> => {
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('workspaceId', workspaceId);
      
      const response = await fetch(API_CONFIG.documents.upload, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Document uploaded successfully:', result);
      
      await loadDocuments(workspaceId);
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  // Download document
  const downloadDocument = async (documentId: string, documentName: string): Promise<void> => {
    setError('');
    try {
      const url = API_CONFIG.documents.download.replace(':id', documentId);
      
      const response = await fetch(url, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = documentName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  // Soft delete document (move to recycle bin)
  const deleteDocument = async (documentId: string): Promise<void> => {
    setError('');
    try {
      const url = API_CONFIG.documents.delete.replace(':id', documentId);
      await apiCall(url, { method: 'DELETE' });
      
      console.log('Document moved to recycle bin successfully');
      
      if (activeWorkspace) {
        await loadDocuments(activeWorkspace._id);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  // Restore document from recycle bin
  const restoreDocument = async (documentId: string): Promise<void> => {
    setError('');
    try {
      const url = API_CONFIG.documents.restore.replace(':id', documentId);
      await apiCall(url, { method: 'PATCH' });
      
      console.log('Document restored successfully');
      
      // Refresh both deleted documents and active workspace documents
      if (activeWorkspace) {
        await loadDeletedDocuments(activeWorkspace._id);
        await loadDocuments(activeWorkspace._id);
      } else {
        await loadDeletedDocuments();
      }
    } catch (error) {
      console.error('Error restoring document:', error);
    }
  };

  // Permanently delete document
  const permanentlyDeleteDocument = async (documentId: string): Promise<void> => {
    setError('');
    try {
      const url = API_CONFIG.documents.permanentDelete.replace(':id', documentId);
      await apiCall(url, { method: 'DELETE' });
      
      console.log('Document permanently deleted');
      
      // Refresh deleted documents
      if (activeWorkspace) {
        await loadDeletedDocuments(activeWorkspace._id);
      } else {
        await loadDeletedDocuments();
      }
    } catch (error) {
      console.error('Error permanently deleting document:', error);
    }
  };

   const getFileIcon = (type: string): jsx.Element => {
    if (type === 'folder') return <Folder className="w-4 h-4 text-blue-500" />;
    return <FileText className="w-4 h-4 text-gray-500" />;
  };

  // Preview document
  const previewDocument = async (documentId: string): Promise<void> => {
    setError('');
    setPreviewDoc({ id: documentId, loading: true });
    
    try {
      const url = API_CONFIG.documents.preview.replace(':id', documentId);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const data = await apiCall<{ dataUri: string }>(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      console.log('Preview data received, size:', data.dataUri?.length || 0);
      
      if (data.dataUri && data.dataUri.length > 50 * 1024 * 1024) {
        throw new Error('File too large for browser preview. Please download to view.');
      }
      
      const dataUri = data.dataUri;
      let mimeType = getMimeTypeFromDataUri(dataUri);
      
      if (mimeType === 'application/octet-stream') {
        const allDocs = [...documents, ...deletedDocuments];
        const doc = allDocs.find(d => d._id === documentId);
        if (doc?.name) {
          mimeType = getMimeTypeFromFileName(doc.name);
          console.log('Corrected MIME type from filename:', mimeType);
        }
      }
      
      const allDocs = [...documents, ...deletedDocuments];
      setPreviewDoc({ 
        id: documentId, 
        dataUri: dataUri,
        mimeType: mimeType,
        name: allDocs.find(d => d._id === documentId)?.name || 'Document'
      });
    } catch (error) {
      console.error('Error previewing document:', error);
      
      let errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (error instanceof Error && error.name === 'AbortError') {
        errorMessage = 'Preview timeout - file may be too large. Please try downloading instead.';
      } else if (errorMessage.includes('too large')) {
        errorMessage = errorMessage;
      } else if (errorMessage.includes('500')) {
        errorMessage = 'Server error while processing large file. Try downloading instead.';
      }
      
      const allDocs = [...documents, ...deletedDocuments];
      setPreviewDoc({ 
        id: documentId, 
        error: errorMessage,
        name: allDocs.find(d => d._id === documentId)?.name || 'Document'
      });
    }
  };

  const currentDocuments = showRecycleBin ? deletedDocuments : documents;
  const filteredDocuments = currentDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (activeWorkspace && e.target.files) {
      Array.from(e.target.files).forEach(file => {
        uploadDocument(file, activeWorkspace._id);
      });
      setShowUpload(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 mx-6 mt-4">
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => setError('')}
            className="text-red-500 hover:text-red-700 text-xs underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <Header 
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={setActiveWorkspace}
        showRecycleBin={showRecycleBin}
        setShowRecycleBin={setShowRecycleBin}
        loadDeletedDocuments={loadDeletedDocuments}
        loadDocuments={loadDocuments}
        setShowCreateWorkspace={setShowCreateWorkspace}
        setShowUpload={setShowUpload}
        setError={setError}
      />

      <div className="flex h-screen">
        {/* Sidebar - Workspaces */}
        <Sidebar 
          workspaces={workspaces}
          activeWorkspace={activeWorkspace}
          setActiveWorkspace={setActiveWorkspace}
          showRecycleBin={showRecycleBin}
          loadDeletedDocuments={loadDeletedDocuments}
          setShowCreateWorkspace={setShowCreateWorkspace}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <Toolbar 
            activeWorkspace={activeWorkspace}
            showRecycleBin={showRecycleBin}
            setShowUpload={setShowUpload}
            loadDocuments={loadDocuments}
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
            selectedDocs={selectedDocs}
            setSelectedDocs={setSelectedDocs}
            restoreDocument={restoreDocument}
            permanentlyDeleteDocument={permanentlyDeleteDocument}
            downloadDocument={downloadDocument}
            deleteDocument={deleteDocument}
            setError={setError}
          />

          {/* Document List */}
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
                <DocumentList
                  loading={loading}
                  activeWorkspace={activeWorkspace}
                  filteredDocuments={filteredDocuments}
                  selectedDocs={selectedDocs}
                  setSelectedDocs={setSelectedDocs}
                  showRecycleBin={showRecycleBin}
                  getFileIcon={getFileIcon}
                  restoreDocument={restoreDocument}
                  previewDocument={previewDocument}
                  downloadDocument={downloadDocument}
                  permanentlyDeleteDocument={permanentlyDeleteDocument}
                  deleteDocument={deleteDocument}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Workspace Modal */}
      {showCreateWorkspace && (
<div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">





          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Create New Workspace</h3>
            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workspace Name
                  </label>
                  <input
                    title="title"
                    type="text"
                    required
                    value={workspaceForm.name}
                    onChange={(e) => setWorkspaceForm({...workspaceForm, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter workspace name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={workspaceForm.type}
                    onChange={(e) => setWorkspaceForm({...workspaceForm, type: e.target.value as 'Education' | 'Work' | 'Personal' | 'Other'})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Education">Education</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={workspaceForm.description}
                    onChange={(e) => setWorkspaceForm({...workspaceForm, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Optional description"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateWorkspace(false);
                    setWorkspaceForm({ name: '', type: 'Education', description: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (workspaceForm.name.trim()) {
                      createWorkspace(workspaceForm);
                      setShowCreateWorkspace(false);
                      setWorkspaceForm({ name: '', type: 'Education', description: '' });
                    }
                  }}
                  disabled={!workspaceForm.name.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Create Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Upload Document</h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
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
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Choose Files
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUpload(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
      <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-5/6 h-5/6 flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold">Document Preview</h3>
                <span className="text-sm text-gray-500">
                  {previewDoc.name}
                </span>
                {showRecycleBin && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    Deleted
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {previewDoc.dataUri && !previewDoc.error && (
                  <a
                    href={previewDoc.dataUri}
                    download={previewDoc.name}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Download
                  </a>
                )}
                {showRecycleBin && (
                  <button
                    onClick={() => {
                      restoreDocument(previewDoc.id);
                      setPreviewDoc(null);
                    }}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Restore
                  </button>
                )}
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-4 overflow-hidden">
              {previewDoc.error ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-red-500 text-2xl">⚠</span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Preview Error</h4>
                    <p className="text-gray-500 text-sm">{previewDoc.error}</p>
                  </div>
                </div>
              ) : !previewDoc.dataUri ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Loading preview...</p>
                  </div>
                </div>
              ) : canPreviewFile(previewDoc.mimeType || '') ? (
                <div className="h-full bg-gray-50 rounded-lg overflow-hidden">
                  {/* PDF Preview */}
                  {previewDoc.mimeType === 'application/pdf' && (
                    <iframe
                      src={previewDoc.dataUri}
                      className="w-full h-full"
                      title="PDF Preview"
                    />
                  )}
                  
                  {/* Image Preview */}
                  {previewDoc.mimeType?.startsWith('image/') && (
                    <div className="h-full flex items-center justify-center p-4">
                      <img
                        src={previewDoc.dataUri}
                        alt={previewDoc.name}
                        className="max-w-full max-h-full object-contain rounded shadow-lg"
                      />
                    </div>
                  )}
                  
                  {/* Text File Preview */}
                  {(previewDoc.mimeType?.startsWith('text/') || previewDoc.mimeType === 'application/json') && (
                    <div className="h-full overflow-auto">
                      <iframe
                        src={previewDoc.dataUri}
                        className="w-full h-full border-0"
                        title="Text Preview"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Preview Not Available</h4>
                    <p className="text-gray-500 text-sm mb-4">
                      This file type ({previewDoc.mimeType}) cannot be previewed in the browser.
                    </p>
                    <a
                      href={previewDoc.dataUri}
                      download={previewDoc.name}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download File</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentWorkspaceUI;