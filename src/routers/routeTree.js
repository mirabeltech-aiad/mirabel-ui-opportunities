// src/Routers/routeTree.js
import { lazy } from 'react';

const WelcomePage = lazy(() => import('../pages/Welcome'));
const SiteWideSettingsPage = lazy(() => import('../pages/SiteWideSettingsPage'));

export const routes = [
  {
    path: '/',
    component: WelcomePage,
    children: [],
    exact: true,
  },
  {
    path: '/sitewidesettings',
    component: SiteWideSettingsPage,
    exact: true,
  }
];
