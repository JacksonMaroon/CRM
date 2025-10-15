import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../state/DataContext';
import { formatCurrency } from '../data/utils';

const AccountDetail: React.FC = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const { findAccount, contacts, opportunities, deleteAccount } = useData();

  const account = accountId ? findAccount(accountId) : undefined;

  if (!account) {
    return (
      <div className="card">
        <p>Account not found.</p>
        <button className="button secondary" onClick={() => navigate('/accounts')}>
          Back to accounts
        </button>
      </div>
    );
  }

  const relatedContacts = contacts.filter((contact) => contact.accountId === account.id);
  const relatedOpportunities = opportunities.filter((opp) => opp.accountId === account.id);

  const handleDelete = () => {
    if (window.confirm('Delete this account? Related contacts and opportunities will also be removed.')) {
      deleteAccount(account.id);
      navigate('/accounts');
    }
  };

  return (
    <div className="grid" style={{ gap: '1.5rem' }}>
      <section className="page-header">
        <div>
          <h2>{account.name}</h2>
          <p>{account.industry}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/accounts/${account.id}/edit`} className="button secondary">
            Edit
          </Link>
          <button className="button danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </section>

      <section className="card">
        <h3>Company Profile</h3>
        <div className="grid two-column" style={{ marginTop: '1rem' }}>
          <div>
            <strong>Website</strong>
            <p>{account.website ? <a href={account.website}>{account.website}</a> : '—'}</p>
          </div>
          <div>
            <strong>Annual Revenue</strong>
            <p>{account.annualRevenue ? formatCurrency(account.annualRevenue) : '—'}</p>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <strong>Description</strong>
            <p>{account.description ?? '—'}</p>
          </div>
        </div>
      </section>

      <section className="card">
        <header className="page-header" style={{ padding: 0 }}>
          <h3>Contacts</h3>
          <Link to={`/contacts/new?accountId=${account.id}`} className="button secondary">
            Add contact
          </Link>
        </header>
        {relatedContacts.length === 0 ? (
          <div className="empty-state">No contacts for this account yet.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0', display: 'grid', gap: '1rem' }}>
            {relatedContacts.map((contact) => (
              <li key={contact.id} className="pipeline-card" style={{ margin: 0 }}>
                <Link to={`/contacts/${contact.id}`} style={{ fontWeight: 600 }}>
                  {contact.firstName} {contact.lastName}
                </Link>
                <p style={{ margin: '0.25rem 0 0' }}>{contact.email}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <header className="page-header" style={{ padding: 0 }}>
          <h3>Opportunities</h3>
          <Link to={`/opportunities/new?accountId=${account.id}`} className="button secondary">
            Add opportunity
          </Link>
        </header>
        {relatedOpportunities.length === 0 ? (
          <div className="empty-state">No opportunities for this account yet.</div>
        ) : (
          <table className="table" style={{ marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Stage</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {relatedOpportunities.map((opp) => (
                <tr key={opp.id}>
                  <td>
                    <Link to={`/opportunities/${opp.id}`}>{opp.name}</Link>
                  </td>
                  <td>
                    <span className={`badge stage-${opp.stage}`}>{opp.stage}</span>
                  </td>
                  <td>{formatCurrency(opp.amount)}</td>
                  <td>{opp.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AccountDetail;
