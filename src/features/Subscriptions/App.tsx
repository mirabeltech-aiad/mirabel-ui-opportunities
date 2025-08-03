
import React, { useEffect } from 'react';
import { EditModeProvider } from "./contexts/EditModeContext";
import { HelpProvider } from "./contexts/HelpContext";
import { ProductFilterProvider } from "./contexts/ProductFilterContext";
import { BusinessModelProvider } from "./contexts/BusinessModelContext";
import { PerformanceAnalytics } from "./utils/performanceAnalytics";

// Error boundary imports
import { GlobalErrorBoundary } from "./components/error-boundaries";

// Core modular system imports
import { ModuleProvider } from "./core/ModuleProvider";
import { NavigationProvider } from "./core/NavigationManager";
import { registerCoreModules } from "./modules";
import { registerCorePages } from "./lib/navigation";
import ModuleLoader from "./core/ModuleLoader";
import AppLayout from "./components/layout/AppLayout";

// Page imports (now treated as modules)
import Admin from "./pages/Admin";
import CirculationDashboard from "./pages/CirculationDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import AdvancedSearch from "./pages/AdvancedSearch";
import SettingsPage from "./components/SettingsPage";
import NotFound from "./pages/NotFound";

// Global registration flag to prevent duplicate registrations
let isChargeBriteRegistered = false;

// Function to ensure ChargeBrite modules are registered only once
const ensureChargeBriteRegistration = () => {
  if (!isChargeBriteRegistered) {
    try {
      PerformanceAnalytics.startMeasurement('ChargeBrite module setup');
      
      // Register all core modules and pages only once
      registerCoreModules();
      registerCorePages();
      
      isChargeBriteRegistered = true;
      PerformanceAnalytics.endMeasurement('ChargeBrite module setup');
      PerformanceAnalytics.markStep('ChargeBrite module ready');
    } catch (error) {
      console.warn('ChargeBrite modules may already be registered:', error instanceof Error ? error.message : error);
      isChargeBriteRegistered = true; // Mark as registered even if there were conflicts
    }
  }
};

// ChargeBrite Context Provider Component
// This integrates with the main app's existing providers instead of creating its own
const ChargeBriteProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    ensureChargeBriteRegistration();
  }, []);

  return (
    <GlobalErrorBoundary enableErrorReporting={true}>
      <BusinessModelProvider>
        <EditModeProvider>
          <HelpProvider>
            <ProductFilterProvider>
              <ModuleProvider>
                <NavigationProvider>
                  {children}
                </NavigationProvider>
              </ModuleProvider>
            </ProductFilterProvider>
          </HelpProvider>
        </EditModeProvider>
      </BusinessModelProvider>
    </GlobalErrorBoundary>
  );
};

// Individual Page Components (wrapped with ChargeBrite providers)
export const ChargeBriteAdmin = () => (
  <ChargeBriteProvider>
    <AppLayout><Admin /></AppLayout>
  </ChargeBriteProvider>
);

export const ChargeBriteCirculation = () => (
  <ChargeBriteProvider>
    <AppLayout><CirculationDashboard /></AppLayout>
  </ChargeBriteProvider>
);

export const ChargeBriteAnalytics = () => (
  <ChargeBriteProvider>
    <AppLayout><AnalyticsDashboard /></AppLayout>
  </ChargeBriteProvider>
);

export const ChargeBriteAdvancedSearch = () => (
  <ChargeBriteProvider>
    <AppLayout><AdvancedSearch /></AppLayout>
  </ChargeBriteProvider>
);

export const ChargeBriteSettings = () => (
  <ChargeBriteProvider>
    <AppLayout><SettingsPage /></AppLayout>
  </ChargeBriteProvider>
);

// Main App component (now just exports the provider and components)
const App = ChargeBriteProvider;

export default App;
