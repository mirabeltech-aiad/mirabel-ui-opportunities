// src/Routers/routeTree.js
import { lazy } from 'react';

const SiteWiseSettingsPage = lazy(() => import('../pages/SiteWiseSettingsPage'));

export const routes = [
  {
    path: '/sitewidesettings',
    component: SiteWiseSettingsPage,
    children: [
      {
        index: true,
        component: SiteWiseSettingsPage,
      },
    ],
  },
];
