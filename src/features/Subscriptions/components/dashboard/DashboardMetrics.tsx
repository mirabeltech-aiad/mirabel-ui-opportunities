

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Users, Activity, Zap } from 'lucide-react';
import { HelpTooltip } from '../../components';

interface DashboardMetricsProps {
  metrics: {
    totalServices: number;
    activeConnections: number;
    apiRequests: number;
    uptime: string;
  };
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-ocean-50 to-ocean-100 border-ocean-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-ocean-700">Total Services</CardTitle>
            <HelpTooltip helpId="dashboard-total-services" />
          </div>
          <Server className="h-4 w-4 text-ocean-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-ocean-900">{metrics.totalServices}</div>
          <p className="text-xs text-ocean-600">Active microservices</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-ocean-50 to-ocean-100 border-ocean-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-ocean-700">Active Connections</CardTitle>
            <HelpTooltip helpId="dashboard-active-connections" />
          </div>
          <Users className="h-4 w-4 text-ocean-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-ocean-900">{metrics.activeConnections}</div>
          <p className="text-xs text-ocean-600">Database connections</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-ocean-50 to-ocean-100 border-ocean-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-ocean-700">API Requests</CardTitle>
            <HelpTooltip helpId="dashboard-api-requests" />
          </div>
          <Activity className="h-4 w-4 text-ocean-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-ocean-900">{metrics.apiRequests}</div>
          <p className="text-xs text-ocean-600">Today</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-ocean-50 to-ocean-100 border-ocean-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-ocean-700">System Uptime</CardTitle>
            <HelpTooltip helpId="dashboard-uptime" />
          </div>
          <Zap className="h-4 w-4 text-ocean-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-ocean-900">{metrics.uptime}</div>
          <p className="text-xs text-ocean-600">Last 30 days</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetrics;
