
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@OpportunityComponents/ui/card";
import { Badge } from "@OpportunityComponents/ui/badge";
import { Button } from "@OpportunityComponents/ui/button";
import { 
  Calendar, 
  Phone, 
  Mail, 
  FileText, 
  Users, 
  CheckSquare,
  TrendingUp,
  Plus,
  ArrowRight,
  Filter
} from "lucide-react";
import apiService from "../../services/apiService";

const TimelineSection = ({ opportunityId }) => {
  const [filter, setFilter] = useState("all");
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimelineData = async () => {
      if (!opportunityId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('TimelineSection: Fetching timeline data for opportunity ID:', opportunityId);
        
        // Get opportunity details to extract contact ID
        const opportunityResponse = await apiService.getOpportunityDetails(opportunityId);
        console.log('TimelineSection: Opportunity response:', opportunityResponse);
        
        let contactId = null;
        if (opportunityResponse && opportunityResponse.content && opportunityResponse.content.Data) {
          contactId = opportunityResponse.content.Data.ContactID;
        }
        
        const allEvents = [];
        
        // Fetch opportunity history (audit trail)
        try {
          const historyResponse = await apiService.getOpportunityHistory(opportunityId);
          if (historyResponse && historyResponse.content && historyResponse.content.Data && historyResponse.content.Data.Audit) {
            const auditEvents = historyResponse.content.Data.Audit.map((item, index) => ({
              id: `audit-${index}`,
              date: item.UpdatedOn,
              type: getEventTypeFromField(item.FieldName),
              title: getEventTitle(item.FieldName),
              description: `${item.FieldName} changed from "${item.FieldValueOld}" to "${item.FieldValueNew}"`,
              user: item.UpdatedBy,
              icon: getEventIcon(getEventTypeFromField(item.FieldName)),
              color: getEventColor(getEventTypeFromField(item.FieldName)),
              bgColor: getEventBgColor(getEventTypeFromField(item.FieldName)),
              borderColor: getEventBorderColor(getEventTypeFromField(item.FieldName))
            }));
            allEvents.push(...auditEvents);
          }
        } catch (historyError) {
          console.error('TimelineSection: Failed to fetch history:', historyError);
        }
        
        // If we have a contact ID, fetch activities
        if (contactId) {
          try {
            // Fetch call activities
            const callResponse = await apiService.getCallActivities(contactId);
            if (callResponse && callResponse.content && callResponse.content.Data) {
              const callEvents = callResponse.content.Data.map((item, index) => ({
                id: `call-${index}`,
                date: item.ActivityDate,
                type: "call",
                title: "Call Activity",
                description: item.ActivityDesc || item.Description || "Call activity recorded",
                user: item.CreatedBy || item.UserName || "Unknown",
                icon: Phone,
                color: "text-orange-600",
                bgColor: "bg-orange-50",
                borderColor: "border-orange-200"
              }));
              allEvents.push(...callEvents);
            }
          } catch (callError) {
            console.error('TimelineSection: Failed to fetch call activities:', callError);
          }
          
          try {
            // Fetch email activities
            const emailResponse = await apiService.getEmailActivities(contactId);
            if (emailResponse && emailResponse.content && emailResponse.content.Data) {
              const emailEvents = emailResponse.content.Data.map((item, index) => ({
                id: `email-${index}`,
                date: item.ActivityDate,
                type: "email",
                title: "Email Activity",
                description: item.ActivityDesc || item.Description || "Email activity recorded",
                user: item.CreatedBy || item.UserName || "Unknown",
                icon: Mail,
                color: "text-green-600",
                bgColor: "bg-green-50",
                borderColor: "border-green-200"
              }));
              allEvents.push(...emailEvents);
            }
          } catch (emailError) {
            console.error('TimelineSection: Failed to fetch email activities:', emailError);
          }
          
          try {
            // Fetch meeting activities
            const meetingResponse = await apiService.getMeetingActivities(contactId);
            if (meetingResponse && meetingResponse.content && meetingResponse.content.Data) {
              const meetingEvents = meetingResponse.content.Data.map((item, index) => ({
                id: `meeting-${index}`,
                date: item.ActivityDate,
                type: "meeting",
                title: "Meeting Activity",
                description: item.ActivityDesc || item.Description || "Meeting activity recorded",
                user: item.CreatedBy || item.UserName || "Unknown",
                icon: Users,
                color: "text-indigo-600",
                bgColor: "bg-indigo-50",
                borderColor: "border-indigo-200"
              }));
              allEvents.push(...meetingEvents);
            }
          } catch (meetingError) {
            console.error('TimelineSection: Failed to fetch meeting activities:', meetingError);
          }
        }
        
        // Sort all events by date (newest first)
        const sortedEvents = allEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTimelineEvents(sortedEvents);
        
        console.log('TimelineSection: Final timeline events:', sortedEvents);
        
      } catch (error) {
        console.error('TimelineSection: Failed to fetch timeline data:', error);
        setError('Failed to load timeline data');
        setTimelineEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimelineData();
  }, [opportunityId]);

  const getEventTypeFromField = (fieldName) => {
    const stageFields = ['Stage', 'Status'];
    const assignmentFields = ['Assigned To', 'AssignedTo'];
    const financialFields = ['Amount', 'Probability'];
    
    if (stageFields.some(field => fieldName.includes(field))) return 'stage';
    if (assignmentFields.some(field => fieldName.includes(field))) return 'assignment';
    if (financialFields.some(field => fieldName.includes(field))) return 'financial';
    return 'system';
  };

  const getEventTitle = (fieldName) => {
    const titleMap = {
      'Stage': 'Stage Changed',
      'Status': 'Status Updated',
      'Assigned To': 'Assignment Changed',
      'AssignedTo': 'Assignment Changed',
      'Amount': 'Amount Updated',
      'Probability': 'Probability Updated',
      'Name': 'Opportunity Renamed',
      'Projected Close Date': 'Close Date Updated'
    };
    return titleMap[fieldName] || `${fieldName} Updated`;
  };

  const getEventIcon = (type) => {
    const iconMap = {
      'stage': ArrowRight,
      'assignment': Users,
      'financial': TrendingUp,
      'system': Plus,
      'call': Phone,
      'email': Mail,
      'meeting': Users,
      'note': FileText,
      'task': CheckSquare
    };
    return iconMap[type] || FileText;
  };

  const getEventColor = (type) => {
    const colorMap = {
      'stage': 'text-purple-600',
      'assignment': 'text-blue-600',
      'financial': 'text-emerald-600',
      'system': 'text-gray-600',
      'call': 'text-orange-600',
      'email': 'text-green-600',
      'meeting': 'text-indigo-600',
      'note': 'text-yellow-600',
      'task': 'text-red-600'
    };
    return colorMap[type] || 'text-gray-600';
  };

  const getEventBgColor = (type) => {
    const bgColorMap = {
      'stage': 'bg-purple-50',
      'assignment': 'bg-blue-50',
      'financial': 'bg-emerald-50',
      'system': 'bg-gray-50',
      'call': 'bg-orange-50',
      'email': 'bg-green-50',
      'meeting': 'bg-indigo-50',
      'note': 'bg-yellow-50',
      'task': 'bg-red-50'
    };
    return bgColorMap[type] || 'bg-gray-50';
  };

  const getEventBorderColor = (type) => {
    const borderColorMap = {
      'stage': 'border-purple-200',
      'assignment': 'border-blue-200',
      'financial': 'border-emerald-200',
      'system': 'border-gray-200',
      'call': 'border-orange-200',
      'email': 'border-green-200',
      'meeting': 'border-indigo-200',
      'note': 'border-yellow-200',
      'task': 'border-red-200'
    };
    return borderColorMap[type] || 'border-gray-200';
  };

  const getMonthYear = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getFilteredEvents = () => {
    if (filter === "all") return timelineEvents;
    return timelineEvents.filter(event => event.type === filter);
  };

  const groupEventsByMonth = (events) => {
    const grouped = {};
    events.forEach(event => {
      const monthYear = getMonthYear(event.date);
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(event);
    });
    return grouped;
  };

  const filteredEvents = getFilteredEvents();
  const groupedEvents = groupEventsByMonth(filteredEvents);

  const filterOptions = [
    { value: "all", label: "All Events", count: timelineEvents.length },
    { value: "system", label: "System", count: timelineEvents.filter(e => e.type === "system").length },
    { value: "call", label: "Calls", count: timelineEvents.filter(e => e.type === "call").length },
    { value: "email", label: "Emails", count: timelineEvents.filter(e => e.type === "email").length },
    { value: "meeting", label: "Meetings", count: timelineEvents.filter(e => e.type === "meeting").length },
    { value: "stage", label: "Stage Changes", count: timelineEvents.filter(e => e.type === "stage").length },
    { value: "financial", label: "Financial", count: timelineEvents.filter(e => e.type === "financial").length },
    { value: "assignment", label: "Assignments", count: timelineEvents.filter(e => e.type === "assignment").length }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
        <span className="text-gray-500">Loading timeline data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-red-300" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Opportunity Timeline</h3>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative">
        {Object.entries(groupedEvents).map(([monthYear, events], monthIndex) => (
          <div key={monthYear} className="mb-8">
            {/* Month Header */}
            <div className="flex items-center mb-4">
              <div className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {monthYear}
              </div>
              <div className="flex-1 h-px bg-gray-300 ml-4"></div>
            </div>

            {/* Events for this month */}
            <div className="space-y-4 ml-4">
              {events.map((event, eventIndex) => {
                const Icon = event.icon;
                const isLastInMonth = eventIndex === events.length - 1;
                const isLastMonth = monthIndex === Object.entries(groupedEvents).length - 1;
                
                return (
                  <div key={event.id} className="relative flex items-start">
                    {/* Timeline line */}
                    {!(isLastInMonth && isLastMonth) && (
                      <div className="absolute left-6 top-8 bottom-0 w-px bg-gray-300"></div>
                    )}
                    
                    {/* Event icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${event.bgColor} ${event.borderColor} border-2 flex items-center justify-center z-10`}>
                      <Icon className={`h-5 w-5 ${event.color}`} />
                    </div>
                    
                    {/* Event content */}
                    <div className="flex-1 ml-4 min-w-0">
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900">{event.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {event.type}
                                </Badge>
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(event.date)}
                                </div>
                                <div>{event.user}</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No timeline events found.</p>
          <p className="text-sm">Events will appear here as the opportunity progresses.</p>
        </div>
      )}
    </div>
  );
};

export default TimelineSection;
