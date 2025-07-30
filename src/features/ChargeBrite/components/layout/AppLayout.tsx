
/**
 * App Layout - Main layout component with modular navigation
 */

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ModularNavigation from '@/components/navigation/ModularNavigation';
import { NavigationProvider } from '@/core/NavigationManager';
import { ModuleProvider } from '@/core/ModuleProvider';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/circulation':
        return 'Subscription Reports';
      default:
        return 'Analytics Platform';
    }
  };

  return (
    <ModuleProvider>
      <NavigationProvider>
        <div className="min-h-screen bg-neutral-50">
          {/* Header */}
          <header className="bg-ocean-gradient text-white border-b border-blue-200 sticky top-0 z-50 shadow-sm h-14">
            <div className="px-6 h-full flex items-center">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white text-ocean-800 rounded-sm flex items-center justify-center">
                      <span className="font-bold text-lg">A</span>
                    </div>
                    <h1 className="text-xl font-bold text-white">
                      {getPageTitle()}
                    </h1>
                  </div>
                  <div className="hidden md:block ml-8">
                    <ModularNavigation variant="horizontal" showCategories={false} showBadges={false} />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Add user menu, settings, etc. */}
                </div>
              </div>
            </div>
          </header>

          {/* Mobile Navigation */}
          <div className="md:hidden bg-ocean-gradient border-b border-blue-200">
            <div className="px-6 py-2">
              <ModularNavigation variant="horizontal" showCategories={false} showBadges={false} />
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1">
            <div className="px-6 py-8">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </NavigationProvider>
    </ModuleProvider>
  );
};

export default AppLayout;
