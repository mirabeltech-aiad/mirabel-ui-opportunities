
/**
 * Utility functions for improvement management and formatting
 * 
 * This module provides helper functions for displaying and managing
 * improvement items in the admin interface, including date formatting,
 * priority styling, and sorting functionality.
 */

/**
 * Format a date string for display in the UI
 * 
 * Converts ISO date strings or Date objects into a user-friendly format
 * suitable for displaying in improvement cards and lists.
 * 
 * @param {string|Date} dateString - Date in ISO format or Date object
 * @returns {string} Formatted date string (e.g., "Jan 20, 2024, 2:30 PM")
 * 
 * @example
 * formatDate('2024-01-20T14:30:00Z') // "Jan 20, 2024, 2:30 PM"
 * formatDate(new Date()) // "Dec 15, 2024, 10:45 AM"
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get CSS classes for priority badge styling
 * 
 * Returns appropriate Tailwind CSS classes for styling priority badges
 * based on the priority level. Provides consistent color coding across the UI.
 * 
 * @param {'high'|'medium'|'low'|'nice-to-have'} priority - Priority level
 * @returns {string} CSS classes for background and text color
 * 
 * @example
 * getPriorityColor('high') // "bg-red-100 text-red-700"
 * getPriorityColor('low') // "bg-green-100 text-green-700"
 */
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': 
      return 'bg-red-100 text-red-700';
    case 'medium': 
      return 'bg-yellow-100 text-yellow-700';
    case 'low': 
      return 'bg-green-100 text-green-700';
    case 'nice-to-have': 
      return 'bg-blue-100 text-blue-700';
    default: 
      return 'bg-gray-100 text-gray-700';
  }
};

/**
 * Format priority value for display
 * 
 * Converts priority enum values into user-friendly labels
 * for display in the UI components.
 * 
 * @param {'high'|'medium'|'low'|'nice-to-have'} priority - Priority level
 * @returns {string} Human-readable priority label
 * 
 * @example
 * formatPriorityLabel('high') // "High Priority"
 * formatPriorityLabel('nice-to-have') // "Nice to Have"
 */
export const formatPriorityLabel = (priority) => {
  switch (priority) {
    case 'high': 
      return 'High Priority';
    case 'medium': 
      return 'Medium Priority';
    case 'low': 
      return 'Low Priority';
    case 'nice-to-have': 
      return 'Nice to Have';
    default: 
      return priority;
  }
};

/**
 * Sort improvements by priority and creation date
 * 
 * Implements a two-level sorting algorithm:
 * 1. Primary sort by priority (high -> medium -> low -> nice-to-have)
 * 2. Secondary sort by creation date (newest first within same priority)
 * 
 * This ensures high priority items always appear first, with recent
 * items appearing before older ones within the same priority level.
 * 
 * @param {Array} improvements - Array of improvement objects
 * @param {Object} improvements[].priority - Priority level of the improvement
 * @param {string} improvements[].createdAt - ISO date string of creation
 * @returns {Array} Sorted array of improvements
 * 
 * @example
 * const improvements = [
 *   { id: 1, priority: 'low', createdAt: '2024-01-01T00:00:00Z' },
 *   { id: 2, priority: 'high', createdAt: '2024-01-02T00:00:00Z' },
 *   { id: 3, priority: 'high', createdAt: '2024-01-01T00:00:00Z' }
 * ];
 * 
 * const sorted = sortImprovements(improvements);
 * // Result: [id: 2, id: 3, id: 1] (high priority first, then by date)
 */
export const sortImprovements = (improvements) => {
  return improvements.sort((a, b) => {
    // Define priority weights for sorting (higher number = higher priority)
    const priorityOrder = { 
      high: 3, 
      medium: 2, 
      low: 1, 
      'nice-to-have': 0 
    };
    
    // Primary sort: by priority (high to low)
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    
    // Secondary sort: by creation date (newest first) when priorities are equal
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};
