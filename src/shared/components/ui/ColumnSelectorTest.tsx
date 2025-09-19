import React, { useState } from 'react'
import { ColumnSelector, ColumnDefinition } from './ColumnSelector'

// Sample column data for testing
const sampleColumns: ColumnDefinition[] = [
  {
    key: 'id',
    title: 'Product ID',
    category: 'identification',
    description: 'Unique identifier for the product',
    dataType: 'string',
    locked: true,
    required: true,
    usage: { frequency: 100, lastUsed: new Date(), importance: 'high' }
  },
  {
    key: 'name',
    title: 'Product Name',
    category: 'basic',
    description: 'Display name of the product',
    dataType: 'string',
    required: true,
    usage: { frequency: 95, lastUsed: new Date(), importance: 'high' }
  },
  {
    key: 'price',
    title: 'Price',
    category: 'financial',
    description: 'Current selling price',
    dataType: 'number',
    usage: { frequency: 90, lastUsed: new Date(), importance: 'high' }
  },
  {
    key: 'cost',
    title: 'Cost',
    category: 'financial',
    description: 'Manufacturing or acquisition cost',
    dataType: 'number',
    usage: { frequency: 60, lastUsed: new Date(), importance: 'medium' }
  },
  {
    key: 'category',
    title: 'Category',
    category: 'classification',
    description: 'Product category classification',
    dataType: 'string',
    usage: { frequency: 80, lastUsed: new Date(), importance: 'medium' }
  },
  {
    key: 'brand',
    title: 'Brand',
    category: 'classification',
    description: 'Product brand or manufacturer',
    dataType: 'string',
    usage: { frequency: 70, lastUsed: new Date(), importance: 'medium' }
  },
  {
    key: 'sku',
    title: 'SKU',
    category: 'identification',
    description: 'Stock keeping unit identifier',
    dataType: 'string',
    usage: { frequency: 85, lastUsed: new Date(), importance: 'high' }
  },
  {
    key: 'description',
    title: 'Description',
    category: 'basic',
    description: 'Detailed product description',
    dataType: 'string',
    usage: { frequency: 50, lastUsed: new Date(), importance: 'low' }
  },
  {
    key: 'weight',
    title: 'Weight',
    category: 'physical',
    description: 'Product weight in grams',
    dataType: 'number',
    usage: { frequency: 40, lastUsed: new Date(), importance: 'low' }
  },
  {
    key: 'dimensions',
    title: 'Dimensions',
    category: 'physical',
    description: 'Product dimensions (L x W x H)',
    dataType: 'string',
    usage: { frequency: 35, lastUsed: new Date(), importance: 'low' }
  },
  {
    key: 'stock',
    title: 'Stock Level',
    category: 'inventory',
    description: 'Current inventory count',
    dataType: 'number',
    usage: { frequency: 75, lastUsed: new Date(), importance: 'medium' }
  },
  {
    key: 'supplier',
    title: 'Supplier',
    category: 'sourcing',
    description: 'Primary supplier information',
    dataType: 'string',
    usage: { frequency: 45, lastUsed: new Date(), importance: 'low' }
  },
  {
    key: 'created_at',
    title: 'Created Date',
    category: 'metadata',
    description: 'When the product was added',
    dataType: 'date',
    usage: { frequency: 30, lastUsed: new Date(), importance: 'low' }
  },
  {
    key: 'updated_at',
    title: 'Last Updated',
    category: 'metadata',
    description: 'When the product was last modified',
    dataType: 'date',
    usage: { frequency: 25, lastUsed: new Date(), importance: 'low' }
  },
  {
    key: 'status',
    title: 'Status',
    category: 'operational',
    description: 'Current product status (active, discontinued, etc.)',
    dataType: 'string',
    usage: { frequency: 65, lastUsed: new Date(), importance: 'medium' }
  }
]

export const ColumnSelectorTest: React.FC = () => {
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'id', 'name', 'price', 'category'
  ])

  const handleToggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnKey)) {
        return prev.filter(key => key !== columnKey)
      } else {
        return [...prev, columnKey]
      }
    })
  }

  const handleReorderColumns = (newOrder: string[]) => {
    setVisibleColumns(newOrder)
  }

  const handleBulkToggle = (columnKeys: string[], visible: boolean) => {
    if (visible) {
      setVisibleColumns(prev => [...prev, ...columnKeys.filter(key => !prev.includes(key))])
    } else {
      setVisibleColumns(prev => prev.filter(key => !columnKeys.includes(key)))
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Column Selector Drag & Drop Test
        </h1>
        <p className="text-gray-600">
          Test the enhanced column selector with drag-and-drop functionality.
          Try dragging columns between panes and reordering within the selected pane.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <ColumnSelector
          columns={sampleColumns}
          visibleColumns={visibleColumns}
          onToggleColumn={handleToggleColumn}
          onReorderColumns={handleReorderColumns}
          onBulkToggle={handleBulkToggle}
          enableDragDrop={true}
          enableBulkOperations={true}
          enableCategorization={true}
          maxHeight={600}
          searchConfig={{
            fuzzySearch: true,
            highlightMatches: true,
            enableHistory: true
          }}
        />
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Current Selection:</h3>
        <div className="flex flex-wrap gap-2">
          {visibleColumns.map((columnKey, index) => {
            const column = sampleColumns.find(col => col.key === columnKey)
            return (
              <div
                key={columnKey}
                className="flex items-center gap-2 bg-white px-3 py-1 rounded border text-sm"
              >
                <span className="text-gray-600">{index + 1}.</span>
                <span className="font-medium">{column?.title || columnKey}</span>
                {column?.locked && (
                  <span className="text-xs text-gray-500">(locked)</span>
                )}
              </div>
            )
          })}
        </div>
        {visibleColumns.length === 0 && (
          <p className="text-gray-500 text-sm">No columns selected</p>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <h4 className="font-medium mb-2">Test Instructions:</h4>
        <ul className="space-y-1 list-disc list-inside">
          <li><strong>Add columns:</strong> Drag from Available to Selected pane</li>
          <li><strong>Remove columns:</strong> Drag from Selected to Available pane</li>
          <li><strong>Reorder columns:</strong> Drag within Selected pane to change order</li>
          <li><strong>Precise positioning:</strong> Watch for blue insertion indicators while dragging</li>
          <li><strong>Locked columns:</strong> Try dragging the ID column (should be locked)</li>
          <li><strong>Search & filter:</strong> Use search and category filters while dragging</li>
          <li><strong>Bulk operations:</strong> Use Ctrl+click for multi-selection</li>
          <li><strong>Visual feedback:</strong> Notice drag handles, drop zones, and animations</li>
        </ul>
        
        <div className="mt-4 space-y-3">
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <h5 className="font-medium text-blue-900 mb-1">Drag & Drop Features:</h5>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Blue insertion line shows where the column will be placed</li>
              <li>• Drag handles (⋮⋮) appear on hover for draggable columns</li>
              <li>• Smooth animations provide visual feedback during reordering</li>
              <li>• Drop zones highlight in blue when valid, red when invalid</li>
            </ul>
          </div>
          
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <h5 className="font-medium text-green-900 mb-1">Validation & Constraints:</h5>
            <ul className="text-xs text-green-800 space-y-1">
              <li>• Locked columns (like ID) cannot be removed or moved far</li>
              <li>• Required columns cannot be removed from selection</li>
              <li>• Error messages appear for invalid operations</li>
              <li>• Visual badges indicate column constraints</li>
            </ul>
          </div>
          
          <div className="p-3 bg-purple-50 rounded border border-purple-200">
            <h5 className="font-medium text-purple-900 mb-1">Keyboard Accessibility:</h5>
            <ul className="text-xs text-purple-800 space-y-1">
              <li>• Tab to navigate between columns</li>
              <li>• Enter/Space to start drag operation</li>
              <li>• Arrow keys to choose position</li>
              <li>• Escape to cancel operation</li>
              <li>• Full screen reader support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColumnSelectorTest