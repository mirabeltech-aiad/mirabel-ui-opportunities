
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@OpportunityComponents/ui/tabs";
import AddCallForm from "./AddCallForm";
import AddMeetingForm from "./AddMeetingForm";
import AddNoteForm from "./AddNoteForm";
import ActivityIconBar from "./ActivityIconBar";
import ActivityRenderer from "./ActivityRenderer";

const ActivityTabs = ({
  activeTab,
  handleTabChange,
  tabData,
  loadingStates,
  errorStates,
  refreshTabData,
  callForm,
  setCallForm,
  handleAddCall,
  meetingForm,
  setMeetingForm,
  handleAddMeeting,
  noteForm,
  setNoteForm,
  handleAddNote,
  formatDate,
  parseNoteContent,
  handleMicrophoneClick,
  isListening,
  activityTypesData,
  activityTypesLoading,
  usersData,
  usersLoading
}) => {
  return (
    <div className="flex-1 overflow-hidden">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-6 mx-4 mt-4 bg-blue-50 p-1 rounded-md">
          <TabsTrigger value="all" className="text-xs text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-sky-400 data-[state=active]:text-white rounded-md transition-all duration-200">
            All
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-xs text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-sky-400 data-[state=active]:text-white rounded-md transition-all duration-200">
            Notes
          </TabsTrigger>
          <TabsTrigger value="calls" className="text-xs text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-sky-400 data-[state=active]:text-white rounded-md transition-all duration-200">
            Calls
          </TabsTrigger>
          <TabsTrigger value="meetings" className="text-xs text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-sky-400 data-[state=active]:text-white rounded-md transition-all duration-200">
            Meetings
          </TabsTrigger>
          <TabsTrigger value="emails" className="text-xs text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-sky-400 data-[state=active]:text-white rounded-md transition-all duration-200">
            Emails
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-900 data-[state=active]:to-sky-400 data-[state=active]:text-white rounded-md transition-all duration-200">
            Tasks
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="all" className="h-full mt-0">
            <div className="h-full overflow-y-auto px-4 pb-4">
              <div className="pt-0.5">
                <ActivityIconBar 
                  refreshTabData={refreshTabData}
                  loadingStates={loadingStates}
                />
              </div>

              {loadingStates.all ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Loading activities...</p>
                  </div>
                </div>
              ) : errorStates.all ? (
                <div className="text-center py-8 text-red-500">
                  <p>Error loading activities: {errorStates.all}</p>
                </div>
              ) : (
                <ActivityRenderer
                  activities={tabData.all}
                  formatDate={formatDate}
                  parseNoteContent={parseNoteContent}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="h-full mt-4">
            <div className="h-full overflow-y-auto">
              <AddNoteForm 
                noteForm={noteForm}
                setNoteForm={setNoteForm}
                onAddNote={handleAddNote}
                activityTypesData={activityTypesData}
                activityTypesLoading={activityTypesLoading}
                usersData={usersData}
                usersLoading={usersLoading}
                handleMicrophoneClick={handleMicrophoneClick}
                isListening={isListening}
              />

              <div className="p-4">
                {loadingStates.notes ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-gray-500">Loading notes...</p>
                    </div>
                  </div>
                ) : errorStates.notes ? (
                  <div className="text-center py-8 text-red-500">
                    <p>Error loading notes: {errorStates.notes}</p>
                  </div>
                ) : (
                  <ActivityRenderer
                    activities={tabData.notes}
                    formatDate={formatDate}
                    parseNoteContent={parseNoteContent}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calls" className="h-full mt-4">
            <div className="h-full overflow-y-auto">
              <AddCallForm 
                callForm={callForm}
                setCallForm={setCallForm}
                onAddCall={handleAddCall}
                activityTypesData={activityTypesData}
                activityTypesLoading={activityTypesLoading}
                usersData={usersData}
                usersLoading={usersLoading}
              />

              <div className="p-4">
                {loadingStates.calls ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-gray-500">Loading calls...</p>
                    </div>
                  </div>
                ) : errorStates.calls ? (
                  <div className="text-center py-8 text-red-500">
                    <p>Error loading calls: {errorStates.calls}</p>
                  </div>
                ) : (
                  <ActivityRenderer
                    activities={tabData.calls}
                    formatDate={formatDate}
                    parseNoteContent={parseNoteContent}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="meetings" className="h-full mt-4">
            <div className="h-full overflow-y-auto">
              <AddMeetingForm 
                meetingForm={meetingForm}
                setMeetingForm={setMeetingForm}
                onAddMeeting={handleAddMeeting}
                activityTypesData={activityTypesData}
                activityTypesLoading={activityTypesLoading}
                usersData={usersData}
                usersLoading={usersLoading}
              />

              <div className="p-4">
                {loadingStates.meetings ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-gray-500">Loading meetings...</p>
                    </div>
                  </div>
                ) : errorStates.meetings ? (
                  <div className="text-center py-8 text-red-500">
                    <p>Error loading meetings: {errorStates.meetings}</p>
                  </div>
                ) : (
                  <ActivityRenderer
                    activities={tabData.meetings}
                    formatDate={formatDate}
                    parseNoteContent={parseNoteContent}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="emails" className="h-full mt-4">
            <div className="h-full overflow-y-auto px-4 pb-4">
              {loadingStates.emails ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Loading emails...</p>
                  </div>
                </div>
              ) : errorStates.emails ? (
                <div className="text-center py-8 text-red-500">
                  <p>Error loading emails: {errorStates.emails}</p>
                </div>
              ) : (
                <ActivityRenderer
                  activities={tabData.emails}
                  formatDate={formatDate}
                  parseNoteContent={parseNoteContent}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="h-full mt-4">
            <div className="h-full overflow-y-auto px-4 pb-4">
              {loadingStates.tasks ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Loading tasks...</p>
                  </div>
                </div>
              ) : errorStates.tasks ? (
                <div className="text-center py-8 text-red-500">
                  <p>Error loading tasks: {errorStates.tasks}</p>
                </div>
              ) : (
                <ActivityRenderer
                  activities={tabData.tasks}
                  formatDate={formatDate}
                  parseNoteContent={parseNoteContent}
                />
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ActivityTabs;
