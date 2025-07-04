
// Legacy/backward compatibility functions for reports
import benchmarksService from '@/features/Opportunity/Services/benchmarksService';
import { filterOpportunitiesByPeriod, getPreviousPeriod } from './periodHelpers';
import { getDaysLeftInPeriod } from './apiTransformers';

// Legacy functions for backward compatibility
export const calculateKPIMetrics = (opportunities, period = "q1-2024") => {
  const filteredOpportunities = filterOpportunitiesByPeriod(opportunities, period);
  const wonOpportunities = filteredOpportunities.filter(opp => opp.status === 'Won');
  const openOpportunities = opportunities.filter(opp => opp.status === 'Open'); // Keep all open for pipeline
  const lostOpportunities = filteredOpportunities.filter(opp => opp.status === 'Lost');
  
  const totalRevenue = wonOpportunities.reduce((sum, opp) => sum + opp.amount, 0);
  const pipelineValue = openOpportunities.reduce((sum, opp) => sum + opp.amount, 0);
  
  const totalClosed = wonOpportunities.length + lostOpportunities.length;
  const winRate = totalClosed > 0 ? (wonOpportunities.length / totalClosed * 100) : 0;
  
  const avgDealSize = wonOpportunities.length > 0 ? totalRevenue / wonOpportunities.length : 0;
  
  // Calculate average sales cycle for won deals
  const avgSalesCycle = wonOpportunities.length > 0 
    ? wonOpportunities.reduce((sum, opp) => {
        const created = new Date(opp.createdDate);
        const closed = new Date(opp.actualCloseDate || opp.projCloseDate);
        const days = Math.abs((closed - created) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / wonOpportunities.length
    : 0;

  // Calculate revenue growth (compare with previous period)
  const revenueGrowth = calculateRevenueGrowth(opportunities, period);

  // Calculate days left in period
  const daysLeft = getDaysLeftInPeriod(period);

  // Use centralized quota service
  const quota = getQuotaForPeriod(period);

  return {
    totalRevenue,
    revenueGrowth,
    pipelineValue,
    winRate: Math.round(winRate * 10) / 10,
    avgDealSize: Math.round(avgDealSize),
    salesCycle: Math.round(avgSalesCycle),
    quota,
    quotaProgress: Math.round((totalRevenue / quota) * 100 * 10) / 10,
    daysLeft
  };
};

export const calculatePipelineHealth = (opportunities) => {
  const openOpportunities = opportunities.filter(opp => opp.status === 'Open');
  
  const stageGroups = openOpportunities.reduce((acc, opp) => {
    const stage = opp.stage;
    if (!acc[stage]) acc[stage] = { count: 0, value: 0 };
    acc[stage].count++;
    acc[stage].value += opp.amount;
    return acc;
  }, {});

  const deals = {
    total: openOpportunities.length,
    qualified: (stageGroups['Discovery']?.count || 0) + (stageGroups['Proposal']?.count || 0),
    proposal: stageGroups['Proposal']?.count || 0,
    negotiation: stageGroups['Negotiation']?.count || 0
  };

  // Simple health score calculation based on pipeline distribution
  const score = Math.min(85, Math.max(45, 
    (deals.qualified * 20) + (deals.proposal * 25) + (deals.negotiation * 30)
  ));

  return {
    score: Math.round(score),
    status: score >= 80 ? "Healthy" : score >= 60 ? "Good" : "At Risk",
    deals
  };
};

export const generateRevenueChartData = (opportunities, period = "q1-2024") => {
  const filteredOpportunities = filterOpportunitiesByPeriod(opportunities, period);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const wonOpportunities = filteredOpportunities.filter(opp => opp.status === 'Won');
  
  // Group won opportunities by month
  const monthlyRevenue = monthNames.map((month, index) => {
    const monthRevenue = wonOpportunities
      .filter(opp => {
        const closedDate = new Date(opp.actualCloseDate || opp.projCloseDate);
        return closedDate.getMonth() === index;
      })
      .reduce((sum, opp) => sum + opp.amount, 0);

    // Generate forecast data (this would come from actual forecasting logic)
    const forecastMultiplier = 1.1 + (index * 0.1);
    const forecast = monthRevenue > 0 ? monthRevenue * forecastMultiplier : (index + 1) * 200000;

    return {
      month,
      revenue: monthRevenue > 0 ? monthRevenue : null,
      forecast: Math.round(forecast)
    };
  });

  return monthlyRevenue;
};

export const generatePipelineChartData = (opportunities) => {
  const openOpportunities = opportunities.filter(opp => opp.status === 'Open');
  
  const stageMapping = {
    '1st Demo': 'Lead',
    'Discovery': 'Qualified',
    'Proposal': 'Proposal', 
    'Negotiation': 'Negotiation'
  };

  const stageData = Object.entries(stageMapping).map(([originalStage, displayStage]) => {
    const stageOpps = openOpportunities.filter(opp => opp.stage === originalStage);
    return {
      stage: displayStage,
      count: stageOpps.length,
      value: stageOpps.reduce((sum, opp) => sum + opp.amount, 0)
    };
  });

  return stageData;
};

export const generateTeamPerformanceData = (opportunities, period = "q1-2024") => {
  const filteredOpportunities = filterOpportunitiesByPeriod(opportunities, period);
  // Filter out opportunities with undefined or null assignedRep
  const validOpportunities = filteredOpportunities.filter(opp => opp.assignedRep && typeof opp.assignedRep === 'string');
  const reps = [...new Set(validOpportunities.map(opp => opp.assignedRep))];
  
  // Increased from 5 to 10 reps for more realistic data
  return reps.slice(0, 10).map((rep, index) => {
    const repOpps = validOpportunities.filter(opp => opp.assignedRep === rep);
    const wonOpps = repOpps.filter(opp => opp.status === 'Won');
    const totalDeals = repOpps.filter(opp => opp.status === 'Won' || opp.status === 'Lost').length;
    const revenue = wonOpps.reduce((sum, opp) => sum + opp.amount, 0);
    const winRate = totalDeals > 0 ? (wonOpps.length / totalDeals * 100) : 0;
    const avgDealSize = wonOpps.length > 0 ? revenue / wonOpps.length : 0;
    
    const quota = 1200000 + (index * 100000); // Varying quotas
    const quotaProgress = (revenue / quota) * 100;
    
    let status = "On Track";
    if (quotaProgress >= 90) status = "Ahead";
    else if (quotaProgress < 60) status = "At Risk";

    // Safely generate initials with fallback
    const initials = rep && rep.split ? rep.split(' ').map(n => n[0]).join('') : 'N/A';

    return {
      id: index + 1,
      name: rep,
      initials,
      deals: wonOpps.length,
      revenue: Math.round(revenue),
      quota,
      winRate: Math.round(winRate * 10) / 10,
      avgDealSize: Math.round(avgDealSize),
      status
    };
  });
};

const calculateRevenueGrowth = (opportunities, period) => {
  // Get current period revenue
  const currentOpportunities = filterOpportunitiesByPeriod(opportunities, period);
  const currentRevenue = currentOpportunities
    .filter(opp => opp.status === 'Won')
    .reduce((sum, opp) => sum + opp.amount, 0);

  // Get previous period revenue for comparison
  const previousPeriod = getPreviousPeriod(period);
  const previousOpportunities = opportunities.filter(opp => {
    const oppDate = new Date(opp.actualCloseDate || opp.projCloseDate || opp.createdDate);
    return oppDate >= previousPeriod.startDate && oppDate <= previousPeriod.endDate;
  });
  
  const previousRevenue = previousOpportunities
    .filter(opp => opp.status === 'Won')
    .reduce((sum, opp) => sum + opp.amount, 0);

  // Calculate growth percentage
  if (previousRevenue === 0) {
    return currentRevenue > 0 ? 100 : 0; // If no previous revenue but current revenue exists
  }

  const growth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  return Math.round(growth * 10) / 10; // Round to 1 decimal place
};

const getQuotaForPeriod = (period) => {
  return benchmarksService.getQuotaForPeriod(period);
};

