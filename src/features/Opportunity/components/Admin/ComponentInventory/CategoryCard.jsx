
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@OpportunityComponents/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Folder, CheckCircle, Clock, AlertTriangle } from "lucide-react";

/**
 * CategoryCard displays a comprehensive overview of a component category
 * including health metrics, component listings, and interactive filtering.
 * 
 * @component
 * @example
 * ```jsx
 * <CategoryCard 
 *   category={{
 *     name: 'Reports',
 *     health: 'good',
 *     count: 15,
 *     avgSize: 120,
 *     components: [...]
 *   }}
 *   searchTerm="Analytics"
 * />
 * ```
 * 
 * @param {Object} props - Component props
 * @param {Object} props.category - Category data object
 * @param {string} props.category.name - Display name of the category
 * @param {string} props.category.health - Health status ('excellent', 'good', 'needs-attention', 'poor')
 * @param {number} props.category.count - Total number of components in category
 * @param {number} props.category.avgSize - Average lines of code per component
 * @param {Array} props.category.components - Array of component objects
 * @param {string} props.category.components[].name - Component file name
 * @param {number} props.category.components[].size - Component size in lines of code
 * @param {string} props.category.components[].complexity - Complexity level ('low', 'medium', 'high')
 * @param {string} props.category.components[].status - Component status ('healthy', 'needs-attention', 'needs-refactor')
 * @param {string} props.searchTerm - Current search filter term for component names
 */
const CategoryCard = ({ category, searchTerm }) => {
  /**
   * Returns appropriate CSS classes for health status styling
   * @param {string} health - Health status value
   * @returns {string} CSS class string for styling
   */
  const getHealthColor = (health) => {
    switch (health) {
      case "excellent": return "text-green-600 bg-green-100";
      case "good": return "text-blue-600 bg-blue-100";
      case "needs-attention": return "text-yellow-600 bg-yellow-100";
      case "poor": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  /**
   * Returns appropriate icon component for component status
   * @param {string} status - Component status value
   * @returns {JSX.Element} Lucide icon component
   */
  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "needs-attention": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "needs-refactor": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            {category.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getHealthColor(category.health)}>
              {category.health}
            </Badge>
            <span className="text-sm text-gray-500">{category.count} components</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Average Size: {category.avgSize} LOC</span>
            <span>Health Score</span>
          </div>
          <Progress 
            value={category.health === "excellent" ? 100 : category.health === "good" ? 80 : 60} 
            className="h-2" 
          />
        </div>
        
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
  );
};

export default CategoryCard;
