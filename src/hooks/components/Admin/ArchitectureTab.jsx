
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@OpportunityComponents/ui/card";
import { ScrollArea } from "@OpportunityComponents/ui/scroll-area";
import { FileText, GitBranch, Code, Database } from "lucide-react";

const ArchitectureTab = () => {
  const [architectureContent, setArchitectureContent] = useState("");

  useEffect(() => {
    // In a real app, this would fetch from an API or markdown file
    // For now, we'll provide a summary view of the architecture
    const summaryContent = `
# Project Architecture Overview

## Current Status
- **Total Components**: 80+ React components
- **Lines of Code**: ~13,000-15,000 LOC
- **Test Coverage**: 25+ test files
- **Admin Features**: 8 specialized tabs

## Technology Stack
- React 18 + TypeScript + Vite
- Tailwind CSS + Shadcn/UI
- React Query + React Router
- Testing with Vitest

## Component Health
- ✅ Well-structured Admin system
- ✅ Modular table components
- ⚠️ 3 large components need refactoring
- ✅ Good TypeScript adoption

## Performance Metrics
- Bundle size: Optimizable
- Load time: <3 seconds target
- Memory usage: Efficient
- Test coverage: Good

For detailed architecture documentation, see ARCHITECTURE.md in project root.
    `;
    setArchitectureContent(summaryContent);
  }, []);

  const metrics = [
    { label: "Total Components", value: "80+", icon: Code, color: "text-blue-600" },
    { label: "Lines of Code", value: "~15K", icon: FileText, color: "text-green-600" },
    { label: "Test Files", value: "25+", icon: GitBranch, color: "text-purple-600" },
    { label: "Admin Features", value: "8", icon: Database, color: "text-orange-600" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Project Architecture</h3>
        <p className="text-sm text-gray-500">
          Technical overview, component inventory, and architectural decisions
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
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

      {/* Architecture Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Architecture Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full">
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {architectureContent}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Architecture Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">View Full Documentation</h4>
                <p className="text-sm text-gray-500">Complete architecture guide in ARCHITECTURE.md</p>
              </div>
              <div className="text-sm text-blue-600">Available in project root</div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Component Analysis</h4>
                <p className="text-sm text-gray-500">Detailed breakdown of component sizes and complexity</p>
              </div>
              <div className="text-sm text-green-600">Health Score: B+</div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Refactoring Status</h4>
                <p className="text-sm text-gray-500">Current refactoring progress and recommendations</p>
              </div>
              <div className="text-sm text-purple-600">See Refactoring tab</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchitectureTab;
