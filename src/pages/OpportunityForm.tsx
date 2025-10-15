import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useData } from '../state/DataContext';
import { OPPORTUNITY_STAGES } from '../data/constants';
import { OpportunityStage } from '../data/models';

interface FormState {
  name: string;
  accountId: string;
  contactId: string;
  stage: string;
  amount: string;
  closeDate: string;
}

const OpportunityForm: React.FC = () => {
  const { opportunityId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { accounts, contacts, findOpportunity, createOpportunity, updateOpportunity } = useData();

  const isEdit = Boolean(opportunityId);
  const existing = opportunityId ? findOpportunity(opportunityId) : undefined;

  const [form, setForm] = useState<FormState>(() => ({
    name: existing?.name ?? '',
    accountId: existing?.accountId ?? searchParams.get('accountId') ?? '',
    contactId: existing?.contactId ?? searchParams.get('contactId') ?? '',
    stage: existing?.stage ?? 'Prospecting',
    amount: existing?.amount ? String(existing.amount) : '',
    closeDate: existing?.closeDate ? existing.closeDate.slice(0, 10) : ''
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const title = useMemo(() => (isEdit ? 'Edit Opportunity' : 'Create Opportunity'), [isEdit]);

  const filteredContacts = useMemo(
    () => contacts.filter((contact) => contact.accountId === form.accountId),
    [contacts, form.accountId]
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => {
      if (name === 'accountId') {
        const nextContacts = contacts.filter((contact) => contact.accountId === value);
        return {
          ...prev,
          accountId: value,
          contactId: nextContacts.some((c) => c.id === prev.contactId) ? prev.contactId : ''
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!form.accountId) nextErrors.accountId = 'An associated account is required';
    if (!form.stage) nextErrors.stage = 'Select a stage';
    if (!form.amount || Number(form.amount) <= 0) nextErrors.amount = 'Amount must be greater than zero';
    if (!form.closeDate) nextErrors.closeDate = 'Close date is required';
    if (form.contactId && !filteredContacts.some((contact) => contact.id === form.contactId)) {
      nextErrors.contactId = 'Selected contact does not belong to the chosen account';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      accountId: form.accountId,
      contactId: form.contactId || undefined,
      stage: form.stage as OpportunityStage,
      amount: Number(form.amount),
      closeDate: new Date(form.closeDate).toISOString()
    };

    if (isEdit && opportunityId) {
      updateOpportunity(opportunityId, payload);
      navigate(`/opportunities/${opportunityId}`);
    } else {
      const next = createOpportunity(payload);
      const newOpp = next.opportunities[next.opportunities.length - 1];
      navigate(`/opportunities/${newOpp.id}`);
    }
  };

  return (
    <div className="card">
      <h2>{title}</h2>
      {accounts.length === 0 ? (
        <div className="empty-state">
          You need at least one account before creating opportunities.
          <div style={{ marginTop: '1rem' }}>
            <button className="button" onClick={() => navigate('/accounts/new')}>
              Create an account
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-control">
            <label htmlFor="name">Name *</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="form-control">
            <label htmlFor="accountId">Account *</label>
            <select id="accountId" name="accountId" value={form.accountId} onChange={handleChange}>
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            {errors.accountId && <span className="error">{errors.accountId}</span>}
          </div>
          <div className="form-control">
            <label htmlFor="contactId">Primary Contact</label>
            <select id="contactId" name="contactId" value={form.contactId} onChange={handleChange} disabled={filteredContacts.length === 0}>
              <option value="">Optional</option>
              {filteredContacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName}
                </option>
              ))}
            </select>
            {filteredContacts.length === 0 && form.accountId && (
              <span className="error">No contacts for the selected account yet.</span>
            )}
            {errors.contactId && <span className="error">{errors.contactId}</span>}
          </div>
          <div className="form-control">
            <label htmlFor="stage">Stage *</label>
            <select id="stage" name="stage" value={form.stage} onChange={handleChange}>
              {OPPORTUNITY_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
            {errors.stage && <span className="error">{errors.stage}</span>}
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount (USD) *</label>
            <input id="amount" name="amount" inputMode="decimal" value={form.amount} onChange={handleChange} />
            {errors.amount && <span className="error">{errors.amount}</span>}
          </div>
          <div className="form-control">
            <label htmlFor="closeDate">Close Date *</label>
            <input id="closeDate" name="closeDate" type="date" value={form.closeDate} onChange={handleChange} />
            {errors.closeDate && <span className="error">{errors.closeDate}</span>}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="button">
              {isEdit ? 'Update opportunity' : 'Create opportunity'}
            </button>
            <button type="button" className="button secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default OpportunityForm;
