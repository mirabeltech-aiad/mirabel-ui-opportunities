
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpTooltip } from '@/components';

interface GeographicAttributionProps {
  geographic: Array<{
    region: string;
    revenue: number;
    percentage: number;
    topChannels: string[];
  }>;
}

const GeographicAttribution: React.FC<GeographicAttributionProps> = ({ geographic }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Geographic Attribution</CardTitle>
          <HelpTooltip helpId="geographic-attribution" />
        </div>
      </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {geographic.map((geo, index) => {
              const configs = [
                { 
                  percentage: 'text-blue-600', 
                  revenue: 'text-emerald-600', 
                  subtitle: 'text-blue-300'
                },
                { 
                  percentage: 'text-purple-600', 
                  revenue: 'text-green-600', 
                  subtitle: 'text-purple-300'
                },
                { 
                  percentage: 'text-rose-600', 
                  revenue: 'text-blue-600', 
                  subtitle: 'text-rose-300'
                },
                { 
                  percentage: 'text-amber-600', 
                  revenue: 'text-purple-600', 
                  subtitle: 'text-amber-300'
                }
              ];
              const config = configs[index % configs.length];
              
              return (
                <div key={geo.region} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 bg-white">
                  <div>
                    <div className="font-medium text-black">{geo.region}</div>
                    <div className="text-sm text-gray-500">
                      {geo.topChannels.join(', ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${config.revenue}`}>
                      ${geo.revenue.toLocaleString()}
                    </div>
                    <div className={`text-sm ${config.subtitle}`}>
                      {geo.percentage.toFixed(1)}% of total
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
    </Card>
  );
};

export default GeographicAttribution;
