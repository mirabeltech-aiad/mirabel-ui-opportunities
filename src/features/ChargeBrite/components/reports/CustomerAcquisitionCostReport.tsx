
import React from 'react';
import AverageCACCard from './cac-report/AverageCACCard';
import CACByChannelChart from './cac-report/CACByChannelChart';
import CampaignPerformanceTable from './cac-report/CampaignPerformanceTable';
import { HelpTooltip } from '@/components';

interface CustomerAcquisitionCostReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
}

const CustomerAcquisitionCostReport: React.FC<CustomerAcquisitionCostReportProps> = ({ dateRange }) => {
  // Average CAC data
  const averageCAC = 42.50;

  // CAC by channel data
  const cacByChannelData = [
    { channel: 'Social Media', cac: 38.50, customers: 2450 },
    { channel: 'Search Engine', cac: 45.20, customers: 1980 },
    { channel: 'Email Marketing', cac: 28.75, customers: 1650 },
    { channel: 'Direct Mail', cac: 65.80, customers: 890 },
    { channel: 'Referral Program', cac: 22.30, customers: 780 },
    { channel: 'Content Marketing', cac: 52.40, customers: 620 }
  ];

  // Campaign performance data
  const campaignData = [
    {
      campaign: 'Holiday Social Campaign',
      channel: 'Social Media',
      spend: 15680,
      leads: 1240,
      customers: 465,
      costPerLead: 12.65,
      costPerCustomer: 33.72,
      conversionRate: 37.5,
      status: 'Active'
    },
    {
      campaign: 'Search Brand Keywords',
      channel: 'Search Engine',
      spend: 22450,
      leads: 890,
      customers: 320,
      costPerLead: 25.22,
      costPerCustomer: 70.16,
      conversionRate: 35.9,
      status: 'Active'
    },
    {
      campaign: 'Newsletter Signup Promo',
      channel: 'Email Marketing',
      spend: 8920,
      leads: 2180,
      customers: 785,
      costPerLead: 4.09,
      costPerCustomer: 11.36,
      conversionRate: 36.0,
      status: 'Active'
    },
    {
      campaign: 'Direct Mail Premium',
      channel: 'Direct Mail',
      spend: 18750,
      leads: 420,
      customers: 125,
      costPerLead: 44.64,
      costPerCustomer: 150.00,
      conversionRate: 29.8,
      status: 'Completed'
    },
    {
      campaign: 'Friend Referral Bonus',
      channel: 'Referral Program',
      spend: 5200,
      leads: 680,
      customers: 290,
      costPerLead: 7.65,
      costPerCustomer: 17.93,
      conversionRate: 42.6,
      status: 'Active'
    },
    {
      campaign: 'Blog Content Series',
      channel: 'Content Marketing',
      spend: 12350,
      leads: 580,
      customers: 185,
      costPerLead: 21.29,
      costPerCustomer: 66.76,
      conversionRate: 31.9,
      status: 'Active'
    },
    {
      campaign: 'Video Ad Campaign',
      channel: 'Social Media',
      spend: 9850,
      leads: 750,
      customers: 220,
      costPerLead: 13.13,
      costPerCustomer: 44.77,
      conversionRate: 29.3,
      status: 'Active'
    },
    {
      campaign: 'Google Shopping Ads',
      channel: 'Search Engine',
      spend: 16240,
      leads: 640,
      customers: 210,
      costPerLead: 25.38,
      costPerCustomer: 77.33,
      conversionRate: 32.8,
      status: 'Active'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Metrics Cards */}
      <AverageCACCard averageCAC={averageCAC} />
      <CACByChannelChart data={cacByChannelData} />
      <CampaignPerformanceTable campaigns={campaignData} />
    </div>
  );
};

export default CustomerAcquisitionCostReport;
