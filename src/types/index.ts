export interface Workspace {
  _id: string;
  name: string;
  title?: string;
  type: 'Education' | 'Work' | 'Personal' | 'Other';
  description?: string;
  createdAt: string;
  userId: string;
}

export interface Document {
  _id: string;
  name: string;
  type: string;
  modifiedAt?: string;
  updatedAt?: string;
  createdAt: string;
  deletedAt?: string;
  owner?: string;
  uploadedBy?: string;
  deleted?: boolean;
  workspaceId: string;
}

export interface WorkspaceForm {
  name: string;
  type: 'Education' | 'Work' | 'Personal' | 'Other';
  description: string;
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
  documents: {
    create: string;
    getAll: string;
    update: string;
    delete: string;
    upload: string;
    download: string;
    preview: string;
    getByWorkspace: string;
    search: string;
    getDeleted: string;
    restore: string;
    permanentDelete: string;
  };
}

export interface ApiCallOptions extends RequestInit {
  headers?: Record<string, string>;
}