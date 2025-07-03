
import { Table, TableBody } from "@OpportunityComponents/ui/table";
import { ScrollArea } from "@OpportunityComponents/ui/scroll-area";
import OpportunityTableHeader from "./OpportunityTableHeader";
import OpportunityTableRow from "./OpportunityTableRow";
import InfiniteScrollLoader from "./InfiniteScrollLoader";

// Extracted table content rendering for clarity
const TableContent = ({
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
  selectedCompany,
  stages = []
}) => {
  return (
    <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <ScrollArea className="h-[600px] w-full">
        <div className="min-w-full overflow-auto">
          <Table className="w-full min-w-[1200px] border-separate border-spacing-0">
            <OpportunityTableHeader 
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
            <TableBody className="bg-white">
              {displayedItems.map((opp) => (
                <OpportunityTableRow 
                  key={opp.id} 
                  opportunity={opp}
                  isSelected={selectedRows.has(opp.id)}
                  onSelect={(checked) => handleRowSelect(opp.id, checked)}
                  columnOrder={columnOrder}
                  columnWidths={columnWidths}
                  onCompanySelect={onCompanySelect}
                  selectedCompany={selectedCompany}
                  stages={stages}
                />
              ))}
              {isLoading && <InfiniteScrollLoader columnCount={columnOrder.length} />}
              
              {/* Observer element placed at the end of the table body for proper intersection detection */}
              <tr ref={observerRef}>
                <td colSpan={columnOrder.length + 2} className="h-4 w-full" style={{ backgroundColor: 'transparent' }} />
              </tr>
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TableContent;
