
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Award, TrendingUp, Crown, Search, Filter, Eye, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '../../services/reports';
import { useProductFilter } from '../../contexts/ProductFilterContext';
import { HelpTooltip } from '../../components';
import { useTableColumnManager } from '../../hooks/useTableColumnManager';
import { useSorting } from '../../hooks/useSorting';
import { getDataTypeFromColumn } from '../../utils/sortingUtils';

interface ComplimentarySubscriptionsReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}

const ComplimentarySubscriptionsReport: React.FC<ComplimentarySubscriptionsReportProps> = ({ dateRange, selectedPeriod }) => {
  // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL LOGIC
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQualificationType, setSelectedQualificationType] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedEngagementLevel, setSelectedEngagementLevel] = useState('all');

  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Use React Query to fetch real complimentary subscription data from Supabase
  const { data: complimentaryData, isLoading, error } = useQuery({
    queryKey: ['complimentary-subscriptions', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getComplimentarySubscriptionsData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'subscriberName', label: 'Subscriber', sortable: true, resizable: true },
    { id: 'company', label: 'Company', sortable: true, resizable: true },
    { id: 'qualificationType', label: 'Qualification', sortable: true, resizable: true },
    { id: 'subscriptionSource', label: 'Source', sortable: true, resizable: true },
    { id: 'engagementLevel', label: 'Engagement', sortable: true, resizable: true },
    { id: 'startDate', label: 'Start Date', sortable: true, resizable: true },
    { id: 'lastActivity', label: 'Last Activity', sortable: true, resizable: true },
    { id: 'subscriptionType', label: 'Type', sortable: true, resizable: true }
  ];

  // Initialize table column management
  const {
    columnOrder,
    draggedColumn,
    columnWidths,
    handleColumnResize,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  } = useTableColumnManager({
    columns: tableColumns,
    storageKey: 'complimentary-subscriptions-columns'
  });

  // Extract data with fallbacks to prevent undefined errors
  const {
    totalComplimentary = 0,
    bpaQualified = 0,
    highEngagement = 0,
    avgEngagementScore = 0,
    qualificationTypeData = [],
    engagementLevelData = [],
    complimentarySubscriptions = []
  } = complimentaryData || {};

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: complimentarySubscriptions,
    initialSort: { key: 'startDate', direction: 'desc', dataType: 'date' }
  });

  // NOW we can do conditional rendering - AFTER all hooks have been called
  if (isLoading) {
    return <div className="animate-fade-in">Loading complimentary subscriptions data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading complimentary subscriptions data</div>;
  }

  // Handle sorting
  const handleSort = (columnKey: string) => {
    const dataType = getDataTypeFromColumn(columnKey);
    requestSort(columnKey, dataType);
  };

  // Handle column resizing
  const startResizing = (e: React.MouseEvent, columnId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.pageX;
    const currentWidth = columnWidths[columnId] || 150;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const width = Math.max(80, currentWidth + (moveEvent.pageX - startX));
      handleColumnResize(columnId, width);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Override mock data with real data
  const overallMetrics = {
    totalComplimentary,
    bpaQualified,
    highEngagement,
    avgEngagementScore
  };

  // Filter data
  const filteredData = sortedData.filter(subscription => {
    const matchesSearch = subscription.subscriberName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         subscription.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         subscription.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         subscription.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQualification = selectedQualificationType === 'all' || subscription.qualificationType === selectedQualificationType;
    const matchesSource = selectedSource === 'all' || subscription.subscriptionSource === selectedSource;
    const matchesEngagement = selectedEngagementLevel === 'all' || subscription.engagementLevel === selectedEngagementLevel;
    return matchesSearch && matchesQualification && matchesSource && matchesEngagement;
  });

  const getQualificationBadge = (type: string) => {
    switch (type) {
      case 'BPA Qualified':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">BPA Qualified</Badge>;
      case 'Industry VIP':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Industry VIP</Badge>;
      case 'Academic':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Academic</Badge>;
      case 'Media Exchange':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Media Exchange</Badge>;
      case 'Research Institution':
        return <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">Research Institution</Badge>;
      case 'Government Official':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Government Official</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getEngagementBadge = (level: string) => {
    switch (level) {
      case 'Very High':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Very High</Badge>;
      case 'High':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">High</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Low</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const renderCellContent = (subscription: any, columnId: string) => {
    switch (columnId) {
      case 'subscriberName':
        return (
          <div>
            <div className="font-medium">{subscription.subscriberName}</div>
            <div className="text-sm text-gray-500">{subscription.email}</div>
          </div>
        );
      case 'company':
        return subscription.company;
      case 'qualificationType':
        return getQualificationBadge(subscription.qualificationType);
      case 'subscriptionSource':
        return subscription.subscriptionSource;
      case 'engagementLevel':
        return getEngagementBadge(subscription.engagementLevel);
      case 'startDate':
        return new Date(subscription.startDate).toLocaleDateString();
      case 'lastActivity':
        return subscription.lastActivity ? new Date(subscription.lastActivity).toLocaleDateString() : 'N/A';
      case 'subscriptionType':
        return subscription.subscriptionType;
      default:
        return '';
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Total Complimentary
              <HelpTooltip helpId="complimentary-total-subscriptions" />
            </CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{overallMetrics.totalComplimentary}</div>
            <p className="text-xs text-gray-600">active subscriptions</p>
          </CardContent>
        </Card>
        
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              BPA Qualified
              <HelpTooltip helpId="complimentary-bpa-qualified" />
            </CardTitle>
            <Award className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">{overallMetrics.bpaQualified}</div>
            <p className="text-xs text-gray-600">verified professionals</p>
          </CardContent>
        </Card>
        
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              High Engagement
              <HelpTooltip helpId="complimentary-high-engagement" />
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">{overallMetrics.highEngagement}</div>
            <p className="text-xs text-gray-600">highly active users</p>
          </CardContent>
        </Card>
        
        <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Avg. Engagement Score
              <HelpTooltip helpId="complimentary-avg-engagement" />
            </CardTitle>
            <Crown className="h-5 w-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600 mb-1">{avgEngagementScore}</div>
            <p className="text-xs text-gray-600">out of 10</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-1">
              Subscriptions by Qualification Type
              <HelpTooltip helpId="complimentary-by-qualification" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={qualificationTypeData} 
                    cx="50%" 
                    cy="50%" 
                    labelLine={false} 
                    label={({ type, percentage }) => `${type}: ${percentage}%`} 
                    outerRadius={80} 
                    fill="#8884d8" 
                    dataKey="count" 
                    stroke="#ffffff" 
                    strokeWidth={2}
                  >
                    {qualificationTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #bae6fd',
                      borderRadius: '6px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-1">
              Engagement Level Distribution
              <HelpTooltip helpId="complimentary-engagement-distribution" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementLevelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-1">
            Filter Complimentary Subscriptions
            <HelpTooltip helpId="complimentary-filter-controls" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search by name, email, company, or ID..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="w-64" 
              />
            </div>
            <select 
              value={selectedQualificationType} 
              onChange={e => setSelectedQualificationType(e.target.value)} 
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Qualification Types</option>
              <option value="BPA Qualified">BPA Qualified</option>
              <option value="Industry VIP">Industry VIP</option>
              <option value="Academic">Academic</option>
              <option value="Media Exchange">Media Exchange</option>
              <option value="Research Institution">Research Institution</option>
              <option value="Government Official">Government Official</option>
            </select>
            <select 
              value={selectedSource} 
              onChange={e => setSelectedSource(e.target.value)} 
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Sources</option>
              <option value="BPA Request">BPA Request</option>
              <option value="Editorial Request">Editorial Request</option>
              <option value="Academic Program">Academic Program</option>
              <option value="Media Partnership">Media Partnership</option>
              <option value="Research Grant">Research Grant</option>
              <option value="Government Request">Government Request</option>
            </select>
            <select 
              value={selectedEngagementLevel} 
              onChange={e => setSelectedEngagementLevel(e.target.value)} 
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Engagement Levels</option>
              <option value="Very High">Very High</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Complimentary Subscriptions Table */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Complimentary Subscription Details</CardTitle>
            <HelpTooltip helpId="complimentary-subscription-details" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['startDate', 'lastActivity'].includes(column.id);
                    return (
                      <TableHead
                        key={column.id}
                        className={`relative font-medium text-muted-foreground select-none h-11 py-2.5 px-4 ${
                          column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                        } ${isRightAligned ? 'text-right' : 'text-left'}`}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, column.id)}
                        onDragOver={(e) => handleDragOver(e, column.id)}
                        onDragEnd={handleDragEnd}
                        onClick={(e) => {
                          if (!e.defaultPrevented && column.sortable) {
                            handleSort(column.id);
                          }
                        }}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px',
                          cursor: draggedColumn === column.id ? 'grabbing' : 'grab'
                        }}
                      >
                        <div className={`flex items-center gap-1 flex-1 ${
                          isRightAligned ? 'justify-end' : 'justify-start'
                        }`}>
                          <span>{column.label}</span>
                          {column.sortable && sortConfig.key === column.id && (
                            <span className="text-xs text-ocean-500">
                              {getSortIcon(column.id)}
                            </span>
                          )}
                        </div>
                        <div 
                          className="absolute right-0 top-0 h-full w-4 cursor-col-resize group"
                          onMouseDown={(e) => startResizing(e, column.id)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="h-full w-1 bg-ocean-300 opacity-0 group-hover:opacity-100 mx-auto"></div>
                        </div>
                        {draggedColumn === column.id && (
                          <div className="absolute inset-0 bg-ocean-100 opacity-30 border-2 border-ocean-400 rounded pointer-events-none"></div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((subscription) => (
                  <TableRow key={subscription.id} className="hover:bg-gray-50 transition-colors duration-200">
                    {columnOrder.map((column) => {
                      const isRightAligned = ['startDate', 'lastActivity'].includes(column.id);
                      return (
                        <TableCell 
                          key={column.id} 
                          className={`py-2.5 px-4 ${isRightAligned ? 'text-right' : ''}`}
                          style={{
                            width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                            minWidth: '80px'
                          }}
                        >
                          {renderCellContent(subscription, column.id)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No complimentary subscriptions found matching your search criteria.
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredData.length} of {complimentarySubscriptions.length} complimentary subscriptions
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-ocean-800">Complimentary Subscription Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800">BPA Qualification Success</h4>
                <p className="text-sm text-blue-700 mt-1">
                  {Math.round((bpaQualified / totalComplimentary) * 100)}% of complimentary subscribers are BPA qualified, indicating strong professional verification.
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800">High Engagement Rate</h4>
                <p className="text-sm text-green-700 mt-1">
                  {Math.round((highEngagement / totalComplimentary) * 100)}% of complimentary subscribers show high engagement levels.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800">Academic Segment</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Academic subscribers represent a significant portion of complimentary access, supporting educational initiatives.
                </p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-800">Average Engagement Score</h4>
                <p className="text-sm text-purple-700 mt-1">
                  The average engagement score of {avgEngagementScore}/10 shows strong content relevance for complimentary users.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplimentarySubscriptionsReport;
