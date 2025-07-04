
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import KanbanColumn from "./KanbanColumn";

const KanbanBoard = ({ opportunities, onDragEnd }) => {
  // Define kanban columns based on stages
  const columns = [
    { id: "1st Demo", title: "1st Demo", color: "bg-blue-50 border-blue-200" },
    { id: "Discovery", title: "Discovery", color: "bg-purple-50 border-purple-200" },
    { id: "Proposal", title: "Proposal", color: "bg-yellow-50 border-yellow-200" },
    { id: "Negotiation", title: "Negotiation", color: "bg-orange-50 border-orange-200" },
    { id: "Closed Won", title: "Closed Won", color: "bg-green-50 border-green-200" },
    { id: "Closed Lost", title: "Closed Lost", color: "bg-red-50 border-red-200" }
  ];

  // Group opportunities by stage
  const groupedOpportunities = columns.reduce((acc, column) => {
    acc[column.id] = opportunities.filter(opp => opp.stage === column.id);
    return acc;
  }, {});

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex-1 p-4 overflow-x-auto">
        <div className="flex gap-4 h-full" style={{ minWidth: `${columns.length * 288}px` }}>
          {columns.map((column) => {
            const columnOpportunities = groupedOpportunities[column.id] || [];
            
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                opportunities={columnOpportunities}
              />
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
