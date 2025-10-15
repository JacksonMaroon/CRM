import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../state/DataContext';

interface FormState {
  name: string;
  industry: string;
  website: string;
  description: string;
  annualRevenue: string;
}

const AccountForm: React.FC = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const { findAccount, createAccount, updateAccount } = useData();
  const isEdit = Boolean(accountId);
  const existing = accountId ? findAccount(accountId) : undefined;

  const [form, setForm] = useState<FormState>(() => ({
    name: existing?.name ?? '',
    industry: existing?.industry ?? '',
    website: existing?.website ?? '',
    description: existing?.description ?? '',
    annualRevenue: existing?.annualRevenue ? String(existing.annualRevenue) : ''
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const title = useMemo(() => (isEdit ? 'Edit Account' : 'Create Account'), [isEdit]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!form.industry.trim()) nextErrors.industry = 'Industry is required';
    if (form.website && !/^https?:\/\//.test(form.website)) {
      nextErrors.website = 'Website must include http:// or https://';
    }
    if (form.annualRevenue && Number.isNaN(Number(form.annualRevenue))) {
      nextErrors.annualRevenue = 'Annual revenue must be a number';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      industry: form.industry.trim(),
      website: form.website.trim() || undefined,
      description: form.description.trim() || undefined,
      annualRevenue: form.annualRevenue ? Number(form.annualRevenue) : undefined
    };

    if (isEdit && accountId) {
      updateAccount(accountId, payload);
      navigate(`/accounts/${accountId}`);
    } else {
      const next = createAccount(payload);
      const newAccount = next.accounts[next.accounts.length - 1];
      navigate(`/accounts/${newAccount.id}`);
    }
  };

  return (
    <div className="card">
      <h2>{title}</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-control">
          <label htmlFor="name">Name *</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} required />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="form-control">
          <label htmlFor="industry">Industry *</label>
          <input id="industry" name="industry" value={form.industry} onChange={handleChange} required />
          {errors.industry && <span className="error">{errors.industry}</span>}
        </div>
        <div className="form-control">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" value={form.website} onChange={handleChange} placeholder="https://" />
          {errors.website && <span className="error">{errors.website}</span>}
        </div>
        <div className="form-control">
          <label htmlFor="annualRevenue">Annual Revenue (USD)</label>
          <input
            id="annualRevenue"
            name="annualRevenue"
            value={form.annualRevenue}
            onChange={handleChange}
            inputMode="decimal"
          />
          {errors.annualRevenue && <span className="error">{errors.annualRevenue}</span>}
        </div>
        <div className="form-control" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="button">
            {isEdit ? 'Update account' : 'Create account'}
          </button>
          <button type="button" className="button secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;
