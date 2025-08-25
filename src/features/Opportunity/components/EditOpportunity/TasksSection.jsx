import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/features/Opportunity/Services/apiService";
import { getCurrentUserId } from "@/utils/userUtils";

const TasksSection = ({ companyId }) => {
  // Get customer ID from the opportunity (you may need to adjust this based on your data structure)
  const getCustomerId = () => {
    // This should be derived from the opportunity data
    // For now using opportunityId, but you may need to adjust based on your data structure
    return companyId;
  };

  // Fetch tasks from API with automatic triggering
  const { data: tasksData, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks', companyId],
    queryFn: async () => {
      console.log('TasksSection: Fetching tasks for companyId:', companyId);
      const payload = {
        spName: "uspCDCSyncOpportunityTaskGet",
        isMMDatabase: false,
        spParam: {
          TaskType: "3",
          CustomerId: parseInt(companyId) || 0
        }
      };
      const response = await apiService.post('/services/admin/common/production/executesp/', payload);
      console.log('TasksSection: API response:', response);
      return response?.content || [];
    },
    enabled: !!companyId, // Only run when companyId is available
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // Automatically trigger refetch when component mounts or companyId changes
  useEffect(() => {
    if (companyId) {
      console.log('TasksSection: Component mounted/companyId changed, triggering task fetch for:', companyId);
      refetch();
    }
  }, [companyId, refetch]);

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
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [prioritySearchTerm, setPrioritySearchTerm] = useState("");

  // Fetch priorities on mount
  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        console.log('TasksSection: Fetching priorities...');
        const response = await apiService.get('/services/Admin/Masters/TaskListPriority');
        if (response?.content?.Status === 'Success' && Array.isArray(response.content.List)) {
          setPriorities(response.content.List);
          console.log('TasksSection: Priorities loaded:', response.content.List.length);
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
        console.log('TasksSection: Fetching users...');
        const response = await apiService.get(`/services/User/Accounts/Master/${getCurrentUserId()}/false/true`);
        if (response?.content?.Status === 'Success' && Array.isArray(response.content.List)) {
          setUsers(response.content.List);
          console.log('TasksSection: Users loaded:', response.content.List.length);
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
      console.log('TasksSection: Adding new task:', newTask);
      // Convert priority to integer if it's a string
      const priorityValue = newTask.priority ? parseInt(newTask.priority) : 0;
      
      // Convert assignedTo to integer if it's a string
      const assignedToValue = newTask.assignedTo ? parseInt(newTask.assignedTo) : 0;
      
      // Format dates for SQL DATETIME format (YYYY-MM-DD HH:MM:SS)
      const formatDateForSQL = (date) => {
        if (!date) return null;
        const d = new Date(date);
        return d.toISOString().slice(0, 19).replace('T', ' ');
      };

      const payload = {
        spName: "uspCDCSyncOpportunityTaskSave",
        isMMDatabase: false,
        spParam: {
          pTaskId: -1,
          pTaskName: newTask.title,
          pDescription: newTask.description || "",
          pPriority: priorityValue,
          pProduct: 0, // Default to 0 instead of empty string
          pAssociatedProjectID: 0, // Default to 0 instead of empty string
          pAssignedBy: getCurrentUserId(),
          pAssignedTo: assignedToValue,
          pIsPrivate: false,
          pStartDate: formatDateForSQL(new Date()),
          pDueDate: newTask.dueDate ? formatDateForSQL(newTask.dueDate) : null,
          pCreatedBy: getCurrentUserId(),
          pCustomerID: parseInt(companyId) || 0,
          pIsTaskComplete: false,
          pSPAction: "SAVE",
          TaskType: "3"
        }
      };
      console.log('TasksSection: Saving task with payload:', payload);
      await apiService.post('/services/admin/common/production/executesp/', payload);
      console.log('TasksSection: Task saved successfully');
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        priority: ""
      });
      setShowNewTaskForm(false);
      // Refresh the tasks list
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

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const displayName = user.Display || `${user.FirstName} ${user.LastName}`;
    return displayName.toLowerCase().includes(userSearchTerm.toLowerCase());
  });

  // Filter priorities based on search term
  const filteredPriorities = priorities.filter(priority => {
    return priority.Name.toLowerCase().includes(prioritySearchTerm.toLowerCase());
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Tasks</h3>
          <Button
            onClick={() => setShowNewTaskForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
            disabled
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Tasks</h3>
          <Button
            onClick={() => setShowNewTaskForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600">Failed to load tasks. Please try again.</p>
          <Button onClick={() => refetch()} className="mt-2 bg-blue-600 hover:bg-blue-700">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <Button
          onClick={() => setShowNewTaskForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {showNewTaskForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Task Title</label>
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
                    <div className="p-2 border-b border-gray-200">
                      <Input
                        type="text"
                        placeholder="Search users..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="w-full"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <SelectItem key={user.Value} value={user.Value}>
                          {user.Display || `${user.FirstName} ${user.LastName}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-users" disabled>No users found</SelectItem>
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
                    <div className="p-2 border-b border-gray-200">
                      <Input
                        type="text"
                        placeholder="Search priorities..."
                        value={prioritySearchTerm}
                        onChange={(e) => setPrioritySearchTerm(e.target.value)}
                        className="w-full"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {filteredPriorities.length > 0 ? (
                      filteredPriorities.map(priority => (
                        <SelectItem key={priority.ID} value={priority.ID}>
                          {priority.Name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-priorities" disabled>No priorities found</SelectItem>
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
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks found for this opportunity.</p>
            <p className="text-sm mt-1">Click "Add Task" to create a new task.</p>
          </div>
        ) : (
          tasks.map((task) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default TasksSection;
