/**
 * Centralized chart color constants
 * Consistent color palette used across all charts and visualizations
 */

// Primary chart colors for data visualization
export const CHART_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#8b5cf6', // purple-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#6b7280', // gray-500
] as const;

// Specialized color sets for specific use cases
export const PIE_CHART_COLORS = CHART_COLORS.slice(0, 6);
