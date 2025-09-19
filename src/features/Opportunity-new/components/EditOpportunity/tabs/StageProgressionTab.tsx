import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock, TrendingUp } from 'lucide-react';
import { FloatingLabelSelect } from '@/shared/components/ui/FloatingLabelSelect';
import { OpportunityFormData } from '../../../types/opportunity';
import { OPPORTUNITY_STATUS_OPTIONS } from '../../../constants/opportunityOptions';
import axiosService from '@/services/axiosService.js';

interface StageProgressionTabProps {
  formData: OpportunityFormData;
  handleInputChange: (field: string, value: any) => void;
  opportunityId?: string;
}

interface StageHistory {
  ID: number;
  Stage: string;
  EnteredDate: string;
  ExitedDate?: string;
  DaysInStage: number;
  ChangedBy: string;
  IsCurrentStage: boolean;
}

const StageProgressionTab: React.FC<StageProgressionTabProps> = ({
  formData,
  handleInputChange,
  opportunityId
}) => {
  const [stageHistory, setStageHistory] = useState<StageHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Mock stages data for now
  const stages: any[] = [];

  // Load stage history
  const loadStageHistory = async () => {
    if (!opportunityId) return;

    setIsLoading(true);
    try {
      const response = await axiosService.get(`/services/Opportunities/StageHistory/${opportunityId}`);
      if (response?.content && Array.isArray(response.content)) {
        setStageHistory(response.content);
      }
    } catch (error) {
      console.error('Failed to load stage history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStageHistory();
  }, [opportunityId]);

  const getStageIcon = (stage: StageHistory, index: number) => {
    if (stage.IsCurrentStage) {
      return <Clock className="h-5 w-5 text-blue-600" />;
    } else if (stage.ExitedDate) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else {
      return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStageColor = (stage: StageHistory) => {
    if (stage.IsCurrentStage) {
      return 'border-blue-500 bg-blue-50';
    } else if (stage.ExitedDate) {
      return 'border-green-500 bg-green-50';
    } else {
      return 'border-gray-300 bg-gray-50';
    }
  };

  const calculateTotalDays = () => {
    return stageHistory.reduce((total, stage) => total + stage.DaysInStage, 0);
  };

  const getAverageStageTime = () => {
    const completedStages = stageHistory.filter(stage => stage.ExitedDate);
    if (completedStages.length === 0) return 0;
    
    const totalDays = completedStages.reduce((total, stage) => total + stage.DaysInStage, 0);
    return Math.round(totalDays / completedStages.length);
  };

  return (
    <div className="space-y-6">
      {/* Current Status Controls */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FloatingLabelSelect
            id="currentStatus"
            label="Status"
            value={formData.status}
            onChange={(value) => handleInputChange('status', value)}
            options={OPPORTUNITY_STATUS_OPTIONS}
          />
          
          <FloatingLabelSelect
            id="currentStage"
            label="Stage"
            value={formData.stage}
            onChange={(value) => handleInputChange('stage', value)}
            options={stages.map(stage => ({
              value: stage.Stage,
              label: stage.Stage
            }))}
          />
          
          <div className="flex items-center space-x-2 pt-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Stage Percentage</p>
              <p className="text-lg font-semibold text-blue-600">
                {formData.stagePercentage || formData.probability}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Progression Timeline */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Stage Progression</h3>
          <p className="text-sm text-gray-600 mt-1">
            Visual timeline of stage progression through the sales process
          </p>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading stage history...
          </div>
        ) : stageHistory.length > 0 ? (
          <div className="p-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{calculateTotalDays()}</p>
                <p className="text-sm text-gray-600">Total Days in Pipeline</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{getAverageStageTime()}</p>
                <p className="text-sm text-gray-600">Avg Days per Stage</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{stageHistory.length}</p>
                <p className="text-sm text-gray-600">Stages Completed</p>
              </div>
            </div>

            {/* Stage Timeline */}
            <div className="space-y-4">
              {stageHistory.map((stage, index) => (
                <div
                  key={stage.ID}
                  className={`flex items-start space-x-4 p-4 rounded-lg border-2 ${getStageColor(stage)}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getStageIcon(stage, index)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-medium text-gray-900">
                        {stage.Stage}
                      </h4>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {stage.DaysInStage} days
                        </p>
                        {stage.IsCurrentStage && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>
                          Entered: {new Date(stage.EnteredDate).toLocaleDateString()}
                        </span>
                        {stage.ExitedDate && (
                          <span>
                            Exited: {new Date(stage.ExitedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-1 text-xs text-gray-500">
                        Changed by {stage.ChangedBy}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No stage progression data available.</p>
            <p className="text-sm mt-1">Stage changes will be tracked here once the opportunity is saved.</p>
          </div>
        )}
      </div>

      {/* Stage Performance Insights */}
      {stageHistory.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Longest Stage</h4>
              {(() => {
                const longestStage = stageHistory.reduce((prev, current) => 
                  prev.DaysInStage > current.DaysInStage ? prev : current
                );
                return (
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="font-medium text-orange-900">{longestStage.Stage}</p>
                    <p className="text-sm text-orange-700">{longestStage.DaysInStage} days</p>
                  </div>
                );
              })()}
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Process Velocity</h4>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-900">
                  {calculateTotalDays() > 0 ? 
                    `${(stageHistory.length / calculateTotalDays() * 100).toFixed(1)}% stages/day` : 
                    'No data'
                  }
                </p>
                <p className="text-sm text-blue-700">Overall progression rate</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StageProgressionTab;