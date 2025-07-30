
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpTooltip } from '@/components';

const AnalysisSummary = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Renewal Analysis Summary</CardTitle>
          <HelpTooltip helpId="renewal-analysis-summary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Key Insights</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Multi-time renewals perform 15% better than first-time</li>
                <li>• Auto-renewals have 52% higher success rate than manual</li>
                <li>• Phone campaigns show highest conversion at 80%</li>
                <li>• Email campaigns drive highest volume</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Increase auto-renewal adoption rate</li>
                <li>• Focus phone campaigns on high-value segments</li>
                <li>• Optimize email campaign messaging</li>
                <li>• Implement retention programs for first-time renewers</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisSummary;
