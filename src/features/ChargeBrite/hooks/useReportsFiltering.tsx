
import { useState, useMemo } from 'react';
import { reportsConfig } from '@/data/reportsConfig';
import { PerformanceAnalytics } from '@/utils/performanceAnalytics';
import { useBusinessModel } from '@/contexts/BusinessModelContext';
import { filterReportsByBusinessModel, ReportWithBusinessModel } from '@/utils/businessModelFilters';

export const useReportsFiltering = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [favoriteReports, setFavoriteReports] = useState<string[]>([]);
  const { businessModel } = useBusinessModel();

  // Memoize business model filtered reports first
  const businessModelFilteredReports = useMemo(() => {
    PerformanceAnalytics.startMeasurement('Business model filtering');
    const filtered = filterReportsByBusinessModel(reportsConfig as ReportWithBusinessModel[], businessModel);
    PerformanceAnalytics.endMeasurement('Business model filtering');
    return filtered;
  }, [businessModel]);

  // Memoize search filtered reports to avoid unnecessary recalculations
  const filteredReports = useMemo(() => {
    PerformanceAnalytics.startMeasurement('Reports filtering');
    const filtered = businessModelFilteredReports.filter(report => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        report.title.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        report.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    });
    PerformanceAnalytics.endMeasurement('Reports filtering');
    return filtered;
  }, [searchQuery, businessModelFilteredReports]);

  // Group reports by category (memoized)
  const reportsByCategory = useMemo(() => {
    PerformanceAnalytics.startMeasurement('Reports categorization');
    const categorized = filteredReports.reduce((acc, report) => {
      if (!acc[report.category]) {
        acc[report.category] = [];
      }
      acc[report.category].push(report);
      return acc;
    }, {} as Record<string, ReportWithBusinessModel[]>);
    PerformanceAnalytics.endMeasurement('Reports categorization');
    return categorized;
  }, [filteredReports]);

  const categories = Object.keys(reportsByCategory);
  const favoriteReportsData = filteredReports.filter(report => favoriteReports.includes(report.id));

  // Get category counts for badges (memoized)
  const categoryReportCounts = useMemo(() => {
    return Object.keys(reportsByCategory).reduce((acc, category) => {
      acc[category] = reportsByCategory[category].length;
      return acc;
    }, {} as Record<string, number>);
  }, [reportsByCategory]);

  // Filter reports based on active category (memoized)
  const displayedReports = useMemo(() => {
    switch (activeCategory) {
      case 'All':
        return filteredReports;
      case 'Favorites':
        return favoriteReportsData;
      default:
        return reportsByCategory[activeCategory] || [];
    }
  }, [activeCategory, filteredReports, favoriteReportsData, reportsByCategory]);

  const toggleFavorite = (reportId: string) => {
    setFavoriteReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  return {
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
  };
};
