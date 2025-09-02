import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { Badge } from "@/components/ui/badge";
import KanbanCard from "./KanbanCard";

const KanbanColumn = ({
  column,
  opportunities,
  allOpportunities = [],
  isUpdating = false,
  onDeleteOpportunity,
  onEditOpportunity,
}) => {
  const columnTotal = opportunities.reduce(
    (sum, opp) => sum + (typeof opp.amount === "number" ? opp.amount : 0),
    0
  );

  // Helper function to get background and border colors from color code
  const getColumnStyles = () => {
    if (!column.colorCode) {
      return {
        backgroundColor: "#f9fafb", // gray-50
        borderColor: "#e5e7eb", // gray-200
      };
    }

    // Convert hex to RGB for background (light version)
    const hex = column.colorCode.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
      borderColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
    };
  };

  const columnStyles = getColumnStyles();

  return (
    <div
      className={`flex-1 min-w-72 rounded-lg border-2 border-dashed flex flex-col h-full ${
        isUpdating ? "pointer-events-none" : ""
      }`}
      style={columnStyles}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-gray-200 bg-white/50 rounded-t-lg flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{column.title}</h3>
          <Badge variant="outline" className="text-xs">
            {opportunities.length}
          </Badge>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          ${columnTotal.toLocaleString()} total
        </div>
      </div>

      {/* Column Content */}
      <Droppable droppableId={column.id} isDropDisabled={isUpdating}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-3 flex-1 overflow-y-auto min-h-32 ${
              snapshot.isDraggingOver ? "" : "bg-gray-50"
            }`}
          >
            {opportunities.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                No opportunities
              </div>
            ) : (
              opportunities.map((opportunity, columnIndex) => {
                // Use a stable key to prevent unnecessary remounting
                const stableKey = `card-${
                  opportunity.ID ||
                  opportunity.id ||
                  opportunity.opportunityName ||
                  columnIndex
                }`;

                return (
                  <KanbanCard
                    key={stableKey}
                    opportunity={opportunity}
                    index={columnIndex}
                    isUpdating={isUpdating}
                    onDeleteOpportunity={onDeleteOpportunity}
                    onEditOpportunity={onEditOpportunity}
                  />
                );
              })
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
