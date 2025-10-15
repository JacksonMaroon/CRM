import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AccountsList from './pages/AccountsList';
import AccountDetail from './pages/AccountDetail';
import AccountForm from './pages/AccountForm';
import ContactsList from './pages/ContactsList';
import ContactDetail from './pages/ContactDetail';
import ContactForm from './pages/ContactForm';
import OpportunitiesList from './pages/OpportunitiesList';
import OpportunityForm from './pages/OpportunityForm';
import OpportunityDetail from './pages/OpportunityDetail';
import OpportunityPipeline from './pages/OpportunityPipeline';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/accounts" element={<AccountsList />} />
        <Route path="/accounts/new" element={<AccountForm />} />
        <Route path="/accounts/:accountId" element={<AccountDetail />} />
        <Route path="/accounts/:accountId/edit" element={<AccountForm />} />
        <Route path="/contacts" element={<ContactsList />} />
        <Route path="/contacts/new" element={<ContactForm />} />
        <Route path="/contacts/:contactId" element={<ContactDetail />} />
        <Route path="/contacts/:contactId/edit" element={<ContactForm />} />
        <Route path="/opportunities" element={<OpportunitiesList />} />
        <Route path="/opportunities/new" element={<OpportunityForm />} />
        <Route path="/opportunities/pipeline" element={<OpportunityPipeline />} />
        <Route path="/opportunities/:opportunityId" element={<OpportunityDetail />} />
        <Route path="/opportunities/:opportunityId/edit" element={<OpportunityForm />} />
        <Route path="*" element={<div className="card">Page not found.</div>} />
      </Routes>
    </Layout>
  );
};

export default App;
