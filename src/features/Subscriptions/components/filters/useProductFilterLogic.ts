
import React from 'react';

interface UseProductFilterLogicProps {
  isAllProductsSelected: boolean;
  isAllBusinessUnitsSelected: boolean;
  isAllSubscriptionTypesSelected: boolean;
  isAllCustomerStatusesSelected: boolean;
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  onDateRangeChange?: (startDate?: Date, endDate?: Date) => void;
  clearSelection: () => void;
}

export const useProductFilterLogic = ({
  isAllProductsSelected,
  isAllBusinessUnitsSelected,
  isAllSubscriptionTypesSelected,
  isAllCustomerStatusesSelected,
  dateRange,
  onDateRangeChange,
  clearSelection
}: UseProductFilterLogicProps) => {
  const [selectedPeriod, setSelectedPeriod] = React.useState('last_30_days');

  // A filter is active if ANY of these conditions are true:
  // - Not all products are selected (user made specific product choices)
  // - Not all business units are selected (user made specific unit choices)
  // - Not all subscription types are selected (user made specific type choices)
  // - Not all customer statuses are selected (user made specific status choices)
  // - Period is not the default 'last_30_days'
  // - A custom date range is set
  const hasActiveFilters = !isAllProductsSelected || 
    !isAllBusinessUnitsSelected || 
    !isAllSubscriptionTypesSelected ||
    !isAllCustomerStatusesSelected ||
    selectedPeriod !== 'last_30_days' || 
    !!dateRange?.startDate || 
    !!dateRange?.endDate;

  const handleClearAll = () => {
    clearSelection();
    setSelectedPeriod('last_30_days');
    if (onDateRangeChange) {
      onDateRangeChange(undefined, undefined);
    }
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  return {
    selectedPeriod,
    hasActiveFilters,
    handleClearAll,
    handlePeriodChange
  };
};
