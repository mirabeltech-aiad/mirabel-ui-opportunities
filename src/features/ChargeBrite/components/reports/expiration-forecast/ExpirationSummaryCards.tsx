
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock, Calendar } from 'lucide-react';
import { HelpTooltip } from '../../../components';

interface ExpirationSummaryCardsProps {
  expiring30Days: any[];
  expiring60Days: any[];
  expiring90Days: any[];
}

const ExpirationSummaryCards: React.FC<ExpirationSummaryCardsProps> = ({
  expiring30Days,
  expiring60Days,
  expiring90Days
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
            Expiring in 30 Days
            <HelpTooltip helpId="expiring-30-days-forecast" />
          </CardTitle>
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600 mb-1">{expiring30Days.length}</div>
          <p className="text-xs text-gray-600">
            {expiring30Days.filter(s => s.autoRenew).length} auto-renew, {expiring30Days.filter(s => !s.autoRenew).length} manual
          </p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
            Expiring in 60 Days
            <HelpTooltip helpId="expiring-60-days-forecast" />
          </CardTitle>
          <Clock className="h-5 w-5 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600 mb-1">{expiring60Days.length}</div>
          <p className="text-xs text-gray-600">
            {expiring60Days.filter(s => s.autoRenew).length} auto-renew, {expiring60Days.filter(s => !s.autoRenew).length} manual
          </p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
            Expiring in 90 Days
            <HelpTooltip helpId="expiring-90-days-forecast" />
          </CardTitle>
          <Calendar className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600 mb-1">{expiring90Days.length}</div>
          <p className="text-xs text-gray-600">
            {expiring90Days.filter(s => s.autoRenew).length} auto-renew, {expiring90Days.filter(s => !s.autoRenew).length} manual
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpirationSummaryCards;
