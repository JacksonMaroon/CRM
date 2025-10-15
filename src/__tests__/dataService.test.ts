import { describe, expect, it, beforeEach } from 'vitest';
import {
  createAccount,
  createContact,
  createOpportunity,
  deleteAccount,
  getAll,
  resetData,
  updateOpportunity
} from '../data/dataService';
import { OPPORTUNITY_STAGES } from '../data/constants';

beforeEach(() => {
  resetData();
  window.localStorage.clear();
});

describe('dataService', () => {
  it('creates accounts and persists them', () => {
    const initialCount = getAll().accounts.length;
    const nextState = createAccount({
      name: 'Globex Corporation',
      industry: 'Technology',
      website: 'https://globex.example.com',
      description: 'Enterprise technology provider',
      annualRevenue: 120000000
    });

    expect(nextState.accounts).toHaveLength(initialCount + 1);
    const created = nextState.accounts[nextState.accounts.length - 1];
    const stored = JSON.parse(window.localStorage.getItem('crm-data') ?? '{}');
    expect(stored.accounts[stored.accounts.length - 1].id).toBe(created.id);
  });

  it('cascades related entities when deleting an account', () => {
    const { accounts, contacts, opportunities } = getAll();
    const accountId = accounts[0].id;
    const contactId = contacts.find((contact) => contact.accountId === accountId)?.id;

    expect(contactId).toBeDefined();
    deleteAccount(accountId);

    const state = getAll();
    expect(state.accounts.some((account) => account.id === accountId)).toBe(false);
    expect(state.contacts.some((contact) => contact.accountId === accountId)).toBe(false);
    expect(state.opportunities.some((opp) => opp.accountId === accountId)).toBe(false);
  });

  it('derives status from stage changes', () => {
    const state = getAll();
    const opportunity = state.opportunities[0];

    const updated = updateOpportunity(opportunity.id, { stage: 'Closed Won' });
    const updatedOpp = updated.opportunities.find((opp) => opp.id === opportunity.id);
    expect(updatedOpp?.status).toBe('Won');

    const reopened = updateOpportunity(opportunity.id, { stage: OPPORTUNITY_STAGES[0] });
    const reopenedOpp = reopened.opportunities.find((opp) => opp.id === opportunity.id);
    expect(reopenedOpp?.status).toBe('Open');
  });

  it('supports creating contacts and opportunities for new accounts', () => {
    const next = createAccount({
      name: 'Wayne Enterprises',
      industry: 'Industrial',
      description: 'Diversified industrial conglomerate',
      website: 'https://wayne.example.com'
    });
    const accountId = next.accounts[next.accounts.length - 1].id;
    const contactsState = createContact({
      accountId,
      firstName: 'Lucius',
      lastName: 'Fox',
      email: 'lucius.fox@wayne.example.com',
      jobTitle: 'CTO'
    });
    const contactId = contactsState.contacts[contactsState.contacts.length - 1].id;

    const opportunitiesState = createOpportunity({
      accountId,
      contactId,
      name: 'R&D Modernization',
      stage: 'Qualification',
      amount: 250000,
      closeDate: new Date().toISOString()
    });

    const createdOpp = opportunitiesState.opportunities[opportunitiesState.opportunities.length - 1];
    expect(createdOpp.accountId).toBe(accountId);
    expect(createdOpp.contactId).toBe(contactId);
  });
});
