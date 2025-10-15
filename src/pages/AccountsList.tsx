import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../state/DataContext';

const AccountsList: React.FC = () => {
  const { accounts, contacts, opportunities } = useData();

  return (
    <div className="grid" style={{ gap: '1.5rem' }}>
      <section className="page-header">
        <div>
          <h2>Accounts</h2>
          <p>Company records with related contacts and opportunities.</p>
        </div>
        <Link to="/accounts/new" className="button">
          New Account
        </Link>
      </section>

      <section className="card">
        {accounts.length === 0 ? (
          <div className="empty-state">
            No accounts found. Start by{' '}
            <Link to="/accounts/new" style={{ color: '#2563eb' }}>
              creating one
            </Link>
            .
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Industry</th>
                <th>Contacts</th>
                <th>Opportunities</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => {
                const relatedContacts = contacts.filter((contact) => contact.accountId === account.id).length;
                const relatedOpps = opportunities.filter((opp) => opp.accountId === account.id).length;
                return (
                  <tr key={account.id}>
                    <td>
                      <Link to={`/accounts/${account.id}`}>{account.name}</Link>
                    </td>
                    <td>{account.industry}</td>
                    <td>{relatedContacts}</td>
                    <td>{relatedOpps}</td>
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

export default AccountsList;
