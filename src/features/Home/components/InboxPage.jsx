import React, { useState, useEffect } from 'react';
import { getTopPath } from '@/utils/commonHelpers';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Inbox Page Component - Split layout with Notifications and Announcements
 * Replicates the original ExtJS layout with two panels side by side
 */
const InboxPage = () => {
  const [refreshKeys, setRefreshKeys] = useState({
    notifications: 0,
    announcements: 0
  });

  // URLs for the two iframes
  const notificationsUrl = `${getTopPath()}/intranet/Members/Home/InboxNotifications.aspx`;
  const announcementsUrl = `${getTopPath()}/intranet/Members/Home/Announcement.aspx`;

  // Function to reload specific iframe
  const reloadIframe = (type) => {
    setRefreshKeys(prev => ({
      ...prev,
      [type]: Date.now()
    }));
  };

  // Function to reload both iframes (called from parent when tab is clicked)
  const reloadAll = () => {
    setRefreshKeys({
      notifications: Date.now(),
      announcements: Date.now() + 1 // Slightly different to ensure both update
    });
  };

  // Expose reload function globally for tab click handling
  useEffect(() => {
    window.reloadInboxIframes = reloadAll;
    return () => {
      delete window.reloadInboxIframes;
    };
  }, []);

  return (
    <div className="flex h-full">
      {/* Left Panel - Notifications */}
      <div className="flex-1 border-r border-gray-200 relative">
        {/* Header for notifications */}
        <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
          <Button
            onClick={() => reloadIframe('notifications')}
            variant="outline"
            size="sm"
            className="h-6 px-2"
            title="Refresh notifications"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Notifications iframe */}
        <iframe
          key={`notifications-${refreshKeys.notifications}`}
          src={notificationsUrl}
          name="inbox-notifications"
          className="w-full border-0"
          style={{ height: 'calc(100% - 45px)' }}
          title="Inbox Notifications"
        />
      </div>

      {/* Right Panel - Announcements */}
      <div className="flex-1 relative">
        {/* Header for announcements */}
        <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Announcements</h3>
          <Button
            onClick={() => reloadIframe('announcements')}
            variant="outline"
            size="sm"
            className="h-6 px-2"
            title="Refresh announcements"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Announcements iframe */}
        <iframe
          key={`announcements-${refreshKeys.announcements}`}
          src={announcementsUrl}
          name="inbox-announcements"
          className="w-full border-0"
          style={{ height: 'calc(100% - 45px)' }}
          title="Announcements"
        />
      </div>
    </div>
  );
};

export default InboxPage; 