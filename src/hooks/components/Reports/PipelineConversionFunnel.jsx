
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@OpportunityComponents/ui/card';
import { Badge } from '@OpportunityComponents/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@OpportunityComponents/ui/table';
import { TrendingDown, Users, ArrowDown, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react';
import { useDesignSystem } from '@/hooks/useDesignSystem';
import { toast } from '@/hooks/use-toast';
import PipelineConversionFunnelFilterBar from './PipelineConversionFunnelFilterBar';

// New API hook
import { useConversionFunnelData } from './PipelineConversionFunnel/hooks/useConversionFunnelData';

const PipelineConversionFunnel = ({ opportunities = [] }) => {
  const { getTitleClass, chartColors } = useDesignSystem();
  
  // Filter state
  const [timeRange, setTimeRange] = useState('last-12-months');
  const [salesRep, setSalesRep] = useState('all');
  const [product, setProduct] = useState('all');
  const [businessUnit, setBusinessUnit] = useState('all');

  // Use the new API hook for all conversion funnel data
  const {
    funnelData,
    conversionRates,
    bottleneckAnalysis,
    overallMetrics,
    isLoading,
    error
  } = useConversionFunnelData(timeRange, salesRep, product, businessUnit);

  const handleExport = () => {
    toast({
      title: "Export Complete",
      description: "Pipeline conversion funnel data has been exported successfully."
    });
  };

  const handleRefresh = () => {
    toast({
      title: "Data Refreshed",
      description: "Pipeline conversion funnel data has been refreshed successfully."
    });
  };

  // Show error state
  if (error) {
    return (
      <div className="space-y-6 max-w-full overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${getTitleClass()} flex items-center gap-2`}>
              <TrendingDown className="h-6 w-6 text-blue-600" />
              Pipeline Conversion Funnel
            </h2>
            <p className="text-muted-foreground mt-1">Stage-to-stage conversion analysis and drop-off identification</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Data</h3>
            <p className="text-red-600 mb-4">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const maxCount = funnelData[0]?.count || 1;

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${getTitleClass()} flex items-center gap-2`}>
            <TrendingDown className="h-6 w-6 text-blue-600" />
            Pipeline Conversion Funnel
          </h2>
          <p className="text-muted-foreground mt-1">Stage-to-stage conversion analysis and drop-off identification</p>
        </div>
        <div className="text-right bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{overallMetrics.overallConversion}%</div>
          <div className="text-xs text-blue-700 font-medium">Overall Conversion</div>
        </div>
      </div>

      {/* Filter Bar */}
      <PipelineConversionFunnelFilterBar 
        timeRange={timeRange}
        salesRep={salesRep}
        product={product}
        businessUnit={businessUnit}
        onTimeRangeChange={setTimeRange}
        onSalesRepChange={setSalesRep}
        onProductChange={setProduct}
        onBusinessUnitChange={setBusinessUnit}
        onExport={handleExport}
        onRefresh={handleRefresh}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-8 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-blue-600">Loading conversion funnel data...</p>
          </div>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Funnel Visualization */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50 pb-3">
              <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
                <TrendingDown className="h-5 w-5 text-blue-600" />
                Conversion Funnel Visualization
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3 max-w-full">
                {funnelData.map((stage, index) => (
                  <div key={stage.stage} className="space-y-2">
                    {/* Stage Header */}
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: chartColors.primary[0] }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                          {stage.count} deals
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-gray-800">{stage.percentage}% of total</div>
                        {index > 0 && (
                          <div className="text-xs text-gray-600">
                            {stage.conversionRate}% conversion
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Funnel Bar - Shows progressive narrowing */}
                    <div className="relative w-full max-w-2xl">
                      <div 
                        className="h-6 rounded flex items-center justify-center transition-all duration-300 shadow-sm"
                        style={{ 
                          width: `${Math.max((stage.count / maxCount) * 100, 8)}%`,
                          maxWidth: '100%',
                          backgroundColor: index === 0 ? chartColors.primary[1] : 
                                         index === funnelData.length - 1 ? chartColors.primary[0] : chartColors.primary[2],
                        }}
                      >
                        <span className="text-white font-medium text-xs">
                          {stage.count}
                        </span>
                      </div>
                    </div>

                    {/* Drop-off Indicator */}
                    {index > 0 && stage.dropOff > 0 && (
                      <div className="flex items-center gap-2 text-xs text-red-600 pl-2 py-1 bg-red-50 rounded border-l-2 border-red-200">
                        <ArrowDown className="h-3 w-3" />
                        <span>
                          {stage.dropOff} deals lost ({stage.dropOffRate}% drop-off)
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-black">Best Converting Stage</CardTitle>
                <TrendingDown className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                {(() => {
                  const bestStage = funnelData.slice(1).reduce((best, stage) => 
                    stage.conversionRate > (best?.conversionRate || 0) ? stage : best, null
                  );
                  return bestStage ? (
                    <>
                      <div className="text-2xl font-bold text-green-600">{bestStage.conversionRate}%</div>
                      <p className="text-xs text-green-300">{bestStage.stage}</p>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">No data</div>
                  );
                })()}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-black">Biggest Drop-off</CardTitle>
                <AlertTriangle className="h-4 w-4 text-rose-600" />
              </CardHeader>
              <CardContent>
                {overallMetrics.biggestDropOff ? (
                  <>
                    <div className="text-2xl font-bold text-rose-600">{overallMetrics.biggestDropOff.dropOff}</div>
                    <p className="text-xs text-rose-300">
                      Before {overallMetrics.biggestDropOff.stage} ({overallMetrics.biggestDropOff.dropOffRate}%)
                    </p>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">No drop-offs</div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-black">Active Pipeline</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {overallMetrics.activeOpportunities}
                </div>
                <p className="text-xs text-purple-300">Open opportunities</p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Stage-by-Stage Analysis */}
          <Card className="shadow-lg">
            <CardHeader className="bg-white border-b">
              <CardTitle className={`${getTitleClass()} flex items-center gap-2 text-xl`}>
                <TrendingDown className="h-5 w-5 text-blue-600" />
                Stage-by-Stage Analysis
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Detailed breakdown of conversion performance at each funnel stage
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-gray-100">
                      <TableHead className="bg-white text-muted-foreground font-semibold py-4 px-6">
                        Stage
                      </TableHead>
                      <TableHead className="bg-white text-muted-foreground text-center font-semibold py-4 px-4">
                        Opportunities
                      </TableHead>
                      <TableHead className="bg-white text-muted-foreground text-center font-semibold py-4 px-4">
                        Pipeline %
                      </TableHead>
                      <TableHead className="bg-white text-muted-foreground text-center font-semibold py-4 px-4">
                        Conversion Rate
                      </TableHead>
                      <TableHead className="bg-white text-muted-foreground text-center font-semibold py-4 px-4">
                        Drop-off
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {funnelData.map((stage, index) => {
                      return (
                        <TableRow 
                          key={stage.stage} 
                          className={`
                            hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100
                            ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                          `}
                        >
                          <TableCell className="font-semibold py-4 px-6 text-gray-900">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: chartColors.primary[0] }}
                              />
                              <span className="text-base">{stage.stage}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-4 px-4">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-lg font-bold text-gray-900">{stage.count}</span>
                              <span className="text-xs text-gray-500">deals</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-4 px-4">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-lg font-bold text-blue-600">{stage.percentage}%</span>
                              <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${stage.percentage}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-4 px-4">
                            {index === 0 ? (
                              <span className="text-gray-400 text-sm">Entry Point</span>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <span className={`text-lg font-bold ${
                                  stage.conversionRate >= 70 ? 'text-green-600' : 
                                  stage.conversionRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {stage.conversionRate}%
                                </span>
                                <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                      stage.conversionRate >= 70 ? 'bg-green-500' : 
                                      stage.conversionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${Math.min(stage.conversionRate, 100)}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-center py-4 px-4">
                            {stage.dropOff > 0 ? (
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-lg font-bold text-red-600">-{stage.dropOff}</span>
                                <span className="text-xs text-red-500">({stage.dropOffRate}%)</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Recommendations with Bottleneck Analysis */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50">
              <CardTitle className={`${getTitleClass()} flex items-center gap-2`}>
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Optimization Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {overallMetrics.biggestDropOff && overallMetrics.biggestDropOff.dropOffRate > 30 && (
                  <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-900 text-base">High Drop-off Alert</h4>
                      <p className="text-sm text-red-700 mt-1">
                        {overallMetrics.biggestDropOff.dropOffRate}% of deals are being lost before {overallMetrics.biggestDropOff.stage}. 
                        Consider reviewing your process and training for the previous stage.
                      </p>
                    </div>
                  </div>
                )}
                
                {funnelData.some(stage => stage.conversionRate < 50 && stage.conversionRate > 0) && (
                  <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 text-base">Low Conversion Rates</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Some stages have conversion rates below 50%. Focus on improving qualification 
                        criteria and sales processes for these stages.
                      </p>
                    </div>
                  </div>
                )}

                {bottleneckAnalysis.length > 0 && bottleneckAnalysis[0].opportunitiesStuck > 0 && (
                  <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <AlertTriangle className="h-6 w-6 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-orange-900 text-base">Bottleneck Detected</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        {bottleneckAnalysis[0].opportunitiesStuck} opportunities are stuck in {bottleneckAnalysis[0].stage} stage 
                        for an average of {Math.round(bottleneckAnalysis[0].avgDaysStuck)} days. 
                        Consider accelerating these deals or adjusting stage criteria.
                      </p>
                    </div>
                  </div>
                )}

                {parseFloat(overallMetrics.overallConversion) > 15 && (
                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <Users className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-900 text-base">Healthy Funnel</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your overall conversion rate of {overallMetrics.overallConversion}% is strong. 
                        Focus on maintaining current processes while scaling lead generation.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PipelineConversionFunnel;
