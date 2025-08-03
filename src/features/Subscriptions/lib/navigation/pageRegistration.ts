/**
 * @fileoverview Page Registration - Register all application pages
 * 
 * Centralizes page registration with metadata and routing information.
 * Integrates with the module system and navigation.
 */

import { lazy } from 'react';
import { FileText, BarChart3, TrendingUp, DollarSign, Search, Settings as SettingsIcon, Shield } from 'lucide-react';
import { pageRegistry, createPageConfig } from './pageRegistry';

// Lazy load page components
const CirculationDashboard = lazy(() => import('../../pages/CirculationDashboard'));
const AnalyticsDashboard = lazy(() => import('../../pages/AnalyticsDashboard'));
const AdvancedSearch = lazy(() => import('../../pages/AdvancedSearch'));
const Admin = lazy(() => import('../../pages/Admin'));
const Settings = lazy(() => import('../../components/SettingsPage'));
const NotFound = lazy(() => import('../../pages/NotFound'));

/**
 * Register all core application pages
 */
export const registerCorePages = (): void => {

  // Home/Circulation Dashboard
  pageRegistry.register(createPageConfig({
    id: 'circulation-dashboard',
    name: 'Circulation Dashboard',
    title: 'Circulation Dashboard',
    description: 'Comprehensive circulation analytics and metrics tracking',
    route: '/',
    icon: BarChart3,
    category: 'analytics',
    permissions: ['circulation:read'],
    isPublic: false,
    seoTitle: 'Circulation Dashboard - Media Analytics',
    seoDescription: 'Track and analyze circulation metrics with comprehensive analytics and insights.'
  }, CirculationDashboard, { preload: true }));

  // Alternative circulation route
  pageRegistry.register(createPageConfig({
    id: 'circulation-dashboard-alt',
    name: 'Circulation Dashboard',
    title: 'Circulation Dashboard',
    description: 'Comprehensive circulation analytics and metrics tracking',
    route: '/circulation',
    icon: BarChart3,
    category: 'analytics',
    permissions: ['circulation:read'],
    isPublic: false
  }, CirculationDashboard));

  // Analytics Dashboard
  pageRegistry.register(createPageConfig({
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    title: 'Analytics Dashboard',
    description: 'Advanced analytics and data visualization for comprehensive insights',
    route: '/analytics',
    icon: TrendingUp,
    category: 'analytics',
    permissions: ['analytics:read'],
    breadcrumbs: [
      { label: 'Analytics' }
    ],
    seoTitle: 'Analytics Dashboard - Data Insights',
    seoDescription: 'Comprehensive analytics dashboard with advanced data visualization and insights.'
  }, AnalyticsDashboard));

  // Advanced Search
  pageRegistry.register(createPageConfig({
    id: 'advanced-search',
    name: 'Advanced Search',
    title: 'Advanced Search',
    description: 'Advanced search and filtering capabilities',
    route: '/subscriptions/advanced-search',
    icon: Search,
    category: 'management',
    permissions: ['search:read'],
    breadcrumbs: [
      { label: 'Advanced Search' }
    ],
    seoTitle: 'Advanced Search - Find Anything',
    seoDescription: 'Powerful search and filtering tools to find exactly what you need.'
  }, AdvancedSearch));

  // Administration
  pageRegistry.register(createPageConfig({
    id: 'admin',
    name: 'Administration',
    title: 'System Administration',
    description: 'System administration and management tools',
    route: '/admin',
    icon: Shield,
    category: 'admin',
    permissions: ['admin:read'],
    breadcrumbs: [
      { label: 'Administration' }
    ],
    seoTitle: 'Administration - System Management',
    seoDescription: 'System administration tools and management interfaces.'
  }, Admin));

  // Settings
  pageRegistry.register(createPageConfig({
    id: 'settings',
    name: 'Settings',
    title: 'Application Settings',
    description: 'Configure application settings and preferences',
    route: '/settings',
    icon: SettingsIcon,
    category: 'admin',
    permissions: ['settings:read'],
    breadcrumbs: [
      { label: 'Settings' }
    ],
    seoTitle: 'Settings - Configuration',
    seoDescription: 'Configure application settings and user preferences.'
  }, Settings));

  // 404 Not Found
  pageRegistry.register(createPageConfig({
    id: 'not-found',
    name: 'Page Not Found',
    title: 'Page Not Found',
    description: 'The requested page could not be found',
    route: '/404',
    category: 'system',
    isPublic: true,
    seoTitle: '404 - Page Not Found',
    seoDescription: 'The requested page could not be found.'
  }, NotFound, { layout: 'minimal' }));
};

/**
 * Get all registered pages for routing
 */
export const getRegisteredRoutes = () => {
  return pageRegistry.getRoutes();
};

/**
 * Get navigation items from registered pages
 */
export const getPageNavigationItems = () => {
  return pageRegistry.getNavigationItems();
};