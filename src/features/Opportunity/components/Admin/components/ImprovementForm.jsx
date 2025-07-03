
import { Card, CardContent } from "@OpportunityComponents/ui/card";
import { Button } from "@OpportunityComponents/ui/button";
import { Input } from "@OpportunityComponents/ui/input";
import { Textarea } from "@OpportunityComponents/ui/textarea";

// Extracted for clarity - handles improvement form display and input
const ImprovementForm = ({ 
  isVisible,
  isEditing,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel 
}) => {
  if (!isVisible) return null;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h3 className="text-base font-medium mb-3">
          {isEditing ? 'Edit Improvement' : 'Add New Improvement'}
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => onFormDataChange({...formData, title: e.target.value})}
              placeholder="Enter improvement title"
              className="h-8"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => onFormDataChange({...formData, priority: e.target.value})}
              className="w-full p-2 h-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
              <option value="nice-to-have">Nice to Have</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => onFormDataChange({...formData, description: e.target.value})}
              placeholder="Describe the improvement in detail..."
              rows={3}
              className="text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={onSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 h-8 text-sm"
            >
              {isEditing ? 'Update' : 'Add'}
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="h-8 text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImprovementForm;
