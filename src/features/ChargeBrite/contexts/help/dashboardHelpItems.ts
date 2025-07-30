
import { HelpItem } from './types';

export const dashboardHelpItems: HelpItem[] = [
  {
    id: 'dashboard-total-services',
    instruction: 'Total number of microservices and applications currently running in your system infrastructure. This includes all active services being monitored.',
    fieldName: 'Total Services',
    page: 'Dashboard'
  },
  {
    id: 'dashboard-active-connections',
    instruction: 'Number of active database and API connections currently established across all services. Higher numbers indicate increased system activity.',
    fieldName: 'Active Connections',
    page: 'Dashboard'
  },
  {
    id: 'dashboard-api-requests',
    instruction: 'Total number of API requests processed per minute across all services. This metric helps monitor system load and performance.',
    fieldName: 'API Requests',
    page: 'Dashboard'
  },
  {
    id: 'dashboard-uptime',
    instruction: 'System uptime percentage showing how long services have been running without interruption. Higher uptime indicates better system reliability.',
    fieldName: 'System Uptime',
    page: 'Dashboard'
  },
  {
    id: 'service-status-list',
    instruction: 'Real-time monitoring of individual service health including CPU usage, memory consumption, and instance count. Color-coded status indicators show service health.',
    fieldName: 'Service Status Overview',
    page: 'Dashboard'
  },
  {
    id: 'database-status',
    instruction: 'Database performance metrics including connection pool status, query performance, and storage utilization across all database instances.',
    fieldName: 'Database Status',
    page: 'Dashboard'
  }
];
