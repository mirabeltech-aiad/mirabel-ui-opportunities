
import React, { useState, useEffect } from 'react';
import { Button } from "@OpportunityComponents/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@OpportunityComponents/ui/select";
import { Search, RefreshCw, Settings, ArrowUpDown, Table, LayoutGrid, PanelRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProposalSortOptionsDropdown from "./ProposalSortOptionsDropdown";
import { userService } from '@/services/userService';

const ProposalTableFilterControls = ({ 
  filters = {}, // Add default empty object
  onFilterChange, 
  totalItems, 
  view, 
  onViewChange, 
  onViewsClick, 
  onRefresh, 
  currentPage, 
  totalPages, 
  pageSize, 
  onPageChange,
  sortConfig,
  onSort
}) => {
  const navigate = useNavigate();
  const [proposalReps, setProposalReps] = useState([]);
  const [isLoadingReps, setIsLoadingReps] = useState(false);

  // Fetch proposal reps from API
  useEffect(() => {
    const fetchProposalReps = async () => {
      try {
        setIsLoadingReps(true);
        const reps = await userService.getUsersForDropdown();
        setProposalReps(reps);
      } catch (error) {
        console.error('Failed to fetch proposal reps:', error);
      } finally {
        setIsLoadingReps(false);
      }
    };

    fetchProposalReps();
  }, []);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleSearchClick = () => {
    navigate('/advanced-search');
  };

  const proposalRepOptions = [
    { value: "all", label: "All Proposal Reps" },
    ...proposalReps.map(rep => ({
      value: rep.value,
      label: rep.display
    }))
  ];

  return (
    <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {/* Single Proposal Rep Filter */}
        <div className="border border-gray-300 rounded-md overflow-hidden flex">
          <Select value={filters.proposalRep || "all"} onValueChange={(value) => onFilterChange('proposalRep', value)} disabled={isLoadingReps}>
            <SelectTrigger className="h-9 border-0 rounded-none bg-white text-sm min-w-40">
              <SelectValue placeholder="All Proposal Reps" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              {proposalRepOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-sm text-gray-600">
          {(() => {
            const start = (currentPage - 1) * pageSize + 1;
            const end = Math.min(currentPage * pageSize, totalItems);
            return totalItems > 0 ? `${start}-${end} of ${totalItems}` : 'No proposals found';
          })()}
        </div>
        
        <div className="flex">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage <= 1}
            className="h-9 w-9 p-0 rounded-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="h-9 w-9 p-0 rounded-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="h-9 w-9 p-0 rounded-sm"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0 rounded-sm"
        >
          <Settings className="h-4 w-4" />
        </Button>
        
        <ProposalSortOptionsDropdown sortConfig={sortConfig} onSort={onSort}>
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 rounded-sm"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </ProposalSortOptionsDropdown>
        
        <div className="flex items-center border border-gray-200 rounded-sm">
          <Button
            variant={view === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('table')}
            className="h-9 w-9 rounded-none p-0"
          >
            <Table className="h-4 w-4" />
          </Button>
          
          <Button
            variant={view === 'cards' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('cards')}
            className="h-9 w-9 rounded-none p-0"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          
          <Button
            variant={view === 'split' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('split')}
            className="h-9 w-9 rounded-none p-0"
          >
            <PanelRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          className="bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500 h-9 px-3 rounded-sm"
          onClick={handleSearchClick}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onViewsClick}
          className="h-9 px-3 rounded-sm"
        >
          Views
        </Button>
      </div>
    </div>
  );
};

export default ProposalTableFilterControls;
