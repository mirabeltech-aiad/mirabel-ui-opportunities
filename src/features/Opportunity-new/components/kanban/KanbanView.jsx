import React from "react";
import KanbanBoard from "./KanbanBoard";
import EditOpportunityPanel from "./EditOpportunityPanel";
import { opportunitiesService } from "@/features/Opportunity/Services/opportunitiesService";
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
  stages = [],
  onAddOpportunity,
}) => {
  const [localOpportunities, setLocalOpportunities] =
    React.useState(opportunities);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { isOpen, data: opportunityId, openPanel, closePanel } = useSidePanel();

  // Debug logging for props
  React.useEffect(() => {
    console.log("KanbanView: Received props:", {
      opportunitiesCount: opportunities?.length || 0,
      stagesCount: stages?.length || 0,
      view,
      hasOnRefresh: !!onRefresh,
      totalCount,
      currentPage
    });
  }, [opportunities, stages, view, onRefresh, totalCount, currentPage]);

  // Load data if Pipeline doesn't provide it
  React.useEffect(() => {
    const loadData = async () => {
      console.log("KanbanView: Checking data from Pipeline:", {
        opportunitiesCount: opportunities?.length || 0,
        hasOnRefresh: !!onRefresh,
        opportunitiesProvided: !!opportunities
      });

      // Always use Pipeline data if provided, even if empty (means Pipeline loaded but found no results)
      if (opportunities !== undefined) {
        console.log("KanbanView: Using opportunities from Pipeline:", opportunities.length);
        setLocalOpportunities(opportunities);
        setIsLoading(false);
        return;
      }

      // Only load data directly if Pipeline hasn't provided any data yet (undefined)
      console.log("KanbanView: No data from Pipeline yet, loading directly...");
      setIsLoading(true);
      
      try {
        const result = await opportunitiesService.getFormattedOpportunities({
          quickStatus: 'All Opportunities'
        });
        
        console.log("KanbanView: Direct API result:", result);
        
        if (result.opportunitiesData && Array.isArray(result.opportunitiesData)) {
          console.log("KanbanView: Setting opportunities from direct API:", result.opportunitiesData.length);
          setLocalOpportunities(result.opportunitiesData);
        } else {
          console.warn("KanbanView: No data from direct API call");
          setLocalOpportunities([]);
        }
      } catch (error) {
        console.error("KanbanView: Error loading data directly:", error);
        setLocalOpportunities([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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
        destination.droppableId
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

      // Refresh data to get updated information
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Failed to update opportunity stage:", error);
      alert("Failed to update opportunity stage. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOpportunity = async (opportunityId) => {
    setIsUpdating(true);

    try {
      await opportunitiesService.deleteOpportunity(opportunityId);

      // Remove from local state
      const updatedOpportunities = localOpportunities.filter((opp, index) => {
        const oppDragId = getOpportunityDragId(opp, index);
        return oppDragId !== String(opportunityId);
      });

      setLocalOpportunities(updatedOpportunities);

      // Refresh data
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

  const handleEditOpportunity = (opportunityId) => {
    openPanel(opportunityId);
  };

  const handleSaveSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
    closePanel();
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-md shadow-sm flex flex-col h-full">
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm flex flex-col h-full">
      {/* Debug info at the top */}
      <div className="p-2 bg-yellow-100 border-b text-xs">
        <strong>KanbanView Debug:</strong> 
        Opportunities: {filteredOpportunities?.length || 0} | 
        Stages: {stages?.length || 0} | 
        View: {view} |
        Loading: {isLoading ? 'Yes' : 'No'}
      </div>
      
      <KanbanBoard
        opportunities={filteredOpportunities}
        stages={stages}
        onDragEnd={handleDragEnd}
        isUpdating={isUpdating}
        onDeleteOpportunity={handleDeleteOpportunity}
        onEditOpportunity={handleEditOpportunity}
      />

      <div className="p-2 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
        <div className="text-sm text-gray-500">
          Showing {filteredOpportunities.length} opportunities across multiple stages
        </div>
        {(!opportunities || opportunities.length === 0) && filteredOpportunities.length > 0 && (
          <div className="text-xs text-orange-500 ml-2">
            (Loaded directly - Pipeline data unavailable)
          </div>
        )}
      </div>

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