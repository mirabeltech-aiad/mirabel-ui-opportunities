/**
 * Performance Optimization Utilities
 * 
 * Provides tools to identify and fix common performance issues
 */

import { logger } from './logger'

import { performanceAdapter } from '../../adapters/performanceAdapter';
import { GenericFunction } from '../types/utility';

export interface PerformanceIssue {
  type: 'memory' | 'render' | 'dom' | 'bundle';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  value: number;
  threshold: number;
}

export class PerformanceOptimizer {
  /**
   * Analyze current performance and identify issues
   */
  static analyzePerformance(): PerformanceIssue[] {
    const metrics = performanceAdapter.getMetrics();
    const issues: PerformanceIssue[] = [];

    // Memory usage analysis
    const memoryMB = metrics.memoryUsage / 1024 / 1024;
    if (memoryMB > 100) {
      issues.push({
        type: 'memory',
        severity: 'critical',
        description: `Memory usage is ${memoryMB.toFixed(1)}MB`,
        recommendation: 'Check for memory leaks, implement component cleanup, use React.memo for expensive components',
        value: memoryMB,
        threshold: 100
      });
    } else if (memoryMB > 50) {
      issues.push({
        type: 'memory',
        severity: 'high',
        description: `Memory usage is ${memoryMB.toFixed(1)}MB`,
        recommendation: 'Consider implementing virtualization for large lists, optimize component re-renders',
        value: memoryMB,
        threshold: 50
      });
    }

    // Render time analysis
    if (metrics.renderTime > 50) {
      issues.push({
        type: 'render',
        severity: 'critical',
        description: `Average render time is ${metrics.renderTime.toFixed(1)}ms`,
        recommendation: 'Use React.memo, useMemo, useCallback. Consider code splitting and lazy loading',
        value: metrics.renderTime,
        threshold: 50
      });
    } else if (metrics.renderTime > 16) {
      issues.push({
        type: 'render',
        severity: 'high',
        description: `Average render time is ${metrics.renderTime.toFixed(1)}ms`,
        recommendation: 'Optimize component renders, avoid inline functions in JSX',
        value: metrics.renderTime,
        threshold: 16
      });
    }

    // DOM nodes analysis
    if (metrics.domNodes > 2000) {
      issues.push({
        type: 'dom',
        severity: 'critical',
        description: `DOM has ${metrics.domNodes} nodes`,
        recommendation: 'Implement virtualization for large lists, reduce DOM complexity',
        value: metrics.domNodes,
        threshold: 2000
      });
    } else if (metrics.domNodes > 1000) {
      issues.push({
        type: 'dom',
        severity: 'high',
        description: `DOM has ${metrics.domNodes} nodes`,
        recommendation: 'Consider pagination or virtualization for large data sets',
        value: metrics.domNodes,
        threshold: 1000
      });
    }

    // Bundle size analysis
    const bundleKB = metrics.bundleSize / 1024;
    if (bundleKB > 500) {
      issues.push({
        type: 'bundle',
        severity: 'critical',
        description: `Bundle size is ${bundleKB.toFixed(1)}KB`,
        recommendation: 'Implement code splitting, tree shaking, and dynamic imports',
        value: bundleKB,
        threshold: 500
      });
    } else if (bundleKB > 150) {
      issues.push({
        type: 'bundle',
        severity: 'medium',
        description: `Bundle size is ${bundleKB.toFixed(1)}KB`,
        recommendation: 'Consider lazy loading non-critical components',
        value: bundleKB,
        threshold: 150
      });
    }

    return issues;
  }

  /**
   * Generate performance optimization recommendations
   */
  static generateRecommendations(): string[] {
    const issues = this.analyzePerformance();
    const recommendations: string[] = [];

    // Group recommendations by type
    const memoryIssues = issues.filter(i => i.type === 'memory');
    const renderIssues = issues.filter(i => i.type === 'render');
    const domIssues = issues.filter(i => i.type === 'dom');
    const bundleIssues = issues.filter(i => i.type === 'bundle');

    if (memoryIssues.length > 0) {
      recommendations.push(
        '🧠 Memory Optimization:',
        '  • Use React.memo() for expensive components',
        '  • Implement proper cleanup in useEffect',
        '  • Avoid creating objects/functions in render',
        '  • Use useMemo/useCallback for expensive calculations'
      );
    }

    if (renderIssues.length > 0) {
      recommendations.push(
        '⚡ Render Optimization:',
        '  • Move expensive operations to useMemo',
        '  • Use React.lazy() for code splitting',
        '  • Avoid inline styles and functions',
        '  • Implement proper key props for lists'
      );
    }

    if (domIssues.length > 0) {
      recommendations.push(
        '🏗️ DOM Optimization:',
        '  • Implement virtualization (react-window/react-virtualized)',
        '  • Use pagination for large data sets',
        '  • Reduce DOM nesting depth',
        '  • Remove unused DOM elements'
      );
    }

    if (bundleIssues.length > 0) {
      recommendations.push(
        '📦 Bundle Optimization:',
        '  • Implement dynamic imports',
        '  • Use tree shaking',
        '  • Split vendor and app bundles',
        '  • Lazy load non-critical features'
      );
    }

    return recommendations;
  }

  /**
   * Create a performance monitoring hook
   */
  static createPerformanceHook() {
    return function usePerformanceMonitor(componentName: string) {
      const startTime = performance.now();
      
      React.useEffect(() => {
        const renderTime = performance.now() - startTime;
        performanceAdapter.recordMetric(`${componentName}-mount`, renderTime, 'ms');
        
        return () => {
          performanceAdapter.recordMetric(`${componentName}-unmount`, performance.now(), 'ms');
        };
      }, []);

      React.useEffect(() => {
        const updateTime = performance.now();
        performanceAdapter.recordMetric(`${componentName}-update`, updateTime - startTime, 'ms');
      });
    };
  }

  /**
   * Debounce function to prevent excessive performance monitoring
   */
  static debounce<T extends GenericFunction>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Throttle function for performance-sensitive operations
   */
  static throttle<T extends GenericFunction>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Memory usage tracker for components
   */
  static trackMemoryUsage(componentName: string) {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    return () => {
      const currentMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryDiff = currentMemory - initialMemory;
      
      if (memoryDiff > 1024 * 1024) { // 1MB threshold
        logger.warn(`${componentName} may have memory leak: +${(memoryDiff / 1024 / 1024).toFixed(2)}MB`);
      }
      
      performanceAdapter.recordMetric(`${componentName}-memory-usage`, memoryDiff, 'bytes');
    };
  }
}

// Export React import for the hook
declare const React: typeof import('react');