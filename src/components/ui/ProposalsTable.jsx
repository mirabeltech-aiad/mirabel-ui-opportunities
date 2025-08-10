import React, { useState } from "react";
import ProposalTableFilterControls from "../../features/Opportunity/components/proposal/ProposalTableFilterControls";
import ProposalTableContent from "../../features/Opportunity/components/proposal/ProposalTableContent";
import TableActionsPanel from "../../features/Opportunity/components/table/TableActionsPanel";
import ViewsSidebar from "./views/ViewsSidebar";
import { useInfiniteScroll } from "@/features/Opportunity/hooks/useInfiniteScroll";
import { useScrollObserver } from "@/features/Opportunity/hooks/useScrollObserver";
import { useTableSelection } from "../../features/Opportunity/components/table/TableSelectionManager";
import { useTableSort } from "../../features/Opportunity/components/table/TableSortManager";
import { useProposalTableColumns } from "../../features/Opportunity/components/proposal/ProposalTableColumnManager";

const ProposalsTable = ({ 
  proposals, 
  view, 
  onViewChange, 
  onCompanySelect, 
  selectedCompany, 
  filters, 
  onFilterChange, 
  onRefresh, 
  isLoading: externalLoading, 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange, 
  totalItems = 0,
  apiColumnConfig = null,
  onViewSelected // New prop for handling view selection
}) => {
  // Updated default value for currentPage from 0 to 1
  const [isViewsSidebarOpen, setIsViewsSidebarOpen] = useState(false);
  const pageSize = 25;
  
  // Extracted sorting logic for clarity
  const { sortConfig, sortedOpportunities, requestSort } = useTableSort(proposals);
  
  // Extracted column management logic for clarity - using dynamic columns from API
  const {
    columnOrder,
    draggedColumn,
    columnWidths,
    handleColumnResize,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    setColumnOrder
  } = useProposalTableColumns(apiColumnConfig);

  // Use paginated data for infinite scroll (but show all items for now to maintain existing behavior)
  const { displayedItems, hasMore, isLoading: scrollLoading, loadMore } = useInfiniteScroll(sortedOpportunities, pageSize);
  const observerRef = useScrollObserver(loadMore, hasMore, scrollLoading);

  // Combine loading states
  const isLoading = externalLoading || scrollLoading;

  // Extracted selection logic for clarity
  const { selectedRows, selectAll, handleSelectAll, handleRowSelect } = useTableSelection(displayedItems);

  // Handle views sidebar
  const handleViewsClick = () => {
    setIsViewsSidebarOpen(true);
  };

  // Handle column order change
  const handleColumnOrderChange = (newColumnOrder) => {
    setColumnOrder(newColumnOrder);
  };

  // Reset selection when changing pages
  React.useEffect(() => {
    handleSelectAll(false);
  }, [currentPage]);

  // Handle export
  const handleExport = () => {
    console.log('Exporting selected proposals:', selectedRows);
  };

  // Handle batch update
  const handleBatchUpdate = () => {
    console.log('Batch updating selected proposals:', selectedRows);
  };

  // Handle send email
  const handleSendEmail = () => {
    console.log('Sending email to selected proposals:', selectedRows);
  };

  // Handle print
  const handlePrint = () => {
    console.log('Printing selected proposals:', selectedRows);
  };

  // Handle download files
  const handleDownloadFiles = () => {
    console.log('Downloading files for selected proposals:', selectedRows);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-md shadow-sm">
        {/* Filter Controls */}
        <ProposalTableFilterControls 
          filters={filters}
          onFilterChange={onFilterChange}
          totalItems={totalItems} // Use totalItems from props instead of proposals.length
          view={view}
          onViewChange={onViewChange}
          onViewsClick={handleViewsClick}
          onRefresh={onRefresh}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={onPageChange}
          sortConfig={sortConfig}
          onSort={requestSort}
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
        
        {/* Loading state */}
        {externalLoading && (
          <div className="p-8 text-center">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Loading proposals...
            </div>
          </div>
        )}
        
        {/* Extracted table content for clarity */}
        {!externalLoading && (
          <ProposalTableContent
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
            isLoading={scrollLoading}
            observerRef={observerRef}
            onCompanySelect={onCompanySelect}
            selectedCompany={selectedCompany}
          />
        )}
        
        {/* Show total count and loaded items */}
        {!externalLoading && (
          <div className="p-2 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages} 
              {proposals.length > 0 && ` (${proposals.length} total proposals)`}
            </div>
            {selectedRows.size > 0 && (
              <div className="text-sm text-blue-600 font-medium">
                {selectedRows.size} proposal{selectedRows.size !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>
        )}
      </div>

      {/* Views Sidebar with pageType="proposals" and onViewSelected prop */}
      <ViewsSidebar
        isOpen={isViewsSidebarOpen}
        onClose={() => setIsViewsSidebarOpen(false)}
        columnOrder={columnOrder}
        onColumnOrderChange={handleColumnOrderChange}
        onViewSelected={onViewSelected}
        pageType="proposals"
      />
    </>
  );
};

export default ProposalsTable;
