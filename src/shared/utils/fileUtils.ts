import { logger } from './logger'

import { Product } from '@/shared/types/product'

/**
 * File utilities for bulk operations
 */

export interface ProductFile {
  name: string
  url: string
  type: string
  size?: number
}

// Mock function to simulate getting files associated with products
export const getProductFiles = async (product: Product): Promise<ProductFile[]> => {
  // In a real implementation, this would fetch from your API/database
  const mockFiles: ProductFile[] = []
  
  // Simulate some files based on product type
  if (product.type === 'DIGITAL') {
    mockFiles.push({
      name: `${product.name}-digital-asset.pdf`,
      url: `/api/files/products/${product.id}/digital-asset.pdf`,
      type: 'application/pdf',
      size: 1024 * 1024 * 2 // 2MB
    })
  }
  
  if (product.type === 'PRINT') {
    mockFiles.push({
      name: `${product.name}-print-specs.pdf`,
      url: `/api/files/products/${product.id}/print-specs.pdf`,
      type: 'application/pdf',
      size: 1024 * 512 // 512KB
    })
  }
  
  // Product images would be handled through the files array in the Product interface
  
  return mockFiles
}

export const downloadFile = async (url: string, filename: string): Promise<void> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`)
    }
    
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up the object URL
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Error downloading file:', error)
    throw error
  }
}

export const createZipFile = async (files: ProductFile[], zipName: string): Promise<void> => {
  // Note: This requires a library like JSZip for full implementation
  // For now, we'll simulate by downloading files individually
  
  logger.log(`Creating ZIP file: ${zipName}`)
  logger.log('Files to include:', files)
  
  // Simulate ZIP creation delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real implementation, you would:
  // 1. Use JSZip to create a zip file
  // 2. Add each file to the zip
  // 3. Generate the zip blob
  // 4. Download the zip file
  
  // For now, download files individually
  for (const file of files) {
    try {
      await downloadFile(file.url, file.name)
      // Add small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`Failed to download ${file.name}:`, error)
    }
  }
}

export const downloadProductFiles = async (products: Product[]): Promise<void> => {
  try {
    logger.log(`Preparing to download files for ${products.length} products...`)
    
    // Collect all files from all products
    const allFiles: ProductFile[] = []
    
    for (const product of products) {
      const productFiles = await getProductFiles(product)
      allFiles.push(...productFiles)
    }
    
    if (allFiles.length === 0) {
      alert('No files found for the selected products.')
      return
    }
    
    logger.log(`Found ${allFiles.length} files to download`)
    
    // If only a few files, download individually
    if (allFiles.length <= 5) {
      for (const file of allFiles) {
        await downloadFile(file.url, file.name)
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    } else {
      // For many files, create a ZIP
      const zipName = `product-files-${Date.now()}.zip`
      await createZipFile(allFiles, zipName)
    }
    
    logger.log('File download completed')
  } catch (error) {
    console.error('Error downloading product files:', error)
    alert('Failed to download some files. Please try again.')
  }
}

export const getFileSizeString = (bytes?: number): string => {
  if (!bytes) return 'Unknown size'
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`
}

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type)
}

export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return file.size <= maxSizeInBytes
}