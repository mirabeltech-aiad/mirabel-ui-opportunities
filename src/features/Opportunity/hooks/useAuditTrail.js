
import React, { useState, useCallback } from 'react';
import { createAuditEntry } from '@/features/Opportunity/utils/auditTrail';

/**
 * Custom hook for managing audit trail functionality
 * 
 * Provides functionality to track changes to opportunity fields and maintain
 * a chronological history of modifications for compliance and debugging purposes.
 * 
 * @param {string|number} opportunityId - Unique identifier for the opportunity being tracked
 * 
 * @returns {Object} Audit trail state and functions
 * @returns {Array} auditEntries - Array of audit log entries, newest first
 * @returns {Function} trackChange - Function to record a field change
 * 
 * @example
 * const { auditEntries, trackChange } = useAuditTrail(opportunityId);
 * 
 * // Track a field change
 * trackChange('stage', '1st Demo', 'Discovery', 'Courtney Karp');
 * 
 * // Display audit entries
 * auditEntries.map(entry => <AuditEntryComponent key={entry.id} entry={entry} />)
 */
export const useAuditTrail = (opportunityId) => {
  /**
   * Mock audit entries for demonstration
   * In production, this would be fetched from the backend API
   * based on the opportunityId parameter
   */
  const [auditEntries, setAuditEntries] = useState([
    {
      id: 1,
      timestamp: '2024-01-20T10:30:00Z',
      field: 'created',
      oldValue: null,
      newValue: 'Opportunity created',
      userId: 'Michael Scott',
      type: 'system' // Types: 'system', 'field', 'status', 'financial'
    },
    {
      id: 2,
      timestamp: '2024-01-21T14:15:00Z',
      field: 'stage',
      oldValue: '1st Demo',
      newValue: 'Discovery',
      userId: 'Courtney Karp',
      type: 'status'
    },
    {
      id: 3,
      timestamp: '2024-01-22T09:45:00Z',
      field: 'amount',
      oldValue: '$25,000',
      newValue: '$50,000',
      userId: 'Courtney Karp',
      type: 'field'
    }
  ]);

  /**
   * Track a field change and add it to the audit trail
   * 
   * Only records changes when the old and new values are actually different
   * to avoid cluttering the audit log with unnecessary entries.
   * 
   * @param {string} field - Name of the field that changed
   * @param {any} oldValue - Previous value of the field
   * @param {any} newValue - New value of the field
   * @param {string} userId - ID or name of the user making the change
   * 
   * @example
   * trackChange('stage', '1st Demo', 'Discovery', 'john.doe@company.com');
   * trackChange('amount', 25000, 50000, 'sales.manager@company.com');
   */
  const trackChange = useCallback((field, oldValue, newValue, userId) => {
    // Only track actual changes to prevent noise in audit log
    if (oldValue !== newValue) {
      const entry = createAuditEntry(field, oldValue, newValue, userId);
      
      // Add new entry at the beginning for chronological order (newest first)
      setAuditEntries(prev => [entry, ...prev]);
      
      // In production, this would also send the audit entry to the backend
      // await saveAuditEntry(opportunityId, entry);
    }
  }, []);

  return {
    auditEntries,
    trackChange
  };
};
