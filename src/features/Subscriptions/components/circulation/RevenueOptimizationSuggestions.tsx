

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useOptimizationSuggestions } from '@/hooks/usePricingData';
import { HelpTooltip } from '@/components';

const RevenueOptimizationSuggestions = () => {
  const { data, isLoading } = useOptimizationSuggestions();

  if (isLoading || !data) {
    return <div>Loading optimization suggestions...</div>;
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'blue';
      default:
        return 'blue';
    }
  };

  const getImpactIcon = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'medium':
        return <Target className="h-5 w-5 text-orange-600" />;
      case 'high':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  // Calculate high priority count from suggestions
  const highPriorityCount = data.suggestions.filter(s => s.priority?.toLowerCase() === 'high').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Total Potential Impact</CardTitle>
              <HelpTooltip helpId="optimization-total-potential-impact" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${data.revenueOpportunity.total.toLocaleString()}</div>
            <p className="text-xs text-green-500">Annual revenue increase</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">High Priority Actions</CardTitle>
              <HelpTooltip helpId="optimization-high-priority-actions" />
            </div>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
            <p className="text-xs text-red-500">Immediate attention required</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Implementation Score</CardTitle>
              <HelpTooltip helpId="optimization-implementation-score" />
            </div>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.implementationScore}%</div>
            <p className="text-xs text-blue-500">Feasibility rating</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Strategic Recommendations</CardTitle>
            <HelpTooltip helpId="optimization-strategic-recommendations" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.suggestions.map((suggestion) => (
              <div key={suggestion.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getImpactIcon(suggestion.riskLevel)}
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                    <Badge variant={getPriorityBadgeVariant(suggestion.priority)}>
                      {suggestion.priority} Priority
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-600 font-medium">
                      Expected Impact: +${suggestion.revenueImpact.toLocaleString()}
                    </span>
                    <span className="text-gray-600">
                      Risk: {suggestion.riskLevel}
                    </span>
                    <span className="text-gray-600">
                      Timeline: {suggestion.implementationTime}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button size="sm" variant="outline" className="transition-colors duration-200">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Implement
                  </Button>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Implementation Roadmap</CardTitle>
            <HelpTooltip helpId="optimization-implementation-roadmap" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.roadmap.map((item) => (
              <div key={item.phase} className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <span className="text-sm font-medium text-green-600">+${item.revenueImpact.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Duration: {item.timeline}</span>
                  <Button size="sm" className="bg-ocean-500 text-white hover:bg-ocean-600">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueOptimizationSuggestions;
