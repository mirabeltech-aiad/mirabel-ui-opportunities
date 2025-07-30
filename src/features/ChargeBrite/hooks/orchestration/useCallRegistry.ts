/**
 * @fileoverview Call Registry Hook
 * 
 * Manages API call registration, dependencies, and enablement
 */

import { useState, useCallback } from 'react';

type Priority = 'critical' | 'important' | 'secondary' | 'background';

interface CallRegistryState {
  enabledCalls: Set<string>;
  progress: number;
}

interface UseCallRegistryReturn {
  registryState: CallRegistryState;
  registerCall: (id: string, priority: Priority, dependencies?: string[]) => void;
  isCallEnabled: (id: string) => boolean;
  getStageProgress: (stage: Priority) => number;
  updateProgress: () => void;
}

/**
 * Hook for managing API call registry and dependencies
 */
export const useCallRegistry = (): UseCallRegistryReturn => {
  const [registryState, setRegistryState] = useState<CallRegistryState>({
    enabledCalls: new Set(),
    progress: 0
  });

  const registerCall = useCallback((id: string, priority: Priority, dependencies: string[] = []) => {
    // Optimized delays for better UX
    const delays = {
      critical: 0,     // Immediate - core metrics
      important: 50,   // Very quick - key charts
      secondary: 150,  // Short delay - supporting data
      background: 400  // Longer delay - nice-to-have data
    };

    // Check if dependencies are satisfied
    const dependenciesSatisfied = dependencies.length === 0 || 
      dependencies.every(dep => registryState.enabledCalls.has(dep));

    const baseDelay = delays[priority];
    const actualDelay = dependenciesSatisfied ? baseDelay : baseDelay + 100;

    setTimeout(() => {
      setRegistryState(prev => ({
        ...prev,
        enabledCalls: new Set([...prev.enabledCalls, id]),
        progress: Math.min(100, ((prev.enabledCalls.size + 1) / 10) * 100)
      }));
    }, actualDelay);
  }, [registryState.enabledCalls]);

  const isCallEnabled = useCallback((id: string) => {
    return registryState.enabledCalls.has(id);
  }, [registryState.enabledCalls]);

  const getStageProgress = useCallback((stage: Priority) => {
    const stageCallCounts = {
      critical: 2,
      important: 4,
      secondary: 2,
      background: 2
    };
    
    const enabledInStage = Array.from(registryState.enabledCalls).filter(id => {
      // Simple heuristic to determine stage from call id
      if (id.includes('metrics') || id.includes('overview')) return stage === 'critical';
      if (id.includes('growth') || id.includes('lifecycle')) return stage === 'important';
      if (id.includes('churn') || id.includes('segment')) return stage === 'secondary';
      return stage === 'background';
    }).length;

    return Math.min(100, (enabledInStage / stageCallCounts[stage]) * 100);
  }, [registryState.enabledCalls]);

  const updateProgress = useCallback(() => {
    setRegistryState(prev => ({
      ...prev,
      progress: Math.min(100, (prev.enabledCalls.size / 10) * 100)
    }));
  }, []);

  return {
    registryState,
    registerCall,
    isCallEnabled,
    getStageProgress,
    updateProgress
  };
};