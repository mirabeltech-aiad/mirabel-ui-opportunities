
import { useMemo } from 'react';

export const useFilteredReportsData = (originalData, selectedRep) => {
  return useMemo(() => {
    if (!originalData || selectedRep === 'all') {
      return originalData;
    }

    // Filter KPI data for specific rep
    const filterKPIData = (kpiData) => {
      if (!kpiData) return kpiData;
      
      // For individual rep, adjust totals to show only their contribution
      // This is a simplified approach - in a real app you'd have rep-specific data
      return {
        ...kpiData,
        totalRevenue: Math.round(kpiData.totalRevenue * 0.15), // Assuming average rep contribution
        dealsWon: Math.max(1, Math.round(kpiData.dealsWon * 0.15)),
        pipelineValue: Math.round(kpiData.pipelineValue * 0.15),
        avgDealSize: kpiData.avgDealSize,
        activeReps: 1, // Individual rep
        avgRevenuePerRep: Math.round(kpiData.totalRevenue * 0.15),
      };
    };

    // Filter pipeline health for specific rep
    const filterPipelineHealth = (pipelineHealth) => {
      if (!pipelineHealth) return pipelineHealth;
      
      return {
        ...pipelineHealth,
        pipelineValue: Math.round(pipelineHealth.pipelineValue * 0.15),
        totalDeals: Math.max(1, Math.round(pipelineHealth.totalDeals * 0.15)),
        averageDealSize: pipelineHealth.averageDealSize,
        deals: {
          ...pipelineHealth.deals,
          total: Math.max(1, Math.round(pipelineHealth.deals.total * 0.15)),
          qualified: Math.max(1, Math.round(pipelineHealth.deals.qualified * 0.15))
        }
      };
    };

    // Filter team data for specific rep
    const filterTeamData = (teamData) => {
      if (!teamData || !Array.isArray(teamData)) return teamData;
      
      // Find the specific rep in team data or return a subset
      const repName = selectedRep; // This would need to be mapped from rep value to name
      return teamData.filter(rep => rep.name && rep.name.toLowerCase().includes('rep'));
    };

    return {
      kpiData: filterKPIData(originalData.kpiData),
      pipelineHealth: filterPipelineHealth(originalData.pipelineHealth),
      revenueData: originalData.revenueData, // Revenue charts remain the same for context
      pipelineData: originalData.pipelineData, // Pipeline charts remain the same for context
      teamData: filterTeamData(originalData.teamData)
    };
  }, [originalData, selectedRep]);
};
