
/**
 * Module Registration - Register all application modules
 */

import { lazy } from 'react';
import { moduleRegistry } from '../core/ModuleRegistry';
import { createModuleTemplate } from '../core/BaseModule';

// Lazy load module components
const CirculationModule = lazy(() => import('../pages/CirculationDashboard'));
const AnalyticsModule = lazy(() => import('../pages/AnalyticsDashboard'));
const AdminModule = lazy(() => import('../pages/Admin'));
const AdvancedSearchModule = lazy(() => import('../pages/AdvancedSearch'));

// Register core modules
export const registerCoreModules = () => {

  // Circulation Dashboard Module
  moduleRegistry.register(createModuleTemplate({
    id: 'circulation-dashboard-module',
    name: 'Circulation Dashboard',
    description: 'Comprehensive circulation analytics and metrics tracking',
    version: '1.0.0',
    route: '/circulation',
    icon: 'BarChart3',
    category: 'analytics',
    permissions: ['circulation:read']
  }, CirculationModule));

  // Analytics Dashboard Module
  moduleRegistry.register(createModuleTemplate({
    id: 'analytics-dashboard-module',
    name: 'Analytics Dashboard',
    description: 'Advanced analytics and data visualization',
    version: '1.0.0',
    route: '/analytics',
    icon: 'TrendingUp',
    category: 'analytics',
    permissions: ['analytics:read']
  }, AnalyticsModule));

  // Advanced Search Module
  moduleRegistry.register(createModuleTemplate({
    id: 'advanced-search-module',
    name: 'Advanced Search',
    description: 'Advanced search and filtering capabilities',
    version: '1.0.0',
    route: '/subscriptions/advanced-search',
    icon: 'Search',
    category: 'management',
    permissions: ['search:read']
  }, AdvancedSearchModule));

  // Admin Module
  moduleRegistry.register(createModuleTemplate({
    id: 'admin-module',
    name: 'Administration',
    description: 'System administration and management',
    version: '1.0.0',
    route: '/admin',
    icon: 'Settings',
    category: 'admin',
    permissions: ['admin:read']
  }, AdminModule));
};

// Export for external module creation
export { moduleRegistry } from '../core/ModuleRegistry';
export { createModuleTemplate } from '../core/BaseModule';
