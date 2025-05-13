// src/routers/routes.jsx
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { routes } from './routeTree';


// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
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
        element={Component ? <Component /> : null}
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
