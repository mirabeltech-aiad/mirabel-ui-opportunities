import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AnnouncementsSidePanel = ({ isOpen, onClose }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (isOpen && iframeRef.current && !iframeRef.current.src) {
      // Load announcements when panel opens
      iframeRef.current.src = 'ui/Announcements';
    }

    if (isOpen && iframeRef.current) {
      // Scroll to top when opening (matching legacy behavior)
      try {
        if (iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.scrollTo(0, 0);
          if (iframeRef.current.contentWindow.document.body) {
            iframeRef.current.contentWindow.document.body.scrollTop = 0;
          }
          if (iframeRef.current.contentWindow.document.documentElement) {
            iframeRef.current.contentWindow.document.documentElement.scrollTop = 0;
          }
        }
      } catch (error) {
        // Cross-origin iframe will throw error, ignore it
        console.warn('Could not scroll iframe content (cross-origin):', error);
      }
    }
  }, [isOpen]);

  return (
    <div 
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ right: isOpen ? '0px' : '-400px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="font-semibold text-gray-800">Announcements</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 hover:bg-gray-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="h-full">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          title="Announcements"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
};

export default AnnouncementsSidePanel; 