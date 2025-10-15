import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../state/DataContext';
import { formatCurrency } from '../data/utils';

const OpportunityDetail: React.FC = () => {
  const { opportunityId } = useParams();
  const navigate = useNavigate();
  const { findOpportunity, accounts, contacts, deleteOpportunity } = useData();

  const opportunity = opportunityId ? findOpportunity(opportunityId) : undefined;

  if (!opportunity) {
    return (
      <div className="card">
        <p>Opportunity not found.</p>
        <button className="button secondary" onClick={() => navigate('/opportunities')}>
          Back to opportunities
        </button>
      </div>
    );
  }

  const account = accounts.find((acct) => acct.id === opportunity.accountId);
  const contact = contacts.find((person) => person.id === opportunity.contactId);

  const handleDelete = () => {
    if (window.confirm('Delete this opportunity?')) {
      deleteOpportunity(opportunity.id);
      navigate('/opportunities');
    }
  };

  const statusStyle = {
    backgroundColor:
      opportunity.status === 'Won'
        ? 'rgba(34,197,94,0.2)'
        : opportunity.status === 'Lost'
        ? 'rgba(248,113,113,0.2)'
        : 'rgba(59,130,246,0.15)',
    color:
      opportunity.status === 'Won'
        ? '#15803d'
        : opportunity.status === 'Lost'
        ? '#b91c1c'
        : '#1d4ed8'
  } as React.CSSProperties;

  return (
    <div className="grid" style={{ gap: '1.5rem' }}>
      <section className="page-header">
        <div>
          <h2>{opportunity.name}</h2>
          <span className={`badge stage-${opportunity.stage}`}>{opportunity.stage}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/opportunities/${opportunity.id}/edit`} className="button secondary">
            Edit
          </Link>
          <button className="button danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </section>

      <section className="card">
        <h3>Deal Summary</h3>
        <div className="grid two-column" style={{ marginTop: '1rem' }}>
          <div>
            <strong>Account</strong>
            <p>{account ? <Link to={`/accounts/${account.id}`}>{account.name}</Link> : '—'}</p>
          </div>
          <div>
            <strong>Primary Contact</strong>
            <p>
              {contact ? (
                <Link to={`/contacts/${contact.id}`}>
                  {contact.firstName} {contact.lastName}
                </Link>
              ) : (
                '—'
              )}
            </p>
          </div>
          <div>
            <strong>Amount</strong>
            <p>{formatCurrency(opportunity.amount)}</p>
          </div>
          <div>
            <strong>Close Date</strong>
            <p>{new Date(opportunity.closeDate).toLocaleDateString()}</p>
          </div>
          <div>
            <strong>Status</strong>
            <p>
              <span className="badge" style={statusStyle}>
                {opportunity.status}
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OpportunityDetail;
