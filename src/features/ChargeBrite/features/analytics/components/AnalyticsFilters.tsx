import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import PeriodFilter from '@/components/filters/PeriodFilter';
import DateRangeFilterSection from '@/components/filters/DateRangeFilterSection';
import SearchButton from '@/components/filters/SearchButton';
import { useProductFilterLogic } from '@/components/filters/useProductFilterLogic';

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

  // Handle custom date range change - reset period to default when custom range is set
  const handleCustomDateRangeChange = (startDate?: Date, endDate?: Date) => {
    if (onDateRangeChange) {
      onDateRangeChange(startDate, endDate);
    }
  };

  return (
    <Card className="border-gray-200 shadow-sm mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 min-w-fit">
            <Filter className="h-4 w-4" />
            Filters:
          </div>

          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white flex-1">
              
              {/* Customer Status */}
              <div className="border-r border-gray-300 flex-1">
                <Select
                  value={isAllCustomerStatusesSelected ? 'all' : 'custom'}
                  onValueChange={(value) => {
                    if (value === 'all') {
                      selectAllCustomerStatuses();
                    }
                  }}
                >
                  <SelectTrigger className="w-full h-9 rounded-none border-0 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Customer Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {!isAllCustomerStatusesSelected && (
                <div className="flex items-center gap-1 px-3 py-2 border-r border-gray-300 bg-gray-50 min-w-0">
                  {customerStatuses.slice(0, 3).map((status) => (
                    <Badge
                      key={status.id}
                      variant={selectedCustomerStatuses.includes(status.id) ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-blue-100 text-xs h-6"
                      onClick={() => toggleCustomerStatus(status.id)}
                    >
                      {status.name}
                      {selectedCustomerStatuses.includes(status.id) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Business Unit */}
              <div className="border-r border-gray-300 flex-1">
                <Select
                  value={isAllBusinessUnitsSelected ? 'all' : 'custom'}
                  onValueChange={(value) => {
                    if (value === 'all') {
                      selectAllBusinessUnits();
                    }
                  }}
                >
                  <SelectTrigger className="w-full h-9 rounded-none border-0 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Business Unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="all">All Business Units</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {!isAllBusinessUnitsSelected && (
                <div className="flex items-center gap-1 px-3 py-2 border-r border-gray-300 bg-gray-50 min-w-0">
                  {businessUnits.slice(0, 2).map((unit) => (
                    <Badge
                      key={unit.id}
                      variant={selectedBusinessUnits.includes(unit.id) ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-blue-100 text-xs h-6"
                      onClick={() => toggleBusinessUnit(unit.id)}
                    >
                      {unit.name}
                      {selectedBusinessUnits.includes(unit.id) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Products */}
              <div className="border-r border-gray-300 flex-1">
                <Select
                  value={isAllProductsSelected ? 'all' : 'custom'}
                  onValueChange={(value) => {
                    if (value === 'all') {
                      selectAllProducts();
                    }
                  }}
                >
                  <SelectTrigger className="w-full h-9 rounded-none border-0 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Product" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {!isAllProductsSelected && (
                <div className="flex items-center gap-1 px-3 py-2 border-r border-gray-300 bg-gray-50 min-w-0">
                  {products.slice(0, 3).map((product) => (
                    <Badge
                      key={product.id}
                      variant={selectedProducts.includes(product.id) ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-blue-100 text-xs h-6"
                      onClick={() => toggleProduct(product.id)}
                    >
                      {product.name}
                      {selectedProducts.includes(product.id) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Period Filter */}
              <div className="border-r border-gray-300 flex-1">
                <PeriodFilter
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={handlePeriodChange}
                  className="rounded-none border-0 w-full"
                />
              </div>

              {/* Date Range Filter */}
              <div className="flex-1">
                <DateRangeFilterSection
                  dateRange={dateRange}
                  onDateRangeChange={handleCustomDateRangeChange}
                />
              </div>

              {/* Clear All Button */}
              {hasActiveFilters && (
                <div className="border-r border-gray-300">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="h-9 px-3 rounded-none hover:bg-gray-50"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
              )}
            </div>

            {/* Search Button */}
            <SearchButton />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsFilters;