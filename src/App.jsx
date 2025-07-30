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
    // Initialize environment first (sets up localStorage in dev mode)
    if (isDevelopmentMode()) {
      initializeDevelopmentEnvironment();
    }

    // Check authentication - redirect if MMClientVars is null (only in production)
    const mmClientVars = localStorage.getItem("MMClientVars");
    if (!mmClientVars && !isDevelopmentMode()) {
      window.location.href = `${window.location.origin}/intranet/home/login.aspx`;
      return;
    }
    
    // Set loaded state after brief delay to show loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
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
              <BrowserRouter basename="/ui60">
                <div className="min-h-screen bg-background font-sans antialiased">
                  {isLoaded ? <AppRoutes /> : <LoadingSpinner />}
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