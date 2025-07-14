import React, { useLayoutEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/shared/ErrorBoundary";
import { GlobalProvider } from "./store/GlobalContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SearchProvider } from "./features/Opportunity/contexts/SearchContext";
import { EditModeProvider } from "./features/Opportunity/contexts/EditModeContext";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import AppRoutes from "./routers/routes.jsx";
import {
  getSessionValue,
  checkAuthenticationStatus,
  performLoginRedirect,
} from "./utils/sessionHelpers";
import {
  isDevelopmentMode,
  initializeDevelopmentEnvironment,
  createHelperIframe,
  devURL,
  isWindowTopAccessible,
} from "./utils/developmentHelper";

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
    // Authentication check (matches mirabel.mm.ui pattern exactly)
    const isAuthCallback = window.location.pathname.startsWith(
      "/ui60/auth/callback"
    );
    const isBlankPage = window.location.pathname === "/ui60/blank";

    // Load Message Localizer - similar to mirabel.mm.ui pattern
    const loadMessageLocalizerWrapper = (urlPrefix = "") => {
      // Re-use the Client Message from Home Page when available
      if (
        !isWindowTopAccessible() ||
        !Object.prototype.hasOwnProperty.call(window.top, "MMClientMessage")
      ) {
        const script = document.createElement("script");
        const contentVersion = getSessionValue("ContentVersion") || "1.0.0";
        script.src = `${urlPrefix}/intranet/localizer.js.axd?v=${contentVersion}`;
        script.addEventListener("load", () => {
          setIsLoaded(true);
        });
        script.addEventListener("error", () => {
          setIsLoaded(true); // Continue even if localizer fails
        });
        document.querySelector("body").appendChild(script);
      } else {
        setIsLoaded(true);
      }
    };

    const isNotBlankPage = window.location.pathname !== "/ui60/blank";

    if (isDevelopmentMode()) {
      // Initialize development environment FIRST
      initializeDevelopmentEnvironment();

      // Create helper iframe for API communication
      const cleanupIframe = createHelperIframe();

      // Load message localizer with development URL
      if (isNotBlankPage) {
        loadMessageLocalizerWrapper(devURL);
      } else {
        setIsLoaded(true);
      }

      // Cleanup function
      return () => {
        if (cleanupIframe) {
          cleanupIframe();
        }
      };
    } else {
      // Production mode - check authentication and redirect if needed
      const handleProductionMode = async () => {
        if (!isAuthCallback && !isBlankPage) {
          const authStatus = await checkAuthenticationStatus();
          if (authStatus.shouldRedirect) {
            performLoginRedirect();
            return;
          }
        }

        // Production mode - load from current domain
        if (isNotBlankPage) {
          const currentDomain =
            import.meta.env.REACT_APP_API_BASE_URL || window.location.origin;
          loadMessageLocalizerWrapper(currentDomain);
        } else {
          setIsLoaded(true);
        }
      };

      handleProductionMode();
    }
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
    >
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <AuthProvider>
            <TooltipProvider>
              <BrowserRouter basename="/ui60">
                <SearchProvider>
                  <EditModeProvider>
                    <div className="min-h-screen bg-background font-sans antialiased">
                      {isLoaded ? <AppRoutes /> : <LoadingSpinner />}
                    </div>
                  </EditModeProvider>
                </SearchProvider>
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
