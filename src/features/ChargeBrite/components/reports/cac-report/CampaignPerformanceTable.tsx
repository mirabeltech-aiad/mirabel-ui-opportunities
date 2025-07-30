
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, Target } from 'lucide-react';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface Campaign {
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

interface CampaignPerformanceTableProps {
  campaigns: Campaign[];
}

const CampaignPerformanceTable: React.FC<CampaignPerformanceTableProps> = ({ campaigns }) => {
  const [sortField, setSortField] = useState<keyof Campaign>('costPerCustomer');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Campaign) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue);
    }
    
    return sortDirection === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const SortIcon = ({ field }: { field: keyof Campaign }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <Card size="large" className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-ocean-800 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Campaign Performance Analysis
          </CardTitle>
          <HelpTooltip helpId="campaign-performance-table" />
        </div>
        <CardDescription>
          Detailed breakdown of individual marketing campaign effectiveness and ROI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead 
                className="h-11 py-2.5 px-4 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('campaign')}
              >
                <div className="flex items-center">
                  Campaign Name
                  <SortIcon field="campaign" />
                </div>
              </TableHead>
              <TableHead 
                className="h-11 py-2.5 px-4 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('channel')}
              >
                <div className="flex items-center">
                  Channel
                  <SortIcon field="channel" />
                </div>
              </TableHead>
              <TableHead 
                className="h-11 py-2.5 px-4 text-right cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('spend')}
              >
                <div className="flex items-center justify-end">
                  Total Spend
                  <SortIcon field="spend" />
                </div>
              </TableHead>
              <TableHead 
                className="h-11 py-2.5 px-4 text-right cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('leads')}
              >
                <div className="flex items-center justify-end">
                  Leads
                  <SortIcon field="leads" />
                </div>
              </TableHead>
              <TableHead 
                className="h-11 py-2.5 px-4 text-right cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('customers')}
              >
                <div className="flex items-center justify-end">
                  Customers
                  <SortIcon field="customers" />
                </div>
              </TableHead>
              <TableHead 
                className="h-11 py-2.5 px-4 text-right cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('costPerLead')}
              >
                <div className="flex items-center justify-end">
                  Cost/Lead
                  <SortIcon field="costPerLead" />
                </div>
              </TableHead>
              <TableHead 
                className="h-11 py-2.5 px-4 text-right cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('costPerCustomer')}
              >
                <div className="flex items-center justify-end">
                  Cost/Customer
                  <SortIcon field="costPerCustomer" />
                </div>
              </TableHead>
              <TableHead 
                className="h-11 py-2.5 px-4 text-right cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('conversionRate')}
              >
                <div className="flex items-center justify-end">
                  Conversion Rate
                  <SortIcon field="conversionRate" />
                </div>
              </TableHead>
              <TableHead className="h-11 py-2.5 px-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCampaigns.map((campaign, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="py-2.5 px-4 font-medium">
                  {campaign.campaign}
                </TableCell>
                <TableCell className="py-2.5 px-4">
                  <Badge variant="outline" className="text-xs">
                    {campaign.channel}
                  </Badge>
                </TableCell>
                <TableCell className="py-2.5 px-4 text-right font-mono">
                  ${campaign.spend.toLocaleString()}
                </TableCell>
                <TableCell className="py-2.5 px-4 text-right">
                  {campaign.leads.toLocaleString()}
                </TableCell>
                <TableCell className="py-2.5 px-4 text-right">
                  {campaign.customers.toLocaleString()}
                </TableCell>
                <TableCell className="py-2.5 px-4 text-right font-mono">
                  ${campaign.costPerLead.toFixed(2)}
                </TableCell>
                <TableCell className="py-2.5 px-4 text-right font-mono">
                  ${campaign.costPerCustomer.toFixed(2)}
                </TableCell>
                <TableCell className="py-2.5 px-4 text-right">
                  {campaign.conversionRate.toFixed(1)}%
                </TableCell>
                <TableCell className="py-2.5 px-4">
                  <Badge 
                    variant={campaign.status === 'Active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {campaign.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CampaignPerformanceTable;
