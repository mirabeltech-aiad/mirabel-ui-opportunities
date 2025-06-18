
import React, { useEffect } from 'react';
import { reportsData } from '../helpers/reportsData.js';
import { useReports } from '../hooks/useReports.js';
import { formatReportCount } from '../helpers/formatters.js';
import SearchBar from './SearchBar.jsx';
import TabNavigation from './TabNavigation.jsx';
import ReportCard from './ReportCard.jsx';

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
    setReports
  } = useReports();

  // Initialize reports data on component mount
  useEffect(() => {
    setReports(reportsData.reports);
  }, [setReports]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports Directory</h1>
        <p className="text-gray-600 mb-6">Select a report to view detailed analytics and insights</p>
        <div className="text-sm text-gray-500 mb-6">
          {formatReportCount(filteredReports.length, reports.length)}
        </div>
        
        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {/* Tab Navigation */}
      <TabNavigation 
        categories={reportsData.categories}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabCounts={tabCounts}
      />

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredReports.map((report) => (
          <ReportCard 
            key={report.id} 
            report={report} 
            onToggleStar={toggleStar}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ReportsDirectory;
