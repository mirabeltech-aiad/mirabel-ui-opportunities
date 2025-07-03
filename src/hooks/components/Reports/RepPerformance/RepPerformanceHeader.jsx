
import React from 'react';
import { Users, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@OpportunityComponents/ui/select';
import MetricTooltip from '../MetricTooltip';
import { useDesignSystem } from '@/hooks/useDesignSystem';

const RepPerformanceHeader = ({ selectedPeriod, onPeriodChange }) => {
  const { getTitleClass, getInteractiveButtonClass } = useDesignSystem();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className={`text-2xl font-bold ${getTitleClass()} flex items-center gap-2`}>
          <Users className="h-6 w-6 text-blue-600" />
          Rep Performance Analysis
        </h2>
        <p className="text-muted-foreground flex items-center gap-2 mt-1">
          <Filter className="h-4 w-4 text-gray-500" />
          Individual sales representative performance metrics and trends
        </p>
      </div>
      <MetricTooltip
        title="Performance Analysis Period"
        description="Select the time period for analyzing sales representative performance. Different periods provide insights into various performance patterns and trends."
        calculation="All metrics and charts will update to reflect data from the selected time period"
      >
        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <Filter className="h-4 w-4 text-blue-600" />
          <Select value={selectedPeriod} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-60-days">Last 60 Days</SelectItem>
              <SelectItem value="last-90-days">Last 90 Days</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-12-months">Last 12 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="q1-2024">Q1 2024</SelectItem>
              <SelectItem value="q2-2024">Q2 2024</SelectItem>
              <SelectItem value="q3-2024">Q3 2024</SelectItem>
              <SelectItem value="q4-2024">Q4 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </MetricTooltip>
    </div>
  );
};

export default RepPerformanceHeader;
