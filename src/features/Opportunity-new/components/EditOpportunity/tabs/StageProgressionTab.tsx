import React, { useState, useEffect } from 'react';
import { OpportunityFormData } from '@/features/opportunity-new/types/opportunity';
import StageTrailSection from '../shared/StageTrailSection';
import StatusProgressSection from './StatusProgressSection';
import { OPPORTUNITY_STATUS_OPTIONS } from '../../../constants/opportunityOptions';
import { opportunityService } from '../../../services/opportunityService';

interface StageProgressionTabProps {
  formData: OpportunityFormData;
  handleInputChange: (field: string, value: any) => void;
  opportunityId?: string;
}

interface Stage {
  id: string;
  name: string;
  colorCode: string;
}

const StageProgressionTab: React.FC<StageProgressionTabProps> = ({
  formData,
  handleInputChange,
  opportunityId
}) => {
  const [stageOptions, setStageOptions] = useState<Stage[]>([]);
  const [isLoadingStages, setIsLoadingStages] = useState(false);

  // Load stages from API
  useEffect(() => {
    const loadStages = async () => {
      setIsLoadingStages(true);
      try {
        const response = await opportunityService.getOpportunityStages();
        
        if (response?.content?.List) {
          const sortedStages = response.content.List.sort(
            (a: any, b: any) => a.SortOrder - b.SortOrder
          ).map((stageData: any) => ({
            id: stageData.ID,
            name: stageData.Stage,
            colorCode: stageData.ColorCode
          }));
          
          setStageOptions(sortedStages);
        } else {
          // Fallback to default stages if API fails
          setStageOptions([]);
        }
      } catch (error) {
        console.error('Failed to load stages:', error);
        // Fallback to default stages
        setStageOptions([]);
      } finally {
        setIsLoadingStages(false);
      }
    };

    loadStages();
  }, []);

  return (
    <div className="space-y-6">
      <StageTrailSection opportunityId={opportunityId} stages={stageOptions} />
      <StatusProgressSection
        formData={formData}
        handleInputChange={handleInputChange}
        statusOptions={OPPORTUNITY_STATUS_OPTIONS}
        stageOptions={stageOptions}
        isLoadingStages={isLoadingStages}
      />
    </div>
  );
};

export default StageProgressionTab;