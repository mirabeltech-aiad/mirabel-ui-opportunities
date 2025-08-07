
import React, { useState } from "react";
import ProposalTableFilterControls from "./ProposalTableFilterControls";
import ProposalTableContent from "./ProposalTableContent";
import ProposalCardsView from "./ProposalCardsView";
import ProposalKanbanView from "./ProposalKanbanView";
import TableActionsPanel from "./TableActionsPanel";
import ViewsSidebar from "./ViewsSidebar";
import { useProposalTableColumns } from "./ProposalTableColumnManager";
import { useProposalsTableState } from "./useProposalsTableState";
import { useRowSelection } from "./useRowSelection";

const ProposalsTable = ({ 
  proposals, 
  view, 
  onViewChange, 
  onCompanySelect, 
  selectedCompany, 
  filters, 
  onFilterChange, 
  onRefresh 
}) => {
  const [isViewsSidebarOpen, setIsViewsSidebarOpen] = useState(false);
  
  const {
    columnOrder,
    draggedColumn,
    columnWidths,
    handleColumnResize,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    setColumnOrder
  } = useProposalTableColumns();

  const {
    sortConfig,
    currentSort,
    sortedProposals,
    handleSort,
    requestSort
  } = useProposalsTableState(proposals);

  const {
    selectedRows,
    selectAll,
    handleRowSelect,
    handleSelectAll
  } = useRowSelection(sortedProposals);

  const handleSortClick = () => {
    // For now, we'll use a default sort option when the sort button is clicked
    // This could be enhanced to show a sort menu or cycle through sort options
    const nextSort = currentSort === 'name-asc' ? 'name-desc' : 'name-asc';
    handleSort(nextSort);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-md shadow-sm">
        <ProposalTableFilterControls 
          filters={filters}
          onFilterChange={onFilterChange}
          totalItems={sortedProposals.length}
          view={view}
          onViewChange={onViewChange}
          onViewsClick={() => setIsViewsSidebarOpen(true)}
          onRefresh={onRefresh}
          onSort={handleSortClick}
        />
        
        {selectedRows.size > 0 && (
          <div className="px-4 pt-4">
            <TableActionsPanel 
              selectedCount={selectedRows.size}
              onExport={() => {/* Export functionality */}}
              onBatchUpdate={() => {/* Batch update functionality */}}
              onSendEmail={() => {/* Send email functionality */}}
            />
          </div>
        )}
        
        {view === 'table' ? (
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
            displayedItems={sortedProposals}
            selectedRows={selectedRows}
            handleRowSelect={handleRowSelect}
            isLoading={false}
            observerRef={null}
            onCompanySelect={onCompanySelect}
            selectedCompany={selectedCompany}
          />
        ) : view === 'cards' ? (
          <ProposalCardsView
            proposals={sortedProposals}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onCompanySelect={onCompanySelect}
            selectedCompany={selectedCompany}
          />
        ) : view === 'kanban' ? (
          <ProposalKanbanView
            proposals={sortedProposals}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onCompanySelect={onCompanySelect}
            selectedCompany={selectedCompany}
          />
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>{view.charAt(0).toUpperCase() + view.slice(1)} view is not implemented yet.</p>
          </div>
        )}
      </div>

      <ViewsSidebar
        isOpen={isViewsSidebarOpen}
        onClose={() => setIsViewsSidebarOpen(false)}
        columnOrder={columnOrder}
        onColumnOrderChange={setColumnOrder}
      />
    </>
  );
};

export default ProposalsTable;
