import React, { useState } from 'react';
import { Loader2, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHome } from '../contexts/HomeContext';
import { getTopPath } from '@/utils/commonHelpers';
/**
 * Common iframe container component for loading dashboard and menu URLs
 * @param {Object} props - Component props
 * @param {string} props.url - The relative URL to load (from API response)
 * @param {string} props.title - Title for the iframe content
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 * @returns {React.ReactElement} IframeContainer component
 */
const IframeContainer = ({ 
  url, 
  title = 'Content', 
  className = '', 
  style = {},
  onLoad,
  onError 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Get actions from HomeContext
  const { actions } = useHome();

  // Construct full URL by combining base domain with relative URL
  const fullUrl = url ? `${getTopPath()}${url.startsWith('/') ? '' : '/'}${url}` : '';

  const handleIframeLoad = () => {
    setLoading(false);
    setError(false);
    onLoad && onLoad();
  };

  const handleIframeError = () => {
    setLoading(false);
    setError(true);
    onError && onError();
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
    setRefreshKey(prev => prev + 1);
  };

  const openInNewTab = () => {
    if (fullUrl) {
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (!url) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 ${className}`} style={style}>
        <div className="text-center text-gray-500">
          <ExternalLink className="mx-auto mb-4 opacity-50" size={48} />
          <p>No URL provided</p>
          <p className="text-sm mt-2">Select a dashboard or menu item to load content</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full ${className}`} style={style}>
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-600"></div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
          <div className="text-center">
            <ExternalLink className="mx-auto mb-4 text-red-500" size={48} />
            <p className="text-gray-800 font-medium">Failed to load {title}</p>
            <p className="text-sm text-gray-600 mt-1 max-w-md break-all">{fullUrl}</p>
            <div className="flex gap-2 mt-4 justify-center">
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button onClick={openInNewTab} variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Control bar */}
      {!loading && !error && (
        <div className="absolute top-2 right-2 z-20 flex gap-1">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm"
            title="Refresh content"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Iframe */}
      {/* <iframe
        key={refreshKey}
        src={fullUrl}
        title={title}
        className="w-full h-full border-0"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
        referrerPolicy="strict-origin-when-cross-origin"
        loading="lazy"
      /> */}
    </div>
      );
  };

export default IframeContainer; 