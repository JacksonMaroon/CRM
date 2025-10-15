# Atlas CRM

A production-ready CRM starter built with React, TypeScript, and Vite. The application manages Accounts, Contacts, and Opportunities with persistent local storage, rich navigation, and a kanban pipeline view for opportunities.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173 to use the app.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reloading. |
| `npm run build` | Type-check and bundle the application for production. |
| `npm run preview` | Preview the production build locally. |
| `npm test` | Run unit and integration tests with Vitest and Testing Library. |

### Testing

Tests cover the local-storage backed data services and an end-to-end opportunity creation flow, including validation. Run all tests with:

```bash
npm test
```

Vitest is configured for a JSDOM environment, so the React components render as they do in the browser.

## Features

- **Entity management:** CRUD flows for accounts, contacts, and opportunities with validation and deletion confirmations.
- **Relationship-aware navigation:** Accounts surface related contacts and opportunities, with reciprocal links from contact and opportunity detail pages.
- **Opportunity pipeline:** Kanban board grouped by stage, total open pipeline value, and color-coded status indicators.
- **Responsive layout:** Sidebar navigation, modern typography, and mobile-friendly grid layouts.
- **Local persistence:** Data services encapsulate localStorage access for easy backend migration in the future.
- **Error handling:** Empty states, contextual validation messages, and safeguards against creating opportunities without accounts.
- **Sample data seed:** On first load, realistic demo data is bootstrapped to showcase the experience.

## Architecture

- `src/data/` encapsulates models, utilities, sample data, and the persistence service.
- `src/state/DataContext.tsx` exposes global state and CRUD helpers via React context.
- `src/pages/` contains the routed views for each entity and feature.
- `src/components/Layout.tsx` defines the primary application shell.
- Tests live in `src/__tests__/` and cover both services and UI flows.

## Future enhancements

- Connect the data service to a real API or database.
- Add authentication and user management.
- Extend reporting with charts and pipeline forecasting.
