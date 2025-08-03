/**
 * @fileoverview Naming Conventions Audit and Standards
 * 
 * Enforces consistent naming patterns across the application
 */

// Component naming patterns
export const COMPONENT_PATTERNS = {
  // PascalCase for components
  component: /^[A-Z][a-zA-Z0-9]*$/,
  // kebab-case for files
  file: /^[a-z][a-z0-9]*(-[a-z0-9]+)*\.(tsx?|jsx?)$/,
  // camelCase for props
  props: /^[a-z][a-zA-Z0-9]*$/,
} as const;

// Hook naming patterns
export const HOOK_PATTERNS = {
  // Must start with 'use'
  hook: /^use[A-Z][a-zA-Z0-9]*$/,
  // Hook files should match hook name
  hookFile: /^use[A-Z][a-zA-Z0-9]*\.(ts|tsx)$/,
} as const;

// Service naming patterns
export const SERVICE_PATTERNS = {
  // Service classes should end with 'Service'
  serviceClass: /^[A-Z][a-zA-Z0-9]*Service$/,
  // Service methods should be camelCase
  serviceMethod: /^[a-z][a-zA-Z0-9]*$/,
  // Service files should end with 'Service'
  serviceFile: /^[a-z][a-zA-Z0-9]*Service\.(ts|tsx)$/,
} as const;

// Context naming patterns
export const CONTEXT_PATTERNS = {
  // Context should end with 'Context'
  context: /^[A-Z][a-zA-Z0-9]*Context$/,
  // Provider should end with 'Provider'
  provider: /^[A-Z][a-zA-Z0-9]*Provider$/,
  // Hook should start with 'use' and match context name
  hook: /^use[A-Z][a-zA-Z0-9]*$/,
} as const;

// Type naming patterns
export const TYPE_PATTERNS = {
  // Interfaces should be PascalCase
  interface: /^[A-Z][a-zA-Z0-9]*$/,
  // Types should be PascalCase
  type: /^[A-Z][a-zA-Z0-9]*$/,
  // Props interfaces should end with 'Props'
  props: /^[A-Z][a-zA-Z0-9]*Props$/,
  // Config interfaces should end with 'Config'
  config: /^[A-Z][a-zA-Z0-9]*Config$/,
} as const;

// Validation functions
export const validateNaming = {
  component: (name: string) => COMPONENT_PATTERNS.component.test(name),
  hook: (name: string) => HOOK_PATTERNS.hook.test(name),
  service: (name: string) => SERVICE_PATTERNS.serviceClass.test(name),
  context: (name: string) => CONTEXT_PATTERNS.context.test(name),
  interface: (name: string) => TYPE_PATTERNS.interface.test(name),
} as const;

// Naming suggestions
export const generateSuggestions = {
  componentName: (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-([a-z])/g, (_, char) => char.toUpperCase());
  },
  hookName: (name: string) => {
    const baseName = name.replace(/^use/, '');
    return `use${baseName.charAt(0).toUpperCase()}${baseName.slice(1)}`;
  },
  serviceName: (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1) + 'Service';
  },
  contextName: (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1) + 'Context';
  },
} as const;