import React from "react";
import KanbanBoard from "../kanban/KanbanBoard";
import TableFilterControls from "../table/TableFilterControls";
import EditOpportunityPanel from "../kanban/EditOpportunityPanel";
import { opportunitiesService } from "../../Services/opportunitiesService";
import { useStages } from "../../hooks/useStagesV2";
import { useSidePanel } from "@/components/shared/useSidePanel";
import {
  findOpportunityByDragId,
  getOpportunityDragId,
  extractOpportunityIdFromDragId,
  getActiveDraggableIds,
  isDraggableIdActive,
} from "../../utils/kanbanUtils";

const KanbanView = ({
  opportunities,
  view,
  onViewChange,
  filters,
  onFilterChange,
  users = [],
  onRefresh,
  totalCount = 0,
  currentPage = 1,
  onNextPage,
  onPreviousPage,
  savedSearches = {
    allOpportunities: [],
    myOpportunities: [],
  },
  onAddOpportunity,
}) => {
  const [localOpportunities, setLocalOpportunities] =
    React.useState(opportunities);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const { stages } = useStages();
  const { isOpen, data: opportunityId, openPanel, closePanel } = useSidePanel();

  // Update local opportunities when prop changes
  React.useEffect(() => {
    setLocalOpportunities(opportunities);
  }, [opportunities]);

  // Use opportunities directly since API filtering is applied at the server level
  const filteredOpportunities = localOpportunities;

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area or in same position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // Find the opportunity being moved
    const opportunity = findOpportunityByDragId(
      localOpportunities,
      draggableId
    );
    if (!opportunity) return;

    // Find the destination stage
    const destinationStage = stages.find(
      (stage) => stage.name === destination.droppableId
    );
    if (!destinationStage) return;

    setIsUpdating(true);

    try {
      const opportunityId = extractOpportunityIdFromDragId(draggableId);

      // Check if moving to "Closed Lost" stage - open edit panel instead of direct update
      if (
        destination.droppableId.toLowerCase().includes("closed") &&
        destination.droppableId.toLowerCase().includes("lost")
      ) {
        setIsUpdating(false);
        openPanel(opportunityId);
        return;
      }

      // Call the opportunity service method for drag and drop stage update
      await opportunitiesService.updateOpportunityStageByDrag(
        opportunityId,
        destinationStage.id
      );

      // Update local state optimistically
      const updatedOpportunities = localOpportunities.map((opp, index) => {
        const oppDragId = getOpportunityDragId(opp, index);
        if (oppDragId === draggableId) {
          return { ...opp, stage: destination.droppableId };
        }
        return opp;
      });

      setLocalOpportunities(updatedOpportunities);
    } catch (error) {
      console.error("Failed to update opportunity stage:", error);
      // Revert optimistic update on error
      const revertedOpportunities = localOpportunities.map((opp, index) => {
        const oppDragId = getOpportunityDragId(opp, index);
        if (oppDragId === draggableId) {
          return { ...opp, stage: source.droppableId };
        }
        return opp;
      });

      setLocalOpportunities(revertedOpportunities);
      alert("Failed to update opportunity stage. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOpportunity = async (opportunityId) => {
    setIsUpdating(true);

    try {
      await opportunitiesService.deleteOpportunity(opportunityId);

      // Remove the opportunity from local state using consistent ID matching
      const updatedOpportunities = localOpportunities.filter((opp, index) => {
        const oppDragId = getOpportunityDragId(opp, index);
        return oppDragId !== String(opportunityId);
      });

      setLocalOpportunities(updatedOpportunities);

      // Refresh the data to ensure consistency
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Failed to delete opportunity:", error);
      alert("Failed to delete opportunity. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveSuccess = () => {
    // Refresh data when opportunity is saved
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-md shadow-sm flex flex-col h-full"
      style={{ height: "calc(115vh - 100px)" }}
    >
      {/* Filter Controls */}
      <TableFilterControls
        filters={filters}
        onFilterChange={onFilterChange}
        totalCount={totalCount}
        currentPage={currentPage}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
        view={view}
        onViewChange={onViewChange}
        users={users}
        onRefresh={onRefresh}
        savedSearches={savedSearches}
        onAddOpportunity={onAddOpportunity}
      />

      {/* Kanban Board */}
      <KanbanBoard
        opportunities={filteredOpportunities}
        onDragEnd={handleDragEnd}
        isUpdating={isUpdating}
        onDeleteOpportunity={handleDeleteOpportunity}
        onEditOpportunity={openPanel}
      />

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
        <div className="text-sm text-gray-500">
          Showing {filteredOpportunities.length} opportunities across 6 stages
        </div>
      </div>

      {/* Edit Opportunity Panel */}
      <EditOpportunityPanel
        opportunityId={opportunityId}
        isOpen={isOpen}
        onClose={closePanel}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
};

export default KanbanView;
