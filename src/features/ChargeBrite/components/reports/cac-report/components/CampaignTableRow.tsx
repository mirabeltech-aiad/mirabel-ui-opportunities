
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/enhanced-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

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

interface CampaignTableRowProps {
  campaign: CampaignData;
  isSelected: boolean;
  onRowSelect: (campaign: string, checked: boolean) => void;
  onRowClick: (e: React.MouseEvent, campaign: string) => void;
  onRowDoubleClick: (e: React.MouseEvent, campaign: CampaignData) => void;
  onCampaignClick: (e: React.MouseEvent, campaignName: string) => void;
}

const CampaignTableRow: React.FC<CampaignTableRowProps> = ({
  campaign,
  isSelected,
  onRowSelect,
  onRowClick,
  onRowDoubleClick,
  onCampaignClick
}) => {
  const getStatusBadgeVariant = (status: string) => {
    return status === 'Active' ? 'green' : 'outline';
  };

  const getConversionColor = (rate: number) => {
    if (rate >= 40) return 'text-green-600';
    if (rate >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <TableRow 
      className={`cursor-pointer transition-colors duration-200 ${
        isSelected 
          ? 'bg-blue-50 hover:bg-blue-100 border-blue-200' 
          : 'hover:bg-gray-50'
      }`}
      onClick={(e) => onRowClick(e, campaign.campaign)}
      onDoubleClick={(e) => onRowDoubleClick(e, campaign)}
      title="Click to select, double-click to edit"
      tabIndex={0}
      role="row"
      aria-selected={isSelected}
    >
      <TableCell className="w-8">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={(checked) => onRowSelect(campaign.campaign, checked as boolean)}
          onClick={handleCheckboxClick}
          className="focus:ring-ocean-500"
          aria-label={`Select campaign ${campaign.campaign}`}
        />
      </TableCell>
      <TableCell>
        <button
          className="text-left font-medium cursor-pointer hover:text-ocean-600 hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-1 rounded-sm px-1 text-gray-900"
          onClick={(e) => onCampaignClick(e, campaign.campaign)}
          title="Click to view campaign details"
          aria-label={`View details for ${campaign.campaign}`}
        >
          {campaign.campaign}
        </button>
      </TableCell>
      <TableCell>
        <span className="text-gray-900">{campaign.channel}</span>
      </TableCell>
      <TableCell className="text-right">
        <span className="font-medium text-gray-900">${campaign.spend.toLocaleString()}</span>
      </TableCell>
      <TableCell className="text-right">
        <span className="text-gray-900">{campaign.leads.toLocaleString()}</span>
      </TableCell>
      <TableCell className="text-right">
        <span className="font-medium text-blue-600">{campaign.customers.toLocaleString()}</span>
      </TableCell>
      <TableCell className="text-right">
        <span className="text-gray-900">${campaign.costPerLead.toFixed(2)}</span>
      </TableCell>
      <TableCell className="text-right">
        <span className="font-bold text-blue-600">${campaign.costPerCustomer.toFixed(2)}</span>
      </TableCell>
      <TableCell className="text-center">
        <span className={`font-medium ${getConversionColor(campaign.conversionRate)}`}>
          {campaign.conversionRate}%
        </span>
      </TableCell>
      <TableCell className="text-center">
        <Badge variant={getStatusBadgeVariant(campaign.status)}>
          {campaign.status}
        </Badge>
      </TableCell>
    </TableRow>
  );
};

export default CampaignTableRow;
