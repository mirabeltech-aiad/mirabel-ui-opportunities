
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SegmentData } from './types';
import { HelpTooltip } from '@/components';
import { TrendingUp, Users, Target } from 'lucide-react';

interface CrossSellSegmentAnalysisProps {
  data: SegmentData[];
}

const CrossSellSegmentAnalysis: React.FC<CrossSellSegmentAnalysisProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Cross-sell Performance by Customer Segment</CardTitle>
          <HelpTooltip helpId="cross-sell-segment-analysis" />
        </div>
        <CardDescription>Attach rates and revenue impact across segments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {data.map((segment, index) => {
            const configs = [
              { 
                number: 'text-purple-600', 
                subtitle: 'text-purple-500', 
                badge: 'purple',
                icon: Target,
                iconColor: 'text-purple-500'
              },
              { 
                number: 'text-green-600', 
                subtitle: 'text-green-500', 
                badge: 'green',
                icon: TrendingUp,
                iconColor: 'text-green-500'
              },
              { 
                number: 'text-blue-600', 
                subtitle: 'text-blue-500', 
                badge: 'blue',
                icon: Users,
                iconColor: 'text-blue-500'
              }
            ];
            const config = configs[index % configs.length];
            const IconComponent = config.icon;
            
            return (
              <div key={segment.segment} className="text-center p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center mb-2">
                  <IconComponent className={`h-8 w-8 ${config.iconColor}`} />
                </div>
                <div className="text-lg font-semibold text-black">{segment.segment || 'Unknown'}</div>
                <div className={`text-2xl font-bold ${config.number}`}>{segment.attachRate || 0}%</div>
                <div className={`text-sm ${config.subtitle}`}>{segment.avgProducts || 0} avg products</div>
                <Badge variant={config.badge as any} className="mt-2">
                  ${(segment.revenue || 0).toLocaleString()} revenue
                </Badge>
              </div>
            );
          })}
        </div>
        {data.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No segment data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CrossSellSegmentAnalysis;
