
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Skeleton } from './skeleton';

interface LazyChartWrapperProps {
  children: React.ReactNode;
  height?: number;
  width?: number;
  className?: string;
  threshold?: number;
}

export const LazyChartWrapper: React.FC<LazyChartWrapperProps> = ({ 
  children, 
  height = 300,
  width = 800,
  className = "",
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        <Suspense fallback={<Skeleton className="w-full" style={{ height: `${height}px` }} />}>
          {children}
        </Suspense>
      ) : (
        <Skeleton className="w-full" style={{ height: `${height}px` }} />
      )}
    </div>
  );
};
