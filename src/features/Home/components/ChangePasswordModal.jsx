import React, { useState } from 'react';
import { RefreshCw, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Change Password Modal Component
 * Shows the change password form in a fullscreen iframe modal
 * User cannot close this modal and must complete the password change
 */
const ChangePasswordModal = ({ isOpen, changePasswordUrl }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!isOpen) return null;

  const handleIframeLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl h-[90vh] mx-6 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
        </div>

        {/* Content */}
        <div className="flex-1 relative">
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Loading change password form...</p>
                <p className="text-gray-500 text-sm mt-2">Please wait while we prepare your password change form</p>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
              <div className="text-center max-w-md mx-auto p-8">
                <ExternalLink className="mx-auto mb-4 text-red-500" size={64} />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Password Change Form</h3>
                <p className="text-gray-600 mb-4">There was an issue loading the password change form. Please try refreshing.</p>
                <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Iframe */}
          {changePasswordUrl && (
            <iframe
              key={refreshKey}
              src={changePasswordUrl}
              title="Change Password"
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal; 