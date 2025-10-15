import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../state/DataContext';

const ContactDetail: React.FC = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { findContact, accounts, opportunities, deleteContact } = useData();

  const contact = contactId ? findContact(contactId) : undefined;

  if (!contact) {
    return (
      <div className="card">
        <p>Contact not found.</p>
        <button className="button secondary" onClick={() => navigate('/contacts')}>
          Back to contacts
        </button>
      </div>
    );
  }

  const account = accounts.find((acct) => acct.id === contact.accountId);
  const relatedOpportunities = opportunities.filter((opp) => opp.contactId === contact.id);

  const handleDelete = () => {
    if (window.confirm('Delete this contact? They will be removed from related opportunities.')) {
      deleteContact(contact.id);
      navigate('/contacts');
    }
  };

  return (
    <div className="grid" style={{ gap: '1.5rem' }}>
      <section className="page-header">
        <div>
          <h2>
            {contact.firstName} {contact.lastName}
          </h2>
          <p>{contact.jobTitle}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/contacts/${contact.id}/edit`} className="button secondary">
            Edit
          </Link>
          <button className="button danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </section>

      <section className="card">
        <h3>Contact Details</h3>
        <div className="grid two-column" style={{ marginTop: '1rem' }}>
          <div>
            <strong>Email</strong>
            <p>{contact.email}</p>
          </div>
          <div>
            <strong>Phone</strong>
            <p>{contact.phone ?? '—'}</p>
          </div>
          <div>
            <strong>Account</strong>
            <p>{account ? <Link to={`/accounts/${account.id}`}>{account.name}</Link> : '—'}</p>
          </div>
        </div>
      </section>

      <section className="card">
        <header className="page-header" style={{ padding: 0 }}>
          <h3>Opportunities</h3>
          <Link to={`/opportunities/new?contactId=${contact.id}&accountId=${contact.accountId}`} className="button secondary">
            Add opportunity
          </Link>
        </header>
        {relatedOpportunities.length === 0 ? (
          <div className="empty-state">No opportunities associated with this contact.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0', display: 'grid', gap: '1rem' }}>
            {relatedOpportunities.map((opp) => (
              <li key={opp.id} className="pipeline-card" style={{ margin: 0 }}>
                <Link to={`/opportunities/${opp.id}`} style={{ fontWeight: 600 }}>
                  {opp.name}
                </Link>
                <p style={{ margin: '0.25rem 0 0' }}>Stage: {opp.stage}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ContactDetail;
