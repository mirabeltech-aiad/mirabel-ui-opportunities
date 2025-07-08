import { useEffect, useRef, useCallback, useState } from 'react';

export interface MemoryUsage {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export interface PerformanceMetrics {
  memoryUsage: MemoryUsage | null;
  tabCount: number;
  iframeCount: number;
  componentCount: number;
  timestamp: number;
}

class MemoryManager {
  private tabRegistry = new Map<string, Set<() => void>>();
  private iframeRegistry = new Map<string, HTMLIFrameElement>();
  private componentRegistry = new Map<string, any>();
  private cleanupTimers = new Map<string, NodeJS.Timeout>();
  private performanceObserver: PerformanceObserver | null = null;
  private memoryCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.setupPerformanceMonitoring();
    this.startMemoryMonitoring();
  }

  // Tab lifecycle management
  registerTab(tabId: string): void {
    if (!this.tabRegistry.has(tabId)) {
      this.tabRegistry.set(tabId, new Set());
    }
  }

  addTabCleanup(tabId: string, cleanup: () => void): void {
    const cleanups = this.tabRegistry.get(tabId);
    if (cleanups) {
      cleanups.add(cleanup);
    }
  }

  removeTabCleanup(tabId: string, cleanup: () => void): void {
    const cleanups = this.tabRegistry.get(tabId);
    if (cleanups) {
      cleanups.delete(cleanup);
    }
  }

  cleanupTab(tabId: string): void {
    const cleanups = this.tabRegistry.get(tabId);
    if (cleanups) {
      cleanups.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.error('Error during tab cleanup:', error);
        }
      });
      cleanups.clear();
    }

    // Clean iframe if exists
    this.cleanupIframe(tabId);
    
    // Remove from registries
    this.tabRegistry.delete(tabId);
    this.componentRegistry.delete(tabId);
    
    // Clear any pending cleanup timers
    const timer = this.cleanupTimers.get(tabId);
    if (timer) {
      clearTimeout(timer);
      this.cleanupTimers.delete(tabId);
    }

    // Force garbage collection if available
    this.forceGarbageCollection();
  }

  // Iframe management
  registerIframe(tabId: string, iframe: HTMLIFrameElement): void {
    this.iframeRegistry.set(tabId, iframe);
  }

  cleanupIframe(tabId: string): void {
    const iframe = this.iframeRegistry.get(tabId);
    if (iframe) {
      try {
        // Clear iframe source to stop any ongoing operations
        iframe.src = 'about:blank';
        
        // Remove from parent if still attached
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }

        // Clear any event listeners
        iframe.onload = null;
        iframe.onerror = null;
      } catch (error) {
        console.error('Error cleaning up iframe:', error);
      }
      
      this.iframeRegistry.delete(tabId);
    }
  }

  // Component lifecycle management
  registerComponent(id: string, component: any): void {
    this.componentRegistry.set(id, component);
  }

  unregisterComponent(id: string): void {
    this.componentRegistry.delete(id);
  }

  // Delayed cleanup for better UX
  scheduleDelayedCleanup(tabId: string, delay: number = 30000): void {
    // Clear existing timer
    const existingTimer = this.cleanupTimers.get(tabId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Schedule new cleanup
    const timer = setTimeout(() => {
      this.cleanupTab(tabId);
      this.cleanupTimers.delete(tabId);
    }, delay);

    this.cleanupTimers.set(tabId, timer);
  }

  cancelDelayedCleanup(tabId: string): void {
    const timer = this.cleanupTimers.get(tabId);
    if (timer) {
      clearTimeout(timer);
      this.cleanupTimers.delete(tabId);
    }
  }

  // Memory monitoring
  private setupPerformanceMonitoring(): void {
    if ('PerformanceObserver' in window) {
      try {
        this.performanceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'measure') {
              console.log(`Performance measure: ${entry.name} took ${entry.duration}ms`);
            }
          });
        });

        this.performanceObserver.observe({
          entryTypes: ['measure', 'navigation', 'resource']
        });
      } catch (error) {
        console.warn('Performance monitoring not available:', error);
      }
    }
  }

  private startMemoryMonitoring(): void {
    this.memoryCheckInterval = setInterval(() => {
      const metrics = this.getPerformanceMetrics();
      
      if (metrics.memoryUsage) {
        const usagePercent = (metrics.memoryUsage.usedJSHeapSize / metrics.memoryUsage.jsHeapSizeLimit) * 100;
        
        if (usagePercent > 80) {
          console.warn('High memory usage detected:', usagePercent.toFixed(2) + '%');
          this.performCleanup();
        }
      }
    }, 30000); // Check every 30 seconds
  }

  private performCleanup(): void {
    // Clean up inactive tabs older than 5 minutes
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    this.tabRegistry.forEach((cleanups, tabId) => {
      // This is a simplified check - in real implementation you'd track last access time
      if (cleanups.size === 0) {
        this.scheduleDelayedCleanup(tabId, 1000); // Clean up immediately if no active cleanups
      }
    });

    this.forceGarbageCollection();
  }

  // Force garbage collection if available
  private forceGarbageCollection(): void {
    if ('gc' in window && typeof window.gc === 'function') {
      try {
        window.gc();
      } catch (error) {
        // GC not available in this environment
      }
    }
  }

  // Get current performance metrics
  getPerformanceMetrics(): PerformanceMetrics {
    let memoryUsage: MemoryUsage | null = null;

    if ('memory' in performance) {
      const memory = (performance as any).memory;
      memoryUsage = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }

    return {
      memoryUsage,
      tabCount: this.tabRegistry.size,
      iframeCount: this.iframeRegistry.size,
      componentCount: this.componentRegistry.size,
      timestamp: Date.now(),
    };
  }

  // Cleanup everything
  destroy(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }

    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
    }

    // Cleanup all tabs
    this.tabRegistry.forEach((_, tabId) => {
      this.cleanupTab(tabId);
    });

    // Clear all timers
    this.cleanupTimers.forEach(timer => clearTimeout(timer));
    this.cleanupTimers.clear();

    this.tabRegistry.clear();
    this.iframeRegistry.clear();
    this.componentRegistry.clear();
  }
}

// Singleton instance
export const memoryManager = new MemoryManager();

// React hooks for memory management
export const useTabCleanup = (tabId: string) => {
  const cleanupFunctions = useRef<Set<() => void>>(new Set());

  useEffect(() => {
    memoryManager.registerTab(tabId);

    return () => {
      // Cleanup all registered functions when component unmounts
      cleanupFunctions.current.forEach(cleanup => {
        memoryManager.removeTabCleanup(tabId, cleanup);
      });
      cleanupFunctions.current.clear();
    };
  }, [tabId]);

  const addCleanup = useCallback((cleanup: () => void) => {
    cleanupFunctions.current.add(cleanup);
    memoryManager.addTabCleanup(tabId, cleanup);

    return () => {
      cleanupFunctions.current.delete(cleanup);
      memoryManager.removeTabCleanup(tabId, cleanup);
    };
  }, [tabId]);

  const cleanupTab = useCallback(() => {
    memoryManager.cleanupTab(tabId);
  }, [tabId]);

  return { addCleanup, cleanupTab };
};

export const useIframeCleanup = (tabId: string) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const registerIframe = useCallback((iframe: HTMLIFrameElement) => {
    iframeRef.current = iframe;
    memoryManager.registerIframe(tabId, iframe);
  }, [tabId]);

  useEffect(() => {
    return () => {
      if (iframeRef.current) {
        memoryManager.cleanupIframe(tabId);
      }
    };
  }, [tabId]);

  return { registerIframe, iframeRef };
};

export const useMemoryMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(memoryManager.getPerformanceMetrics());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return metrics;
};

export const useComponentCleanup = (componentId: string) => {
  useEffect(() => {
    memoryManager.registerComponent(componentId, {
      id: componentId,
      mountTime: Date.now(),
    });

    return () => {
      memoryManager.unregisterComponent(componentId);
    };
  }, [componentId]);
};