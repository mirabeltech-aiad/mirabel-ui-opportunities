import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Announcement Notification Component
 * Migrated from ASP.NET Home.aspx announcement functionality
 * Uses the exact same SVG icon as the legacy design
 */
const BellNotification = ({ onOpenAnnouncementsPanel, unreadCount = 0 }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative h-8 w-8 rounded-full p-0 hover:bg-ocean-700 text-white border border-white/20"
      onClick={onOpenAnnouncementsPanel}
      title="Announcements"
    >
      {/* Legacy SVG Icon - exact same as old page */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="14" 
        height="14" 
        viewBox="0 0 18.391 18.28"
        className="text-white"
      >
        <g id="announcement" transform="translate(-1.488 -1.682)">
          <path id="Path_2556" data-name="Path 2556" d="M7.29,33.463,4.731,29.03,2.767,30.162A2.561,2.561,0,0,0,5.329,34.6Z" transform="translate(0 -19.368)" fill="currentColor"/>
          <path id="Path_2557" data-name="Path 2557" d="M50.694,13.21a.3.3,0,0,0,.4.108l2.358-1.363a.293.293,0,1,0-.292-.508L50.8,12.81a.292.292,0,0,0-.108.4Z" transform="translate(-34.819 -6.889)" fill="currentColor"/>
          <path id="Path_2558" data-name="Path 2558" d="M56.189,24.35l-2.72.12a.292.292,0,0,0,.012.584h.012l2.72-.12a.292.292,0,0,0-.023-.584Z" transform="translate(-36.614 -16.053)" fill="currentColor"/>
          <path id="Path_2559" data-name="Path 2559" d="M44.545,4.515a.284.284,0,0,0,.158.047.288.288,0,0,0,.245-.134l1.465-2.3a.291.291,0,1,0-.49-.312l-1.465,2.3A.289.289,0,0,0,44.545,4.515Z" transform="translate(-30.398)" fill="currentColor"/>
          <path id="Path_2560" data-name="Path 2560" d="M15.609,46.73l-1.57.908a3.269,3.269,0,0,1-.659.28,6.732,6.732,0,0,0,2.043,3.63,1.211,1.211,0,0,0,1.427.152l.032-.018a1.214,1.214,0,0,0,.3-1.862,6.765,6.765,0,0,1-1.576-3.09Z" transform="translate(-8.422 -31.903)" fill="currentColor"/>
          <path id="Path_2561" data-name="Path 2561" d="M20.066,11.054A27.42,27.42,0,0,1,17.9,6.466,6.76,6.76,0,0,1,17.49,4.66a13.322,13.322,0,0,0-1.313,3.2,8.211,8.211,0,0,1-2.016,3.531l2.664,4.616a8.218,8.218,0,0,1,4.068.018,13.26,13.26,0,0,0,3.446.458c-1.713-1.059-3.98-4.926-4.272-5.428Z" transform="translate(-8.974 -2.109)" fill="currentColor"/>
          <path id="Path_2562" data-name="Path 2562" d="M27.766,2.363c-.54.312.053,2.39,1.342,4.967A2,2,0,0,1,31.1,10.779c1.6,2.431,3.119,4.007,3.662,3.691.659-.382-.368-3.4-2.3-6.747s-4.03-5.743-4.692-5.361Z" transform="translate(-18.468 -0.454)" fill="currentColor"/>
        </g>
      </svg>
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs font-medium flex items-center justify-center"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
};

export default BellNotification; 