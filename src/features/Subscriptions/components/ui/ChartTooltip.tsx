
import React from 'react';
import { cn } from '@/lib/utils';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number | string;
    name: string;
    color: string;
    dataKey: string;
    unit?: string;
  }>;
  label?: string;
  className?: string;
  showComparison?: boolean;
  comparisonData?: {
    value: number | string;
    label: string;
    trend: 'up' | 'down' | 'neutral';
  };
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  className,
  showComparison,
  comparisonData
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const formatValue = (value: number | string, unit?: string) => {
    if (typeof value === 'number') {
      if (unit === '%') {
        return `${value.toFixed(1)}%`;
      }
      if (unit === '$' || unit === '₹') {
        return `${unit}${value.toLocaleString()}`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <div
      className={cn(
        "bg-white rounded-md shadow-md border border-ocean-200 px-3 py-2",
        "animate-fade-in transition-opacity duration-200",
        className
      )}
    >
      {label && (
        <p className="text-sm font-medium text-ocean-800 mb-1">
          {label}
        </p>
      )}
      
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700">
                {entry.name}:
              </span>
            </div>
            <span className="text-base font-semibold text-black">
              {formatValue(entry.value, entry.unit)}
            </span>
          </div>
        ))}
      </div>

      {showComparison && comparisonData && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">{comparisonData.label}:</span>
            <span className={cn("font-medium", getTrendColor(comparisonData.trend))}>
              {getTrendIcon(comparisonData.trend)} {formatValue(comparisonData.value)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartTooltip;
