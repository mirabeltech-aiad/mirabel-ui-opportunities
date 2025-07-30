import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, Mail, Download, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '../../services/reports';
import { useProductFilter } from '../../contexts/ProductFilterContext';
import ScrollToTopButton from '../../components/ui/ScrollToTopButton';
import HelpTooltip from '../../components/shared/HelpTooltip';

const IssueFulfillmentReport = () => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  const [dateRange] = React.useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});

  // Use React Query to fetch real fulfillment data from Supabase
  const { data: fulfillmentData, isLoading, error } = useQuery({
    queryKey: ['issue-fulfillment', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getIssueFulfillmentData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading issue fulfillment report...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading fulfillment data</div>;
  }

  const data = fulfillmentData || {
    totalIssues: 0,
    deliveredIssues: 0,
    pendingIssues: 0,
    failedDeliveries: 0,
    deliveryRate: '0.0',
    fulfillmentDetails: []
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Metrics Cards */}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Total Issues
              <HelpTooltip helpId="fulfillment-total-issues" />
            </CardTitle>
            <Package className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{data.totalIssues.toLocaleString()}</div>
            <p className="text-xs text-gray-600">across all subscriptions</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Delivered
              <HelpTooltip helpId="fulfillment-delivered-issues" />
            </CardTitle>
            <Mail className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">{data.deliveredIssues.toLocaleString()}</div>
            <p className="text-xs text-gray-600">{data.deliveryRate}% delivery rate</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Pending
              <HelpTooltip helpId="fulfillment-pending-issues" />
            </CardTitle>
            <Download className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 mb-1">{data.pendingIssues.toLocaleString()}</div>
            <p className="text-xs text-gray-600">awaiting delivery</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Failed
              <HelpTooltip helpId="fulfillment-failed-deliveries" />
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-1">{data.failedDeliveries.toLocaleString()}</div>
            <p className="text-xs text-gray-600">delivery failures</p>
          </CardContent>
        </Card>
      </div>

      <ScrollToTopButton />
    </div>
  );
};

export default IssueFulfillmentReport;