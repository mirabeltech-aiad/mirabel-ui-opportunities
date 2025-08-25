
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * TableSortableHeader Component
 * 
 * Renders a sortable table header with drag-and-drop functionality for column reordering.
 * Displays sort indicators and handles user interactions for sorting and column management.
 * 
 * @param {Object} props - Component props
 * @param {string} props.column - The column identifier used for sorting
 * @param {string} props.label - Display text for the header
 * @param {Object} props.sortConfig - Current sort configuration
 * @param {string} props.sortConfig.key - Currently sorted column key
 * @param {'ascending'|'descending'} props.sortConfig.direction - Sort direction
 * @param {Function} props.requestSort - Callback function to request sorting by column
 * @param {string|null} props.draggedColumn - Currently dragged column identifier
 * @param {Function} props.handleDragStart - Drag start event handler
 * @param {Function} props.handleDragOver - Drag over event handler
 * @param {Function} props.handleDragEnd - Drag end event handler
 * @param {string} [props.className] - Additional CSS classes to apply
 * 
 * @returns {JSX.Element} Sortable table header component
 * 
 * @example
 * <TableSortableHeader
 *   column="name"
 *   label="Opportunity Name"
 *   sortConfig={{ key: 'name', direction: 'ascending' }}
 *   requestSort={handleSort}
 *   draggedColumn={null}
 *   handleDragStart={onDragStart}
 *   handleDragOver={onDragOver}
 *   handleDragEnd={onDragEnd}
 * />
 */
const TableSortableHeader = ({ 
  column, 
  label, 
  sortConfig, 
  requestSort, 
  draggedColumn, 
  handleDragStart, 
  handleDragOver, 
  handleDragEnd, 
  className 
}) => (
  <div 
    className={`cursor-pointer hover:bg-gray-100 select-none relative ${className || 'h-12 flex items-center px-4'}`}
    onClick={() => requestSort(column)}
    draggable="true"
    onDragStart={(e) => handleDragStart(e, column)}
    onDragOver={(e) => handleDragOver(e, column)}
    onDragEnd={handleDragEnd}
  >
    <div className="flex items-center w-full">
      <span className="truncate">{label}</span>
      {/* Sort indicator - shows current sort direction for active column */}
      {sortConfig.key === column ? (
        sortConfig.direction === 'ascending' ? 
          <ChevronUp className="h-3 w-3 ml-1 flex-shrink-0" /> : 
          <ChevronDown className="h-3 w-3 ml-1 flex-shrink-0" />
      ) : null}
    </div>
    {/* Visual feedback during drag operation */}
    {draggedColumn === column && (
      <div className="absolute inset-0 bg-blue-100 opacity-20 border-2 border-blue-300 rounded"></div>
    )}
  </div>
);

export default TableSortableHeader;
