export interface Workspace {
  _id: string;
  name: string;
  title?: string;
  type: 'Education' | 'Work' | 'Personal' | 'Other';
  description?: string;
  createdAt: string;
  userId: string;
}

export interface FolderItem {
  _id: string;
  name: string;
  workspaceId: string;
  parentFolderId?: string;
  path: string;
  description?: string;
  deleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt?: string;
  subfolders?: FolderItem[];
  documentCount?: number;
}

export interface Document {
  _id: string;
  name: string;
  type: string;
  folderId: string;
  modifiedAt?: string;
  updatedAt?: string;
  createdAt: string;
  deletedAt?: string;
  owner?: string;
  uploadedBy?: string;
  deleted?: boolean;
  workspaceId: string;
  metadata?: {
    size?: number;
    mimeType?: string;
  };
}

export interface WorkspaceForm {
  name: string;
  type: 'Education' | 'Work' | 'Personal' | 'Other';
  description: string;
}

export interface FolderForm {
  name: string;
  description: string;
  parentFolderId?: string;
}

export interface PreviewDoc {
  id: string;
  loading?: boolean;
  dataUri?: string;
  mimeType?: string;
  name?: string;
  error?: string;
}

export interface ApiConfig {
  workspaces: {
    create: string;
    getAll: string;
    getById: string;
    update: string;
    delete: string;
  };
  folders: {
    create: string;
    getByWorkspace: string;
    getTree: string;
    update: string;
    delete: string;
    restore: string;
    permanentDelete: string;
    getDeleted: string;
    search: string;
  };
  documents: {
    create: string;
    getAll: string;
    getByFolder: string;
    update: string;
    delete: string;
    upload: string;
    download: string;
    preview: string;
    getByWorkspace: string;
    getWithStructure: string;
    search: string;
    getDeleted: string;
    restore: string;
    permanentDelete: string;
    move: string;
  };
}