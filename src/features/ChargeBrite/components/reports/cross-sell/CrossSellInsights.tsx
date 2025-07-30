
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpTooltip } from '@/components';

const CrossSellInsights: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle>Key Insights</CardTitle>
          <HelpTooltip helpId="cross-sell-insights" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Enterprise customers have highest attach rate:</strong> 85% vs 52% for SMB customers
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Analytics Module is the most popular cross-sell:</strong> 75% success rate across all segments
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Optimal cross-sell timing is 31-60 days:</strong> 37.5% of successful cross-sells happen in this window
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Cross-sell customers generate 35% more revenue</strong> than single-product customers
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrossSellInsights;
