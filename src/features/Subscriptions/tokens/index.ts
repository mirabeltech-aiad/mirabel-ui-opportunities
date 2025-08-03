
/**
 * Design Tokens Entry Point
 * Centralized export for all design tokens and utilities
 */

export {
  coreColors,
  typography,
  spacing,
  components,
  iconSystem,
  cssCustomProperties,
  default as designTokens
} from './designTokens';

// Import tokenUtils separately to avoid circular reference
import { tokenUtils } from './designTokens';

// Re-export utility functions for convenience
export const {
  getPastelColor,
  getChartColor,
  generateAvatarColor,
  getDashboardMetricColor,
  getDashboardMetricPastel,
  getIconColor,
  getBadgeVariant,
  getCardConfig,
  getButtonConfig
} = tokenUtils;

// Re-export types
export type {
  ColorToken,
  SemanticColor,
  ChartColor,
  IconType,
  BadgeVariant,
  CardSize,
  ButtonVariant,
  DashboardMetricType
} from './designTokens';
