
/**
 * Utility functions for formatting data in the reports feature
 */
import { TAG_COLORS, DEFAULT_TAG_COLOR } from './constants.js';

/**
 * Get the appropriate color class for a tag
 * @param {string} tag - The tag to get color for
 * @returns {string} CSS classes for tag styling
 */
export const getTagColor = (tag) => {
  return TAG_COLORS[tag] || DEFAULT_TAG_COLOR;
};

/**
 * Format report count text
 * @param {number} filtered - Number of filtered reports
 * @param {number} total - Total number of reports
 * @returns {string} Formatted count text
 */
export const formatReportCount = (filtered, total) => {
  return `${filtered} of ${total} reports`;
};
