// Common types for report services
export interface ReportFilters {
  businessUnitIds?: string[];
  productIds?: string[];
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
}

export interface GeographicStats {
  [country: string]: {
    total: number;
    print: number;
    digital: number;
    revenue: number;
    states: {
      [state: string]: {
        total: number;
        print: number;
        digital: number;
        revenue: number;
        cities: {
          [city: string]: {
            total: number;
            print: number;
            digital: number;
            revenue: number;
          };
        };
      };
    };
  };
}

export interface AcquisitionStats {
  monthly: Record<string, {
    subscriptions: number;
    revenue: number;
    channels: Record<string, any>;
  }>;
  channels: Record<string, {
    subscriptions: number;
    revenue: number;
    conversionRate: number;
  }>;
  totals: {
    subscriptions: number;
    revenue: number;
  };
}