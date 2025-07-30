
import React from 'react';
import { Search, FileText, BarChart3, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReportCard from './ReportCard';

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  color: string;
  iconColor: string;
}

interface ReportsDirectoryProps {
  reports: Report[];
  filteredReports: Report[];
  onReportSelect: (reportId: string) => void;
}

const ReportsDirectory = ({ reports, filteredReports, onReportSelect }: ReportsDirectoryProps) => {
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

  const getCategoryColor = (category: string) => {
    return 'text-ocean-800';
  };

  // Group reports by category
  const reportsByCategory = filteredReports.reduce((acc, report) => {
    if (!acc[report.category]) {
      acc[report.category] = [];
    }
    acc[report.category].push(report);
    return acc;
  }, {} as Record<string, Report[]>);

  if (filteredReports.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No reports found</h3>
        <p className="text-gray-400">Try adjusting your search terms</p>
      </div>
    );
  }

  return (
    <div>
      {Object.entries(reportsByCategory).map(([category, categoryReports]) => (
        <div key={`category-${category}`} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={getCategoryColor(category)}>
              {getCategoryIcon(category)}
            </span>
            <h2 className={`text-lg font-semibold ${getCategoryColor(category)}`}>{category}</h2>
            <Badge variant="secondary" className="ml-2 text-xs bg-blue-100 text-blue-700 border-blue-200">
              {categoryReports.length}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {categoryReports.map((report) => (
              <ReportCard
                key={`report-${report.id}`}
                report={report}
                onSelect={onReportSelect}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportsDirectory;
