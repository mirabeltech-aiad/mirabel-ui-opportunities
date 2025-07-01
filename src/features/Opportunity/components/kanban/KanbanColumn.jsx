
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { Badge } from "@/components/ui/badge";
import KanbanCard from "./KanbanCard";

const KanbanColumn = ({ column, opportunities }) => {
  const columnTotal = opportunities.reduce((sum, opp) => sum + (typeof opp.amount === 'number' ? opp.amount : 0), 0);

  return (
    <div 
      className={`flex-1 min-w-72 ${column.color} rounded-lg border-2 border-dashed flex flex-col h-full`}
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
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-3 flex-1 overflow-y-auto min-h-32 ${
              snapshot.isDraggingOver ? 'bg-gray-50' : ''
            }`}
          >
            {opportunities.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                No opportunities
              </div>
            ) : (
              opportunities.map((opportunity, index) => (
                <KanbanCard 
                  key={opportunity.id} 
                  opportunity={opportunity} 
                  index={index}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
