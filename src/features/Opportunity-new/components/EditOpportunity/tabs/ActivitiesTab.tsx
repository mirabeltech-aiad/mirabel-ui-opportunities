import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, MessageSquare } from 'lucide-react';
import axiosService from '@/services/axiosService.js';

interface ActivitiesTabProps {
  opportunityId?: string;
}

interface Activity {
  ID: number;
  Type: string;
  Description: string;
  User: string;
  Date: string;
  Time: string;
  Details: string;
}

interface AuditEntry {
  ID: number;
  Field: string;
  OldValue: string;
  NewValue: string;
  ChangedBy: string;
  ChangedDate: string;
  Action: string;
}

const ActivitiesTab: React.FC<ActivitiesTabProps> = ({
  opportunityId
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'timeline' | 'audit'>('timeline');

  // Load activities and audit trail
  const loadData = async () => {
    if (!opportunityId) return;

    setIsLoading(true);
    try {
      // Load activities (timeline)
      const activitiesResponse = await axiosService.get(`/services/Opportunities/Activities/${opportunityId}`);
      if (activitiesResponse?.content && Array.isArray(activitiesResponse.content)) {
        setActivities(activitiesResponse.content);
      }

      // Load audit trail
      const auditResponse = await axiosService.get(`/services/Opportunities/History/${opportunityId}/10/1`);
      if (auditResponse?.content && Array.isArray(auditResponse.content)) {
        setAuditTrail(auditResponse.content);
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [opportunityId]);

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'call': return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'email': return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'meeting': return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'note': return <MessageSquare className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getChangeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created': return 'text-green-600 bg-green-100';
      case 'updated': return 'text-blue-600 bg-blue-100';
      case 'deleted': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Toggle */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveSection('timeline')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeSection === 'timeline'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Timeline
        </button>
        <button
          onClick={() => setActiveSection('audit')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeSection === 'audit'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Audit Trail
        </button>
      </div>

      {/* Timeline Section */}
      {activeSection === 'timeline' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
            <p className="text-sm text-gray-600 mt-1">
              Chronological view of all activities related to this opportunity
            </p>
          </div>

          {activities.length > 0 ? (
            <div className="p-6">
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={activity.ID} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.Type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.Type}: {activity.Description}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.Date).toLocaleDateString()} {activity.Time}
                        </span>
                      </div>
                      
                      {activity.Details && (
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.Details}
                        </p>
                      )}
                      
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        <span>{activity.User}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No activities recorded yet.</p>
              <p className="text-sm mt-1">Activities will appear here as they are logged.</p>
            </div>
          )}
        </div>
      )}

      {/* Audit Trail Section */}
      {activeSection === 'audit' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Audit Trail</h3>
            <p className="text-sm text-gray-600 mt-1">
              Complete history of changes made to this opportunity
            </p>
          </div>

          {auditTrail.length > 0 ? (
            <div className="p-6">
              <div className="space-y-4">
                {auditTrail.map((entry, index) => (
                  <div key={entry.ID} className="border-l-2 border-gray-200 pl-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getChangeColor(entry.Action)}`}>
                          {entry.Action}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {entry.Field}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(entry.ChangedDate).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      {entry.OldValue && entry.NewValue ? (
                        <div>
                          <span className="text-red-600">From: {entry.OldValue}</span>
                          <br />
                          <span className="text-green-600">To: {entry.NewValue}</span>
                        </div>
                      ) : entry.NewValue ? (
                        <span className="text-green-600">Set to: {entry.NewValue}</span>
                      ) : (
                        <span className="text-gray-500">Field cleared</span>
                      )}
                    </div>
                    
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <User className="h-3 w-3 mr-1" />
                      <span>Changed by {entry.ChangedBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No audit trail available.</p>
              <p className="text-sm mt-1">Changes will be tracked here once the opportunity is saved.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivitiesTab;