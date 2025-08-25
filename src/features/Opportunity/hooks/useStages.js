import { useState, useEffect } from 'react';
import { userService } from '../Services/userService';

/**
 * Custom hook to fetch stages from API
 * Used across the Opportunity module for consistent stage data
 */
export const useStages = () => {
  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const stagesData = await userService.getStages();
        console.log('Stages data received in useStages:', stagesData);
        
        // Ensure we have a valid array with proper structure
        if (Array.isArray(stagesData) && stagesData.length > 0) {
          // Validate that each stage has the required properties
          const validStages = stagesData.filter(stage => 
            stage && typeof stage === 'object' && stage.value && stage.label
          ).map(stage => ({
            id: stage.ID || stage.value,
            name: stage.Stage || stage.label,
            value: stage.value,
            label: stage.label,
            colorCode: stage.colorCode || null
          }));
          
          setStages(validStages);
        } else {
          console.warn('Invalid stages data format:', stagesData);
          setStages([]);
        }
      } catch (err) {
        console.error('Failed to fetch stages:', err);
        setError(err.message);
        setStages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStages();
  }, []);

  return { stages, isLoading, error };
};

export default useStages; 