import React from "react";
import KanbanBoard from "./KanbanBoard";
import EditOpportunityPanel from "./EditOpportunityPanel";
import { opportunityService } from "../../services/opportunityService";
import { useSidePanel } from "@/components/shared/useSidePanel";
import {
  findOpportunityByDragId,
  getDragId,
  extractOpportunityIdFromDragId,
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
  const [localStages, setLocalStages] = React.useState(stages);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [stagesLoading, setStagesLoading] = React.useState(true);
  const [stagesFetched, setStagesFetched] = React.useState(false);
  const stagesLoadStartedRef = React.useRef(false);
  const [opportunitiesFetched, setOpportunitiesFetched] = React.useState(false);
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

  // Fetch stages once for the Kanban view (similar to old Pipeline)
  React.useEffect(() => {
    const fetchStages = async () => {
      try {
        setStagesLoading(true);
        console.log("KanbanView: Fetching stages from API...");
        
        const response = await opportunityService.getOpportunityStages();
        console.log("KanbanView: Stages API response:", response);

        if (response?.content?.List) {
          const sortedStages = response.content.List.sort(
            (a, b) => a.SortOrder - b.SortOrder
          ).map((stageData) => ({
            id: stageData.ID,
            name: stageData.Stage,
            colorCode: stageData.ColorCode,
            description: stageData.Description,
            sortOrder: stageData.SortOrder,
          }));
          
          console.log("KanbanView: Processed stages:", sortedStages);
          setLocalStages(sortedStages);
        } else {
          console.warn("KanbanView: No stages found in API response");
          setLocalStages([]);
        }
      } catch (error) {
        console.error("KanbanView: Error fetching stages:", error);
        setLocalStages([]);
      } finally {
        setStagesLoading(false);
        setStagesFetched(true);
      }
    };

    // Check if we have valid stages from parent
    const hasValidParentStages = stages && Array.isArray(stages) && stages.length > 0;
    
    if (hasValidParentStages && !stagesFetched) {
      console.log("KanbanView: Using stages provided by parent:", stages.length);
      setLocalStages(stages);
      setStagesLoading(false);
      setStagesFetched(true);
    } else if (!stagesFetched && !hasValidParentStages && !stagesLoadStartedRef.current) {
      // Only fetch once if we don't have parent stages
      stagesLoadStartedRef.current = true;
      console.log("KanbanView: No valid stages from parent, fetching from API");
      fetchStages();
    }
  }, [stages, stagesFetched]);

  // Load opportunities data if Pipeline doesn't provide it
  React.useEffect(() => {
    const loadOpportunities = async () => {
      console.log("KanbanView: Checking opportunities data from Pipeline:", {
        opportunitiesCount: opportunities?.length || 0,
        hasOnRefresh: !!onRefresh,
        opportunitiesProvided: !!opportunities,
        opportunitiesFetched
      });

      // Always use Pipeline data if provided, even if empty (means Pipeline loaded but found no results)
      if (opportunities !== undefined && !opportunitiesFetched) {
        console.log("KanbanView: Using opportunities from Pipeline:", opportunities.length);
        setLocalOpportunities(opportunities);
        setIsLoading(false);
        setOpportunitiesFetched(true);
        return;
      }

      // Only load data directly if Pipeline hasn't provided any data yet and we haven't fetched before
      if (!opportunitiesFetched && !isLoading && opportunities === undefined) {
        console.log("KanbanView: No opportunities data from Pipeline yet, loading directly...");
        setIsLoading(true);
        
        try {
          // Use the same approach as old Pipeline - build filters and call the API
          const apiFilters = filters && Object.keys(filters).length > 0 
            ? filters 
            : { quickStatus: 'All Opportunities' };
            
          console.log("KanbanView: Loading opportunities with filters:", apiFilters);
          
          const result = await opportunityService.getFormattedOpportunities(apiFilters);
          
          console.log("KanbanView: Direct API result:", result);
          
          if (result.opportunitiesData && Array.isArray(result.opportunitiesData)) {
            console.log("KanbanView: Setting opportunities from direct API:", result.opportunitiesData.length);
            setLocalOpportunities(result.opportunitiesData);
          } else {
            console.warn("KanbanView: No data from direct API call");
            setLocalOpportunities([]);
          }
          setOpportunitiesFetched(true);
        } catch (error) {
          console.error("KanbanView: Error loading opportunities directly:", error);
          setLocalOpportunities([]);
          setOpportunitiesFetched(true);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadOpportunities();
  }, [opportunities, opportunitiesFetched, isLoading, filters]); // More specific dependencies

  // Use opportunities directly since API filtering is applied at the server level
  const filteredOpportunities = React.useMemo(() => localOpportunities, [localOpportunities]);

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

      // Find the stage ID for the destination stage name
      const destinationStage = localStages.find(stage => 
        stage.name === destination.droppableId || 
        stage.name?.toLowerCase() === destination.droppableId?.toLowerCase()
      );
      
      if (!destinationStage) {
        console.error("Could not find stage ID for:", destination.droppableId);
        setIsUpdating(false);
        return;
      }

      console.log("KanbanView: Moving opportunity", opportunityId, "to stage", destinationStage.name, "with ID", destinationStage.id);

      // Call the opportunity service method for drag and drop stage update
      await opportunityService.updateOpportunityStageByDrag(
        opportunityId,
        destinationStage.id
      );

      // Update local state optimistically
      const updatedOpportunities = localOpportunities.map((opp, index) => {
        const oppDragId = getDragId(opp, index);
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
      await opportunityService.deleteOpportunity(opportunityId);

      // Remove from local state
      const updatedOpportunities = localOpportunities.filter((opp, index) => {
        const oppDragId = getDragId(opp, index);
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

  if (isLoading || stagesLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-md shadow-sm flex flex-col h-full">
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">
              {stagesLoading ? 'Loading stages...' : 'Loading opportunities...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm flex flex-col h-full">
      
      <KanbanBoard
        opportunities={filteredOpportunities}
        stages={localStages}
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