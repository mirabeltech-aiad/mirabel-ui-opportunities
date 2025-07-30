/**
 * @fileoverview Comprehensive Code Review System
 * 
 * Final review system that audits code against all established guidelines
 */

import { runCodeQualityAudit, calculateQualityMetrics } from './index';
import { validateNaming } from './namingConventions';
import { validateImports, organizeImports } from './importOrganization';
import { calculateComplexity, getRefactoringSuggestions } from './componentStructure';
import { analyzeComponentResponsibilities } from './responsibilityAnalysis';
import { detectViolations, getSuggestions } from './violationDetection';

// Review categories
export enum ReviewCategory {
  NAMING = 'naming',
  IMPORTS = 'imports',
  STRUCTURE = 'structure',
  RESPONSIBILITY = 'responsibility',
  PERFORMANCE = 'performance',
  DOCUMENTATION = 'documentation',
  TESTING = 'testing',
}

// Review severity levels
export enum ReviewSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}

// Review issue interface
export interface ReviewIssue {
  category: ReviewCategory;
  severity: ReviewSeverity;
  message: string;
  file: string;
  line?: number;
  suggestion?: string;
  autoFixable?: boolean;
}

// Review summary interface
export interface ReviewSummary {
  totalFiles: number;
  totalIssues: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  overallScore: number;
  categoryScores: Record<ReviewCategory, number>;
  recommendations: string[];
}

// File review result
export interface FileReviewResult {
  file: string;
  issues: ReviewIssue[];
  metrics: {
    lines: number;
    complexity: number;
    maintainability: number;
    testCoverage?: number;
  };
  score: number;
}

// Comprehensive file review
export const reviewFile = async (filePath: string, fileContent: string): Promise<FileReviewResult> => {
  const issues: ReviewIssue[] = [];
  
  // Run basic quality audit
  const audit = await runCodeQualityAudit(filePath, fileContent);
  issues.push(...audit.issues.map(issue => ({
    category: issue.type as ReviewCategory,
    severity: issue.severity === 'error' ? ReviewSeverity.CRITICAL : 
             issue.severity === 'warning' ? ReviewSeverity.HIGH : ReviewSeverity.MEDIUM,
    message: issue.message,
    file: filePath,
    line: issue.line,
    suggestion: issue.suggestion,
    autoFixable: false,
  })));

  // Check naming conventions
  const componentMatch = fileContent.match(/export\s+(?:const|function)\s+([A-Z]\w+)/);
  if (componentMatch && !validateNaming.component(componentMatch[1])) {
    issues.push({
      category: ReviewCategory.NAMING,
      severity: ReviewSeverity.MEDIUM,
      message: `Component name "${componentMatch[1]}" doesn't follow PascalCase convention`,
      file: filePath,
      suggestion: 'Use PascalCase for component names',
      autoFixable: true,
    });
  }

  // Check import organization
  const importLines = fileContent.split('\n').filter(line => line.trim().startsWith('import'));
  if (importLines.length > 0) {
    const groups = validateImports(importLines);
    let hasImportIssues = false;
    
    // Check if imports are properly grouped and sorted
    const organized = organizeImports(importLines);
    if (JSON.stringify(importLines) !== JSON.stringify(organized.filter(line => line !== ''))) {
      hasImportIssues = true;
    }

    if (hasImportIssues) {
      issues.push({
        category: ReviewCategory.IMPORTS,
        severity: ReviewSeverity.LOW,
        message: 'Imports are not properly organized',
        file: filePath,
        suggestion: 'Organize imports by category with proper spacing',
        autoFixable: true,
      });
    }
  }

  // Check component structure
  if (filePath.includes('.tsx') || filePath.includes('.jsx')) {
    const complexity = calculateComplexity(fileContent);
    const suggestions = getRefactoringSuggestions(complexity);
    
    suggestions.forEach(suggestion => {
      issues.push({
        category: ReviewCategory.STRUCTURE,
        severity: complexity.complexity > 20 ? ReviewSeverity.HIGH : ReviewSeverity.MEDIUM,
        message: suggestion,
        file: filePath,
        autoFixable: false,
      });
    });
  }

  // Check single responsibility
  if (filePath.includes('.tsx') || filePath.includes('.jsx')) {
    const responsibilities = analyzeComponentResponsibilities(fileContent);
    const violations = detectViolations(responsibilities);
    const srpSuggestions = getSuggestions(responsibilities);
    
    violations.forEach(violation => {
      issues.push({
        category: ReviewCategory.RESPONSIBILITY,
        severity: ReviewSeverity.MEDIUM,
        message: violation,
        file: filePath,
        autoFixable: false,
      });
    });

    srpSuggestions.forEach(suggestion => {
      issues.push({
        category: ReviewCategory.RESPONSIBILITY,
        severity: ReviewSeverity.LOW,
        message: suggestion,
        file: filePath,
        autoFixable: false,
      });
    });
  }

  // Check for performance issues
  const performanceIssues = checkPerformanceIssues(fileContent, filePath);
  issues.push(...performanceIssues);

  // Check documentation
  const docIssues = checkDocumentationIssues(fileContent, filePath);
  issues.push(...docIssues);

  // Calculate metrics
  const metrics = calculateQualityMetrics(fileContent);
  const complexity = calculateComplexity(fileContent);

  // Calculate file score
  const score = calculateFileScore(issues, metrics, complexity);

  return {
    file: filePath,
    issues,
    metrics: {
      lines: metrics.lines,
      complexity: complexity.complexity,
      maintainability: metrics.maintainabilityIndex,
    },
    score,
  };
};

// Check for performance issues
const checkPerformanceIssues = (content: string, filePath: string): ReviewIssue[] => {
  const issues: ReviewIssue[] = [];

  // Check for unnecessary re-renders
  if (content.includes('useEffect') && !content.includes('useCallback') && !content.includes('useMemo')) {
    issues.push({
      category: ReviewCategory.PERFORMANCE,
      severity: ReviewSeverity.MEDIUM,
      message: 'Consider using useCallback or useMemo to prevent unnecessary re-renders',
      file: filePath,
      suggestion: 'Wrap functions in useCallback and expensive calculations in useMemo',
    });
  }

  // Check for inline object/array creation in JSX
  if (content.match(/\w+\s*=\s*\{[^}]*\}/g) && content.includes('return (')) {
    issues.push({
      category: ReviewCategory.PERFORMANCE,
      severity: ReviewSeverity.LOW,
      message: 'Avoid creating objects/arrays inline in JSX props',
      file: filePath,
      suggestion: 'Move object/array creation outside render or use useMemo',
    });
  }

  // Check for missing key props in lists
  if (content.includes('.map(') && !content.includes('key=')) {
    issues.push({
      category: ReviewCategory.PERFORMANCE,
      severity: ReviewSeverity.HIGH,
      message: 'Missing key prop in list rendering',
      file: filePath,
      suggestion: 'Add unique key prop to list items',
      autoFixable: false,
    });
  }

  return issues;
};

// Check documentation issues
const checkDocumentationIssues = (content: string, filePath: string): ReviewIssue[] => {
  const issues: ReviewIssue[] = [];

  // Check for JSDoc comments on exported functions/components
  const exports = content.match(/export\s+(?:const|function|class)\s+\w+/g) || [];
  exports.forEach(exportMatch => {
    const exportIndex = content.indexOf(exportMatch);
    const beforeExport = content.substring(0, exportIndex);
    const lastJSDocIndex = beforeExport.lastIndexOf('/**');
    const lastLineIndex = beforeExport.lastIndexOf('\n');
    
    if (lastJSDocIndex < lastLineIndex) {
      issues.push({
        category: ReviewCategory.DOCUMENTATION,
        severity: ReviewSeverity.LOW,
        message: `Missing JSDoc comment for ${exportMatch}`,
        file: filePath,
        suggestion: 'Add JSDoc comments to document exported functions and components',
      });
    }
  });

  // Check for TypeScript interfaces without documentation
  const interfaces = content.match(/interface\s+\w+/g) || [];
  interfaces.forEach(interfaceMatch => {
    const interfaceIndex = content.indexOf(interfaceMatch);
    const beforeInterface = content.substring(0, interfaceIndex);
    const lastCommentIndex = Math.max(
      beforeInterface.lastIndexOf('/**'),
      beforeInterface.lastIndexOf('//')
    );
    const lastLineIndex = beforeInterface.lastIndexOf('\n');
    
    if (lastCommentIndex < lastLineIndex) {
      issues.push({
        category: ReviewCategory.DOCUMENTATION,
        severity: ReviewSeverity.LOW,
        message: `Missing documentation for ${interfaceMatch}`,
        file: filePath,
        suggestion: 'Add comments to document TypeScript interfaces',
      });
    }
  });

  return issues;
};

// Calculate file score based on issues and metrics
const calculateFileScore = (
  issues: ReviewIssue[], 
  metrics: ReturnType<typeof calculateQualityMetrics>,
  complexity: ReturnType<typeof calculateComplexity>
): number => {
  let score = 100;

  // Deduct points for issues
  issues.forEach(issue => {
    switch (issue.severity) {
      case ReviewSeverity.CRITICAL:
        score -= 20;
        break;
      case ReviewSeverity.HIGH:
        score -= 10;
        break;
      case ReviewSeverity.MEDIUM:
        score -= 5;
        break;
      case ReviewSeverity.LOW:
        score -= 2;
        break;
      case ReviewSeverity.INFO:
        score -= 1;
        break;
    }
  });

  // Factor in complexity
  if (complexity.complexity > 20) score -= 10;
  if (complexity.complexity > 30) score -= 15;

  // Factor in maintainability
  score = (score + metrics.maintainabilityIndex) / 2;

  return Math.max(0, Math.min(100, score));
};

// Run comprehensive review on multiple files
export const runComprehensiveReview = async (
  files: Array<{ path: string; content: string }>
): Promise<{
  summary: ReviewSummary;
  fileResults: FileReviewResult[];
}> => {
  const fileResults: FileReviewResult[] = [];
  
  for (const file of files) {
    const result = await reviewFile(file.path, file.content);
    fileResults.push(result);
  }

  // Calculate summary
  const summary = calculateReviewSummary(fileResults);

  return { summary, fileResults };
};

// Calculate overall review summary
const calculateReviewSummary = (results: FileReviewResult[]): ReviewSummary => {
  const allIssues = results.flatMap(r => r.issues);
  
  const criticalIssues = allIssues.filter(i => i.severity === ReviewSeverity.CRITICAL).length;
  const highIssues = allIssues.filter(i => i.severity === ReviewSeverity.HIGH).length;
  const mediumIssues = allIssues.filter(i => i.severity === ReviewSeverity.MEDIUM).length;
  const lowIssues = allIssues.filter(i => i.severity === ReviewSeverity.LOW).length;

  const overallScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

  // Calculate category scores
  const categoryScores = Object.values(ReviewCategory).reduce((scores, category) => {
    const categoryIssues = allIssues.filter(i => i.category === category);
    const categoryFiles = results.filter(r => r.issues.some(i => i.category === category));
    scores[category] = categoryFiles.length > 0 ? 
      Math.max(0, 100 - (categoryIssues.length * 5)) : 100;
    return scores;
  }, {} as Record<ReviewCategory, number>);

  // Generate recommendations
  const recommendations: string[] = [];
  if (criticalIssues > 0) {
    recommendations.push('Address critical issues immediately - they may cause runtime errors');
  }
  if (highIssues > 5) {
    recommendations.push('Focus on high-priority issues to improve code reliability');
  }
  if (categoryScores[ReviewCategory.PERFORMANCE] < 80) {
    recommendations.push('Consider performance optimizations to improve user experience');
  }
  if (categoryScores[ReviewCategory.DOCUMENTATION] < 70) {
    recommendations.push('Improve code documentation for better maintainability');
  }
  if (overallScore < 80) {
    recommendations.push('Consider refactoring complex components into smaller, focused pieces');
  }

  return {
    totalFiles: results.length,
    totalIssues: allIssues.length,
    criticalIssues,
    highIssues,
    mediumIssues,
    lowIssues,
    overallScore,
    categoryScores,
    recommendations,
  };
};