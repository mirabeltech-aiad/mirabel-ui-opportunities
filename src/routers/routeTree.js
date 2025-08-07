// src/Routers/routeTree.js
import { lazy } from 'react';

const HomePage = lazy(() => import('../pages/HomePage'));
const WelcomePage = lazy(() => import('../pages/Welcome'));
// ChargeBrite module components
const SubscriptionsCirculation = lazy(() => import('../features/Subscriptions/App').then(module => ({ default: module.ChargeBriteCirculation })));
const SubscriptionsAnalytics = lazy(() => import('../features/Subscriptions/App').then(module => ({ default: module.ChargeBriteAnalytics })));
const SubscriptionsAdvancedSearch = lazy(() => import('../features/Subscriptions/App').then(module => ({ default: module.ChargeBriteAdvancedSearch })));
const SubscriptionsReports = lazy(() => import('../features/Subscriptions/App').then(module => ({ default: module.ChargeBriteReports })));
const SubscriptionsAdmin = lazy(() => import('../features/Subscriptions/App').then(module => ({ default: module.ChargeBriteAdmin })));
const SubscriptionsSettings = lazy(() => import('../features/Subscriptions/App').then(module => ({ default: module.ChargeBriteSettings })));

export const routes = [
  {
    path: '/',
    component: HomePage,
    exact: true,
  },
  {
    path: '/home',
    component: HomePage,
    exact: true,
  },
  {
    path: '/welcome',
    component: WelcomePage,
    exact: true,
  },




  {
    path: '/subscriptions/circulation',
    component: SubscriptionsCirculation,
    exact: true,
  },
  {
    path: '/subscriptions/analytics',
    component: SubscriptionsAnalytics,
    exact: true,
  },
  {
    path: '/subscriptions/advanced-search',
    component: SubscriptionsAdvancedSearch,
    exact: true,
  },
  {
    path: '/subscriptions/reports',
    component: SubscriptionsReports,
    exact: true,
  },
  {
    path: '/subscriptions/admin',
    component: SubscriptionsAdmin,
    exact: true,
  },
  {
    path: '/subscriptions/settings',
    component: SubscriptionsSettings,
    exact: true,
  },
];
