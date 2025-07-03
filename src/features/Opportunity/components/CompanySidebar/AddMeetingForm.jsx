
import React from "react";
import { Plus, Calendar } from "lucide-react";
import { Button } from "@OpportunityComponents/ui/button";
import { Input } from "@OpportunityComponents/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@OpportunityComponents/ui/select";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/apiService";
import { userService } from "@/services/userService";
import SpeechTextarea from "./SpeechTextarea";
import FormCheckboxes from "./FormCheckboxes";
import TimeSelector from "../TimeSelector";

const AddMeetingForm = ({ 
  meetingForm, 
  setMeetingForm, 
  onAddMeeting 
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

  return (
    <div className="p-3 border-b border-gray-200 bg-gray-50">
      <div className="space-y-2">
        {/* Header with ocean-800 title color */}
        <div className="flex items-center gap-2 mb-2">
          <Plus className="h-3 w-3 text-ocean-500" />
          <span className="text-xs font-medium text-ocean-800">Add New Meeting</span>
        </div>

        {/* Activity Type without separate label */}
        <div className="space-y-1">
          <Select 
            value={meetingForm.activityType} 
            onValueChange={(value) => setMeetingForm(prev => ({ ...prev, activityType: value }))}
          >
            <SelectTrigger className="w-full h-8 bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500 text-xs">
              <SelectValue placeholder="Activity Type" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-lg z-50 rounded-md">
              {activityTypesLoading ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : (
                activityTypesData?.map((activityType) => (
                  <SelectItem 
                    key={activityType.Value} 
                    value={activityType.Value.toString()}
                    className="hover:bg-gray-50"
                  >
                    {activityType.Display}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Date and Time Row without separate labels */}
        <div className="grid grid-cols-2 gap-2">
          <Input 
            type="date"
            value={meetingForm.scheduledDate}
            onChange={e => setMeetingForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
            className="h-8 bg-white border border-gray-300 rounded-md text-xs focus:border-ocean-500 focus:ring-ocean-500"
          />
          <TimeSelector
            value={meetingForm.scheduledTime}
            onChange={(time) => setMeetingForm(prev => ({ ...prev, scheduledTime: time }))}
            className="w-full h-8 bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500 text-xs"
          />
        </div>

        {/* Assigned By without separate label */}
        <div className="space-y-1">
          <Select 
            value={meetingForm.assignedBy} 
            onValueChange={(value) => setMeetingForm(prev => ({ ...prev, assignedBy: value }))}
          >
            <SelectTrigger className="w-full h-8 bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500 text-xs">
              <SelectValue placeholder="Assigned By" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-lg z-50 rounded-md">
              {usersLoading ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : (
                usersData?.map((user) => (
                  <SelectItem 
                    key={user.id} 
                    value={user.value}
                    className="hover:bg-gray-50"
                  >
                    {user.display}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Assigned To without separate label */}
        <div className="space-y-1">
          <Select 
            value={meetingForm.assignedTo} 
            onValueChange={(value) => setMeetingForm(prev => ({ ...prev, assignedTo: value }))}
          >
            <SelectTrigger className="w-full h-8 bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500 text-xs">
              <SelectValue placeholder="Assigned To" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-lg z-50 rounded-md">
              {usersLoading ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : (
                usersData?.map((user) => (
                  <SelectItem 
                    key={user.id} 
                    value={user.value}
                    className="hover:bg-gray-50"
                  >
                    {user.display}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Meeting Notes */}
        <div className="space-y-1">
          <SpeechTextarea
            placeholder="Meeting Notes"
            value={meetingForm.note}
            onChange={(value) => setMeetingForm(prev => ({ ...prev, note: value }))}
            rows={3}
            className="bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500 text-xs"
          />
        </div>

        {/* Checkboxes with proper spacing */}
        <FormCheckboxes
          isPrivate={meetingForm.isPrivate}
          setIsPrivate={(checked) => setMeetingForm(prev => ({ ...prev, isPrivate: checked }))}
          addToTaskList={meetingForm.addToTaskList}
          setAddToTaskList={(checked) => setMeetingForm(prev => ({ ...prev, addToTaskList: checked }))}
        />

        {/* Save Meeting Button with ocean theme */}
        <Button 
          onClick={onAddMeeting} 
          className="w-full h-8 bg-ocean-500 hover:bg-ocean-600 text-white rounded-lg font-medium border-ocean-500 transition-colors text-xs"
        >
          <Calendar className="h-3 w-3 mr-1" />
          Save Meeting
        </Button>
      </div>
    </div>
  );
};

export default AddMeetingForm;
