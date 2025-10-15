import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useData } from '../state/DataContext';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  accountId: string;
}

const ContactForm: React.FC = () => {
  const { contactId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { accounts, findContact, createContact, updateContact } = useData();

  const isEdit = Boolean(contactId);
  const existing = contactId ? findContact(contactId) : undefined;

  const [form, setForm] = useState<FormState>(() => ({
    firstName: existing?.firstName ?? '',
    lastName: existing?.lastName ?? '',
    email: existing?.email ?? '',
    phone: existing?.phone ?? '',
    jobTitle: existing?.jobTitle ?? '',
    accountId: existing?.accountId ?? searchParams.get('accountId') ?? ''
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const title = useMemo(() => (isEdit ? 'Edit Contact' : 'Create Contact'), [isEdit]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.firstName.trim()) nextErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) nextErrors.lastName = 'Last name is required';
    if (!form.email.trim()) nextErrors.email = 'Email is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Email must be valid';
    }
    if (!form.accountId) nextErrors.accountId = 'Select an account to associate the contact';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      jobTitle: form.jobTitle.trim() || undefined,
      accountId: form.accountId
    };

    if (isEdit && contactId) {
      updateContact(contactId, payload);
      navigate(`/contacts/${contactId}`);
    } else {
      const next = createContact(payload);
      const newContact = next.contacts[next.contacts.length - 1];
      navigate(`/contacts/${newContact.id}`);
    }
  };

  return (
    <div className="card">
      <h2>{title}</h2>
      {accounts.length === 0 ? (
        <div className="empty-state">
          You need at least one account before creating contacts.{' '}
          <button className="button" onClick={() => navigate('/accounts/new')}>
            Create an account
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-control">
            <label htmlFor="firstName">First name *</label>
            <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} />
            {errors.firstName && <span className="error">{errors.firstName}</span>}
          </div>
          <div className="form-control">
            <label htmlFor="lastName">Last name *</label>
            <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} />
            {errors.lastName && <span className="error">{errors.lastName}</span>}
          </div>
          <div className="form-control">
            <label htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-control">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label htmlFor="jobTitle">Job title</label>
            <input id="jobTitle" name="jobTitle" value={form.jobTitle} onChange={handleChange} />
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
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="button">
              {isEdit ? 'Update contact' : 'Create contact'}
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

export default ContactForm;
