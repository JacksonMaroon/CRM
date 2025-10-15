(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const exports = factory();
    root.AcumenCRM = Object.assign({}, root.AcumenCRM || {}, exports);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const PIPELINE_STAGES = [
    { id: 'leads', label: 'Leads' },
    { id: 'qualified', label: 'Qualified' },
    { id: 'proposal', label: 'Proposal' },
    { id: 'negotiation', label: 'Negotiation' },
    { id: 'closed-won', label: 'Closed Won' },
    { id: 'closed-lost', label: 'Closed Lost' }
  ];

  const ACCOUNT_STATUSES = ['Active', 'Prospect', 'Churned'];

  function createMemoryStorage(initial = {}) {
    const store = new Map(Object.entries(initial));
    return {
      getItem(key) {
        return store.has(key) ? store.get(key) : null;
      },
      setItem(key, value) {
        store.set(key, value);
      },
      removeItem(key) {
        store.delete(key);
      },
      clear() {
        store.clear();
      }
    };
  }

  function getDefaultStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      return globalThis.localStorage;
    }
    return createMemoryStorage();
  }

  class DataStore {
    constructor(options = {}) {
      if (typeof options === 'string') {
        this.storageKey = options;
        this.storage = getDefaultStorage();
      } else {
        this.storageKey = options.storageKey || 'acumen-crm-data';
        this.storage = options.storage || getDefaultStorage();
      }
      this.data = this.load();
    }

    load() {
      let raw = null;
      if (this.storage && typeof this.storage.getItem === 'function') {
        try {
          raw = this.storage.getItem(this.storageKey);
        } catch (error) {
          console.warn('Unable to access storage, using in-memory fallback.', error);
          this.storage = createMemoryStorage();
        }
      }

      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.accounts && parsed.contacts && parsed.opportunities) {
            return parsed;
          }
        } catch (error) {
          console.warn('Failed to parse CRM data, using defaults', error);
        }
      }

      const defaults = this.seedDefaults();
      this.persist(defaults);
      return defaults;
    }

    seedDefaults() {
      const accountA = this.generateId('acc');
      const accountB = this.generateId('acc');
      const accountC = this.generateId('acc');
      const contactA = this.generateId('con');
      const contactB = this.generateId('con');
      const contactC = this.generateId('con');
      const contactD = this.generateId('con');
      const opportunityA = this.generateId('opp');
      const opportunityB = this.generateId('opp');
      const opportunityC = this.generateId('opp');

      return {
        accounts: [
          {
            id: accountA,
            name: 'Nimbus Analytics',
            industry: 'SaaS',
            website: 'https://nimbusanalytics.com',
            employeeCount: 180,
            status: 'Active'
          },
          {
            id: accountB,
            name: 'Harbor & Co. Logistics',
            industry: 'Logistics',
            website: 'https://harborandco.com',
            employeeCount: 420,
            status: 'Prospect'
          },
          {
            id: accountC,
            name: 'Radiant Health Partners',
            industry: 'Healthcare',
            website: 'https://radianthealthpartners.com',
            employeeCount: 95,
            status: 'Active'
          }
        ],
        contacts: [
          {
            id: contactA,
            name: 'Alicia Hart',
            email: 'alicia.hart@nimbusanalytics.com',
            phone: '(415) 555-0182',
            jobTitle: 'VP of Revenue Operations',
            accountId: accountA
          },
          {
            id: contactB,
            name: 'Marcus Levine',
            email: 'marcus.levine@nimbusanalytics.com',
            phone: '(415) 555-0134',
            jobTitle: 'Director of Sales Enablement',
            accountId: accountA
          },
          {
            id: contactC,
            name: 'Priya Malhotra',
            email: 'priya.malhotra@harborandco.com',
            phone: '(312) 555-0110',
            jobTitle: 'Chief Operating Officer',
            accountId: accountB
          },
          {
            id: contactD,
            name: 'Ethan Cole',
            email: 'ethan.cole@radianthealthpartners.com',
            phone: '(617) 555-0141',
            jobTitle: 'Head of Procurement',
            accountId: accountC
          }
        ],
        opportunities: [
          {
            id: opportunityA,
            name: 'Revenue Intelligence Rollout',
            value: 120000,
            stage: 'negotiation',
            expectedCloseDate: new Date().toISOString().slice(0, 10),
            accountId: accountA,
            primaryContactId: contactA
          },
          {
            id: opportunityB,
            name: 'Supply Chain Visibility Suite',
            value: 185000,
            stage: 'proposal',
            expectedCloseDate: this.addDays(30),
            accountId: accountB,
            primaryContactId: contactC
          },
          {
            id: opportunityC,
            name: 'Patient Engagement Platform',
            value: 96000,
            stage: 'qualified',
            expectedCloseDate: this.addDays(45),
            accountId: accountC,
            primaryContactId: contactD
          }
        ]
      };
    }

    addDays(days) {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date.toISOString().slice(0, 10);
    }

    persist(data = this.data) {
      if (!this.storage || typeof this.storage.setItem !== 'function') {
        return;
      }
      try {
        this.storage.setItem(this.storageKey, JSON.stringify(data));
      } catch (error) {
        console.warn('Failed to persist CRM data.', error);
      }
    }

    generateId(prefix) {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return `${prefix}-${crypto.randomUUID()}`;
      }
      return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
    }

    clone() {
      return JSON.parse(JSON.stringify(this.data));
    }

    getAccounts() {
      return [...this.data.accounts].sort((a, b) => a.name.localeCompare(b.name));
    }

    getContacts() {
      return [...this.data.contacts].sort((a, b) => a.name.localeCompare(b.name));
    }

    getOpportunities() {
      return [...this.data.opportunities].sort((a, b) => a.name.localeCompare(b.name));
    }

    getAccountById(id) {
      return this.data.accounts.find((account) => account.id === id) || null;
    }

    getContactById(id) {
      return this.data.contacts.find((contact) => contact.id === id) || null;
    }

    getOpportunityById(id) {
      return this.data.opportunities.find((opportunity) => opportunity.id === id) || null;
    }

    getContactsByAccount(accountId) {
      return this.getContacts().filter((contact) => contact.accountId === accountId);
    }

    getOpportunitiesByAccount(accountId) {
      return this.getOpportunities().filter((opportunity) => opportunity.accountId === accountId);
    }

    createAccount(payload) {
      const account = { id: this.generateId('acc'), ...payload };
      this.data.accounts.push(account);
      this.persist();
      return account;
    }

    updateAccount(id, payload) {
      const index = this.data.accounts.findIndex((account) => account.id === id);
      if (index === -1) return null;
      this.data.accounts[index] = { ...this.data.accounts[index], ...payload };
      this.persist();
      return this.data.accounts[index];
    }

    deleteAccount(id) {
      this.data.accounts = this.data.accounts.filter((account) => account.id !== id);
      this.data.contacts = this.data.contacts.filter((contact) => contact.accountId !== id);
      this.data.opportunities = this.data.opportunities.filter((opportunity) => opportunity.accountId !== id);
      this.persist();
    }

    createContact(payload) {
      const contact = { id: this.generateId('con'), ...payload };
      this.data.contacts.push(contact);
      this.persist();
      return contact;
    }

    updateContact(id, payload) {
      const index = this.data.contacts.findIndex((contact) => contact.id === id);
      if (index === -1) return null;
      this.data.contacts[index] = { ...this.data.contacts[index], ...payload };

      this.data.opportunities = this.data.opportunities.map((opportunity) => {
        if (opportunity.primaryContactId === id && opportunity.accountId !== this.data.contacts[index].accountId) {
          return { ...opportunity, primaryContactId: null };
        }
        return opportunity;
      });

      this.persist();
      return this.data.contacts[index];
    }

    deleteContact(id) {
      this.data.contacts = this.data.contacts.filter((contact) => contact.id !== id);
      this.data.opportunities = this.data.opportunities.map((opportunity) => {
        if (opportunity.primaryContactId === id) {
          return { ...opportunity, primaryContactId: null };
        }
        return opportunity;
      });
      this.persist();
    }

    createOpportunity(payload) {
      const opportunity = { id: this.generateId('opp'), ...payload };
      this.data.opportunities.push(opportunity);
      this.persist();
      return opportunity;
    }

    updateOpportunity(id, payload) {
      const index = this.data.opportunities.findIndex((opportunity) => opportunity.id === id);
      if (index === -1) return null;
      this.data.opportunities[index] = { ...this.data.opportunities[index], ...payload };
      this.persist();
      return this.data.opportunities[index];
    }

    deleteOpportunity(id) {
      this.data.opportunities = this.data.opportunities.filter((opportunity) => opportunity.id !== id);
      this.persist();
    }

    getMetrics() {
      const pipelineValue = this.data.opportunities
        .filter((opportunity) => opportunity.stage !== 'closed-lost')
        .reduce((sum, opportunity) => sum + Number(opportunity.value || 0), 0);

      const closedWonValue = this.data.opportunities
        .filter((opportunity) => opportunity.stage === 'closed-won')
        .reduce((sum, opportunity) => sum + Number(opportunity.value || 0), 0);

      return {
        totalAccounts: this.data.accounts.length,
        totalContacts: this.data.contacts.length,
        totalOpportunities: this.data.opportunities.length,
        pipelineValue,
        closedWonValue
      };
    }

    getStageValue(stage) {
      return this.data.opportunities
        .filter((opportunity) => opportunity.stage === stage)
        .reduce((sum, opportunity) => sum + Number(opportunity.value || 0), 0);
    }
  }

  return {
    PIPELINE_STAGES,
    ACCOUNT_STATUSES,
    DataStore,
    createMemoryStorage
  };
});
