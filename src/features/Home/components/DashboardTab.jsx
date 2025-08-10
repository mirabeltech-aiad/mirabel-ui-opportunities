import React from 'react';
import { ChevronDown, BarChart3, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useHome } from '../contexts/HomeContext';

/**
 * DashboardTab component that renders a dropdown for dashboard selection
 * @param {Object} props - Component props
 * @param {Object} props.tab - Tab data
 * @param {boolean} props.isActive - Whether this tab is active
 * @param {Function} props.onClick - Handler for tab click
 * @param {boolean} props.isDragging - Whether the tab is being dragged
 * @returns {React.ReactElement} DashboardTab component
 */
const DashboardTab = ({ tab, isActive, onClick, isDragging }) => {
  const { dashboards, selectedDashboard, dashboardsLoading, actions } = useHome();

  const handleDashboardSelect = (dashboard) => {
    actions.setSelectedDashboard(dashboard);
  };

  const handleTabClick = (e) => {
    // Only trigger tab selection if not clicking on dropdown
    if (!e.target.closest('[data-dropdown-trigger]')) {
      onClick(tab.id);
    }
  };

  return (
    <div
      className={`flex items-center px-3 py-2 rounded-t-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? 'bg-white border-t-2 border-blue-500 text-blue-600 shadow-sm'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={handleTabClick}
    >
      <span className="mr-2 text-sm">{tab.icon}</span>
      
      {dashboardsLoading ? (
        <div className="flex items-center">
          <Loader2 className="h-3 w-3 animate-spin mr-2" />
          <span className="text-sm font-medium">Loading...</span>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild data-dropdown-trigger="true">
            <div className="flex items-center hover:bg-gray-300 rounded px-2 py-1 transition-colors">
              <span className="text-sm font-medium truncate max-w-32">
                {selectedDashboard?.DashBoardName || tab.title}
              </span>
              <ChevronDown className="h-3 w-3 ml-1 flex-shrink-0" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {dashboards.length === 0 ? (
              <DropdownMenuItem disabled>
                <BarChart3 className="h-4 w-4 mr-2" />
                No dashboards available
              </DropdownMenuItem>
            ) : (
              dashboards.map((dashboard) => (
                <DropdownMenuItem
                  key={dashboard.ID}
                  onClick={() => handleDashboardSelect(dashboard)}
                  className={`cursor-pointer ${
                    selectedDashboard?.ID === dashboard.ID ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <div className="flex flex-col">
                    <span className="font-medium">{dashboard.DashBoardName}</span>
                    {dashboard.IsDefault && (
                      <span className="text-xs text-gray-500">Default</span>
                    )}
                  </div>
                  {selectedDashboard?.ID === dashboard.ID && (
                    <div className="ml-auto h-2 w-2 bg-blue-600 rounded-full" />
                  )}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default DashboardTab; 