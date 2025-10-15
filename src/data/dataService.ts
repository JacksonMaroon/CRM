import { Account, Contact, CRMData, Opportunity, OpportunityStage, UUID } from './models';
import { cloneSampleData } from './sampleData';
import { createId } from './utils';
import { loadFromStorage, saveToStorage } from './storage';

type EntityType = 'accounts' | 'contacts' | 'opportunities';

const fallbackData = cloneSampleData();

let state: CRMData = loadFromStorage<CRMData>(fallbackData);
saveToStorage(state);

function commit(next: CRMData): CRMData {
  state = next;
  saveToStorage(state);
  return state;
}

export function getAll(): CRMData {
  return state;
}

function withUpdate(partial: Partial<CRMData>): CRMData {
  return commit({ ...state, ...partial });
}

function findIndexById<T extends { id: UUID }>(collection: T[], id: UUID): number {
  return collection.findIndex((item) => item.id === id);
}

export function createAccount(input: Omit<Account, 'id' | 'createdAt'>): CRMData {
  const account: Account = {
    ...input,
    id: createId(),
    createdAt: new Date().toISOString()
  };
  return withUpdate({ accounts: [...state.accounts, account] });
}

export function updateAccount(id: UUID, updates: Partial<Omit<Account, 'id' | 'createdAt'>>): CRMData {
  const index = findIndexById(state.accounts, id);
  if (index === -1) {
    throw new Error('Account not found');
  }
  const accounts = state.accounts.map((account) =>
    account.id === id ? { ...account, ...updates } : account
  );
  return withUpdate({ accounts });
}

export function deleteAccount(id: UUID): CRMData {
  const accounts = state.accounts.filter((account) => account.id !== id);
  const contacts = state.contacts.filter((contact) => contact.accountId !== id);
  const opportunities = state.opportunities.filter((opportunity) => opportunity.accountId !== id);
  return withUpdate({ accounts, contacts, opportunities });
}

export function createContact(input: Omit<Contact, 'id' | 'createdAt'>): CRMData {
  const contact: Contact = {
    ...input,
    id: createId(),
    createdAt: new Date().toISOString()
  };
  return withUpdate({ contacts: [...state.contacts, contact] });
}

export function updateContact(id: UUID, updates: Partial<Omit<Contact, 'id' | 'createdAt'>>): CRMData {
  const index = findIndexById(state.contacts, id);
  if (index === -1) {
    throw new Error('Contact not found');
  }
  const contacts = state.contacts.map((contact) =>
    contact.id === id ? { ...contact, ...updates } : contact
  );
  return withUpdate({ contacts });
}

export function deleteContact(id: UUID): CRMData {
  const contacts = state.contacts.filter((contact) => contact.id !== id);
  const opportunities = state.opportunities.map((opp) =>
    opp.contactId === id ? { ...opp, contactId: undefined } : opp
  );
  return withUpdate({ contacts, opportunities });
}

export function createOpportunity(
  input: Omit<Opportunity, 'id' | 'createdAt' | 'status'> & { status?: Opportunity['status'] }
): CRMData {
  const status = input.status ?? inferStatus(input.stage);
  const opportunity: Opportunity = {
    ...input,
    status,
    id: createId(),
    createdAt: new Date().toISOString()
  };
  return withUpdate({ opportunities: [...state.opportunities, opportunity] });
}

export function updateOpportunity(
  id: UUID,
  updates: Partial<Omit<Opportunity, 'id' | 'createdAt'>>
): CRMData {
  const index = findIndexById(state.opportunities, id);
  if (index === -1) {
    throw new Error('Opportunity not found');
  }
  const opportunities = state.opportunities.map((opportunity) =>
    opportunity.id === id
      ? { ...opportunity, ...updates, status: updates.status ?? inferStatus(updates.stage ?? opportunity.stage) }
      : opportunity
  );
  return withUpdate({ opportunities });
}

function inferStatus(stage: OpportunityStage): Opportunity['status'] {
  if (stage === 'Closed Won') return 'Won';
  if (stage === 'Closed Lost') return 'Lost';
  return 'Open';
}

export function deleteOpportunity(id: UUID): CRMData {
  const opportunities = state.opportunities.filter((opp) => opp.id !== id);
  return withUpdate({ opportunities });
}

export function resetData(): CRMData {
  return commit(cloneSampleData());
}

export function setState(next: CRMData): CRMData {
  return commit(next);
}

export function findById<T extends { id: UUID }>(type: EntityType, id: UUID): T | undefined {
  return (state[type] as unknown as T[]).find((item) => item.id === id);
}
