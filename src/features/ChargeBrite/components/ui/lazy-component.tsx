
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Skeleton } from './skeleton';

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  className?: string;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({ 
  children, 
  fallback,
  threshold = 0.1,
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add small delay for better performance
          setTimeout(() => setIsVisible(true), 50);
          observer.disconnect();
        }
      },
      { 
        threshold,
        rootMargin: '100px' // Load components before they're fully visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        <Suspense fallback={fallback || <Skeleton className="h-[300px] w-full animate-pulse" />}>
          {children}
        </Suspense>
      ) : (
        fallback || <Skeleton className="h-[300px] w-full animate-pulse" />
      )}
    </div>
  );
};
