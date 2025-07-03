import React, { useState, useEffect } from "react";
import { Button } from "@OpportunityComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@OpportunityComponents/ui/card";
import { Input } from "@OpportunityComponents/ui/input";
import { Textarea } from "@OpportunityComponents/ui/textarea";
import { Badge } from "@OpportunityComponents/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@OpportunityComponents/ui/select";
import { Plus, Calendar, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/apiService";
import { userId } from "@/services/httpClient";

const TasksSection = ({ companyId }) => {
  // Get customer ID from the opportunity (you may need to adjust this based on your data structure)
  const getCustomerId = () => {
    // This should be derived from the opportunity data
    // For now using opportunityId, but you may need to adjust based on your data structure
    return companyId;
  };

  // Fetch tasks from API
  const { data: tasksData, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks', companyId],
    queryFn: async () => {
      const payload = {
        spName: "uspCDCSyncGetTask",
        isMMDatabase: false,
        spParam: {
          TaskType: "3",
          CustomerId: companyId
        }
      };
      const response = await apiService.post('/services/admin/common/production/executesp/', payload);
      return response?.content || [];
    },
    enabled: !!companyId
  });

  // Transform API data to match existing component structure
  const tasks = tasksData?.Data?.Table?.map(task => ({
    id: task.ID,
    title: task.Title,
    description: task.Description,
    assignedTo: task.AssignedTo,
    dueDate: task.ProjectEndDate,
    priority: task.Priority,
    createdBy: task.ProjectStartDate
  })) || [];

  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [priorities, setPriorities] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch priorities on mount
  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        const response = await apiService.get('/services/Admin/Masters/TaskListPriority');
        if (response?.content?.Status === 'Success' && Array.isArray(response.content.List)) {
          setPriorities(response.content.List);
        }
      } catch (err) {
        console.error('Failed to fetch priorities:', err);
      }
    };
    fetchPriorities();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiService.get(`/services/User/Accounts/Master/${userId}/false/true`);
        if (response?.content?.Status === 'Success' && Array.isArray(response.content.List)) {
          setUsers(response.content.List);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();
  }, []);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: ""
  });

  const addTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      const payload = {
        spName: "uspCDCSyncsSaveTask",
        isMMDatabase: false,
        spParam: {
          pTaskId: -1,
          pTaskName: newTask.title,
          pDescription: newTask.description,
          pPriority: newTask.priority,
          pProduct: "",
          pAssociatedProjectID: "",
          pAssignedBy: userId,
          pAssignedTo: newTask.assignedTo,
          pIsPrivate: false,
          pStartDate: new Date().toISOString(),
          pDueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null,
          pCreatedBy: userId,
          pCustomerID: companyId,
          pIsTaskComplete: false,
          pSPAction: "SAVE",
          TaskType: "3"
        }
      };
      await apiService.post('/services/admin/common/production/executesp/', payload);
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        priority: ""
      });
      setShowNewTaskForm(false);
      refetch();
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Opportunity Tasks</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Opportunity Tasks</h3>
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        </div>
        <div className="text-center py-8 text-red-500">
          <p>Error loading tasks: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Opportunity Tasks</h3>
        <Button 
          onClick={() => setShowNewTaskForm(!showNewTaskForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {showNewTaskForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Assigned To</label>
                <Select
                  value={newTask.assignedTo}
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, assignedTo: value }))}
                >
                  <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-lg z-50 max-h-60 overflow-y-auto">
                    {users.length > 0 ? (
                      users.map(user => (
                        <SelectItem key={user.Value} value={user.Value}>
                          {user.Display || `${user.FirstName} ${user.LastName}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-users" disabled>No users available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-lg z-50 max-h-60 overflow-y-auto">
                    {priorities.length > 0 ? (
                      priorities.map(priority => (
                        <SelectItem key={priority.ID} value={priority.ID}>
                          {priority.Name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-priorities" disabled>No priorities available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addTask} className="bg-green-600 hover:bg-green-700">
                Add Task
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewTaskForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-base">
                  {task.title}
                </h4>
                {task.priority && (
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                )}
                {isOverdue(task.dueDate) && (
                  <Badge className="bg-red-600 text-white">Overdue</Badge>
                )}
              </div>
              {task.description && (
                <p className="text-gray-600 text-sm mb-2">{task.description}</p>
              )}
              <div className="flex items-center gap-6 text-xs text-gray-500 mt-2">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {task.assignedTo}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Due: {formatDate(task.dueDate)}
                </div>
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Created: {formatDate(task.createdBy)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tasks.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          <p>No tasks found for this opportunity.</p>
          <p className="text-sm">Click "Add Task" to create your first task.</p>
        </div>
      )}
    </div>
  );
};

export default TasksSection;
