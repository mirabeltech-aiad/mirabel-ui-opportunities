// src/Routers/routeTree.js
import { lazy } from 'react';

const HomePage = lazy(() => import('../pages/HomePage'));
const WelcomePage = lazy(() => import('../pages/Welcome'));

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
  }
];
