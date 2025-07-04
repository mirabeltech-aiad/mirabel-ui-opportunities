
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, TrendingUp, Filter } from 'lucide-react';

const ErrorState = ({ error, onRefresh }) => {
  return (
    <div className="space-y-6">
      {/* Header matching Sales Performance design */}
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
      
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <div className="text-red-600 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto mb-2" />
            <span className="text-lg font-semibold">Unable to Load Dashboard Data</span>
          </div>
          <p className="text-red-700 mb-4">
            There was an error connecting to the reports API. Please check your connection and try again.
          </p>
          <p className="text-sm text-red-600 mb-4">
            Error: {error}
          </p>
          <Button onClick={onRefresh} className="bg-red-600 hover:bg-red-700 text-white">
            <RefreshCw className="h-3 w-3 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorState;
