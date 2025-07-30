
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ExpansionInsights: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Average payback period of 2.3 months:</strong> Most expansion deals recover their investment within 3 months
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Upsells perform best:</strong> 137% average ROI with fastest payback at 2.3 months
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>Self-service channel most efficient:</strong> 160% ROI with only 1.9 month payback period
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">
              <strong>62.5% of deals pay back in 2-3 months:</strong> Consistent expansion performance across segments
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpansionInsights;
