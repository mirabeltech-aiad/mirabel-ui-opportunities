
import { useState, useEffect } from 'react';
import apiService from '@/features/Opportunity/Services/apiService';

export const useSavedViews = (refreshKey = 0, pageType = "opportunities") => {
  const [savedViews, setSavedViews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedViews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`useSavedViews: Fetching saved views for ${pageType}...`);
        
        let response;
        if (pageType === "proposals") {
          response = await apiService.getProposalViews();
        } else {
          response = await apiService.getSavedViews();
        }
        
        console.log(`useSavedViews: Raw API response for ${pageType}:`, response);
        
        if (response?.content?.Status === 'Success' && response?.content?.List) {
          console.log(`useSavedViews: Successfully parsed ${pageType} views:`, response.content.List);
          console.log(`useSavedViews: Number of ${pageType} views:`, response.content.List.length);
          setSavedViews(response.content.List);
        } else {
          console.warn(`useSavedViews: Invalid response format or no ${pageType} views found:`, response);
          setSavedViews([]);
        }
      } catch (err) {
        console.error(`useSavedViews: Failed to fetch ${pageType} views:`, err);
        setError(err.message);
        setSavedViews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedViews();
  }, [refreshKey, pageType]);

  console.log(`useSavedViews: Current state for ${pageType} - savedViews:`, savedViews, 'isLoading:', isLoading, 'error:', error);

  return { savedViews, isLoading, error };
};
