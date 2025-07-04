import { useMemo, useState, useEffect } from 'react';
import adminApi from '@/services/adminApi';
import { mapStageToStandard } from '@OpportunityUtils/reports/stageMapping';

export const usePipelineData = (filteredOpportunities) => {
  const [liveStages, setLiveStages] = useState(null);

  // Fetch live stages on component mount
  useEffect(() => {
    const fetchStages = async () => {
      try {
        const stagesResponse = await adminApi.getOpportunityStages();
        setLiveStages(stagesResponse?.content?.Data || []);
        console.log('Live stages fetched for pipeline data:', stagesResponse);
      } catch (error) {
        console.error('Error fetching live stages:', error);
        setLiveStages([]);
      }
    };

    fetchStages();
  }, []);
  const stageDistribution = useMemo(() => {
    if (!filteredOpportunities || filteredOpportunities.length === 0) {
      // Return empty data structure instead of mock data
      console.warn('No opportunities data available for stage distribution');
      return [];
    }

    // Use real API data to calculate stage distribution with live stages
    const stageGroups = {};
    
    filteredOpportunities.forEach(opp => {
      const apiStage = opp.stage || opp.Stage || 'Unknown';
      
      // Map to live stage or use standard mapping
      let standardStage = apiStage;
      if (liveStages && liveStages.length > 0) {
        const liveStage = liveStages.find(ls => ls.name === apiStage || ls.StageName === apiStage);
        standardStage = liveStage ? (liveStage.name || liveStage.StageName) : mapStageToStandard(apiStage);
      } else {
        standardStage = mapStageToStandard(apiStage);
      }
      
      if (!stageGroups[standardStage]) {
        stageGroups[standardStage] = { stage: standardStage, count: 0, value: 0 };
      }
      stageGroups[standardStage].count += 1;
      stageGroups[standardStage].value += (opp.amount || opp.Amount || opp.Total || 0);
    });

    return Object.values(stageGroups);
  }, [filteredOpportunities, liveStages]);

  const pipelineTrend = useMemo(() => {
    if (!filteredOpportunities || filteredOpportunities.length === 0) {
      // Return empty data structure instead of mock data
      console.warn('No opportunities data available for trend analysis');
      return [];
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
      // Return empty data structure instead of mock data
      console.warn('No opportunities data available for forecasting');
      return [];
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
