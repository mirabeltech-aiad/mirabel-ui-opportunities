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

/**
 * Formats a single report object from the API (PascalCase) to the client-side format (camelCase).
 * @param {object} report - The report object from the API.
 * @returns {object} The formatted report object.
 */
export const formatReportData = (report) => ({
  id: report.Id,
  icon: report.Icon,
  title: report.Title,
  description: report.Description,
  tags: report.Tags,
  category: report.Category,
  routePath: report.RoutePath,
  isStarred: report.IsStarred,
  isAdmin: report.IsAdmin,
  usedID: report.UserId,
  modifiedTitle: report.ModifiedTitle,
  createdDate: report.CreatedDate,
  modifiedDate: report.ModifiedDate,
  isMaster: report.IsMaster,
  sortOrder: report.SortOrder
});

/**
 * Extracts category names from the API's category objects.
 * @param {Array<object>} categories - The array of category objects from the API.
 * @returns {Array<string>} An array of category names.
 */
export const formatCategories = (categories = []) => {
  return categories.map(cat => cat.CategoryName);
};
