const API_BASE = 'http://localhost:3000/api';

export const API_CONFIG = {
  workspaces: {
    create: `${API_BASE}/workspaces`,
    getAll: `${API_BASE}/workspaces`,
  },
  documents: {
    upload: `${API_BASE}/documents/upload`,
    getAll: `${API_BASE}/documents`,
    preview: `${API_BASE}/documents/:id/preview`,
    delete: `${API_BASE}/documents/:id`,
    restore: `${API_BASE}/documents/:id/restore`,
    deletePermanent: `${API_BASE}/documents/:id/permanent`,
  },
};

