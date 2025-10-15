# Acumen CRM

Acumen CRM is a lightweight customer relationship management application designed for small teams. It runs entirely in the browser, persists data with `localStorage`, and provides full CRUD workflows for accounts, contacts, and opportunities.

## Getting Started

You can load the application in two ways:

1. **Use the built-in development server (recommended)**
   ```bash
   npm start
   ```
   This launches a static server on [http://localhost:4173](http://localhost:4173) with proper MIME types so modern browsers load the scripts without security warnings.

2. **Open the static file directly**
   Open `index.html` in a modern browser (Chrome, Edge, Firefox, or Safari). All assets are relative and require no build step.

The app comes preloaded with realistic sample data so you can explore workflows immediately. All data you add or modify is stored locally in your browser.

## Available Scripts

- `npm start` – serve the application locally for development.
- `npm test` – run a headless smoke test that exercises the data store, relationship integrity, and pipeline stage calculations.

## Features

- Accounts, contacts, and opportunities with bidirectional linking
- Pipeline board grouped by stage with total value summaries
- Contextual detail views and relationship navigation
- Form validation with clear messaging and guardrails
- Responsive layout that works on desktops and tablets

## Resetting Data

To start fresh, clear the "Acumen CRM" site data from your browser's storage or run the following in the browser console:

```js
localStorage.removeItem('acumen-crm-data');
```

## Browser Support

The application targets evergreen browsers. No build tooling or framework dependencies are required.
