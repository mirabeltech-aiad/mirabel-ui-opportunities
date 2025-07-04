
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  GitCommit, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  FileText,
  Zap
} from "lucide-react";

const RefactoringTab = () => {
  const [refactoringData, setRefactoringData] = useState({
    completedPhases: 1,
    totalPhases: 4,
    overallProgress: 25,
    highPriorityIssues: 3,
    mediumPriorityIssues: 3,
    lowPriorityIssues: 3
  });

  const phases = [
    {
      id: 1,
      name: "Cleanup and Bloat Removal",
      status: "completed",
      progress: 100,
      description: "Removed unused components and duplicate files",
      items: [
        "✅ Removed unused Header component",
        "✅ Removed duplicate Index.jsx page", 
        "✅ Added comprehensive test coverage",
        "✅ Restored Improvements functionality"
      ]
    },
    {
      id: 2,
      name: "Component Size Optimization",
      status: "next",
      progress: 0,
      description: "Break down large components into smaller, focused pieces",
      items: [
        "🎯 Refactor OpportunitiesTable.tsx (~300+ lines)",
        "🎯 Consider AdvancedSearch.jsx breakdown",
        "🎯 Extract table sub-components",
        "🎯 Improve component maintainability"
      ]
    },
    {
      id: 3,
      name: "Performance Optimization",
      status: "planned",
      progress: 0,
      description: "Optimize bundle size and runtime performance",
      items: [
        "📦 Bundle size analysis and optimization",
        "⚡ Virtual scrolling for large tables",
        "🔄 Dynamic imports and lazy loading",
        "📊 Performance monitoring setup"
      ]
    },
    {
      id: 4,
      name: "Code Quality Improvements",
      status: "planned",
      progress: 0,
      description: "Enhance TypeScript coverage and testing",
      items: [
        "📝 Increase TypeScript coverage to 95%",
        "🧪 Enhance test coverage to 80%",
        "♿ Improve accessibility compliance",
        "📚 Documentation improvements"
      ]
    }
  ];

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
      priority: "high",
      title: "Type Safety Gaps",
      description: "Some components still use 'any' types",
      impact: "Code Quality",
      effort: "Low"
    },
    {
      priority: "medium",
      title: "Virtual Scrolling",
      description: "Large tables need performance optimization",
      impact: "UX",
      effort: "High"
    },
    {
      priority: "medium",
      title: "Mobile Responsiveness",
      description: "Some responsive design gaps",
      impact: "UX",
      effort: "Medium"
    },
    {
      priority: "medium",
      title: "Accessibility Improvements",
      description: "Enhanced keyboard navigation needed",
      impact: "Accessibility",
      effort: "Medium"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "next": return "bg-blue-500";
      case "planned": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Refactoring Progress</h3>
        <p className="text-sm text-gray-500">
          Track technical debt, refactoring phases, and code quality improvements
        </p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Refactoring Completion</span>
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
                <p className="text-xs text-gray-500">High Priority Items</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refactoring Phases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCommit className="h-5 w-5" />
            Refactoring Phases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {phases.map((phase) => (
              <div key={phase.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(phase.status)}`} />
                    <h4 className="font-medium">Phase {phase.id}: {phase.name}</h4>
                  </div>
                  <Badge variant={phase.status === "completed" ? "default" : "secondary"}>
                    {phase.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                
                <div className="space-y-1">
                  {phase.items.map((item, index) => (
                    <div key={index} className="text-sm text-gray-700">
                      {item}
                    </div>
                  ))}
                </div>
                
                {phase.progress > 0 && (
                  <div className="mt-3">
                    <Progress value={phase.progress} className="h-1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technical Debt */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Technical Debt Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
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
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              View Full Refactoring Log
            </Button>
            <Button variant="outline" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Phase Complete
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Schedule Next Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RefactoringTab;
