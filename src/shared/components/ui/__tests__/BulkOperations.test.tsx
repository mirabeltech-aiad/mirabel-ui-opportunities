import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ColumnSelector, ColumnDefinition } from '../ColumnSelector'

// Mock the CSS imports
jest.mock('../../../styles/dragDrop.css', () => ({}))
jest.mock('../../../utils/undoRedoManager', () => ({
  useUndoRedo: () => ({
    history: [],
    currentIndex: -1,
    maxHistorySize: 50,
    canUndo: false,
    canRedo: false,
    executeAction: jest.fn(),
    undo: jest.fn(),
    redo: jest.fn(),
    clear: jest.fn(),
    jumpTo: jest.fn(),
    getHistorySummary: () => [],
    getCurrentAction: () => null,
    getNextAction: () => null
  }),
  createBulkOperationAction: jest.fn()
}))

const mockColumns: ColumnDefinition[] = [
  {
    key: 'id',
    title: 'ID',
    category: 'basic',
    locked: true,
    required: true
  },
  {
    key: 'name',
    title: 'Name',
    category: 'basic',
    required: true
  },
  {
    key: 'price',
    title: 'Price',
    category: 'financial'
  },
  {
    key: 'category',
    title: 'Category',
    category: 'classification'
  },
  {
    key: 'description',
    title: 'Description',
    category: 'basic'
  }
]

describe('Bulk Operations', () => {
  const defaultProps = {
    columns: mockColumns,
    visibleColumns: ['id', 'name'],
    onToggleColumn: jest.fn(),
    onReorderColumns: jest.fn(),
    enableBulkOperations: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders bulk operation controls', () => {
    render(<ColumnSelector {...defaultProps} />)
    
    expect(screen.getByText('Select All')).toBeInTheDocument()
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('supports multi-selection with Ctrl+click', async () => {
    render(<ColumnSelector {...defaultProps} />)
    
    const priceColumn = screen.getByText('Price').closest('[role="button"]')
    const categoryColumn = screen.getByText('Category').closest('[role="button"]')
    
    if (priceColumn && categoryColumn) {
      // First selection
      fireEvent.click(priceColumn)
      
      // Multi-selection with Ctrl
      fireEvent.click(categoryColumn, { ctrlKey: true })
      
      await waitFor(() => {
        expect(priceColumn).toHaveClass('selected')
        expect(categoryColumn).toHaveClass('selected')
      })
    }
  })

  it('supports range selection with Shift+click', async () => {
    render(<ColumnSelector {...defaultProps} />)
    
    const priceColumn = screen.getByText('Price').closest('[role="button"]')
    const descriptionColumn = screen.getByText('Description').closest('[role="button"]')
    
    if (priceColumn && descriptionColumn) {
      // First selection
      fireEvent.click(priceColumn)
      
      // Range selection with Shift
      fireEvent.click(descriptionColumn, { shiftKey: true })
      
      await waitFor(() => {
        // Should select all columns in range
        expect(priceColumn).toHaveClass('selected')
        expect(descriptionColumn).toHaveClass('selected')
      })
    }
  })

  it('shows bulk selection status when columns are selected', async () => {
    render(<ColumnSelector {...defaultProps} />)
    
    const priceColumn = screen.getByText('Price').closest('[role="button"]')
    
    if (priceColumn) {
      fireEvent.click(priceColumn)
      
      await waitFor(() => {
        expect(screen.getByText(/selected/)).toBeInTheDocument()
      })
    }
  })

  it('provides bulk add functionality', async () => {
    render(<ColumnSelector {...defaultProps} />)
    
    const priceColumn = screen.getByText('Price').closest('[role="button"]')
    
    if (priceColumn) {
      // Select column
      fireEvent.click(priceColumn)
      
      await waitFor(() => {
        const addButton = screen.getByText(/Add \d+/)
        expect(addButton).toBeInTheDocument()
        
        // Click bulk add
        fireEvent.click(addButton)
      })
    }
  })

  it('provides bulk remove functionality', async () => {
    render(<ColumnSelector {...defaultProps} />)
    
    const nameColumn = screen.getByText('Name').closest('[role="button"]')
    
    if (nameColumn) {
      // Select column in selected pane
      fireEvent.click(nameColumn)
      
      await waitFor(() => {
        const removeButton = screen.getByText(/Remove \d+/)
        expect(removeButton).toBeInTheDocument()
        
        // Click bulk remove
        fireEvent.click(removeButton)
      })
    }
  })

  it('respects locked column constraints', async () => {
    render(<ColumnSelector {...defaultProps} />)
    
    const idColumn = screen.getByText('ID').closest('[role="button"]')
    
    if (idColumn) {
      // Try to select locked column for removal
      fireEvent.click(idColumn)
      
      // Should show constraint indicators
      expect(idColumn).toHaveClass('locked')
      expect(screen.getByText('Locked')).toBeInTheDocument()
    }
  })

  it('shows operation feedback', async () => {
    const onToggleColumn = jest.fn()
    render(<ColumnSelector {...defaultProps} onToggleColumn={onToggleColumn} />)
    
    const selectAllButton = screen.getByText('Select All')
    fireEvent.click(selectAllButton)
    
    await waitFor(() => {
      // Should show some feedback about the operation
      expect(screen.getByText(/Processing/i) || screen.getByText(/completed/i)).toBeInTheDocument()
    })
  })

  it('provides category-based bulk selection', async () => {
    render(<ColumnSelector {...defaultProps} />)
    
    // Switch to a specific category
    const basicCategoryButton = screen.getByText('basic')
    if (basicCategoryButton) {
      fireEvent.click(basicCategoryButton)
      
      await waitFor(() => {
        // Should show category-specific bulk actions
        expect(screen.getByText(/Add all basic/)).toBeInTheDocument()
      })
    }
  })

  it('shows undo functionality after operations', async () => {
    const onToggleColumn = jest.fn()
    render(<ColumnSelector {...defaultProps} onToggleColumn={onToggleColumn} />)
    
    // Perform an operation
    const selectAllButton = screen.getByText('Select All')
    fireEvent.click(selectAllButton)
    
    await waitFor(() => {
      // Should show undo option
      expect(screen.getByText('Undo') || screen.getByTitle(/Undo/)).toBeInTheDocument()
    })
  })

  it('clears selection when requested', async () => {
    render(<ColumnSelector {...defaultProps} />)
    
    const priceColumn = screen.getByText('Price').closest('[role="button"]')
    
    if (priceColumn) {
      // Select column
      fireEvent.click(priceColumn)
      
      await waitFor(() => {
        expect(priceColumn).toHaveClass('selected')
        
        // Clear selection
        const clearButton = screen.getByTitle('Clear selection')
        fireEvent.click(clearButton)
      })
      
      await waitFor(() => {
        expect(priceColumn).not.toHaveClass('selected')
      })
    }
  })

  it('handles bulk operations with progress feedback', async () => {
    render(<ColumnSelector {...defaultProps} />)
    
    const selectAllButton = screen.getByText('Select All')
    fireEvent.click(selectAllButton)
    
    // Should show progress during operation
    await waitFor(() => {
      expect(screen.getByText(/Processing/i) || screen.getByRole('progressbar')).toBeInTheDocument()
    }, { timeout: 100 })
  })
})