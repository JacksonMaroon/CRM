const existingCRM = (typeof window !== 'undefined' && window.AcumenCRM) || {};

const PIPELINE_STAGES = existingCRM.PIPELINE_STAGES || [
  { id: 'leads', label: 'Leads' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'closed-won', label: 'Closed Won' },
  { id: 'closed-lost', label: 'Closed Lost' },
];

const ACCOUNT_STATUSES = existingCRM.ACCOUNT_STATUSES || ['Active', 'Prospect', 'Churned'];

class DefaultDataStore {
  constructor(storageKey = 'acumen-crm-data') {
    this.storageKey = storageKey;
    this.data = this.load();
  }

  load() {
    const raw = window.localStorage.getItem(this.storageKey);
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
          status: 'Active',
        },
        {
          id: accountB,
          name: 'Harbor & Co. Logistics',
          industry: 'Logistics',
          website: 'https://harborandco.com',
          employeeCount: 420,
          status: 'Prospect',
        },
        {
          id: accountC,
          name: 'Radiant Health Partners',
          industry: 'Healthcare',
          website: 'https://radianthealthpartners.com',
          employeeCount: 95,
          status: 'Active',
        },
      ],
      contacts: [
        {
          id: contactA,
          name: 'Alicia Hart',
          email: 'alicia.hart@nimbusanalytics.com',
          phone: '(415) 555-0182',
          jobTitle: 'VP of Revenue Operations',
          accountId: accountA,
        },
        {
          id: contactB,
          name: 'Marcus Levine',
          email: 'marcus.levine@nimbusanalytics.com',
          phone: '(415) 555-0134',
          jobTitle: 'Director of Sales Enablement',
          accountId: accountA,
        },
        {
          id: contactC,
          name: 'Priya Malhotra',
          email: 'priya.malhotra@harborandco.com',
          phone: '(312) 555-0110',
          jobTitle: 'Chief Operating Officer',
          accountId: accountB,
        },
        {
          id: contactD,
          name: 'Ethan Cole',
          email: 'ethan.cole@radianthealthpartners.com',
          phone: '(617) 555-0141',
          jobTitle: 'Head of Procurement',
          accountId: accountC,
        },
      ],
      opportunities: [
        {
          id: opportunityA,
          name: 'Revenue Intelligence Rollout',
          value: 120000,
          stage: 'negotiation',
          expectedCloseDate: new Date().toISOString().slice(0, 10),
          accountId: accountA,
          primaryContactId: contactA,
        },
        {
          id: opportunityB,
          name: 'Supply Chain Visibility Suite',
          value: 185000,
          stage: 'proposal',
          expectedCloseDate: this.addDays(30),
          accountId: accountB,
          primaryContactId: contactC,
        },
        {
          id: opportunityC,
          name: 'Patient Engagement Platform',
          value: 96000,
          stage: 'qualified',
          expectedCloseDate: this.addDays(45),
          accountId: accountC,
          primaryContactId: contactD,
        },
      ],
    };
  }

  addDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  persist(data = this.data) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  generateId(prefix) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
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

    // ensure related opportunities reference a contact that belongs to same account
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
      closedWonValue,
    };
  }

  getStageValue(stage) {
    return this.data.opportunities
      .filter((opportunity) => opportunity.stage === stage)
      .reduce((sum, opportunity) => sum + Number(opportunity.value || 0), 0);
  }
}

const DataStore = existingCRM.DataStore || DefaultDataStore;

if (typeof window !== 'undefined') {
  window.AcumenCRM = {
    ...window.AcumenCRM,
    DataStore,
    PIPELINE_STAGES,
    ACCOUNT_STATUSES,
  };
}

const store = new DataStore();
const state = {
  section: 'accounts',
  view: 'list',
  selectedId: null,
  formMode: null,
};

const app = document.getElementById('app');

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function stageLabel(stageId) {
  const stage = PIPELINE_STAGES.find((item) => item.id === stageId);
  return stage ? stage.label : stageId;
}

function statusClass(status) {
  if (!status) return '';
  return `status-${status.toLowerCase()}`;
}

function stageClass(stage) {
  if (!stage) return '';
  return `stage-${stage}`;
}

function renderLayout() {
  app.innerHTML = `
    <aside class="sidebar">
      <div>
        <h1>Acumen CRM</h1>
        <p style="margin: 6px 0 0; color: var(--muted); font-size: 13px;">Relationship intelligence for growing teams</p>
      </div>
      <nav class="nav">
        <button data-nav="accounts">Accounts</button>
        <button data-nav="contacts">Contacts</button>
        <button data-nav="opportunities">Opportunities</button>
      </nav>
      <div style="margin-top: auto; font-size: 12px; color: var(--muted);">
        <p style="margin: 0; font-weight: 600;">Today</p>
        <p style="margin: 4px 0 0;">Stay close to the people and deals that move your business forward.</p>
      </div>
    </aside>
    <main class="content" id="main-content"></main>
  `;

  document.querySelectorAll('.nav button').forEach((button) => {
    button.addEventListener('click', () => navigate(button.dataset.nav));
  });

  updateNav();
  renderSection();
}

function updateNav() {
  document.querySelectorAll('.nav button').forEach((button) => {
    button.classList.toggle('active', button.dataset.nav === state.section);
  });
}

function navigate(section, view = 'list', id = null) {
  state.section = section;
  state.view = view;
  state.selectedId = id;
  state.formMode = null;
  updateNav();
  renderSection();
}

function openDetail(section, id) {
  state.section = section;
  state.view = 'detail';
  state.selectedId = id;
  state.formMode = null;
  updateNav();
  renderSection();
}

function openForm(section, mode, id = null) {
  state.section = section;
  state.view = 'form';
  state.formMode = mode;
  state.selectedId = id;
  updateNav();
  renderSection();
}

function renderSection() {
  if (state.section === 'accounts') {
    if (state.view === 'detail' && state.selectedId) {
      renderAccountDetail(state.selectedId);
    } else if (state.view === 'form') {
      renderAccountForm(state.formMode, state.selectedId);
    } else {
      renderAccountList();
    }
  } else if (state.section === 'contacts') {
    if (state.view === 'detail' && state.selectedId) {
      renderContactDetail(state.selectedId);
    } else if (state.view === 'form') {
      renderContactForm(state.formMode, state.selectedId);
    } else {
      renderContactList();
    }
  } else if (state.section === 'opportunities') {
    if (state.view === 'detail' && state.selectedId) {
      renderOpportunityDetail(state.selectedId);
    } else if (state.view === 'form') {
      renderOpportunityForm(state.formMode, state.selectedId);
    } else {
      renderOpportunityPipeline();
    }
  }
}

function renderAccountList() {
  const accounts = store.getAccounts();
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Accounts</h2>
      <button class="primary-button" id="add-account">New Account</button>
    </div>
    ${accounts.length ? `
    <div class="table-card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Industry</th>
              <th>Website</th>
              <th>Employees</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${accounts
              .map(
                (account) => `
                  <tr data-id="${account.id}" class="table-row">
                    <td>${account.name}</td>
                    <td>${account.industry || '—'}</td>
                    <td>${account.website ? `<a class="link" href="${account.website}" target="_blank" rel="noopener">${account.website.replace('https://', '')}</a>` : '—'}</td>
                    <td>${account.employeeCount ? Number(account.employeeCount).toLocaleString() : '—'}</td>
                    <td><span class="badge ${statusClass(account.status)}">${account.status || '—'}</span></td>
                  </tr>
                `,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
    ` : `
    <div class="table-card empty-state">
      <p>No accounts yet. Add your first company to get started.</p>
    </div>
    `}
  `;

  document.getElementById('add-account').addEventListener('click', () => openForm('accounts', 'create'));
  main.querySelectorAll('tbody tr').forEach((row) => {
    row.addEventListener('click', () => openDetail('accounts', row.dataset.id));
  });
}

function renderAccountDetail(id) {
  const account = store.getAccountById(id);
  const contacts = store.getContactsByAccount(id);
  const opportunities = store.getOpportunitiesByAccount(id);
  const main = document.getElementById('main-content');

  if (!account) {
    navigate('accounts');
    return;
  }

  main.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">${account.name}</h2>
      <div style="display:flex; gap:12px;">
        <button class="secondary-button" id="edit-account">Edit</button>
        <button class="danger-button" id="delete-account">Delete</button>
        <button class="secondary-button" id="back-to-accounts">Back</button>
      </div>
    </div>
    <div class="detail-card">
      <div class="detail-grid">
        <div class="detail-item">
          <h4>Industry</h4>
          <p>${account.industry || '—'}</p>
        </div>
        <div class="detail-item">
          <h4>Website</h4>
          <p>${account.website ? `<a class="link" href="${account.website}" target="_blank" rel="noopener">${account.website}</a>` : '—'}</p>
        </div>
        <div class="detail-item">
          <h4>Employee Count</h4>
          <p>${account.employeeCount ? Number(account.employeeCount).toLocaleString() : '—'}</p>
        </div>
        <div class="detail-item">
          <h4>Status</h4>
          <p><span class="badge ${statusClass(account.status)}">${account.status || '—'}</span></p>
        </div>
      </div>
      <div class="related-section">
        <h3>Contacts (${contacts.length})</h3>
        ${contacts.length ? `
          <div class="related-list">
            ${contacts
              .map(
                (contact) => `
                  <div class="related-card" data-action="open-contact" data-id="${contact.id}">
                    <strong>${contact.name}</strong>
                    <p style="margin:4px 0 0; color: var(--muted);">${contact.jobTitle || '—'}</p>
                    <p style="margin:4px 0 0; color: var(--muted);">${contact.email}</p>
                  </div>
                `,
              )
              .join('')}
          </div>
        ` : '<div class="empty-state" style="padding:16px 0;">No contacts yet.</div>'}
      </div>
      <div class="related-section">
        <h3>Opportunities (${opportunities.length})</h3>
        ${opportunities.length ? `
          <div class="related-list">
            ${opportunities
              .map(
                (opportunity) => `
                  <div class="related-card" data-action="open-opportunity" data-id="${opportunity.id}">
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
                      <strong>${opportunity.name}</strong>
                      <span class="badge ${stageClass(opportunity.stage)}">${stageLabel(opportunity.stage)}</span>
                    </div>
                    <p style="margin:6px 0 0; color: var(--muted);">Value: ${formatCurrency(opportunity.value)}</p>
                    <p style="margin:4px 0 0; color: var(--muted);">Close date: ${formatDate(opportunity.expectedCloseDate)}</p>
                  </div>
                `,
              )
              .join('')}
          </div>
        ` : '<div class="empty-state" style="padding:16px 0;">No opportunities yet.</div>'}
      </div>
    </div>
  `;

  document.getElementById('back-to-accounts').addEventListener('click', () => navigate('accounts'));
  document.getElementById('edit-account').addEventListener('click', () => openForm('accounts', 'edit', id));
  document.getElementById('delete-account').addEventListener('click', () => {
    if (window.confirm('Delete this account and all related contacts and opportunities?')) {
      store.deleteAccount(id);
      navigate('accounts');
    }
  });
  main.querySelectorAll('[data-action="open-contact"]').forEach((card) => {
    card.addEventListener('click', () => openDetail('contacts', card.dataset.id));
  });
  main.querySelectorAll('[data-action="open-opportunity"]').forEach((card) => {
    card.addEventListener('click', () => openDetail('opportunities', card.dataset.id));
  });
}

function renderAccountForm(mode, id) {
  const isEdit = mode === 'edit';
  const account = isEdit ? store.getAccountById(id) : null;
  const main = document.getElementById('main-content');

  if (isEdit && !account) {
    navigate('accounts');
    return;
  }

  main.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">${isEdit ? 'Edit Account' : 'New Account'}</h2>
      <button class="secondary-button" id="cancel-account">Cancel</button>
    </div>
    <div class="form-card">
      <form id="account-form">
        <div class="form-error" id="account-form-error" style="display:none;"></div>
        <div class="form-row">
          <label>
            Company Name *
            <input type="text" name="name" value="${account ? account.name : ''}" required />
          </label>
          <label>
            Industry
            <input type="text" name="industry" value="${account ? account.industry || '' : ''}" />
          </label>
        </div>
        <div class="form-row">
          <label>
            Website
            <input type="url" name="website" placeholder="https://" value="${account ? account.website || '' : ''}" />
          </label>
          <label>
            Employee Count
            <input type="number" name="employeeCount" min="1" value="${account && account.employeeCount ? account.employeeCount : ''}" />
          </label>
        </div>
        <div class="form-row">
          <label>
            Status *
            <select name="status" required>
              <option value="">Select status</option>
              ${ACCOUNT_STATUSES.map((status) => `
                <option value="${status}" ${account && account.status === status ? 'selected' : ''}>${status}</option>
              `).join('')}
            </select>
          </label>
        </div>
        <div class="form-actions">
          <button type="submit" class="primary-button">${isEdit ? 'Save Changes' : 'Create Account'}</button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('cancel-account').addEventListener('click', () => {
    if (isEdit) {
      openDetail('accounts', id);
    } else {
      navigate('accounts');
    }
  });

  document.getElementById('account-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = {
      name: formData.get('name').trim(),
      industry: formData.get('industry').trim(),
      website: formData.get('website').trim(),
      employeeCount: formData.get('employeeCount') ? Number(formData.get('employeeCount')) : null,
      status: formData.get('status'),
    };

    const errorEl = document.getElementById('account-form-error');
    if (!payload.name) {
      errorEl.textContent = 'Company name is required.';
      errorEl.style.display = 'block';
      return;
    }
    if (!payload.status) {
      errorEl.textContent = 'Status is required.';
      errorEl.style.display = 'block';
      return;
    }
    if (payload.employeeCount && payload.employeeCount < 1) {
      errorEl.textContent = 'Employee count must be greater than zero.';
      errorEl.style.display = 'block';
      return;
    }

    errorEl.style.display = 'none';

    if (isEdit) {
      store.updateAccount(id, payload);
      openDetail('accounts', id);
    } else {
      const created = store.createAccount(payload);
      openDetail('accounts', created.id);
    }
  });
}

function renderContactList() {
  const contacts = store.getContacts();
  const accounts = store.getAccounts();
  const main = document.getElementById('main-content');
  const canCreate = accounts.length > 0;

  main.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Contacts</h2>
      <button class="primary-button" id="add-contact" ${canCreate ? '' : 'disabled style="opacity:0.5; cursor:not-allowed;"'}>New Contact</button>
    </div>
    ${!canCreate ? '<div class="notice">Add an account before creating contacts.</div>' : ''}
    ${contacts.length ? `
      <div class="table-card">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Job Title</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Account</th>
              </tr>
            </thead>
            <tbody>
              ${contacts
                .map((contact) => {
                  const account = store.getAccountById(contact.accountId);
                  return `
                    <tr data-id="${contact.id}">
                      <td>${contact.name}</td>
                      <td>${contact.jobTitle || '—'}</td>
                      <td>${contact.email}</td>
                      <td>${contact.phone || '—'}</td>
                      <td>${account ? account.name : '—'}</td>
                    </tr>
                  `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : `
      <div class="table-card empty-state">
        <p>No contacts yet. Add the people you work with.</p>
      </div>
    `}
  `;

  const addButton = document.getElementById('add-contact');
  if (canCreate) {
    addButton.addEventListener('click', () => openForm('contacts', 'create'));
  }
  main.querySelectorAll('tbody tr').forEach((row) => {
    row.addEventListener('click', () => openDetail('contacts', row.dataset.id));
  });
}

function renderContactDetail(id) {
  const contact = store.getContactById(id);
  if (!contact) {
    navigate('contacts');
    return;
  }
  const account = store.getAccountById(contact.accountId);
  const opportunities = store.getOpportunities().filter((opportunity) => opportunity.primaryContactId === id);
  const main = document.getElementById('main-content');

  main.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">${contact.name}</h2>
      <div style="display:flex; gap:12px;">
        <button class="secondary-button" id="edit-contact">Edit</button>
        <button class="danger-button" id="delete-contact">Delete</button>
        <button class="secondary-button" id="back-to-contacts">Back</button>
      </div>
    </div>
    <div class="detail-card">
      <div class="detail-grid">
        <div class="detail-item">
          <h4>Job Title</h4>
          <p>${contact.jobTitle || '—'}</p>
        </div>
        <div class="detail-item">
          <h4>Email</h4>
          <p><a class="link" href="mailto:${contact.email}">${contact.email}</a></p>
        </div>
        <div class="detail-item">
          <h4>Phone</h4>
          <p>${contact.phone || '—'}</p>
        </div>
        <div class="detail-item">
          <h4>Account</h4>
          <p>${account ? `<button class="link" data-action="open-account" data-id="${account.id}" style="background:none;border:none;padding:0;">${account.name}</button>` : '—'}</p>
        </div>
      </div>
      <div class="related-section">
        <h3>Primary Contact For (${opportunities.length})</h3>
        ${opportunities.length ? `
          <div class="related-list">
            ${opportunities
              .map(
                (opportunity) => `
                  <div class="related-card" data-action="open-opportunity" data-id="${opportunity.id}">
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
                      <strong>${opportunity.name}</strong>
                      <span class="badge ${stageClass(opportunity.stage)}">${stageLabel(opportunity.stage)}</span>
                    </div>
                    <p style="margin:6px 0 0; color: var(--muted);">Value: ${formatCurrency(opportunity.value)}</p>
                    <p style="margin:4px 0 0; color: var(--muted);">Close date: ${formatDate(opportunity.expectedCloseDate)}</p>
                  </div>
                `,
              )
              .join('')}
          </div>
        ` : '<div class="empty-state" style="padding:16px 0;">Not assigned to any opportunities.</div>'}
      </div>
    </div>
  `;

  document.getElementById('back-to-contacts').addEventListener('click', () => navigate('contacts'));
  document.getElementById('edit-contact').addEventListener('click', () => openForm('contacts', 'edit', id));
  document.getElementById('delete-contact').addEventListener('click', () => {
    if (window.confirm('Delete this contact? They will be removed as primary contact from opportunities.')) {
      store.deleteContact(id);
      navigate('contacts');
    }
  });
  const accountLink = main.querySelector('[data-action="open-account"]');
  if (accountLink) {
    accountLink.addEventListener('click', () => openDetail('accounts', accountLink.dataset.id));
  }
  main.querySelectorAll('[data-action="open-opportunity"]').forEach((card) => {
    card.addEventListener('click', () => openDetail('opportunities', card.dataset.id));
  });
}

function renderContactForm(mode, id) {
  const isEdit = mode === 'edit';
  const contact = isEdit ? store.getContactById(id) : null;
  const accounts = store.getAccounts();
  const main = document.getElementById('main-content');

  if (!accounts.length) {
    navigate('contacts');
    return;
  }

  if (isEdit && !contact) {
    navigate('contacts');
    return;
  }

  main.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">${isEdit ? 'Edit Contact' : 'New Contact'}</h2>
      <button class="secondary-button" id="cancel-contact">Cancel</button>
    </div>
    <div class="form-card">
      <form id="contact-form">
        <div class="form-error" id="contact-form-error" style="display:none;"></div>
        <div class="form-row">
          <label>
            Full Name *
            <input type="text" name="name" value="${contact ? contact.name : ''}" required />
          </label>
          <label>
            Job Title
            <input type="text" name="jobTitle" value="${contact ? contact.jobTitle || '' : ''}" />
          </label>
        </div>
        <div class="form-row">
          <label>
            Email *
            <input type="email" name="email" value="${contact ? contact.email : ''}" required />
          </label>
          <label>
            Phone
            <input type="tel" name="phone" value="${contact ? contact.phone || '' : ''}" />
          </label>
        </div>
        <div class="form-row">
          <label>
            Account *
            <select name="accountId" required>
              <option value="">Select account</option>
              ${accounts
                .map(
                  (account) => `
                    <option value="${account.id}" ${contact && contact.accountId === account.id ? 'selected' : ''}>${account.name}</option>
                  `,
                )
                .join('')}
            </select>
          </label>
        </div>
        <div class="form-actions">
          <button type="submit" class="primary-button">${isEdit ? 'Save Changes' : 'Create Contact'}</button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('cancel-contact').addEventListener('click', () => {
    if (isEdit) {
      openDetail('contacts', id);
    } else {
      navigate('contacts');
    }
  });

  document.getElementById('contact-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = {
      name: formData.get('name').trim(),
      jobTitle: formData.get('jobTitle').trim(),
      email: formData.get('email').trim(),
      phone: formData.get('phone').trim(),
      accountId: formData.get('accountId'),
    };

    const errorEl = document.getElementById('contact-form-error');
    if (!payload.name) {
      errorEl.textContent = 'Full name is required.';
      errorEl.style.display = 'block';
      return;
    }
    if (!payload.email) {
      errorEl.textContent = 'Email is required.';
      errorEl.style.display = 'block';
      return;
    }
    if (!payload.accountId) {
      errorEl.textContent = 'Please assign this contact to an account.';
      errorEl.style.display = 'block';
      return;
    }

    errorEl.style.display = 'none';

    if (isEdit) {
      store.updateContact(id, payload);
      openDetail('contacts', id);
    } else {
      const created = store.createContact(payload);
      openDetail('contacts', created.id);
    }
  });
}

function renderOpportunityPipeline() {
  const opportunities = store.getOpportunities();
  const metrics = store.getMetrics();
  const main = document.getElementById('main-content');

  main.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Opportunities</h2>
      <button class="primary-button" id="add-opportunity" ${store.getAccounts().length && store.getContacts().length ? '' : 'disabled style="opacity:0.5; cursor:not-allowed;"'}>New Opportunity</button>
    </div>
    ${store.getAccounts().length ? '' : '<div class="notice">Add at least one account before creating opportunities.</div>'}
    ${store.getContacts().length ? '' : '<div class="notice">Add at least one contact to assign as the primary contact.</div>'}
    <div class="metrics-bar">
      <div class="metric-card">
        <h4>Total Pipeline</h4>
        <p>${formatCurrency(metrics.pipelineValue)}</p>
      </div>
      <div class="metric-card">
        <h4>Open Opportunities</h4>
        <p>${opportunities.filter((op) => op.stage !== 'closed-won' && op.stage !== 'closed-lost').length}</p>
      </div>
      <div class="metric-card">
        <h4>Won (Lasting Value)</h4>
        <p>${formatCurrency(metrics.closedWonValue)}</p>
      </div>
    </div>
    <div class="pipeline-board">
      ${PIPELINE_STAGES.map((stage) => {
        const deals = opportunities.filter((opportunity) => opportunity.stage === stage.id);
        return `
          <div class="pipeline-column">
            <h3>${stage.label}<span>${formatCurrency(store.getStageValue(stage.id))}</span></h3>
            ${deals.length ? deals
              .map(
                (deal) => {
                  const account = store.getAccountById(deal.accountId);
                  return `
                    <div class="deal-card" data-action="open-opportunity" data-id="${deal.id}">
                      <strong>${deal.name}</strong>
                      <p style="margin:4px 0 0; color: var(--muted);">${account ? account.name : '—'}</p>
                      <p style="margin:4px 0 0; color: var(--muted);">${formatCurrency(deal.value)}</p>
                      <p style="margin:4px 0 0; color: var(--muted);">Close ${formatDate(deal.expectedCloseDate)}</p>
                    </div>
                  `;
                },
              )
              .join('') : '<div class="empty-state" style="padding:12px 0;">No deals</div>'}
          </div>
        `;
      }).join('')}
    </div>
    ${opportunities.length ? `
      <div class="table-card">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Deal</th>
                <th>Account</th>
                <th>Value</th>
                <th>Stage</th>
                <th>Close Date</th>
              </tr>
            </thead>
            <tbody>
              ${opportunities
                .map((opportunity) => {
                  const account = store.getAccountById(opportunity.accountId);
                  return `
                    <tr data-id="${opportunity.id}">
                      <td>${opportunity.name}</td>
                      <td>${account ? account.name : '—'}</td>
                      <td>${formatCurrency(opportunity.value)}</td>
                      <td><span class="badge ${stageClass(opportunity.stage)}">${stageLabel(opportunity.stage)}</span></td>
                      <td>${formatDate(opportunity.expectedCloseDate)}</td>
                    </tr>
                  `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : '<div class="table-card empty-state"><p>No opportunities yet. Track your first deal.</p></div>'}
  `;

  const addButton = document.getElementById('add-opportunity');
  if (!addButton.hasAttribute('disabled')) {
    addButton.addEventListener('click', () => openForm('opportunities', 'create'));
  }
  main.querySelectorAll('[data-action="open-opportunity"]').forEach((card) => {
    card.addEventListener('click', () => openDetail('opportunities', card.dataset.id));
  });
  main.querySelectorAll('tbody tr').forEach((row) => {
    row.addEventListener('click', () => openDetail('opportunities', row.dataset.id));
  });
}

function renderOpportunityDetail(id) {
  const opportunity = store.getOpportunityById(id);
  if (!opportunity) {
    navigate('opportunities');
    return;
  }
  const account = store.getAccountById(opportunity.accountId);
  const primaryContact = opportunity.primaryContactId ? store.getContactById(opportunity.primaryContactId) : null;
  const main = document.getElementById('main-content');

  main.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">${opportunity.name}</h2>
      <div style="display:flex; gap:12px;">
        <button class="secondary-button" id="edit-opportunity">Edit</button>
        <button class="danger-button" id="delete-opportunity">Delete</button>
        <button class="secondary-button" id="back-to-opportunities">Back</button>
      </div>
    </div>
    <div class="detail-card">
      <div class="detail-grid">
        <div class="detail-item">
          <h4>Account</h4>
          <p>${account ? `<button class="link" style="background:none;border:none;padding:0;" data-action="open-account" data-id="${account.id}">${account.name}</button>` : '—'}</p>
        </div>
        <div class="detail-item">
          <h4>Primary Contact</h4>
          <p>${primaryContact ? `<button class="link" style="background:none;border:none;padding:0;" data-action="open-contact" data-id="${primaryContact.id}">${primaryContact.name}</button>` : 'Unassigned'}</p>
        </div>
        <div class="detail-item">
          <h4>Deal Value</h4>
          <p>${formatCurrency(opportunity.value)}</p>
        </div>
        <div class="detail-item">
          <h4>Stage</h4>
          <p><span class="badge ${stageClass(opportunity.stage)}">${stageLabel(opportunity.stage)}</span></p>
        </div>
        <div class="detail-item">
          <h4>Expected Close</h4>
          <p>${formatDate(opportunity.expectedCloseDate)}</p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('back-to-opportunities').addEventListener('click', () => navigate('opportunities'));
  document.getElementById('edit-opportunity').addEventListener('click', () => openForm('opportunities', 'edit', id));
  document.getElementById('delete-opportunity').addEventListener('click', () => {
    if (window.confirm('Delete this opportunity?')) {
      store.deleteOpportunity(id);
      navigate('opportunities');
    }
  });
  const accountLink = main.querySelector('[data-action="open-account"]');
  if (accountLink) {
    accountLink.addEventListener('click', () => openDetail('accounts', accountLink.dataset.id));
  }
  const contactLink = main.querySelector('[data-action="open-contact"]');
  if (contactLink) {
    contactLink.addEventListener('click', () => openDetail('contacts', contactLink.dataset.id));
  }
}

function renderOpportunityForm(mode, id) {
  const isEdit = mode === 'edit';
  const opportunity = isEdit ? store.getOpportunityById(id) : null;
  const accounts = store.getAccounts();
  const contacts = store.getContacts();
  const main = document.getElementById('main-content');

  if (!accounts.length || !contacts.length) {
    navigate('opportunities');
    return;
  }

  if (isEdit && !opportunity) {
    navigate('opportunities');
    return;
  }

  const selectedAccountId = opportunity ? opportunity.accountId : accounts[0].id;
  const relevantContacts = store.getContactsByAccount(selectedAccountId);

  main.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">${isEdit ? 'Edit Opportunity' : 'New Opportunity'}</h2>
      <button class="secondary-button" id="cancel-opportunity">Cancel</button>
    </div>
    <div class="form-card">
      <form id="opportunity-form">
        <div class="form-error" id="opportunity-form-error" style="display:none;"></div>
        <div class="form-row">
          <label>
            Deal Name *
            <input type="text" name="name" value="${opportunity ? opportunity.name : ''}" required />
          </label>
          <label>
            Deal Value (USD) *
            <input type="number" name="value" min="0" step="100" value="${opportunity ? opportunity.value : ''}" required />
          </label>
        </div>
        <div class="form-row">
          <label>
            Stage *
            <select name="stage" required>
              <option value="">Select stage</option>
              ${PIPELINE_STAGES.map((stage) => `
                <option value="${stage.id}" ${opportunity && opportunity.stage === stage.id ? 'selected' : ''}>${stage.label}</option>
              `).join('')}
            </select>
          </label>
          <label>
            Expected Close Date *
            <input type="date" name="expectedCloseDate" value="${opportunity ? opportunity.expectedCloseDate : ''}" required />
          </label>
        </div>
        <div class="form-row">
          <label>
            Account *
            <select name="accountId" id="opportunity-account" required>
              ${accounts
                .map(
                  (account) => `
                    <option value="${account.id}" ${selectedAccountId === account.id ? 'selected' : ''}>${account.name}</option>
                  `,
                )
                .join('')}
            </select>
          </label>
          <label>
            Primary Contact *
            <select name="primaryContactId" id="opportunity-contact" required ${relevantContacts.length ? '' : 'disabled'}>
              ${relevantContacts.length
                ? relevantContacts
                    .map(
                      (contact) => `
                        <option value="${contact.id}" ${opportunity && opportunity.primaryContactId === contact.id ? 'selected' : ''}>${contact.name}</option>
                      `,
                    )
                    .join('')
                : '<option value="">No contacts for this account</option>'}
            </select>
          </label>
        </div>
        <div id="contact-hint" style="color: var(--warning); font-size: 13px; display:${relevantContacts.length ? 'none' : 'block'};">Add a contact for this account before creating the opportunity.</div>
        <div class="form-actions">
          <button type="submit" class="primary-button">${isEdit ? 'Save Changes' : 'Create Opportunity'}</button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('cancel-opportunity').addEventListener('click', () => {
    if (isEdit) {
      openDetail('opportunities', id);
    } else {
      navigate('opportunities');
    }
  });

  const accountSelect = document.getElementById('opportunity-account');
  const contactSelect = document.getElementById('opportunity-contact');
  const contactHint = document.getElementById('contact-hint');

  const refreshContacts = () => {
    const selectedAccount = accountSelect.value;
    const contactsForAccount = store.getContactsByAccount(selectedAccount);
    contactSelect.innerHTML = contactsForAccount.length
      ? contactsForAccount
          .map(
            (contact) => `
              <option value="${contact.id}" ${opportunity && opportunity.primaryContactId === contact.id ? 'selected' : ''}>${contact.name}</option>
            `,
          )
          .join('')
      : '<option value="">No contacts for this account</option>';
    contactSelect.disabled = contactsForAccount.length === 0;
    contactHint.style.display = contactsForAccount.length === 0 ? 'block' : 'none';
  };

  accountSelect.addEventListener('change', () => {
    contactSelect.value = '';
    refreshContacts();
  });

  refreshContacts();

  document.getElementById('opportunity-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = {
      name: formData.get('name').trim(),
      value: Number(formData.get('value')),
      stage: formData.get('stage'),
      expectedCloseDate: formData.get('expectedCloseDate'),
      accountId: formData.get('accountId'),
      primaryContactId: formData.get('primaryContactId'),
    };

    const errorEl = document.getElementById('opportunity-form-error');
    if (!payload.name) {
      errorEl.textContent = 'Deal name is required.';
      errorEl.style.display = 'block';
      return;
    }
    if (Number.isNaN(payload.value) || payload.value <= 0) {
      errorEl.textContent = 'Deal value must be greater than zero.';
      errorEl.style.display = 'block';
      return;
    }
    if (!payload.stage) {
      errorEl.textContent = 'Stage is required.';
      errorEl.style.display = 'block';
      return;
    }
    if (!payload.expectedCloseDate) {
      errorEl.textContent = 'Expected close date is required.';
      errorEl.style.display = 'block';
      return;
    }
    if (!payload.accountId) {
      errorEl.textContent = 'Please choose an account.';
      errorEl.style.display = 'block';
      return;
    }
    const contactsForAccount = store.getContactsByAccount(payload.accountId);
    if (!contactsForAccount.length) {
      errorEl.textContent = 'Add a contact for this account before saving the opportunity.';
      errorEl.style.display = 'block';
      return;
    }
    if (!payload.primaryContactId) {
      errorEl.textContent = 'Select a primary contact for this opportunity.';
      errorEl.style.display = 'block';
      return;
    }

    errorEl.style.display = 'none';

    if (isEdit) {
      store.updateOpportunity(id, payload);
      openDetail('opportunities', id);
    } else {
      const created = store.createOpportunity(payload);
      openDetail('opportunities', created.id);
    }
  });
}

renderLayout();
