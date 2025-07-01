
// API data transformation utilities for reports
import benchmarksService from '@/services/benchmarksService';

// Transform API OpportunityResult to KPI metrics
export const transformApiDataToKPIMetrics = (apiData, period = "this-quarter") => {
  const opportunityResult = apiData.opportunities?.content?.Data?.OpportunityResult?.[0] || {};
  const proposalResult = apiData.proposals?.content?.Data?.OpportunityResult?.[0] || {};
  
  // Extract metrics from API response
  const totalRevenue = opportunityResult.WinTotal || 0;
  const totalDeals = opportunityResult.TotIds || 0;
  const wonDeals = opportunityResult.Won || 0;
  const lostDeals = opportunityResult.Lost || 0;
  const openDeals = opportunityResult.Open || 0;
  const pipelineValue = opportunityResult.TotOppAmt || 0;
  const winRate = opportunityResult.WinRatio || 0;
  
  // Proposal metrics
  const totalProposals = proposalResult.Proposals || 0;
  const activeProposals = proposalResult.ActiveProposals || 0;
  const approvedProposals = proposalResult.ApprovedProposals || 0;
  const sentProposals = proposalResult.SentProposals || 0;
  
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

