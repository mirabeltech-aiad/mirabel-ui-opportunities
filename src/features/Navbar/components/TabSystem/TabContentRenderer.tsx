import React, { useRef, lazy, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTabs } from '../../context/TabContext';
import { useIframeMessaging } from '../../hooks/useIframeMessaging';
import { useComponentCleanup } from '@/lib/memoryManager';
import { Loader2 } from 'lucide-react';
import type { Tab } from '../../types/tab.types';

// Lazy load customer pages
// const CustomersInboxPage = lazy(() => import('@/pages/customers/InboxPage'));
// const CustomersSearchPage = lazy(() => import('@/pages/customers/SearchPage'));
// const AddContactPage = lazy(() => import('@/pages/customers/AddContactPage'));
// const AdminDashboard = lazy(() => import('@/components/AdminDashboard'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex items-center gap-2">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span className="text-muted-foreground">Loading...</span>
    </div>
  </div>
);

// Default page for menu items without specific components
const DefaultPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">This page is under development.</p>
      </div>
      
      <div className="bg-muted/20 border border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
        <p className="text-muted-foreground">
          The {title} feature will be available in a future update.
        </p>
      </div>
    </div>
  );
};

interface TabContentRendererProps {
  tab: Tab;
}

const TabContentRenderer: React.FC<TabContentRendererProps> = ({ tab }) => {
  const { isAuthenticated, userInfo, getValidToken } = useAuth();
  const { updateTab } = useTabs();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Memory cleanup
  useComponentCleanup(tab.id);

  // Setup iframe messaging
  const { sendMessage, handleIframeLoad } = useIframeMessaging(iframeRef, {
    enableTokenPassing: true,
    allowedOrigins: [
      window.location.origin,
    ],
    onMessage: (message) => {
      console.log('Received message from iframe:', message);
      
      switch (message.type) {
        case 'REQUEST_NAVIGATION':
          if (message.payload?.url) {
            updateTab(tab.id, { iframeUrl: message.payload.url });
          }
          break;
        case 'IFRAME_ERROR':
          console.error('Iframe error:', message.payload);
          break;
        default:
          break;
      }
    }
  });

  // Enhanced props for React components
  const componentProps = {
    tabId: tab.id,
    isActive: tab.isActive,
    isAuthenticated,
    userInfo,
    getValidToken,
    updateTab: (updates: Partial<Tab>) => updateTab(tab.id, updates),
    sendMessage: (type: string, payload?: any) => {
      console.log('Component message:', { type, payload, tabId: tab.id });
    }
  };

  // Handle component-based tabs
  if (tab.component && typeof tab.component === 'string') {
    const renderCustomComponent = () => {
      switch (tab.component) {
        case 'CustomersInboxPage':
          return <div>CustomersInboxPage</div>;
        // case 'CustomersSearchPage':
        //   return <CustomersSearchPage />;
        // case 'AddContactPage':
        //   return <AddContactPage />;
        // case 'CustomersAdvancedSearchPage':
        //   return <DefaultPage title="Advanced Search" />;
        // case 'PattysNoteSearchPage':
        //   return <DefaultPage title="Patty's Note Search with Priority" />;
        // case 'AddAdAgencyPage':
        //   return <DefaultPage title="Add Ad Agency" />;
        // case 'ContactReportsPage':
        //   return <DefaultPage title="Contact Reports" />;
        // case 'AllNotesActivityPage':
        //   return <DefaultPage title="All Notes & Activity" />;
        // case 'AccountsReceivablePage':
        //   return <DefaultPage title="Accounts Receivable" />;
        // case 'UserProductsPage':
        //   return <DefaultPage title="Get User Products with Names" />;
        // case 'JakobReportsPage':
        //   return <DefaultPage title="Jakob Reports" />;
        // case 'ESignCountsPage':
        //   return <DefaultPage title="Get E-Sign Counts" />;
        // case 'SegmentationPage':
        //   return <DefaultPage title="Segmentation" />;
        // case 'ImportSubscribersPage':
        //   return <DefaultPage title="Import Subscribers" />;
        // case 'SubscriptionsSearchPage':
        //   return <DefaultPage title="Subscriptions Simple Search" />;
        case 'AdminDashboard':
          return <div>AdminDashboard</div>;
        default:
          return <div>DefaultPage</div>;
      }
    };

    return (
      <Suspense fallback={<LoadingFallback />}>
        {renderCustomComponent()}
      </Suspense>
    );
  }

  // Handle React component tabs
  if (tab.component && typeof tab.component !== 'string') {
    const Component = tab.component;
    return <Component {...componentProps} />;
  }

  // Handle iframe tabs
  if (tab.iframeUrl) {
    const iframeSrc = new URL(tab.iframeUrl);
    
    if (isAuthenticated && userInfo) {
      iframeSrc.searchParams.set('auth', 'true');
      iframeSrc.searchParams.set('user', userInfo.sub);
    }

    return (
      <iframe
        ref={iframeRef}
        src={iframeSrc.toString()}
        className="w-full h-full border-0"
        title={tab.title}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
        onLoad={handleIframeLoad}
        onError={(e) => {
          console.error('Iframe load error:', e);
        }}
      />
    );
  }

  return (
    <div className="flex items-center justify-center p-8 h-full">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">{tab.title}</h2>
        <p className="text-muted-foreground">
          Content for this tab is not yet implemented.
        </p>
      </div>
    </div>
  );
};

export default TabContentRenderer;