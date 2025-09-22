import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import KanbanColumn from "./KanbanColumn";
import { useStages } from "@/features/Opportunity/hooks/useStagesV2";

const KanbanBoard = ({
  opportunities,
  stages: passedStages,
  onDragEnd,
  isUpdating = false,
  onDeleteOpportunity,
  onEditOpportunity,
}) => {
  // Use passed stages if available, otherwise fetch from API
  const { stages: fetchedStages, isLoading, error } = useStages();
  const stages = passedStages && passedStages.length > 0 ? passedStages : fetchedStages;

  // Create columns from API stages with their actual color codes
  const columns = stages.map((stage) => ({
    id: stage.name || stage.label,
    title: stage.name || stage.label,
    colorCode: stage.colorCode,
  }));

  console.log("KanbanBoard: Received data:", {
    opportunitiesCount: opportunities.length,
    passedStagesCount: passedStages?.length || 0,
    fetchedStagesCount: fetchedStages?.length || 0,
    finalStagesCount: stages.length,
    columns: columns.length,
    isLoading,
    error: !!error
  });

  // Group opportunities by stage
  const groupedOpportunities = columns.reduce((acc, column) => {
    const opportunitiesForStage = opportunities.filter((opp) => {
      return opp.stage === column.id;
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

  // Show loading state only if we don't have passed stages and are still loading
  if ((!passedStages || passedStages.length === 0) && isLoading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading stages...</p>
        </div>
      </div>
    );
  }

  // Show error state only if we don't have passed stages and there's an error
  if ((!passedStages || passedStages.length === 0) && error) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load stages</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

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
        {/* Debug info */}
        <div className="mb-2 p-2 bg-blue-100 text-xs rounded">
          <strong>KanbanBoard Debug:</strong>
          Opportunities: {opportunities.length} |
          Stages: {stages.length} |
          Columns: {columns.length} |
          Grouped Total: {Object.values(groupedOpportunities).reduce((sum, opps) => sum + opps.length, 0)}
        </div>

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