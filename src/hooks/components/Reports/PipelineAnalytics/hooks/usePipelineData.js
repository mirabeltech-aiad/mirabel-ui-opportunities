
import { useMemo } from 'react';

export const usePipelineData = (filteredOpportunities) => {
  const stageDistribution = useMemo(() => {
    if (!filteredOpportunities || filteredOpportunities.length === 0) {
      // MOCK DATA: Only when no opportunities available
      return [
        { stage: '1st Demo', count: 8, value: 420000 },
        { stage: 'Discovery', count: 12, value: 680000 },
        { stage: 'Proposal', count: 6, value: 890000 },
        { stage: 'Negotiation', count: 4, value: 720000 }
      ];
    }

    // Use real API data to calculate stage distribution
    const stageGroups = {};
    
    filteredOpportunities.forEach(opp => {
      const stage = opp.stage || opp.Stage || 'Unknown';
      if (!stageGroups[stage]) {
        stageGroups[stage] = { stage, count: 0, value: 0 };
      }
      stageGroups[stage].count += 1;
      stageGroups[stage].value += (opp.amount || opp.Amount || opp.Total || 0);
    });

    return Object.values(stageGroups);
  }, [filteredOpportunities]);

  const pipelineTrend = useMemo(() => {
    if (!filteredOpportunities || filteredOpportunities.length === 0) {
      // MOCK DATA: Only when no opportunities available for trend analysis
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      return months.map(month => ({
        month,
        pipeline: Math.floor(Math.random() * 2000000) + 1000000,
        closed: Math.floor(Math.random() * 500000) + 200000
      }));
    }

    // Calculate actual pipeline trends from API data
    const monthlyData = {};
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyData[monthKey] = { month: monthKey, pipeline: 0, closed: 0 };
    }

    filteredOpportunities.forEach(opp => {
      const oppDate = new Date(opp.createdDate || opp.CreatedDate);
      const monthKey = oppDate.toLocaleDateString('en-US', { month: 'short' });
      
      if (monthlyData[monthKey]) {
        const amount = opp.amount || opp.Amount || opp.Total || 0;
        
        if ((opp.status === 'Open') || (opp.Status === 'Open')) {
          monthlyData[monthKey].pipeline += amount;
        } else if ((opp.status === 'Won') || (opp.Status === 'Won') || (opp.status === 'Closed Won') || (opp.Status === 'Closed Won')) {
          monthlyData[monthKey].closed += amount;
        }
      }
    });

    return Object.values(monthlyData);
  }, [filteredOpportunities]);

  const forecastData = useMemo(() => {
    if (!filteredOpportunities || filteredOpportunities.length === 0) {
      // MOCK DATA: Only when no opportunities available for forecasting
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      return months.map(month => ({
        month,
        forecast: Math.floor(Math.random() * 800000) + 400000,
        actual: Math.floor(Math.random() * 600000) + 300000
      }));
    }

    // Calculate forecast based on actual pipeline data and historical conversion rates
    const monthlyData = {};
    const now = new Date();
    
    // Initialize months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyData[monthKey] = { month: monthKey, forecast: 0, actual: 0 };
    }

    // Calculate actual closed revenue by month
    const wonDeals = filteredOpportunities.filter(opp => 
      ((opp.status === 'Won') || (opp.Status === 'Won') || (opp.status === 'Closed Won') || (opp.Status === 'Closed Won')) &&
      (opp.actualCloseDate || opp.ActualCloseDate)
    );

    wonDeals.forEach(opp => {
      const closeDate = new Date(opp.actualCloseDate || opp.ActualCloseDate);
      const monthKey = closeDate.toLocaleDateString('en-US', { month: 'short' });
      
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].actual += (opp.amount || opp.Amount || opp.Total || 0);
      }
    });

    // Calculate forecast based on open pipeline and estimated close probability
    const openDeals = filteredOpportunities.filter(opp => 
      (opp.status === 'Open') || (opp.Status === 'Open')
    );

    openDeals.forEach(opp => {
      const projectedCloseDate = new Date(opp.projCloseDate || opp.ProjCloseDate || Date.now());
      const monthKey = projectedCloseDate.toLocaleDateString('en-US', { month: 'short' });
      
      if (monthlyData[monthKey]) {
        // Apply probability based on stage (simplified)
        const probability = getStageCloseProb(opp.stage || opp.Stage);
        const forecastAmount = (opp.amount || opp.Amount || opp.Total || 0) * probability;
        monthlyData[monthKey].forecast += forecastAmount;
      }
    });

    return Object.values(monthlyData);
  }, [filteredOpportunities]);

  return {
    stageDistribution,
    pipelineTrend,
    forecastData
  };
};

// Helper function to estimate close probability by stage
const getStageCloseProb = (stage) => {
  const stageProbabilities = {
    '1st Demo': 0.15,
    'Discovery': 0.25,
    'Proposal': 0.60,
    'Negotiation': 0.80,
    'Unknown': 0.30
  };
  
  return stageProbabilities[stage] || 0.30;
};
