import { Product, ProductType } from '@/shared/types/product'

/**
 * Print utilities for bulk operations
 */

export const generatePrintableProductList = (products: Product[]): string => {
  const formatProductType = (type: ProductType): string => {
    return type.charAt(0) + type.slice(1).toLowerCase()
  }

  const formatPrice = (price?: number, currency?: string): string => {
    if (!price) return 'N/A'
    return `${currency || 'USD'} ${price.toFixed(2)}`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString()
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Product List - ${new Date().toLocaleDateString()}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #0ea5e9;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #075985;
          margin: 0;
        }
        .summary {
          background-color: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .products-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .products-table th,
        .products-table td {
          border: 1px solid #e2e8f0;
          padding: 12px;
          text-align: left;
        }
        .products-table th {
          background-color: #0ea5e9;
          color: white;
          font-weight: bold;
        }
        .products-table tr:nth-child(even) {
          background-color: #f8fafc;
        }
        .status-active {
          color: #059669;
          font-weight: bold;
        }
        .status-inactive {
          color: #dc2626;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #64748b;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Product List</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
        <p>Total Products: ${products.length}</p>
      </div>

      <div class="summary">
        <h3>Summary</h3>
        <p><strong>Active Products:</strong> ${products.filter(p => p.isActive).length}</p>
        <p><strong>Inactive Products:</strong> ${products.filter(p => !p.isActive).length}</p>
        <p><strong>Product Types:</strong> ${Array.from(new Set(products.map(p => formatProductType(p.type)))).join(', ')}</p>
      </div>

      <table class="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Category</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(product => `
            <tr>
              <td><strong>${product.name}</strong></td>
              <td>${formatProductType(product.type)}</td>
              <td>${product.category || 'N/A'}</td>
              <td>${product.sku || 'N/A'}</td>
              <td>${formatPrice(product.basePrice, product.currency)}</td>
              <td class="${product.isActive ? 'status-active' : 'status-inactive'}">
                ${product.isActive ? 'Active' : 'Inactive'}
              </td>
              <td>${formatDate(product.createdAt)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>This report was generated automatically from the product management system.</p>
      </div>
    </body>
    </html>
  `

  return htmlContent
}

export const printProducts = (products: Product[]): void => {
  const printContent = generatePrintableProductList(products)
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank')
  
  if (printWindow) {
    printWindow.document.write(printContent)
    printWindow.document.close()
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.print()
      // Close the window after printing (optional)
      printWindow.onafterprint = () => {
        printWindow.close()
      }
    }
  } else {
    // Fallback: create a temporary element and print
    const printFrame = document.createElement('iframe')
    printFrame.style.display = 'none'
    document.body.appendChild(printFrame)
    
    if (printFrame.contentDocument) {
      printFrame.contentDocument.write(printContent)
      printFrame.contentDocument.close()
      printFrame.contentWindow?.print()
    }
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(printFrame)
    }, 1000)
  }
}

export const generateProductLabels = (products: Product[]): string => {
  // Generate printable labels for products
  const labelContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Product Labels</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; }
        .label {
          width: 4in;
          height: 2in;
          border: 1px solid #ccc;
          margin: 0.25in;
          padding: 0.25in;
          display: inline-block;
          page-break-inside: avoid;
        }
        .label h4 { margin: 0 0 0.1in 0; font-size: 14px; }
        .label p { margin: 0.05in 0; font-size: 10px; }
      </style>
    </head>
    <body>
      ${products.map(product => `
        <div class="label">
          <h4>${product.name}</h4>
          <p><strong>SKU:</strong> ${product.sku || 'N/A'}</p>
          <p><strong>Type:</strong> ${product.type}</p>
          <p><strong>Price:</strong> ${product.basePrice ? `${product.currency || 'USD'} ${product.basePrice}` : 'N/A'}</p>
        </div>
      `).join('')}
    </body>
    </html>
  `
  
  return labelContent
}