
/**
 * Design System Entry Point
 * Centralized export for all design tokens and utilities
 */

export { 
  colorTokens,
  spacingTokens, 
  typographyTokens,
  componentTokens,
  designUtils,
  cssVariables,
  default as designTokens
} from './designTokens';

// Re-export specific utilities for convenience
export const {
  getPastelColor,
  getChartPrimaryColor,
  getChartPastelColor,
  generateAvatarColor,
  getBadgeVariant,
  getIconColor,
  getDashboardMetricColor,
  getDashboardMetricPastel
} = require('./designTokens').designUtils;
