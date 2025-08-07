import React, { useMemo } from 'react';
import { useHome } from '../contexts/HomeContext';
import IframeContainer from './IframeContainer';

const Dashboard = () => {
  const { selectedDashboard, dashboardsLoading } = useHome();

  // Memoize the iframe content to prevent unnecessary re-renders
  const iframeContent = useMemo(() => {
    if (selectedDashboard && selectedDashboard.URL) {
      return (
        <IframeContainer 
          url={selectedDashboard.URL}
          title={selectedDashboard.DashBoardName}
          name={`${selectedDashboard.ID}`} 
          className="h-full"
          key={selectedDashboard.ID} // Use dashboard ID as key to preserve state
        />
      );
    }
    return null;
  }, [selectedDashboard?.ID, selectedDashboard?.URL, selectedDashboard?.DashBoardName]);

  // Show loading state while dashboards are being fetched
  if (dashboardsLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-600"></div>
      </div>
    );
  }

  // If a dashboard is selected and has a URL, show it in iframe
  if (iframeContent) {
    return iframeContent;
  }

  // Show empty state when no dashboard is selected
  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Dashboard Selected</h3>
        <p className="text-gray-600">Please select a dashboard from the menu to get started.</p>
      </div>
    </div>
  );
};

export default Dashboard; 