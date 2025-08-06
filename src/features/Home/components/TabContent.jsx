import React, { Suspense, lazy, useMemo, useEffect } from 'react';
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

  // Debug logging to track tab switches
  useEffect(() => {
    console.log('🔄 TabContent: Active tab changed to:', activeTabId);
  }, [activeTabId]);

  // Memoize all tab content to prevent unnecessary re-renders
  const tabContents = useMemo(() => {
    console.log('🔄 TabContent: Rebuilding tab contents for', tabs.length, 'tabs');
    const contentMap = {};
    
    tabs.forEach(tab => {
      console.log('🔄 TabContent: Creating content for tab:', tab.id, 'type:', tab.type, 'component:', tab.component);
      switch (tab.component) {
        case 'Dashboard':
          contentMap[tab.id] = <Dashboard />;
          break;
        case 'NewTab':
          contentMap[tab.id] = <NewTab />;
          break;
        case 'OpportunityForm':
          contentMap[tab.id] = (
            <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
              <OpportunityForm />
            </Suspense>
          );
          break;
        case 'Reports':
          contentMap[tab.id] = (
            <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
              <Reports />
            </Suspense>
          );
          break;
        case 'Settings':
          contentMap[tab.id] = (
            <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
              <Settings />
            </Suspense>
          );
          break;
        default:
          if (tab.type === 'iframe' && tab.url) {
            console.log('🔄 TabContent: Creating iframe for tab:', tab.id, 'URL:', tab.url);
            contentMap[tab.id] = (
              <iframe
                src={tab.url}
                className="w-full h-full border-0 min-w-0"
                title={tab.title}
                data-tab-id={tab.id}
                key={tab.id} // Use tab.id as key to preserve iframe state
                style={{ maxWidth: '100vw', overflow: 'hidden' }}
              />
            );
          } else {
            contentMap[tab.id] = (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                    {tab.title}
                  </h2>
                  <p className="text-gray-500">Content for this tab is not yet implemented</p>
                </div>
              </div>
            );
          }
          break;
      }
    });
    
    console.log('🔄 TabContent: Finished rebuilding tab contents');
    return contentMap;
  }, [tabs]);

  // Log when using cached content
  useEffect(() => {
    console.log('🔄 TabContent: Using cached tab contents (no rebuild needed)');
  }, [tabContents]);

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

  return (
    <div className="h-full bg-white">
      {/* Render all tab contents but only show the active one */}
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`h-full ${activeTabId === tab.id ? 'block' : 'hidden'}`}
        >
          {tabContents[tab.id]}
        </div>
      ))}
    </div>
  );
};

export default TabContent; 