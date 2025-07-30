import { useState, useEffect } from 'react';

/**
 * Simple hook to get unread announcement count
 * This would typically communicate with the /ui/Announcements iframe
 * or be passed as a prop from the parent component
 */
export const useAnnouncementCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Listen for messages from the announcements iframe
  useEffect(() => {
    const handleMessage = (event) => {
      // Only accept messages from the announcements page
      if (event.origin !== window.location.origin) return;
      
      if (event.data && event.data.type === 'ANNOUNCEMENT_COUNT_UPDATE') {
        setUnreadCount(event.data.count || 0);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return unreadCount;
}; 