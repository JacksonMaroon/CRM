import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../state/DataContext';
import { formatCurrency } from '../data/utils';

const Dashboard: React.FC = () => {
  const { accounts, contacts, opportunities, pipelineValue, stageCounts } = useData();

  const openDeals = opportunities.filter((opp) => opp.status === 'Open');
  const wonDeals = opportunities.filter((opp) => opp.status === 'Won');

  return (
    <div className="grid" style={{ gap: '2rem' }}>
      <section className="page-header">
        <div>
          <h2>Pipeline Overview</h2>
          <p>Stay ahead of your deals with a snapshot of current activity.</p>
        </div>
        <Link to="/opportunities/new" className="button">
          New Opportunity
        </Link>
      </section>

      <section className="grid two-column">
        <div className="card">
          <h3>Total Accounts</h3>
          <p style={{ fontSize: '2rem', margin: '0.5rem 0 0' }}>{accounts.length}</p>
          <Link to="/accounts" style={{ display: 'inline-block', marginTop: '0.75rem', color: '#2563eb' }}>
            View accounts →
          </Link>
        </div>
        <div className="card">
          <h3>Total Contacts</h3>
          <p style={{ fontSize: '2rem', margin: '0.5rem 0 0' }}>{contacts.length}</p>
          <Link to="/contacts" style={{ display: 'inline-block', marginTop: '0.75rem', color: '#2563eb' }}>
            View contacts →
          </Link>
        </div>
        <div className="card">
          <h3>Open Pipeline Value</h3>
          <p style={{ fontSize: '2rem', margin: '0.5rem 0 0' }}>{formatCurrency(pipelineValue)}</p>
        </div>
        <div className="card">
          <h3>Closed Won (12 mo)</h3>
          <p style={{ fontSize: '2rem', margin: '0.5rem 0 0' }}>{formatCurrency(wonDeals.reduce((sum, opp) => sum + opp.amount, 0))}</p>
        </div>
      </section>

      <section className="card">
        <h3>Stage Distribution</h3>
        <div className="grid two-column" style={{ marginTop: '1rem' }}>
          {Object.entries(stageCounts).map(([stage, count]) => (
            <div key={stage}>
              <span className={`badge stage-${stage}`}>{stage}</span>
              <p style={{ fontSize: '1.5rem', margin: '0.75rem 0 0' }}>{count}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Recent Opportunities</h3>
        {opportunities.length === 0 ? (
          <div className="empty-state">
            No opportunities yet. <Link to="/opportunities/new">Create one</Link> to start tracking deals.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Account</th>
                <th>Stage</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {openDeals.slice(0, 5).map((opp) => (
                <tr key={opp.id}>
                  <td>
                    <Link to={`/opportunities/${opp.id}`}>{opp.name}</Link>
                  </td>
                  <td>
                    <Link to={`/accounts/${opp.accountId}`}>View Account</Link>
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

export default Dashboard;
