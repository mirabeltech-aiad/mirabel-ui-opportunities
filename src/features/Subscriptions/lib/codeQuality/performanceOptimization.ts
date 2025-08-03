/**
 * @fileoverview Performance Optimization Tools
 * 
 * Tools for identifying and fixing performance issues
 */

// Performance issue types
export enum PerformanceIssueType {
  UNNECESSARY_RERENDERS = 'unnecessary_rerenders',
  MISSING_MEMOIZATION = 'missing_memoization',
  INEFFICIENT_LOOPS = 'inefficient_loops',
  LARGE_BUNDLE_SIZE = 'large_bundle_size',
  MEMORY_LEAKS = 'memory_leaks',
  BLOCKING_OPERATIONS = 'blocking_operations',
}

// Performance metrics interface
export interface PerformanceMetrics {
  renderCount: number;
  renderTime: number;
  memoryUsage: number;
  bundleSize?: number;
  dependencies: string[];
  hooks: string[];
}

// Performance issue interface
export interface PerformanceIssue {
  type: PerformanceIssueType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  file: string;
  line?: number;
  solution: string;
  autoFixable: boolean;
}

// Performance analysis result
export interface PerformanceAnalysis {
  file: string;
  metrics: PerformanceMetrics;
  issues: PerformanceIssue[];
  score: number;
  optimizations: string[];
}

// Analyze component performance
export const analyzeComponentPerformance = (
  filePath: string, 
  fileContent: string
): PerformanceAnalysis => {
  const issues: PerformanceIssue[] = [];
  const optimizations: string[] = [];

  // Extract metrics
  const metrics = extractPerformanceMetrics(fileContent);

  // Check for unnecessary re-renders
  const rerenderIssues = checkUnnecessaryRerenders(fileContent, filePath);
  issues.push(...rerenderIssues);

  // Check for missing memoization
  const memoizationIssues = checkMissingMemoization(fileContent, filePath);
  issues.push(...memoizationIssues);

  // Check for inefficient operations
  const inefficiencyIssues = checkInefficiencies(fileContent, filePath);
  issues.push(...inefficiencyIssues);

  // Check for potential memory leaks
  const memoryIssues = checkMemoryLeaks(fileContent, filePath);
  issues.push(...memoryIssues);

  // Generate optimizations
  if (issues.length > 0) {
    optimizations.push(...generateOptimizations(issues, metrics));
  }

  // Calculate performance score
  const score = calculatePerformanceScore(issues, metrics);

  return {
    file: filePath,
    metrics,
    issues,
    score,
    optimizations,
  };
};

// Extract performance metrics from code
const extractPerformanceMetrics = (content: string): PerformanceMetrics => {
  const hooks = (content.match(/use[A-Z]\w+/g) || []).filter((hook, index, arr) => 
    arr.indexOf(hook) === index
  );
  
  const dependencies = [];
  const importMatches = content.match(/from ['"]([^'"]+)['"]/g) || [];
  importMatches.forEach(match => {
    const dep = match.match(/from ['"]([^'"]+)['"]/)?.[1];
    if (dep && !dep.startsWith('.') && !dep.startsWith('@/')) {
      dependencies.push(dep);
    }
  });

  const renderCount = (content.match(/return\s*\(/g) || []).length;
  const components = (content.match(/<[A-Z]\w+/g) || []).length;

  return {
    renderCount,
    renderTime: estimateRenderTime(content),
    memoryUsage: estimateMemoryUsage(content),
    dependencies: [...new Set(dependencies)],
    hooks: [...new Set(hooks)],
  };
};

// Estimate render time based on code complexity
const estimateRenderTime = (content: string): number => {
  const complexity = (content.match(/\b(if|switch|for|while|map|filter)\b/g) || []).length;
  const jsxElements = (content.match(/<\w+/g) || []).length;
  return (complexity * 0.5) + (jsxElements * 0.1);
};

// Estimate memory usage
const estimateMemoryUsage = (content: string): number => {
  const variables = (content.match(/\b(const|let|var)\s+\w+/g) || []).length;
  const functions = (content.match(/\bfunction\s+\w+|=>\s*{|\w+\s*:/g) || []).length;
  return (variables * 0.1) + (functions * 0.5);
};

// Check for unnecessary re-renders
const checkUnnecessaryRerenders = (content: string, filePath: string): PerformanceIssue[] => {
  const issues: PerformanceIssue[] = [];

  // Check for inline object/array creation in JSX
  const inlineObjects = content.match(/\w+\s*=\s*\{[^}]*\}/g);
  if (inlineObjects && content.includes('return (')) {
    issues.push({
      type: PerformanceIssueType.UNNECESSARY_RERENDERS,
      severity: 'medium',
      message: 'Inline object creation in JSX causes unnecessary re-renders',
      file: filePath,
      solution: 'Move object creation outside render or use useMemo',
      autoFixable: true,
    });
  }

  // Check for missing useCallback on event handlers
  const eventHandlers = content.match(/on[A-Z]\w+\s*=\s*{[^}]*}/g);
  if (eventHandlers && !content.includes('useCallback')) {
    issues.push({
      type: PerformanceIssueType.UNNECESSARY_RERENDERS,
      severity: 'medium',
      message: 'Event handlers should be wrapped in useCallback',
      file: filePath,
      solution: 'Wrap event handlers with useCallback to prevent re-renders',
      autoFixable: true,
    });
  }

  // Check for missing React.memo on functional components
  if (content.includes('export const') && content.includes('Props') && !content.includes('memo(')) {
    issues.push({
      type: PerformanceIssueType.UNNECESSARY_RERENDERS,
      severity: 'low',
      message: 'Consider wrapping component in React.memo',
      file: filePath,
      solution: 'Use React.memo to prevent re-renders when props haven\'t changed',
      autoFixable: true,
    });
  }

  return issues;
};

// Check for missing memoization
const checkMissingMemoization = (content: string, filePath: string): PerformanceIssue[] => {
  const issues: PerformanceIssue[] = [];

  // Check for expensive calculations without useMemo
  const calculations = content.match(/\b(filter|map|reduce|sort|find)\s*\(/g);
  if (calculations && calculations.length > 2 && !content.includes('useMemo')) {
    issues.push({
      type: PerformanceIssueType.MISSING_MEMOIZATION,
      severity: 'high',
      message: 'Expensive array operations should be memoized',
      file: filePath,
      solution: 'Wrap expensive calculations in useMemo',
      autoFixable: true,
    });
  }

  // Check for complex derived state without useMemo
  if (content.includes('useState') && calculations && !content.includes('useMemo')) {
    issues.push({
      type: PerformanceIssueType.MISSING_MEMOIZATION,
      severity: 'medium',
      message: 'Derived state calculations should be memoized',
      file: filePath,
      solution: 'Use useMemo for derived state calculations',
      autoFixable: true,
    });
  }

  return issues;
};

// Check for inefficient operations
const checkInefficiencies = (content: string, filePath: string): PerformanceIssue[] => {
  const issues: PerformanceIssue[] = [];

  // Check for nested loops
  const nestedLoops = content.match(/for\s*\([^)]*\)\s*{[^}]*for\s*\([^)]*\)/g);
  if (nestedLoops) {
    issues.push({
      type: PerformanceIssueType.INEFFICIENT_LOOPS,
      severity: 'high',
      message: 'Nested loops can cause performance issues',
      file: filePath,
      solution: 'Consider optimizing with Map/Set or breaking into separate functions',
      autoFixable: false,
    });
  }

  // Check for inefficient array methods chaining
  const chainedMethods = content.match(/\.(filter|map|reduce)\s*\([^)]*\)\s*\.(filter|map|reduce)/g);
  if (chainedMethods && chainedMethods.length > 1) {
    issues.push({
      type: PerformanceIssueType.INEFFICIENT_LOOPS,
      severity: 'medium',
      message: 'Multiple chained array methods can be optimized',
      file: filePath,
      solution: 'Consider combining operations or using a single reduce',
      autoFixable: false,
    });
  }

  // Check for inefficient DOM queries
  if (content.includes('document.querySelector') || content.includes('getElementById')) {
    issues.push({
      type: PerformanceIssueType.BLOCKING_OPERATIONS,
      severity: 'medium',
      message: 'Direct DOM queries should be avoided in React',
      file: filePath,
      solution: 'Use refs or state to manage DOM elements',
      autoFixable: false,
    });
  }

  return issues;
};

// Check for potential memory leaks
const checkMemoryLeaks = (content: string, filePath: string): PerformanceIssue[] => {
  const issues: PerformanceIssue[] = [];

  // Check for missing cleanup in useEffect
  if (content.includes('useEffect') && content.includes('setInterval')) {
    if (!content.includes('clearInterval')) {
      issues.push({
        type: PerformanceIssueType.MEMORY_LEAKS,
        severity: 'critical',
        message: 'setInterval without cleanup causes memory leaks',
        file: filePath,
        solution: 'Return cleanup function from useEffect to clear interval',
        autoFixable: true,
      });
    }
  }

  // Check for missing event listener cleanup
  if (content.includes('addEventListener') && !content.includes('removeEventListener')) {
    issues.push({
      type: PerformanceIssueType.MEMORY_LEAKS,
      severity: 'high',
      message: 'Event listeners should be cleaned up',
      file: filePath,
      solution: 'Remove event listeners in useEffect cleanup',
      autoFixable: true,
    });
  }

  // Check for missing AbortController cleanup
  if (content.includes('fetch(') && !content.includes('AbortController')) {
    issues.push({
      type: PerformanceIssueType.MEMORY_LEAKS,
      severity: 'medium',
      message: 'Fetch requests should be cancelable',
      file: filePath,
      solution: 'Use AbortController to cancel requests on unmount',
      autoFixable: true,
    });
  }

  return issues;
};

// Generate optimization suggestions
const generateOptimizations = (
  issues: PerformanceIssue[], 
  metrics: PerformanceMetrics
): string[] => {
  const optimizations: string[] = [];

  if (issues.some(i => i.type === PerformanceIssueType.UNNECESSARY_RERENDERS)) {
    optimizations.push('Implement React.memo and useCallback to reduce re-renders');
  }

  if (issues.some(i => i.type === PerformanceIssueType.MISSING_MEMOIZATION)) {
    optimizations.push('Add useMemo for expensive calculations');
  }

  if (metrics.dependencies.length > 10) {
    optimizations.push('Consider code splitting to reduce bundle size');
  }

  if (metrics.hooks.length > 8) {
    optimizations.push('Extract related hooks into custom hooks');
  }

  if (issues.some(i => i.severity === 'critical')) {
    optimizations.push('Address critical memory leak issues immediately');
  }

  return optimizations;
};

// Calculate performance score
const calculatePerformanceScore = (
  issues: PerformanceIssue[], 
  metrics: PerformanceMetrics
): number => {
  let score = 100;

  // Deduct points for issues
  issues.forEach(issue => {
    switch (issue.severity) {
      case 'critical':
        score -= 25;
        break;
      case 'high':
        score -= 15;
        break;
      case 'medium':
        score -= 8;
        break;
      case 'low':
        score -= 3;
        break;
    }
  });

  // Factor in complexity
  if (metrics.renderTime > 10) score -= 10;
  if (metrics.dependencies.length > 15) score -= 5;
  if (metrics.hooks.length > 10) score -= 5;

  return Math.max(0, Math.min(100, score));
};

// Auto-fix performance issues
export const autoFixPerformanceIssues = (
  content: string,
  issues: PerformanceIssue[]
): string => {
  let fixedContent = content;

  const autoFixableIssues = issues.filter(issue => issue.autoFixable);

  autoFixableIssues.forEach(issue => {
    switch (issue.type) {
      case PerformanceIssueType.UNNECESSARY_RERENDERS:
        if (issue.message.includes('useCallback')) {
          fixedContent = addUseCallbackImport(fixedContent);
        }
        if (issue.message.includes('React.memo')) {
          fixedContent = wrapWithMemo(fixedContent);
        }
        break;
      
      case PerformanceIssueType.MISSING_MEMOIZATION:
        fixedContent = addUseMemoImport(fixedContent);
        break;
      
      case PerformanceIssueType.MEMORY_LEAKS:
        if (issue.message.includes('clearInterval')) {
          fixedContent = addIntervalCleanup(fixedContent);
        }
        break;
    }
  });

  return fixedContent;
};

// Helper functions for auto-fixing
const addUseCallbackImport = (content: string): string => {
  if (!content.includes('useCallback')) {
    return content.replace(
      /import React[^;]*;/,
      match => match.replace('} from \'react\';', ', useCallback } from \'react\';')
    );
  }
  return content;
};

const addUseMemoImport = (content: string): string => {
  if (!content.includes('useMemo')) {
    return content.replace(
      /import React[^;]*;/,
      match => match.replace('} from \'react\';', ', useMemo } from \'react\';')
    );
  }
  return content;
};

const wrapWithMemo = (content: string): string => {
  return content.replace(
    /export const (\w+):/,
    'export const $1 = React.memo(:'
  ).replace(/}\s*$/, '});');
};

const addIntervalCleanup = (content: string): string => {
  return content.replace(
    /const interval = setInterval\([^}]*}\s*,\s*\d+\s*\);/,
    match => `${match}\n    return () => clearInterval(interval);`
  );
};