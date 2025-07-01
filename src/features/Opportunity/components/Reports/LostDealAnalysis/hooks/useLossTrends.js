
import { useMemo } from 'react';

export const useLossTrends = () => {
  return useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      totalLosses: Math.floor(Math.random() * 15) + 5,
      competitiveLosses: Math.floor(Math.random() * 8) + 2,
      budgetLosses: Math.floor(Math.random() * 6) + 1
    }));
  }, []);
};
