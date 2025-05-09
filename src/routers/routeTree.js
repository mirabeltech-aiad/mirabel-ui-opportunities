// src/Routers/routeTree.js
import { lazy } from 'react';

const SalesPage = lazy(() => import('../pages/sales/SalesPage'));

export const routes = [
  {
    path: '/',
    component: SalesPage,
    children: [
      {
        index: true,
        component: SalesPage,
      },
    ],
  },
];
