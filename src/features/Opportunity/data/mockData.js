
// Refactored for maintainability - Main data aggregation module
// Preserves all existing exports and functionality
import { originalMockOpportunities } from './opportunities/baseOpportunities.js';
import { additionalWonOpportunities } from './opportunities/wonOpportunities.js';
import { comprehensiveOpportunities } from './opportunities/comprehensiveOpportunities.js';
import { lostOpportunities } from './opportunities/lostOpportunities.js';
import { mockCompanies } from './companies/baseCompanies.js';

// Combine all opportunities including the new comprehensive ones and lost opportunities
// Preserves exact same data structure and behavior
export const mockOpportunities = [
  ...originalMockOpportunities,
  ...additionalWonOpportunities,
  ...comprehensiveOpportunities,
  ...lostOpportunities
];

// Re-export companies to maintain existing API
export { mockCompanies };
