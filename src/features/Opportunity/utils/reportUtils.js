
// Main entry point for report utilities - re-exports all functions for backward compatibility

// API Transformers
export {
  transformApiDataToKPIMetrics,
  transformApiDataToPipelineHealth,
  getDaysLeftInPeriod
} from './reports/apiTransformers';

// Chart Generators
export {
  generateRevenueChartFromAPI,
  generatePipelineChartFromAPI,
  generateTeamPerformanceFromAPI
} from './reports/chartGenerators';

// Period Helpers
export {
  filterOpportunitiesByPeriod,
  getPreviousPeriod
} from './reports/periodHelpers';

// Legacy/Backward Compatibility Functions
export {
  calculateKPIMetrics,
  calculatePipelineHealth,
  generateRevenueChartData,
  generatePipelineChartData,
  generateTeamPerformanceData
} from './reports/legacyHelpers';

