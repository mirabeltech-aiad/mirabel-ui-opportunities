
import { HelpItem } from './types';
import { dashboardHelpItems } from './dashboardHelpItems';
import { circulationHelpItems } from './circulationHelpItems';
import { revenueHelpItems } from './revenueHelpItems';
import { analyticsHelpItems } from './analyticsHelpItems';
import { lifecycleHelpItems } from './lifecycleHelpItems';
import { pricingHelpItems } from './pricingHelpItems';
import { reportsHelpItems } from './reportsHelpItems';
import { contractExpansionHelpItems } from './contractExpansionHelpItems';

export const getAllHelpItems = (): HelpItem[] => {
  return [
    ...dashboardHelpItems,
    ...circulationHelpItems,
    ...revenueHelpItems,
    ...analyticsHelpItems,
    ...lifecycleHelpItems,
    ...pricingHelpItems,
    ...reportsHelpItems,
    ...contractExpansionHelpItems
  ];
};
