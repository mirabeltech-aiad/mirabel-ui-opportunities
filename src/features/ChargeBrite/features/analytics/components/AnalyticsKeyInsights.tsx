import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsOverview } from '../types';
import { HelpTooltip } from '@/components';

interface AnalyticsKeyInsightsProps {
  overview: AnalyticsOverview;
}

const AnalyticsKeyInsights: React.FC<AnalyticsKeyInsightsProps> = ({ overview }) => {
  return (
    <Card size="large" className="bg-white">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Key Insights</CardTitle>
          <HelpTooltip helpId="key-insights" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="font-medium mb-2">Top Performing Segments</div>
            <div className="space-y-1">
              {overview.topPerformingSegments.map((segment, index) => (
                <div key={index} className="text-sm text-gray-600">• {segment}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="font-medium mb-2">Strategic Insights</div>
            <div className="space-y-1">
              {overview.keyInsights.map((insight, index) => (
                <div key={index} className="text-sm text-gray-600">• {insight}</div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsKeyInsights;