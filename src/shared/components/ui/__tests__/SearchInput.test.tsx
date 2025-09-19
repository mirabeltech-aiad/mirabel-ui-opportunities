import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchInput } from '../SearchInput'

describe('SearchInput', () => {
  const mockOnChange = jest.fn()
  const mockOnClear = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('renders with default props', () => {
    render(<SearchInput value="" onChange={mockOnChange} />)
    
    const input = screen.getByRole('textbox', { name: /search/i })
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', 'Search...')
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
  })

  it('displays the provided value', () => {
    render(<SearchInput value="test query" onChange={mockOnChange} />)
    
    const input = screen.getByRole('textbox', { name: /search/i })
    expect(input).toHaveValue('test query')
  })

  it('shows custom placeholder text', () => {
    render(
      <SearchInput 
        value="" 
        onChange={mockOnChange} 
        placeholder="Search products..." 
      />
    )
    
    const input = screen.getByRole('textbox', { name: /search/i })
    expect(input).toHaveAttribute('placeholder', 'Search products...')
  })

  it('calls onChange with debounced value', async () => {
    render(<SearchInput value="" onChange={mockOnChange} debounceMs={300} />)
    
    const input = screen.getByRole('textbox', { name: /search/i })
    
    // Type in the input
    await userEvent.type(input, 'test')
    
    // Should not call onChange immediately
    expect(mockOnChange).not.toHaveBeenCalled()
    
    // Fast-forward time to trigger debounce
    jest.advanceTimersByTime(300)
    
    // Should call onChange with the final value
    expect(mockOnChange).toHaveBeenCalledWith('test')
  })

  it('updates internal value immediately while debouncing onChange', async () => {
    render(<SearchInput value="" onChange={mockOnChange} debounceMs={300} />)
    
    const input = screen.getByRole('textbox', { name: /search/i })
    
    // Type in the input
    await userEvent.type(input, 'test')
    
    // Input should show the typed value immediately
    expect(input).toHaveValue('test')
    
    // But onChange should not be called yet
    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('shows clear button when there is a value', () => {
    render(<SearchInput value="test" onChange={mockOnChange} />)
    
    const clearButton = screen.getByRole('button', { name: /clear search/i })
    expect(clearButton).toBeInTheDocument()
  })

  it('hides clear button when value is empty', () => {
    render(<SearchInput value="" onChange={mockOnChange} />)
    
    const clearButton = screen.queryByRole('button', { name: /clear search/i })
    expect(clearButton).not.toBeInTheDocument()
  })

  it('hides clear button when showClearButton is false', () => {
    render(
      <SearchInput 
        value="test" 
        onChange={mockOnChange} 
        showClearButton={false} 
      />
    )
    
    const clearButton = screen.queryByRole('button', { name: /clear search/i })
    expect(clearButton).not.toBeInTheDocument()
  })

  it('clears the input when clear button is clicked', async () => {
    render(<SearchInput value="test" onChange={mockOnChange} onClear={mockOnClear} />)
    
    const clearButton = screen.getByRole('button', { name: /clear search/i })
    await userEvent.click(clearButton)
    
    // Should clear the input immediately
    const input = screen.getByRole('textbox', { name: /search/i })
    expect(input).toHaveValue('')
    
    // Should call onChange and onClear immediately (no debounce for clear)
    expect(mockOnChange).toHaveBeenCalledWith('')
    expect(mockOnClear).toHaveBeenCalled()
  })

  it('clears the input when Escape key is pressed', async () => {
    render(<SearchInput value="test" onChange={mockOnChange} onClear={mockOnClear} />)
    
    const input = screen.getByRole('textbox', { name: /search/i })
    await userEvent.type(input, '{Escape}')
    
    // Should clear the input immediately
    expect(input).toHaveValue('')
    
    // Should call onChange and onClear immediately
    expect(mockOnChange).toHaveBeenCalledWith('')
    expect(mockOnClear).toHaveBeenCalled()
  })

  it('is disabled when disabled prop is true', () => {
    render(<SearchInput value="" onChange={mockOnChange} disabled />)
    
    const input = screen.getByRole('textbox', { name: /search/i })
    expect(input).toBeDisabled()
    
    // Clear button should not be shown when disabled
    const clearButton = screen.queryByRole('button', { name: /clear search/i })
    expect(clearButton).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <SearchInput 
        value="" 
        onChange={mockOnChange} 
        className="custom-class" 
      />
    )
    
    const container = screen.getByRole('textbox', { name: /search/i }).parentElement?.parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<SearchInput value="" onChange={mockOnChange} ref={ref} />)
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current).toBe(screen.getByRole('textbox', { name: /search/i }))
  })

  it('updates internal value when external value prop changes', () => {
    const { rerender } = render(<SearchInput value="initial" onChange={mockOnChange} />)
    
    const input = screen.getByRole('textbox', { name: /search/i })
    expect(input).toHaveValue('initial')
    
    // Change external value
    rerender(<SearchInput value="updated" onChange={mockOnChange} />)
    
    expect(input).toHaveValue('updated')
  })

  it('cancels previous debounce when new input is received', async () => {
    render(<SearchInput value="" onChange={mockOnChange} debounceMs={300} />)
    
    const input = screen.getByRole('textbox', { name: /search/i })
    
    // Type first value
    await userEvent.type(input, 'test')
    
    // Wait partially through debounce
    jest.advanceTimersByTime(150)
    
    // Type more (should cancel previous debounce)
    await userEvent.type(input, '123')
    
    // Complete the debounce period
    jest.advanceTimersByTime(300)
    
    // Should only call onChange once with the final value
    expect(mockOnChange).toHaveBeenCalledTimes(1)
    expect(mockOnChange).toHaveBeenCalledWith('test123')
  })

  it('includes search icon', () => {
    render(<SearchInput value="" onChange={mockOnChange} />)
    
    // Search icon should be present (we can't easily test the icon itself, but we can check the structure)
    const container = screen.getByRole('textbox', { name: /search/i }).parentElement
    expect(container).toHaveClass('relative')
  })
})