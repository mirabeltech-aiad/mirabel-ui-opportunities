import { useStagesDropdown } from '@/hooks/useSearchableDropdown';

/**
 * Updated useStages hook that uses the new unified API system
 * This replaces the old useStages.js with consistent response handling
 */
export const useStages = () => {
  const {
    options: stages,
    loading: isLoading,
    error,
    refreshOptions: refreshStages,
    hasOptions: hasStages
  } = useStagesDropdown();

  // Transform the data to match the expected format for Kanban components
  const formattedStages = stages.map(stage => ({
    id: stage.id,
    name: stage.name,
    value: stage.value,
    label: stage.label,
    colorCode: stage.colorCode,
    percentClosed: stage.percentClosed
  }));

  return {
    stages: formattedStages,
    isLoading,
    error: error ? error : null,
    refreshStages,
    hasStages
  };
};

export default useStages;