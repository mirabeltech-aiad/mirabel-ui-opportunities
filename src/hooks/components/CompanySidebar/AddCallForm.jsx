
import React from "react";
import { Plus, Phone } from "lucide-react";
import { Button } from "@OpportunityComponents/ui/button";
import { Input } from "@OpportunityComponents/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@OpportunityComponents/ui/select";
import { useQuery } from "@tanstack/react-query";
import apiService from "../../services/apiService";
import { userService } from "../../services/userService";
import SpeechTextarea from "./SpeechTextarea";
import FormCheckboxes from "./FormCheckboxes";
import TimeSelector from "../TimeSelector";
import CallDispositionSelect from "./CallDispositionSelect";

const AddCallForm = ({ 
  callForm, 
  setCallForm, 
  onAddCall 
}) => {
  // Fetch activity types for the dropdown
  const { data: activityTypesData, isLoading: activityTypesLoading } = useQuery({
    queryKey: ['activityTypes'],
    queryFn: async () => {
      const response = await apiService.get('/services/Admin/Masters/MasterData/ActivityTypes');
      return response.content?.Data?.ActivityTypes || [];
    }
  });

  // Fetch users for both Assigned By and Assigned To dropdowns
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsersForDropdown()
  });

  // Check if the scheduled date is today or in the past
  const shouldShowCallDisposition = () => {
    if (!callForm.scheduledDate) return false;
    
    const selectedDate = new Date(callForm.scheduledDate);
    const today = new Date();
    
    // Set both dates to midnight for accurate comparison
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    // Show call disposition if selected date is today or in the past
    return selectedDate.getTime() <= today.getTime();
  };

  return (
    <div className="p-3 border-b border-gray-200">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Plus className="h-3 w-3 text-blue-600" />
          <span className="text-xs font-medium text-gray-700">Add New Call</span>
        </div>

        {/* Activity Type */}
        <div className="space-y-1">
          <Select 
            value={callForm.activityType} 
            onValueChange={(value) => setCallForm(prev => ({ ...prev, activityType: value }))}
          >
            <SelectTrigger className="w-full h-8 bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500 text-xs">
              <SelectValue placeholder="Activity Type" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
              {activityTypesLoading ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : (
                activityTypesData?.map((activityType) => (
                  <SelectItem key={activityType.Value} value={activityType.Value.toString()}>
                    {activityType.Display}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Call Disposition - Only show for current/past dates */}
        {shouldShowCallDisposition() && (
          <div className="space-y-1">
            <CallDispositionSelect
              value={callForm.callDisposition}
              onChange={(value) => setCallForm(prev => ({ ...prev, callDisposition: value }))}
              className="w-full h-8 bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500 text-xs"
            />
          </div>
        )}

        {/* Date and Time Row */}
        <div className="grid grid-cols-2 gap-2">
          <Input 
            type="date"
            value={callForm.scheduledDate}
            onChange={e => setCallForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
            className="h-8 bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500 text-xs"
          />
          <TimeSelector
            value={callForm.scheduledTime}
            onChange={(time) => setCallForm(prev => ({ ...prev, scheduledTime: time }))}
            className="w-full h-8 bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500 text-xs"
          />
        </div>

        {/* Assigned By */}
        <div className="space-y-1">
          <Select 
            value={callForm.assignedBy} 
            onValueChange={(value) => setCallForm(prev => ({ ...prev, assignedBy: value }))}
          >
            <SelectTrigger className="w-full h-8 bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500 text-xs">
              <SelectValue placeholder="Assigned By" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
              {usersLoading ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : (
                usersData?.map((user) => (
                  <SelectItem key={user.id} value={user.value}>
                    {user.display}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Assigned To */}
        <div className="space-y-1">
          <Select 
            value={callForm.assignedTo} 
            onValueChange={(value) => setCallForm(prev => ({ ...prev, assignedTo: value }))}
          >
            <SelectTrigger className="w-full h-8 bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500 text-xs">
              <SelectValue placeholder="Assigned To" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
              {usersLoading ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : (
                usersData?.map((user) => (
                  <SelectItem key={user.id} value={user.value}>
                    {user.display}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Call Notes */}
        <div className="space-y-1">
          <SpeechTextarea
            placeholder="Call Notes"
            value={callForm.note}
            onChange={(value) => setCallForm(prev => ({ ...prev, note: value }))}
            rows={3}
            className="bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500 text-xs"
          />
        </div>

        {/* Checkboxes */}
        <FormCheckboxes
          isPrivate={callForm.isPrivate}
          setIsPrivate={(checked) => setCallForm(prev => ({ ...prev, isPrivate: checked }))}
          addToTaskList={callForm.addToTaskList}
          setAddToTaskList={(checked) => setCallForm(prev => ({ ...prev, addToTaskList: checked }))}
        />

        {/* Save Call Button */}
        <Button 
          onClick={onAddCall} 
          className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-xs"
        >
          <Phone className="h-3 w-3 mr-1" />
          Save Call
        </Button>
      </div>
    </div>
  );
};

export default AddCallForm;
