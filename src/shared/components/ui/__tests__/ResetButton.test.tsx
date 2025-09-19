import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { 
  ResetButton, 
  FilterResetButton, 
  ColumnResetButton, 
  SelectionResetButton, 
  SortingResetButton,
  CompactFilterResetButton,
  CompactColumnResetButton,
  CompactSelectionResetButton,
  CompactSortingResetButton
} from '../ResetButton'
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
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'

describe('ResetButton', () => {
  const mockOnReset = jest.fn()

  beforeEach(() => {
    mockOnReset.mockClear()
  })

  describe('Basic functionality', () => {
    it('renders with correct label for filters', () => {
      render(
        <ResetButton
          onReset={mockOnReset}
          hasActiveItems={true}
          itemType="filters"
        />
      )
      
      expect(screen.getByText('Reset')).toBeInTheDocument()
      expect(screen.getByText('✓')).toBeInTheDocument()
    })

    it('shows count when showCount is true', () => {
      render(
        <ResetButton
          onReset={mockOnReset}
          hasActiveItems={true}
          itemType="filters"
          showCount={true}
          activeCount={5}
        />
      )
      
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('shows (0) when no active items', () => {
      render(
        <ResetButton
          onReset={mockOnReset}
          hasActiveItems={false}
          itemType="filters"
        />
      )
      
      expect(screen.getByText('(0)')).toBeInTheDocument()
    })

    it('calls onReset when clicked and has active items', () => {
      render(
        <ResetButton
          onReset={mockOnReset}
          hasActiveItems={true}
          itemType="filters"
        />
      )
      
      fireEvent.click(screen.getByRole('button'))
      expect(mockOnReset).toHaveBeenCalledTimes(1)
    })

    it('does not call onReset when clicked and has no active items', () => {
      render(
        <ResetButton
          onReset={mockOnReset}
          hasActiveItems={false}
          itemType="filters"
        />
      )
      
      fireEvent.click(screen.getByRole('button'))
      expect(mockOnReset).not.toHaveBeenCalled()
    })

    it('is disabled when no active items', () => {
      render(
        <ResetButton
          onReset={mockOnReset}
          hasActiveItems={false}
          itemType="filters"
        />
      )
      
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('Item type variations', () => {
    it('renders correct tooltip for different item types', () => {
      const { rerender } = render(
        <ResetButton
          onReset={mockOnReset}
          hasActiveItems={true}
          itemType="filters"
        />
      )
      
      expect(screen.getByRole('button')).toHaveAttribute('title', 'Reset all filters')

      rerender(
        <ResetButton
          onReset={mockOnReset}
          hasActiveItems={true}
          itemType="columns"
        />
      )
      
      expect(screen.getByRole('button')).toHaveAttribute('title', 'Reset all columns')

      rerender(
        <ResetButton
          onReset={mockOnReset}
          hasActiveItems={true}
          itemType="selection"
        />
      )
      
      expect(screen.getByRole('button')).toHaveAttribute('title', 'Reset all selection')
    })
  })

  describe('Convenience components', () => {
    it('FilterResetButton works correctly', () => {
      render(
        <FilterResetButton
          onReset={mockOnReset}
          hasActiveItems={true}
        />
      )
      
      expect(screen.getByRole('button')).toHaveAttribute('title', 'Reset all filters')
    })

    it('ColumnResetButton works correctly', () => {
      render(
        <ColumnResetButton
          onReset={mockOnReset}
          hasActiveItems={true}
        />
      )
      
      expect(screen.getByRole('button')).toHaveAttribute('title', 'Reset all columns')
    })

    it('SelectionResetButton works correctly', () => {
      render(
        <SelectionResetButton
          onReset={mockOnReset}
          hasActiveItems={true}
        />
      )
      
      expect(screen.getByRole('button')).toHaveAttribute('title', 'Reset all selection')
    })

    it('SortingResetButton works correctly', () => {
      render(
        <SortingResetButton
          onReset={mockOnReset}
          hasActiveItems={true}
        />
      )
      
      expect(screen.getByRole('button')).toHaveAttribute('title', 'Reset all sorting')
    })
  })

  describe('Variants', () => {
    it('applies correct styling for primary variant', () => {
      render(
        <ResetButton
          onReset={mockOnReset}
          hasActiveItems={true}
          itemType="filters"
          variant="primary"
        />
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-red-600')
    })

    it('applies correct styling for minimal variant', () => {
      render(
        <ResetButton
          onReset={mockOnReset}
          hasActiveItems={true}
          itemType="filters"
          variant="minimal"
        />
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border-transparent')
    })
  })

  describe('Icon-only mode', () => {
    it('renders icon-only button without text', () => {
      render(
        <ResetButton
          onReset={mockOnReset}
          hasActiveItems={true}
          itemType="filters"
          iconOnly={true}
        />
      )
      
      expect(screen.queryByText('Reset')).not.toBeInTheDocument()
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('applies correct size for xs icon-only button', () => {
      render(
        <ResetButton
          onReset={mockOnReset}
          hasActiveItems={true}
          itemType="filters"
          iconOnly={true}
          size="xs"
        />
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-6', 'w-6')
    })
  })

  describe('Compact convenience components', () => {
    it('CompactFilterResetButton renders as icon-only', () => {
      render(
        <CompactFilterResetButton
          onReset={mockOnReset}
          hasActiveItems={true}
        />
      )
      
      expect(screen.queryByText('Reset')).not.toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveAttribute('title', 'Reset all filters')
    })

    it('CompactColumnResetButton works correctly', () => {
      render(
        <CompactColumnResetButton
          onReset={mockOnReset}
          hasActiveItems={true}
        />
      )
      
      expect(screen.getByRole('button')).toHaveAttribute('title', 'Reset all columns')
    })
  })
})