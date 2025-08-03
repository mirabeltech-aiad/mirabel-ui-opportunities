
import { useMemo } from 'react';

export const useInteractiveTrendsConfig = () => {
  const chartConfig = useMemo(() => ({
    total: {
      label: "Total Circulation",
      color: "#3b82f6",
    },
    print: {
      label: "Print",
      color: "#10b981",
    },
    digital: {
      label: "Digital",
      color: "#8b5cf6",
    },
    newSubscriptions: {
      label: "New Subscriptions",
      color: "#f59e0b",
    },
    churnedSubscriptions: {
      label: "Churned Subscriptions",
      color: "#f43f5e",
    },
  }), []);

  return { chartConfig };
};
