
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const OpportunityCard = ({ opportunity, onSave, onApply }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Review': return 'bg-blue-100 text-blue-700';
      case 'Closed': return 'bg-gray-100 text-gray-700';
      case 'Draft': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days left`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {opportunity.title}
            </CardTitle>
            <p className="text-gray-600 font-medium">{opportunity.company}</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge className={getPriorityColor(opportunity.priority)}>
              {opportunity.priority}
            </Badge>
            <Badge className={getStatusColor(opportunity.status)}>
              {opportunity.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Key Details */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-gray-600">
              {opportunity.type}
            </Badge>
            <Badge variant="outline" className="text-gray-600">
              {opportunity.category}
            </Badge>
            <Badge variant="outline" className="text-gray-600">
              {opportunity.location}
            </Badge>
            {opportunity.remote && (
              <Badge variant="outline" className="text-green-600 border-green-200">
                Remote
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm line-clamp-2">
            {opportunity.description}
          </p>

          {/* Salary and Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="font-medium">{opportunity.salary}</span>
            <div className="flex items-center space-x-4">
              <span>{opportunity.applicants} applicants</span>
              <span className="text-orange-600">
                {formatDeadline(opportunity.deadline)}
              </span>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-gray-500">
              Posted {new Date(opportunity.postedDate).toLocaleDateString()}
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSave(opportunity.id)}
              >
                Save
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => onApply(opportunity.id)}
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunityCard;
