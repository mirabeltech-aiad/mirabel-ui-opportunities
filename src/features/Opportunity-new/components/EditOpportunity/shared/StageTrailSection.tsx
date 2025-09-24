import React, { useState, useEffect } from "react";
import TimelineContainer from "./StageTrail/TimelineContainer.tsx";
import EmptyStageTrail from "./StageTrail/EmptyStageTrail.tsx";
import { opportunitiesService } from "@/features/Opportunity/Services/opportunitiesService";

interface StageChange {
  id: string;
  date: string;
  fromStage: string;
  toStage: string;
  user: string;
  timestamp: number;
  description: string;
  stageName: string;
  previousStage: string;
  updatedBy: string;
  updatedOn: string;
  colorCode: string;
}
interface Stage {
  id: string;
  name: string;
  colorCode: string;
}

interface StageTrailSectionProps {
  opportunityId?: string;
  stages: Stage[];
}

/**
 * StageTrailSection Component
 * 
 * Displays the complete stage progression timeline for an opportunity.
 * Shows all stage changes in chronological order with timestamps and user information.
 * Provides visual feedback when no stage changes have occurred yet.
 */
const StageTrailSection: React.FC<StageTrailSectionProps> = ({ opportunityId, stages }) => {
  const [stageChanges, setStageChanges] = useState<StageChange[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStageChanges = async () => {
      if (!opportunityId) {
        setStageChanges([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
      

        const response = await opportunitiesService.getOpportunityHistory(opportunityId);

        if (response && response.content && response.content.Data && response.content.Data.Audit) {
          const auditData = response.content.Data.Audit;

          // Filter for stage-related changes only
          const stageAuditData = auditData.filter((item: any) =>
            item.FieldName && item.FieldName.toLowerCase().includes('stage')
          );


          // Transform API data to match the expected format for TimelineContainer
          const transformedStageChanges: StageChange[] = stageAuditData.map((item: any, index: number) => {
            // Parse the date to get a proper Date object
            const changeDate = new Date(item.UpdatedOn);

            return {
              id: `stage-${opportunityId}-${index}`,
              date: item.UpdatedOn,
              fromStage: item.FieldValueOld || 'Unknown',
              toStage: item.FieldValueNew || 'Unknown',
              user: item.UpdatedBy || 'System',
              timestamp: changeDate.getTime(), // For sorting
              description: `Stage changed from "${item.FieldValueOld || 'Unknown'}" to "${item.FieldValueNew || 'Unknown'}"`,
              // Additional fields that TimelineContainer might expect
              stageName: item.FieldValueNew || 'Unknown',
              previousStage: item.FieldValueOld || 'Unknown',
              updatedBy: item.UpdatedBy || 'System',
              updatedOn: item.UpdatedOn,
              colorCode: stages.find(x => x.name === item.FieldValueNew)?.colorCode || '#000000'
            };
          });

          // Sort by date (newest first)
          const sortedStageChanges = transformedStageChanges.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          setStageChanges(sortedStageChanges);
        } else {
          console.log('StageTrailSection: No audit data found in response');
          setStageChanges([]);
        }
      } catch (error) {

        setError('Failed to load stage progression data');
        setStageChanges([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStageChanges();
  }, [opportunityId]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Stage Progression Timeline</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
          <span className="text-gray-500">Loading stage progression...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Stage Progression Timeline</h3>
        </div>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
          <p className="text-sm mt-2">Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section header with stage change count */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Stage Progression Timeline</h3>
        <div className="text-sm text-gray-500">
          {stageChanges.length} stage changes
        </div>
      </div>

      {/* Conditional rendering based on stage change availability */}
      {stageChanges.length > 0 ? (
        <TimelineContainer stageChanges={stageChanges} />
      ) : (
        <EmptyStageTrail />
      )}
    </div>
  );
};

export default StageTrailSection;