
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Target } from 'lucide-react';
import { CohortRiskData } from './types';

interface CohortRiskAnalysisProps {
  data: CohortRiskData[];
}

const CohortRiskAnalysis: React.FC<CohortRiskAnalysisProps> = ({ data }) => {
  // Ensure data is an array and provide fallback
  const validData = Array.isArray(data) ? data : [];
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskIcon = (level: string) => {
    return level === 'Critical' || level === 'High' ? (
      <AlertTriangle className="h-4 w-4" />
    ) : null;
  };

  return (
    <Card className="bg-white hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-ocean-800">Cohort Risk Analysis</CardTitle>
        <CardDescription>High-risk cohorts requiring immediate attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {validData.length > 0 ? validData.map((risk, index) => (
            <div key={risk.cohort} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  {getRiskIcon(risk.riskLevel)}
                  {risk.cohort} Cohort
                </h3>
                <Badge className={getRiskColor(risk.riskLevel)}>
                  {risk.riskLevel} Risk
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Churn Probability:</span>
                  <span className="font-semibold text-red-600">
                    {risk.churnProbability.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Est. Days to Churn:</span>
                  <span className="font-semibold text-orange-600">
                    {risk.daysToChurn}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2 text-gray-700">Key Indicators</h4>
                  <ul className="space-y-1">
                    {risk.keyIndicators.map((indicator, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <Target className="h-3 w-3" />
                    Intervention Suggestions
                  </h4>
                  <ul className="space-y-1">
                    {risk.interventionSuggestions.map((suggestion, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              No risk analysis data available
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-red-50 rounded-lg">
          <h4 className="font-semibold mb-2 text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Immediate Action Required
          </h4>
          <p className="text-sm text-red-700">
            {validData.filter(d => d.riskLevel === 'Critical').length} cohort(s) at critical risk with 
            average {Math.round(validData.filter(d => d.riskLevel === 'Critical').reduce((sum, d) => sum + d.daysToChurn, 0) / validData.filter(d => d.riskLevel === 'Critical').length || 0)} days to churn.
            Immediate intervention recommended.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CohortRiskAnalysis;
