import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { withBaseUrl } from '@/lib/utils';

const AnnouncementsSidePanel = ({ isOpen, onClose }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (isOpen && iframeRef.current && !iframeRef.current.src) {
      // Load announcements when panel opens - using the correct URL pattern
      // Direct URL to the announcements page
      iframeRef.current.src = '/ui/Announcements';
    }

    if (isOpen && iframeRef.current) {
      // Scroll to top when opening (matching legacy behavior)
      try {
        if (iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.scrollTo(0, 0);
          if (iframeRef.current.contentWindow.document.body) {
            iframeRef.current.contentWindow.document.body.scrollTop = 0;
          }
        }
      } catch (error) {
        // Cross-origin restrictions might prevent this
        console.log('Could not scroll iframe content:', error.message);
      }
    }
  }, [isOpen]);

  // Handle iframe load event
  const handleIframeLoad = () => {
    console.log('Announcements iframe loaded');
  };

  // Handle iframe error
  const handleIframeError = () => {
    console.error('Failed to load announcements iframe');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="relative ml-auto w-96 h-full bg-white shadow-xl flex flex-col">
        {/* Header - Matching navbar and profile dropdown styling */}
        <div className="flex items-center justify-between p-4 bg-ocean-600 text-white">
          <h2 className="text-lg font-semibold flex-1">
            Announcements
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-ocean-700 text-white flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Iframe Content */}
        <div className="flex-1 relative">
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Announcements"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsSidePanel; 