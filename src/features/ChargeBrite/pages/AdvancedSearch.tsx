import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { useProductFilter } from '@/contexts/ProductFilterContext';
import DateRangeFilterSection from '@/components/filters/DateRangeFilterSection';

const AdvancedSearch = () => {
  const navigate = useNavigate();
  const { subscriptionTypes, selectedSubscriptionTypes, toggleSubscriptionType } = useProductFilter();

  // Accordion state management
  const [primarySearchOpen, setPrimarySearchOpen] = useState(true);
  const [businessMetricsOpen, setBusinessMetricsOpen] = useState(false);
  const [timeFiltersOpen, setTimeFiltersOpen] = useState(false);
  const [reportsAnalyticsOpen, setReportsAnalyticsOpen] = useState(false);
  const [geographicOpen, setGeographicOpen] = useState(false);
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);

  // Filter states
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [selectedEngagement, setSelectedEngagement] = useState<string[]>([]);
  const [selectedRevenueTier, setSelectedRevenueTier] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedReportTypes, setSelectedReportTypes] = useState<string[]>([]);
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);
  const [selectedReportStatus, setSelectedReportStatus] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedFrequencies, setSelectedFrequencies] = useState<string[]>([]);
  const [selectedFileFormats, setSelectedFileFormats] = useState<string[]>([]);
  const [selectedAccessLevels, setSelectedAccessLevels] = useState<string[]>([]);

  // Date range states
  const [accountCreatedDateRange, setAccountCreatedDateRange] = useState<{startDate?: Date, endDate?: Date}>({});
  const [subscriptionDateRange, setSubscriptionDateRange] = useState<{startDate?: Date, endDate?: Date}>({});
  const [lastActivityDateRange, setLastActivityDateRange] = useState<{startDate?: Date, endDate?: Date}>({});

  // Data arrays
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

  const handleSearch = () => {
    console.log('Executing search');
  };

  const handleReset = () => {
    console.log('Resetting search');
    setSelectedChannels([]);
    setSelectedSegments([]);
    setSelectedEngagement([]);
    setSelectedRevenueTier([]);
    setSelectedRegions([]);
    setSelectedReportTypes([]);
    setSelectedDataSources([]);
    setSelectedReportStatus([]);
    setSelectedPriorities([]);
    setSelectedDepartments([]);
    setSelectedFrequencies([]);
    setSelectedFileFormats([]);
    setSelectedAccessLevels([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500 rounded-lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-ocean-800 mb-2">Advanced Filters</h1>
                <p className="text-gray-600">Filter and search across all data with advanced criteria</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-gray-300 hover:bg-gray-50 rounded-lg"
              >
                Reset All
              </Button>
              <Button
                onClick={handleSearch}
                className="bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500 rounded-lg"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-6">
          
          {/* Primary Search Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <Accordion
              type="single"
              collapsible
              value={primarySearchOpen ? "primary-search" : ""}
              onValueChange={(value) => setPrimarySearchOpen(value === "primary-search")}
            >
              <AccordionItem 
                value="primary-search" 
                className="border-none transition-all duration-300 mb-2 data-[state=open]:bg-blue-50/30 data-[state=open]:border data-[state=open]:border-gray-200 data-[state=open]:rounded-lg hover:bg-blue-50/40"
              >
                <AccordionTrigger className="py-4 px-4 font-medium transition-all duration-300 hover:no-underline hover:text-blue-700 data-[state=open]:text-blue-800 data-[state=open]:hover:bg-blue-50/20">
                  <div className="flex items-center">
                    <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                    Primary Search
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </AccordionTrigger>
                <AccordionContent className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down pb-4 pt-0 px-4">
                  <div className="space-y-4">
                    {/* Single Column Layout - Long text fields */}
                    <div>
                      <Input 
                        placeholder="Global search across all data..."
                        className="w-full"
                      />
                    </div>
                    
                    {/* Three Column Layout - Short to medium fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input 
                        placeholder="Customer Name"
                        className="w-full"
                      />
                      <Input 
                        placeholder="Email Address"
                        className="w-full"
                      />
                      <Input 
                        placeholder="Customer ID"
                        className="w-full"
                      />
                    </div>

                    {/* Two Column Layout - Related field pairs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input 
                        placeholder="Phone Number"
                        className="w-full"
                      />
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Two Column Layout - Date range pair */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input type="date" placeholder="Date From" className="w-full" />
                      <Input type="date" placeholder="Date To" className="w-full" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Business Metrics Section */}
          <Accordion
            type="single"
            collapsible
            value={businessMetricsOpen ? "business-metrics" : ""}
            onValueChange={(value) => setBusinessMetricsOpen(value === "business-metrics")}
          >
            <AccordionItem 
              value="business-metrics" 
              className="transition-all duration-300 mb-2 data-[state=open]:bg-blue-50/30 data-[state=open]:border data-[state=open]:border-gray-200 data-[state=open]:rounded-lg hover:bg-blue-50/40"
            >
              <AccordionTrigger className="py-4 px-4 font-medium transition-all duration-300 hover:no-underline hover:text-blue-700 data-[state=open]:text-blue-800 data-[state=open]:hover:bg-blue-50/20">
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-yellow-500 rounded-full mr-3"></div>
                  Business Metrics & Segmentation
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down pb-4 pt-0 px-4">
                <div className="space-y-4">
                  
                  {/* Four Column Layout - Short selection fields */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Acquisition Channel" />
                      </SelectTrigger>
                      <SelectContent>
                        {channels.map((channel) => (
                          <SelectItem key={channel.id} value={channel.id}>{channel.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Customer Segment" />
                      </SelectTrigger>
                      <SelectContent>
                        {segments.map((segment) => (
                          <SelectItem key={segment.id} value={segment.id}>{segment.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Subscription Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {subscriptionTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Engagement Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {engagementLevels.map((level) => (
                          <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Single Column Layout - Revenue Tier */}
                  <div>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Revenue Tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {revenueTiers.map((tier) => (
                          <SelectItem key={tier.id} value={tier.id}>{tier.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Time-Based Filters Section */}
          <Accordion
            type="single"
            collapsible
            value={timeFiltersOpen ? "time-filters" : ""}
            onValueChange={(value) => setTimeFiltersOpen(value === "time-filters")}
          >
            <AccordionItem 
              value="time-filters" 
              className="transition-all duration-300 mb-2 data-[state=open]:bg-blue-50/30 data-[state=open]:border data-[state=open]:border-gray-200 data-[state=open]:rounded-lg hover:bg-blue-50/40"
            >
              <AccordionTrigger className="py-4 px-4 font-medium transition-all duration-300 hover:no-underline hover:text-blue-700 data-[state=open]:text-blue-800 data-[state=open]:hover:bg-blue-50/20">
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-yellow-500 rounded-full mr-3"></div>
                  Time-Based Filters
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down pb-4 pt-0 px-4">
                <div className="space-y-4">
                  {/* Account Creation Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Created</label>
                    <DateRangeFilterSection
                      dateRange={accountCreatedDateRange}
                      onDateRangeChange={(startDate, endDate) => 
                        setAccountCreatedDateRange({ startDate, endDate })
                      }
                    />
                  </div>

                  {/* Subscription Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Period</label>
                    <DateRangeFilterSection
                      dateRange={subscriptionDateRange}
                      onDateRangeChange={(startDate, endDate) => 
                        setSubscriptionDateRange({ startDate, endDate })
                      }
                    />
                  </div>

                  {/* Last Activity Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Activity</label>
                    <DateRangeFilterSection
                      dateRange={lastActivityDateRange}
                      onDateRangeChange={(startDate, endDate) => 
                        setLastActivityDateRange({ startDate, endDate })
                      }
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Reports & Analytics Section */}
          <Accordion
            type="single"
            collapsible
            value={reportsAnalyticsOpen ? "reports-analytics" : ""}
            onValueChange={(value) => setReportsAnalyticsOpen(value === "reports-analytics")}
          >
            <AccordionItem 
              value="reports-analytics" 
              className="transition-all duration-300 mb-2 data-[state=open]:bg-blue-50/30 data-[state=open]:border data-[state=open]:border-gray-200 data-[state=open]:rounded-lg hover:bg-blue-50/40"
            >
              <AccordionTrigger className="py-4 px-4 font-medium transition-all duration-300 hover:no-underline hover:text-blue-700 data-[state=open]:text-blue-800 data-[state=open]:hover:bg-blue-50/20">
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
                  Reports & Analytics
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down pb-4 pt-0 px-4">
                <div className="space-y-4">
                  
                  {/* Report Types */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Report Types</h4>
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
                  </div>

                  {/* Data Sources */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Data Sources</h4>
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
                  </div>

                  {/* Report Status */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Report Status</h4>
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
                  </div>

                  {/* Priority Levels */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Priority Level</h4>
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
                  </div>

                  {/* Departments */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Department</h4>
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
                  </div>

                  {/* Report Frequency */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Report Frequency</h4>
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
                  </div>

                  {/* File Formats */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">File Formats</h4>
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
                  </div>

                  {/* Access Levels */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Access Level</h4>
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
                  </div>

                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Geographic Filters Section */}
          <Accordion
            type="single"
            collapsible
            value={geographicOpen ? "geographic" : ""}
            onValueChange={(value) => setGeographicOpen(value === "geographic")}
          >
            <AccordionItem 
              value="geographic" 
              className="transition-all duration-300 mb-2 data-[state=open]:bg-blue-50/30 data-[state=open]:border data-[state=open]:border-gray-200 data-[state=open]:rounded-lg hover:bg-blue-50/40"
            >
              <AccordionTrigger className="py-4 px-4 font-medium transition-all duration-300 hover:no-underline hover:text-blue-700 data-[state=open]:text-blue-800 data-[state=open]:hover:bg-blue-50/20">
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-red-500 rounded-full mr-3"></div>
                  Geographic Filters
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down pb-4 pt-0 px-4">
                <div className="space-y-4">
                  
                  {/* Geographic Regions */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Geographic Region</h4>
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
                  </div>

                  {/* Location Fields */}
                  <div className="space-y-4">
                    {/* Two Column Layout - Related location pairs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                          <SelectItem value="fr">France</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="State/Province" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ca">California</SelectItem>
                          <SelectItem value="ny">New York</SelectItem>
                          <SelectItem value="tx">Texas</SelectItem>
                          <SelectItem value="fl">Florida</SelectItem>
                          <SelectItem value="on">Ontario</SelectItem>
                          <SelectItem value="bc">British Columbia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input 
                        placeholder="City"
                        className="w-full"
                      />
                      <Input 
                        placeholder="Postal Code"
                        className="w-full"
                      />
                    </div>
                  </div>

                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Advanced Options Section */}
          <Accordion
            type="single"
            collapsible
            value={advancedOptionsOpen ? "advanced-options" : ""}
            onValueChange={(value) => setAdvancedOptionsOpen(value === "advanced-options")}
          >
            <AccordionItem 
              value="advanced-options" 
              className="transition-all duration-300 mb-2 data-[state=open]:bg-blue-50/30 data-[state=open]:border data-[state=open]:border-gray-200 data-[state=open]:rounded-lg hover:bg-blue-50/40"
            >
              <AccordionTrigger className="py-4 px-4 font-medium transition-all duration-300 hover:no-underline hover:text-blue-700 data-[state=open]:text-blue-800 data-[state=open]:hover:bg-blue-50/20">
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></div>
                  Advanced Options
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down pb-4 pt-0 px-4">
                <div className="space-y-4">
                  {/* Single Column Layout - Long text field */}
                  <div>
                    <Input 
                      placeholder="Notes/Comments search..."
                      className="w-full"
                    />
                  </div>

                  {/* Two Column Layout - Related control pairs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="relevance">Relevance</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Results per page" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input 
                      placeholder="Author"
                      className="w-full"
                    />
                    <Input 
                      placeholder="Tags (comma separated)"
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input 
                      type="number"
                      placeholder="Min views"
                      className="w-full"
                    />
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="File size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Under 1 MB</SelectItem>
                        <SelectItem value="medium">1-10 MB</SelectItem>
                        <SelectItem value="large">10-50 MB</SelectItem>
                        <SelectItem value="xlarge">Over 50 MB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Single Column Layout - Export control */}
                  <div>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Export format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

        </div>

        {/* Search Results Section */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-ocean-800 mb-4">Search Results</h2>
          <div className="text-center py-8 text-gray-500">
            No search results yet. Configure your filters above and click Search to get started.
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdvancedSearch;