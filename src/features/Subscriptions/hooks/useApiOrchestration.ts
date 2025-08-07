
/**
 * @fileoverview API Orchestration Hook
 * 
 * Coordinates API calls with priority-based timing and dependencies
 */

import { useStageProgression } from './orchestration/useStageProgression';
import { useCallRegistry } from './orchestration/useCallRegistry';

type Priority = 'critical' | 'important' | 'secondary' | 'background';

/**
 * Hook for orchestrating API calls with optimized timing
 */
export const useApiOrchestration = () => {
  const { stage } = useStageProgression();
  const { 
    registryState, 
    registerCall, 
    isCallEnabled, 
    getStageProgress 
  } = useCallRegistry();

  const isStageComplete = (targetStage: Priority) => getStageProgress(targetStage) >= 80;

  return {
    registerCall,
    isCallEnabled,
    stage,
    progress: registryState.progress,
    getStageProgress,
    isStageComplete
  };
};
