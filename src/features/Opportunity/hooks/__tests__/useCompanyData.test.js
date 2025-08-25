
import { renderHook, act } from '@testing-library/react';
import { useCompanyData } from '../useCompanyData';

describe('useCompanyData', () => {
  test('initializes with correct default data', () => {
    const { result } = renderHook(() => useCompanyData('Test Company'));
    
    expect(result.current.companyData.name).toBe('Test Company');
    expect(result.current.companyData.firstName).toBe('Hal');
    expect(result.current.companyData.lastName).toBe('Johnson');
    expect(result.current.editingField).toBe(null);
    expect(result.current.tempValue).toBe('');
  });

  test('starts editing correctly', () => {
    const { result } = renderHook(() => useCompanyData('Test Company'));
    
    act(() => {
      result.current.startEditing('phone', '(555) 123-4567');
    });
    
    expect(result.current.editingField).toBe('phone');
    expect(result.current.tempValue).toBe('(555) 123-4567');
  });

  test('saves edit correctly', () => {
    const { result } = renderHook(() => useCompanyData('Test Company'));
    
    act(() => {
      result.current.startEditing('phone', '(555) 123-4567');
    });
    
    act(() => {
      result.current.setTempValue('(555) 999-8888');
    });
    
    act(() => {
      result.current.saveEdit('phone');
    });
    
    expect(result.current.companyData.phone).toBe('(555) 999-8888');
    expect(result.current.editingField).toBe(null);
  });

  test('cancels edit correctly', () => {
    const { result } = renderHook(() => useCompanyData('Test Company'));
    
    act(() => {
      result.current.startEditing('phone', '(555) 123-4567');
    });
    
    act(() => {
      result.current.cancelEdit();
    });
    
    expect(result.current.editingField).toBe(null);
  });

  test('handles key down events correctly', () => {
    const { result } = renderHook(() => useCompanyData('Test Company'));
    
    act(() => {
      result.current.startEditing('phone', '(555) 123-4567');
    });
    
    act(() => {
      result.current.setTempValue('(555) 999-8888');
    });
    
    // Simulate Enter key press
    const mockEvent = { key: 'Enter' };
    act(() => {
      result.current.handleKeyDown(mockEvent, 'phone');
    });
    
    expect(result.current.companyData.phone).toBe('(555) 999-8888');
    expect(result.current.editingField).toBe(null);
  });

  // Warning: Consider adding more edge case tests for complex scenarios
  // such as handling special characters in names or invalid data formats
});
