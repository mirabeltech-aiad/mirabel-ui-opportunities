
import { useEffect, useRef } from 'react';

export const useScrollObserver = (
  callback: () => void, 
  hasMore: boolean, 
  isLoading: boolean
): React.RefObject<HTMLDivElement> => {
  const observerRef = useRef<HTMLDivElement>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  
  // Store callback in ref to avoid recreating observer
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  // Store latest values in refs to prevent effect recreation
  const hasMoreRef = useRef(hasMore);
  const isLoadingRef = useRef(isLoading);
  hasMoreRef.current = hasMore;
  isLoadingRef.current = isLoading;

  useEffect(() => {
    console.log('Setting up scroll observer - hasMore:', hasMoreRef.current, 'isLoading:', isLoadingRef.current);
    
    // Clean up existing observer before creating new one
    if (intersectionObserverRef.current) {
      console.log('Cleaning up existing observer');
      intersectionObserverRef.current.disconnect();
    }

    // Create new observer with stable callback reference
    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        console.log('Intersection observed:', {
          isIntersecting: target.isIntersecting,
          hasMore: hasMoreRef.current,
          isLoading: isLoadingRef.current,
          intersectionRatio: target.intersectionRatio
        });
        
        if (target.isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
          console.log('Triggering callback to load more items');
          callbackRef.current();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px',
        root: null
      }
    );

    const currentObserver = observerRef.current;
    const currentIntersectionObserver = intersectionObserverRef.current;
    
    if (currentObserver && currentIntersectionObserver) {
      console.log('Starting to observe element');
      currentIntersectionObserver.observe(currentObserver);
    }

    // Cleanup function
    return () => {
      if (currentIntersectionObserver) {
        console.log('Cleaning up observer');
        currentIntersectionObserver.disconnect();
      }
    };
  }, []); // No dependencies - everything uses refs

  return observerRef;
};
