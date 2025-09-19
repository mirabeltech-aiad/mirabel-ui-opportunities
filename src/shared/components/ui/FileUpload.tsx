import React, { useState, useCallback, useRef } from 'react'
import { Upload, X, FileText, Image, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from './button'

export interface FileUploadFile {
  file: File
  id: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  preview?: string
}

interface FileUploadProps {
  files: FileUploadFile[]
  onFilesChange: (files: FileUploadFile[]) => void
  onUpload?: (files: File[]) => Promise<void>
  accept?: string
  maxSize?: number // in MB
  maxFiles?: number
  multiple?: boolean
  disabled?: boolean
  className?: string
}

const ALLOWED_TYPES = {
  'image/jpeg': { icon: Image, color: 'text-blue-500' },
  'image/jpg': { icon: Image, color: 'text-blue-500' },
  'image/png': { icon: Image, color: 'text-blue-500' },
  'image/gif': { icon: Image, color: 'text-blue-500' },
  'application/pdf': { icon: FileText, color: 'text-red-500' },
  'application/msword': { icon: FileText, color: 'text-blue-600' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, color: 'text-blue-600' },
  'text/plain': { icon: FileText, color: 'text-gray-500' }
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  onUpload,
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt',
  maxSize = 10, // 10MB default
  maxFiles = 5,
  multiple = true,
  disabled = false,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    // Check file type
    const acceptedTypes = accept.split(',').map(type => type.trim())
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    const isAccepted = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return type === fileExtension
      }
      return file.type === type
    })

    if (!isAccepted) {
      return `File type not supported. Accepted types: ${accept}`
    }

    return null
  }

  const createFilePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = () => resolve(undefined)
        reader.readAsDataURL(file)
      } else {
        resolve(undefined)
      }
    })
  }

  const handleFileSelect = useCallback(async (selectedFiles: FileList | null) => {
    if (!selectedFiles || disabled) return

    const newFiles: FileUploadFile[] = []
    const currentFileCount = files.length

    for (let i = 0; i < selectedFiles.length; i++) {
      if (currentFileCount + newFiles.length >= maxFiles) {
        break
      }

      const file = selectedFiles[i]
      const error = validateFile(file)
      const preview = await createFilePreview(file)

      newFiles.push({
        file,
        id: `${Date.now()}-${i}`,
        progress: 0,
        status: error ? 'error' : 'pending',
        error: error || undefined,
        preview
      })
    }

    onFilesChange([...files, ...newFiles])
  }, [files, onFilesChange, maxFiles, disabled, maxSize, accept])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const removeFile = useCallback((fileId: string) => {
    onFilesChange(files.filter(f => f.id !== fileId))
  }, [files, onFilesChange])

  const retryFile = useCallback((fileId: string) => {
    const updatedFiles = files.map(f => 
      f.id === fileId ? { ...f, status: 'pending' as const, error: undefined } : f
    )
    onFilesChange(updatedFiles)
  }, [files, onFilesChange])

  const getFileIcon = (file: File) => {
    const config = ALLOWED_TYPES[file.type as keyof typeof ALLOWED_TYPES] || ALLOWED_TYPES['text/plain']
    return config.icon
  }

  const getFileIconColor = (file: File) => {
    const config = ALLOWED_TYPES[file.type as keyof typeof ALLOWED_TYPES] || ALLOWED_TYPES['text/plain']
    return config.color
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? 'border-ocean-400 bg-ocean-50'
            : disabled
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
        
        <Upload className={`mx-auto h-12 w-12 ${
          disabled ? 'text-gray-300' : isDragOver ? 'text-ocean-500' : 'text-gray-400'
        }`} />
        
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || files.length >= maxFiles}
            className="mb-2"
          >
            Choose Files
          </Button>
          
          <p className="text-sm text-gray-600">
            or drag and drop files here
          </p>
          
          <p className="text-xs text-gray-500 mt-1">
            {accept.replace(/\./g, '').toUpperCase()} up to {maxSize}MB each
            {maxFiles > 1 && ` (max ${maxFiles} files)`}
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Files ({files.length}/{maxFiles})
          </h4>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((fileItem) => {
              const Icon = getFileIcon(fileItem.file)
              const iconColor = getFileIconColor(fileItem.file)
              
              return (
                <div
                  key={fileItem.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white"
                >
                  {/* File preview/icon */}
                  <div className="flex-shrink-0">
                    {fileItem.preview ? (
                      <img
                        src={fileItem.preview}
                        alt={fileItem.file.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <Icon className={`w-10 h-10 ${iconColor}`} />
                    )}
                  </div>
                  
                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileItem.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(fileItem.file.size)}
                    </p>
                    
                    {/* Progress bar */}
                    {fileItem.status === 'uploading' && (
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-ocean-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${fileItem.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {fileItem.progress}% uploaded
                        </p>
                      </div>
                    )}
                    
                    {/* Error message */}
                    {fileItem.error && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fileItem.error}
                      </p>
                    )}
                  </div>
                  
                  {/* Status icon and actions */}
                  <div className="flex items-center gap-2">
                    {fileItem.status === 'pending' && (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                    
                    {fileItem.status === 'uploading' && (
                      <Loader2 className="w-5 h-5 animate-spin text-ocean-600" />
                    )}
                    
                    {fileItem.status === 'success' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    
                    {fileItem.status === 'error' && (
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => retryFile(fileItem.id)}
                          className="text-xs px-2 py-1 h-6"
                        >
                          Retry
                        </Button>
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      </div>
                    )}
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(fileItem.id)}
                      className="text-gray-400 hover:text-red-500 p-1 h-7 w-7 hover:scale-110 transition-all duration-200 rounded-full hover:bg-red-50"
                    >
                      <X className="close-button-sm" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload