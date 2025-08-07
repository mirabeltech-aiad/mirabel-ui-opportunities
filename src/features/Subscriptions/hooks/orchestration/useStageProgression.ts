/**
 * @fileoverview Stage Progression Hook
 * 
 * Manages API orchestration stage timing and progression
 */

import { useState, useEffect } from 'react';

type Stage = 'initial' | 'critical' | 'important' | 'secondary' | 'background' | 'complete';

interface UseStageProgressionReturn {
  stage: Stage;
  updateStage: (newStage: Stage) => void;
}

/**
 * Hook for managing stage progression with optimized timing
 */
export const useStageProgression = (): UseStageProgressionReturn => {
  const [stage, setStage] = useState<Stage>('initial');

  const updateStage = (newStage: Stage) => {
    setStage(newStage);
  };

  useEffect(() => {
    // Stage progression with optimized timing
    const stages = [
      { name: 'critical' as const, delay: 0 },
      { name: 'important' as const, delay: 100 }, 
      { name: 'secondary' as const, delay: 200 },
      { name: 'background' as const, delay: 500 },
      { name: 'complete' as const, delay: 800 }
    ];

    stages.forEach(({ name, delay }) => {
      setTimeout(() => {
        setStage(name);
      }, delay);
    });
  }, []);

  return {
    stage,
    updateStage
  };
};