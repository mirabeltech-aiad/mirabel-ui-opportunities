
import React from 'react';
import { Button } from '@OpportunityComponents/ui/button';
import { RefreshCw, Download } from 'lucide-react';

const ControlsSection = ({ onRefresh, onExport, isLoading }) => {
  return (
    <div className="flex items-center gap-4 ml-auto">
      <Button 
        onClick={onExport}
        variant="outline"
        className="bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button 
        onClick={onRefresh} 
        disabled={isLoading}
        className="bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500"
      >
        <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
};

export default ControlsSection;
