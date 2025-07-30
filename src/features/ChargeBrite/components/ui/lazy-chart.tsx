
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Skeleton } from './skeleton';

interface LazyChartProps {
  children: React.ReactNode;
  height?: number;
  className?: string;
}

export const LazyChart: React.FC<LazyChartProps> = ({ 
  children, 
  height = 300, 
  className = "" 
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
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        <Suspense fallback={<Skeleton className={`h-[${height}px] w-full`} />}>
          {children}
        </Suspense>
      ) : (
        <Skeleton className={`h-[${height}px] w-full`} />
      )}
    </div>
  );
};
