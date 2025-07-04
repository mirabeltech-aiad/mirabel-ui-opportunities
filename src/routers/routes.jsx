// src/routers/routes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { routes } from "./routeTree";
import { Layout } from "../components/layout/Layout";
import AuthCallback from "../components/auth/AuthCallback";

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="w-12 h-12 rounded-full border-t-2 border-b-2 animate-spin border-primary"></div>
  </div>
);

// Route rendering helper (simplified, matches mirabel.mm.ui)
const renderRoutes = (routes) =>
  routes.map(({ path, component: Component, children }, i) => (
    <Route key={i} path={path} element={<Component />}>
      {children && renderRoutes(children)}
    </Route>
  ));

// Main routing component
export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Authentication routes */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Default redirect to opportunities */}
        <Route path="/" element={<Navigate to="/opportunities" replace />} />

        {/* Application routes */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>{renderRoutes(routes)}</Routes>
            </Layout>
          }
        />

        {/* Catch-all redirect for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
