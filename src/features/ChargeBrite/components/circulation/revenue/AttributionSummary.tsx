
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpTooltip } from '@/components';

interface AttributionSummaryProps {
  summary: {
    totalAttributedRevenue: number;
    attributionConfidence: number;
    averageTouchpoints: number;
  };
}

const AttributionSummary: React.FC<AttributionSummaryProps> = ({ summary }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Attribution Model Summary</CardTitle>
          <HelpTooltip helpId="attribution-summary" />
        </div>
      </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                ${summary.totalAttributedRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">Total Attributed Revenue</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {summary.attributionConfidence.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500 mt-1">Attribution Confidence</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {summary.averageTouchpoints.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500 mt-1">Avg. Touchpoints</div>
            </div>
          </div>
        </CardContent>
    </Card>
  );
};

export default AttributionSummary;
