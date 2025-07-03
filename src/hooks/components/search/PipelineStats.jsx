
import React from "react";
import { Card, CardContent } from "@OpportunityComponents/ui/card";

const PipelineStats = ({ pipelineStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="!rounded-none border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="text-sm text-gray-500">Total Opportunities</div>
          <div className="text-2xl font-bold">{pipelineStats.totalOpportunities}</div>
        </CardContent>
      </Card>
      <Card className="!rounded-none border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="text-sm text-gray-500">Open Opportunities</div>
          <div className="text-2xl font-bold text-blue-600">{pipelineStats.openOpportunities}</div>
        </CardContent>
      </Card>
      <Card className="!rounded-none border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="text-sm text-gray-500">Closed Won</div>
          <div className="text-2xl font-bold text-green-600">{pipelineStats.closedWon}</div>
        </CardContent>
      </Card>
      <Card className="!rounded-none border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="text-sm text-gray-500">Total Value</div>
          <div className="text-2xl font-bold">${pipelineStats.totalValue.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineStats;
