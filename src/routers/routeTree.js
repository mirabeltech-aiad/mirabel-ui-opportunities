// src/Routers/routeTree.js
import { lazy } from 'react';
import Home from '../features/Home';

const WelcomePage = lazy(() => import('../pages/Welcome'));

export const routes = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/home',
    component: Home,
    exact: true,
  },
  {
    path: '/welcome',
    component: WelcomePage,
    exact: true,
  }
];
