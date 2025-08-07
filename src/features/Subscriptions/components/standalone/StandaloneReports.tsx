
import React, { useState, Suspense } from 'react';
import { Heart } from 'lucide-react';
import StandaloneReportsSearch from './StandaloneReportsSearch';
import StandaloneCategoryFilter from './StandaloneCategoryFilter';
import StandaloneReportCard from './StandaloneReportCard';
import { mockReports } from '@/data/mockReportsData';

const StandaloneReports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [favoriteReports, setFavoriteReports] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  const toggleFavorite = (reportId: string) => {
    setFavoriteReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const filteredReports = mockReports.filter(report => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      report.title.toLowerCase().includes(query) ||
      report.description.toLowerCase().includes(query) ||
      report.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );
  });

  // If a report is selected, show it with deferred loading
  if (selectedReportId) {
    const selectedReport = mockReports.find(report => report.id === selectedReportId);
    const ReportComponent = selectedReport?.component;

    return (
      <div className="min-h-screen bg-neutral-50">
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setSelectedReportId(null)}
                className="bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500 mb-4 flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
              >
                ← Back to Reports Directory
              </button>
              <h1 className="text-3xl font-bold text-ocean-800 mb-2">
                {selectedReport?.title}
              </h1>
              <p className="text-gray-600">
                {selectedReport?.description}
              </p>
            </div>

            {ReportComponent && (
              <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-500"></div>
                  <span className="ml-3 text-gray-600">Loading report...</span>
                </div>
              }>
                <ReportComponent />
              </Suspense>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Show the reports directory - no data fetching here
  // Group reports by category
  const reportsByCategory = filteredReports.reduce((acc, report) => {
    if (!acc[report.category]) {
      acc[report.category] = [];
    }
    acc[report.category].push(report);
    return acc;
  }, {} as Record<string, typeof mockReports>);

  const categories = Object.keys(reportsByCategory);
  const favoriteReportsData = filteredReports.filter(report => favoriteReports.includes(report.id));

  // Get category counts for badges
  const categoryReportCounts = Object.keys(reportsByCategory).reduce((acc, category) => {
    acc[category] = reportsByCategory[category].length;
    return acc;
  }, {} as Record<string, number>);

  // Filter reports based on active category
  const getDisplayedReports = () => {
    switch (activeCategory) {
      case 'All':
        return filteredReports;
      case 'Favorites':
        return favoriteReportsData;
      default:
        return reportsByCategory[activeCategory] || [];
    }
  };

  const displayedReports = getDisplayedReports();

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-ocean-800 mb-2">
              Reports Directory
            </h1>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Select a report to view detailed analytics and insights
              </p>
              <div className="text-sm text-gray-500">
                {filteredReports.length} of {mockReports.length} reports
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <StandaloneReportsSearch 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            <StandaloneCategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              categoryReportCounts={categoryReportCounts}
              favoriteCount={favoriteReportsData.length}
            />
          </div>

          {displayedReports.length === 0 ? (
            <div className="text-center py-12">
              {activeCategory === 'Favorites' ? (
                <>
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No favorite reports yet</h3>
                  <p className="text-gray-400">Start favoriting reports to see them here</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No reports found</h3>
                  <p className="text-gray-400">Try adjusting your search terms or category filter</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {displayedReports.map((report) => (
                <StandaloneReportCard
                  key={report.id}
                  report={report}
                  onSelect={setSelectedReportId}
                  isFavorite={favoriteReports.includes(report.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StandaloneReports;
