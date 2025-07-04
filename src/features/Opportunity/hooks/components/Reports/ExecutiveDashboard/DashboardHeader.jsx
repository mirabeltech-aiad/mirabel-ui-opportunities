
import React from 'react';
import { TrendingUp, Filter } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-ocean-800 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          Executive Dashboard
        </h2>
        <p className="text-muted-foreground flex items-center gap-2 mt-1">
          <Filter className="h-4 w-4 text-gray-500" />
          Real-time insights and performance metrics
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
