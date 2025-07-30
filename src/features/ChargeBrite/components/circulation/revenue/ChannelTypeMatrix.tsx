
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpTooltip } from '@/components';

interface ChannelTypeMatrixProps {
  channelTypeMatrix: Array<{
    channel: string;
    type: string;
    revenue: number;
    subscribers: number;
    arpu: number;
    percentage: number;
  }>;
}

const ChannelTypeMatrix: React.FC<ChannelTypeMatrixProps> = ({ channelTypeMatrix }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800">Attribution by Channel & Type</CardTitle>
          <HelpTooltip helpId="channel-type-matrix" />
        </div>
      </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channelTypeMatrix.map((item) => (
              <div key={`${item.channel}-${item.type}`} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{item.channel} - {item.type}</span>
                  <span className="text-lg font-bold text-blue-600">
                    ${item.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>Subscribers: {item.subscribers}</div>
                  <div>ARPU: ${item.arpu.toFixed(2)}</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
    </Card>
  );
};

export default ChannelTypeMatrix;
