import React from 'react';
import { useHome } from '../contexts/HomeContext';

const Prospecting = () => {
  const { crmProspectingUrl } = useHome();

  if (!crmProspectingUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Prospecting Dashboard</h3>
          <p className="text-gray-500">Prospecting dashboard is not available for your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <iframe 
        src={crmProspectingUrl} 
        title="Prospecting Dashboard" 
        className="w-full h-full border-0"
        style={{ minHeight: '100%' }}
      />
    </div>
  );
};

export default Prospecting; 