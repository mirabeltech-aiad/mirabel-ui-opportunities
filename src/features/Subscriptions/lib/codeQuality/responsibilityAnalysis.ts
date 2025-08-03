/**
 * @fileoverview Component Responsibility Analysis
 * 
 * Tools for analyzing what responsibilities a component has
 */

// Component responsibility types
export enum ResponsibilityType {
  UI_RENDERING = 'ui_rendering',
  STATE_MANAGEMENT = 'state_management',
  DATA_FETCHING = 'data_fetching',
  EVENT_HANDLING = 'event_handling',
  VALIDATION = 'validation',
  COMPUTATION = 'computation',
  SIDE_EFFECTS = 'side_effects',
}

// Component analysis
export const analyzeComponentResponsibilities = (componentCode: string): ResponsibilityType[] => {
  const responsibilities = new Set<ResponsibilityType>();

  // Check for UI rendering
  if (componentCode.includes('return (') || componentCode.includes('jsx')) {
    responsibilities.add(ResponsibilityType.UI_RENDERING);
  }

  // Check for state management
  if (componentCode.includes('useState') || componentCode.includes('useReducer')) {
    responsibilities.add(ResponsibilityType.STATE_MANAGEMENT);
  }

  // Check for data fetching
  if (componentCode.includes('fetch') || componentCode.includes('axios') || componentCode.includes('useQuery')) {
    responsibilities.add(ResponsibilityType.DATA_FETCHING);
  }

  // Check for event handling
  if (componentCode.includes('onClick') || componentCode.includes('onChange') || componentCode.includes('onSubmit')) {
    responsibilities.add(ResponsibilityType.EVENT_HANDLING);
  }

  // Check for validation
  if (componentCode.includes('validate') || componentCode.includes('schema') || componentCode.includes('error')) {
    responsibilities.add(ResponsibilityType.VALIDATION);
  }

  // Check for computation
  if (componentCode.includes('calculate') || componentCode.includes('compute') || componentCode.includes('useMemo')) {
    responsibilities.add(ResponsibilityType.COMPUTATION);
  }

  // Check for side effects
  if (componentCode.includes('useEffect') || componentCode.includes('localStorage') || componentCode.includes('document.')) {
    responsibilities.add(ResponsibilityType.SIDE_EFFECTS);
  }

  return Array.from(responsibilities);
};