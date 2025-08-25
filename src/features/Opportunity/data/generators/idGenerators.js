
// Extracted for clarity - ID generation utilities
// WARNING: No unit tests exist for these utilities. Consider adding tests.

/**
 * Generates unique opportunity ID with timestamp and random components
 * @returns {string} Formatted opportunity ID
 */
export const generateOpportunityId = () => {
  const prefix = 'OPP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Generates proposal ID with current year and random component
 * @returns {string} Formatted proposal ID
 */
export const generateProposalId = () => {
  const prefix = 'PROP';
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `${prefix}-${year}-${random}`;
};
