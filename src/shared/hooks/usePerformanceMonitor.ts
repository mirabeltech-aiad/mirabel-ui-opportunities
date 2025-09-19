/**
 * Performance Monitoring Hook
 * 
 * Provides component-level performance monitoring and optimization insights
 */

import { logger } from '../utils/logger'

import { useEffect, useRef, useCallback } from 'react';
import { performanceAdapter } from '../../adapters/performanceAdapter';
import { PerformanceOptimizer } from '../utils/performanceOptimizer';

interface PerformanceMonitorOptions {
  componentName: string;
  trackMemory?: boolean;
  trackRenders?: boolean;
  warnThreshold?: number; // milliseconds
  logResults?: boolean;
}

export function usePerformanceMonitor(options: PerformanceMonitorOptions) {
  const {
    componentName,
    trackMemory = false,
    trackRenders = true,
    warnThreshold = 16,
    logResults = import.meta.env.DEV
  } = options;

  const mountTime = useRef<number>(0);
  const renderCount = useRef<number>(0);
  const lastRenderTime = useRef<number>(0);
  const memoryTracker = useRef<(() => void) | null>(null);

  // Track component mount
  useEffect(() => {
    mountTime.current = performance.now();
    
    if (trackMemory) {
      memoryTracker.current = PerformanceOptimizer.trackMemoryUsage(componentName);
    }

    performanceAdapter.startMeasurement(`${componentName}-mount`);

    return () => {
      const mountDuration = performanceAdapter.endMeasurement(`${componentName}-mount`);
      
      if (memoryTracker.current) {
        memoryTracker.current();
      }

      if (logResults) {
        logger.log(`📊 ${componentName} lifecycle:`, {
          mountTime: `${mountDuration.toFixed(2)}ms`,
          totalRenders: renderCount.current,
          avgRenderTime: renderCount.current > 0 
            ? `${(lastRenderTime.current / renderCount.current).toFixed(2)}ms`
            : '0ms'
        });
      }
    };
  }, [componentName, trackMemory, logResults]);

  // Track renders
  useEffect(() => {
    if (!trackRenders) return;

    const renderStart = performance.now();
    renderCount.current++;

    // Use setTimeout to measure after render completion
    const timeoutId = setTimeout(() => {
      const renderTime = performance.now() - renderStart;
      lastRenderTime.current += renderTime;
      
      performanceAdapter.recordMetric(`${componentName}-render`, renderTime, 'ms');

      if (renderTime > warnThreshold && logResults) {
        logger.warn(`⚠️ Slow render in ${componentName}: ${renderTime.toFixed(2)}ms (threshold: ${warnThreshold}ms)`);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  });

  // Provide performance utilities
  const measureOperation = useCallback((operationName: string, operation: () => void | Promise<void>) => {
    const fullName = `${componentName}-${operationName}`;
    performanceAdapter.startMeasurement(fullName);
    
    const result = operation();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        performanceAdapter.endMeasurement(fullName);
      });
    } else {
      performanceAdapter.endMeasurement(fullName);
      return result;
    }
  }, [componentName]);

  const debouncedCallback = useCallback((callback: Function, delay: number) => {
    return PerformanceOptimizer.debounce(callback as any, delay);
  }, []);

  const throttledCallback = useCallback((callback: Function, limit: number) => {
    return PerformanceOptimizer.throttle(callback as any, limit);
  }, []);

  return {
    measureOperation,
    debouncedCallback,
    throttledCallback,
    renderCount: renderCount.current,
    componentName
  };
}

/**
 * Hook for monitoring expensive operations
 */
export function useOperationMonitor(operationName: string) {
  const measureAsync = useCallback(async <T>(operation: () => Promise<T>): Promise<T> => {
    performanceAdapter.startMeasurement(operationName);
    try {
      const result = await operation();
      return result;
    } finally {
      const duration = performanceAdapter.endMeasurement(operationName);
      
      if (duration > 100) { // Warn for operations > 100ms
        logger.warn(`⚠️ Slow async operation: ${operationName} took ${duration.toFixed(2)}ms`);
      }
    }
  }, [operationName]);

  const measureSync = useCallback(<T>(operation: () => T): T => {
    performanceAdapter.startMeasurement(operationName);
    try {
      const result = operation();
      return result;
    } finally {
      const duration = performanceAdapter.endMeasurement(operationName);
      
      if (duration > 16) { // Warn for sync operations > 16ms
        logger.warn(`⚠️ Slow sync operation: ${operationName} took ${duration.toFixed(2)}ms`);
      }
    }
  }, [operationName]);

  return { measureAsync, measureSync };
}

/**
 * Hook for monitoring list rendering performance
 */
export function useListPerformanceMonitor(listName: string, itemCount: number) {
  const previousCount = useRef(itemCount);
  
  useEffect(() => {
    const countChange = itemCount - previousCount.current;
    previousCount.current = itemCount;
    
    performanceAdapter.recordMetric(`${listName}-item-count`, itemCount);
    
    if (itemCount > 1000) {
      logger.warn(`📋 Large list detected: ${listName} has ${itemCount} items. Consider virtualization.`);
    }
    
    if (Math.abs(countChange) > 100) {
      logger.log(`📋 ${listName} size changed by ${countChange > 0 ? '+' : ''}${countChange} items`);
    }
  }, [listName, itemCount]);

  const measureItemRender = useCallback((itemId: string | number) => {
    const measurementName = `${listName}-item-${itemId}`;
    performanceAdapter.startMeasurement(measurementName);
    
    return () => {
      performanceAdapter.endMeasurement(measurementName);
    };
  }, [listName]);

  return { measureItemRender, itemCount };
}

/**
 * Hook for detecting memory leaks in components
 */
export function useMemoryLeakDetector(componentName: string) {
  const initialMemory = useRef<number>(0);
  const memoryCheckInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if ('memory' in performance) {
      initialMemory.current = (performance as any).memory.usedJSHeapSize;
      
      // Check memory every 10 seconds
      memoryCheckInterval.current = setInterval(() => {
        const currentMemory = (performance as any).memory.usedJSHeapSize;
        const memoryDiff = currentMemory - initialMemory.current;
        const memoryDiffMB = memoryDiff / 1024 / 1024;
        
        if (memoryDiffMB > 5) { // 5MB threshold
          logger.warn(`🧠 Potential memory leak in ${componentName}: +${memoryDiffMB.toFixed(2)}MB`);
        }
        
        performanceAdapter.recordMetric(`${componentName}-memory-growth`, memoryDiff, 'bytes');
      }, 10000);
    }

    return () => {
      if (memoryCheckInterval.current) {
        clearInterval(memoryCheckInterval.current);
      }
    };
  }, [componentName]);
}