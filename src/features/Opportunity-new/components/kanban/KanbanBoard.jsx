import React from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";

const KanbanBoard = ({
  opportunities,
  stages,
  onDragEnd,
  isUpdating = false,
  onDeleteOpportunity,
  onEditOpportunity,
}) => {

  // Create columns from API stages with their actual color codes
  const columns = stages.map((stage) => ({
    id: stage.name || stage.label,
    title: stage.name || stage.label,
    colorCode: stage.colorCode,
    stageId: stage.id, // Keep the numeric ID for API calls
  }));

  console.log("KanbanBoard: Received data:", {
    opportunitiesCount: opportunities.length,
    finalStagesCount: stages?.length || 0,
    columns: columns.length,
    stageNames: (stages || []).map(s => s.name || s.label),
    opportunityStages: [...new Set(opportunities.map(o => o.stage))]
  });

  // Group opportunities by stage - try multiple matching strategies
  const groupedOpportunities = columns.reduce((acc, column) => {
    const opportunitiesForStage = opportunities.filter((opp) => {
      // Try exact match first
      if (opp.stage === column.id) return true;
      
      // Try case-insensitive match
      if (opp.stage?.toLowerCase() === column.id?.toLowerCase()) return true;
      
      // Try matching against stage ID if opportunity has numeric stage
      if (opp.stageId === column.stageId) return true;
      
      // Try matching against OppStageDetails.Stage
      if (opp.OppStageDetails?.Stage === column.id) return true;
      
      return false;
    });
    acc[column.id] = opportunitiesForStage;
    return acc;
  }, {});

  console.log("KanbanBoard: Successfully grouped opportunities:", {
    totalOpportunities: opportunities.length,
    groupedCount: Object.values(groupedOpportunities).reduce((sum, opps) => sum + opps.length, 0),
    stageBreakdown: Object.entries(groupedOpportunities).map(([stage, opps]) => ({
      stage,
      count: opps.length
    }))
  });

  const handleDragEnd = (result) => {
    if (isUpdating) {
      return;
    }

    onDragEnd(result);
  };

  // Show empty state if no stages
  if (!stages || stages.length === 0) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No stages available</p>
          <p className="text-sm text-gray-500 mt-2">
            Unable to load pipeline stages. Please refresh the page or contact
            support.
          </p>
        </div>
      </div>
    );
  }

  // Show debug info if no opportunities are being grouped properly
  const totalGroupedOpportunities = Object.values(groupedOpportunities).reduce(
    (sum, opps) => sum + opps.length,
    0
  );
  if (opportunities.length > 0 && totalGroupedOpportunities === 0) {
    console.warn(
      "KanbanBoard: Opportunities exist but none are being grouped into stages"
    );
    console.warn(
      "Available stages:",
      stages.map((s) => s.name || s.label)
    );
    console.warn("Opportunity stages:", [
      ...new Set(opportunities.map((o) => o.stage)),
    ]);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div
        className={`flex-1 p-4 overflow-x-auto ${isUpdating ? "pointer-events-none opacity-50" : ""
          }`}
      >
        

        <div
          className="flex gap-4 h-full"
          style={{ minWidth: `${columns.length * 288}px` }}
        >
          {columns.map((column) => {
            const columnOpportunities = groupedOpportunities[column.id] || [];

            return (
              <KanbanColumn
                key={column.id}
                column={column}
                opportunities={columnOpportunities}
                allOpportunities={opportunities}
                isUpdating={isUpdating}
                onDeleteOpportunity={onDeleteOpportunity}
                onEditOpportunity={onEditOpportunity}
              />
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;