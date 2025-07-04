
import React, { useState, useEffect } from "react";
import { Clock, User, ArrowRight, Plus, Edit, UserCheck } from "lucide-react";
import { getFieldDisplayName, formatValue } from "../../utils/auditTrail";
import apiService from "../../services/apiService";

const AuditTrailSection = ({ auditEntries, opportunityId }) => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunityHistory = async () => {
      if (!opportunityId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('AuditTrailSection: Fetching history for opportunity ID:', opportunityId);
        const response = await apiService.getOpportunityHistory(opportunityId);
        console.log('AuditTrailSection: History response:', response);
        
        if (response && response.content && response.content.Data && response.content.Data.Audit) {
          const auditData = response.content.Data.Audit;
          console.log('AuditTrailSection: Processing audit data:', auditData);
          
          // Transform API data to match our component format
          const transformedData = auditData.map((item, index) => ({
            id: `history-${index}`,
            timestamp: item.UpdatedOn,
            field: item.FieldName.toLowerCase().replace(/\s+/g, ''),
            oldValue: item.FieldValueOld,
            newValue: item.FieldValueNew,
            userId: item.UpdatedBy,
            type: getChangeTypeFromField(item.FieldName)
          }));
          
          setHistoryData(transformedData);
        } else {
          console.log('AuditTrailSection: No audit data found in response');
          setHistoryData([]);
        }
      } catch (error) {
        console.error('AuditTrailSection: Failed to fetch opportunity history:', error);
        setError('Failed to load opportunity history');
        setHistoryData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunityHistory();
  }, [opportunityId]);

  const getChangeTypeFromField = (fieldName) => {
    const statusFields = ['Stage', 'Status'];
    const assignmentFields = ['Assigned To', 'AssignedTo'];
    
    if (statusFields.some(field => fieldName.includes(field))) return 'status';
    if (assignmentFields.some(field => fieldName.includes(field))) return 'assignment';
    return 'field';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'status':
        return <ArrowRight className="h-4 w-4" />;
      case 'assignment':
        return <UserCheck className="h-4 w-4" />;
      case 'system':
        return <Plus className="h-4 w-4" />;
      default:
        return <Edit className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'status':
        return 'border-green-500 bg-green-50';
      case 'assignment':
        return 'border-purple-500 bg-purple-50';
      case 'system':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-yellow-500 bg-yellow-50';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderChangeDescription = (entry) => {
    if (entry.field === 'created') {
      return <span className="font-medium">{entry.newValue}</span>;
    }

    const fieldName = entry.field === 'assignedto' ? 'Assigned To' : 
                     entry.field === 'projectedclosedate' ? 'Projected Close Date' :
                     entry.field === 'name' ? 'Opportunity Name' :
                     getFieldDisplayName(entry.field);
    
    const oldVal = entry.oldValue || '(empty)';
    const newVal = entry.newValue || '(empty)';

    return (
      <span>
        <span className="font-medium">{fieldName}</span> changed from{' '}
        <span className="font-medium text-red-600">{oldVal}</span> to{' '}
        <span className="font-medium text-green-600">{newVal}</span>
      </span>
    );
  };

  // Combine API data with existing audit entries
  const allEntries = [...historyData, ...(auditEntries || [])].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
        <span className="text-gray-500">Loading opportunity history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <Clock className="h-12 w-12 mx-auto mb-4 text-red-300" />
        <p>{error}</p>
      </div>
    );
  }

  if (!allEntries || allEntries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No audit trail entries found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {allEntries.map((entry) => (
        <div
          key={entry.id}
          className={`border-l-4 pl-4 py-3 rounded-r ${getTypeColor(entry.type)}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {getTypeIcon(entry.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-900">
                {renderChangeDescription(entry)}
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTimestamp(entry.timestamp)}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {entry.userId}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuditTrailSection;
