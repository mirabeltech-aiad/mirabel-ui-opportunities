import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/shared/components/ui/FloatingLabelInput';
import { FloatingLabelSelect } from '@/shared/components/ui/FloatingLabelSelect';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Calendar, User, Flag } from 'lucide-react';
import axiosService from '@/services/axiosService.js';
interface TasksTabProps {
  companyId?: string;
  opportunityId?: string;
}

interface Task {
  ID: number;
  Title: string;
  Description: string;
  AssignedTo: string;
  DueDate: string;
  Priority: string;
  Status: string;
  CreatedDate: string;
  CreatedBy: string;
}

const TasksTab: React.FC<TasksTabProps> = ({
  companyId,
  opportunityId
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'Medium'
  });

  // Mock users data for now
  const users: any[] = [];
  const isLoadingUsers = { users: false };

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' }
  ];

  // Load tasks
  const loadTasks = async () => {
    if (!companyId) return;

    setIsLoading(true);
    try {
      const payload = {
        CompanyID: companyId,
        OpportunityID: opportunityId || '',
        UserID: 1 // Current user ID
      };

      const response = await axiosService.post('/services/admin/common/production/executesp/', payload);
      
      if (response?.content && Array.isArray(response.content)) {
        setTasks(response.content);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new task
  const createTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      const payload = {
        Title: newTask.title,
        Description: newTask.description,
        AssignedTo: newTask.assignedTo,
        DueDate: newTask.dueDate,
        Priority: newTask.priority,
        CompanyID: companyId,
        OpportunityID: opportunityId,
        CreatedBy: 'Current User'
      };

      const response = await axiosService.post('/services/admin/common/production/executesp/', payload);
      
      if (response) {
        // Reset form
        setNewTask({
          title: '',
          description: '',
          assignedTo: '',
          dueDate: '',
          priority: 'Medium'
        });
        setShowAddForm(false);
        
        // Reload tasks
        loadTasks();
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [companyId, opportunityId]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">Create New Task</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <FloatingLabelInput
                id="taskTitle"
                label="Task Title *"
                value={newTask.title}
                onChange={(value) => setNewTask(prev => ({ ...prev, title: value }))}
                placeholder="Enter task title"
              />
            </div>
            
            <FloatingLabelSelect
              id="taskAssignedTo"
              label="Assigned To"
              value={newTask.assignedTo}
              onChange={(value) => setNewTask(prev => ({ ...prev, assignedTo: value }))}
              options={users.map(user => ({
                value: user.Name,
                label: user.Name
              }))}
              loading={isLoadingUsers.users}
            />
            
            <FloatingLabelInput
              id="taskDueDate"
              label="Due Date"
              type="date"
              value={newTask.dueDate}
              onChange={(value) => setNewTask(prev => ({ ...prev, dueDate: value }))}
            />
            
            <FloatingLabelSelect
              id="taskPriority"
              label="Priority"
              value={newTask.priority}
              onChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}
              options={priorityOptions}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={createTask}
              disabled={!newTask.title.trim()}
            >
              Create Task
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading tasks...
          </div>
        ) : tasks.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <div key={task.ID} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-md font-medium text-gray-900 mb-2">
                      {task.Title}
                    </h4>
                    
                    {task.Description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {task.Description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {task.AssignedTo && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{task.AssignedTo}</span>
                        </div>
                      )}
                      
                      {task.DueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(task.DueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Flag className="h-4 w-4" />
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.Priority)}`}>
                          {task.Priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      task.Status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : task.Status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.Status}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-gray-400">
                  Created by {task.CreatedBy} on {new Date(task.CreatedDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No tasks found for this opportunity.</p>
            <p className="text-sm mt-1">Click "Add Task" to create the first task.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksTab;