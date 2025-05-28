// src/Routers/routeTree.js
import { lazy } from 'react';

const WelcomePage = lazy(() => import('../pages/Welcome'));
const SiteWiseSettingsPage = lazy(() => import('../pages/SiteWiseSettingsPage'));

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
  }
];
