
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EditModeProvider } from "@/contexts/EditModeContext";
import { HelpProvider } from "@/contexts/HelpContext";
import { ProductFilterProvider } from "@/contexts/ProductFilterContext";
import { BusinessModelProvider } from "@/contexts/BusinessModelContext";
import { PerformanceAnalytics } from "@/utils/performanceAnalytics";

// Error boundary imports
import { GlobalErrorBoundary } from "@/components/error-boundaries";

// Core modular system imports
import { ModuleProvider } from "@/core/ModuleProvider";
import { NavigationProvider } from "@/core/NavigationManager";
import { registerCoreModules } from "@/modules";
import { registerCorePages } from "@/lib/navigation";
import ModuleLoader from "@/core/ModuleLoader";
import AppLayout from "@/components/layout/AppLayout";
import { HelmetProvider } from 'react-helmet-async';

// Page imports (now treated as modules)
import Admin from "./pages/Admin";
import CirculationDashboard from "./pages/CirculationDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import PricingAnalysis from "./pages/PricingAnalysis";
import AdvancedSearch from "./pages/AdvancedSearch";
import Reports from "./pages/Reports";
import SettingsPage from "@/components/SettingsPage";
import NotFound from "./pages/NotFound";

// Start measuring app initialization
PerformanceAnalytics.startMeasurement('App initialization');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Initialize the modular system
    PerformanceAnalytics.startMeasurement('Module system setup');
    
    // Register all core modules and pages
    registerCoreModules();
    registerCorePages();
    
    PerformanceAnalytics.endMeasurement('Module system setup');
    PerformanceAnalytics.endMeasurement('App initialization');
    PerformanceAnalytics.markStep('App mounted and ready');
  }, []);

  return (
    <GlobalErrorBoundary enableErrorReporting={true}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <BusinessModelProvider>
              <EditModeProvider>
                <HelpProvider>
                  <ProductFilterProvider>
                    <ModuleProvider>
                    <BrowserRouter>
                      <NavigationProvider>
                      <Toaster />
                      <Sonner />
                      <Routes>
                      {/* Root route - can be a dashboard or module selector */}
                      <Route path="/" element={<AppLayout><CirculationDashboard /></AppLayout>} />
                      
                      {/* Individual module routes */}
                      <Route path="/admin" element={<AppLayout><Admin /></AppLayout>} />
                      <Route path="/circulation" element={<AppLayout><CirculationDashboard /></AppLayout>} />
                      <Route path="/analytics" element={<AppLayout><AnalyticsDashboard /></AppLayout>} />
                      <Route path="/pricing" element={<AppLayout><PricingAnalysis /></AppLayout>} />
                      <Route path="/advanced-search" element={<AppLayout><AdvancedSearch /></AppLayout>} />
                      <Route path="/reports" element={<AppLayout><Reports /></AppLayout>} />
                      <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
                      
                      {/* Dynamic module loading route */}
                      <Route path="/module/:moduleId" element={
                        <AppLayout>
                          <ModuleLoader moduleId={window.location.pathname.split('/')[2]} />
                        </AppLayout>
                      } />
                      
                      {/* Catch-all route */}
                      <Route path="*" element={<NotFound />} />
                      </Routes>
                      </NavigationProvider>
                    </BrowserRouter>
                    </ModuleProvider>
                  </ProductFilterProvider>
                </HelpProvider>
              </EditModeProvider>
            </BusinessModelProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
