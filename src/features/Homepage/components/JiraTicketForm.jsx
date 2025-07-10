import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/features/Opportunity/hooks/use-toast';

const JiraTicketForm = ({ onClose }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    project: '',
    issueType: 'Bug',
    priority: 'Medium',
    summary: '',
    description: '',
    labels: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const projects = [
    { id: 'MIRABEL', name: 'Mirabel Manager' },
    { id: 'SUPPORT', name: 'Support Portal' },
    { id: 'TRAINING', name: 'Training System' },
    { id: 'DOCS', name: 'Documentation' }
  ];

  const priorities = [
    { value: 'Low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'Medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'High', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'Critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.project) {
      newErrors.project = 'Project is required';
    }

    if (!formData.summary.trim()) {
      newErrors.summary = 'Summary is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate JIRA API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful response
      const ticketId = 'MIRABEL-' + Math.floor(Math.random() * 10000);
      const ticketUrl = `https://jira.mirabel.com/browse/${ticketId}`;

      toast({
        title: "Ticket Created Successfully",
        description: (
          <div>
            <p>Ticket {ticketId} has been created.</p>
            <a 
              href={ticketUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Ticket
            </a>
          </div>
        ),
        variant: "default",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error Creating Ticket",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2" />
              Create JIRA Support Ticket
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Selection */}
            <div className="space-y-2">
              <Label htmlFor="project">Project *</Label>
              <Select
                value={formData.project}
                onValueChange={(value) => handleInputChange('project', value)}
              >
                <SelectTrigger className={errors.project ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.project && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.project}
                </div>
              )}
            </div>

            {/* Issue Type and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueType">Issue Type</Label>
                <Select
                  value={formData.issueType}
                  onValueChange={(value) => handleInputChange('issueType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bug">Bug</SelectItem>
                    <SelectItem value="Task">Task</SelectItem>
                    <SelectItem value="Story">Story</SelectItem>
                    <SelectItem value="Epic">Epic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center">
                          <Badge className={`mr-2 ${priority.color}`}>
                            {priority.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary">Summary *</Label>
              <Input
                id="summary"
                value={formData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                placeholder="Brief description of the issue"
                className={errors.summary ? 'border-red-500' : ''}
              />
              {errors.summary && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.summary}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of the issue, steps to reproduce, expected vs actual behavior..."
                rows={6}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.description}
                </div>
              )}
            </div>

            {/* Labels */}
            <div className="space-y-2">
              <Label htmlFor="labels">Labels</Label>
              <Input
                id="labels"
                value={formData.labels}
                onChange={(e) => handleInputChange('labels', e.target.value)}
                placeholder="Enter labels separated by commas (e.g., bug, ui, critical)"
              />
              <p className="text-sm text-gray-500">
                Add labels to help categorize and find your ticket
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Create Ticket
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JiraTicketForm; 