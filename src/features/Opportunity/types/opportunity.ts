// Type definitions for opportunity data structures
export interface Opportunity {
  id: number;
  opportunityId: string; // Auto-generated unique identifier
  proposalId?: string; // Optional proposal ID field
  status: 'Open' | 'Closed' | 'Won' | 'Lost' | 'Draft';
  name: string;
  company: string;
  createdDate: string;
  assignedRep: string;
  stage: '1st Demo' | 'Discovery' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  amount: number;
  projCloseDate: string;
  source: string;
  leadSource: string;
  leadType: string;
  salesPresentation: string;
  createdBy: string;
  actualCloseDate: string;
  stagePercentage: number; // New field for stage completion percentage
}

export interface OpportunityStats {
  total: number;
  amount: number;
  won: number;
  open: number;
  lost: number;
  winTotal: number;
  winPercentage: number;
}

export type ViewType = 'table' | 'cards' | 'kanban' | 'split';

export interface CompanyData {
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  ext: string;
  mobile: string;
  email: string;
  address: string;
  website: string;
  industry: string;
  employees: string;
}
