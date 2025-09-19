import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

interface PageContext {
  pageName: string;
  filePath: string;
  description?: string;
}

// Map of routes to their corresponding file paths and descriptions
const PAGE_MAPPINGS: Record<string, PageContext> = {
  '/': {
    pageName: 'Dashboard',
    filePath: 'src/pages/Dashboard.tsx',
    description: 'Main dashboard with analytics overview'
  },
  '/products': {
    pageName: 'Products Management',
    filePath: 'src/features/products/pages/ProductsPage.tsx',
    description: 'Product listing, filtering, and management interface'
  },
  '/products/table': {
    pageName: 'Products Table View',
    filePath: 'src/features/products/components/ProductsTable.tsx',
    description: 'Enhanced data table for product management'
  },
  '/schedules': {
    pageName: 'Schedule Management',
    filePath: 'src/features/schedules/pages/ScheduleSetUpPage.tsx',
    description: 'Schedule creation and management interface'
  },
  '/schedules/setup': {
    pageName: 'Schedule Setup',
    filePath: 'src/features/schedules/pages/ScheduleSetUpPage.tsx',
    description: 'Schedule configuration and setup wizard'
  },
  '/analytics': {
    pageName: 'Analytics Dashboard',
    filePath: 'src/features/analytics/pages/AnalyticsPage.tsx',
    description: 'Business analytics and reporting dashboard'
  },
  '/time-tracking': {
    pageName: 'Time Tracking',
    filePath: 'src/features/time-tracking/pages/TimeTrackingPage.tsx',
    description: 'Time entry and tracking interface'
  },
  '/training-hours': {
    pageName: 'Training Hours',
    filePath: 'src/features/training-hours/pages/TrainingHoursPage.tsx',
    description: 'Training time management and reporting'
  },
  '/billing-reports': {
    pageName: 'Billing Reports',
    filePath: 'src/features/billing-reports/pages/BillingReportsPage.tsx',
    description: 'Billing analysis and report generation'
  },
  '/design-system': {
    pageName: 'Design System Demo',
    filePath: 'src/pages/DesignSystemDemo.tsx',
    description: 'Design system components showcase and testing'
  }
};

export const usePageContext = (
  overrides?: Partial<PageContext>
): PageContext => {
  const location = useLocation();
  
  return useMemo(() => {
    const defaultContext = PAGE_MAPPINGS[location.pathname] || {
      pageName: 'Unknown Page',
      filePath: 'Unknown file path',
      description: 'Page context not mapped'
    };

    return {
      ...defaultContext,
      ...overrides
    };
  }, [location.pathname, overrides]);
};

export default usePageContext;