/**
 * @fileoverview Documentation Review and Analysis
 * 
 * Tools for reviewing and improving code documentation
 */

// Documentation issue types
export enum DocumentationIssueType {
  MISSING_JSDOC = 'missing_jsdoc',
  INCOMPLETE_JSDOC = 'incomplete_jsdoc',
  MISSING_TYPE_DOCS = 'missing_type_docs',
  MISSING_EXAMPLES = 'missing_examples',
  OUTDATED_DOCS = 'outdated_docs',
  MISSING_README = 'missing_readme',
}

// Documentation coverage levels
export enum CoverageLevel {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  MISSING = 'missing',
}

// Documentation issue interface
export interface DocumentationIssue {
  type: DocumentationIssueType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  file: string;
  line?: number;
  suggestion: string;
  example?: string;
}

// Documentation metrics interface
export interface DocumentationMetrics {
  totalExports: number;
  documentedExports: number;
  totalInterfaces: number;
  documentedInterfaces: number;
  totalFunctions: number;
  documentedFunctions: number;
  coveragePercentage: number;
  coverageLevel: CoverageLevel;
}

// Documentation analysis result
export interface DocumentationAnalysis {
  file: string;
  metrics: DocumentationMetrics;
  issues: DocumentationIssue[];
  score: number;
  suggestions: string[];
}

// Analyze documentation coverage
export const analyzeDocumentation = (
  filePath: string,
  fileContent: string
): DocumentationAnalysis => {
  const issues: DocumentationIssue[] = [];
  const suggestions: string[] = [];

  // Extract documentation metrics
  const metrics = extractDocumentationMetrics(fileContent);

  // Check for missing JSDoc comments
  const jsdocIssues = checkJSDocCoverage(fileContent, filePath);
  issues.push(...jsdocIssues);

  // Check TypeScript type documentation
  const typeIssues = checkTypeDocumentation(fileContent, filePath);
  issues.push(...typeIssues);

  // Check for examples in complex functions
  const exampleIssues = checkExampleDocumentation(fileContent, filePath);
  issues.push(...exampleIssues);

  // Generate improvement suggestions
  suggestions.push(...generateDocumentationSuggestions(metrics, issues));

  // Calculate documentation score
  const score = calculateDocumentationScore(metrics, issues);

  return {
    file: filePath,
    metrics,
    issues,
    score,
    suggestions,
  };
};

// Extract documentation metrics
const extractDocumentationMetrics = (content: string): DocumentationMetrics => {
  // Find all exports
  const exports = content.match(/export\s+(?:const|function|class|interface|type)\s+\w+/g) || [];
  const interfaces = content.match(/export\s+interface\s+\w+/g) || [];
  const functions = content.match(/export\s+(?:const\s+\w+\s*=|function)\s+\w+/g) || [];

  // Count documented items
  let documentedExports = 0;
  let documentedInterfaces = 0;
  let documentedFunctions = 0;

  exports.forEach(exportItem => {
    const exportIndex = content.indexOf(exportItem);
    if (hasDocumentationBefore(content, exportIndex)) {
      documentedExports++;
    }
  });

  interfaces.forEach(interfaceItem => {
    const interfaceIndex = content.indexOf(interfaceItem);
    if (hasDocumentationBefore(content, interfaceIndex)) {
      documentedInterfaces++;
    }
  });

  functions.forEach(functionItem => {
    const functionIndex = content.indexOf(functionItem);
    if (hasDocumentationBefore(content, functionIndex)) {
      documentedFunctions++;
    }
  });

  const totalItems = exports.length;
  const documentedItems = documentedExports;
  const coveragePercentage = totalItems > 0 ? (documentedItems / totalItems) * 100 : 100;

  const coverageLevel = getCoverageLevel(coveragePercentage);

  return {
    totalExports: exports.length,
    documentedExports,
    totalInterfaces: interfaces.length,
    documentedInterfaces,
    totalFunctions: functions.length,
    documentedFunctions,
    coveragePercentage,
    coverageLevel,
  };
};

// Check if there's documentation before a code element
const hasDocumentationBefore = (content: string, index: number): boolean => {
  const beforeContent = content.substring(0, index);
  const lines = beforeContent.split('\n');
  
  // Check last few lines for JSDoc or regular comments
  for (let i = lines.length - 1; i >= Math.max(0, lines.length - 5); i--) {
    const line = lines[i].trim();
    if (line.startsWith('/**') || line.startsWith('/*') || line.startsWith('//')) {
      return true;
    }
    if (line && !line.startsWith('*') && !line.startsWith('*/')) {
      break;
    }
  }
  
  return false;
};

// Get coverage level based on percentage
const getCoverageLevel = (percentage: number): CoverageLevel => {
  if (percentage >= 90) return CoverageLevel.EXCELLENT;
  if (percentage >= 75) return CoverageLevel.GOOD;
  if (percentage >= 50) return CoverageLevel.FAIR;
  if (percentage > 0) return CoverageLevel.POOR;
  return CoverageLevel.MISSING;
};

// Check JSDoc coverage
const checkJSDocCoverage = (content: string, filePath: string): DocumentationIssue[] => {
  const issues: DocumentationIssue[] = [];

  // Find exported functions without JSDoc
  const exportedFunctions = content.match(/export\s+(?:const\s+\w+\s*=|function)\s+\w+/g) || [];
  
  exportedFunctions.forEach(func => {
    const funcIndex = content.indexOf(func);
    if (!hasJSDocBefore(content, funcIndex)) {
      const funcName = func.match(/\w+/g)?.[func.includes('const') ? 2 : 1] || 'function';
      
      issues.push({
        type: DocumentationIssueType.MISSING_JSDOC,
        severity: 'medium',
        message: `Function "${funcName}" is missing JSDoc documentation`,
        file: filePath,
        line: getLineNumber(content, funcIndex),
        suggestion: 'Add JSDoc comment with description, parameters, and return value',
        example: generateJSDocExample(func),
      });
    }
  });

  // Find exported components without JSDoc
  const exportedComponents = content.match(/export\s+const\s+[A-Z]\w+\s*:/g) || [];
  
  exportedComponents.forEach(component => {
    const compIndex = content.indexOf(component);
    if (!hasJSDocBefore(content, compIndex)) {
      const compName = component.match(/[A-Z]\w+/)?.[0] || 'Component';
      
      issues.push({
        type: DocumentationIssueType.MISSING_JSDOC,
        severity: 'medium',
        message: `Component "${compName}" is missing JSDoc documentation`,
        file: filePath,
        line: getLineNumber(content, compIndex),
        suggestion: 'Add JSDoc comment describing component purpose and props',
        example: generateComponentJSDocExample(compName),
      });
    }
  });

  return issues;
};

// Check if there's JSDoc before a code element
const hasJSDocBefore = (content: string, index: number): boolean => {
  const beforeContent = content.substring(0, index);
  const lastJSDocIndex = beforeContent.lastIndexOf('/**');
  const lastLineIndex = beforeContent.lastIndexOf('\n');
  
  return lastJSDocIndex > lastLineIndex;
};

// Check TypeScript type documentation
const checkTypeDocumentation = (content: string, filePath: string): DocumentationIssue[] => {
  const issues: DocumentationIssue[] = [];

  // Find interfaces without documentation
  const interfaces = content.match(/export\s+interface\s+\w+/g) || [];
  
  interfaces.forEach(interfaceItem => {
    const interfaceIndex = content.indexOf(interfaceItem);
    if (!hasDocumentationBefore(content, interfaceIndex)) {
      const interfaceName = interfaceItem.match(/\w+$/)?.[0] || 'Interface';
      
      issues.push({
        type: DocumentationIssueType.MISSING_TYPE_DOCS,
        severity: 'low',
        message: `Interface "${interfaceName}" is missing documentation`,
        file: filePath,
        line: getLineNumber(content, interfaceIndex),
        suggestion: 'Add comment describing the interface purpose and properties',
        example: generateInterfaceDocExample(interfaceName),
      });
    }
  });

  // Find type aliases without documentation
  const types = content.match(/export\s+type\s+\w+/g) || [];
  
  types.forEach(typeItem => {
    const typeIndex = content.indexOf(typeItem);
    if (!hasDocumentationBefore(content, typeIndex)) {
      const typeName = typeItem.match(/\w+$/)?.[0] || 'Type';
      
      issues.push({
        type: DocumentationIssueType.MISSING_TYPE_DOCS,
        severity: 'low',
        message: `Type "${typeName}" is missing documentation`,
        file: filePath,
        line: getLineNumber(content, typeIndex),
        suggestion: 'Add comment describing the type purpose and usage',
        example: generateTypeDocExample(typeName),
      });
    }
  });

  return issues;
};

// Check for example documentation in complex functions
const checkExampleDocumentation = (content: string, filePath: string): DocumentationIssue[] => {
  const issues: DocumentationIssue[] = [];

  // Find complex functions (those with multiple parameters or complex logic)
  const functionMatches = content.matchAll(/export\s+(?:const\s+(\w+)\s*=\s*\([^)]*\)|function\s+(\w+)\s*\([^)]*\))/g);
  
  for (const match of functionMatches) {
    const funcName = match[1] || match[2];
    const funcIndex = match.index || 0;
    const funcContent = content.substring(funcIndex, content.indexOf('}', funcIndex) + 1);
    
    // Check if function is complex (multiple params, conditional logic, etc.)
    const paramCount = (funcContent.match(/,/g) || []).length + 1;
    const hasLogic = /\b(if|switch|for|while)\b/.test(funcContent);
    
    if ((paramCount > 2 || hasLogic) && !hasExampleInJSDoc(content, funcIndex)) {
      issues.push({
        type: DocumentationIssueType.MISSING_EXAMPLES,
        severity: 'low',
        message: `Complex function "${funcName}" would benefit from usage examples`,
        file: filePath,
        line: getLineNumber(content, funcIndex),
        suggestion: 'Add @example tag to JSDoc with usage examples',
        example: generateFunctionExampleDoc(funcName),
      });
    }
  }

  return issues;
};

// Check if JSDoc contains examples
const hasExampleInJSDoc = (content: string, index: number): boolean => {
  const beforeContent = content.substring(0, index);
  const lastJSDocStart = beforeContent.lastIndexOf('/**');
  const lastJSDocEnd = beforeContent.lastIndexOf('*/');
  
  if (lastJSDocStart > lastJSDocEnd) {
    const jsdocContent = beforeContent.substring(lastJSDocStart);
    return jsdocContent.includes('@example');
  }
  
  return false;
};

// Get line number for a given index
const getLineNumber = (content: string, index: number): number => {
  return content.substring(0, index).split('\n').length;
};

// Generate documentation suggestions
const generateDocumentationSuggestions = (
  metrics: DocumentationMetrics,
  issues: DocumentationIssue[]
): string[] => {
  const suggestions: string[] = [];

  if (metrics.coverageLevel === CoverageLevel.POOR || metrics.coverageLevel === CoverageLevel.MISSING) {
    suggestions.push('Focus on documenting all exported functions and components');
  }

  if (issues.some(i => i.type === DocumentationIssueType.MISSING_JSDOC)) {
    suggestions.push('Add JSDoc comments to improve API documentation');
  }

  if (issues.some(i => i.type === DocumentationIssueType.MISSING_EXAMPLES)) {
    suggestions.push('Include usage examples for complex functions');
  }

  if (metrics.totalInterfaces > metrics.documentedInterfaces) {
    suggestions.push('Document TypeScript interfaces and types');
  }

  suggestions.push('Consider adding README.md with setup and usage instructions');

  return suggestions;
};

// Calculate documentation score
const calculateDocumentationScore = (
  metrics: DocumentationMetrics,
  issues: DocumentationIssue[]
): number => {
  let score = metrics.coveragePercentage;

  // Deduct points for issues
  issues.forEach(issue => {
    switch (issue.severity) {
      case 'critical':
        score -= 20;
        break;
      case 'high':
        score -= 10;
        break;
      case 'medium':
        score -= 5;
        break;
      case 'low':
        score -= 2;
        break;
    }
  });

  return Math.max(0, Math.min(100, score));
};

// Example generators
const generateJSDocExample = (funcDeclaration: string): string => {
  const funcName = funcDeclaration.match(/\w+/g)?.[funcDeclaration.includes('const') ? 2 : 1] || 'functionName';
  
  return `/**
 * Brief description of what the function does
 * 
 * @param {type} paramName - Description of parameter
 * @returns {type} Description of return value
 * 
 * @example
 * const result = ${funcName}(value);
 * console.log(result);
 */`;
};

const generateComponentJSDocExample = (componentName: string): string => {
  return `/**
 * ${componentName} component description
 * 
 * @param props - Component props
 * @param props.propName - Description of prop
 * @returns JSX element
 * 
 * @example
 * <${componentName} propName="value" />
 */`;
};

const generateInterfaceDocExample = (interfaceName: string): string => {
  return `/**
 * ${interfaceName} interface description
 * 
 * Describes the shape of...
 */`;
};

const generateTypeDocExample = (typeName: string): string => {
  return `/**
 * ${typeName} type description
 * 
 * Represents...
 */`;
};

const generateFunctionExampleDoc = (functionName: string): string => {
  return `/**
 * @example
 * // Basic usage
 * const result = ${functionName}(param1, param2);
 * 
 * // Advanced usage
 * const advancedResult = ${functionName}(
 *   complexParam,
 *   { option: true }
 * );
 */`;
};