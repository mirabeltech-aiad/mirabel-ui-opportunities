
import { renderHook, act } from '@testing-library/react';
import { useInfiniteScroll } from '../useInfiniteScroll';
import { Opportunity } from '@/types/opportunity';

describe('useInfiniteScroll', () => {
  const mockOpportunities: Opportunity[] = [
    {
      id: 1,
      opportunityId: "OPP-TEST-001",
      status: 'Open',
      name: 'Test Opportunity',
      company: 'Test Company',
      createdDate: '2024-01-01',
      assignedRep: 'Test Rep',
      stage: 'Discovery',
      amount: 50000,
      projCloseDate: '2024-12-31',
      source: 'Test Source',
      leadSource: 'Test Lead Source',
      leadType: 'New Business',
      salesPresentation: 'Test Presentation',
      createdBy: 'Test User',
      actualCloseDate: '',
      stagePercentage: 50
    }
  ];

  it('should initially display the first pageSize items', () => {
    const { result } = renderHook(() => useInfiniteScroll(mockOpportunities, 1));
    expect(result.current.displayedItems.length).toBe(1);
    expect(result.current.hasMore).toBe(true);
  });

  it('should load more items when loadMore is called', () => {
    const { result } = renderHook(() => useInfiniteScroll(mockOpportunities, 1));
    act(() => {
      result.current.loadMore();
    });
    expect(result.current.displayedItems.length).toBe(1);
    expect(result.current.hasMore).toBe(false);
  });

  it('should set hasMore to false when all items are displayed', () => {
    const { result } = renderHook(() => useInfiniteScroll(mockOpportunities, 10));
    expect(result.current.hasMore).toBe(false);
  });

  it('should not load more items when isLoading is true', () => {
    const { result } = renderHook(() => useInfiniteScroll(mockOpportunities, 1));
    
    // Mock the isLoading state to be true
    result.current.isLoading = true;

    const initialItemsLength = result.current.displayedItems.length;
    act(() => {
      result.current.loadMore();
    });
    expect(result.current.displayedItems.length).toBe(initialItemsLength);
  });
});
