
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Zap, MousePointer } from 'lucide-react';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface RenewalData {
  firstTimeRenewals: {
    total: number;
    successful: number;
    rate: number;
  };
  multiTimeRenewals: {
    total: number;
    successful: number;
    rate: number;
  };
  autoRenewals: {
    total: number;
    successful: number;
    rate: number;
  };
  manualRenewals: {
    total: number;
    successful: number;
    rate: number;
  };
}

interface RenewalMetricsCardsProps {
  renewalData: RenewalData;
}

const RenewalMetricsCards = ({ renewalData }: RenewalMetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">First-Time Renewals</CardTitle>
            <HelpTooltip helpId="first-time-renewals" />
          </div>
          <Users className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {renewalData.firstTimeRenewals.rate.toFixed(1)}%
          </div>
          <p className="text-xs text-gray-600">
            {renewalData.firstTimeRenewals.successful} of {renewalData.firstTimeRenewals.total} renewals
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Multi-Time Renewals</CardTitle>
            <HelpTooltip helpId="multi-time-renewals" />
          </div>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {renewalData.multiTimeRenewals.rate.toFixed(1)}%
          </div>
          <p className="text-xs text-gray-600">
            {renewalData.multiTimeRenewals.successful} of {renewalData.multiTimeRenewals.total} renewals
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Auto-Renewals</CardTitle>
            <HelpTooltip helpId="auto-renewals" />
          </div>
          <Zap className="h-5 w-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {renewalData.autoRenewals.rate.toFixed(1)}%
          </div>
          <p className="text-xs text-gray-600">
            {renewalData.autoRenewals.successful} of {renewalData.autoRenewals.total} renewals
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Manual Renewals</CardTitle>
            <HelpTooltip helpId="manual-renewals" />
          </div>
          <MousePointer className="h-5 w-5 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-rose-600 mb-1">
            {renewalData.manualRenewals.rate.toFixed(1)}%
          </div>
          <p className="text-xs text-gray-600">
            {renewalData.manualRenewals.successful} of {renewalData.manualRenewals.total} renewals
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RenewalMetricsCards;
