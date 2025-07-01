
import React from 'react';
import { Brain, Zap } from 'lucide-react';
import { useDesignSystem } from '@/hooks/useDesignSystem';

const PredictiveAnalyticsHeader = () => {
  const { getTitleClass } = useDesignSystem();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className={`text-2xl font-bold ${getTitleClass()} flex items-center gap-2`}>
          <Brain className="h-6 w-6 text-blue-600" />
          Predictive Analytics
        </h2>
        <p className="text-muted-foreground flex items-center gap-2 mt-1">
          <Zap className="h-4 w-4 text-yellow-500" />
          AI-powered insights and forecasting based on historical data
        </p>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsHeader;
