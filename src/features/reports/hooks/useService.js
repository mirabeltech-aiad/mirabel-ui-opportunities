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
    onMutate: async (updatedReport) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["reports-dashboard"] });

      // Snapshot the previous value
      const previousReports = queryClient.getQueryData(["reports-dashboard"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["reports-dashboard"], old => {
        const oldData = old || { Reports: [], Categories: [] };
        return {
          ...oldData,
          Reports: oldData.Reports.map(report =>
            report.Id === updatedReport.Id ? { ...report, IsStarred: updatedReport.IsStarred } : report
          ),
        };
      });

      // Return a context object with the snapshotted value
      return { previousReports };
    },
    onError: (err, newReport, context) => {
      // Rollback to the previous value if mutation fails
      queryClient.setQueryData(["reports-dashboard"], context.previousReports);
      console.error('Error updating report star status:', err);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["reports-dashboard"] });
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
    UserId: 1,
    ModifiedTitle: report.modifiedTitle,
    CreatedDate: report.createdDate || new Date().toISOString(),
    ModifiedDate: report.modifiedDate || null,
    IsMaster: false,
    SortOrder: report.sortOrder || 0
  };
}; 