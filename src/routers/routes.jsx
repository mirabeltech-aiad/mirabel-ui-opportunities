// src/routers/routes.jsx
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { routes } from './routeTree';
import { Layout } from '@/components/layout/Layout';

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="w-12 h-12 rounded-full border-t-2 border-b-2 animate-spin border-primary"></div>
  </div>
);

// Route rendering helper
const renderRoutes = (routes) =>
  routes.map(({ path, index, component: Component, children }, i) => {
    if (children) {
      return (
        <Route key={i} path={path} element={<Component />}>
          {renderRoutes(children)}
        </Route>
      );
    }

    return (
      <Route
        key={i}
        path={path}
        index={index}
        element={
          Component ? (
            <Layout>
              <Component />
            </Layout>
          ) : null
        }
      />
    );
  });

// Main routing component
export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>{renderRoutes(routes)}</Routes>
    </Suspense>
  );
}
