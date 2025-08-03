

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { HelpTooltip } from '../../../components';

const InteractiveTrendsError = () => {
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
      </CardHeader>
      <CardContent>
        <div className="text-red-600 p-4 bg-red-50 rounded-lg">
          Error loading trends data
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveTrendsError;
