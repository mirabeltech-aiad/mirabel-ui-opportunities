// src/Routers/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { routes } from './routeTree';

const renderRoutes = (routes) =>
  routes.map(({ path, index, component: Component, children }, i) => {
    if (children) {
      return (
        <Route key={i} path={path} element={<Component />}>
          {renderRoutes(children)}
        </Route>
      );
    }

    // For leaf routes, either index or path should be present
    return (
      <Route
        key={i}
        path={path}
        index={index}
        element={Component ? <Component /> : null}
      />
    );
  });

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>{renderRoutes(routes)}</Routes>
    </Suspense>
  );
}
