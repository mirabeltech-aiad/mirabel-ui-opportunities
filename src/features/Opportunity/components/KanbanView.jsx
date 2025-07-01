
import React from "react";
import KanbanBoard from "./kanban/KanbanBoard";
import TableFilterControls from "./table/TableFilterControls";

const KanbanView = ({ opportunities, view, onViewChange, filters, onFilterChange, users = [], onRefresh }) => {
  const [localOpportunities, setLocalOpportunities] = React.useState(opportunities);

  // Update local opportunities when prop changes
  React.useEffect(() => {
    setLocalOpportunities(opportunities);
  }, [opportunities]);

  // Use opportunities directly since API filtering is applied at the server level
  const filteredOpportunities = localOpportunities;

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the opportunity being moved
    const opportunity = localOpportunities.find(opp => opp.id.toString() === draggableId);
    
    // Update the opportunity's stage
    const updatedOpportunities = localOpportunities.map(opp => {
      if (opp.id.toString() === draggableId) {
        return { ...opp, stage: destination.droppableId };
      }
      return opp;
    });

    setLocalOpportunities(updatedOpportunities);
    console.log(`Moved opportunity ${opportunity.opportunityName} from ${source.droppableId} to ${destination.droppableId}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm flex flex-col h-full">
      {/* Filter Controls */}
      <TableFilterControls 
        filters={filters}
        onFilterChange={onFilterChange}
        totalItems={filteredOpportunities.length}
        view={view}
        onViewChange={onViewChange}
        users={users}
        onRefresh={onRefresh}
      />
      
      {/* Kanban Board */}
      <KanbanBoard 
        opportunities={filteredOpportunities}
        onDragEnd={handleDragEnd}
      />
      
      {/* Footer */}
      <div className="p-2 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
        <div className="text-sm text-gray-500">
          Showing {filteredOpportunities.length} opportunities across 6 stages
        </div>
      </div>
    </div>
  );
};

export default KanbanView;
