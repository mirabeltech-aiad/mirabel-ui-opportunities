
// API data transformation utilities for reports
import benchmarksService from '@/services/benchmarksService';

// ===== EXECUTIVE DASHBOARD STORED PROCEDURE TRANSFORMERS =====

/**
 * Transform SP Result Set 1 to KPI metrics
 * Maps: TotIds, Won, Lost, Open, WinTotal, TotOppAmt, WinRatio, AvgDealSize, etc.
 */
export const transformExecutiveDashboardToKPIMetrics = (kpiMetricsResultSet, period = "this-quarter") => {
  console.log('Transforming Executive Dashboard KPI Metrics:', kpiMetricsResultSet);
  
  if (!kpiMetricsResultSet || typeof kpiMetricsResultSet !== 'object') {
    console.warn('Invalid KPI metrics result set from stored procedure');
    return getEmptyKPIMetrics(period);
  }

  // Extract values from SP result set with enhanced field mapping
  const totalRevenue = sanitizeNumericValue(
    kpiMetricsResultSet.WinTotal || 
    kpiMetricsResultSet.TotalRevenue ||
    kpiMetricsResultSet.Revenue
  );
  
  const totalDeals = sanitizeNumericValue(
    kpiMetricsResultSet.TotIds || 
    kpiMetricsResultSet.TotalOpportunities ||
    kpiMetricsResultSet.TotalDeals
  );
  
  const wonDeals = sanitizeNumericValue(
    kpiMetricsResultSet.Won || 
    kpiMetricsResultSet.WonDeals ||
    kpiMetricsResultSet.ClosedWon
  );
  
  const lostDeals = sanitizeNumericValue(
    kpiMetricsResultSet.Lost || 
    kpiMetricsResultSet.LostDeals ||
    kpiMetricsResultSet.ClosedLost
  );
  
  const openDeals = sanitizeNumericValue(
    kpiMetricsResultSet.Open || 
    kpiMetricsResultSet.OpenDeals ||
    kpiMetricsResultSet.ActiveDeals
  );
  
  const pipelineValue = sanitizeNumericValue(
    kpiMetricsResultSet.TotOppAmt || 
    kpiMetricsResultSet.PipelineValue ||
    kpiMetricsResultSet.TotalAmount
  );
  
  const winRate = sanitizeNumericValue(
    kpiMetricsResultSet.WinRatio || 
    kpiMetricsResultSet.WinRate ||
    kpiMetricsResultSet.ConversionRate
  );

  const avgDealSize = sanitizeNumericValue(
    kpiMetricsResultSet.AvgDealSize ||
    (wonDeals > 0 ? totalRevenue / wonDeals : 0)
  );

  // Calculate derived metrics
  const quota = getQuotaForPeriod(period);
  const quotaProgress = quota > 0 ? (totalRevenue / quota) * 100 : 0;
  const daysLeft = getDaysLeftInPeriod(period);
  
  // Extract additional metrics from SP
  const avgSalesCycle = sanitizeNumericValue(kpiMetricsResultSet.AvgSalesCycle) || estimateSalesCycle(period);
  const revenueGrowth = sanitizeNumericValue(kpiMetricsResultSet.RevenueGrowth) || 0;
  const activeReps = sanitizeNumericValue(kpiMetricsResultSet.ActiveReps) || 0;
  const avgRevenuePerRep = activeReps > 0 ? totalRevenue / activeReps : 0;

  return {
    totalRevenue,
    revenueGrowth,
    pipelineValue,
    dealsWon: wonDeals,
    dealGrowth: sanitizeNumericValue(kpiMetricsResultSet.DealGrowth) || 0,
    winRate,
    totalDeals: wonDeals + lostDeals,
    avgDealSize,
    salesCycle: avgSalesCycle,
    cycleChange: sanitizeNumericValue(kpiMetricsResultSet.CycleChange) || 0,
    activeReps,
    avgRevenuePerRep,
    quota,
    quotaProgress,
    daysLeft,
    openDeals,
    // Additional SP metrics
    totalProposals: sanitizeNumericValue(kpiMetricsResultSet.TotalProposals) || 0,
    activeProposals: sanitizeNumericValue(kpiMetricsResultSet.ActiveProposals) || 0,
    approvedProposals: sanitizeNumericValue(kpiMetricsResultSet.ApprovedProposals) || 0,
    sentProposals: sanitizeNumericValue(kpiMetricsResultSet.SentProposals) || 0,
    source: 'uspCDCSync_ExecutiveDashboardGet'
  };
};

/**
 * Transform SP Result Set 2 to pipeline health
 * Maps: Stage, Opportunities, Value, AvgProbability, AvgDaysInStage
 */
export const transformExecutiveDashboardToPipelineHealth = (pipelineHealthResultSet) => {
  console.log('Transforming Executive Dashboard Pipeline Health:', pipelineHealthResultSet);
  
  if (!Array.isArray(pipelineHealthResultSet) || pipelineHealthResultSet.length === 0) {
    console.warn('Invalid pipeline health result set from stored procedure');
    return {
      score: 0,
      status: "No Data",
      pipelineValue: 0,
      totalDeals: 0,
      averageDealSize: 0,
      healthScore: 0,
      stages: [],
      deals: { total: 0, qualified: 0, proposal: 0, negotiation: 0 }
    };
  }

  // Calculate totals from all stages
  const totalDeals = pipelineHealthResultSet.reduce((sum, stage) => 
    sum + sanitizeNumericValue(stage.Opportunities), 0
  );
  
  const totalValue = pipelineHealthResultSet.reduce((sum, stage) => 
    sum + sanitizeNumericValue(stage.Value), 0
  );
  
  const avgDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;
  
  // Calculate weighted health score based on stage distribution and probabilities
  const weightedHealth = pipelineHealthResultSet.reduce((sum, stage) => {
    const stageWeight = sanitizeNumericValue(stage.AvgProbability) || 50;
    const stageValue = sanitizeNumericValue(stage.Value) || 0;
    return sum + (stageWeight * stageValue);
  }, 0);
  
  const healthScore = totalValue > 0 ? Math.min(95, Math.max(15, (weightedHealth / totalValue))) : 0;
  
  // Map stages for detailed analysis
  const stageDetails = pipelineHealthResultSet.map(stage => ({
    stage: stage.Stage || 'Unknown',
    opportunities: sanitizeNumericValue(stage.Opportunities),
    value: sanitizeNumericValue(stage.Value),
    avgProbability: sanitizeNumericValue(stage.AvgProbability),
    avgDaysInStage: sanitizeNumericValue(stage.AvgDaysInStage)
  }));

  // Calculate specific stage counts for dashboard
  const proposalStage = pipelineHealthResultSet.find(s => 
    (s.Stage || '').toLowerCase().includes('proposal')
  );
  const negotiationStage = pipelineHealthResultSet.find(s => 
    (s.Stage || '').toLowerCase().includes('negotiation')
  );
  
  return {
    score: healthScore,
    status: healthScore >= 80 ? "Healthy" : healthScore >= 60 ? "Good" : "At Risk",
    pipelineValue: totalValue,
    totalDeals,
    averageDealSize: avgDealSize,
    healthScore,
    stages: stageDetails,
    deals: {
      total: totalDeals,
      qualified: Math.floor(totalDeals * 0.7), // Estimated from SP data
      proposal: sanitizeNumericValue(proposalStage?.Opportunities) || 0,
      negotiation: sanitizeNumericValue(negotiationStage?.Opportunities) || 0
    },
    source: 'uspCDCSync_ExecutiveDashboardGet'
  };
};

/**
 * Transform SP Result Set 3 to revenue chart data  
 * Maps: Year, Month, MonthName, Revenue, Pipeline, WonDeals, OpenDeals
 */
export const transformExecutiveDashboardToRevenueData = (revenueTrendsResultSet) => {
  console.log('Transforming Executive Dashboard Revenue Trends:', revenueTrendsResultSet);
  
  if (!Array.isArray(revenueTrendsResultSet) || revenueTrendsResultSet.length === 0) {
    console.warn('Invalid revenue trends result set from stored procedure');
    return [];
  }

  return revenueTrendsResultSet.map(item => ({
    month: item.MonthName || `${item.Year}-${String(item.Month).padStart(2, '0')}`,
    revenue: sanitizeNumericValue(item.Revenue),
    forecast: sanitizeNumericValue(item.Pipeline) || (sanitizeNumericValue(item.Revenue) * 1.15),
    wonDeals: sanitizeNumericValue(item.WonDeals),
    openDeals: sanitizeNumericValue(item.OpenDeals),
    year: sanitizeNumericValue(item.Year),
    monthNumber: sanitizeNumericValue(item.Month)
  })).sort((a, b) => {
    // Sort by year then month
    if (a.year !== b.year) return a.year - b.year;
    return a.monthNumber - b.monthNumber;
  });
};

/**
 * Transform SP Result Set 4 to team performance data
 * Maps: RepName, TotalOpportunities, Revenue, Pipeline, WinRate, AvgDealSize, QuotaAttainment
 */
export const transformExecutiveDashboardToTeamData = (teamPerformanceResultSet) => {
  console.log('Transforming Executive Dashboard Team Performance:', teamPerformanceResultSet);
  
  if (!Array.isArray(teamPerformanceResultSet) || teamPerformanceResultSet.length === 0) {
    console.warn('Invalid team performance result set from stored procedure');
    return [];
  }

  return teamPerformanceResultSet
    .filter(rep => rep.RepName && rep.RepName.trim() !== '')
    .map((rep, index) => {
      const revenue = sanitizeNumericValue(rep.Revenue);
      const totalOpportunities = sanitizeNumericValue(rep.TotalOpportunities);
      const wonDeals = sanitizeNumericValue(rep.WonDeals) || Math.floor(totalOpportunities * 0.3);
      const winRate = sanitizeNumericValue(rep.WinRate) || 
        (totalOpportunities > 0 ? (wonDeals / totalOpportunities) * 100 : 0);
      const avgDealSize = sanitizeNumericValue(rep.AvgDealSize) || 
        (wonDeals > 0 ? revenue / wonDeals : 0);
      const quota = sanitizeNumericValue(rep.Quota) || (1500000 + (index * 150000));
      const quotaProgress = sanitizeNumericValue(rep.QuotaAttainment) || 
        (quota > 0 ? (revenue / quota) * 100 : 0);
      
      let status = "On Track";
      if (quotaProgress >= 95) status = "Ahead";
      else if (quotaProgress < 70) status = "At Risk";
      
      return {
        id: index + 1,
        name: rep.RepName,
        initials: rep.RepName.split(' ').map(n => n[0]).join('').toUpperCase(),
        deals: wonDeals,
        revenue,
        quota,
        winRate: Math.round(winRate * 10) / 10,
        avgDealSize: Math.round(avgDealSize),
        status,
        pipeline: sanitizeNumericValue(rep.Pipeline),
        totalOpportunities
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 15);
};

/**
 * Transform SP Result Set 5 to product performance data
 * Maps: Product, Opportunities, Revenue, WonDeals, WinRate
 */
export const transformExecutiveDashboardToProductData = (productPerformanceResultSet) => {
  console.log('Transforming Executive Dashboard Product Performance:', productPerformanceResultSet);
  
  if (!Array.isArray(productPerformanceResultSet)) {
    return [];
  }

  return productPerformanceResultSet.map(product => ({
    product: product.Product || 'Unknown Product',
    opportunities: sanitizeNumericValue(product.Opportunities),
    revenue: sanitizeNumericValue(product.Revenue),
    wonDeals: sanitizeNumericValue(product.WonDeals),
    winRate: sanitizeNumericValue(product.WinRate),
    avgDealSize: sanitizeNumericValue(product.AvgDealSize)
  }));
};

/**
 * Transform SP Result Set 6 to business unit performance data
 * Maps: BusinessUnit, Opportunities, Revenue, Pipeline, WinRate, ActiveReps
 */
export const transformExecutiveDashboardToBusinessUnitData = (businessUnitPerformanceResultSet) => {
  console.log('Transforming Executive Dashboard Business Unit Performance:', businessUnitPerformanceResultSet);
  
  if (!Array.isArray(businessUnitPerformanceResultSet)) {
    return [];
  }

  return businessUnitPerformanceResultSet.map(unit => ({
    businessUnit: unit.BusinessUnit || 'Unknown Unit',
    opportunities: sanitizeNumericValue(unit.Opportunities),
    revenue: sanitizeNumericValue(unit.Revenue),
    pipeline: sanitizeNumericValue(unit.Pipeline),
    winRate: sanitizeNumericValue(unit.WinRate),
    activeReps: sanitizeNumericValue(unit.ActiveReps),
    avgRevenuePerRep: sanitizeNumericValue(unit.ActiveReps) > 0 ? 
      sanitizeNumericValue(unit.Revenue) / sanitizeNumericValue(unit.ActiveReps) : 0
  }));
};

// Helper function for numeric sanitization
function sanitizeNumericValue(value, defaultValue = 0) {
  const numValue = Number(value);
  return isNaN(numValue) ? defaultValue : numValue;
}

// Enhanced API response validation with detailed structure checking
const validateApiResponse = (apiData) => {
  if (!apiData) {
    console.warn('API Data is null or undefined');
    return { isValid: false, message: 'No API data received', type: 'no_data' };
  }
  
  // Check for various possible API response structures
  const hasOpportunities = apiData.opportunities || apiData.content?.Data?.Opportunities || apiData.content?.Data?.OpportunityResult;
  const hasProposals = apiData.proposals || apiData.content?.Data?.Proposals || apiData.content?.Data?.ProposalResult;
  
  if (!hasOpportunities && !hasProposals) {
    console.warn('API Data missing both opportunities and proposals data structures');
    console.log('Available data keys:', Object.keys(apiData));
    return { isValid: false, message: 'Invalid API response - missing expected data structures', type: 'structure_error' };
  }
  
  return { isValid: true };
};

// Transform API OpportunityResult to KPI metrics
export const transformApiDataToKPIMetrics = (apiData, period = "this-quarter") => {
  console.log('API Data for KPI transformation:', apiData);
  
  // Validate API response
  const validation = validateApiResponse(apiData);
  if (!validation.isValid) {
    console.error('API validation failed:', validation.message);
    return getEmptyKPIMetrics(period);
  }
  
  // Enhanced handling of multiple possible response structures
  const opportunityResults = 
    apiData.opportunities?.content?.Data?.OpportunityResult || 
    apiData.opportunities?.content?.Data?.Table ||
    apiData.opportunities?.Data?.OpportunityResult ||
    apiData.opportunities?.Data?.Table ||
    apiData.opportunities?.OpportunityResult || 
    apiData.content?.Data?.OpportunityResult ||
    apiData.content?.Data?.Table ||
    [];
    
  const proposalResults = 
    apiData.proposals?.content?.Data?.OpportunityResult || 
    apiData.proposals?.content?.Data?.Table ||
    apiData.proposals?.Data?.OpportunityResult ||
    apiData.proposals?.Data?.Table ||
    apiData.proposals?.OpportunityResult || 
    apiData.content?.Data?.ProposalResult ||
    [];
  
  const opportunityResult = Array.isArray(opportunityResults) ? opportunityResults[0] || {} : opportunityResults;
  const proposalResult = Array.isArray(proposalResults) ? proposalResults[0] || {} : proposalResults;
  
  console.log('Opportunity Result:', opportunityResult);
  console.log('Proposal Result:', proposalResult);
  
  // Enhanced field extraction with better fallback handling and validation
  const totalRevenue = sanitizeNumericValue(
    opportunityResult.WinTotal || 
    opportunityResult.WonTotal || 
    opportunityResult.Revenue ||
    opportunityResult.TotalRevenue ||
    opportunityResult.WonValue
  );
  
  const totalDeals = sanitizeNumericValue(
    opportunityResult.TotIds || 
    opportunityResult.TotalIds || 
    opportunityResult.Total ||
    opportunityResult.TotalDeals ||
    opportunityResult.Count
  );
  
  const wonDeals = sanitizeNumericValue(
    opportunityResult.Won || 
    opportunityResult.WonDeals ||
    opportunityResult.WonCount ||
    opportunityResult.ClosedWon
  );
  
  const lostDeals = sanitizeNumericValue(
    opportunityResult.Lost || 
    opportunityResult.LostDeals ||
    opportunityResult.LostCount ||
    opportunityResult.ClosedLost
  );
  
  const openDeals = sanitizeNumericValue(
    opportunityResult.Open || 
    opportunityResult.OpenDeals ||
    opportunityResult.OpenCount ||
    opportunityResult.ActiveDeals
  );
  
  const pipelineValue = sanitizeNumericValue(
    opportunityResult.TotOppAmt || 
    opportunityResult.TotalAmount || 
    opportunityResult.PipelineValue ||
    opportunityResult.OpenValue ||
    opportunityResult.ActiveValue
  );
  
  const winRate = sanitizeNumericValue(
    opportunityResult.WinRatio || 
    opportunityResult.WinRate ||
    opportunityResult.ConversionRate
  );

  // Import sanitizeNumericValue from validation helpers
  function sanitizeNumericValue(value, defaultValue = 0) {
    const numValue = Number(value);
    return isNaN(numValue) ? defaultValue : numValue;
  }
  
  // Proposal metrics (with proper field mapping)
  const totalProposals = Number(proposalResult.Proposals) || Number(opportunityResult.Proposals) || 0;
  const activeProposals = Number(proposalResult.ActiveProposals) || Number(opportunityResult.ActiveProposals) || 0;
  const approvedProposals = Number(proposalResult.ApprovedProposals) || Number(opportunityResult.ApprovedProposals) || 0;
  const sentProposals = Number(proposalResult.SentProposals) || Number(opportunityResult.SentProposals) || 0;
  
  // Calculate derived metrics without rounding
  const avgDealSize = wonDeals > 0 ? totalRevenue / wonDeals : 0;
  const quota = getQuotaForPeriod(period);
  const quotaProgress = quota > 0 ? (totalRevenue / quota) * 100 : 0;
  
  // Estimate sales cycle (would need historical data for accurate calculation)
  const avgSalesCycle = estimateSalesCycle(period);
  
  // Calculate revenue growth (placeholder - would need historical comparison)
  const revenueGrowth = calculateRevenueGrowthFromAPI(apiData, period);
  
  // Days left in period
  const daysLeft = getDaysLeftInPeriod(period);
  
  // Active reps count (from opportunities data)
  const opportunities = apiData.opportunities?.content?.Data?.Opportunities || [];
  const activeReps = [...new Set(opportunities.map(opp => opp.AssignedTo).filter(rep => rep))].length;
  const avgRevenuePerRep = activeReps > 0 ? totalRevenue / activeReps : 0;
  
  return {
    totalRevenue: totalRevenue,
    revenueGrowth: revenueGrowth,
    pipelineValue: pipelineValue,
    dealsWon: wonDeals,
    dealGrowth: 0, // Would need historical data
    winRate: winRate,
    totalDeals: wonDeals + lostDeals,
    avgDealSize: avgDealSize,
    salesCycle: avgSalesCycle,
    cycleChange: 0, // Would need historical data
    activeReps,
    avgRevenuePerRep: avgRevenuePerRep,
    quota,
    quotaProgress: quotaProgress,
    daysLeft,
    // Additional proposal metrics
    totalProposals,
    activeProposals,
    approvedProposals,
    sentProposals,
    openDeals
  };
};

// Transform API data to pipeline health metrics
export const transformApiDataToPipelineHealth = (apiData) => {
  const opportunityResult = apiData.opportunities?.content?.Data?.OpportunityResult?.[0] || {};
  const opportunities = apiData.opportunities?.content?.Data?.Opportunities || [];
  
  // Calculate pipeline health score based on stage distribution
  const stageDistribution = opportunities.reduce((acc, opp) => {
    const stage = opp.OppStageDetails?.Stage || 'Unknown';
    if (!acc[stage]) acc[stage] = { count: 0, value: 0 };
    acc[stage].count++;
    acc[stage].value += opp.Amount || 0;
    return acc;
  }, {});
  
  const openDeals = opportunityResult.Open || 0;
  const totalPipelineValue = opportunityResult.TotOppAmt || 0;
  const avgDealSize = openDeals > 0 ? totalPipelineValue / openDeals : 0;
  
  // Simple health score calculation based on pipeline metrics
  const healthScore = Math.min(95, Math.max(45, 
    (openDeals * 10) + (totalPipelineValue / 100000 * 5) + 30
  ));
  
  return {
    score: healthScore,
    status: healthScore >= 80 ? "Healthy" : healthScore >= 60 ? "Good" : "At Risk",
    pipelineValue: totalPipelineValue,
    totalDeals: openDeals,
    averageDealSize: avgDealSize,
    healthScore: healthScore,
    deals: {
      total: openDeals,
      qualified: Object.values(stageDistribution).reduce((sum, stage) => sum + stage.count, 0),
      proposal: stageDistribution['Proposal']?.count || 0,
      negotiation: stageDistribution['Negotiation']?.count || 0
    }
  };
};

// Helper functions
const estimateSalesCycle = (period) => {
  // Simplified estimation - would use actual historical data
  const baseCycle = 45;
  const periodMultiplier = {
    'this-quarter': 1,
    'last-quarter': 1.1,
    'last-90-days': 0.9,
    'ytd': 1.2,
    'last-year': 1.1
  };
  
  return Math.round(baseCycle * (periodMultiplier[period] || 1));
};

const calculateRevenueGrowthFromAPI = (apiData, period) => {
  // Simplified calculation - would need historical API data for accurate comparison
  const currentRevenue = apiData.opportunities?.content?.Data?.OpportunityResult?.[0]?.WinTotal || 0;
  
  // Mock growth calculation based on period
  const growthRates = {
    'this-quarter': 15.5,
    'last-quarter': 12.3,
    'last-90-days': 8.7,
    'ytd': 22.1,
    'last-year': 18.9
  };
  
  return growthRates[period] || 10;
};

export const getDaysLeftInPeriod = (period) => {
  const now = new Date();
  let endDate;

  switch (period) {
    case "this-quarter":
      const currentQuarter = Math.floor(now.getMonth() / 3);
      endDate = new Date(now.getFullYear(), currentQuarter * 3 + 3, 0);
      break;
    case "last-quarter":
      return 0; // Past period, no days left
    case "last-90-days":
      return 0; // Rolling period, no fixed end
    case "last-6-months":
      return 0; // Rolling period, no fixed end
    case "ytd":
      endDate = new Date(now.getFullYear(), 11, 31); // End of current year
      break;
    case "last-year":
      return 0; // Past period, no days left
    default:
      return 0;
  }

  if (now > endDate) return 0;
  
  const timeDiff = endDate.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

const getQuotaForPeriod = (period) => {
  return benchmarksService.getQuotaForPeriod(period);
};

// Return empty KPI metrics structure for error cases
const getEmptyKPIMetrics = (period) => {
  return {
    totalRevenue: 0,
    revenueGrowth: 0,
    pipelineValue: 0,
    dealsWon: 0,
    dealGrowth: 0,
    winRate: 0,
    totalDeals: 0,
    avgDealSize: 0,
    salesCycle: estimateSalesCycle(period),
    cycleChange: 0,
    activeReps: 0,
    avgRevenuePerRep: 0,
    quota: getQuotaForPeriod(period),
    quotaProgress: 0,
    daysLeft: getDaysLeftInPeriod(period),
    totalProposals: 0,
    activeProposals: 0,
    approvedProposals: 0,
    sentProposals: 0,
    openDeals: 0,
    apiError: 'API data unavailable or invalid response structure'
  };
};

