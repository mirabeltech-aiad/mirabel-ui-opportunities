import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, Briefcase, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabaseReportsService } from '../../services/reports';
import { useProductFilter } from '../../contexts/ProductFilterContext';
import HelpTooltip from '../../components/shared/HelpTooltip';
import { useSorting } from '../../hooks/useSorting';
import { getDataTypeFromColumn } from '../../utils/sortingUtils';
import { useTableColumnManager } from '../../hooks/useTableColumnManager';
interface SubscriberDemographicReportProps {
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  selectedPeriod?: string;
}
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const SubscriberDemographicReport: React.FC<SubscriberDemographicReportProps> = ({ dateRange, selectedPeriod }) => {
  const {
    selectedProducts,
    selectedBusinessUnits,
    isAllProductsSelected,
    isAllBusinessUnitsSelected
  } = useProductFilter();

  // Define table columns for drag-and-drop functionality
  const tableColumns = [
    { id: 'name', label: 'Name', sortable: true, resizable: true },
    { id: 'demographics', label: 'Demographics', sortable: true, resizable: true },
    { id: 'professional', label: 'Professional', sortable: true, resizable: true },
    { id: 'subscription', label: 'Subscription', sortable: true, resizable: true },
    { id: 'behavioralTags', label: 'Behavioral Tags', sortable: true, resizable: true },
    { id: 'engagement', label: 'Engagement', sortable: true, resizable: true },
    { id: 'revenue', label: 'Revenue', sortable: true, resizable: true }
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
    storageKey: 'subscriber-demographic-columns'
  });

  // Use React Query to fetch real subscriber demographics data from Supabase
  const { data: demographicsData, isLoading, error } = useQuery({
    queryKey: ['subscriber-demographics', { 
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange 
    }],
    queryFn: () => supabaseReportsService.getSubscriberDemographicsData({
      productIds: isAllProductsSelected ? undefined : selectedProducts,
      businessUnitIds: isAllBusinessUnitsSelected ? undefined : selectedBusinessUnits,
      dateRange
    })
  });

  const {
    totalSubscribers = 0,
    ageGroups = [],
    genderDistribution = [],
    jobTitles = [],
    industries = [],
    incomeBrackets = [],
    behavioralTags = [],
    detailedSegments = []
  } = demographicsData || {};

  // Initialize sorting functionality
  const { sortedData, sortConfig, requestSort, getSortIcon } = useSorting({
    data: detailedSegments || [],
    initialSort: undefined
  });

  if (isLoading) {
    return <div className="animate-fade-in">Loading subscriber demographics data...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading subscriber demographics data</div>;
  }

  // Calculate key metrics from real data
  const largestAgeGroup = ageGroups.length > 0 ? ageGroups.reduce((prev, current) => (prev.count > current.count) ? prev : current) : null;
  const topIndustry = industries.length > 0 ? industries[0] : null;
  const mostCommonIncome = incomeBrackets.length > 0 ? incomeBrackets.reduce((prev, current) => (prev.count > current.count) ? prev : current) : null;
  const topBehavioralTag = behavioralTags.length > 0 ? behavioralTags[0] : null;

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

  return <div className="space-y-6">
      {/* Header */}
      

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Largest Age Group
              <HelpTooltip helpId="demographic-largest-age-group" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{largestAgeGroup?.range || 'N/A'}</div>
            <p className="text-sm text-gray-500">{largestAgeGroup?.percentage || 0}% of subscribers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Top Industry
              <HelpTooltip helpId="demographic-top-industry" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{topIndustry?.industry || 'N/A'}</div>
            <p className="text-sm text-gray-500">{topIndustry?.percentage || 0}% of subscribers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Most Common Income
              <HelpTooltip helpId="demographic-common-income" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{mostCommonIncome?.bracket || 'N/A'}</div>
            <p className="text-sm text-gray-500">{mostCommonIncome?.percentage || 0}% of subscribers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-black flex items-center gap-1">
              Top Behavioral Tag
              <HelpTooltip helpId="demographic-behavioral-tag" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{topBehavioralTag?.tag || 'N/A'}</div>
            <p className="text-sm text-gray-500">{topBehavioralTag?.percentage || 0}% of subscribers</p>
          </CardContent>
        </Card>
      </div>

      {/* Age and Gender Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-1">
              Age Distribution
              <HelpTooltip helpId="demographic-age-distribution" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageGroups}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip formatter={value => [value.toLocaleString(), 'Subscribers']} />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-ocean-800 flex items-center gap-1">
              Gender Distribution
              <HelpTooltip helpId="demographic-gender-distribution" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={genderDistribution} cx="50%" cy="50%" labelLine={false} label={({
                  gender,
                  percentage
                }) => `${gender}: ${percentage}%`} outerRadius={80} fill="#8884d8" dataKey="count">
                    {genderDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={value => [value.toLocaleString(), 'Subscribers']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Titles and Industries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ocean-800">
              <Briefcase className="h-5 w-5" />
              Top Job Titles
              <HelpTooltip helpId="demographic-job-titles" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobTitles.map((job, index) => <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{job.title}</div>
                    <div className="text-sm text-gray-500">
                      {job.count.toLocaleString()} subscribers ({job.percentage}%)
                    </div>
                    <div className="flex gap-1 mt-1">
                      {job.topIndustries.slice(0, 2).map((industry, i) => <Badge key={i} variant="secondary" className="text-xs">
                          {industry}
                        </Badge>)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{job.percentage}%</div>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ocean-800">
              <TrendingUp className="h-5 w-5" />
              Industry Breakdown
              <HelpTooltip helpId="demographic-industry-breakdown" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {industries.map((industry, index) => <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{industry.industry}</div>
                    <div className="text-sm text-gray-500">
                      {industry.count.toLocaleString()} subscribers ({industry.percentage}%)
                    </div>
                    <div className="text-sm text-green-600">
                      Growth: +{industry.growthRate}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      ${(industry.avgIncome / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-gray-500">Avg Income</div>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-ocean-800">
            <DollarSign className="h-5 w-5" />
            Income Bracket Analysis
            <HelpTooltip helpId="demographic-income-analysis" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeBrackets}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bracket" />
                <YAxis />
                <Tooltip formatter={value => [value.toLocaleString(), 'Subscribers']} />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {incomeBrackets.map((bracket, index) => <div key={index} className="text-center p-3 border rounded-lg">
                <div className="font-medium text-sm">{bracket.bracket}</div>
                <div className="text-lg font-bold text-green-600">{bracket.percentage}%</div>
                <div className="text-xs text-gray-500">Prefers {bracket.subscriptionPreference}</div>
                <div className="text-xs text-blue-600">${bracket.avgLTV} LTV</div>
              </div>)}
          </div>
        </CardContent>
      </Card>

      {/* Behavioral Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-1">
            Behavioral Segmentation
            <HelpTooltip helpId="demographic-behavioral-segmentation" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {behavioralTags.map((tag, index) => <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{tag.tag}</h3>
                  <Badge variant="outline">{tag.percentage}%</Badge>
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {tag.count.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Engagement Score: <span className="font-medium text-green-600">{tag.engagementScore}</span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-700">Top Content:</div>
                  {tag.topContent.map((content, i) => <Badge key={i} variant="secondary" className="text-xs mr-1">
                      {content}
                    </Badge>)}
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Subscriber Segments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-1">
            Sample Subscriber Profiles
            <HelpTooltip helpId="demographic-subscriber-profiles" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {columnOrder.map((column) => {
                    const isRightAligned = ['engagement', 'revenue'].includes(column.id);
                    const isCenterAligned = ['subscription'].includes(column.id);
                    return (
                      <th
                        key={column.id}
                        className={`relative py-2.5 px-4 font-medium text-muted-foreground cursor-pointer hover:bg-gray-100 select-none ${
                          isRightAligned ? 'text-right' : isCenterAligned ? 'text-center' : 'text-left'
                        }`}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, column.id)}
                        onDragOver={(e) => handleDragOver(e, column.id)}
                        onDragEnd={handleDragEnd}
                        onClick={(e) => {
                          if (!e.defaultPrevented) {
                            const dataType = getDataTypeFromColumn(column.id);
                            requestSort(column.id, dataType);
                          }
                        }}
                        style={{
                          width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                          minWidth: '80px',
                          cursor: draggedColumn === column.id ? 'grabbing' : 'grab'
                        }}
                      >
                        <div className={`flex items-center gap-1 flex-1 ${
                          isRightAligned ? 'justify-end' : isCenterAligned ? 'justify-center' : 'justify-start'
                        }`}>
                          <span>{column.label}</span>
                          {sortConfig.key === column.id && (
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
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                    {columnOrder.map((column) => {
                      const isRightAligned = ['engagement', 'revenue'].includes(column.id);
                      const isCenterAligned = ['subscription'].includes(column.id);
                      return (
                        <td 
                          key={column.id} 
                          className={`py-2.5 px-4 ${
                            isRightAligned ? 'text-right' : isCenterAligned ? 'text-center' : ''
                          }`}
                          style={{
                            width: columnWidths[column.id] ? `${columnWidths[column.id]}px` : undefined,
                            minWidth: '80px'
                          }}
                        >
                          {column.id === 'name' && (
                            <div>
                              <div className="font-medium">{subscriber.name}</div>
                              <div className="text-sm text-gray-500">{subscriber.location}</div>
                            </div>
                          )}
                          {column.id === 'demographics' && (
                            <div className="text-sm">
                              <div>{subscriber.age}, {subscriber.gender}</div>
                              <div className="text-gray-500">{subscriber.income}</div>
                            </div>
                          )}
                          {column.id === 'professional' && (
                            <div className="text-sm">
                              <div>{subscriber.jobTitle}</div>
                              <div className="text-gray-500">{subscriber.industry}</div>
                            </div>
                          )}
                          {column.id === 'subscription' && (
                            <Badge variant="outline">{subscriber.subscriptionType}</Badge>
                          )}
                          {column.id === 'behavioralTags' && (
                            <div className="space-y-1">
                              {subscriber.behavioralTags.map((tag, i) => (
                                <Badge key={i} variant="secondary" className="text-xs mr-1 mb-1">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {column.id === 'engagement' && (
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600">{subscriber.engagementScore}</div>
                              <div className="text-xs text-gray-500">Score</div>
                            </div>
                          )}
                          {column.id === 'revenue' && (
                            <div className="text-right">
                              <div className="font-medium">${subscriber.totalSpent}</div>
                              <div className="text-xs text-gray-500">Total Spent</div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default SubscriberDemographicReport;