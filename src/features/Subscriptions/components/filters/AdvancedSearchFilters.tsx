
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, TrendingUp, MapPin, Target, DollarSign, Calendar, FileText, BarChart3, Filter, Clock, Shield, Tag, Database, Settings, AlertCircle, Building2 } from 'lucide-react';
import { useProductFilter } from '@/contexts/ProductFilterContext';

const AdvancedSearchFilters: React.FC = () => {
  const { subscriptionTypes, selectedSubscriptionTypes, toggleSubscriptionType } = useProductFilter();
  const [selectedChannels, setSelectedChannels] = React.useState<string[]>([]);
  const [selectedSegments, setSelectedSegments] = React.useState<string[]>([]);
  const [selectedEngagement, setSelectedEngagement] = React.useState<string[]>([]);
  const [selectedRevenueTier, setSelectedRevenueTier] = React.useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = React.useState<string[]>([]);

  const channels = [
    { id: 'direct', name: 'Direct' },
    { id: 'social', name: 'Social Media' },
    { id: 'email', name: 'Email' },
    { id: 'referral', name: 'Referral' },
    { id: 'paid', name: 'Paid Ads' },
    { id: 'organic', name: 'Organic Search' }
  ];

  const segments = [
    { id: 'new', name: 'New Subscribers' },
    { id: 'returning', name: 'Returning' },
    { id: 'long-term', name: 'Long-term' },
    { id: 'premium', name: 'Premium' },
    { id: 'basic', name: 'Basic' }
  ];

  const engagementLevels = [
    { id: 'high', name: 'High Engagement' },
    { id: 'medium', name: 'Medium Engagement' },
    { id: 'low', name: 'Low Engagement' }
  ];

  const revenueTiers = [
    { id: 'high', name: 'High Value' },
    { id: 'medium', name: 'Medium Value' },
    { id: 'low', name: 'Low Value' }
  ];

  const regions = [
    { id: 'north', name: 'North Region' },
    { id: 'south', name: 'South Region' },
    { id: 'east', name: 'East Region' },
    { id: 'west', name: 'West Region' },
    { id: 'central', name: 'Central Region' }
  ];

  const reportTypes = [
    { id: 'analytics', name: 'Analytics' },
    { id: 'financial', name: 'Financial' },
    { id: 'operational', name: 'Operational' },
    { id: 'compliance', name: 'Compliance' },
    { id: 'performance', name: 'Performance' },
    { id: 'customer', name: 'Customer' }
  ];

  const dataSources = [
    { id: 'crm', name: 'CRM System' },
    { id: 'erp', name: 'ERP System' },
    { id: 'analytics', name: 'Analytics Platform' },
    { id: 'database', name: 'Database' },
    { id: 'api', name: 'API Integration' },
    { id: 'manual', name: 'Manual Entry' }
  ];

  const reportStatus = [
    { id: 'draft', name: 'Draft' },
    { id: 'published', name: 'Published' },
    { id: 'archived', name: 'Archived' },
    { id: 'scheduled', name: 'Scheduled' },
    { id: 'in-review', name: 'In Review' }
  ];

  const priorities = [
    { id: 'critical', name: 'Critical' },
    { id: 'high', name: 'High Priority' },
    { id: 'medium', name: 'Medium Priority' },
    { id: 'low', name: 'Low Priority' }
  ];

  const departments = [
    { id: 'sales', name: 'Sales' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'finance', name: 'Finance' },
    { id: 'operations', name: 'Operations' },
    { id: 'hr', name: 'Human Resources' },
    { id: 'it', name: 'IT' }
  ];

  const frequencies = [
    { id: 'daily', name: 'Daily' },
    { id: 'weekly', name: 'Weekly' },
    { id: 'monthly', name: 'Monthly' },
    { id: 'quarterly', name: 'Quarterly' },
    { id: 'yearly', name: 'Yearly' },
    { id: 'adhoc', name: 'Ad-hoc' }
  ];

  const fileFormats = [
    { id: 'pdf', name: 'PDF' },
    { id: 'excel', name: 'Excel' },
    { id: 'csv', name: 'CSV' },
    { id: 'json', name: 'JSON' },
    { id: 'html', name: 'HTML' },
    { id: 'pptx', name: 'PowerPoint' }
  ];

  const accessLevels = [
    { id: 'public', name: 'Public' },
    { id: 'internal', name: 'Internal' },
    { id: 'confidential', name: 'Confidential' },
    { id: 'restricted', name: 'Restricted' }
  ];

  const [selectedReportTypes, setSelectedReportTypes] = React.useState<string[]>([]);
  const [selectedDataSources, setSelectedDataSources] = React.useState<string[]>([]);
  const [selectedReportStatus, setSelectedReportStatus] = React.useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = React.useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = React.useState<string[]>([]);
  const [selectedFrequencies, setSelectedFrequencies] = React.useState<string[]>([]);
  const [selectedFileFormats, setSelectedFileFormats] = React.useState<string[]>([]);
  const [selectedAccessLevels, setSelectedAccessLevels] = React.useState<string[]>([]);

  const toggleSelection = (
    id: string, 
    selected: string[], 
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Channel/Source Filter */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Acquisition Channel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {channels.map((channel) => (
              <Badge
                key={channel.id}
                variant={selectedChannels.includes(channel.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => toggleSelection(channel.id, selectedChannels, setSelectedChannels)}
              >
                {channel.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Segment Filter */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Segment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {segments.map((segment) => (
              <Badge
                key={segment.id}
                variant={selectedSegments.includes(segment.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => toggleSelection(segment.id, selectedSegments, setSelectedSegments)}
              >
                {segment.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Types Filter */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Subscription Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {subscriptionTypes.map((type) => (
              <Badge
                key={type.id}
                variant={selectedSubscriptionTypes.includes(type.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => toggleSubscriptionType(type.id)}
              >
                {type.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Level Filter */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Engagement Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {engagementLevels.map((level) => (
              <Badge
                key={level.id}
                variant={selectedEngagement.includes(level.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => toggleSelection(level.id, selectedEngagement, setSelectedEngagement)}
              >
                {level.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Tier Filter */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Tier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {revenueTiers.map((tier) => (
              <Badge
                key={tier.id}
                variant={selectedRevenueTier.includes(tier.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => toggleSelection(tier.id, selectedRevenueTier, setSelectedRevenueTier)}
              >
                {tier.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Geographic Region Filter */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Region
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <Badge
                key={region.id}
                variant={selectedRegions.includes(region.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => toggleSelection(region.id, selectedRegions, setSelectedRegions)}
              >
                {region.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Types Filter */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Report Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {reportTypes.map((type) => (
              <Badge
                key={type.id}
                variant={selectedReportTypes.includes(type.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => toggleSelection(type.id, selectedReportTypes, setSelectedReportTypes)}
              >
                {type.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Sources Filter */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {dataSources.map((source) => (
              <Badge
                key={source.id}
                variant={selectedDataSources.includes(source.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => toggleSelection(source.id, selectedDataSources, setSelectedDataSources)}
              >
                {source.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Status Filter */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Report Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {reportStatus.map((status) => (
              <Badge
                key={status.id}
                variant={selectedReportStatus.includes(status.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => toggleSelection(status.id, selectedReportStatus, setSelectedReportStatus)}
              >
                {status.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Filter */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Priority Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {priorities.map((priority) => (
              <Badge
                key={priority.id}
                variant={selectedPriorities.includes(priority.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => toggleSelection(priority.id, selectedPriorities, setSelectedPriorities)}
              >
                {priority.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Departments Filter */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Department
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <Badge
                key={dept.id}
                variant={selectedDepartments.includes(dept.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => toggleSelection(dept.id, selectedDepartments, setSelectedDepartments)}
              >
                {dept.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Frequency Filter */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Report Frequency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {frequencies.map((freq) => (
              <Badge
                key={freq.id}
                variant={selectedFrequencies.includes(freq.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => toggleSelection(freq.id, selectedFrequencies, setSelectedFrequencies)}
              >
                {freq.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* File Formats Filter */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            File Formats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {fileFormats.map((format) => (
              <Badge
                key={format.id}
                variant={selectedFileFormats.includes(format.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => toggleSelection(format.id, selectedFileFormats, setSelectedFileFormats)}
              >
                {format.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Access Levels Filter */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Access Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {accessLevels.map((level) => (
              <Badge
                key={level.id}
                variant={selectedAccessLevels.includes(level.id) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => toggleSelection(level.id, selectedAccessLevels, setSelectedAccessLevels)}
              >
                {level.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Filters */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-ocean-800 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Additional Criteria
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="report-author">Report Author</Label>
            <Input
              id="report-author"
              type="text"
              placeholder="Search by author name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="date-created-from">Created Date From</Label>
            <Input
              id="date-created-from"
              type="date"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="date-created-to">Created Date To</Label>
            <Input
              id="date-created-to"
              type="date"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="report-tags">Tags</Label>
            <Input
              id="report-tags"
              type="text"
              placeholder="e.g., quarterly, summary, forecast"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="min-views">Minimum Views</Label>
            <Input
              id="min-views"
              type="number"
              placeholder="e.g., 100"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="file-size">Maximum File Size (MB)</Label>
            <Input
              id="file-size"
              type="number"
              placeholder="e.g., 50"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSearchFilters;
