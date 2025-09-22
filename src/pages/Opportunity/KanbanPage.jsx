import React, { useState, useEffect } from 'react';
import KanbanView from '@/features/Opportunity/components/ui/KanbanView';
import { opportunitiesService } from '@/features/Opportunity/Services/opportunitiesService';
import OpportunityStatsCards from "../../features/Opportunity/components/ui/OpportunityStatsCards";

const KanbanPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    amount: 0,
    won: 0,
    open: 0,
    lost: 0,
    winTotal: 0,
    winPercentage: 0,
  });

  // Fetch opportunities using the existing service
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setIsLoading(true);
        console.log('KanbanPage: Fetching opportunities...');
        
        // Use the existing opportunities service to get data
        const result = await opportunitiesService.getFormattedOpportunities({
          quickStatus: 'All Opportunities'
        });
        
        console.log('KanbanPage: Raw API result:', result);
        
        if (result.opportunitiesData && Array.isArray(result.opportunitiesData)) {
          console.log('KanbanPage: Setting opportunities:', result.opportunitiesData.length);
          setOpportunities(result.opportunitiesData);
          
          // Update stats if available
          if (result.opportunityResult) {
            setStats({
              total: result.opportunityResult.TotIds || 0,
              amount: result.opportunityResult.TotOppAmt || 0,
              won: result.opportunityResult.Won || 0,
              open: result.opportunityResult.Open || 0,
              lost: result.opportunityResult.Lost || 0,
              winTotal: result.opportunityResult.WinTotal || 0,
              winPercentage: result.opportunityResult.WinRatio || 0,
            });
          }
        } else {
          console.warn('KanbanPage: No opportunities data found in result');
          setOpportunities([]);
        }
      } catch (error) {
        console.error('KanbanPage: Error fetching opportunities:', error);
        setOpportunities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handleRefresh = async () => {
    console.log('KanbanPage: Refreshing opportunities...');
    setIsLoading(true);
    
    try {
      const result = await opportunitiesService.getFormattedOpportunities({
        quickStatus: 'All Opportunities'
      });
      
      if (result.opportunitiesData && Array.isArray(result.opportunitiesData)) {
        setOpportunities(result.opportunitiesData);
        
        // Update stats if available
        if (result.opportunityResult) {
          setStats({
            total: result.opportunityResult.TotIds || 0,
            amount: result.opportunityResult.TotOppAmt || 0,
            won: result.opportunityResult.Won || 0,
            open: result.opportunityResult.Open || 0,
            lost: result.opportunityResult.Lost || 0,
            winTotal: result.opportunityResult.WinTotal || 0,
            winPercentage: result.opportunityResult.WinRatio || 0,
          });
        }
      }
    } catch (error) {
      console.error('KanbanPage: Error refreshing opportunities:', error);
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

  return (
    <div className="flex-1 flex flex-col bg-white w-full overflow-hidden">
      <div className="w-full px-2 py-1 flex-1 mx-0">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-[#1a4d80]">Opportunities - Kanban View</h1>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        <OpportunityStatsCards stats={stats} />
        
        <div className="h-full">
          <KanbanView
            opportunities={opportunities}
            view="kanban"
            onViewChange={() => {}}
            filters={{}}
            onFilterChange={() => {}}
            users={[]}
            onRefresh={handleRefresh}
            totalCount={opportunities.length}
            currentPage={1}
            onNextPage={() => {}}
            onPreviousPage={() => {}}
            savedSearches={{
              allOpportunities: [],
              myOpportunities: [],
            }}
            onAddOpportunity={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default KanbanPage;