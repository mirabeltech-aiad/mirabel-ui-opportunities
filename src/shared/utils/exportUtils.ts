import { Product } from '@/shared/types/product'

/**
 * Export utilities for bulk operations
 */

export const exportToCSV = (products: Product[], filename?: string): void => {
  // Define CSV headers
  const headers = [
    'ID',
    'Name', 
    'Type',
    'Category',
    'SKU',
    'Price',
    'Currency',
    'Status',
    'Created Date',
    'Updated Date'
  ]

  // Convert products to CSV rows
  const rows = products.map(product => [
    product.id,
    `"${product.name}"`, // Wrap in quotes to handle commas
    product.type,
    product.category || '',
    product.sku || '',
    product.basePrice || '',
    product.currency || '',
    product.isActive ? 'Active' : 'Inactive',
    new Date(product.createdAt).toLocaleDateString(),
    new Date(product.updatedAt).toLocaleDateString()
  ])

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n')

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename || `products-export-${Date.now()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const exportToJSON = (products: Product[], filename?: string): void => {
  const jsonContent = JSON.stringify(products, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename || `products-export-${Date.now()}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const generateProductSummary = (products: Product[]): string => {
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.isActive).length
  const inactiveProducts = totalProducts - activeProducts
  
  const typeBreakdown = products.reduce((acc, product) => {
    acc[product.type] = (acc[product.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const categoryBreakdown = products.reduce((acc, product) => {
    if (product.category) {
      acc[product.category] = (acc[product.category] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  return `
Product Export Summary
Generated: ${new Date().toLocaleString()}

Total Products: ${totalProducts}
Active Products: ${activeProducts}
Inactive Products: ${inactiveProducts}

Product Types:
${Object.entries(typeBreakdown).map(([type, count]) => `  ${type}: ${count}`).join('\n')}

Categories:
${Object.entries(categoryBreakdown).map(([category, count]) => `  ${category}: ${count}`).join('\n')}
  `.trim()
}