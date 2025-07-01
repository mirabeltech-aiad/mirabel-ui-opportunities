
import { useMemo } from 'react';

export const usePipelineMetrics = (filteredOpportunities) => {
  return useMemo(() => {
    if (!filteredOpportunities || filteredOpportunities.length === 0) {
      // MOCK DATA: Only when no opportunities available
      return {
        total: 15,
        totalValue: 2500000,
        avgDealSize: 166667,
        openDeals: 8,
        wonDeals: 5,
        lostDeals: 2,
        winRate: 71.4,
        pipelineValue: 1800000,
        wonValue: 750000,
        avgVelocity: 45
      };
    }

    const total = filteredOpportunities.length;
    const totalValue = filteredOpportunities.reduce((sum, opp) => sum + (opp.amount || opp.Amount || opp.Total || 0), 0);
    const avgDealSize = total > 0 ? totalValue / total : 0;
    
    const openOpps = filteredOpportunities.filter(opp => 
      (opp.status === 'Open') || (opp.Status === 'Open')
    );
    
    const wonOpps = filteredOpportunities.filter(opp => 
      (opp.status === 'Won') || (opp.Status === 'Won') || (opp.status === 'Closed Won') || (opp.Status === 'Closed Won')
    );
    
    const lostOpps = filteredOpportunities.filter(opp => 
      (opp.status === 'Lost') || (opp.Status === 'Lost') || (opp.status === 'Closed Lost') || (opp.Status === 'Closed Lost')
    );
    
    const winRate = (wonOpps.length + lostOpps.length) > 0 ? 
      (wonOpps.length / (wonOpps.length + lostOpps.length)) * 100 : 0;
    
    const pipelineValue = openOpps.reduce((sum, opp) => sum + (opp.amount || opp.Amount || opp.Total || 0), 0);
    const wonValue = wonOpps.reduce((sum, opp) => sum + (opp.amount || opp.Amount || opp.Total || 0), 0);
    
    // Calculate velocity (days to close for won deals) using real API data
    const avgVelocity = wonOpps.length > 0 ? wonOpps.reduce((sum, opp) => {
      if ((opp.actualCloseDate || opp.ActualCloseDate) && (opp.createdDate || opp.CreatedDate)) {
        const created = new Date(opp.createdDate || opp.CreatedDate);
        const closed = new Date(opp.actualCloseDate || opp.ActualCloseDate);
        return sum + Math.abs((closed - created) / (1000 * 60 * 60 * 24));
      }
      return sum;
    }, 0) / wonOpps.length : 0;

    return {
      total,
      totalValue,
      avgDealSize,
      openDeals: openOpps.length,
      wonDeals: wonOpps.length,
      lostDeals: lostOpps.length,
      winRate,
      pipelineValue,
      wonValue,
      avgVelocity: Math.round(avgVelocity)
    };
  }, [filteredOpportunities]);
};
