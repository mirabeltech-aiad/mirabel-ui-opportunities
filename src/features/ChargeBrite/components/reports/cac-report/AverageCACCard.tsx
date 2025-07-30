
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AverageCACCardProps {
  averageCAC: number;
}

const AverageCACCard: React.FC<AverageCACCardProps> = ({ averageCAC }) => {
  return (
    <Card size="large" className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 mr-2" />
            Average Customer Acquisition Cost
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400 hover:text-ocean-600 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm p-3 bg-white border border-gray-200 shadow-lg rounded-lg text-gray-900">
                <div>
                  <h4 className="font-semibold text-ocean-800 mb-1">Average Customer Acquisition Cost</h4>
                  <p className="text-sm text-gray-600">Average cost to acquire a single customer across all marketing channels and campaigns during the selected period.</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </div>
        <CardDescription>
          Overall cost to acquire a customer across all channels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              ${averageCAC.toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">per customer acquired</p>
          </div>
          
          <div className="flex items-center justify-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-green-600">8.3% improvement from last month</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">7,750</div>
              <div className="text-xs text-gray-600">Customers Acquired</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">$329,375</div>
              <div className="text-xs text-gray-600">Total Spend</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AverageCACCard;
