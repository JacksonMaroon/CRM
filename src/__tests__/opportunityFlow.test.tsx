import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { DataProvider } from '../state/DataContext';
import { resetData, getAll } from '../data/dataService';

const renderApp = (initialRoute: string = '/') =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <DataProvider>
        <App />
      </DataProvider>
    </MemoryRouter>
  );

beforeEach(() => {
  resetData();
  window.localStorage.clear();
});

describe('Opportunity flows', () => {
  it('prevents submitting opportunity without required fields and then creates one', async () => {
    const user = userEvent.setup();
    renderApp('/opportunities/new');

    const submit = screen.getByRole('button', { name: /create opportunity/i });
    await user.click(submit);

    expect(screen.getByText(/associated account is required/i)).toBeInTheDocument();

    const state = getAll();
    const account = state.accounts[0];
    const contact = state.contacts.find((c) => c.accountId === account.id);

    await user.type(screen.getByLabelText(/name/i), 'Expansion Project');
    await user.selectOptions(screen.getByLabelText(/account/i), account.id);
    if (contact) {
      await user.selectOptions(screen.getByLabelText(/primary contact/i), contact.id);
    }
    await user.selectOptions(screen.getByLabelText(/stage/i), 'Proposal');
    await user.type(screen.getByLabelText(/amount/i), '150000');
    await user.type(screen.getByLabelText(/close date/i), '2024-12-15');

    await user.click(submit);

    expect(await screen.findByRole('heading', { level: 2, name: /expansion project/i })).toBeInTheDocument();
    expect(screen.getByText(/Proposal/)).toBeInTheDocument();
    expect(screen.getByText(account.name)).toBeInTheDocument();
  });

  it('shows the new opportunity on the list view', async () => {
    const user = userEvent.setup();
    renderApp('/opportunities/new');

    const state = getAll();
    const account = state.accounts[0];

    await user.type(screen.getByLabelText(/name/i), 'Logistics Upgrade');
    await user.selectOptions(screen.getByLabelText(/account/i), account.id);
    await user.selectOptions(screen.getByLabelText(/stage/i), 'Negotiation');
    await user.type(screen.getByLabelText(/amount/i), '50000');
    await user.type(screen.getByLabelText(/close date/i), '2024-11-01');
    await user.click(screen.getByRole('button', { name: /create opportunity/i }));

    await screen.findByRole('heading', { level: 2, name: /logistics upgrade/i });

    const backLink = screen.getByRole('link', { name: /opportunities/i });
    await user.click(backLink);

    const table = await screen.findByRole('table');
    const rows = within(table).getAllByRole('row');
    expect(rows.some((row) => within(row).queryByText('Logistics Upgrade'))).toBe(true);
  });
});
