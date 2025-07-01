import React, { useState } from "react";
import MainNavbar from "@OpportunityComponents/MainNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportErrorBoundary from "@OpportunityComponents/Reports/ReportErrorBoundary";
import ExecutiveDashboard from "@OpportunityComponents/Reports/ExecutiveDashboard";
import RepPerformanceAnalysis from "@OpportunityComponents/Reports/RepPerformanceAnalysis";
import SalesPerformanceAnalysis from "@OpportunityComponents/Reports/SalesPerformanceAnalysis";
import PredictiveAnalytics from "@OpportunityComponents/Reports/PredictiveAnalytics";
import PipelineManagementReports from "@OpportunityComponents/Reports/PipelineManagementReports";
import PipelineConversionFunnel from "@OpportunityComponents/Reports/PipelineConversionFunnel";
import DealVelocityAnalysis from "@OpportunityComponents/Reports/DealVelocityAnalysis";
import LostDealAnalysis from "@OpportunityComponents/Reports/LostDealAnalysis";
import PipelineAnalytics from "@OpportunityComponents/Reports/PipelineAnalytics";
import { BarChart3, TrendingUp, Users, Target, TrendingDown, Clock, AlertTriangle, DollarSign, Brain } from "lucide-react";
import { mockOpportunities } from "@OpportunityData/mockData";

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-ocean-800 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your sales performance and pipeline health</p>
        </div>

        <Tabs defaultValue="executive" className="w-full">
          <TabsList className="grid w-full grid-cols-9 mb-6 bg-blue-50 p-1 rounded-md">
            <TabsTrigger 
              value="executive" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              Executive
            </TabsTrigger>
            <TabsTrigger 
              value="sales" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              Sales Performance
            </TabsTrigger>
            <TabsTrigger 
              value="rep-analysis" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <Users className="h-4 w-4" />
              Rep Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="pipeline" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <Target className="h-4 w-4" />
              Pipeline Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="funnel" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <TrendingDown className="h-4 w-4" />
              Conversion Funnel
            </TabsTrigger>
            <TabsTrigger 
              value="velocity" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <Clock className="h-4 w-4" />
              Deal Velocity
            </TabsTrigger>
            <TabsTrigger 
              value="lost-deals" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <AlertTriangle className="h-4 w-4" />
              Lost Deals
            </TabsTrigger>
            <TabsTrigger 
              value="operational" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <DollarSign className="h-4 w-4" />
              Operational
            </TabsTrigger>
            <TabsTrigger 
              value="predictive" 
              className="flex items-center gap-2 text-muted-foreground data-[state=active]:bg-ocean-gradient data-[state=active]:text-white rounded-sm transition-colors"
            >
              <Brain className="h-4 w-4" />
              Predictive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="executive">
            <ReportErrorBoundary sectionName="Executive Dashboard">
              <ExecutiveDashboard />
            </ReportErrorBoundary>
          </TabsContent>
          
          <TabsContent value="sales">
            <ReportErrorBoundary sectionName="Sales Performance Analysis">
              <SalesPerformanceAnalysis opportunities={mockOpportunities} />
            </ReportErrorBoundary>
          </TabsContent>

          <TabsContent value="rep-analysis">
            <ReportErrorBoundary sectionName="Rep Performance Analysis">
              <RepPerformanceAnalysis opportunities={mockOpportunities} />
            </ReportErrorBoundary>
          </TabsContent>
          
          <TabsContent value="pipeline">
            <ReportErrorBoundary sectionName="Pipeline Analytics">
              <PipelineAnalytics opportunities={mockOpportunities} />
            </ReportErrorBoundary>
          </TabsContent>

          <TabsContent value="funnel">
            <ReportErrorBoundary sectionName="Pipeline Conversion Funnel">
              <PipelineConversionFunnel opportunities={mockOpportunities} />
            </ReportErrorBoundary>
          </TabsContent>

          <TabsContent value="velocity">
            <ReportErrorBoundary sectionName="Deal Velocity Analysis">
              <DealVelocityAnalysis opportunities={mockOpportunities} />
            </ReportErrorBoundary>
          </TabsContent>

          <TabsContent value="lost-deals">
            <ReportErrorBoundary sectionName="Lost Deal Analysis">
              <LostDealAnalysis opportunities={mockOpportunities} />
            </ReportErrorBoundary>
          </TabsContent>
          
          <TabsContent value="operational">
            <ReportErrorBoundary sectionName="Pipeline Management Reports">
              <PipelineManagementReports opportunities={mockOpportunities} />
            </ReportErrorBoundary>
          </TabsContent>
          
          <TabsContent value="predictive">
            <ReportErrorBoundary sectionName="Predictive Analytics">
              <PredictiveAnalytics />
            </ReportErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
