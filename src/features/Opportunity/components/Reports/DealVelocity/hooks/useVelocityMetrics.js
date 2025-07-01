
import { useMemo } from 'react';
import benchmarksService from '@/services/benchmarksService';

export const useVelocityMetrics = (opportunities, selectedPeriod) => {
  return useMemo(() => {
    // Filter opportunities based on selected period
    const now = new Date();
    let startDate;
    switch (selectedPeriod) {
      case 'last-3-months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case 'last-6-months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case 'ytd':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'last-year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    }

    const filteredOpportunities = opportunities.filter(opp => {
      const oppDate = new Date(opp.createdDate);
      return oppDate >= startDate;
    });

    const stages = ['1st Demo', 'Discovery', 'Proposal', 'Negotiation'];
    const closedOpportunities = filteredOpportunities.filter(opp => 
      opp.status === 'Won' || opp.status === 'Lost' || opp.status === 'Closed Lost'
    );
    
    // Calculate realistic stage velocity using actual data
    const stageVelocity = stages.map(stage => {
      // Get opportunities that have been in this stage
      const stageDeals = closedOpportunities.filter(opp => {
        // Check if opportunity passed through this stage or ended in it
        return opp.stage === stage || (opp.status === 'Won' && getStageOrder(opp.stage) >= getStageOrder(stage));
      });
      
      // Calculate average days in stage using realistic patterns
      const avgDays = stageDeals.length > 0 
        ? Math.round(stageDeals.reduce((sum, opp) => {
            // Calculate time spent in this specific stage
            const stageTime = calculateStageTime(opp, stage);
            return sum + stageTime;
          }, 0) / stageDeals.length)
        : 0;
      
      // Get industry benchmarks from centralized service
      const benchmark = benchmarksService.getIndustryBenchmark(stage);
      const variance = avgDays > 0 ? Math.round(((avgDays - benchmark) / benchmark) * 100) : 0;
      
      return {
        stage,
        avgDays,
        benchmark,
        variance,
        dealCount: stageDeals.length,
        status: getStageStatus(variance)
      };
    });

    // Calculate overall sales cycle using actual won deals
    const wonDeals = filteredOpportunities.filter(opp => opp.status === 'Won');
    const avgSalesCycle = wonDeals.length > 0 
      ? Math.round(wonDeals.reduce((sum, opp) => {
          const created = new Date(opp.createdDate);
          const closed = new Date(opp.actualCloseDate || opp.projCloseDate);
          const days = Math.max(1, Math.abs((closed - created) / (1000 * 60 * 60 * 24)));
          return sum + days;
        }, 0) / wonDeals.length)
      : 0;

    return {
      stageVelocity,
      avgSalesCycle,
      totalDeals: closedOpportunities.length,
      wonDeals: wonDeals.length
    };
  }, [opportunities, selectedPeriod]);
};

const getStageOrder = (stage) => {
  const stageOrder = {
    '1st Demo': 1,
    'Discovery': 2,
    'Proposal': 3,
    'Negotiation': 4,
    'Closed Won': 5,
    'Closed Lost': 0
  };
  return stageOrder[stage] || 0;
};

const calculateStageTime = (opportunity, targetStage) => {
  const created = new Date(opportunity.createdDate);
  const closed = new Date(opportunity.actualCloseDate || opportunity.projCloseDate);
  const totalDays = Math.abs((closed - created) / (1000 * 60 * 60 * 24));
  
  // Estimate time spent in specific stage based on stage order and deal characteristics
  const stageOrder = getStageOrder(targetStage);
  const finalStageOrder = getStageOrder(opportunity.stage);
  
  // If deal didn't reach this stage, return 0
  if (finalStageOrder < stageOrder && opportunity.status !== 'Won') {
    return 0;
  }
  
  // Distribute time across stages based on typical patterns
  const stageWeights = {
    '1st Demo': 0.15,      // 15% of total time
    'Discovery': 0.30,     // 30% of total time
    'Proposal': 0.35,      // 35% of total time
    'Negotiation': 0.20    // 20% of total time
  };
  
  return Math.round(totalDays * (stageWeights[targetStage] || 0.25));
};

const getStageStatus = (variance) => {
  if (Math.abs(variance) <= 15) return 'optimal';
  if (variance > 15) return 'slow';
  return 'fast';
};
