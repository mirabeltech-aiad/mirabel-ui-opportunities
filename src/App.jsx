import React, { useLayoutEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/shared/ErrorBoundary";
import { GlobalProvider } from "./store/GlobalContext";
import { AuthProvider } from "./contexts/AuthContext";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import AppRoutes from "./routers/routes.jsx";
import { isDevelopmentMode, initializeDevelopmentEnvironment } from "./utils/developmentHelper";
import { getTopPath } from "./utils/commonHelpers";

const queryClient = new QueryClient();

// Lazy-load Devtools only in development
const ReactQueryDevtools =
  import.meta.env.DEV &&
  lazy(() =>
    import("@tanstack/react-query-devtools").then((mod) => ({
      default: mod.ReactQueryDevtools,
    }))
  );

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="w-12 h-12 rounded-full border-t-2 border-b-2 animate-spin border-primary"></div>
  </div>
);

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  useLayoutEffect(() => {
    const initializeApp = async () => {
      // Initialize environment first (sets up localStorage with session data)
      initializeDevelopmentEnvironment();

      // In production, session data should be initialized by developmentHelper
      // No need for additional session monitoring since we're using static configuration
      if (!isDevelopmentMode()) {
        console.log('✅ Production mode: Using static domain configuration');
      }
    };

    initializeApp();
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <AuthProvider>
            <TooltipProvider>
              <BrowserRouter basename="/app">
                <div className="min-h-screen bg-background font-sans antialiased">
                  <AppRoutes />
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
          {import.meta.env.DEV && (
            <Suspense fallback={null}>
              <ReactQueryDevtools initialIsOpen={false} />
            </Suspense>
          )}
        </GlobalProvider>
      </QueryClientProvider>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;