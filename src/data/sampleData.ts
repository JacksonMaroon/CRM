import { CRMData } from './models';
import { createId } from './utils';

export const sampleData: CRMData = {
  accounts: [
    {
      id: createId(),
      name: 'Acme Corporation',
      industry: 'Manufacturing',
      website: 'https://acme.example.com',
      description: 'Global manufacturer of innovative industrial solutions.',
      annualRevenue: 125000000,
      createdAt: new Date('2023-01-15').toISOString()
    },
    {
      id: createId(),
      name: 'Northwind Traders',
      industry: 'Distribution',
      website: 'https://northwind.example.com',
      description: 'Leading distributor of specialty foods and beverages.',
      annualRevenue: 89000000,
      createdAt: new Date('2023-03-22').toISOString()
    }
  ],
  contacts: [],
  opportunities: []
};

const contacts = [
  {
    id: createId(),
    accountId: sampleData.accounts[0].id,
    firstName: 'Olivia',
    lastName: 'Reed',
    email: 'olivia.reed@acme.example.com',
    phone: '+1-555-0184',
    jobTitle: 'Director of Operations',
    createdAt: new Date('2023-02-01').toISOString()
  },
  {
    id: createId(),
    accountId: sampleData.accounts[0].id,
    firstName: 'Noah',
    lastName: 'Chen',
    email: 'noah.chen@acme.example.com',
    phone: '+1-555-0116',
    jobTitle: 'Procurement Manager',
    createdAt: new Date('2023-02-18').toISOString()
  },
  {
    id: createId(),
    accountId: sampleData.accounts[1].id,
    firstName: 'Sophia',
    lastName: 'Martinez',
    email: 'sophia.martinez@northwind.example.com',
    phone: '+1-555-0121',
    jobTitle: 'VP of Purchasing',
    createdAt: new Date('2023-04-10').toISOString()
  }
];

const opportunities = [
  {
    id: createId(),
    accountId: sampleData.accounts[0].id,
    contactId: contacts[0].id,
    name: 'Factory Automation Upgrade',
    stage: 'Proposal' as const,
    amount: 450000,
    closeDate: new Date('2024-06-30').toISOString(),
    status: 'Open' as const,
    createdAt: new Date('2023-05-01').toISOString()
  },
  {
    id: createId(),
    accountId: sampleData.accounts[1].id,
    contactId: contacts[2].id,
    name: 'Cold Storage Modernization',
    stage: 'Negotiation' as const,
    amount: 320000,
    closeDate: new Date('2024-04-15').toISOString(),
    status: 'Open' as const,
    createdAt: new Date('2023-07-18').toISOString()
  },
  {
    id: createId(),
    accountId: sampleData.accounts[0].id,
    contactId: contacts[1].id,
    name: 'Maintenance Support Renewal',
    stage: 'Closed Won' as const,
    amount: 180000,
    closeDate: new Date('2023-12-20').toISOString(),
    status: 'Won' as const,
    createdAt: new Date('2023-08-04').toISOString()
  }
];

sampleData.contacts = contacts;
sampleData.opportunities = opportunities;

export function cloneSampleData(): CRMData {
  return JSON.parse(JSON.stringify(sampleData));
}
