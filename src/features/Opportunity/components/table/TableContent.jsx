import { Table, TableBody } from "@/components/ui/table";
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
  stages = [],
  prospectingStages = [],
  onRefresh,
  isSplitScreenMode = false,
}) => {
  return (
    <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="h-[600px] w-full overflow-y-auto">
        <div className="table-horizontal-scroll table-smooth-scroll min-w-full">
          <div className="table-content-wrapper">
            <Table
              className="w-full border-separate border-spacing-0"
              style={{ tableLayout: "fixed" }}
            >
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
                isSplitScreenMode={isSplitScreenMode}
              />
              <TableBody className="bg-white">
                {!isLoading && displayedItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={columnOrder.length + (isSplitScreenMode ? 1 : 2)}
                      className="py-8 text-center text-sm text-gray-500"
                    >
                      No opportunities to display
                    </td>
                  </tr>
                )}
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
                    prospectingStages={prospectingStages}
                    onRefresh={onRefresh}
                    isSplitScreenMode={isSplitScreenMode}
                  />
                ))}
                {isLoading && (
                  <InfiniteScrollLoader
                    columnCount={columnOrder.length + (isSplitScreenMode ? 1 : 2)}
                  />
                )}

                {/* Observer element placed at the end of the table body for proper intersection detection */}
                <tr ref={observerRef}>
                  <td
                    colSpan={columnOrder.length + (isSplitScreenMode ? 1 : 2)}
                    className="h-4 w-full"
                    style={{ backgroundColor: "transparent" }}
                  />
                </tr>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableContent;
