import React, { useState, Suspense } from 'react';
import { ProductFilterProvider } from '../../../contexts/ProductFilterContext';
import ReportsFilterBar from '../components/filters/ReportsFilterBar';
import { CardContent } from '../../../components/ui/card';
import { useReportsFiltering } from '../../../hooks/useReportsFiltering';
import { 
  OceanTitle, 
  OceanButton, 
  DesignSystemCard, 
  SemanticBadge 
} from '../../../components/ui/design-system';
import { Building2, Zap, AlertCircle, RefreshCw } from 'lucide-react';
import ReportsHeader from '../components/directory/ReportsHeader';
import ReportCard from '../components/directory/ReportCard';

const ReportsDirectoryPage = () => {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    favoriteReports,
    toggleFavorite,
    filteredReports,
    reportsByCategory,
    categories,
    favoriteReportsData,
    categoryReportCounts,
    displayedReports
  } = useReportsFiltering();

  const handleReportSelect = (reportId: string) => {
    setSelectedReportId(reportId);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchQuery(searchTerm);
  };

  // If a specific report is selected, render just that report
  const selectedReport = displayedReports.find(report => report.id === selectedReportId);
  if (selectedReport) {
    const ReportComponent = selectedReport?.component;
    return (
      <ProductFilterProvider>
        <div className="min-h-screen bg-gray-50">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <OceanButton
                variant="outline" 
                onClick={() => setSelectedReportId(null)} 
                className="mb-4 flex items-center gap-2"
              >
                ← Back to Reports Directory
              </OceanButton>
              <OceanTitle level={1} className="mb-2">
                {selectedReport?.title}
              </OceanTitle>
              <p className="text-muted-foreground">
                {selectedReport?.description}
              </p>
            </div>

            <ReportsFilterBar onSearchChange={handleSearch} />

            <div className="mt-8">
              <Suspense fallback={
                <DesignSystemCard size="large" className="h-96">
                  <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-600 mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading report...</p>
                    </div>
                  </CardContent>
                </DesignSystemCard>
              }>
                {ReportComponent && <ReportComponent />}
              </Suspense>
            </div>
          </main>
        </div>
      </ProductFilterProvider>
    );
  }

  // Main reports directory view
  return (
    <ProductFilterProvider>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ReportsHeader 
            totalReports={filteredReports.length} 
            filteredCount={displayedReports.length}
            businessModel="media" // Will be updated to use context
            isLoading={false}
            error={null}
            onRefresh={() => {}}
          />
          
          <ReportsFilterBar onSearchChange={handleSearch} />
          
        </main>
      </div>
    </ProductFilterProvider>
  );
};

export default ReportsDirectoryPage;