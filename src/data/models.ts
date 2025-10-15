export type UUID = string;

export interface Account {
  id: UUID;
  name: string;
  industry: string;
  website?: string;
  description?: string;
  annualRevenue?: number;
  createdAt: string;
}

export interface Contact {
  id: UUID;
  accountId: UUID;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  createdAt: string;
}

export type OpportunityStage =
  | 'Prospecting'
  | 'Qualification'
  | 'Proposal'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost';

export interface Opportunity {
  id: UUID;
  accountId: UUID;
  contactId?: UUID;
  name: string;
  stage: OpportunityStage;
  amount: number;
  closeDate: string;
  status: 'Open' | 'Won' | 'Lost';
  createdAt: string;
}

export interface CRMData {
  accounts: Account[];
  contacts: Contact[];
  opportunities: Opportunity[];
}
