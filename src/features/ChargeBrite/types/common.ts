/**
 * Common type utilities and shared interfaces
 * 
 * Utility types and common interfaces used throughout the application
 */

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface BaseEntity {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

export interface MetricCard {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  trend?: 'up' | 'down' | 'stable';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export type BusinessModel = 'media' | 'saas';

export type ReportCategory = 'subscriber' | 'revenue' | 'performance';