
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserX } from 'lucide-react';
import { ChurnReason } from '../../../types/subscription';
import { HelpTooltip } from '../../../components';

interface ChurnReasonsCardProps {
  churnReasons: ChurnReason[];
}

const ChurnReasonsCard: React.FC<ChurnReasonsCardProps> = ({ churnReasons }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <UserX className="h-5 w-5" />
            Top Churn Reasons
          </CardTitle>
          <HelpTooltip helpId="churn-reasons" />
        </div>
        <p className="text-sm text-gray-600">Why subscribers are leaving</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {churnReasons.map((reason, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{reason.reason}</span>
                  <span className="text-sm text-gray-600">{reason.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${reason.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChurnReasonsCard;
