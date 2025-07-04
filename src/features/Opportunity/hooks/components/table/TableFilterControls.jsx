
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { ChevronLeft, ChevronRight, Settings, RefreshCw, Search, LayoutGrid, List, Kanban, PanelRight, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import SortOptionsDropdown from "./SortOptionsDropdown";
import SettingsPanel from "../SettingsPanel";

const TableFilterControls = ({
  filters,
  onFilterChange,
  totalItems,
  view,
  onViewChange,
  onViewsClick,
  users = [],
  savedSearches = {
    allOpportunities: [],
    myOpportunities: []
  },
  sortConfig,
  onSort,
  onRefresh,
  currentPage = 1,
  onNextPage,
  onPreviousPage,
  totalCount = 0
}) => {
  const navigate = useNavigate();
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  const handleStatusChange = e => {
    onFilterChange('status', e.target.value);
  };
  const handleProbabilityChange = e => {
    onFilterChange('probability', e.target.value);
  };
  const handleRepChange = e => {
    const selectedValue = e.target.value;
    console.log('Rep filter changed to:', selectedValue);
    console.log('Available users:', users);
    onFilterChange('assignedRep', selectedValue);
  };
  const handleSearchClick = () => {
    console.log('Search button clicked, navigating to /advanced-search');
    try {
      navigate('/advanced-search');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback: just refresh the current data if navigation fails
      onRefresh?.();
    }
  };
  const handleRefreshClick = () => {
    console.log('Refresh button clicked');
    onRefresh?.();
  };
  const handleSortChange = (key, direction) => {
    console.log('Sort change requested:', key, direction);
    if (key) {
      onSort(key, direction);
    } else {
      onSort(null, 'ascending');
    }
  };
  const handleSetDefaultTable = () => {
    localStorage.setItem('pipeline_default_view', 'table');
    console.log('Default view set to table');
  };
  const handleSetDefaultSearch = () => {
    localStorage.setItem('pipeline_default_view', 'search');
    console.log('Default view set to search page');
  };
  const handlePreviousClick = () => {
    console.log('Previous button clicked, current page:', currentPage);
    if (currentPage > 1 && onPreviousPage) {
      onPreviousPage();
    }
  };
  const handleNextClick = () => {
    console.log('Next button clicked, current page:', currentPage);
    if (onNextPage) {
      onNextPage();
    }
  };
  const handleSettingsClick = () => {
    setIsSettingsPanelOpen(true);
  };

  return (
    <>
      <TooltipProvider delayDuration={200} skipDelayDuration={100}>
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="border border-gray-300 rounded-md overflow-hidden flex">
              <select className="bg-white h-9 px-2 text-sm border-r border-gray-300 outline-none" value={filters?.status || "All Opportunities"} onChange={handleStatusChange}>
                <optgroup label="All Opportunities">
                  <option value="All Opportunities">All Opportunities</option>
                  <option value="Open Opportunities">Open Opportunities</option>
                  <option value="Won Opportunities">Won Opportunities</option>
                  <option value="Lost Opportunities">Lost Opportunities</option>
                  {savedSearches.allOpportunities && savedSearches.allOpportunities.map(search => (
                    <option key={search.ID} value={search.Name}>
                      {search.Name}
                    </option>
                  ))}
                </optgroup>
                {savedSearches.myOpportunities && savedSearches.myOpportunities.length > 0 && (
                  <optgroup label="My Opportunities">
                    {savedSearches.myOpportunities.map(search => (
                      <option key={search.ID} value={search.Name}>
                        {search.Name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              
              <select className="bg-white h-9 px-2 text-sm border-r border-gray-300 outline-none" value={filters?.probability || "All"} onChange={handleProbabilityChange}>
                <option value="All">All</option>
                <option value="10%">10%</option>
                <option value="20%">20%</option>
                <option value="30%">30%</option>
                <option value="40%">40%</option>
                <option value="50%">50%</option>
                <option value="60%">60%</option>
                <option value="70%">70%</option>
                <option value="80%">80%</option>
                <option value="90%">90%</option>
                <option value="100%">100%</option>
              </select>
              
              <select className="bg-white h-9 px-2 text-sm outline-none" value={filters?.assignedRep || "All Reps"} onChange={handleRepChange}>
                <option value="All Reps">All Reps</option>
                {users && users.length > 0 ? (
                  users.map(user => (
                    <option key={user.id || user.value} value={user.display}>
                      {user.display}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading reps...</option>
                )}
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              {(() => {
                const pageSize = 25; // This matches the API's PageSize
                const start = (currentPage - 1) * pageSize + 1;
                const end = Math.min(currentPage * pageSize, totalCount);
                return totalCount > 0 ? `${start}-${end} of ${totalCount}` : 'No opportunities found';
              })()}
            </div>
            
            <div className="flex">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={onPreviousPage} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={5}>Previous page</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={onNextPage} disabled={currentPage >= Math.ceil(totalCount / 25)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={5}>Next page</TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleRefreshClick} className="h-9 w-9 p-0 rounded">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={5}>Refresh data</TooltipContent>
            </Tooltip>
            
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleSettingsClick} className="h-9 w-9 p-0 rounded">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>Settings</TooltipContent>
                </Tooltip>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-56">
                <ContextMenuItem onClick={handleSetDefaultTable}>
                  Set Table as Default View
                </ContextMenuItem>
                <ContextMenuItem onClick={handleSetDefaultSearch}>
                  Set Search Page as Default View
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
            
            <SortOptionsDropdown sortConfig={sortConfig} onSort={handleSortChange}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={5}>Sort options</TooltipContent>
              </Tooltip>
            </SortOptionsDropdown>
            
            <div className="flex items-center border border-gray-200 rounded-md">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={view === 'table' ? 'default' : 'ghost'} size="sm" onClick={() => onViewChange('table')} className="h-9 w-9 rounded-none p-0">
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={5}>Table view</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={view === 'cards' ? 'default' : 'ghost'} size="sm" onClick={() => onViewChange('cards')} className="h-9 w-9 rounded-none p-0">
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={5}>Card view</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={view === 'kanban' ? 'default' : 'ghost'} size="sm" onClick={() => onViewChange('kanban')} className="h-9 w-9 rounded-none p-0">
                    <Kanban className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={5}>Kanban view</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={view === 'split' ? 'default' : 'ghost'} size="sm" onClick={() => onViewChange('split')} className="h-9 w-9 rounded-none p-0">
                    <PanelRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={5}>Split view</TooltipContent>
              </Tooltip>
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleSearchClick} className="gap-2 text-white h-9 px-3 bg-ocean-500 hover:bg-ocean-600 border-ocean-500">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={5}>Advanced search</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onViewsClick} className="h-9 px-3">
                  Views
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={5}>Manage custom views</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>

      {/* Settings Panel */}
      <SettingsPanel isOpen={isSettingsPanelOpen} onClose={() => setIsSettingsPanelOpen(false)} />
    </>
  );
};

export default TableFilterControls;
