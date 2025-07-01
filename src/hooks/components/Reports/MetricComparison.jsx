
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react';

const MetricComparison = ({ currentPeriod, previousPeriod, onPeriodChange }) => {
  const [viewType, setViewType] = useState('comparison');

  const periods = [
    { value: "q1-2024", label: "Q1 2024" },
    { value: "last-90-days", label: "Last 90 Days" },
    { value: "last-6-months", label: "Last 6 Months" },
    { value: "ytd", label: "Year to Date" },
    { value: "last-year", label: "Last Year" }
  ];

  const getComparisonData = () => {
    // This would typically come from your data calculations
    return {
      revenue: { current: 2.8, previous: 2.1, change: 33.3 },
      deals: { current: 24, previous: 18, change: 33.3 },
      winRate: { current: 23.5, previous: 21.2, change: 10.8 },
      avgDeal: { current: 117000, previous: 112000, change: 4.5 }
    };
  };

  const comparisonData = getComparisonData();

  const formatValue = (key, value) => {
    switch (key) {
      case 'revenue': return `$${value}M`;
      case 'deals': return value.toString();
      case 'winRate': return `${value}%`;
      case 'avgDeal': return `$${(value / 1000).toFixed(0)}K`;
      default: return value;
    }
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? TrendingUp : TrendingDown;
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between bg-gray-50">
        <CardTitle className="text-ocean-800">Period Comparison</CardTitle>
        <div className="flex gap-2">
          <Button
            variant={viewType === 'comparison' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('comparison')}
            className={viewType === 'comparison' 
              ? 'bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500' 
              : 'border-ocean-500 text-ocean-500 hover:bg-ocean-50'}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Compare
          </Button>
          <Button
            variant={viewType === 'breakdown' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('breakdown')}
            className={viewType === 'breakdown' 
              ? 'bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500' 
              : 'border-ocean-500 text-ocean-500 hover:bg-ocean-50'}
          >
            <PieChart className="h-4 w-4 mr-2" />
            Breakdown
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {viewType === 'comparison' ? (
          <div className="space-y-4">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Current Period</p>
                <Badge variant="outline" className="text-ocean-600 border-ocean-600">
                  {periods.find(p => p.value === currentPeriod)?.label}
                </Badge>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">vs Previous Period</p>
                <Badge variant="outline" className="text-gray-600 border-gray-600">
                  Comparable timeframe
                </Badge>
              </div>
            </div>
            
            {Object.entries(comparisonData).map(([key, data]) => {
              const ChangeIcon = getChangeIcon(data.change);
              return (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium text-black capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-blue-600">{formatValue(key, data.current)}</span>
                      <span className="text-sm text-muted-foreground">
                        vs {formatValue(key, data.previous)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChangeIcon className={`h-4 w-4 ${getChangeColor(data.change)}`} />
                    <span className={`font-semibold ${getChangeColor(data.change)}`}>
                      {data.change >= 0 ? '+' : ''}{data.change}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <PieChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Detailed breakdown view coming soon...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricComparison;
