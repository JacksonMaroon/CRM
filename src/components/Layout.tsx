import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/contacts', label: 'Contacts' },
  { to: '/opportunities', label: 'Opportunities' },
  { to: '/opportunities/pipeline', label: 'Pipeline' }
];

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <h1>Atlas CRM</h1>
          <p style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>
            Manage relationships, deals, and insights in one workspace.
          </p>
        </div>
        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
