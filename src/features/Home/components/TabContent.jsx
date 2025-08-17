import React, { Suspense, lazy, useMemo, useEffect, useState } from 'react';
import { useHome } from '../contexts/HomeContext';
import Dashboard from './Dashboard';
import NewTab from './NewTab';
import InboxPage from './InboxPage';
import Prospecting from './Prospecting';
import { withBaseUrl } from '@/lib/utils';

// Lazy load components for better performance
const OpportunityForm = lazy(() => import('./OpportunityForm'));
const Reports = lazy(() => import('./Reports'));
const Settings = lazy(() => import('./Settings'));

const TabContent = () => {
  const { tabs, activeTabId } = useHome();
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  
  // State to track iframe reload triggers for specific tabs
  const [iframeReloadKeys, setIframeReloadKeys] = useState({});

  // Function to reload a specific iframe
  const reloadIframe = (tabId) => {
    setIframeReloadKeys(prev => ({
      ...prev,
      [tabId]: Date.now() // Use timestamp as unique key to force reload
    }));
  };

  // Expose reload function globally so TabNavigation can call it
  useEffect(() => {
    window.reloadTabIframe = reloadIframe;
    return () => {
      delete window.reloadTabIframe;
    };
  }, []);

  // Debug logging to track tab switches
  useEffect(() => {
   
  }, [activeTabId]);

  // Memoize all tab content to prevent unnecessary re-renders
  const tabContents = useMemo(() => {
    
    const contentMap = {};
    
    tabs.forEach(tab => {
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
        case 'InboxPage':
          contentMap[tab.id] = (
            <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
              <InboxPage />
            </Suspense>
          );
          break;
          case 'Prospecting':
            contentMap[tab.id] = (
              <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
                <Prospecting />
              </Suspense>
            );
            break;
        default:
          if (tab.type === 'iframe' && tab.url) {
          
            
            // Generate unique key for iframe - include reload key if present
            const iframeKey = iframeReloadKeys[tab.id] ? `${tab.id}-${iframeReloadKeys[tab.id]}` : tab.id;
            
            contentMap[tab.id] = (
              <iframe
                src={tab.url}
                name={tab.id}
                className="w-full h-full border-0 min-w-0"
                title={tab.title}
                data-tab-id={tab.id}
                key={iframeKey} // Use dynamic key to force reload when needed
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
    
   
    return contentMap;
  }, [tabs, iframeReloadKeys]);


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