// Deal probability calculation and risk assessment
import { getDealAge } from './helpers.js';

// Enhanced deal probability calculation using ensemble methods
export const calculateDealProbabilities = (opportunities) => {
  const openOpportunities = opportunities.filter(opp => opp.status === 'Open');
  const closedOpportunities = opportunities.filter(opp => opp.status === 'Won' || opp.status === 'Lost');
  
  if (closedOpportunities.length < 5) {
    return calculateBasicProbabilities(openOpportunities, closedOpportunities);
  }
  
  // Calculate probabilities using multiple factors and ensemble scoring
  const stageProbabilities = calculateAdvancedStageProbabilities(closedOpportunities);
  const repPerformance = calculateRepPerformanceMetrics(closedOpportunities);
  const seasonalFactors = calculateSeasonalFactors(closedOpportunities);
  
  return openOpportunities.map((opp, index) => {
    // Ensemble probability calculation with greater variation for testing
    let probability = stageProbabilities[opp.stage] || 50;
    
    // Apply multiple adjustment factors with enhanced variation
    probability = applyRepPerformanceAdjustment(probability, opp.assignedRep, repPerformance);
    probability = applyDealCharacteristicsAdjustment(probability, opp, closedOpportunities);
    probability = applySeasonalAdjustment(probability, opp, seasonalFactors);
    probability = applyAgeDecayAdjustment(probability, opp);
    probability = applyCompetitiveFactors(probability, opp, opportunities);
    
    // Add testing variations for more dramatic spread
    probability = applyTestingVariations(probability, opp, index);
    
    // Risk assessment using multiple indicators
    const riskScore = calculateRiskScore(opp, closedOpportunities, repPerformance);
    let riskLevel = 'Medium';
    if (riskScore < 30) riskLevel = 'Low';
    else if (riskScore > 70) riskLevel = 'High';
    
    return {
      ...opp,
      probability: Math.round(Math.max(5, Math.min(95, probability))),
      riskLevel,
      riskScore: Math.round(riskScore)
    };
  }).sort((a, b) => b.probability - a.probability);
};

// NEW: Add testing variations for more dramatic probability spread
const applyTestingVariations = (probability, opp, index) => {
  // Create more dramatic variations based on different factors
  let variation = 1.0;
  
  // Vary by deal amount (larger deals get more extreme probabilities)
  if (opp.amount > 200000) {
    variation *= Math.random() > 0.5 ? 1.4 : 0.6; // Very high or very low
  } else if (opp.amount > 100000) {
    variation *= Math.random() > 0.5 ? 1.2 : 0.8; // Moderate variation
  }
  
  // Vary by stage with more extreme ranges
  const stageVariations = {
    'Lead': 0.3 + Math.random() * 0.4, // 30-70% of base
    'Qualified': 0.4 + Math.random() * 0.6, // 40-100% of base
    '1st Demo': 0.5 + Math.random() * 0.8, // 50-130% of base
    'Discovery': 0.6 + Math.random() * 0.9, // 60-150% of base
    'Technical Review': 0.7 + Math.random() * 0.8, // 70-150% of base
    'Proposal': 0.8 + Math.random() * 0.7, // 80-150% of base
    'Negotiation': 0.9 + Math.random() * 0.6 // 90-150% of base
  };
  
  variation *= stageVariations[opp.stage] || 1.0;
  
  // Add some random extreme cases for testing
  if (index % 7 === 0) variation *= 0.4; // Very low probability
  if (index % 11 === 0) variation *= 1.6; // Very high probability
  
  // Vary by assigned rep (some reps get consistently higher/lower)
  const repVariations = {
    'Michael Scott': 1.3,
    'Jim Halpert': 1.1,
    'Pam Beesly': 0.9,
    'Dwight Schrute': 1.2,
    'Stanley Hudson': 0.7,
    'Kevin Malone': 0.6,
    'Angela Martin': 1.0,
    'Oscar Martinez': 1.1,
    'Creed Bratton': 0.8
  };
  
  variation *= repVariations[opp.assignedRep] || 1.0;
  
  return probability * variation;
};

// Enhanced stage probability calculation with confidence scoring
const calculateAdvancedStageProbabilities = (closedOpportunities) => {
  const stageStats = {};
  
  closedOpportunities.forEach(opp => {
    if (!stageStats[opp.stage]) {
      stageStats[opp.stage] = { won: 0, total: 0, amounts: [] };
    }
    stageStats[opp.stage].total++;
    stageStats[opp.stage].amounts.push(opp.amount);
    if (opp.status === 'Won') {
      stageStats[opp.stage].won++;
    }
  });
  
  const probabilities = {};
  Object.keys(stageStats).forEach(stage => {
    const stats = stageStats[stage];
    const sampleSize = stats.total;
    const winRate = sampleSize > 0 ? (stats.won / stats.total) * 100 : 50;
    
    // Adjust for sample size confidence with more dramatic base probabilities
    const confidence = Math.min(1, sampleSize / 10);
    const baseProbabilities = {
      'Lead': 20,
      'Qualified': 35,
      '1st Demo': 45,
      'Discovery': 55,
      'Technical Review': 65,
      'Proposal': 75,
      'Negotiation': 85
    };
    
    const baseProb = baseProbabilities[stage] || 50;
    const adjustedWinRate = winRate * confidence + baseProb * (1 - confidence);
    
    probabilities[stage] = Math.max(10, Math.min(90, adjustedWinRate));
  });
  
  return probabilities;
};

// Calculate representative performance metrics - NOW EXPORTED
export const calculateRepPerformanceMetrics = (closedOpportunities) => {
  const repStats = {};
  
  closedOpportunities.forEach(opp => {
    if (!opp.assignedRep) return;
    
    if (!repStats[opp.assignedRep]) {
      repStats[opp.assignedRep] = { 
        won: 0, 
        total: 0, 
        totalValue: 0, 
        wonValue: 0,
        avgDealSize: 0,
        velocity: []
      };
    }
    
    const stats = repStats[opp.assignedRep];
    stats.total++;
    stats.totalValue += opp.amount;
    
    if (opp.status === 'Won') {
      stats.won++;
      stats.wonValue += opp.amount;
      
      // Calculate deal velocity if dates are available
      if (opp.actualCloseDate && opp.createdDate) {
        const velocity = getDealAge(opp);
        stats.velocity.push(velocity);
      }
    }
  });
  
  // Calculate derived metrics
  Object.keys(repStats).forEach(rep => {
    const stats = repStats[rep];
    stats.winRate = stats.total > 0 ? (stats.won / stats.total) * 100 : 0;
    stats.avgDealSize = stats.total > 0 ? stats.totalValue / stats.total : 0;
    stats.avgVelocity = stats.velocity.length > 0 
      ? stats.velocity.reduce((sum, v) => sum + v, 0) / stats.velocity.length 
      : 90;
  });
  
  return repStats;
};

// Calculate seasonal adjustment factors
const calculateSeasonalFactors = (closedOpportunities) => {
  const monthlyStats = {};
  
  closedOpportunities.forEach(opp => {
    if (!opp.actualCloseDate) return;
    
    const month = new Date(opp.actualCloseDate).getMonth();
    if (!monthlyStats[month]) {
      monthlyStats[month] = { won: 0, total: 0 };
    }
    
    monthlyStats[month].total++;
    if (opp.status === 'Won') {
      monthlyStats[month].won++;
    }
  });
  
  // Calculate seasonal multipliers
  const seasonalFactors = {};
  const avgWinRate = Object.values(monthlyStats).reduce((sum, stats) => {
    return sum + (stats.total > 0 ? stats.won / stats.total : 0);
  }, 0) / 12;
  
  for (let month = 0; month < 12; month++) {
    const stats = monthlyStats[month];
    if (stats && stats.total > 2) {
      const monthWinRate = stats.won / stats.total;
      seasonalFactors[month] = monthWinRate / (avgWinRate || 0.3);
    } else {
      seasonalFactors[month] = 1.0; // Neutral factor for insufficient data
    }
  }
  
  return seasonalFactors;
};

// Apply sophisticated adjustment factors with enhanced variation
const applyRepPerformanceAdjustment = (probability, rep, repPerformance) => {
  if (!rep || !repPerformance[rep] || repPerformance[rep].total < 3) {
    return probability;
  }
  
  const repStats = repPerformance[rep];
  const avgWinRate = Object.values(repPerformance).reduce((sum, stats) => 
    sum + stats.winRate, 0) / Object.keys(repPerformance).length;
  
  if (avgWinRate > 0) {
    const multiplier = repStats.winRate / avgWinRate;
    // Enhanced multiplier range for more dramatic variation
    const adjustedMultiplier = 0.4 + (multiplier * 1.2); // Limit impact to 0.4-1.6x
    return probability * Math.max(0.4, Math.min(1.6, adjustedMultiplier));
  }
  
  return probability;
};

const applyDealCharacteristicsAdjustment = (probability, opp, closedOpportunities) => {
  if (closedOpportunities.length < 5) return probability;
  
  // Amount-based adjustment with more dramatic variation
  const amounts = closedOpportunities.map(o => o.amount).sort((a, b) => a - b);
  const q1 = amounts[Math.floor(amounts.length * 0.25)];
  const q3 = amounts[Math.floor(amounts.length * 0.75)];
  
  let amountMultiplier = 1.0;
  if (opp.amount > q3 * 3) amountMultiplier = 0.4; // Very large deals much harder
  else if (opp.amount > q3 * 2) amountMultiplier = 0.6; 
  else if (opp.amount > q3) amountMultiplier = 0.8;
  else if (opp.amount < q1 * 0.3) amountMultiplier = 1.4; // Very small deals much easier
  else if (opp.amount < q1 * 0.5) amountMultiplier = 1.25; 
  else if (opp.amount < q1) amountMultiplier = 1.1;
  
  return probability * amountMultiplier;
};

const applySeasonalAdjustment = (probability, opp, seasonalFactors) => {
  if (!opp.projCloseDate) return probability;
  
  const projectedMonth = new Date(opp.projCloseDate).getMonth();
  const seasonalFactor = seasonalFactors[projectedMonth] || 1.0;
  
  // Limit seasonal impact
  const limitedFactor = 0.85 + (seasonalFactor * 0.3);
  return probability * Math.max(0.85, Math.min(1.15, limitedFactor));
};

const applyAgeDecayAdjustment = (probability, opp) => {
  const age = getDealAge(opp);
  
  // More dramatic decay function for old deals
  if (age > 365) return probability * 0.2; // Very old deals almost impossible
  if (age > 270) return probability * 0.3;
  if (age > 180) return probability * (1 - (age - 180) / 365 * 0.7);
  if (age > 90) return probability * (1 - (age - 90) / 180 * 0.4);
  
  // Bigger boost for very fresh deals
  if (age < 7) return probability * 1.2;
  if (age < 14) return probability * 1.1;
  
  return probability;
};

const applyCompetitiveFactors = (probability, opp, allOpportunities) => {
  // Check for similar opportunities (potential competition)
  const similarOpps = allOpportunities.filter(other => 
    other.id !== opp.id && 
    other.companyName === opp.companyName &&
    other.status === 'Open'
  );
  
  if (similarOpps.length > 0) {
    return probability * 0.9; // Slight penalty for internal competition
  }
  
  return probability;
};

// Calculate comprehensive risk score
const calculateRiskScore = (opp, closedOpportunities, repPerformance) => {
  let riskScore = 50; // Base risk
  
  // Age risk
  const age = getDealAge(opp);
  if (age > 180) riskScore += 25;
  else if (age > 90) riskScore += 15;
  else if (age < 30) riskScore -= 10;
  
  // Amount risk
  const avgAmount = closedOpportunities.reduce((sum, o) => sum + o.amount, 0) / closedOpportunities.length;
  if (opp.amount > avgAmount * 3) riskScore += 20;
  else if (opp.amount > avgAmount * 1.5) riskScore += 10;
  
  // Rep performance risk
  if (repPerformance[opp.assignedRep]) {
    const repWinRate = repPerformance[opp.assignedRep].winRate;
    if (repWinRate < 30) riskScore += 15;
    else if (repWinRate > 70) riskScore -= 15;
  }
  
  // Stage risk
  const stageRisk = {
    'Prospecting': 40,
    'Qualification': 30,
    'Needs Analysis': 20,
    'Proposal': 15,
    'Negotiation': 10
  };
  riskScore += stageRisk[opp.stage] || 25;
  
  return Math.max(0, Math.min(100, riskScore));
};

const calculateBasicProbabilities = (openOpportunities, closedOpportunities) => {
  // More varied basic stage probabilities for testing
  const basicStageProbs = {
    'Lead': 15,
    'Qualified': 30,
    '1st Demo': 45,
    'Discovery': 55,
    'Technical Review': 65,
    'Proposal': 75,
    'Negotiation': 85
  };
  
  return openOpportunities.map((opp, index) => ({
    ...opp,
    // Add variation even to basic probabilities
    probability: Math.round((basicStageProbs[opp.stage] || 40) * (0.5 + Math.random())),
    riskLevel: Math.random() > 0.6 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low',
    riskScore: 20 + Math.random() * 60
  })).sort((a, b) => b.probability - a.probability);
};

export const calculateExpectedDealsAdvanced = (openOpportunities, historicalData) => {
  if (historicalData.length < 5) {
    return openOpportunities.length * 0.3; // Basic fallback
  }
  
  const probabilities = calculateDealProbabilities([...openOpportunities, ...historicalData]);
  return probabilities.reduce((total, opp) => {
    return total + (opp.probability / 100);
  }, 0);
};
