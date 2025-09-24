import React from 'react';
import TimelineSection from '../shared/TimelineSection';
import AuditTrailSection from '../shared/AuditTrailSection';

interface ActivitiesTabProps {

  opportunityId?: string;
}

const ActivitiesTab: React.FC<ActivitiesTabProps> = ({

  opportunityId
}) => {
  // Don't render if no opportunity ID is provided
  if (!opportunityId) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Activities will be available after the opportunity is saved.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TimelineSection opportunityId={opportunityId} />
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Audit Trail</h3>
        <AuditTrailSection opportunityId={opportunityId} />
      </div>
    </div>
  );
};

export default ActivitiesTab;