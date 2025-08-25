
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Search, 
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Folder,
  Component,
  Code,
  Database,
  GitBranch,
  GitCommit,
  TrendingUp,
  Zap
} from "lucide-react";

const CodingSpecsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Architecture metrics
  const architectureMetrics = [
    { label: "Total Components", value: "83", icon: Code, color: "text-blue-600" },
    { label: "Lines of Code", value: "~15K", icon: FileText, color: "text-green-600" },
    { label: "Test Files", value: "25+", icon: GitBranch, color: "text-purple-600" },
    { label: "Admin Features", value: "9", icon: Database, color: "text-orange-600" }
  ];

  // Refactoring data
  const refactoringData = {
    completedPhases: 1,
    totalPhases: 4,
    overallProgress: 25,
    highPriorityIssues: 3
  };

  // Component inventory
  const componentCategories = [
    {
      name: "Pages",
      count: 6,
      avgSize: 220,
      health: "good",
      components: [
        { name: "Pipeline.jsx", size: 180, complexity: "medium", status: "healthy" },
        { name: "Admin.jsx", size: 150, complexity: "low", status: "healthy" },
        { name: "EditOpportunity.jsx", size: 280, complexity: "high", status: "needs-attention" },
        { name: "AdvancedSearch.jsx", size: 250, complexity: "high", status: "needs-attention" }
      ]
    },
    {
      name: "Admin Components",
      count: 9,
      avgSize: 180,
      health: "excellent",
      components: [
        { name: "ApiKeysTab.jsx", size: 150, complexity: "medium", status: "healthy" },
        { name: "FieldMappingTab.jsx", size: 200, complexity: "medium", status: "healthy" },
        { name: "CodingSpecsTab.jsx", size: 400, complexity: "high", status: "needs-refactor" }
      ]
    },
    {
      name: "Table Components",
      count: 15,
      avgSize: 95,
      health: "excellent",
      components: [
        { name: "OpportunitiesTable.tsx", size: 320, complexity: "high", status: "needs-refactor" },
        { name: "OpportunityTableRow.jsx", size: 80, complexity: "low", status: "healthy" }
      ]
    }
  ];

  // Technical debt items
  const technicalDebt = [
    {
      priority: "high",
      title: "Large Component Files",
      description: "3 components exceed 200 lines",
      impact: "Maintainability",
      effort: "Medium"
    },
    {
      priority: "high", 
      title: "Bundle Size Optimization",
      description: "Potential for 15-20% size reduction",
      impact: "Performance",
      effort: "Medium"
    },
    {
      priority: "medium",
      title: "Virtual Scrolling",
      description: "Large tables need performance optimization",
      impact: "UX",
      effort: "High"
    }
  ];

  const getHealthColor = (health) => {
    switch (health) {
      case "excellent": return "text-green-600 bg-green-100";
      case "good": return "text-blue-600 bg-blue-100";
      case "needs-attention": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "needs-attention": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "needs-refactor": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Coding Specifications</h3>
        <p className="text-sm text-gray-500">
          Architecture overview, refactoring status, and component inventory
        </p>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {architectureMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gray-100 ${metric.color}`}>
                  <metric.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-lg font-bold">{metric.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="refactoring">Refactoring</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="technical-debt">Tech Debt</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Health Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">80%</p>
                  <p className="text-xs text-gray-500">Component Health</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">25%</p>
                  <p className="text-xs text-gray-500">Refactoring Progress</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">3</p>
                  <p className="text-xs text-gray-500">Priority Issues</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>• React 18 + TypeScript + Vite</div>
                <div>• Tailwind CSS + Shadcn/UI</div>
                <div>• React Query + React Router</div>
                <div>• Testing with Vitest</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Refactoring Tab */}
        <TabsContent value="refactoring" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Refactoring Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-gray-500">{refactoringData.overallProgress}%</span>
                  </div>
                  <Progress value={refactoringData.overallProgress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{refactoringData.completedPhases}</p>
                    <p className="text-xs text-gray-500">Phases Complete</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{refactoringData.totalPhases - refactoringData.completedPhases}</p>
                    <p className="text-xs text-gray-500">Phases Remaining</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{refactoringData.highPriorityIssues}</p>
                    <p className="text-xs text-gray-500">High Priority</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Phase: Component Size Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>🎯 Refactor OpportunitiesTable.tsx (~320 lines)</div>
                <div>🎯 Break down CodingSpecsTab.jsx (~400 lines)</div>
                <div>🎯 Extract table sub-components</div>
                <div>🎯 Improve component maintainability</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Component Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search components..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button
                  variant={filterType === "needs-attention" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(filterType === "needs-attention" ? "all" : "needs-attention")}
                >
                  Needs Attention
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {componentCategories.map((category) => (
              <Card key={category.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Folder className="h-5 w-5" />
                      {category.name}
                    </CardTitle>
                    <Badge className={getHealthColor(category.health)}>
                      {category.health}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {category.components
                        .filter(comp => comp.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((component) => (
                        <div key={component.name} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(component.status)}
                            <span className="font-medium text-sm">{component.name}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>{component.size} LOC</span>
                            <Badge variant="outline" className="text-xs">
                              {component.complexity}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Technical Debt Tab */}
        <TabsContent value="technical-debt" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Technical Debt Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {technicalDebt.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <Badge variant={getPriorityColor(item.priority)} className="text-xs">
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{item.description}</p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-gray-500">Impact: {item.impact}</span>
                        <span className="text-xs text-gray-500">Effort: {item.effort}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button variant="outline" size="sm">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Identify Targets
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" size="sm">
                  <GitCommit className="h-4 w-4 mr-2" />
                  Schedule Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodingSpecsTab;
