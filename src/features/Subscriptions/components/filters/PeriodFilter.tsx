
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';

export interface PeriodOption {
  key: string;
  label: string;
  description?: string;
  category: string;
}

interface PeriodFilterProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  className?: string;
}

const PERIOD_OPTIONS: PeriodOption[] = [
  // Short-term Periods
  { key: 'yesterday', label: 'Yesterday', category: 'Recent' },
  { key: 'last_7_days', label: 'Last 7 Days', category: 'Recent' },
  { key: 'last_14_days', label: 'Last 14 Days', category: 'Recent' },
  { key: 'last_30_days', label: 'Last 30 Days', category: 'Recent' },
  
  // Calendar-based Periods
  { key: 'this_week', label: 'This Week', category: 'Calendar' },
  { key: 'last_week', label: 'Last Week', category: 'Calendar' },
  { key: 'this_month', label: 'This Month', category: 'Calendar' },
  { key: 'last_month', label: 'Last Month', category: 'Calendar' },
  { key: 'month_to_date', label: 'Month to Date', category: 'Calendar' },
  { key: 'this_quarter', label: 'This Quarter', category: 'Calendar' },
  { key: 'last_quarter', label: 'Last Quarter', category: 'Calendar' },
  { key: 'quarter_to_date', label: 'Quarter to Date', category: 'Calendar' },
  { key: 'this_year', label: 'This Year', category: 'Calendar' },
  { key: 'last_year', label: 'Last Year', category: 'Calendar' },
  { key: 'year_to_date', label: 'Year to Date', category: 'Calendar' },
  
  // Extended Periods
  { key: 'last_3_months', label: 'Last 3 Months', category: 'Extended' },
  { key: 'last_6_months', label: 'Last 6 Months', category: 'Extended' },
  { key: 'last_90_days', label: 'Last 90 Days', category: 'Extended' },
  { key: 'last_12_months', label: 'Last 12 Months', category: 'Extended' },
  { key: 'last_2_years', label: 'Last 2 Years', category: 'Extended' },
  
  // Special Periods
  { key: 'all_time', label: 'All Time', category: 'Special' }
];

const PeriodFilter: React.FC<PeriodFilterProps> = ({
  selectedPeriod,
  onPeriodChange,
  className = ''
}) => {
  const selectedOption = PERIOD_OPTIONS.find(option => option.key === selectedPeriod);

  return (
    <div className={`flex items-center bg-white border border-gray-200 px-3 py-2 w-[160px] ${className}`}>
      <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0 mr-2" />
      <Select value={selectedPeriod} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-full h-auto bg-transparent border-0 focus:ring-0 focus:ring-offset-0 shadow-none p-0">
          <SelectValue placeholder="Period">
            {selectedOption?.label || 'Period'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
          {['Recent', 'Calendar', 'Extended', 'Special'].map(category => {
            const categoryOptions = PERIOD_OPTIONS.filter(option => option.category === category);
            if (categoryOptions.length === 0) return null;
            
            return (
              <div key={category}>
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50">
                  {category}
                </div>
                {categoryOptions.map(option => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </div>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PeriodFilter;
export { PERIOD_OPTIONS };
