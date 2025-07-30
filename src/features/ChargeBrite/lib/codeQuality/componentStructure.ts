/**
 * @fileoverview Component Structure Optimization
 * 
 * Standards for component organization and structure
 */

// Component file structure template
export const COMPONENT_TEMPLATE = `
// Imports (organized by import standards)
import React from 'react';
import { ComponentProps } from 'react';

// Component types
interface ComponentNameProps {
  // Props definition
}

// Main component
export const ComponentName: React.FC<ComponentNameProps> = ({
  // Destructured props
}) => {
  // Hooks (in order of dependency)
  
  // Event handlers
  
  // Computed values
  
  // Effects
  
  // Render helpers
  
  // Main render
  return (
    // JSX
  );
};

// Sub-components (if any)

// Default export (if needed)
export default ComponentName;
`.trim();

// Component organization rules
export const COMPONENT_RULES = {
  // Single component per file (exceptions for small sub-components)
  singleComponent: true,
  // Props interface should be defined before component
  propsFirst: true,
  // Hooks should be called at the top of component
  hooksFirst: true,
  // Event handlers should be grouped together
  groupHandlers: true,
  // Effects should come after handlers
  effectsLast: true,
  // Return statement should be at the end
  returnLast: true,
} as const;

// Hook organization order
export const HOOK_ORDER = [
  'useState',
  'useReducer',
  'useRef',
  'useMemo',
  'useCallback',
  'useEffect',
  'custom hooks',
] as const;

// Component size guidelines
export const SIZE_GUIDELINES = {
  // Maximum lines per component
  maxLines: 200,
  // Maximum props per component
  maxProps: 10,
  // Maximum hooks per component
  maxHooks: 8,
  // Maximum nested levels
  maxNesting: 4,
} as const;

// Component complexity metrics
export const calculateComplexity = (component: string) => {
  const lines = component.split('\n').length;
  const hooks = (component.match(/use[A-Z]\w+/g) || []).length;
  const conditionals = (component.match(/\b(if|switch|&&|\?)\b/g) || []).length;
  const loops = (component.match(/\b(for|while|map|filter|reduce)\b/g) || []).length;

  return {
    lines,
    hooks,
    conditionals,
    loops,
    complexity: conditionals + loops + (hooks * 0.5),
  };
};

// Refactoring suggestions
export const getRefactoringSuggestions = (metrics: ReturnType<typeof calculateComplexity>) => {
  const suggestions: string[] = [];

  if (metrics.lines > SIZE_GUIDELINES.maxLines) {
    suggestions.push('Consider breaking this component into smaller components');
  }

  if (metrics.hooks > SIZE_GUIDELINES.maxHooks) {
    suggestions.push('Consider using custom hooks to group related state logic');
  }

  if (metrics.complexity > 15) {
    suggestions.push('High complexity detected - consider simplifying logic');
  }

  if (metrics.conditionals > 5) {
    suggestions.push('Consider using a state machine or lookup table for complex conditionals');
  }

  return suggestions;
};