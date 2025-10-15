const assert = require('assert');
const { DataStore, PIPELINE_STAGES, ACCOUNT_STATUSES, createMemoryStorage } = require('../src/core.js');

function runSmokeTests() {
  assert.strictEqual(Array.isArray(PIPELINE_STAGES), true, 'Pipeline stages should be an array');
  assert.strictEqual(PIPELINE_STAGES.length > 0, true, 'Pipeline stages must contain values');
  assert.strictEqual(Array.isArray(ACCOUNT_STATUSES), true, 'Account statuses should be an array');

  const storage = createMemoryStorage();
  const store = new DataStore({ storageKey: 'smoke-test', storage });

  const metrics = store.getMetrics();
  assert.strictEqual(metrics.totalAccounts >= 3, true, 'Seed data should include accounts');
  assert.strictEqual(metrics.totalContacts >= 3, true, 'Seed data should include contacts');
  assert.strictEqual(metrics.totalOpportunities >= 3, true, 'Seed data should include opportunities');

  const account = store.createAccount({
    name: 'Atlas Manufacturing',
    industry: 'Manufacturing',
    website: 'https://atlas-manufacturing.example',
    employeeCount: 240,
    status: 'Prospect'
  });

  const contact = store.createContact({
    name: 'Jordan Mills',
    email: 'jordan.mills@atlas-manufacturing.example',
    phone: '(555) 010-4455',
    jobTitle: 'Operations Director',
    accountId: account.id
  });

  const opportunity = store.createOpportunity({
    name: 'Factory Automation Upgrade',
    value: 98000,
    stage: 'proposal',
    expectedCloseDate: '2024-12-15',
    accountId: account.id,
    primaryContactId: contact.id
  });

  assert.strictEqual(store.getContactsByAccount(account.id).length, 1, 'Account should have the new contact');
  assert.strictEqual(store.getOpportunitiesByAccount(account.id).length, 1, 'Account should have the new opportunity');

  const proposalValue = store.getStageValue('proposal');
  assert.strictEqual(proposalValue >= 98000, true, 'Stage totals should include the new opportunity value');

  store.updateOpportunity(opportunity.id, { stage: 'closed-won', value: 110000 });
  const closedWonValue = store.getStageValue('closed-won');
  assert.strictEqual(closedWonValue >= 110000, true, 'Closed won stage should reflect updated value');

  store.deleteContact(contact.id);
  const updatedOpportunity = store.getOpportunityById(opportunity.id);
  assert.strictEqual(updatedOpportunity.primaryContactId, null, 'Deleting a contact should null out primary contact references');

  store.deleteAccount(account.id);
  assert.strictEqual(store.getAccountById(account.id), null, 'Deleted account should not be retrievable');
  assert.strictEqual(store.getContactsByAccount(account.id).length, 0, 'Deleting an account should remove associated contacts');
  assert.strictEqual(store.getOpportunitiesByAccount(account.id).length, 0, 'Deleting an account should remove associated opportunities');
}

try {
  runSmokeTests();
  console.log('Smoke tests passed: data store and relationships behave as expected.');
} catch (error) {
  console.error('Smoke tests failed:', error.message);
  process.exitCode = 1;
}
