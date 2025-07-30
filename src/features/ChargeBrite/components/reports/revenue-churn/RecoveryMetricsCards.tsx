
import React from 'react';

interface RecoveryMetricsCardsProps {
  recoveryOpportunity: number;
  successfulRecoveries: number;
  investmentROI: number;
}

const RecoveryMetricsCards: React.FC<RecoveryMetricsCardsProps> = ({
  recoveryOpportunity,
  successfulRecoveries,
  investmentROI
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <div className="text-2xl font-bold text-green-600">
          ${recoveryOpportunity.toLocaleString()}
        </div>
        <div className="text-sm text-green-600">Potential Recovery</div>
      </div>
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">
          {successfulRecoveries}
        </div>
        <div className="text-sm text-blue-600">Active Campaigns</div>
      </div>
      <div className="text-center p-4 bg-purple-50 rounded-lg">
        <div className="text-2xl font-bold text-purple-600">
          ${investmentROI.toLocaleString()}
        </div>
        <div className="text-sm text-purple-600">Investment ROI</div>
      </div>
    </div>
  );
};

export default RecoveryMetricsCards;
