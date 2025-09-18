import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Settings,
  LayoutGrid,
  List,
  Search as SearchIcon,
  Eye,
  Kanban,
  PanelRight
} from "lucide-react";

/**
 * TableFilterControls
 *
 * A reusable, responsive toolbar that mirrors the top controls bar
 * (green rectangle) from the provided reference. It composes existing
 * UI primitives and exposes props for all values/callbacks so parent
 * pages can control behavior.
 */
const TableFilterControlsHeader = ({
  // Left filter triggers
  primaryFilterLabel = "All Opportunities",
  onPrimaryFilterClick,
  secondaryFilterLabel = "All Probability",
  onSecondaryFilterClick,
  repsFilterLabel = "All Reps",
  onRepsFilterClick,

  // Pagination summary and nav
  pageStart = 1,
  pageEnd = 25,
  totalItems = 0,
  onPrevPage,
  onNextPage,
  canPrev = true,
  canNext = true,

  // Actions / utilities
  onAdd,
  onRefresh,
  refreshing = false,
  viewMode = "list", // 'list' | 'grid'
  onChangeViewMode,
  onSettings,

  // Calls to open sidebars/dialogs
  onSearch,
  onViews,

  className = ""
}) => {
  const rangeText = `${pageStart.toLocaleString()}-${pageEnd.toLocaleString()} of ${totalItems.toLocaleString()}`;

  const renderFilterTrigger = (label, onClick) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={onClick}
          className="h-10 rounded-lg px-4 font-medium text-slate-700 flex items-center gap-2 bg-white"
        >
          <span className="truncate max-w-[12rem]">{label}</span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Change {label}</TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
    <div
      className={`w-full bg-white px-3 sm:px-4 py-2 flex items-center justify-between gap-3 ${className}`}
      role="toolbar"
      aria-label="Table controls"
    >
      {/* Left: Filters + Range */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {renderFilterTrigger(primaryFilterLabel, onPrimaryFilterClick)}
          {renderFilterTrigger(secondaryFilterLabel, onSecondaryFilterClick)}
          {renderFilterTrigger(repsFilterLabel, onRepsFilterClick)}
        </div>

        {/* Range and pager */}
        <div className="hidden md:flex items-center gap-1 ml-1">
          <div className="text-sm text-slate-600 px-3 py-2 rounded-md border bg-white">
            {rangeText}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={onPrevPage}
                disabled={!canPrev}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous page</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={onNextPage}
                disabled={!canNext}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next page</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* IMPORTANT: Button order mirrors the reference exactly */}
        {/* 1) Create */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={onAdd}
              aria-label="Create"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Create opportunity</TooltipContent>
        </Tooltip>

        {/* 3) Refresh */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={`h-9 w-9 ${refreshing ? 'opacity-80' : ''}`}
              onClick={onRefresh}
              aria-label="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Refresh Data</TooltipContent>
        </Tooltip>

        {/* 4) Settings */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 hidden lg:inline-flex"
              onClick={onSettings}
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>

        {/* 5-8) Unified view mode group */}
        <div
          className="hidden sm:flex items-center rounded-2xl border border-slate-200 overflow-hidden"
          role="group"
          aria-label="View mode"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-10 w-12 rounded-none ${viewMode === 'table' ? 'bg-ocean-700 text-white' : 'text-slate-800 hover:bg-slate-50'} rounded-l-2xl`}
                onClick={() => onChangeViewMode && onChangeViewMode('table')}
                aria-pressed={viewMode === 'table'}
                aria-label="Table view"
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Table view</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-10 w-12 rounded-none ${viewMode === 'card' ? 'bg-slate-100' : 'text-slate-800 hover:bg-slate-50'}`}
                onClick={() => onChangeViewMode && onChangeViewMode('card')}
                aria-pressed={viewMode === 'card'}
                aria-label="Card view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Card view</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-10 w-12 rounded-none ${viewMode === 'kanban' ? 'bg-slate-100' : 'text-slate-800 hover:bg-slate-50'}`}
                onClick={() => onChangeViewMode && onChangeViewMode('kanban')}
                aria-pressed={viewMode === 'kanban'}
                aria-label="Kanban view"
              >
                <Kanban className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Kanban view</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-10 w-12 rounded-none ${viewMode === 'split' ? 'bg-slate-100' : 'text-slate-800 hover:bg-slate-50'} rounded-r-2xl`}
                onClick={() => onChangeViewMode && onChangeViewMode('split')}
                aria-pressed={viewMode === 'split'}
                aria-label="Split view"
              >
                <PanelRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Split view</TooltipContent>
          </Tooltip>
        </div>

        {/* 8) Filters */}
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={onToggleFilters}
              aria-label="Filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Filters</TooltipContent>
        </Tooltip> */}

        {/* 9) Options (advanced) */}
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={onToggleOptions}
              aria-label="Options"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Options</TooltipContent>
        </Tooltip> */}

        {/* 10) Search primary action */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSearch}
              className="h-9 px-4 bg-ocean-600 hover:bg-ocean-700 text-white"
              aria-label="Search"
            >
              <SearchIcon className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Filter</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Filter</TooltipContent>
        </Tooltip>

        {/* 11) Views secondary action */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              onClick={onViews}
              className="h-9 px-3"
              aria-label="Views"
            >
              <Eye className="h-4 w-4 mr-2 text-slate-600" />
              <span>Views</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Manage views</TooltipContent>
        </Tooltip>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default TableFilterControlsHeader;


