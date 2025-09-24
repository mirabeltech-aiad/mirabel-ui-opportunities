// Constants for opportunity form options
export const OPPORTUNITY_STATUS_OPTIONS = [
  { value: 'Open', label: 'Open' },
  { value: 'Won', label: 'Won' },
  { value: 'Lost', label: 'Lost' }
];

export const OPPORTUNITY_PROBABILITY_OPTIONS = [
  { value: '0', label: '0%' },
  { value: '10', label: '10%' },
  { value: '20', label: '20%' },
  { value: '30', label: '30%' },
  { value: '40', label: '40%' },
  { value: '50', label: '50%' },
  { value: '60', label: '60%' },
  { value: '70', label: '70%' },
  { value: '80', label: '80%' },
  { value: '90', label: '90%' },
  { value: '100', label: '100%' }
];

export const OPPORTUNITY_PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Critical', label: 'Critical' }
];

export const OPPORTUNITY_LEAD_SOURCES = [
  { value: 'Website', label: 'Website' },
  { value: 'Referral', label: 'Referral' },
  { value: 'Cold Call', label: 'Cold Call' },
  { value: 'Email Campaign', label: 'Email Campaign' },
  { value: 'Social Media', label: 'Social Media' },
  { value: 'Trade Show', label: 'Trade Show' },
  { value: 'Advertisement', label: 'Advertisement' },
  { value: 'Partner', label: 'Partner' },
  { value: 'Other', label: 'Other' }
];

export const OPPORTUNITY_LEAD_TYPES = [
  { value: 'New Business', label: 'New Business' },
  { value: 'Existing Customer', label: 'Existing Customer' },
  { value: 'Renewal', label: 'Renewal' },
  { value: 'Upsell', label: 'Upsell' },
  { value: 'Cross-sell', label: 'Cross-sell' }
];

export const OPPORTUNITY_LEAD_STATUS = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Unqualified', label: 'Unqualified' },
  { value: 'Nurturing', label: 'Nurturing' }
];

// Default stage percentages mapping
export const STAGE_PERCENTAGES: Record<string, number> = {
  'Lead': 0,
  'Discovery': 10,
  '1st Demo': 25,
  'Proposal': 50,
  'Negotiation': 75,
  'Closed Won': 100,
  'Closed Lost': 0
};

// Stage name constants for consistency
export const STAGE_NAMES = {
  CLOSED_WON: 'Closed Won',
  CLOSED_LOST: 'Closed Lost',
  LEAD: 'Lead',
  DISCOVERY: 'Discovery',
  DEMO: '1st Demo',
  PROPOSAL: 'Proposal',
  NEGOTIATION: 'Negotiation'
} as const;

// Helper function to find stage ID by name from loaded stages
export const findStageIdByName = (stages: Array<{ id: string, name: string }>, stageName: string): string | null => {
  const stage = stages.find(s => s.name === stageName);
  return stage ? stage.id : null;
};