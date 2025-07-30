
import React from 'react';
import DashboardMetrics from './DashboardMetrics';
import ServiceStatusList from './ServiceStatusList';
import DatabaseStatus from './DatabaseStatus';
import QuickActions from './QuickActions';
import { DashboardErrorBoundary } from '../../components/error-boundaries';

interface DashboardOverviewProps {
  metrics: {
    totalServices: number;
    activeConnections: number;
    apiRequests: number;
    uptime: string;
  };
  services: Array<{
    name: string;
    status: 'healthy' | 'warning' | 'error';
    instances: number;
    cpu: string;
    memory: string;
  }>;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ metrics, services }) => {
  return (
    <DashboardErrorBoundary dashboardType="circulation">
      <div className="space-y-6">
        {/* Extracted metrics component for clarity */}
        <DashboardMetrics metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Extracted service status component for clarity */}
          <ServiceStatusList services={services} />
          
          {/* Extracted database status component for clarity */}
          <DatabaseStatus />
        </div>

        {/* Extracted quick actions component for clarity */}
        <QuickActions />
      </div>
    </DashboardErrorBoundary>
  );
};

export default DashboardOverview;
