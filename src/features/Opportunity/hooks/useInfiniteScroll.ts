import { useState, useEffect, useCallback } from 'react';

export const useInfiniteScroll = (items: any[], itemsPerPage: number = 20) => {
  const [displayedItems, setDisplayedItems] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate if there are more items to load
  const hasMore = displayedItems.length < items.length;

  // Reset displayed items when source items change
  const resetDisplayedItems = useCallback(() => {
    // Do not seed any mock/placeholder; only render real items passed in
    const initialItems = Array.isArray(items) ? items.slice(0, itemsPerPage) : [];
    setDisplayedItems(initialItems);
    setCurrentPage(1);
  }, [items, itemsPerPage]);

  // Initialize displayed items when items change
  useEffect(() => {
    resetDisplayedItems();
  }, [resetDisplayedItems]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) {
      return;
    }
    if (displayedItems.length >= items.length) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    // Load synchronously from provided items (no artificial delay, no mock)
      const nextPage = currentPage + 1;
      const startIndex = currentPage * itemsPerPage;
      const endIndex = nextPage * itemsPerPage;
      const newItems = items.slice(startIndex, endIndex);
      setDisplayedItems(prevItems => {
        return [...prevItems, ...newItems];
      });
      setCurrentPage(nextPage);
      setIsLoading(false);
    
  }, [items, currentPage, itemsPerPage, isLoading, hasMore]);

  return {
    displayedItems,
    hasMore,
    isLoading,
    loadMore,
    resetDisplayedItems
  };
};
