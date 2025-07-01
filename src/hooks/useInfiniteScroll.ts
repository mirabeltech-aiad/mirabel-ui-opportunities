import { useState, useEffect, useCallback } from 'react';

export const useInfiniteScroll = (items: any[], itemsPerPage: number = 20) => {
  const [displayedItems, setDisplayedItems] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate if there are more items to load
  const hasMore = displayedItems.length < items.length;

  // Reset displayed items when source items change
  const resetDisplayedItems = useCallback(() => {
    console.log('Resetting displayed items, total items:', items.length);
    const initialItems = items.slice(0, itemsPerPage);
    setDisplayedItems(initialItems);
    setCurrentPage(1);
    console.log('Reset to show first', initialItems.length, 'items');
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

    console.log('Starting to load more items...');

    // Simulate async loading
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = currentPage * itemsPerPage;
      const endIndex = nextPage * itemsPerPage;
      
      console.log(`Loading page ${nextPage} items from index ${startIndex} to ${endIndex}`);
      
      const newItems = items.slice(startIndex, endIndex);
      console.log('New items to add:', newItems.length);
      
      setDisplayedItems(prevItems => {
        const updatedItems = [...prevItems, ...newItems];
        console.log('Updated displayed items count:', updatedItems.length);
        return updatedItems;
      });
      
      setCurrentPage(nextPage);
      setIsLoading(false);
      
      const stillHasMore = endIndex < items.length;
      console.log('Has more after loading:', stillHasMore);
    }, 100);
  }, [items, currentPage, itemsPerPage, isLoading, hasMore]);

  return {
    displayedItems,
    hasMore,
    isLoading,
    loadMore,
    resetDisplayedItems
  };
};
