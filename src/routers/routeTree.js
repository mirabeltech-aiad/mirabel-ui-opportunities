// src/Routers/routeTree.js
import { lazy } from 'react';

const WelcomePage = lazy(() => import('../pages/Welcome'));
const SiteWiseSettingsPage = lazy(() => import('../pages/SiteWiseSettingsPage'));
const New = lazy(() => import('../features/sales/NewUI'));

export const routes = [
  {
    path: '/',
    component: WelcomePage,
    children: [],
    exact: true,
  },
  {
    path: '/sitewidesettings',
    component: SiteWiseSettingsPage,
    exact: true,
  },
  {
    path: '/dashboard',
    component: New,
    exact: true,
  }
];
