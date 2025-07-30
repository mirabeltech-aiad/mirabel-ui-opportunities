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

// Extended palette for larger datasets
export const EXTENDED_CHART_COLORS = [
  ...CHART_COLORS,
  '#f97316', // orange-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#a855f7', // violet-500
] as const;

// Specialized color sets for specific use cases
export const PIE_CHART_COLORS = CHART_COLORS.slice(0, 6);
export const TOUCHPOINT_COLORS = CHART_COLORS.slice(0, 6);
export const REASON_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#06b6d4', '#8b5cf6'];

// Status-based colors
export const STATUS_COLORS = {
  success: '#10b981', // green
  warning: '#f59e0b', // amber
  error: '#ef4444',   // red
  info: '#3b82f6',    // blue
  neutral: '#6b7280', // gray
} as const;