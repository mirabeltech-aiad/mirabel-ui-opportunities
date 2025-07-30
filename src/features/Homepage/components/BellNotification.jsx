import React, { useState } from 'react';
import { Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Announcement Notification Component
 * Migrated from ASP.NET Home.aspx announcement functionality
 * Simple megaphone icon that opens the announcements side panel
 */
const BellNotification = ({ onOpenAnnouncementsPanel, unreadCount = 0 }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative h-9 w-9 rounded-full p-0 hover:bg-ocean-700 text-white"
      onClick={onOpenAnnouncementsPanel}
      title="Announcements"
    >
      <Megaphone className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs font-medium flex items-center justify-center"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
};

export default BellNotification; 