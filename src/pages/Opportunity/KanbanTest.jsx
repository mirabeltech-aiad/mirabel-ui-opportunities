import React, { useState, useEffect } from 'react';
import { KanbanView } from '@/features/opportunity-new/components/kanban';
import { useApiData } from '@/features/Opportunity/hooks/useApiData';
import { opportunitiesService } from '@/features/Opportunity/Services/opportunitiesService';

const KanbanTest = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch opportunities using the existing service
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setIsLoading(true);
        console.log('KanbanTest: Fetching opportunities...');
        
        // Use the existing opportunities service to get data
        const result = await opportunitiesService.getFormattedOpportunities({
          quickStatus: 'All Opportunities'
        });
        
        console.log('KanbanTest: Raw API result:', result);
        
        if (result.opportunitiesData && Array.isArray(result.opportunitiesData)) {
          console.log('KanbanTest: Setting opportunities:', result.opportunitiesData.length);
          setOpportunities(result.opportunitiesData);
        } else {
          console.warn('KanbanTest: No opportunities data found in result');
          setOpportunities([]);
        }
      } catch (error) {
        console.error('KanbanTest: Error fetching opportunities:', error);
        setOpportunities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handleRefresh = async () => {
    console.log('KanbanTest: Refreshing opportunities...');
    setIsLoading(true);
    
    try {
      const result = await opportunitiesService.getFormattedOpportunities({
        quickStatus: 'All Opportunities'
      });
      
      if (result.opportunitiesData && Array.isArray(result.opportunitiesData)) {
        setOpportunities(result.opportunitiesData);
      }
    } catch (error) {
      console.error('KanbanTest: Error refreshing opportunities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  // Mock data for testing if no real data is available
  const mockOpportunities = [
    {
      id: '1',
      opportunityName: 'Website Redesign Project',
      companyName: 'Tech Corp Inc',
      amount: 50000,
      status: 'Open',
      stage: 'Qualification',
      assignedRep: 'John Smith',
      projCloseDate: '2024-03-15',
    },
    {
      id: '2',
      opportunityName: 'Mobile App Development',
      companyName: 'StartUp LLC',
      amount: 75000,
      status: 'Open',
      stage: 'Proposal',
      assignedRep: 'Jane Doe',
      projCloseDate: '2024-04-20',
    },
  ];

  const displayOpportunities = opportunities.length > 0 ? opportunities : mockOpportunities;

  return (
    <div className="h-screen p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          New Kanban Implementation Test
        </h1>
        <p className="text-gray-600">
          Testing the new Kanban implementation with {opportunities.length > 0 ? 'real API' : 'mock'} data.
          Found {displayOpportunities.length} opportunities.
        </p>
        <button 
          onClick={handleRefresh}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh Data
        </button>
      </div>
      
      <div className="h-full">
        <KanbanView
          opportunities={displayOpportunities}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
};

export default KanbanTest;