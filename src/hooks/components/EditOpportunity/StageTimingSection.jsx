
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@OpportunityComponents/ui/card";
import { Clock, TrendingUp, Calendar } from "lucide-react";

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

const StageTimingSection = ({ opportunityId }) => {
  // Mock stage timing data - in a real app, this would be calculated from stage change history
  const stageTimings = [
    { stage: "Lead", timeInStage: "3 days", percentage: 8, isCurrentStage: false },
    { stage: "Qualified", timeInStage: "5 days", percentage: 13, isCurrentStage: false },
    { stage: "1st Demo", timeInStage: "7 days", percentage: 18, isCurrentStage: false },
    { stage: "Discovery", timeInStage: "12 days", percentage: 32, isCurrentStage: true },
    { stage: "Technical Review", timeInStage: "0 days", percentage: 0, isCurrentStage: false },
    { stage: "Proposal", timeInStage: "0 days", percentage: 0, isCurrentStage: false },
    { stage: "Negotiation", timeInStage: "0 days", percentage: 0, isCurrentStage: false },
    { stage: "Closed Won", timeInStage: "0 days", percentage: 0, isCurrentStage: false }
  ];

  const totalDaysInProcess = 27;
  const currentStage = stageTimings.find(s => s.isCurrentStage);
  const averageStageTime = Math.round(totalDaysInProcess / stageTimings.filter(s => s.percentage > 0).length);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Time in Stage Analytics</h3>
        <div className="text-sm text-gray-500">
          Total process time: {totalDaysInProcess} days
        </div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Current Stage</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-900">{currentStage?.stage}</div>
            <p className="text-xs text-blue-700 mt-1">
              {currentStage?.timeInStage} in this stage
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
              Across completed stages
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Longest Stage</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-900">Discovery</div>
            <p className="text-xs text-purple-700 mt-1">
              12 days (32% of total time)
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

      {/* Insights section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stage Timing Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium">Discovery Stage Duration</span>
            <span className="text-sm text-blue-600 font-semibold">
              Above average (12 vs {averageStageTime} days avg)
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium">Process Velocity</span>
            <span className="text-sm text-green-600 font-semibold">
              {Math.round((4 / totalDaysInProcess) * 100)}% stages completed per week
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="text-sm font-medium">Projected Close Date</span>
            <span className="text-sm text-orange-600 font-semibold">
              +{Math.round(averageStageTime * 4)} days if current pace continues
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StageTimingSection;
