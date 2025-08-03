

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useChurnPredictions } from '@/hooks/useAnalyticsData';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Clock, TrendingDown } from 'lucide-react';
import { HelpTooltip } from '@/components';

const ChurnPredictionModel = () => {
  const { data: churnPredictions, isLoading, error } = useChurnPredictions();

  if (isLoading) return <div>Loading churn predictions...</div>;
  if (error) return <div>Error loading churn predictions</div>;
  if (!churnPredictions) return null;

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <TrendingDown className="h-4 w-4 text-orange-600" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-green-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-ocean-800">Churn Prediction Model</h2>
        <HelpTooltip helpId="churn-prediction" />
      </div>
      
      {/* High-risk Alert */}
      {churnPredictions.some(p => p.riskLevel === 'critical') && (
        <Alert className="border-red-300 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {churnPredictions.filter(p => p.riskLevel === 'critical').length} subscribers at critical churn risk require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Prediction Cards */}
      <div className="space-y-4">
        {churnPredictions.map((prediction) => (
          <Card key={prediction.subscriberId} className={`border-2 ${getRiskColor(prediction.riskLevel).split(' ')[2]}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getRiskIcon(prediction.riskLevel)}
                  <CardTitle className="text-lg">{prediction.subscriberId}</CardTitle>
                  <Badge className={getRiskColor(prediction.riskLevel)}>
                    {prediction.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">
                    {(prediction.churnProbability * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Churn Probability</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Time to Churn</div>
                  <div className="text-gray-600">{prediction.timeToChurn} days</div>
                </div>
                <div>
                  <div className="font-medium">Confidence Score</div>
                  <div className="text-gray-600">{(prediction.confidenceScore * 100).toFixed(1)}%</div>
                </div>
              </div>

              <div>
                <div className="font-medium text-sm mb-2">Key Risk Factors</div>
                <div className="space-y-2">
                  {prediction.keyFactors.map((factor, index) => (
                    <div key={index} className="flex items-start justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{factor.factor}</div>
                        <div className="text-xs text-gray-600">{factor.description}</div>
                      </div>
                      <div className="text-sm font-medium">
                        {(factor.impact * 100).toFixed(0)}% impact
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-medium text-sm mb-2">Recommended Actions</div>
                <div className="space-y-1">
                  {prediction.recommendedActions.map((action, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="text-sm text-gray-700 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{action}</span>
                      </div>
                      <Button size="sm" variant="outline" className="ml-2">
                        Take Action
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChurnPredictionModel;
