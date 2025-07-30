
import React from 'react';
import { Search, FileText, BarChart3, TrendingUp } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ProductFilter from '@/components/filters/ProductFilter';

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
}

interface ReportsSidebarProps {
  reports: Report[];
  selectedReportId: string;
  onReportSelect: (reportId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Subscriber Reports':
      return <FileText className="h-4 w-4" />;
    case 'Performance Reports':
      return <BarChart3 className="h-4 w-4" />;
    case 'Revenue Reports':
      return <TrendingUp className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const ReportsSidebar = ({
  reports,
  selectedReportId,
  onReportSelect,
  searchQuery,
  onSearchChange,
}: ReportsSidebarProps) => {
  const filteredReports = reports.filter(report => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      report.title.toLowerCase().includes(query) ||
      report.description.toLowerCase().includes(query) ||
      report.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );
  });

  // Group reports by category
  const reportsByCategory = filteredReports.reduce((acc, report) => {
    if (!acc[report.category]) {
      acc[report.category] = [];
    }
    acc[report.category].push(report);
    return acc;
  }, {} as Record<string, Report[]>);

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Reports</h2>
          <SidebarTrigger />
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {/* Filters */}
        <SidebarGroup>
          <SidebarGroupLabel>Filters</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2">
              <ProductFilter />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Reports by Category */}
        {Object.entries(reportsByCategory).map(([category, categoryReports]) => (
          <SidebarGroup key={category}>
            <SidebarGroupLabel className="flex items-center gap-2">
              {getCategoryIcon(category)}
              {category}
              <Badge variant="secondary" className="ml-auto">
                {categoryReports.length}
              </Badge>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {categoryReports.map((report) => (
                  <SidebarMenuItem key={report.id}>
                    <SidebarMenuButton
                      isActive={selectedReportId === report.id}
                      onClick={() => onReportSelect(report.id)}
                      className="w-full justify-start p-3 h-auto"
                    >
                      <div className="flex flex-col items-start gap-1 w-full text-left">
                        <span className="font-medium text-sm leading-normal">
                          {report.title}
                        </span>
                        <span className="text-xs text-muted-foreground leading-relaxed">
                          {report.description}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {filteredReports.length === 0 && (
          <div className="p-4 text-center">
            <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No reports found</p>
            <p className="text-xs text-gray-400">Try adjusting your search</p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default ReportsSidebar;
