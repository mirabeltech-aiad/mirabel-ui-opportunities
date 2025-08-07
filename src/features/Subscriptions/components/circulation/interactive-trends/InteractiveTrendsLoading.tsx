
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { HelpTooltip } from '../../../components';

const InteractiveTrendsLoading = () => {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg border border-gray-200">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Interactive Circulation Trends
          </CardTitle>
          <HelpTooltip helpId="circulation-trends" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] bg-gray-100 rounded animate-pulse"></div>
      </CardContent>
    </Card>
  );
};

export default InteractiveTrendsLoading;
