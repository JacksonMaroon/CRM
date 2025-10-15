import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  CRMData,
  Account,
  Contact,
  Opportunity,
  OpportunityStage,
  UUID
} from '../data/models';
import * as service from '../data/dataService';

interface DataContextValue extends CRMData {
  refresh: () => void;
  createAccount: (input: Omit<Account, 'id' | 'createdAt'>) => CRMData;
  updateAccount: (id: UUID, updates: Partial<Omit<Account, 'id' | 'createdAt'>>) => CRMData;
  deleteAccount: (id: UUID) => CRMData;
  createContact: (input: Omit<Contact, 'id' | 'createdAt'>) => CRMData;
  updateContact: (id: UUID, updates: Partial<Omit<Contact, 'id' | 'createdAt'>>) => CRMData;
  deleteContact: (id: UUID) => CRMData;
  createOpportunity: (
    input: Omit<Opportunity, 'id' | 'createdAt' | 'status'> & { status?: Opportunity['status'] }
  ) => CRMData;
  updateOpportunity: (
    id: UUID,
    updates: Partial<Omit<Opportunity, 'id' | 'createdAt'>>
  ) => CRMData;
  deleteOpportunity: (id: UUID) => CRMData;
  reset: () => CRMData;
  findAccount: (id: UUID) => Account | undefined;
  findContact: (id: UUID) => Contact | undefined;
  findOpportunity: (id: UUID) => Opportunity | undefined;
  pipelineValue: number;
  stageCounts: Record<OpportunityStage, number>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [data, setData] = useState<CRMData>(service.getAll());

  const refresh = useCallback(() => {
    setData({ ...service.getAll() });
  }, []);

  const updateState = useCallback((next: CRMData) => {
    setData({ ...next });
    return next;
  }, []);

  const actions = useMemo(
    () => ({
      refresh,
      createAccount: (input: Omit<Account, 'id' | 'createdAt'>) => updateState(service.createAccount(input)),
      updateAccount: (id: UUID, updates: Partial<Omit<Account, 'id' | 'createdAt'>>) =>
        updateState(service.updateAccount(id, updates)),
      deleteAccount: (id: UUID) => updateState(service.deleteAccount(id)),
      createContact: (input: Omit<Contact, 'id' | 'createdAt'>) => updateState(service.createContact(input)),
      updateContact: (id: UUID, updates: Partial<Omit<Contact, 'id' | 'createdAt'>>) =>
        updateState(service.updateContact(id, updates)),
      deleteContact: (id: UUID) => updateState(service.deleteContact(id)),
      createOpportunity: (
        input: Omit<Opportunity, 'id' | 'createdAt' | 'status'> & { status?: Opportunity['status'] }
      ) => updateState(service.createOpportunity(input)),
      updateOpportunity: (
        id: UUID,
        updates: Partial<Omit<Opportunity, 'id' | 'createdAt'>>
      ) => updateState(service.updateOpportunity(id, updates)),
      deleteOpportunity: (id: UUID) => updateState(service.deleteOpportunity(id)),
      reset: () => updateState(service.resetData())
    }),
    [refresh, updateState]
  );

  const findAccount = useCallback((id: UUID) => data.accounts.find((account) => account.id === id), [data.accounts]);
  const findContact = useCallback((id: UUID) => data.contacts.find((contact) => contact.id === id), [data.contacts]);
  const findOpportunity = useCallback(
    (id: UUID) => data.opportunities.find((opportunity) => opportunity.id === id),
    [data.opportunities]
  );

  const stageCounts = useMemo(() => {
    const stages: Record<OpportunityStage, number> = {
      Prospecting: 0,
      Qualification: 0,
      Proposal: 0,
      Negotiation: 0,
      'Closed Won': 0,
      'Closed Lost': 0
    };
    data.opportunities.forEach((opp) => {
      stages[opp.stage] += 1;
    });
    return stages;
  }, [data.opportunities]);

  const pipelineValue = useMemo(
    () => data.opportunities.filter((opp) => opp.status === 'Open').reduce((sum, opp) => sum + opp.amount, 0),
    [data.opportunities]
  );

  const value: DataContextValue = {
    ...data,
    ...actions,
    findAccount,
    findContact,
    findOpportunity,
    pipelineValue,
    stageCounts
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used within DataProvider');
  }
  return ctx;
}
