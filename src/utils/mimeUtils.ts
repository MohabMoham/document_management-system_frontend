export const getMimeTypeFromDataUri = (dataUri: string): string => {
  if (!dataUri || typeof dataUri !== 'string') return 'application/octet-stream';
  const match = dataUri.match(/data:([^;]+);base64,/);
  return match ? match[1] : 'application/octet-stream';
};

export const getMimeTypeFromFileName = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'json': 'application/json'
  };
  return mimeTypes[extension || ''] || 'application/octet-stream';
};

export const canPreviewFile = (mimeType: string): boolean => {
  const previewableTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'text/plain',
    'text/html',
    'text/css',
    'text/javascript',
    'application/json'
  ];
  return previewableTypes.includes(mimeType);
};