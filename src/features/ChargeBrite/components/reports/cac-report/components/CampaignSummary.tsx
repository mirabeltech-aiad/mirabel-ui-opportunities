
import React from 'react';

interface CampaignData {
  campaign: string;
  channel: string;
  spend: number;
  leads: number;
  customers: number;
  costPerLead: number;
  costPerCustomer: number;
  conversionRate: number;
  status: string;
}

interface CampaignSummaryProps {
  campaigns: CampaignData[];
}

const CampaignSummary: React.FC<CampaignSummaryProps> = ({ campaigns }) => {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Total Campaigns:</span>
          <span className="ml-2 font-semibold text-blue-600">{campaigns.length}</span>
        </div>
        <div>
          <span className="text-gray-600">Total Spend:</span>
          <span className="ml-2 font-semibold text-blue-600">
            ${campaigns.reduce((sum, campaign) => sum + campaign.spend, 0).toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Total Customers:</span>
          <span className="ml-2 font-semibold text-blue-600">
            {campaigns.reduce((sum, campaign) => sum + campaign.customers, 0).toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Average Conversion:</span>
          <span className="ml-2 font-semibold text-blue-600">
            {(campaigns.reduce((sum, campaign) => sum + campaign.conversionRate, 0) / campaigns.length).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default CampaignSummary;
