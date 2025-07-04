import React from 'react';
import { AlertTriangle, Database, Wifi, WifiOff } from 'lucide-react';

const MockDataCleanupBanner = ({ 
  hasMockData = false, 
  hasApiConnection = true, 
  componentName = "Component",
  apiEndpoint = "API endpoint"
}) => {
  if (!hasMockData && hasApiConnection) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-green-600" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-green-800">
              {componentName} - Live Data Source
            </h3>
            <p className="text-sm text-green-700 mt-1">
              Connected to: <code className="bg-green-100 px-1 rounded text-xs">{apiEndpoint}</code>
            </p>
          </div>
          <Wifi className="h-4 w-4 text-green-600" />
        </div>
      </div>
    );
  }

  if (hasMockData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              {componentName} - Mock Data Detected
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              This component is currently using mock data. Connect to live API for real-time data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasApiConnection) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <WifiOff className="h-5 w-5 text-red-600" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">
              {componentName} - API Connection Failed
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Unable to connect to: <code className="bg-red-100 px-1 rounded text-xs">{apiEndpoint}</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MockDataCleanupBanner; 