
// Core predictive metrics calculation
import { getHistoricalData, getCurrentPeriodRevenue } from './helpers.js';
import { calculateExpectedDealsAdvanced } from './probability.js';
import { predictRevenueAdvanced } from './forecasting.js';
import { generateAdvancedInsights } from './insights.js';
import { generateSmartRecommendations } from './recommendations.js';

// Calculate comprehensive predictive metrics using machine learning inspired algorithms
export const calculatePredictiveMetrics = (opportunities, period = '6-months') => {
  const historicalData = getHistoricalData(opportunities);
  const openOpportunities = opportunities.filter(opp => opp.status === 'Open');
  
  // Enhanced revenue prediction using weighted moving averages and seasonal adjustment
  const predictedRevenue = predictRevenueAdvanced(historicalData, period);
  const currentRevenue = getCurrentPeriodRevenue(opportunities);
  const revenueGrowth = currentRevenue > 0 ? ((predictedRevenue - currentRevenue) / currentRevenue) * 100 : 0;
  
  // Calculate expected deals using multiple probability models
  const expectedDeals = calculateExpectedDealsAdvanced(openOpportunities, historicalData);
  
  // Generate sophisticated insights using pattern recognition
  const insights = generateAdvancedInsights(opportunities, historicalData);
  const recommendations = generateSmartRecommendations(opportunities, historicalData);
  
  return {
    predictedRevenue,
    revenueGrowth,
    expectedDeals,
    insights,
    recommendations
  };
};
