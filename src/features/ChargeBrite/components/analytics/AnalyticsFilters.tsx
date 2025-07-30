
import { Card, CardContent } from '@/components/ui/card';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import PeriodFilter from '../filters/PeriodFilter';
import FilterHeader from '../filters/FilterHeader';

import CustomerStatusFilterSection from '../filters/CustomerStatusFilterSection';
import BusinessUnitsFilterSection from '../filters/BusinessUnitsFilterSection';
import ProductsFilterSection from '../filters/ProductsFilterSection';
import DateRangeFilterSection from '../filters/DateRangeFilterSection';
import ClearAllButton from '../filters/ClearAllButton';
import SearchButton from '../filters/SearchButton';
import { useProductFilterLogic } from '../filters/useProductFilterLogic';

interface AnalyticsFiltersProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  onDateRangeChange?: (startDate?: Date, endDate?: Date) => void;
}

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  dateRange,
  onDateRangeChange
}) => {
  const { 
    products, 
    businessUnits,
    subscriptionTypes,
    customerStatuses,
    selectedProducts, 
    selectedBusinessUnits,
    selectedSubscriptionTypes,
    selectedCustomerStatuses,
    isAllProductsSelected,
    isAllBusinessUnitsSelected,
    isAllSubscriptionTypesSelected,
    isAllCustomerStatusesSelected,
    toggleProduct,
    toggleBusinessUnit,
    toggleSubscriptionType,
    toggleCustomerStatus,
    selectAllProducts,
    selectAllBusinessUnits,
    selectAllSubscriptionTypes,
    selectAllCustomerStatuses,
    clearSelection 
  } = useProductFilter();

  const {
    selectedPeriod,
    hasActiveFilters,
    handleClearAll,
    handlePeriodChange
  } = useProductFilterLogic({
    isAllProductsSelected,
    isAllBusinessUnitsSelected,
    isAllSubscriptionTypesSelected,
    isAllCustomerStatusesSelected,
    dateRange,
    onDateRangeChange,
    clearSelection
  });

  return (
    <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span>🔍</span>
          <span className="font-medium">Filters:</span>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <CustomerStatusFilterSection
            customerStatuses={customerStatuses}
            selectedCustomerStatuses={selectedCustomerStatuses}
            isAllCustomerStatusesSelected={isAllCustomerStatusesSelected}
            toggleCustomerStatus={toggleCustomerStatus}
            selectAllCustomerStatuses={selectAllCustomerStatuses}
          />

          <BusinessUnitsFilterSection
            businessUnits={businessUnits}
            selectedBusinessUnits={selectedBusinessUnits}
            isAllBusinessUnitsSelected={isAllBusinessUnitsSelected}
            toggleBusinessUnit={toggleBusinessUnit}
            selectAllBusinessUnits={selectAllBusinessUnits}
          />

          <ProductsFilterSection
            products={products}
            selectedProducts={selectedProducts}
            isAllProductsSelected={isAllProductsSelected}
            toggleProduct={toggleProduct}
            selectAllProducts={selectAllProducts}
          />

          <PeriodFilter
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
            className="min-w-[140px]"
          />

          <DateRangeFilterSection
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <ClearAllButton
            hasActiveFilters={hasActiveFilters}
            onClearAll={handleClearAll}
          />
          
          <SearchButton />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsFilters;
