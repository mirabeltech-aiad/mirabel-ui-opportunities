import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Change Password Alert Component
 * Shows a warning popup about password expiration
 */
const ChangePasswordAlert = ({ isOpen, onClose, onContinue }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Password Expired</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed">
                Your password has expired. A password is only valid for up to 12 months, 
                after that we require it be changed to keep your site secure. Please update 
                your password to continue to the site.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200">
          <Button
            onClick={onContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordAlert; 