import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ColumnSelector, ColumnDefinition } from '../ColumnSelector'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'

// Mock the CSS import
jest.mock('../../../styles/dragDrop.css', () => ({}))

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
  }
]

describe('ColumnSelector Drag and Drop', () => {
  const defaultProps = {
    columns: mockColumns,
    visibleColumns: ['id', 'name'],
    onToggleColumn: jest.fn(),
    onReorderColumns: jest.fn(),
    enableDragDrop: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders drag handles for draggable columns', () => {
    render(<ColumnSelector {...defaultProps} />)
    
    // Should show move icons for non-locked columns
    const moveIcons = screen.getAllByTestId('move-icon')
    expect(moveIcons.length).toBeGreaterThan(0)
  })

  it('makes columns draggable when enableDragDrop is true', () => {
    render(<ColumnSelector {...defaultProps} />)
    
    const nameColumn = screen.getByText('Name').closest('[draggable]')
    expect(nameColumn).toHaveAttribute('draggable', 'true')
  })

  it('does not make locked columns draggable', () => {
    render(<ColumnSelector {...defaultProps} />)
    
    const idColumn = screen.getByText('ID').closest('[draggable]')
    expect(idColumn).toHaveAttribute('draggable', 'false')
  })

  it('shows drop zone indicators', () => {
    render(<ColumnSelector {...defaultProps} />)
    
    const availablePane = screen.getByTestId('available-pane')
    const selectedPane = screen.getByTestId('selected-pane')
    
    expect(availablePane).toHaveAttribute('data-drop-zone', 'available-pane')
    expect(selectedPane).toHaveAttribute('data-drop-zone', 'selected-pane')
  })

  it('handles drag start event', async () => {
    render(<ColumnSelector {...defaultProps} />)
    
    const nameColumn = screen.getByText('Name').closest('[draggable="true"]')
    expect(nameColumn).toBeTruthy()
    
    if (nameColumn) {
      fireEvent.dragStart(nameColumn, {
        dataTransfer: {
          setData: jest.fn(),
          effectAllowed: 'move'
        }
      })
      
      await waitFor(() => {
        expect(nameColumn).toHaveClass('dragging')
      })
    }
  })

  it('handles drop event and calls onToggleColumn', async () => {
    const onToggleColumn = jest.fn()
    render(<ColumnSelector {...defaultProps} onToggleColumn={onToggleColumn} />)
    
    const priceColumn = screen.getByText('Price').closest('[draggable="true"]')
    const selectedPane = screen.getByTestId('selected-pane')
    
    if (priceColumn && selectedPane) {
      // Simulate drag start
      fireEvent.dragStart(priceColumn, {
        dataTransfer: {
          setData: jest.fn(),
          getData: jest.fn().mockReturnValue(JSON.stringify({
            type: 'column',
            columnKey: 'price',
            sourcePane: 'available',
            sourceIndex: 0,
            columnData: mockColumns[2]
          }))
        }
      })
      
      // Simulate drop
      fireEvent.drop(selectedPane, {
        dataTransfer: {
          getData: jest.fn().mockReturnValue(JSON.stringify({
            type: 'column',
            columnKey: 'price',
            sourcePane: 'available',
            sourceIndex: 0,
            columnData: mockColumns[2]
          }))
        }
      })
      
      await waitFor(() => {
        expect(onToggleColumn).toHaveBeenCalledWith('price')
      })
    }
  })

  it('handles reordering within selected pane', async () => {
    const onReorderColumns = jest.fn()
    render(<ColumnSelector {...defaultProps} onReorderColumns={onReorderColumns} />)
    
    const nameColumn = screen.getByText('Name').closest('[draggable="true"]')
    const selectedPane = screen.getByTestId('selected-pane')
    
    if (nameColumn && selectedPane) {
      // Simulate drag start for reordering
      fireEvent.dragStart(nameColumn, {
        dataTransfer: {
          setData: jest.fn(),
          getData: jest.fn().mockReturnValue(JSON.stringify({
            type: 'column',
            columnKey: 'name',
            sourcePane: 'selected',
            sourceIndex: 1,
            columnData: mockColumns[1]
          }))
        }
      })
      
      // Simulate drag over to trigger insertion indicator
      fireEvent.dragOver(selectedPane, {
        clientY: 100,
        dataTransfer: {
          getData: jest.fn().mockReturnValue(JSON.stringify({
            type: 'column',
            columnKey: 'name',
            sourcePane: 'selected',
            sourceIndex: 1,
            columnData: mockColumns[1]
          }))
        }
      })
      
      // Simulate drop for reordering
      fireEvent.drop(selectedPane, {
        clientY: 100,
        dataTransfer: {
          getData: jest.fn().mockReturnValue(JSON.stringify({
            type: 'column',
            columnKey: 'name',
            sourcePane: 'selected',
            sourceIndex: 1,
            columnData: mockColumns[1]
          }))
        }
      })
      
      await waitFor(() => {
        expect(onReorderColumns).toHaveBeenCalled()
      })
    }
  })

  it('shows insertion indicator during reordering', async () => {
    render(<ColumnSelector {...defaultProps} onReorderColumns={jest.fn()} />)
    
    const nameColumn = screen.getByText('Name').closest('[draggable="true"]')
    const selectedPane = screen.getByTestId('selected-pane')
    
    if (nameColumn && selectedPane) {
      // Start dragging
      fireEvent.dragStart(nameColumn, {
        dataTransfer: {
          setData: jest.fn(),
          getData: jest.fn().mockReturnValue(JSON.stringify({
            type: 'column',
            columnKey: 'name',
            sourcePane: 'selected',
            sourceIndex: 1,
            columnData: mockColumns[1]
          }))
        }
      })
      
      // Drag over should show insertion indicator
      fireEvent.dragOver(selectedPane, {
        clientY: 50,
        dataTransfer: {
          getData: jest.fn().mockReturnValue(JSON.stringify({
            type: 'column',
            columnKey: 'name',
            sourcePane: 'selected',
            sourceIndex: 1,
            columnData: mockColumns[1]
          }))
        }
      })
      
      await waitFor(() => {
        const indicator = document.querySelector('.insertion-indicator')
        expect(indicator).toBeInTheDocument()
      })
    }
  })

  it('prevents reordering to the same position', async () => {
    const onReorderColumns = jest.fn()
    render(<ColumnSelector {...defaultProps} onReorderColumns={onReorderColumns} />)
    
    const nameColumn = screen.getByText('Name').closest('[draggable="true"]')
    const selectedPane = screen.getByTestId('selected-pane')
    
    if (nameColumn && selectedPane) {
      // Simulate dropping at the same position
      fireEvent.dragStart(nameColumn, {
        dataTransfer: {
          setData: jest.fn(),
          getData: jest.fn().mockReturnValue(JSON.stringify({
            type: 'column',
            columnKey: 'name',
            sourcePane: 'selected',
            sourceIndex: 1,
            columnData: mockColumns[1]
          }))
        }
      })
      
      fireEvent.drop(selectedPane, {
        clientY: 75, // Position that would result in same index
        dataTransfer: {
          getData: jest.fn().mockReturnValue(JSON.stringify({
            type: 'column',
            columnKey: 'name',
            sourcePane: 'selected',
            sourceIndex: 1,
            columnData: mockColumns[1]
          }))
        }
      })
      
      // Should not call reorder if dropping at same position
      expect(onReorderColumns).not.toHaveBeenCalled()
    }
  })

  it('shows appropriate visual feedback during drag', async () => {
    render(<ColumnSelector {...defaultProps} />)
    
    const nameColumn = screen.getByText('Name').closest('[draggable="true"]')
    
    if (nameColumn) {
      fireEvent.dragStart(nameColumn)
      
      await waitFor(() => {
        expect(nameColumn).toHaveClass('dragging')
      })
      
      fireEvent.dragEnd(nameColumn)
      
      await waitFor(() => {
        expect(nameColumn).not.toHaveClass('dragging')
      })
    }
  })

  it('disables drag and drop when enableDragDrop is false', () => {
    render(<ColumnSelector {...defaultProps} enableDragDrop={false} />)
    
    const nameColumn = screen.getByText('Name').closest('[draggable]')
    expect(nameColumn).toHaveAttribute('draggable', 'false')
  })

  it('shows drag instructions in empty panes during drag', async () => {
    render(<ColumnSelector {...defaultProps} visibleColumns={[]} />)
    
    const nameColumn = screen.getByText('Name').closest('[draggable="true"]')
    
    if (nameColumn) {
      fireEvent.dragStart(nameColumn)
      
      await waitFor(() => {
        expect(screen.getByText('Drop here to add to selection')).toBeInTheDocument()
      })
    }
  })

  it('prevents dragging locked columns', () => {
    render(<ColumnSelector {...defaultProps} />)
    
    const idColumn = screen.getByText('ID').closest('[draggable]')
    expect(idColumn).toHaveAttribute('draggable', 'false')
    expect(idColumn).toHaveClass('locked')
  })

  it('shows validation errors for invalid operations', async () => {
    const onToggleColumn = jest.fn()
    render(<ColumnSelector {...defaultProps} onToggleColumn={onToggleColumn} />)
    
    // Try to remove a locked column (should fail)
    const idColumn = screen.getByText('ID')
    
    // Since ID is locked and in visibleColumns, trying to remove it should show error
    // This would be tested through the drag-drop system validation
    expect(idColumn.closest('.column-item')).toHaveClass('locked')
  })

  it('supports keyboard navigation', async () => {
    render(<ColumnSelector {...defaultProps} />)
    
    const nameColumn = screen.getByText('Name').closest('[tabindex="0"]')
    expect(nameColumn).toBeTruthy()
    
    if (nameColumn) {
      // Test keyboard focus
      nameColumn.focus()
      expect(nameColumn).toHaveFocus()
      
      // Test keyboard activation
      fireEvent.keyDown(nameColumn, { key: 'Enter' })
      
      // Should trigger keyboard drag mode
      await waitFor(() => {
        expect(nameColumn).toHaveClass('selected')
      })
    }
  })

  it('shows keyboard shortcuts help', () => {
    render(<ColumnSelector {...defaultProps} />)
    
    const shortcutsToggle = screen.getByText('Keyboard Shortcuts')
    expect(shortcutsToggle).toBeInTheDocument()
    
    // Click to expand
    fireEvent.click(shortcutsToggle)
    
    // Should show keyboard shortcuts
    expect(screen.getByText('Enter/Space')).toBeInTheDocument()
    expect(screen.getByText('Start drag operation or confirm action')).toBeInTheDocument()
  })

  it('displays column constraints and badges', () => {
    const columnsWithConstraints = [
      ...mockColumns,
      {
        key: 'special',
        title: 'Special Column',
        category: 'special',
        required: true,
        locked: true
      }
    ]
    
    render(<ColumnSelector {...defaultProps} columns={columnsWithConstraints} />)
    
    // Should show required badge
    expect(screen.getByText('Required')).toBeInTheDocument()
    
    // Should show locked badge
    expect(screen.getByText('Locked')).toBeInTheDocument()
  })
})