
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { CohortPrediction } from './types';

interface CohortChurnPredictionProps {
  data: CohortPrediction[];
}

const CohortChurnPrediction: React.FC<CohortChurnPredictionProps> = ({ data }) => {
  // Ensure data is an array and provide fallback
  const validData = Array.isArray(data) ? data : [];

  const getConfidenceColor = (score?: number) => {
    if (!score) return 'text-gray-600 bg-gray-100';
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-ocean-800">Cohort Churn Predictions</CardTitle>
          <CardDescription>AI-powered retention forecasts and intervention recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {validData.length > 0 ? validData.map((prediction, index) => (
              <div key={prediction.cohort} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{prediction.cohort} Cohort</h3>
                  <Badge className={getConfidenceColor(prediction.confidenceScore)}>
                    {prediction.confidenceScore?.toFixed(1) || '0.0'}% Confidence
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600 mb-1">Current</div>
                    <div className="text-xl font-bold text-blue-600">
                      {prediction.currentRetention?.toFixed(1) || '0.0'}%
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600 mb-1">12-Month Forecast</div>
                    <div className="text-xl font-bold text-orange-600">
                      {prediction.predictedMonth12?.toFixed(1) || '0.0'}%
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600 mb-1">24-Month Forecast</div>
                    <div className="text-xl font-bold text-red-600">
                      {prediction.predictedMonth24?.toFixed(1) || '0.0'}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="flex items-center gap-2 font-medium mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      Risk Factors
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {(prediction.riskFactors || []).map((factor, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 font-medium mb-2">
                      <Target className="h-4 w-4 text-green-600" />
                      Recommendations
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {(prediction.recommendations || []).map((rec, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                No prediction data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CohortChurnPrediction;
