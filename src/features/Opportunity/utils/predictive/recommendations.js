
// Smart recommendation engine
import { getDealAge, calculateQuarterlyRevenue } from './helpers.js';
import { calculateRepPerformanceMetrics } from './probability.js';

// Smart recommendation engine
export const generateSmartRecommendations = (opportunities, historicalData) => {
  const recommendations = [];
  const openOpportunities = opportunities.filter(opp => opp.status === 'Open');
  
  // Stale deal recommendations
  const staleDeals = openOpportunities.filter(opp => getDealAge(opp) > 90);
  if (staleDeals.length > 0) {
    const avgAge = staleDeals.reduce((sum, opp) => sum + getDealAge(opp), 0) / staleDeals.length;
    recommendations.push({
      action: 'Urgently Review Stale Pipeline',
      reason: `${staleDeals.length} deals averaging ${Math.round(avgAge)} days old need immediate attention.`,
      priority: 'Critical',
      impact: 'High',
      effort: 'Medium'
    });
  }
  
  // Rep coaching recommendations
  const repPerformance = calculateRepPerformanceMetrics(historicalData);
  const underperformers = Object.entries(repPerformance)
    .filter(([rep, stats]) => stats.winRate < 40 && stats.total >= 5)
    .map(([rep, stats]) => rep);
  
  if (underperformers.length > 0) {
    recommendations.push({
      action: 'Implement Targeted Sales Coaching',
      reason: `${underperformers.length} reps showing win rates below 40% need skill development.`,
      priority: 'High',
      impact: 'High',
      effort: 'High'
    });
  }
  
  // Pipeline generation recommendations
  const pipelineValue = openOpportunities.reduce((sum, opp) => sum + opp.amount, 0);
  const avgQuarterlyRevenue = calculateQuarterlyRevenue(historicalData);
  
  if (pipelineValue < avgQuarterlyRevenue * 3) {
    recommendations.push({
      action: 'Accelerate Pipeline Generation',
      reason: 'Current pipeline value is below 3x quarterly revenue target.',
      priority: 'High',
      impact: 'Critical',
      effort: 'High'
    });
  }
  
  // Deal progression recommendations
  const earlyStageDeals = openOpportunities.filter(opp => 
    ['Prospecting', 'Qualification'].includes(opp.stage)).length;
  const totalDeals = openOpportunities.length;
  
  if (totalDeals > 0 && earlyStageDeals / totalDeals > 0.6) {
    recommendations.push({
      action: 'Focus on Deal Progression',
      reason: 'Over 60% of pipeline is in early stages. Accelerate qualification and discovery.',
      priority: 'Medium',
      impact: 'High',
      effort: 'Medium'
    });
  }
  
  return recommendations;
};
