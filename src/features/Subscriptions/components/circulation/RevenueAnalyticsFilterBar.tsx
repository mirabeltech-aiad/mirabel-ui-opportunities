import { useState } from 'react';
import FilterBar from '@/components/filters/FilterBar';
import ConnectedFilterDropdown, { FilterOption } from '@/components/filters/ConnectedFilterDropdown';
import PeriodFilter from '@/components/filters/PeriodFilter';
import DateRangeFilterSection from '@/components/filters/DateRangeFilterSection';

interface RevenueAnalyticsFilterBarProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  onDateRangeChange?: (startDate?: Date, endDate?: Date) => void;
  currentView?: 'table' | 'card';
  onViewChange?: (view: 'table' | 'card') => void;
  onRefresh?: () => void;
  className?: string;
}

const RevenueAnalyticsFilterBar: React.FC<RevenueAnalyticsFilterBarProps> = ({
  dateRange,
  onDateRangeChange,
  currentView = 'table',
  onViewChange,
  onRefresh,
  className = ""
}) => {
  // Sample filter states - these would come from context or props in real implementation
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  // Sample filter options - these would come from API or props
  const channelOptions: FilterOption[] = [
    { id: 'direct', label: 'Direct', value: 'direct' },
    { id: 'social', label: 'Social Media', value: 'social' },
    { id: 'email', label: 'Email Marketing', value: 'email' },
    { id: 'organic', label: 'Organic Search', value: 'organic' },
    { id: 'paid', label: 'Paid Search', value: 'paid' },
    { id: 'referral', label: 'Referral', value: 'referral' }
  ];

  const regionOptions: FilterOption[] = [
    { id: 'north-america', label: 'North America', value: 'north-america' },
    { id: 'europe', label: 'Europe', value: 'europe' },
    { id: 'asia-pacific', label: 'Asia Pacific', value: 'asia-pacific' },
    { id: 'latin-america', label: 'Latin America', value: 'latin-america' },
    { id: 'middle-east', label: 'Middle East', value: 'middle-east' },
    { id: 'africa', label: 'Africa', value: 'africa' }
  ];

  const metricOptions: FilterOption[] = [
    { id: 'revenue', label: 'Revenue', value: 'revenue' },
    { id: 'subscribers', label: 'Subscribers', value: 'subscribers' },
    { id: 'arpu', label: 'ARPU', value: 'arpu' },
    { id: 'ltv', label: 'LTV', value: 'ltv' },
    { id: 'cac', label: 'CAC', value: 'cac' },
    { id: 'churn', label: 'Churn Rate', value: 'churn' }
  ];

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  const handleSettingsClick = () => {
  };

  return (
    <FilterBar
      currentView={currentView}
      onViewChange={onViewChange}
      onRefresh={onRefresh}
      onSettingsClick={handleSettingsClick}
      totalItems={1250} // Sample data
      currentPage={1}
      totalPages={25}
      itemsPerPage={50}
      className={className}
    >
      {/* Connected Filter Group - no gaps between filters */}
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
        <ConnectedFilterDropdown
          label="Channels"
          options={channelOptions}
          selectedValues={selectedChannels}
          onSelectionChange={setSelectedChannels}
          isAllSelected={selectedChannels.length === 0}
          onSelectAll={() => setSelectedChannels([])}
          className="border-0 border-r border-gray-300 rounded-none min-w-[160px]"
        />
        
        <ConnectedFilterDropdown
          label="Regions"
          options={regionOptions}
          selectedValues={selectedRegions}
          onSelectionChange={setSelectedRegions}
          isAllSelected={selectedRegions.length === 0}
          onSelectAll={() => setSelectedRegions([])}
          className="border-0 border-r border-gray-300 rounded-none min-w-[160px]"
        />
        
        <ConnectedFilterDropdown
          label="Metrics"
          options={metricOptions}
          selectedValues={selectedMetrics}
          onSelectionChange={setSelectedMetrics}
          isAllSelected={selectedMetrics.length === 0}
          onSelectAll={() => setSelectedMetrics([])}
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
    </FilterBar>
  );
};

export default RevenueAnalyticsFilterBar;