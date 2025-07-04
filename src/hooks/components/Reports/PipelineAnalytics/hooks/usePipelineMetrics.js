import { useMemo } from 'react';

export const usePipelineMetrics = (filteredOpportunities) => {
  return useMemo(() => {
    if (!filteredOpportunities || filteredOpportunities.length === 0) {
      // Return empty metrics structure instead of mock data
      console.warn('No opportunities data available for pipeline metrics');
      return {
        total: 0,
        totalValue: 0,
        avgDealSize: 0,
        openDeals: 0,
        wonDeals: 0,
        lostDeals: 0,
        winRate: 0,
        pipelineValue: 0,
        wonValue: 0,
        avgVelocity: 0,
        apiError: 'No opportunities data available'
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
      parseFloat(((wonOpps.length / (wonOpps.length + lostOpps.length)) * 100).toFixed(2)) : 0;
    
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
