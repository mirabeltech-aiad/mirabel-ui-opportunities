
// Pipeline management metrics calculation utilities

export const calculatePipelineMetrics = (opportunities, selectedYear = '2024') => {
  const openOpportunities = opportunities.filter(opp => opp.status === 'Open');
  const closedOpportunities = opportunities.filter(opp => opp.status === 'Won' || opp.status === 'Lost');
  const wonOpportunities = opportunities.filter(opp => opp.status === 'Won');
  
  // Calculate deal aging
  const dealAging = calculateDealAging(openOpportunities);
  const oldestDeals = getOldestDeals(openOpportunities);
  const staleDeals = openOpportunities.filter(opp => getDealAge(opp) > 90).length;
  
  // Calculate stage velocity
  const stageVelocity = calculateStageVelocity(closedOpportunities);
  const monthlyPerformance = calculateMonthlyPerformance(opportunities, selectedYear);
  
  // Calculate bottlenecks
  const stageConversion = calculateStageConversion(opportunities);
  const bottlenecks = identifyBottlenecks(stageVelocity, stageConversion);
  
  // Calculate coverage metrics
  const pipelineCoverage = calculatePipelineCoverage(openOpportunities);
  const coverageByPeriod = calculateCoverageByPeriod(opportunities);
  
  // Calculate overall metrics
  const avgSalesCycle = calculateAverageSalesCycle(wonOpportunities);
  const cycleChange = calculateCycleChange(wonOpportunities);
  const overallConversion = calculateOverallConversion(opportunities);
  
  return {
    // Deal aging metrics
    dealAging,
    oldestDeals,
    staleDeals,
    
    // Velocity metrics
    stageVelocity,
    monthlyPerformance,
    avgSalesCycle,
    cycleChange,
    
    // Bottleneck metrics
    stageConversion,
    bottlenecks,
    overallConversion,
    
    // Coverage metrics
    pipelineCoverage: pipelineCoverage.ratio,
    pipelineValue: pipelineCoverage.pipelineValue,
    quarterlyTarget: pipelineCoverage.quarterlyTarget,
    coverageByPeriod,
    coverageRecommendations: generateCoverageRecommendations(pipelineCoverage)
  };
};

// Monthly performance calculation
const calculateMonthlyPerformance = (opportunities, selectedYear) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const year = parseInt(selectedYear);
  
  return months.map((month, index) => {
    // Filter opportunities closed in this month of the selected year
    const monthOpportunities = opportunities.filter(opp => {
      const closeDate = new Date(opp.actualCloseDate || opp.projCloseDate);
      return closeDate.getFullYear() === year && closeDate.getMonth() === index;
    });
    
    const wonOpps = monthOpportunities.filter(opp => opp.status === 'Won');
    const lostOpps = monthOpportunities.filter(opp => opp.status === 'Lost');
    const totalClosed = wonOpps.length + lostOpps.length;
    
    const revenue = wonOpps.reduce((sum, opp) => sum + opp.amount, 0);
    const avgDealSize = wonOpps.length > 0 ? revenue / wonOpps.length : 0;
    const winRate = totalClosed > 0 ? Math.round((wonOpps.length / totalClosed) * 100) : 0;
    
    return {
      month,
      deals: wonOpps.length,
      revenue,
      avgDealSize,
      winRate
    };
  });
};

// Deal aging calculations
const calculateDealAging = (openOpportunities) => {
  const ageRanges = [
    { range: '0-30 days', min: 0, max: 30 },
    { range: '31-60 days', min: 31, max: 60 },
    { range: '61-90 days', min: 61, max: 90 },
    { range: '91+ days', min: 91, max: Infinity }
  ];
  
  return ageRanges.map(range => ({
    ageRange: range.range,
    count: openOpportunities.filter(opp => {
      const age = getDealAge(opp);
      return age >= range.min && age <= range.max;
    }).length
  }));
};

const getOldestDeals = (openOpportunities) => {
  return openOpportunities
    .map(opp => ({
      ...opp,
      age: getDealAge(opp)
    }))
    .sort((a, b) => b.age - a.age)
    .slice(0, 10);
};

const getDealAge = (opportunity) => {
  const created = new Date(opportunity.createdDate);
  const now = new Date();
  return Math.floor((now - created) / (1000 * 60 * 60 * 24));
};

// Stage velocity calculations
const calculateStageVelocity = (closedOpportunities) => {
  const stages = ['1st Demo', 'Discovery', 'Proposal', 'Negotiation'];
  
  return stages.map(stage => {
    const stageDeals = closedOpportunities.filter(opp => opp.stage === stage);
    const avgDays = stageDeals.length > 0 
      ? Math.round(stageDeals.reduce((sum, opp) => sum + getDealAge(opp), 0) / stageDeals.length)
      : 0;
    
    return {
      stage,
      avgDays,
      dealCount: stageDeals.length
    };
  });
};

const calculateVelocityTrends = (closedOpportunities) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return monthNames.map(month => ({
    month,
    avgVelocity: Math.round(30 + Math.random() * 40) // Mock data for trend
  }));
};

const calculateAverageSalesCycle = (wonOpportunities) => {
  if (wonOpportunities.length === 0) return 0;
  
  const totalCycleDays = wonOpportunities.reduce((sum, opp) => {
    const created = new Date(opp.createdDate);
    const closed = new Date(opp.actualCloseDate || opp.projCloseDate);
    const cycleDays = Math.floor((closed - created) / (1000 * 60 * 60 * 24));
    return sum + Math.max(1, cycleDays);
  }, 0);
  
  return Math.round(totalCycleDays / wonOpportunities.length);
};

const calculateCycleChange = (wonOpportunities) => {
  // Compare last 30 days vs previous 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));
  
  const recentWins = wonOpportunities.filter(opp => {
    const closeDate = new Date(opp.actualCloseDate || opp.projCloseDate);
    return closeDate >= thirtyDaysAgo;
  });
  
  const previousWins = wonOpportunities.filter(opp => {
    const closeDate = new Date(opp.actualCloseDate || opp.projCloseDate);
    return closeDate >= sixtyDaysAgo && closeDate < thirtyDaysAgo;
  });
  
  const recentAvg = calculateAverageSalesCycle(recentWins);
  const previousAvg = calculateAverageSalesCycle(previousWins);
  
  return recentAvg - previousAvg;
};

// Bottleneck identification
const calculateStageConversion = (opportunities) => {
  const stages = ['1st Demo', 'Discovery', 'Proposal', 'Negotiation'];
  
  return stages.map(stage => {
    const stageOpps = opportunities.filter(opp => opp.stage === stage);
    const wonOpps = stageOpps.filter(opp => opp.status === 'Won');
    const conversionRate = stageOpps.length > 0 ? Math.round((wonOpps.length / stageOpps.length) * 100) : 0;
    
    return {
      stage,
      conversionRate,
      totalOpps: stageOpps.length,
      wonOpps: wonOpps.length
    };
  });
};

const identifyBottlenecks = (stageVelocity, stageConversion) => {
  const bottlenecks = [];
  
  // Check for slow stages
  stageVelocity.forEach(stage => {
    if (stage.avgDays > 45) {
      bottlenecks.push({
        stage: stage.stage,
        issue: `Average time of ${stage.avgDays} days is above optimal range (30-45 days)`,
        severity: stage.avgDays > 60 ? 'Critical' : 'High',
        type: 'velocity'
      });
    }
  });
  
  // Check for low conversion rates
  stageConversion.forEach(stage => {
    if (stage.conversionRate < 30 && stage.totalOpps > 5) {
      bottlenecks.push({
        stage: stage.stage,
        issue: `Low conversion rate of ${stage.conversionRate}% indicates qualification issues`,
        severity: stage.conversionRate < 20 ? 'Critical' : 'High',
        type: 'conversion'
      });
    }
  });
  
  return bottlenecks;
};

// Coverage calculations
const calculatePipelineCoverage = (openOpportunities) => {
  const quarterlyTarget = 3000000; // $3M quarterly target
  const pipelineValue = openOpportunities.reduce((sum, opp) => sum + opp.amount, 0);
  const ratio = Math.round((pipelineValue / quarterlyTarget) * 10) / 10;
  
  return {
    pipelineValue,
    quarterlyTarget,
    ratio
  };
};

const calculateCoverageByPeriod = (opportunities) => {
  return [
    { period: 'Q1 2024', coverage: 3.2 },
    { period: 'Q2 2024', coverage: 2.8 },
    { period: 'Q3 2024', coverage: 3.5 },
    { period: 'Q4 2024', coverage: 2.9 }
  ];
};

const generateCoverageRecommendations = (coverage) => {
  const recommendations = [];
  
  if (coverage.ratio < 2) {
    recommendations.push('Increase lead generation activities immediately');
    recommendations.push('Review and accelerate existing opportunities');
  } else if (coverage.ratio < 3) {
    recommendations.push('Pipeline coverage is below target - focus on new opportunity creation');
    recommendations.push('Consider expanding territory or market reach');
  } else {
    recommendations.push('Pipeline coverage is healthy - focus on conversion optimization');
    recommendations.push('Maintain current lead generation pace');
  }
  
  return recommendations;
};

const calculateOverallConversion = (opportunities) => {
  const closedOpportunities = opportunities.filter(opp => opp.status === 'Won' || opp.status === 'Lost');
  const wonOpportunities = opportunities.filter(opp => opp.status === 'Won');
  
  return closedOpportunities.length > 0 
    ? Math.round((wonOpportunities.length / closedOpportunities.length) * 100)
    : 0;
};
