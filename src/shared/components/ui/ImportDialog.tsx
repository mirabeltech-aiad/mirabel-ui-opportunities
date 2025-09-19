import React, { useState, useCallback, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog'
import { Button } from './button'
import { Progress } from './progress'
import { Alert, AlertDescription } from './alert'
import {
  Upload,
  FileText,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  X,
  Download
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { Product, ProductType } from '@/shared/types/product'
import { Tooltip } from './tooltip'
import { getTooltip } from '@/shared/constants/tooltips'

export interface ImportValidationError {
  row: number
  column: string
  value: any
  message: string
}

export interface ImportResult {
  success: boolean
  validRecords: Partial<Product>[]
  errors: ImportValidationError[]
  totalRows: number
  validRows: number
}

interface ImportDialogProps {
  isOpen: boolean
  onClose: () => void
  onImport: (data: Partial<Product>[]) => Promise<void>
  title?: string
  description?: string
  acceptedFileTypes?: string[]
  maxFileSize?: number
}

const SUPPORTED_FORMATS = ['.csv', '.xlsx', '.xls']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const COLUMN_MAPPINGS: Record<string, string> = {
  'product name': 'name',
  'name': 'name',
  'title': 'name',
  'product type': 'type',
  'type': 'type',
  'category': 'category',
  'sku': 'sku',
  'product code': 'sku',
  'code': 'sku',
  'price': 'basePrice',
  'base price': 'basePrice',
  'cost': 'basePrice',
  'status': 'isActive',
  'active': 'isActive',
  'is active': 'isActive',
  'description': 'description',
  'currency': 'currency'
}

const VALID_PRODUCT_TYPES: ProductType[] = [
  ProductType.DIGITAL, ProductType.PRINT, ProductType.SERVICE, ProductType.SUBSCRIPTION, ProductType.EVENT, ProductType.EDITORIAL
]

export const ImportDialog: React.FC<ImportDialogProps> = ({
  isOpen,
  onClose,
  onImport,
  title = "Import Products",
  description = "Upload a CSV or Excel file to import product data",
  acceptedFileTypes = SUPPORTED_FORMATS,
  maxFileSize = MAX_FILE_SIZE
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateProductData = useCallback((data: any[], headers: string[]): ImportResult => {
    const errors: ImportValidationError[] = []
    const validRecords: Partial<Product>[] = []

    data.forEach((row, index) => {
      const product: Partial<Product> = {}
      let hasErrors = false

      // Map columns to product fields
      headers.forEach(header => {
        const normalizedHeader = header.toLowerCase().trim()
        const productField = COLUMN_MAPPINGS[normalizedHeader]
        
        if (productField && row[header] !== undefined && row[header] !== '') {
          const value = row[header]
          
          try {
            switch (productField) {
              case 'name':
                if (typeof value === 'string' && value.trim().length > 0) {
                  product.name = value.trim()
                } else {
                  errors.push({
                    row: index + 2, // +2 for header row and 0-based index
                    column: header,
                    value,
                    message: 'Product name is required and must be a non-empty string'
                  })
                  hasErrors = true
                }
                break
                
              case 'type':
                const normalizedType = value.toString().toUpperCase()
                if (VALID_PRODUCT_TYPES.includes(normalizedType as ProductType)) {
                  product.type = normalizedType as ProductType
                } else {
                  errors.push({
                    row: index + 2,
                    column: header,
                    value,
                    message: `Invalid product type. Must be one of: ${VALID_PRODUCT_TYPES.join(', ')}`
                  })
                  hasErrors = true
                }
                break
                
              case 'basePrice':
                const price = parseFloat(value.toString().replace(/[^0-9.-]/g, ''))
                if (!isNaN(price) && price >= 0) {
                  product.basePrice = price
                } else {
                  errors.push({
                    row: index + 2,
                    column: header,
                    value,
                    message: 'Price must be a valid positive number'
                  })
                  hasErrors = true
                }
                break
                
              case 'isActive':
                const statusValue = value.toString().toLowerCase()
                if (['true', '1', 'active', 'yes', 'y'].includes(statusValue)) {
                  product.isActive = true
                } else if (['false', '0', 'inactive', 'no', 'n'].includes(statusValue)) {
                  product.isActive = false
                } else {
                  errors.push({
                    row: index + 2,
                    column: header,
                    value,
                    message: 'Status must be true/false, active/inactive, yes/no, or 1/0'
                  })
                  hasErrors = true
                }
                break
                
              default:
                // For other fields, just assign the string value
                (product as any)[productField] = value.toString().trim()
            }
          } catch (error) {
            errors.push({
              row: index + 2,
              column: header,
              value,
              message: `Error processing value: ${error instanceof Error ? error.message : 'Unknown error'}`
            })
            hasErrors = true
          }
        }
      })

      // Check required fields
      if (!product.name) {
        errors.push({
          row: index + 2,
          column: 'name',
          value: '',
          message: 'Product name is required'
        })
        hasErrors = true
      }

      if (!hasErrors) {
        validRecords.push(product)
      }
    })

    return {
      success: errors.length === 0,
      validRecords,
      errors,
      totalRows: data.length,
      validRows: validRecords.length
    }
  }, [])

  const processFile = useCallback(async (selectedFile: File) => {
    setIsProcessing(true)
    setProgress(0)
    
    try {
      setProgress(20)
      
      const fileExtension = selectedFile.name.toLowerCase().split('.').pop()
      let data: any[] = []
      let headers: string[] = []
      
      if (fileExtension === 'csv') {
        // Process CSV
        const text = await selectedFile.text()
        const lines = text.split('\n').filter(line => line.trim())
        
        if (lines.length === 0) {
          throw new Error('File is empty')
        }
        
        headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
          const row: any = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          data.push(row)
        }
      } else {
        // Process Excel
        const buffer = await selectedFile.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'buffer' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
        
        if (jsonData.length === 0) {
          throw new Error('File is empty')
        }
        
        headers = jsonData[0].map(h => h?.toString() || '')
        
        for (let i = 1; i < jsonData.length; i++) {
          const row: any = {}
          headers.forEach((header, index) => {
            row[header] = jsonData[i][index]?.toString() || ''
          })
          data.push(row)
        }
      }
      
      setProgress(60)
      
      // Validate data
      const result = validateProductData(data, headers)
      setImportResult(result)
      
      setProgress(100)
    } catch (error) {
      console.error('File processing error:', error)
      setImportResult({
        success: false,
        validRecords: [],
        errors: [{
          row: 0,
          column: 'file',
          value: selectedFile.name,
          message: error instanceof Error ? error.message : 'Failed to process file'
        }],
        totalRows: 0,
        validRows: 0
      })
    } finally {
      setIsProcessing(false)
    }
  }, [validateProductData])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [])

  const handleFileSelect = useCallback((selectedFile: File) => {
    // Validate file type
    const fileExtension = '.' + selectedFile.name.toLowerCase().split('.').pop()
    if (!SUPPORTED_FORMATS.includes(fileExtension)) {
      setImportResult({
        success: false,
        validRecords: [],
        errors: [{
          row: 0,
          column: 'file',
          value: selectedFile.name,
          message: `Unsupported file format. Please use: ${SUPPORTED_FORMATS.join(', ')}`
        }],
        totalRows: 0,
        validRows: 0
      })
      return
    }
    
    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setImportResult({
        success: false,
        validRecords: [],
        errors: [{
          row: 0,
          column: 'file',
          value: selectedFile.name,
          message: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`
        }],
        totalRows: 0,
        validRows: 0
      })
      return
    }
    
    setFile(selectedFile)
    setImportResult(null)
    processFile(selectedFile)
  }, [processFile])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleImport = useCallback(async () => {
    if (!importResult || importResult.validRecords.length === 0) return
    
    setIsImporting(true)
    try {
      await onImport(importResult.validRecords)
      onClose()
    } catch (error) {
      console.error('Import failed:', error)
    } finally {
      setIsImporting(false)
    }
  }, [importResult, onImport, onClose])

  const handleClose = useCallback(() => {
    setFile(null)
    setImportResult(null)
    setIsProcessing(false)
    setIsImporting(false)
    setProgress(0)
    onClose()
  }, [onClose])

  const downloadTemplate = useCallback(() => {
    const templateData = [
      {
        'Product Name': 'Example Product',
        'Type': 'DIGITAL',
        'Category': 'Software',
        'SKU': 'EX-001',
        'Base Price': '29.99',
        'Currency': 'USD',
        'Status': 'Active',
        'Description': 'Example product description'
      }
    ]
    
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(templateData)
    XLSX.utils.book_append_sheet(wb, ws, 'Products Template')
    XLSX.writeFile(wb, 'products_import_template.xlsx')
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Products Data
          </DialogTitle>
          <DialogDescription>
            Import products from CSV or Excel files. Download the template for the correct format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <h4 className="font-medium text-blue-900">Need a template?</h4>
              <p className="text-sm text-blue-700">Download our Excel template with the correct column format.</p>
            </div>
            <Tooltip content={getTooltip('IMPORT_DIALOG.FILE_UPLOAD.TEMPLATE_DOWNLOAD')}>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Template
              </Button>
            </Tooltip>
          </div>

          {/* File Upload Area */}
          <Tooltip content={getTooltip('IMPORT_DIALOG.FILE_UPLOAD.DROP_ZONE')}>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
            {file ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  {file.name.endsWith('.csv') ? (
                    <FileText className="h-8 w-8 text-green-600" />
                  ) : (
                    <FileSpreadsheet className="h-8 w-8 text-green-600" />
                  )}
                </div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Tooltip content={getTooltip('IMPORT_DIALOG.FILE_UPLOAD.REMOVE_FILE')}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFile(null)
                      setImportResult(null)
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </Tooltip>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium">Drop your file here</p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()}>
                  Choose File
                </Button>
                <Tooltip content={getTooltip('IMPORT_DIALOG.FILE_UPLOAD.FILE_FORMATS')}>
                  <p className="text-xs text-gray-500">
                    Supports: {SUPPORTED_FORMATS.join(', ')} • Max size: {MAX_FILE_SIZE / 1024 / 1024}MB
                  </p>
                </Tooltip>
              </div>
            )}
          </div>
          </Tooltip>

          <input
            ref={fileInputRef}
            type="file"
            accept={SUPPORTED_FORMATS.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Processing Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing file...</span>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <Tooltip content={getTooltip('IMPORT_DIALOG.PROCESSING.PROGRESS_BAR')}>
                <Progress value={progress} className="w-full" />
              </Tooltip>
            </div>
          )}

          {/* Import Results */}
          {importResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {importResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <h4 className="font-medium">
                  {importResult.success ? 'Validation Successful' : 'Validation Issues Found'}
                </h4>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Tooltip content={getTooltip('IMPORT_DIALOG.VALIDATION.TOTAL_ROWS')}>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{importResult.totalRows}</div>
                    <div className="text-sm text-gray-600">Total Rows</div>
                  </div>
                </Tooltip>
                <Tooltip content={getTooltip('IMPORT_DIALOG.VALIDATION.VALID_ROWS')}>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{importResult.validRows}</div>
                    <div className="text-sm text-green-600">Valid Rows</div>
                  </div>
                </Tooltip>
                <Tooltip content={getTooltip('IMPORT_DIALOG.VALIDATION.ERROR_COUNT')}>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{importResult.errors.length}</div>
                    <div className="text-sm text-red-600">Errors</div>
                  </div>
                </Tooltip>
              </div>

              {importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-red-600">Validation Errors:</h5>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {importResult.errors.slice(0, 10).map((error, index) => (
                      <Alert key={index} variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          <strong>Row {error.row}, Column "{error.column}":</strong> {error.message}
                        </AlertDescription>
                      </Alert>
                    ))}
                    {importResult.errors.length > 10 && (
                      <p className="text-sm text-gray-500 text-center">
                        ... and {importResult.errors.length - 10} more errors
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isProcessing || isImporting}>
            Cancel
          </Button>
          <Tooltip content={getTooltip('IMPORT_DIALOG.PROCESSING.IMPORT_BUTTON')}>
            <Button 
              onClick={handleImport}
              disabled={!importResult || importResult.validRows === 0 || isProcessing || isImporting}
            >
              {isImporting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Importing...
                </div>
              ) : (
                `Import ${importResult?.validRows || 0} Products`
              )}
            </Button>
          </Tooltip>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ImportDialog