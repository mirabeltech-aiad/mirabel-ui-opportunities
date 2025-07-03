
import React, { useState } from "react";
import { Button } from "@OpportunityComponents/ui/button";
import { Input } from "@OpportunityComponents/ui/input";
import { Textarea } from "@OpportunityComponents/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@OpportunityComponents/ui/select";
import { Checkbox } from "@OpportunityComponents/ui/checkbox";
import { Mic, Calendar, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import TimeSelector from "./TimeSelector";

const NotesScheduler = ({ onAddNote }) => {
  const [formData, setFormData] = useState({
    activityType: "",
    date: "",
    time: "",
    assignedBy: "",
    assignedTo: "",
    notes: "",
    isPrivate: false,
    addToTaskList: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddNote = () => {
    if (!formData.activityType || !formData.notes.trim()) {
      toast({
        title: "Error",
        description: "Please fill in Activity Type and Notes",
        variant: "destructive",
      });
      return;
    }

    // Create a new note object
    const newNote = {
      id: Date.now(), // Simple ID generation
      type: formData.activityType.toLowerCase(),
      date: formData.date ? new Date(formData.date + ' ' + (formData.time || '12:00')).toLocaleString() : new Date().toLocaleString(),
      user: formData.assignedBy || "Courtney Karp",
      description: formData.notes,
      icon: getIconForActivityType(formData.activityType),
      color: getColorForActivityType(formData.activityType)
    };

    // Call the callback if provided
    if (onAddNote) {
      onAddNote(newNote);
    }

    toast({
      title: "Success",
      description: "Note has been scheduled successfully",
    });

    // Reset form
    setFormData({
      activityType: "",
      date: "",
      time: "",
      assignedBy: "",
      assignedTo: "",
      notes: "",
      isPrivate: false,
      addToTaskList: false
    });
  };

  const getIconForActivityType = (type) => {
    const { Phone, Mail, FileText, Users, CheckSquare } = require("lucide-react");
    
    switch (type.toLowerCase()) {
      case "call":
        return Phone;
      case "email":
        return Mail;
      case "note":
        return FileText;
      case "meeting":
        return Users;
      case "task":
        return CheckSquare;
      default:
        return FileText;
    }
  };

  const getColorForActivityType = (type) => {
    switch (type.toLowerCase()) {
      case "call":
        return "text-orange-600";
      case "email":
        return "text-blue-600";
      case "note":
        return "text-green-600";
      case "meeting":
        return "text-purple-600";
      case "task":
        return "text-red-600";
      default:
        return "text-green-600";
    }
  };

  const activityTypes = [
    "Call",
    "Email", 
    "Meeting",
    "Task",
    "Note",
    "Follow-up"
  ];

  const users = [
    "Courtney Karp",
    "Michael Scott",
    "Jim Halpert",
    "Pam Beesly",
    "Dwight Schrute"
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2 mb-2 shadow-sm">
      <div className="space-y-2">
        {/* First Row: Activity Type, Date, Time */}
        <div className="flex gap-1.5 items-center">
          <div className="flex-1">
            <Select value={formData.activityType} onValueChange={(value) => handleInputChange('activityType', value)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                {activityTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-xs hover:bg-gray-100">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-28">
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="h-7 text-xs"
              placeholder="Date"
            />
          </div>
          <div className="w-24">
            <TimeSelector
              value={formData.time}
              onChange={(value) => handleInputChange('time', value)}
              className="h-7 text-xs"
            />
          </div>
        </div>

        {/* Second Row: Assigned By and Assigned To */}
        <div className="flex gap-1.5">
          <div className="flex-1">
            <Select value={formData.assignedBy} onValueChange={(value) => handleInputChange('assignedBy', value)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="Assigned By" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                {users.map((user) => (
                  <SelectItem key={user} value={user} className="text-xs hover:bg-gray-100">
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="Assigned To" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                {users.map((user) => (
                  <SelectItem key={user} value={user} className="text-xs hover:bg-gray-100">
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes Field */}
        <div className="relative">
          <Textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Notes"
            className="min-h-[60px] text-xs resize-none pr-8"
            rows={2}
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-1 right-1 h-5 w-5 p-0 text-blue-500 hover:text-blue-700"
          >
            <Mic className="h-3 w-3" />
          </Button>
        </div>

        {/* Bottom Row: Checkboxes and Add Note Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-1.5">
              <Checkbox
                id="private"
                checked={formData.isPrivate}
                onCheckedChange={(checked) => handleInputChange('isPrivate', checked)}
                className="h-3 w-3"
              />
              <label htmlFor="private" className="text-xs text-gray-700">
                Private
              </label>
            </div>
            <div className="flex items-center space-x-1.5">
              <Checkbox
                id="taskList"
                checked={formData.addToTaskList}
                onCheckedChange={(checked) => handleInputChange('addToTaskList', checked)}
                className="h-3 w-3"
              />
              <label htmlFor="taskList" className="text-xs text-gray-700">
                Add to Task List
              </label>
            </div>
          </div>
          <Button
            onClick={handleAddNote}
            className="bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs px-3"
          >
            Add Note
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotesScheduler;
