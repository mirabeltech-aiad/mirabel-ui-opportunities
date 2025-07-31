import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ConnectedFilterDropdown, { FilterOption } from '../../../../components/filters/ConnectedFilterDropdown';
import PeriodFilter from '../../../../components/filters/PeriodFilter';
import DateRangeFilterSection from '../../../../components/filters/DateRangeFilterSection';
import { useProductFilter } from '../../../../contexts/ProductFilterContext';
import { Filter, Search } from 'lucide-react';

interface ReportsFilterBarProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  onDateRangeChange?: (startDate?: Date, endDate?: Date) => void;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
  onSearchChange?: (searchTerm: string) => void;
}

const ReportsFilterBar: React.FC<ReportsFilterBarProps> = ({
  dateRange,
  onDateRangeChange,
  selectedPeriod = 'last_30_days',
  onPeriodChange
}) => {
  const { 
    businessUnits,
    products,
    selectedBusinessUnits,
    selectedProducts,
    toggleBusinessUnit,
    toggleProduct
  } = useProductFilter();

  // Convert business units to filter options
  const businessUnitOptions: FilterOption[] = businessUnits.map(unit => ({
    id: unit.id,
    label: unit.name,
    value: unit.id
  }));

  // Convert products to filter options
  const productOptions: FilterOption[] = products.map(product => ({
    id: product.id,
    label: product.name,
    value: product.id
  }));

  // Status options for reports
  const statusOptions: FilterOption[] = [
    { id: 'active', label: 'Active', value: 'active' },
    { id: 'inactive', label: 'Inactive', value: 'inactive' },
    { id: 'draft', label: 'Draft', value: 'draft' },
    { id: 'scheduled', label: 'Scheduled', value: 'scheduled' }
  ];

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handlePeriodChange = (period: string) => {
    onPeriodChange?.(period);
  };

  const handleBusinessUnitChange = (values: string[]) => {
    // Clear current selection and apply new selection
    selectedBusinessUnits.forEach(unitId => toggleBusinessUnit(unitId));
    values.forEach(unitId => {
      if (!selectedBusinessUnits.includes(unitId)) {
        toggleBusinessUnit(unitId);
      }
    });
  };

  const handleProductChange = (values: string[]) => {
    // Clear current selection and apply new selection
    selectedProducts.forEach(productId => toggleProduct(productId));
    values.forEach(productId => {
      if (!selectedProducts.includes(productId)) {
        toggleProduct(productId);
      }
    });
  };

  return (
    <div className="w-full px-4 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section - Filters */}
        <div className="flex items-center gap-4">
          {/* Filters Label */}
          <div className="flex items-center gap-2 text-gray-600">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          {/* Connected Filter Dropdowns */}
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
            {/* Status Filter */}
            <ConnectedFilterDropdown
              label="All Statuses"
              options={statusOptions}
              selectedValues={selectedStatuses}
              onSelectionChange={setSelectedStatuses}
              isAllSelected={selectedStatuses.length === 0}
              onSelectAll={() => setSelectedStatuses([])}
              className="border-0 border-r border-gray-300 rounded-none min-w-[160px]"
            />
            
            {/* Business Units Filter */}
            <ConnectedFilterDropdown
              label="All Business Units"
              options={businessUnitOptions}
              selectedValues={selectedBusinessUnits}
              onSelectionChange={handleBusinessUnitChange}
              isAllSelected={selectedBusinessUnits.length === 0}
              onSelectAll={() => selectedBusinessUnits.forEach(unitId => toggleBusinessUnit(unitId))}
              className="border-0 border-r border-gray-300 rounded-none min-w-[160px]"
            />
            
            {/* Products Filter */}
            <ConnectedFilterDropdown
              label="All Products"
              options={productOptions}
              selectedValues={selectedProducts}
              onSelectionChange={handleProductChange}
              isAllSelected={selectedProducts.length === 0}
              onSelectAll={() => selectedProducts.forEach(productId => toggleProduct(productId))}
              className="border-0 border-r border-gray-300 rounded-none min-w-[160px]"
            />

            {/* Period Filter */}
            <div className="border-0">
              <PeriodFilter
                selectedPeriod={selectedPeriod}
                onPeriodChange={handlePeriodChange}
                className="rounded-none border-0 min-w-[160px]"
              />
            </div>
          </div>

          {/* Date Range Filter */}
          <DateRangeFilterSection
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
          />
        </div>

        {/* Right Section - Filters Button */}
        <Button className="bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500 h-9 px-4">
          <Search className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>
    </div>
  );
};

export default ReportsFilterBar;