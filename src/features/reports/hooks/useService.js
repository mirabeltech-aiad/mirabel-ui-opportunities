import { getReportsDashboard, postReportsDashboard } from "@/features/reports/services/reportsApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to fetch reports dashboard data using React Query
 * @returns {Object} Query result with data, loading, error states
 */
export const useReportsDashboard = () => {
  return useQuery({
    queryKey: ["reports-dashboard"],
    queryFn: getReportsDashboard,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to update report star status using React Query mutation
 * @returns {Object} Mutation result with mutate function, loading, error states
 */
export const useUpdateReportStar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postReportsDashboard,
    onSuccess: (response) => {
      console.log('Report star status updated successfully:', response);
      
      // Invalidate and refetch reports data to get the latest state
      queryClient.invalidateQueries({ queryKey: ["reports-dashboard"] });
    },
    onError: (error) => {
      console.error('Error updating report star status:', error);
    },
  });
};

/**
 * Helper function to prepare the payload for star toggle
 * @param {Object} report - The report object
 * @param {boolean} isStarred - The new star status
 * @returns {Object} Formatted payload for API
 */
export const prepareStarTogglePayload = (report, isStarred) => {
  return {
    Id: report.id,
    Icon: report.icon,
    Title: report.title,
    Description: report.description,
    Tags: report.tags,
    Category: report.category,
    RoutePath: report.routePath,
    IsStarred: isStarred,
    IsAdmin: report.isAdmin,
    UserId: report.usedID,
    ModifiedTitle: report.modifiedTitle,
    CreatedDate: report.createdDate || new Date().toISOString(),
    ModifiedDate: report.modifiedDate || null,
    IsMaster: report.isMaster || false,
    SortOrder: report.sortOrder || 0
  };
}; 