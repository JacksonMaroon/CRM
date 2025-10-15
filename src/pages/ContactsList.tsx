import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../state/DataContext';

const ContactsList: React.FC = () => {
  const { contacts, accounts } = useData();

  return (
    <div className="grid" style={{ gap: '1.5rem' }}>
      <section className="page-header">
        <div>
          <h2>Contacts</h2>
          <p>People associated with your accounts.</p>
        </div>
        <Link to="/contacts/new" className="button">
          New Contact
        </Link>
      </section>

      <section className="card">
        {contacts.length === 0 ? (
          <div className="empty-state">
            No contacts yet. Create an account first, then add people connected to it.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Account</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => {
                const account = accounts.find((acct) => acct.id === contact.accountId);
                return (
                  <tr key={contact.id}>
                    <td>
                      <Link to={`/contacts/${contact.id}`}>
                        {contact.firstName} {contact.lastName}
                      </Link>
                    </td>
                    <td>{contact.email}</td>
                    <td>{contact.phone ?? '—'}</td>
                    <td>{account ? <Link to={`/accounts/${account.id}`}>{account.name}</Link> : '—'}</td>
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

export default ContactsList;
