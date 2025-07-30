
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, RefreshCw, Settings, BarChart3, Grid3x3, Columns3, Eye, ArrowUpDown } from "lucide-react";

interface FilterValues {
  search?: string;
  status?: string;
  stage?: string;
  assignedRep?: string;
  company?: string;
}

interface ProposalTableFilterControlsProps {
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  totalItems: number;
  view: string;
  onViewChange: (view: string) => void;
  onViewsClick: () => void;
  onRefresh: () => void;
  onSort: () => void;
}

const ProposalTableFilterControls: React.FC<ProposalTableFilterControlsProps> = ({ 
  filters, 
  onFilterChange, 
  totalItems, 
  view, 
  onViewChange, 
  onViewsClick, 
  onRefresh, 
  onSort 
}) => {
  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      status: '',
      stage: '',
      assignedRep: '',
      company: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value.toString().length > 0);

  return (
    <div className="border-b border-gray-200 bg-white">
      {/* Connected Filter Bar */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-0">
          {/* Connected Filter Controls */}
          <div className="flex items-center border border-gray-300 rounded-l-md overflow-hidden bg-white">
            <div className="px-3 py-2 bg-gray-50 border-r border-gray-300">
              <Filter className="h-4 w-4 text-gray-500" />
            </div>
            
            <Select value={filters.status || ''} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-32 border-0 border-r border-gray-300 rounded-none focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.stage || ''} onValueChange={(value) => handleFilterChange('stage', value)}>
              <SelectTrigger className="w-36 border-0 border-r border-gray-300 rounded-none focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Stages</SelectItem>
                <SelectItem value="discovery">Discovery</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.assignedRep || ''} onValueChange={(value) => handleFilterChange('assignedRep', value)}>
              <SelectTrigger className="w-36 border-0 rounded-none focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Rep" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Reps</SelectItem>
                <SelectItem value="john-doe">John Doe</SelectItem>
                <SelectItem value="jane-smith">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button - Separate */}
          <Button 
            variant="ocean" 
            size="default"
            className="ml-3 rounded-md"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>

          {/* Clear Filters - Use Secondary */}
          {hasActiveFilters && (
            <Button 
              variant="ocean-secondary" 
              size="sm" 
              onClick={clearFilters}
              className="ml-2"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Connected Table Control Bar */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            {totalItems} proposals
          </Badge>
          
          {hasActiveFilters && (
            <Badge variant="blue" className="bg-ocean-100 text-ocean-800">
              Filtered
            </Badge>
          )}
        </div>

        {/* Connected Table Controls */}
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onRefresh}
            className="border-0 border-r border-gray-300 rounded-none hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            className="border-0 border-r border-gray-300 rounded-none hover:bg-gray-50"
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onSort}
            className="border-0 border-r border-gray-300 rounded-none hover:bg-gray-50"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            className="border-0 border-r border-gray-300 rounded-none hover:bg-gray-50"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>

          <Button
            variant={view === 'table' ? 'ocean-secondary' : 'ghost'}
            size="icon-sm"
            onClick={() => onViewChange('table')}
            className="border-0 border-r border-gray-300 rounded-none hover:bg-gray-50"
          >
            <Columns3 className="h-4 w-4" />
          </Button>

          <Button
            variant={view === 'cards' ? 'ocean-secondary' : 'ghost'}
            size="icon-sm"
            onClick={() => onViewChange('cards')}
            className="border-0 rounded-none hover:bg-gray-50"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
        </div>

        <Button 
          variant="ocean-secondary" 
          size="sm" 
          onClick={onViewsClick}
          className="ml-3"
        >
          <Eye className="h-4 w-4 mr-2" />
          Views
        </Button>
      </div>

      {/* Search Input Row */}
      <div className="px-4 py-3 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search proposals, companies, or representatives..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10 border-ocean-200 focus:border-ocean-500 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalTableFilterControls;
