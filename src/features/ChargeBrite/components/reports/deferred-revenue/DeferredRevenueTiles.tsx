
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Calendar, FileText, Target } from 'lucide-react';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface DeferredRevenueTilesProps {
  currentDeferredRevenue: number;
  totalRecognizedRevenue: number;
  recognitionRate: number;
  activeContractsCount: number;
  deferredGrowth: number;
}

const DeferredRevenueTiles: React.FC<DeferredRevenueTilesProps> = ({
  currentDeferredRevenue,
  totalRecognizedRevenue,
  recognitionRate,
  activeContractsCount,
  deferredGrowth
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
            Current Deferred Revenue
            <HelpTooltip helpId="current-deferred-revenue" />
          </CardTitle>
          <DollarSign className="h-5 w-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600 mb-1">${(currentDeferredRevenue / 1000).toFixed(0)}K</div>
          <p className="text-xs text-gray-600">pending recognition</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
            Recognized Revenue
            <HelpTooltip helpId="total-recognized-revenue" />
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 mb-1">${(totalRecognizedRevenue / 1000).toFixed(0)}K</div>
          <p className="text-xs text-gray-600">already recognized</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
            Recognition Rate
            <HelpTooltip helpId="recognition-rate" />
          </CardTitle>
          <Target className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600 mb-1">{recognitionRate.toFixed(1)}%</div>
          <p className="text-xs text-gray-600">completion ratio</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
            Active Contracts
            <HelpTooltip helpId="active-contracts-count" />
          </CardTitle>
          <FileText className="h-5 w-5 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600 mb-1">{activeContractsCount}</div>
          <p className="text-xs text-gray-600">contracts tracked</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-2">
            Deferred Growth
            <HelpTooltip helpId="deferred-growth" />
          </CardTitle>
          <Calendar className="h-5 w-5 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-rose-600 mb-1">{deferredGrowth >= 0 ? '+' : ''}{deferredGrowth.toFixed(1)}%</div>
          <p className="text-xs text-gray-600">month-over-month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeferredRevenueTiles;
