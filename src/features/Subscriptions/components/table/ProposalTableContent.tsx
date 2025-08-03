
import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProposalTableHeader from "./ProposalTableHeader";
import ProposalTableRow from "./ProposalTableRow";
import InfiniteScrollLoader from "./InfiniteScrollLoader";

const ProposalTableContent = ({
  columnOrder,
  sortConfig,
  requestSort,
  draggedColumn,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  selectAll,
  onSelectAll,
  columnWidths,
  onColumnResize,
  displayedItems,
  selectedRows,
  handleRowSelect,
  isLoading,
  observerRef,
  onCompanySelect,
  selectedCompany
}) => {
  const handleEditProposal = (proposalId: string) => {
    // Open edit dialog functionality
    // This would typically open a modal or navigate to edit page
    // Implementation depends on your routing/modal system
  };

  return (
    <div className="relative">
      <ScrollArea className="h-[600px] w-full">
        <div className="min-w-full overflow-auto">
          <Table className="w-full min-w-[1200px]">
            <ProposalTableHeader 
              columnOrder={columnOrder}
              sortConfig={sortConfig}
              requestSort={requestSort}
              draggedColumn={draggedColumn}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDragEnd={handleDragEnd}
              selectAll={selectAll}
              onSelectAll={onSelectAll}
              columnWidths={columnWidths}
              onColumnResize={onColumnResize}
            />
            <TableBody>
              {displayedItems.map((proposal) => (
                <ProposalTableRow 
                  key={proposal.id} 
                  proposal={proposal}
                  isSelected={selectedRows.has(proposal.id)}
                  onSelect={(checked) => handleRowSelect(proposal.id, checked)}
                  columnOrder={columnOrder}
                  columnWidths={columnWidths}
                  onCompanySelect={onCompanySelect}
                  selectedCompany={selectedCompany}
                  onEditProposal={handleEditProposal}
                />
              ))}
              {isLoading && <InfiniteScrollLoader columnCount={columnOrder.length} />}
              {observerRef && (
                <tr ref={observerRef}>
                  <td colSpan={columnOrder.length} className="h-4 w-full" style={{ backgroundColor: 'transparent' }} />
                </tr>
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProposalTableContent;
