
import React from "react";
import { Phone, Mail, Calendar, FileText, CheckSquare } from "lucide-react";

const ActivityRenderer = ({ activities, formatDate, parseNoteContent }) => {
  // Render activity item based on the API response structure
  const renderActivityItem = (activity, index) => {
    // Handle task items differently since they have a different structure
    if (activity.Name && activity.DueDate && !activity.EventType) {
      // This is a task item
      return (
        <div key={activity.ID || index} className="flex items-start space-x-3 py-3 border-l-2 border-gray-200 pl-4 relative">
          <div className="absolute -left-3 w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center">
            <CheckSquare className="h-3 w-3 text-purple-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-900">
                Task
              </span>
            </div>
            <div className="text-xs text-gray-600 mb-2">
              {formatDate(activity.DueDate)}
            </div>
            <div className="text-sm text-gray-900 mb-1">
              <strong>{activity.Name}</strong>
            </div>
            {activity.Description && (
              <div className="text-sm text-gray-700">
                {activity.Description}
              </div>
            )}
            <div className="text-sm font-medium text-gray-700">
              <strong>Status:</strong> {activity.Completed ? "Completed" : "Pending"}
            </div>
            {activity.StartDate && (
              <div className="text-sm text-gray-600">
                <strong>Start Date:</strong> {formatDate(activity.StartDate)}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Handle regular activity items (existing logic)
    const {
      note,
      answered,
      emailMetadata
    } = parseNoteContent(activity.Note);

    // Determine activity type and styling with pastel colors
    let iconElement, bgColor, eventTypeDisplay;
    
    if (activity.EventType === "Call") {
      iconElement = <Phone className="h-3 w-3 text-orange-600" />;
      bgColor = "bg-orange-200";
      eventTypeDisplay = "Call";
    } else if (activity.EventType === "Meeting") {
      iconElement = <Calendar className="h-3 w-3 text-blue-600" />;
      bgColor = "bg-blue-200";
      eventTypeDisplay = "Meeting";
    } else if (activity.EventType === "Email" || activity.Type === "Email") {
      iconElement = <Mail className="h-3 w-3 text-emerald-600" />;
      bgColor = "bg-emerald-200";
      eventTypeDisplay = "Email";
    } else if (activity.EventType === "Mass Email" || activity.Type === "MassEmail") {
      iconElement = <Mail className="h-3 w-3 text-purple-600" />;
      bgColor = "bg-purple-200";
      eventTypeDisplay = "Mass Email";
    } else {
      iconElement = <FileText className="h-3 w-3 text-rose-600" />;
      bgColor = "bg-rose-200";
      eventTypeDisplay = activity.EventType || "Note";
    }

    return (
      <div key={activity.ID || index} className="flex items-start space-x-3 py-3 border-l-2 border-gray-200 pl-4 relative">
        <div className={`absolute -left-3 w-6 h-6 ${bgColor} rounded-full flex items-center justify-center`}>
          {iconElement}
        </div>
        <div className="flex-1">
          {/* Name/Person with icon at the top */}
          <div className="flex items-center gap-2 mb-1">
            {activity.EventType === "Call" && <Phone className="h-4 w-4 text-orange-600" />}
            <span className="text-sm font-medium text-gray-900">
              {activity.AccountExec || "Tech Support"}
            </span>
          </div>
          
          {/* Date/Time below the name */}
          <div className="text-xs text-gray-600 mb-2">
            {formatDate(activity.DateScheduled || activity.Date)}
          </div>
          
          {/* Display email metadata if it's an email */}
          {(activity.EventType === "Email" || activity.Type === "Email") && emailMetadata.subject && (
            <div className="text-sm text-gray-700 mb-2 space-y-1">
              {emailMetadata.subject && (
                <div><strong>Subject:</strong> {emailMetadata.subject}</div>
              )}
              {emailMetadata.from && (
                <div><strong>From:</strong> {emailMetadata.from}</div>
              )}
              {emailMetadata.to && (
                <div><strong>To:</strong> {emailMetadata.to}</div>
              )}
            </div>
          )}
          
          {/* Main content/note */}
          <div className="text-sm text-gray-900 mb-1">
            {note || eventTypeDisplay || "Activity"}
          </div>
          
          {answered && (
            <div className="text-sm font-medium text-gray-700">
              <strong>Answered:</strong> {answered}
            </div>
          )}
          {activity.Completed && activity.Completed !== "Not Completed" && (
            <div className="text-sm font-medium text-gray-700">
              <strong>Status:</strong> {activity.Completed}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {activities && activities.length > 0 ? (
        activities.map((activity, index) => renderActivityItem(activity, index))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No activities found</p>
        </div>
      )}
    </div>
  );
};

export default ActivityRenderer;
