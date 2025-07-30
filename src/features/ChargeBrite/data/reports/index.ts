
import { subscriberReports } from './subscriberReports';
import { performanceReports } from './performanceReports';
import { revenueReports } from './revenueReports';

export const reportsConfig = [
  ...revenueReports,
  ...subscriberReports,
  ...performanceReports
];
