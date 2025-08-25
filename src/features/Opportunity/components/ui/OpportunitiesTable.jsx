import { useState, useEffect } from "react";
import TableFilterControls from "../table/TableFilterControls";
import TableContent from "../table/TableContent";
import TableActionsPanel from "../table/TableActionsPanel";
import ViewsSidebar from "../../../../components/ui/views/ViewsSidebar";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { useScrollObserver } from "../../hooks/useScrollObserver";
import { useTableSelection } from "../table/TableSelectionManager";
import { useTableSort } from "../table/TableSortManager";
import { useTableColumns } from "../table/TableColumnManager";

// Refactored main component - extracted logic into focused hooks and components
const OpportunitiesTable = ({
  opportunities,
  view,
  onViewChange,
  onCompanySelect,
  selectedCompany,
  filters,
  onFilterChange,
  users = [],
  savedSearches,
  onRefresh,
  currentPage,
  onNextPage,
  onPreviousPage,
  totalCount,
  stages = [],
  prospectingStages = [],
  onViewSelected,
  onAddOpportunity, // Add the new prop
  apiColumnConfig, // Add opportunityResult prop to access ColumnConfig
  isSplitScreenMode = false,
}) => {
  const [isViewsSidebarOpen, setIsViewsSidebarOpen] = useState(false);

  // Track the current selected view early so it can be used by hooks below
  const [currentSelectedView, setCurrentSelectedView] = useState(null);
  const [viewBasedColumns, setViewBasedColumns] = useState(null);

  // Extracted sorting logic for clarity
  const { sortConfig, sortedOpportunities, requestSort } =
    useTableSort(opportunities);

  // Extracted column management logic for clarity
  const {
    columnOrder,
    draggedColumn,
    columnWidths,
    handleColumnResize,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    setColumnOrder,
  } = useTableColumns(
    apiColumnConfig,
    opportunities,
    currentSelectedView?.ID || -1
  ); // pass selected view id so API columns reload when view changes

  // Infinite scroll hooks
  const { displayedItems, hasMore, isLoading, loadMore, resetDisplayedItems } =
    useInfiniteScroll(sortedOpportunities, 20);
  const observerRef = useScrollObserver(loadMore, hasMore, isLoading);

  // Reset displayed items when opportunities data changes (e.g., after loading a saved view)
  useEffect(() => {
    resetDisplayedItems();
  }, [opportunities, resetDisplayedItems]);

  // Extracted selection logic for clarity
  const { selectedRows, selectAll, handleSelectAll, handleRowSelect } =
    useTableSelection(displayedItems);

  // Effect to handle view changes: let API-configured columns load via hook using selectedViewId
  useEffect(() => {
    // When a new view is selected, we rely on useApiData to refetch data with viewId
    // and TableColumnManager to re-apply API-provided columns for that view.
  }, [currentSelectedView]);

  // Effect to maintain view-based columns even when currentSelectedView is reset
  useEffect(() => {
    if (
      viewBasedColumns &&
      viewBasedColumns.length > 0 &&
      !currentSelectedView
    ) {
      setColumnOrder(viewBasedColumns);
    }
  }, [opportunities, viewBasedColumns, currentSelectedView, setColumnOrder]);

  const handleViewsClick = () => {
    setIsViewsSidebarOpen(true);
  };

  const handleColumnOrderChange = (newColumnOrder) => {
    if (newColumnOrder && newColumnOrder.length > 0) {
      setColumnOrder(newColumnOrder);
    }
  };

  const handleViewSelected = async (selectedView) => {
    try {
      // Store the selected view to trigger column updates
      setCurrentSelectedView(selectedView);

      // If no view is selected (going back to default), clear the view-based columns
      if (!selectedView) {
        setViewBasedColumns(null);
      }

      // Notify parent component (Pipeline) that a view was selected so it can refetch data
      if (onViewSelected) {
        await onViewSelected(selectedView);
      }

      // Ensure the table refreshes immediately after a view change
      if (onRefresh) {
        onRefresh();
      }
    } catch {
      // Silently ignore to avoid breaking UI
    }
  };

  // Action handlers
  const handleExport = () => {};
  const handleBatchUpdate = () => {};
  const handleSendEmail = () => {};
  const handlePrint = () => {};
  const handleDownloadFiles = () => {};

  // Fixed sort handler - ensure it properly calls requestSort
  const handleSort = (key, direction) => {
    requestSort(key, direction);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-md shadow-sm flex flex-col h-full min-h-0 overflow-hidden">
        {/* Filter Controls */}
        <TableFilterControls
          filters={filters}
          onFilterChange={onFilterChange}
          totalItems={opportunities.length}
          view={view}
          onViewChange={onViewChange}
          onViewsClick={handleViewsClick}
          users={users}
          savedSearches={savedSearches}
          sortConfig={sortConfig}
          onSort={handleSort}
          onRefresh={onRefresh}
          currentPage={currentPage}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
          totalCount={totalCount}
          onAddOpportunity={onAddOpportunity}
        />

        {/* Actions Panel - appears when rows are selected with improved visibility */}
        {selectedRows.size > 0 && (
          <div className="px-4 pt-4 flex-shrink-0">
            <TableActionsPanel
              selectedCount={selectedRows.size}
              onExport={handleExport}
              onBatchUpdate={handleBatchUpdate}
              onSendEmail={handleSendEmail}
              onPrint={handlePrint}
              onDownloadFiles={handleDownloadFiles}
            />
          </div>
        )}

        {/* Table Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <TableContent
            columnOrder={columnOrder}
            sortConfig={sortConfig}
            requestSort={requestSort}
            draggedColumn={draggedColumn}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDragEnd={handleDragEnd}
            selectAll={selectAll}
            onSelectAll={handleSelectAll}
            columnWidths={columnWidths}
            onColumnResize={handleColumnResize}
            displayedItems={displayedItems}
            selectedRows={selectedRows}
            handleRowSelect={handleRowSelect}
            isLoading={isLoading}
            observerRef={observerRef}
            onCompanySelect={onCompanySelect}
            selectedCompany={selectedCompany}
            stages={stages}
            prospectingStages={prospectingStages}
            onRefresh={onRefresh}
            isSplitScreenMode={isSplitScreenMode}
          />
        </div>

        {/* Show total count and loaded items */}
        <div className="p-2 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-500">
            Showing {displayedItems.length} of {opportunities.length}{" "}
            opportunities
            {hasMore && !isLoading && " - Scroll down to load more"}
          </div>
          {selectedRows.size > 0 && (
            <div className="text-sm text-blue-600 font-medium">
              {selectedRows.size} opportunit
              {selectedRows.size !== 1 ? "ies" : "y"} selected
            </div>
          )}
        </div>
      </div>

      {/* Views Sidebar with pageType="opportunities" */}
      <ViewsSidebar
        isOpen={isViewsSidebarOpen}
        onClose={() => setIsViewsSidebarOpen(false)}
        columnOrder={columnOrder}
        onColumnOrderChange={handleColumnOrderChange}
        onViewSelected={handleViewSelected}
        pageType="opportunities"
        currentSelectedView={currentSelectedView}
      />
    </>
  );
};

export default OpportunitiesTable;
