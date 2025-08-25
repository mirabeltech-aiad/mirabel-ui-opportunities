
// API data transformation utilities for reports
import benchmarksService from '@/features/Opportunity/Services/benchmarksService';

// ===== EXECUTIVE DASHBOARD STORED PROCEDURE TRANSFORMERS =====

// ===== EXECUTIVE DASHBOARD STORED PROCEDURE TRANSFORMERS =====

/**
 * Transform SP Result Set 1 to KPI metrics
 * Maps: TotIds, Won, Lost, Open, WinTotal, TotOppAmt, WinRatio, AvgDealSize, etc.
 */
export const transformExecutiveDashboardToKPIMetrics = (kpiMetricsResultSet, period = "this-quarter") => {


  if (!kpiMetricsResultSet || typeof kpiMetricsResultSet !== 'object') {
    console.warn('Invalid KPI metrics result set from stored procedure');
    return getEmptyKPIMetrics(period);
  }

  // Extract values from SP result set with exact field mapping from the SP
  const totalRevenue = sanitizeNumericValue(kpiMetricsResultSet.WinTotal);
  const totalDeals = sanitizeNumericValue(kpiMetricsResultSet.TotIds);
  const wonDeals = sanitizeNumericValue(kpiMetricsResultSet.Won);
  const lostDeals = sanitizeNumericValue(kpiMetricsResultSet.Lost);
  const openDeals = sanitizeNumericValue(kpiMetricsResultSet.Open);
  const pipelineValue = sanitizeNumericValue(kpiMetricsResultSet.TotOppAmt);
  const winRate = sanitizeNumericValue(kpiMetricsResultSet.WinRatio);
  const avgDealSize = sanitizeNumericValue(kpiMetricsResultSet.AvgDealSize);
  const avgSalesCycle = sanitizeNumericValue(kpiMetricsResultSet.AvgSalesCycle);
  const activeReps = sanitizeNumericValue(kpiMetricsResultSet.ActiveReps);
  const activeCustomers = sanitizeNumericValue(kpiMetricsResultSet.ActiveCustomers);

  // Use quota from SP instead of hardcoded values
  const quota = sanitizeNumericValue(kpiMetricsResultSet.Quota);
  const quotaProgress = quota > 0 ? (totalRevenue / quota) * 100 : 0;
  const daysLeft = getDaysLeftInPeriod(period);
  const avgRevenuePerRep = activeReps > 0 ? totalRevenue / activeReps : 0;

  return {
    // Core KPI metrics
    totalRevenue,
    revenueGrowth: 0, // Would need historical data for accurate calculation
    pipelineValue,
    dealsWon: wonDeals,
    dealGrowth: 0, // Would need historical comparison  
    winRate,
    totalDeals: totalDeals,
    avgDealSize,
    avgSalesCycle,
    salesCycle: avgSalesCycle,
    cycleChange: 0, // Would need historical data
    activeReps,
    avgRevenuePerRep,
    activeCustomers,
    quota,
    quotaProgress,
    daysLeft,
    openDeals,

    // Additional fields needed by UI components
    Won: wonDeals,  // Alias for backward compatibility
    Lost: lostDeals,
    Open: openDeals,
    WinTotal: totalRevenue, // Alias for backward compatibility
    TotOppAmt: pipelineValue, // Alias for backward compatibility

    source: 'uspCDCSync_ExecutiveDashboardGet'
  };
};

/**
 * Transform SP Result Set 2 to pipeline health
 * Maps: Stage, Opportunities, Value, AvgProbability, AvgDaysInStage
 */
export const transformExecutiveDashboardToPipelineHealth = (pipelineHealthResultSet) => {


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


  if (!Array.isArray(teamPerformanceResultSet) || teamPerformanceResultSet.length === 0) {
    console.warn('No team performance data available from stored procedure');
    return [];
  }

  // Process real SP data with exact field mapping
  const processedTeamData = teamPerformanceResultSet
    .filter(rep => rep.RepName && rep.RepName.trim() !== '' && rep.RepName !== 'Unassigned Rep')
    .map((rep, index) => {
      const revenue = sanitizeNumericValue(rep.Revenue);
      const totalOpportunities = sanitizeNumericValue(rep.TotalOpportunities);
      const wonDeals = sanitizeNumericValue(rep.WonDeals);
      const winRate = sanitizeNumericValue(rep.WinRate);
      const avgDealSize = sanitizeNumericValue(rep.AvgDealSize);
      const quota = sanitizeNumericValue(rep.Quota);
      const quotaAttainment = sanitizeNumericValue(rep.QuotaAttainment);
      const pipeline = sanitizeNumericValue(rep.Pipeline);

      // Determine status based on quota attainment from SP
      let status = "On Track";
      if (quotaAttainment >= 95) status = "Ahead";
      else if (quotaAttainment < 70) status = "At Risk";

      return {
        id: rep.RepID || index + 1,
        name: rep.RepName,
        initials: rep.RepName.split(' ').map(n => n[0]).join('').toUpperCase(),
        deals: wonDeals,
        revenue,
        quota,
        winRate: Math.round(winRate * 10) / 10,
        avgDealSize: Math.round(avgDealSize),
        status,
        pipeline,
        totalOpportunities,
        quotaAttainment: Math.round(quotaAttainment * 10) / 10
      };
    })
    .sort((a, b) => b.revenue - a.revenue);


  return processedTeamData;
};

/**
 * Transform SP Result Set 5 to product performance data
 * Maps: Product, Opportunities, Revenue, WonDeals, WinRate
 */
export const transformExecutiveDashboardToProductData = (productPerformanceResultSet) => {


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

    return { isValid: false, message: 'Invalid API response - missing expected data structures', type: 'structure_error' };
  }

  return { isValid: true };
};

// Transform API OpportunityResult to KPI metrics
export const transformApiDataToKPIMetrics = (apiData, period = "this-quarter") => {


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

  // Sales cycle would need historical data for accurate calculation
  const avgSalesCycle = 0;

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

// Helper functions - removed hardcoded estimations

const calculateRevenueGrowthFromAPI = (apiData, period) => {
  // Would need historical API data for accurate comparison
  return 0;
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
    avgSalesCycle: 0,
    salesCycle: 0,
    cycleChange: 0,
    activeReps: 0,
    avgRevenuePerRep: 0,
    quota: 0,
    quotaProgress: 0,
    daysLeft: getDaysLeftInPeriod(period),
    openDeals: 0,
    apiError: 'API data unavailable or invalid response structure'
  };
};

// ===== SALES PERFORMANCE ANALYSIS STORED PROCEDURE TRANSFORMERS =====

/**
 * Transform SP Result Set 1 to Sales Performance KPI metrics
 * Maps: TotIds, Won, Lost, Open, WinTotal, TotOppAmt, WinRatio, AvgDealSize, etc.
 */
export const transformSalesPerformanceToKPIMetrics = (kpiMetricsResultSet, period = "last-12-months") => {


  if (!kpiMetricsResultSet || typeof kpiMetricsResultSet !== 'object') {
    console.warn('Invalid Sales Performance KPI metrics result set from stored procedure');
    return getEmptySalesPerformanceKPIMetrics(period);
  }

  // Extract values from SP result set with exact field mapping from the SP
  const totalRevenue = sanitizeNumericValue(kpiMetricsResultSet.WinTotal);
  const totalDeals = sanitizeNumericValue(kpiMetricsResultSet.TotIds);
  const wonDeals = sanitizeNumericValue(kpiMetricsResultSet.Won);
  const lostDeals = sanitizeNumericValue(kpiMetricsResultSet.Lost);
  const openDeals = sanitizeNumericValue(kpiMetricsResultSet.Open);
  const pipelineValue = sanitizeNumericValue(kpiMetricsResultSet.TotOppAmt);
  const winRate = sanitizeNumericValue(kpiMetricsResultSet.WinRatio);
  const avgDealSize = sanitizeNumericValue(kpiMetricsResultSet.AvgDealSize);
  const avgSalesCycle = sanitizeNumericValue(kpiMetricsResultSet.AvgSalesCycle);
  const activeReps = sanitizeNumericValue(kpiMetricsResultSet.ActiveReps);
  const activeCustomers = sanitizeNumericValue(kpiMetricsResultSet.ActiveCustomers);

  return {
    // Core KPI metrics
    total: totalDeals,
    won: wonDeals,
    lost: lostDeals,
    open: openDeals,
    totalRevenue,
    pipelineValue,
    avgDealSize,
    conversionRate: winRate,
    winRate,
    avgSalesCycle,
    activeReps,
    activeCustomers,

    // Additional fields needed by UI components
    Won: wonDeals,  // Alias for backward compatibility
    Lost: lostDeals,
    Open: openDeals,
    WinTotal: totalRevenue, // Alias for backward compatibility
    TotOppAmt: pipelineValue, // Alias for backward compatibility

    source: 'uspCDCSync_GetSalesPerformanceData'
  };
};

/**
 * Transform SP Result Set 2 to Sales Performance revenue chart data  
 * Maps: Year, Month, MonthName, Revenue, Pipeline, WonDeals, OpenDeals
 */
export const transformSalesPerformanceToRevenueData = (revenueTrendsResultSet) => {


  if (!Array.isArray(revenueTrendsResultSet) || revenueTrendsResultSet.length === 0) {
    console.warn('Invalid Sales Performance revenue trends result set from stored procedure');
    return [];
  }

  return revenueTrendsResultSet.map(item => ({
    month: item.MonthName || `${item.Year}-${String(item.Month).padStart(2, '0')}`,
    revenue: sanitizeNumericValue(item.Revenue),
    pipeline: sanitizeNumericValue(item.Pipeline),
    wonDeals: sanitizeNumericValue(item.WonDeals),
    openDeals: sanitizeNumericValue(item.OpenDeals),
    totalDeals: sanitizeNumericValue(item.TotalDeals),
    year: sanitizeNumericValue(item.Year),
    monthNumber: sanitizeNumericValue(item.Month)
  })).sort((a, b) => {
    // Sort by year then month
    if (a.year !== b.year) return a.year - b.year;
    return a.monthNumber - b.monthNumber;
  });
};

/**
 * Transform SP Result Set 3 to Sales Performance pipeline health
 * Maps: Stage, Opportunities, Value, AvgProbability, AvgDaysInStage
 */
export const transformSalesPerformanceToPipelineData = (pipelineHealthResultSet) => {


  if (!Array.isArray(pipelineHealthResultSet) || pipelineHealthResultSet.length === 0) {
    console.warn('Invalid Sales Performance pipeline health result set from stored procedure');
    return [];
  }

  return pipelineHealthResultSet.map(stage => ({
    stage: stage.Stage || 'Unknown Stage',
    count: sanitizeNumericValue(stage.Opportunities),
    value: sanitizeNumericValue(stage.Value),
    avgProbability: sanitizeNumericValue(stage.AvgProbability),
    avgDaysInStage: sanitizeNumericValue(stage.AvgDaysInStage),
    opportunities: sanitizeNumericValue(stage.Opportunities)
  }));
};

/**
 * Transform SP Result Set 4 to Sales Performance rep data
 * Maps: RepName, TotalOpportunities, Revenue, Pipeline, WinRate, AvgDealSize, QuotaAttainment
 */
export const transformSalesPerformanceToRepData = (repPerformanceResultSet) => {


  if (!Array.isArray(repPerformanceResultSet) || repPerformanceResultSet.length === 0) {
    console.warn('No Sales Performance rep performance data available from stored procedure');
    return [];
  }

  // Process real SP data with exact field mapping
  const processedRepData = repPerformanceResultSet
    .filter(rep => rep.RepName && rep.RepName.trim() !== '' && rep.RepName !== 'Unassigned')
    .map((rep, index) => {
      const revenue = sanitizeNumericValue(rep.Revenue);
      const totalOpportunities = sanitizeNumericValue(rep.TotalOpportunities);
      const wonDeals = sanitizeNumericValue(rep.WonDeals);
      const winRate = sanitizeNumericValue(rep.WinRate);
      const avgDealSize = sanitizeNumericValue(rep.AvgDealSize);
      const quota = sanitizeNumericValue(rep.Quota);
      const quotaAttainment = sanitizeNumericValue(rep.QuotaAttainment);
      const pipeline = sanitizeNumericValue(rep.Pipeline);

      // Determine status based on quota attainment from SP
      let status = "On Track";
      if (quotaAttainment >= 95) status = "Ahead";
      else if (quotaAttainment < 70) status = "At Risk";

      return {
        id: rep.RepID || index + 1,
        name: rep.RepName,
        initials: rep.RepName.split(' ').map(n => n[0]).join('').toUpperCase(),
        total: totalOpportunities,
        won: wonDeals,
        revenue,
        quota,
        winRate: Math.round(winRate * 10) / 10,
        avgDealSize: Math.round(avgDealSize),
        status,
        pipeline,
        totalOpportunities,
        quotaAttainment: Math.round(quotaAttainment * 10) / 10
      };
    })
    .sort((a, b) => b.revenue - a.revenue);


  return processedRepData;
};

// Return empty Sales Performance KPI metrics structure for error cases
const getEmptySalesPerformanceKPIMetrics = (period) => {
  return {
    total: 0,
    won: 0,
    lost: 0,
    open: 0,
    totalRevenue: 0,
    pipelineValue: 0,
    avgDealSize: 0,
    conversionRate: 0,
    winRate: 0,
    avgSalesCycle: 0,
    activeReps: 0,
    activeCustomers: 0,
    apiError: 'API data unavailable or invalid response structure'
  };
};

