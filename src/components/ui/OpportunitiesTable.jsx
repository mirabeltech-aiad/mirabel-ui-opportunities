
import { useState, useEffect } from "react";
import TableFilterControls from "../../features/Opportunity/components/table/TableFilterControls";
import TableContent from "../../features/Opportunity/components/table/TableContent";
import TableActionsPanel from "../../features/Opportunity/components/table/TableActionsPanel";
import ViewsSidebar from "./views/ViewsSidebar";
import { useInfiniteScroll } from "@/features/Opportunity/hooks/useInfiniteScroll";
import { useScrollObserver } from "@/features/Opportunity/hooks/useScrollObserver";
import { useTableSelection } from "../../features/Opportunity/components/table/TableSelectionManager";
import { useTableSort } from "../../features/Opportunity/components/table/TableSortManager";
import { useTableColumns } from "../../features/Opportunity/components/table/TableColumnManager";

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
  onViewSelected 
}) => {
  const [isViewsSidebarOpen, setIsViewsSidebarOpen] = useState(false);
  
  // Extracted sorting logic for clarity
  const { sortConfig, sortedOpportunities, requestSort } = useTableSort(opportunities);
  
  // Extracted column management logic for clarity
  const {
    columnOrder,
    draggedColumn,
    columnWidths,
    handleColumnResize,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    setColumnOrder
  } = useTableColumns();

  // Add debugging for column order changes in main component
  useEffect(() => {
    console.log('OpportunitiesTable: Column order updated to:', columnOrder?.map(col => col.id));
    console.log('OpportunitiesTable: Total columns in table:', columnOrder?.length);
  }, [columnOrder]);

  // Infinite scroll hooks
  const { displayedItems, hasMore, isLoading, loadMore, resetDisplayedItems } = useInfiniteScroll(sortedOpportunities, 20);
  const observerRef = useScrollObserver(loadMore, hasMore, isLoading);

  // Reset displayed items when opportunities data changes (e.g., after loading a saved view)
  useEffect(() => {
    console.log('Opportunities data changed, resetting displayed items');
    resetDisplayedItems();
  }, [opportunities, resetDisplayedItems]);

  // Extracted selection logic for clarity
  const { selectedRows, selectAll, handleSelectAll, handleRowSelect } = useTableSelection(displayedItems);

  const handleViewsClick = () => {
    setIsViewsSidebarOpen(true);
  };

  const handleColumnOrderChange = (newColumnOrder) => {
    console.log('OpportunitiesTable: handleColumnOrderChange called with:', newColumnOrder?.map(col => col.id));
    console.log('OpportunitiesTable: Number of columns being set:', newColumnOrder?.length);
    
    if (Array.isArray(newColumnOrder) && newColumnOrder.length > 0) {
      console.log('OpportunitiesTable: Setting column order immediately');
      setColumnOrder(newColumnOrder);
      
      // Force a re-render by updating a dummy state
      setTimeout(() => {
        console.log('OpportunitiesTable: Column order should now be:', newColumnOrder.map(col => col.id));
      }, 100);
    } else {
      console.warn('OpportunitiesTable: Invalid or empty column order received:', newColumnOrder);
    }
  };

  const handleViewSelected = (selectedView) => {
    console.log('OpportunitiesTable: View selected, triggering data refresh for view:', selectedView.NameOfView);
    // Notify parent component (Pipeline) that a view was selected
    if (onViewSelected) {
      onViewSelected(selectedView);
    }
  };

  // Action handlers
  const handleExport = () => {
    console.log('Export action triggered for', selectedRows.size, 'opportunities');
  };

  const handleBatchUpdate = () => {
    console.log('Batch update action triggered for', selectedRows.size, 'opportunities');
  };

  const handleSendEmail = () => {
    console.log('Send email action triggered for', selectedRows.size, 'opportunities');
  };

  const handlePrint = () => {
    console.log('Print action triggered for', selectedRows.size, 'opportunities');
  };

  const handleDownloadFiles = () => {
    console.log('Download files action triggered for', selectedRows.size, 'opportunities');
  };

  // Fixed sort handler - ensure it properly calls requestSort
  const handleSort = (key, direction) => {
    console.log('OpportunitiesTable: handleSort called with key:', key, 'direction:', direction);
    requestSort(key, direction);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-md shadow-sm">
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
        />
        
        {/* Actions Panel - appears when rows are selected with improved visibility */}
        {selectedRows.size > 0 && (
          <div className="px-4 pt-4">
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
        
        {/* Extracted table content for clarity */}
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
        />
        
        {/* Show total count and loaded items */}
        <div className="p-2 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {displayedItems.length} of {opportunities.length} opportunities
            {hasMore && !isLoading && " - Scroll down to load more"}
          </div>
          {selectedRows.size > 0 && (
            <div className="text-sm text-blue-600 font-medium">
              {selectedRows.size} opportunit{selectedRows.size !== 1 ? 'ies' : 'y'} selected
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
      />
    </>
  );
};

export default OpportunitiesTable;
