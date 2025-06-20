import React from 'react';
import { useReportsContext } from '../context';
import { ReportCard, SearchBar, TabNavigation } from './';
import { formatReportCount } from '../helpers/formatters.js';

/**
 * Main reports directory component that displays all reports with filtering
 */
const ReportsDirectory = () => {
  const {
    reports,
    filteredReports,
    activeTab,
    searchQuery,
    tabCounts,
    setActiveTab,
    setSearchQuery,
    toggleStar,
    loading,
    error,
    isUpdatingStar,
    categories
  } = useReportsContext();

  return (
    <div className="px-4 py-8 mx-auto max-w-11/12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Reports Directory</h1>
        <p className="mb-6 text-gray-600">Select a report to view detailed analytics and insights</p>
        <div className="mb-6 text-sm text-gray-500">
          {formatReportCount(filteredReports.length, reports.length)}
        </div>
        
        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">⏳</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">Loading reports...</h3>
          <p className="text-gray-500">Please wait while we fetch your reports.</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">❌</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">Error loading reports</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Tab Navigation */}
          <TabNavigation 
            categories={categories}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabCounts={tabCounts}
          />

          {/* Reports Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredReports.map((report) => (
              <ReportCard 
                key={report.id} 
                report={report} 
                onToggleStar={toggleStar}
                isUpdatingStar={isUpdatingStar}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredReports.length === 0 && (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">📊</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">No reports found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsDirectory;
