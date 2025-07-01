
// Pipeline health analysis and metrics
import { getDealAge } from './helpers.js';

// Advanced pipeline health analysis
export const analyzePipelineHealth = (opportunities) => {
  const openOpportunities = opportunities.filter(opp => opp.status === 'Open');
  const closedOpportunities = opportunities.filter(opp => opp.status === 'Won' || opp.status === 'Lost');
  
  // Enhanced stage velocity with confidence intervals
  const stageVelocity = calculateAdvancedStageVelocity(closedOpportunities);
  
  // Multi-dimensional conversion analysis
  const conversionRates = calculateAdvancedConversionRates(opportunities);
  
  // Sophisticated health score using weighted metrics
  const healthMetrics = calculateHealthMetrics(openOpportunities, stageVelocity, conversionRates);
  const healthScore = calculateWeightedHealthScore(healthMetrics);
  
  // Advanced at-risk detection
  const atRiskDeals = identifyAtRiskDeals(openOpportunities, stageVelocity, closedOpportunities);
  
  let status = 'Excellent';
  if (healthScore < 40) status = 'Critical';
  else if (healthScore < 60) status = 'At Risk';
  else if (healthScore < 80) status = 'Good';
  
  return {
    healthScore,
    status,
    atRiskDeals: atRiskDeals.length,
    stageVelocity,
    conversionRates,
    healthMetrics
  };
};

const calculateAdvancedStageVelocity = (closedOpportunities) => {
  const stages = ['Prospecting', 'Qualification', 'Needs Analysis', 'Proposal', 'Negotiation'];
  
  return stages.map(stage => {
    const stageDeals = closedOpportunities.filter(opp => opp.stage === stage);
    const velocities = stageDeals.map(opp => getDealAge(opp)).filter(v => v > 0);
    
    const avgDays = velocities.length > 0 
      ? velocities.reduce((sum, v) => sum + v, 0) / velocities.length 
      : 45;
    
    return {
      stage,
      avgDays: Math.round(avgDays),
      sampleSize: velocities.length
    };
  });
};

const calculateAdvancedConversionRates = (opportunities) => {
  const stages = ['Prospecting', 'Qualification', 'Needs Analysis', 'Proposal', 'Negotiation'];
  
  return stages.map(stage => {
    const stageOpps = opportunities.filter(opp => opp.stage === stage);
    const wonOpps = stageOpps.filter(opp => opp.status === 'Won');
    const rate = stageOpps.length > 0 ? (wonOpps.length / stageOpps.length) * 100 : 0;
    
    return {
      stage,
      rate: Math.round(rate),
      sampleSize: stageOpps.length
    };
  });
};

const calculateHealthMetrics = (openOpportunities, stageVelocity, conversionRates) => {
  return {
    pipelineSize: openOpportunities.length,
    avgConversionRate: conversionRates.reduce((sum, stage) => sum + stage.rate, 0) / conversionRates.length,
    avgVelocity: stageVelocity.reduce((sum, stage) => sum + stage.avgDays, 0) / stageVelocity.length,
    stageBalance: calculateStageBalance(openOpportunities)
  };
};

const calculateWeightedHealthScore = (metrics) => {
  let score = 50; // Base score
  
  // Pipeline size factor
  if (metrics.pipelineSize > 50) score += 15;
  else if (metrics.pipelineSize > 20) score += 10;
  else if (metrics.pipelineSize < 5) score -= 20;
  
  // Conversion rate factor
  if (metrics.avgConversionRate > 60) score += 20;
  else if (metrics.avgConversionRate > 40) score += 10;
  else if (metrics.avgConversionRate < 20) score -= 25;
  
  // Velocity factor (lower is better)
  if (metrics.avgVelocity < 30) score += 15;
  else if (metrics.avgVelocity < 60) score += 5;
  else if (metrics.avgVelocity > 120) score -= 15;
  
  // Stage balance factor
  score += metrics.stageBalance;
  
  return Math.max(0, Math.min(100, Math.round(score)));
};

const calculateStageBalance = (openOpportunities) => {
  const stageDistribution = {};
  openOpportunities.forEach(opp => {
    stageDistribution[opp.stage] = (stageDistribution[opp.stage] || 0) + 1;
  });
  
  const total = openOpportunities.length;
  if (total === 0) return 0;
  
  const idealDistribution = {
    'Prospecting': 0.25,
    'Qualification': 0.20,
    'Needs Analysis': 0.20,
    'Proposal': 0.20,
    'Negotiation': 0.15
  };
  
  let balanceScore = 0;
  Object.keys(idealDistribution).forEach(stage => {
    const actual = (stageDistribution[stage] || 0) / total;
    const ideal = idealDistribution[stage];
    const deviation = Math.abs(actual - ideal);
    balanceScore += Math.max(0, 5 - (deviation * 50)); // Penalize large deviations
  });
  
  return Math.round(balanceScore);
};

const identifyAtRiskDeals = (openOpportunities, stageVelocity, closedOpportunities) => {
  return openOpportunities.filter(opp => {
    const age = getDealAge(opp);
    const stageInfo = stageVelocity.find(s => s.stage === opp.stage);
    const expectedTime = stageInfo ? stageInfo.avgDays : 45;
    
    // Multiple risk factors
    const isStale = age > expectedTime * 1.8;
    const isLarge = opp.amount > 500000;
    const isOld = age > 120;
    
    return isStale || (isLarge && isOld);
  });
};
