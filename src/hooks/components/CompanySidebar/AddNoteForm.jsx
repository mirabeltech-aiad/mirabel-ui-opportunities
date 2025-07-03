
import React from "react";
import { Button } from "@OpportunityComponents/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@OpportunityComponents/ui/select";
import { Checkbox } from "@OpportunityComponents/ui/checkbox";
import SpeechTextarea from "./SpeechTextarea";

const AddNoteForm = ({
  noteForm,
  setNoteForm,
  onAddNote,
  activityTypesData,
  activityTypesLoading,
  usersData,
  usersLoading,
  handleMicrophoneClick,
  isListening
}) => {
  console.log('AddNoteForm - activityTypesData:', activityTypesData);
  console.log('AddNoteForm - usersData:', usersData);
  console.log('AddNoteForm - noteForm:', noteForm);

  return (
    <div className="p-3 border-b border-gray-200">
      <div className="space-y-2">
        <div className="space-y-1">
          <SpeechTextarea
            placeholder="Call Notes"
            value={noteForm.note || ""}
            onChange={(value) => setNoteForm(prev => ({ ...prev, note: value }))}
            rows={3}
            className="min-h-[80px] bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500 text-xs"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <Select 
              value={noteForm.activityType || ""} 
              onValueChange={(value) => setNoteForm(prev => ({ ...prev, activityType: value }))}
            >
              <SelectTrigger className="w-full h-8 bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500 text-xs">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                {activityTypesLoading ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : (
                  activityTypesData && Array.isArray(activityTypesData) && activityTypesData.length > 0 ? (
                    activityTypesData.map((type) => (
                      <SelectItem key={type.ID || type.id || type.Value || type.value} value={type.Name || type.name || type.Display || type.display}>
                        {type.Name || type.name || type.Display || type.display}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>No activity types available</SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select 
              value={noteForm.assignedBy || ""} 
              onValueChange={(value) => setNoteForm(prev => ({ ...prev, assignedBy: value }))}
            >
              <SelectTrigger className="w-full h-8 bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500 text-xs">
                <SelectValue placeholder="Assigned By" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                {usersLoading ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : (
                  usersData && Array.isArray(usersData) && usersData.length > 0 ? (
                    usersData.map((user) => (
                      <SelectItem key={user.value || user.id || user.Value} value={user.value || user.id || user.Value}>
                        {user.label || user.display || user.Display || user.name || user.Name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>No users available</SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select 
              value={noteForm.assignedTo || ""} 
              onValueChange={(value) => setNoteForm(prev => ({ ...prev, assignedTo: value }))}
            >
              <SelectTrigger className="w-full h-8 bg-white border border-gray-300 rounded-md focus:border-ocean-500 focus:ring-ocean-500 text-xs">
                <SelectValue placeholder="Assigned To" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                {usersLoading ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : (
                  usersData && Array.isArray(usersData) && usersData.length > 0 ? (
                    usersData.map((user) => (
                      <SelectItem key={user.value || user.id || user.Value} value={user.value || user.id || user.Value}>
                        {user.label || user.display || user.Display || user.name || user.Name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>No users available</SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="private" 
              checked={noteForm.isPrivate || false}
              onCheckedChange={(checked) => setNoteForm(prev => ({ ...prev, isPrivate: checked }))} 
              className="border-gray-300"
            />
            <label htmlFor="private" className="text-sm text-gray-700 cursor-pointer">
              Private
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="taskList" 
              checked={noteForm.addToTaskList || false}
              onCheckedChange={(checked) => setNoteForm(prev => ({ ...prev, addToTaskList: checked }))} 
              className="border-gray-300"
            />
            <label htmlFor="taskList" className="text-sm text-gray-700 cursor-pointer">
              Add to Task List
            </label>
          </div>
        </div>

        <Button 
          onClick={onAddNote} 
          className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-xs"
        >
          Add Note
        </Button>
      </div>
    </div>
  );
};

export default AddNoteForm;
