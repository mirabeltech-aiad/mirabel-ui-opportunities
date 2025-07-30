/**
 * @fileoverview Single Responsibility Principle Violation Detection
 * 
 * Tools for detecting SRP violations and generating suggestions
 */

import { ResponsibilityType } from './responsibilityAnalysis';

// Violation detection
export const detectViolations = (responsibilities: ResponsibilityType[]): string[] => {
  const violations: string[] = [];

  if (responsibilities.length > 3) {
    violations.push('Component has too many responsibilities');
  }

  // Specific problematic combinations
  if (
    responsibilities.includes(ResponsibilityType.DATA_FETCHING) &&
    responsibilities.includes(ResponsibilityType.UI_RENDERING) &&
    responsibilities.includes(ResponsibilityType.STATE_MANAGEMENT)
  ) {
    violations.push('Consider separating data fetching into custom hook');
  }

  if (
    responsibilities.includes(ResponsibilityType.VALIDATION) &&
    responsibilities.includes(ResponsibilityType.UI_RENDERING)
  ) {
    violations.push('Consider extracting validation logic');
  }

  if (
    responsibilities.includes(ResponsibilityType.COMPUTATION) &&
    responsibilities.includes(ResponsibilityType.UI_RENDERING)
  ) {
    violations.push('Consider moving complex computations to utilities or services');
  }

  return violations;
};

// Refactoring suggestions
export const getSuggestions = (responsibilities: ResponsibilityType[]): string[] => {
  const suggestions: string[] = [];

  if (responsibilities.includes(ResponsibilityType.DATA_FETCHING)) {
    suggestions.push('Extract data fetching into custom hook (useData, useFetch, etc.)');
  }

  if (responsibilities.includes(ResponsibilityType.VALIDATION)) {
    suggestions.push('Move validation logic to validation utilities or schemas');
  }

  if (responsibilities.includes(ResponsibilityType.COMPUTATION)) {
    suggestions.push('Extract complex calculations into utility functions or services');
  }

  if (responsibilities.includes(ResponsibilityType.SIDE_EFFECTS)) {
    suggestions.push('Consider extracting side effects into custom hooks');
  }

  return suggestions;
};