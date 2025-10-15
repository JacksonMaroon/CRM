import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../state/DataContext';
import { formatCurrency } from '../data/utils';

const OpportunitiesList: React.FC = () => {
  const { opportunities, accounts, contacts, pipelineValue } = useData();

  return (
    <div className="grid" style={{ gap: '1.5rem' }}>
      <section className="page-header">
        <div>
          <h2>Opportunities</h2>
          <p>Track every deal and move it through the pipeline.</p>
        </div>
        <Link to="/opportunities/new" className="button">
          New Opportunity
        </Link>
      </section>

      <section className="card">
        <h3>Open Pipeline Value</h3>
        <p style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{formatCurrency(pipelineValue)}</p>
        <Link to="/opportunities/pipeline" style={{ color: '#2563eb', display: 'inline-block', marginTop: '0.75rem' }}>
          View Kanban board →
        </Link>
      </section>

      <section className="card">
        {opportunities.length === 0 ? (
          <div className="empty-state">
            No opportunities yet.{' '}
            <Link to="/opportunities/new" style={{ color: '#2563eb' }}>
              Create one
            </Link>{' '}
            to begin tracking deals.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Account</th>
                <th>Contact</th>
                <th>Stage</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp) => {
                const account = accounts.find((acct) => acct.id === opp.accountId);
                const contact = contacts.find((person) => person.id === opp.contactId);
                return (
                  <tr key={opp.id}>
                    <td>
                      <Link to={`/opportunities/${opp.id}`}>{opp.name}</Link>
                    </td>
                    <td>{account ? <Link to={`/accounts/${account.id}`}>{account.name}</Link> : '—'}</td>
                    <td>
                      {contact ? (
                        <Link to={`/contacts/${contact.id}`}>
                          {contact.firstName} {contact.lastName}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <span className={`badge stage-${opp.stage}`}>{opp.stage}</span>
                    </td>
                    <td>{formatCurrency(opp.amount)}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            opp.status === 'Won' ? 'rgba(34,197,94,0.2)' : opp.status === 'Lost' ? 'rgba(248,113,113,0.2)' : 'rgba(59,130,246,0.15)',
                          color:
                            opp.status === 'Won' ? '#15803d' : opp.status === 'Lost' ? '#b91c1c' : '#1d4ed8'
                        }}
                      >
                        {opp.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default OpportunitiesList;
