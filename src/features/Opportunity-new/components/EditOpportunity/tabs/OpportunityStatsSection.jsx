
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { 
  Phone, 
  Mail, 
  Clock, 
  FileText, 
  Calendar, 
  Users,
  TrendingUp
} from "lucide-react";
import reportsService from "@/features/Opportunity/Services/reports/reportsService";

const StatCard = ({ title, value, icon: Icon, description, color = "text-blue-600" }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

const StageTimingCard = ({ stageName, timeInStage, isCurrentStage, percentage }) => {
  return (
    <Card className={`hover:shadow-md transition-shadow ${isCurrentStage ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {stageName}
          {isCurrentStage && <span className="ml-2 text-xs text-blue-600 font-bold">(Current)</span>}
        </CardTitle>
        <Clock className={`h-4 w-4 ${isCurrentStage ? 'text-blue-600' : 'text-gray-400'}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{timeInStage}</div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">
            {percentage}% of total time
          </p>
          {isCurrentStage && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const OpportunityStatsSection = ({ opportunityId }) => {
  // State management for API data
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stats data from API using reports service
  useEffect(() => {
    const fetchOpportunityStats = async () => {
      if (!opportunityId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Check if reportsService is available
        if (!reportsService || typeof reportsService.getOpportunityStats !== 'function') {
          throw new Error('Reports service is not available');
        }
        
        const data = await reportsService.getOpportunityStats(opportunityId);
        setStatsData(data);
      } catch (err) {
        console.error('Error fetching opportunity stats:', err);
        setError(err);
        // Set empty data to prevent further errors
        setStatsData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunityStats();
  }, [opportunityId]);

  // Calculate days until close
  const calculateDaysUntilClose = (projectedCloseDate) => {
    if (!projectedCloseDate) return { value: "N/A", description: "No projected close date" };
    
    const closeDate = new Date(projectedCloseDate);
    const today = new Date();
    const diffTime = closeDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return {
        value: "Date Passed",
        description: `Overdue by ${Math.abs(diffDays)} days`
      };
    } else if (diffDays === 0) {
      return {
        value: "Today",
        description: "Due today"
      };
    } else {
      return {
        value: diffDays,
        description: "Days remaining until projected close date"
      };
    }
  };

  // Process API data
  const processStatsData = () => {
    // Safety check for statsData structure
    if (!statsData || typeof statsData !== 'object' || !statsData.Data) {
      return {
        generalStats: {
          totalCalls: 0,
          totalEmails: 0,
          averageContactTimeframe: "0 days",
          totalProposals: 0,
          daysUntilClose: { value: "N/A", description: "No data available" },
          totalContacts: 0
        },
        stageTimings: [],
        currentStage: "N/A",
        averageStageTime: 0,
        longestStage: "N/A"
      };
    }

    // Extract general stats from Table
    const generalStatsData = statsData.Data.Table?.[0] || {};
    
    // Extract projected close date from Table2
    const projectedCloseDateData = statsData.Data.Table2?.[0];
    const daysUntilCloseInfo = calculateDaysUntilClose(projectedCloseDateData?.ProjectedCloseDate);
    
    const generalStats = {
      totalCalls: generalStatsData.TotalCalls || 0,
      totalEmails: generalStatsData.TotalEmails || 0,
      averageContactTimeframe: "NA", // Keep original calculation
      totalProposals: 3, // Keep original value
      daysUntilClose: daysUntilCloseInfo,
      totalContacts: 'NA' // Keep original value
    };

    // Extract stage timings from Table1
    const stageData = statsData.Data.Table1 || [];
    
    // Last stage in the array is the current stage
    const currentStageData = stageData[0];
    const currentStage = currentStageData?.Stage?.trim() || "N/A";
    
    // Calculate total days and average stage time
    const totalDays = stageData.reduce((sum, stage) => sum + (stage.DaysInStage || 0), 0);
    const averageStageTime = stageData.length > 0 ? Math.round(totalDays / stageData.length) : 0;
    
    // Find longest stage
    const longestStageData = stageData.reduce((max, stage) => 
      (stage.DaysInStage || 0) > (max.DaysInStage || 0) ? stage : max, 
      { DaysInStage: 0, Stage: "N/A" }
    );
    const longestStage = longestStageData.Stage?.trim() || "N/A";

    // Process stage timings for display
    const stageTimings = stageData.map((stage, index) => {
      const isCurrentStage = index === 0; // Last stage is current
      const daysInStage = stage.DaysInStage || 0;
      const percentage = totalDays > 0 ? Math.round((daysInStage / totalDays) * 100) : 0;

      return {
        stage: stage.Stage?.trim() || "Unknown",
        timeInStage: `${daysInStage} days`,
        percentage,
        isCurrentStage
      };
    });

    return { 
      generalStats, 
      stageTimings, 
      totalDays,
      currentStage,
      averageStageTime,
      longestStage
    };
  };

  if (isLoading || !statsData) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8 text-red-500">
          <p>Error loading statistics: {error.message || 'Unknown error occurred'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Safely process stats data with error handling
  let processedData;
  try {
    processedData = processStatsData();
  } catch (processError) {
    console.error('Error processing stats data:', processError);
    return (
      <div className="space-y-8">
        <div className="text-center py-8 text-red-500">
          <p>Error processing statistics data</p>
        </div>
      </div>
    );
  }

  const { generalStats, stageTimings, totalDays, currentStage, averageStageTime, longestStage } = processedData;
  const currentStageInfo = stageTimings.find(s => s.isCurrentStage);

  return (
    <div className="space-y-8">
      {/* General Statistics Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">General Statistics</h3>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Number of Calls"
            value={generalStats.totalCalls}
            icon={Phone}
            description="Total calls made to this opportunity"
            color="text-orange-600"
          />
          
          <StatCard
            title="Number of Emails"
            value={generalStats.totalEmails}
            icon={Mail}
            description="Total emails sent for this opportunity"
            color="text-blue-600"
          />
          
          <StatCard
            title="Average Contact Timeframe"
            value={generalStats.averageContactTimeframe}
            icon={Clock}
            description="Average time between contacts"
            color="text-purple-600"
          />
          
          <StatCard
            title="Number of Proposals"
            value={generalStats.totalProposals}
            icon={FileText}
            description="Proposals sent to this opportunity"
            color="text-green-600"
          />
          
          <StatCard
            title="Days Until Close"
            value={generalStats.daysUntilClose.value}
            icon={Calendar}
            description={generalStats.daysUntilClose.description}
            color="text-red-600"
          />
          
          <StatCard
            title="Total Contacts"
            value={generalStats.totalContacts}
            icon={Users}
            description="Number of people contacted"
            color="text-indigo-600"
          />
        </div>

        {/* General insights section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">General Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">Communication Activity</span>
              <span className="text-sm text-blue-600 font-semibold">
                {generalStats.totalCalls + generalStats.totalEmails} total touchpoints
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Proposal to Contact Ratio</span>
              <span className="text-sm text-green-600 font-semibold">
                {(generalStats.totalProposals / generalStats.totalContacts).toFixed(1)} proposals per contact
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium">Contact Frequency</span>
              <span className="text-sm text-orange-600 font-semibold">
                Every {generalStats.averageContactTimeframe} on average
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time in Stage Analytics Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Time in Stage Analytics</h3>
          <div className="text-sm text-gray-500">
            Total process time: {totalDays} days
          </div>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Current Stage</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-blue-900">{currentStage}</div>
              <p className="text-xs text-blue-700 mt-1">
                {currentStageInfo?.timeInStage || "0 days"} in this stage
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Average Stage Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-900">{averageStageTime} days</div>
              <p className="text-xs text-green-700 mt-1">
                Across all stages
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Longest Stage</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-purple-900">{longestStage}</div>
              <p className="text-xs text-purple-700 mt-1">
                Stage with most time spent
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stage timing breakdown */}
        <div>
          <h4 className="text-base font-semibold mb-4">Stage-by-Stage Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stageTimings.map((timing, index) => (
              <StageTimingCard
                key={index}
                stageName={timing.stage}
                timeInStage={timing.timeInStage}
                isCurrentStage={timing.isCurrentStage}
                percentage={timing.percentage}
              />
            ))}
          </div>
        </div>

        {/* Stage timing insights section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stage Timing Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentStageInfo && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">{currentStage} Stage Duration</span>
                <span className="text-sm text-blue-600 font-semibold">
                  Current stage (active)
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Process Velocity</span>
              <span className="text-sm text-green-600 font-semibold">
                {totalDays > 0 ? Math.round((stageTimings.length / totalDays) * 100) : 0}% stages completed per week
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium">Projected Close Date</span>
              <span className="text-sm text-orange-600 font-semibold">
                +{Math.round(averageStageTime * (8 - stageTimings.length))} days if current pace continues
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OpportunityStatsSection;
