import React, { Suspense, lazy } from 'react';
import { useHome } from '../contexts/HomeContext';
import Dashboard from './Dashboard';
import NewTab from './NewTab';
import { withBaseUrl } from '@/lib/utils';

// Lazy load components for better performance
const OpportunityForm = lazy(() => import('./OpportunityForm'));
const Reports = lazy(() => import('./Reports'));
const Settings = lazy(() => import('./Settings'));

const TabContent = () => {
  const { tabs, activeTabId } = useHome();
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  if (!activeTab) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Tab Selected</h2>
          <p className="text-gray-500">Please select a tab to view content</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab.component) {
      case 'Dashboard':
        return <Dashboard />;
      case 'NewTab':
        return <NewTab />;
      case 'OpportunityForm':
        return <OpportunityForm />;
      case 'Reports':
        return <Reports />;
      case 'Settings':
        return <Settings />;
      default:
        if (activeTab.type === 'iframe' && activeTab.url) {
          return (
            <iframe
              src={activeTab.url}
              className="w-full h-full border-0"
              title={activeTab.title}
              data-tab-id={activeTab.id}
            />
          );
        }
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                {activeTab.title}
              </h2>
              <p className="text-gray-500">Content for this tab is not yet implemented</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-white">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading {activeTab.title}...</p>
            </div>
          </div>
        }
      >
        {renderContent()}
      </Suspense>
    </div>
  );
};

export default TabContent; 