
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@OpportunityComponents/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Download, Target, TrendingUp, Users, AlertTriangle, Calendar, Activity, Package, Building, Zap, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import exportService from '@/services/exportService';
import { useDesignSystem } from '@/hooks/useDesignSystem';
import MetricTooltip from './MetricTooltip';
import PipelineManagementFilterBar from './PipelineManagement/PipelineManagementFilterBar';
import { useOperationalAnalyticsData } from './PipelineManagement/hooks/useOperationalAnalyticsData';

const PipelineManagementReports = ({ opportunities = [] }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('last-6-months');
  const [salesRep, setSalesRep] = useState('all');
  const [product, setProduct] = useState('all');
  const [businessUnit, setBusinessUnit] = useState('all');
  
  const { getTitleClass, getInteractiveButtonClass, getTableHeaderClass, getTabContainerClass, metricCardColors, chartColors } = useDesignSystem();

  // Use operational analytics API data
  const { operationalData, isLoading, error } = useOperationalAnalyticsData(
    selectedPeriod,
    salesRep,
    product,
    businessUnit
  );

  // Calculate operational metrics from API data
  const operationalMetrics = {
    totalProducts: operationalData.productPerformance?.length || 0,
    totalBusinessUnits: operationalData.businessUnitPerformance?.length || 0,
    totalOpportunityTypes: operationalData.opportunityTypesAnalysis?.length || 0,
    totalLeadSources: operationalData.leadSourceAnalysis?.length || 0
  };

  const handleExport = () => {
    try {
      exportService.exportOperationalReports(operationalData);
      toast({
        title: "Export Complete",
        description: "Operational reports have been exported successfully."
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = () => {
    toast({
      title: "Data Refreshed",
      description: "Operational reports have been refreshed successfully."
    });
  };

  const chartConfig = {
    revenue: { label: "Revenue", color: chartColors.primary[0] },
    opportunities: { label: "Opportunities", color: chartColors.primary[1] },
    winRate: { label: "Win Rate", color: chartColors.primary[2] },
    avgDealSize: { label: "Avg Deal Size", color: chartColors.primary[3] }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading operational analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-2">Error loading operational data</p>
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${getTitleClass()} flex items-center gap-2`}>
            <DollarSign className="h-6 w-6 text-green-600" />
            Operational Analytics Reports
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Target className="h-4 w-4 text-gray-500" />
            Comprehensive insights across products, business units, and lead sources
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg border border-green-200">
          <Download className="h-4 w-4 text-green-600" />
          <Button onClick={handleExport} className={getInteractiveButtonClass()}>
            Export Reports
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <PipelineManagementFilterBar 
        timeRange={selectedPeriod}
        salesRep={salesRep}
        product={product}
        businessUnit={businessUnit}
        onTimeRangeChange={setSelectedPeriod}
        onSalesRepChange={setSalesRep}
        onProductChange={setProduct}
        onBusinessUnitChange={setBusinessUnit}
        onExport={handleExport}
        onRefresh={handleRefresh}
      />

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricTooltip
          title="Products Analyzed"
          description="Number of products with performance data in the selected period"
          calculation="Count of products with opportunity data"
          period="Based on selected filters"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Products Analyzed</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metricCardColors.activity}`}>
                {operationalMetrics.totalProducts}
              </div>
              <p className={`text-xs ${metricCardColors.activitySubtitle}`}>Active products</p>
            </CardContent>
          </Card>
        </MetricTooltip>

        <MetricTooltip
          title="Business Units"
          description="Number of business units with sales activity in the selected period"
          calculation="Count of business units with opportunities"
          period="Based on selected filters"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Business Units</CardTitle>
              <Building className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metricCardColors.service}`}>
                {operationalMetrics.totalBusinessUnits}
              </div>
              <p className={`text-xs ${metricCardColors.serviceSubtitle}`}>Active units</p>
            </CardContent>
          </Card>
        </MetricTooltip>

        <MetricTooltip
          title="Opportunity Types"
          description="Number of different opportunity types identified in the sales pipeline"
          calculation="Count of distinct opportunity types"
          period="Based on selected filters"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Opportunity Types</CardTitle>
              <Zap className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metricCardColors.time}`}>
                {operationalMetrics.totalOpportunityTypes}
              </div>
              <p className={`text-xs ${metricCardColors.timeSubtitle}`}>Distinct types</p>
            </CardContent>
          </Card>
        </MetricTooltip>

        <MetricTooltip
          title="Lead Sources"
          description="Number of different lead sources contributing to the sales pipeline"
          calculation="Count of distinct lead sources"
          period="Based on selected filters"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Lead Sources</CardTitle>
              <MapPin className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metricCardColors.connection}`}>
                {operationalMetrics.totalLeadSources}
              </div>
              <p className={`text-xs ${metricCardColors.connectionSubtitle}`}>Active sources</p>
            </CardContent>
          </Card>
        </MetricTooltip>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className={`grid w-full grid-cols-4 ${getTabContainerClass()}`}>
          <TabsTrigger value="products" className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="business-units" className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors">
            <Building className="h-4 w-4" />
            Business Units
          </TabsTrigger>
          <TabsTrigger value="opportunity-types" className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors">
            <Zap className="h-4 w-4" />
            Opportunity Types
          </TabsTrigger>
          <TabsTrigger value="lead-sources" className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors">
            <MapPin className="h-4 w-4" />
            Lead Sources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader className="bg-gray-50">
              <MetricTooltip
                title="Product Performance Analysis"
                description="Detailed performance metrics for each product including revenue, opportunities, and win rates"
                calculation="Revenue, opportunities, and win rates grouped by product"
                period="Based on selected time range and filters"
              >
                <CardTitle className={getTitleClass()}>Product Performance</CardTitle>
              </MetricTooltip>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground`}>Product</TableHead>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Opportunities</TableHead>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Revenue</TableHead>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Win Rate</TableHead>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Avg Deal Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operationalData.productPerformance?.slice(0, 10).map((product, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium py-2.5">{product.product}</TableCell>
                      <TableCell className="text-center py-2.5">{product.opportunities}</TableCell>
                      <TableCell className="text-center py-2.5">${(product.revenue / 1000).toFixed(0)}K</TableCell>
                      <TableCell className="text-center py-2.5">{product.winRate}%</TableCell>
                      <TableCell className="text-center py-2.5">${(product.avgDealSize / 1000).toFixed(0)}K</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business-units" className="space-y-4">
          <Card>
            <CardHeader className="bg-gray-50">
              <MetricTooltip
                title="Business Unit Performance"
                description="Performance analysis across different business units including revenue and win rates"
                calculation="Revenue, opportunities, and win rates grouped by business unit"
                period="Based on selected time range and filters"
              >
                <CardTitle className={getTitleClass()}>Business Unit Analysis</CardTitle>
              </MetricTooltip>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground`}>Business Unit</TableHead>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Opportunities</TableHead>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Revenue</TableHead>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Win Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operationalData.businessUnitPerformance?.map((unit, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium py-2.5">{unit.businessUnit}</TableCell>
                      <TableCell className="text-center py-2.5">{unit.opportunities}</TableCell>
                      <TableCell className="text-center py-2.5">${(unit.revenue / 1000).toFixed(0)}K</TableCell>
                      <TableCell className="text-center py-2.5">{unit.winRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunity-types" className="space-y-4">
          <Card>
            <CardHeader className="bg-gray-50">
              <MetricTooltip
                title="Opportunity Types Analysis"
                description="Performance breakdown by different types of opportunities in your pipeline"
                calculation="Revenue, opportunities, and win rates grouped by opportunity type"
                period="Based on selected time range and filters"
              >
                <CardTitle className={getTitleClass()}>Opportunity Types Performance</CardTitle>
              </MetricTooltip>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground`}>Opportunity Type</TableHead>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Opportunities</TableHead>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Revenue</TableHead>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Win Rate</TableHead>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Avg Deal Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operationalData.opportunityTypesAnalysis?.map((type, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium py-2.5">{type.opportunityType}</TableCell>
                      <TableCell className="text-center py-2.5">{type.opportunities}</TableCell>
                      <TableCell className="text-center py-2.5">${(type.revenue / 1000).toFixed(0)}K</TableCell>
                      <TableCell className="text-center py-2.5">{type.winRate}%</TableCell>
                      <TableCell className="text-center py-2.5">${(type.avgDealSize / 1000).toFixed(0)}K</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lead-sources" className="space-y-4">
          <Card>
            <CardHeader className="bg-gray-50">
              <MetricTooltip
                title="Lead Sources Analysis"
                description="Performance analysis of different lead sources and their contribution to revenue"
                calculation="Revenue, opportunities, and win rates grouped by lead source"
                period="Based on selected time range and filters"
              >
                <CardTitle className={getTitleClass()}>Lead Sources Performance</CardTitle>
              </MetricTooltip>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground`}>Lead Source</TableHead>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Opportunities</TableHead>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Revenue</TableHead>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Win Rate</TableHead>
                    <TableHead className={`${getTableHeaderClass()} text-muted-foreground text-center`}>Avg Deal Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operationalData.leadSourceAnalysis?.map((source, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium py-2.5">{source.leadSource}</TableCell>
                      <TableCell className="text-center py-2.5">{source.opportunities}</TableCell>
                      <TableCell className="text-center py-2.5">${(source.revenue / 1000).toFixed(0)}K</TableCell>
                      <TableCell className="text-center py-2.5">{source.winRate}%</TableCell>
                      <TableCell className="text-center py-2.5">${(source.avgDealSize / 1000).toFixed(0)}K</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PipelineManagementReports;
