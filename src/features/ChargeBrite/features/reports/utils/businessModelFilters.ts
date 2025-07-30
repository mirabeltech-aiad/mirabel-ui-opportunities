import { BusinessModel } from '@/contexts/BusinessModelContext';

export interface ReportWithBusinessModel {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  color: string;
  iconColor: string;
  component?: any;
  applicableBusinessModels?: BusinessModel[];
}

/**
 * Filters reports based on the current business model
 * For SaaS: Excludes reports specific to print/digital subscriptions
 * For Media: Shows all applicable reports
 */
export const filterReportsByBusinessModel = (
  reports: ReportWithBusinessModel[],
  businessModel: BusinessModel
): ReportWithBusinessModel[] => {
  return reports.filter(report => {
    // If no applicableBusinessModels specified, assume it's universal
    if (!report.applicableBusinessModels || report.applicableBusinessModels.length === 0) {
      return true;
    }
    
    // Check if the current business model is in the list of applicable models
    return report.applicableBusinessModels.includes(businessModel);
  });
};

/**
 * Gets reports that are excluded for a specific business model
 * Useful for auditing and understanding what's filtered out
 */
export const getExcludedReports = (
  reports: ReportWithBusinessModel[],
  businessModel: BusinessModel
): ReportWithBusinessModel[] => {
  return reports.filter(report => {
    // If no applicableBusinessModels specified, it's not excluded
    if (!report.applicableBusinessModels || report.applicableBusinessModels.length === 0) {
      return false;
    }
    
    // Return true if the current business model is NOT in the list
    return !report.applicableBusinessModels.includes(businessModel);
  });
};

/**
 * Audit function to identify media-specific reports
 * Returns reports that contain print/digital subscription concepts
 */
export const auditMediaSpecificReports = (reports: ReportWithBusinessModel[]) => {
  const mediaKeywords = [
    'print', 'digital', 'magazine', 'issue', 'fulfillment', 
    'circulation', 'publication', 'complimentary', 'gift'
  ];
  
  return reports.filter(report => {
    const hasMediaKeywords = report.keywords.some(keyword =>
      mediaKeywords.some(mediaKeyword => keyword.toLowerCase().includes(mediaKeyword))
    );
    
    const hasMediaInDescription = mediaKeywords.some(mediaKeyword =>
      report.description.toLowerCase().includes(mediaKeyword) ||
      report.title.toLowerCase().includes(mediaKeyword)
    );
    
    return hasMediaKeywords || hasMediaInDescription;
  });
};