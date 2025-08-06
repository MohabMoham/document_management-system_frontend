// components/DocumentPreviewModal.tsx
import React from "react"
import { RefreshCw, FileText, Download } from "lucide-react"
 import { canPreviewFile } from "../../utils/mimeUtils"

interface DocumentPreview {
  id: string
  name: string
  mimeType?: string
  dataUri?: string
  error?: string
}

interface DocumentPreviewModalProps {
  previewDoc: DocumentPreview
  setPreviewDoc: (doc: DocumentPreview | null) => void
  restoreDocument?: (id: string) => void
  showRecycleBin?: boolean
  theme: {
    modal: string
    border: string
    text: string
    textMuted: string
  }
  isDark?: boolean
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  previewDoc,
  setPreviewDoc,
  restoreDocument,
  showRecycleBin = false,
  theme,
  isDark = false
}) => {
  if (!previewDoc) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme.modal} rounded-lg w-5/6 h-5/6 flex flex-col`}>
        {/* Modal Header */}
        <div className={`flex justify-between items-center p-4 ${theme.border} border-b`}>
          <div className="flex items-center space-x-3">
            <h3 className={`text-lg font-semibold ${theme.text}`}>Document Preview</h3>
            <span className={`text-sm ${theme.textMuted}`}>{previewDoc.name}</span>
            {showRecycleBin && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Deleted</span>
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
            {showRecycleBin && restoreDocument && (
              <button
                onClick={() => {
                  restoreDocument(previewDoc.id)
                  setPreviewDoc(null)
                }}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Restore
              </button>
            )}
            <button onClick={() => setPreviewDoc(null)} className={`${theme.textMuted} hover:text-gray-600 p-1`}>
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
                <h4 className={`text-lg font-medium ${theme.text} mb-2`}>Preview Error</h4>
                <p className={`${theme.textMuted} text-sm`}>{previewDoc.error}</p>
              </div>
            </div>
          ) : !previewDoc.dataUri ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className={`w-8 h-8 animate-spin ${theme.textMuted} mx-auto mb-2`} />
                <p className={theme.textMuted}>Loading preview...</p>
              </div>
            </div>
          ) : canPreviewFile(previewDoc.mimeType || "") ? (
            <div className={`h-full ${isDark ? "bg-gray-700" : "bg-gray-50"} rounded-lg overflow-hidden`}>
              {previewDoc.mimeType === "application/pdf" && (
                <iframe src={previewDoc.dataUri} className="w-full h-full" title="PDF Preview" />
              )}
              {previewDoc.mimeType?.startsWith("image/") && (
                <div className="h-full flex items-center justify-center p-4">
                  <img
                    src={previewDoc.dataUri || "/placeholder.svg"}
                    alt={previewDoc.name}
                    className="max-w-full max-h-full object-contain rounded shadow-lg"
                  />
                </div>
              )}
              {(previewDoc.mimeType?.startsWith("text/") || previewDoc.mimeType === "application/json") && (
                <div className="h-full overflow-auto">
                  <iframe src={previewDoc.dataUri} className="w-full h-full border-0" title="Text Preview" />
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div
                  className={`w-16 h-16 ${isDark ? "bg-gray-700" : "bg-gray-100"} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <FileText className={`w-8 h-8 ${theme.textMuted}`} />
                </div>
                <h4 className={`text-lg font-medium ${theme.text} mb-2`}>Preview Not Available</h4>
                <p className={`${theme.textMuted} text-sm mb-4`}>
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
  )
}

export default DocumentPreviewModal
