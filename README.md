# Acumen CRM

Acumen CRM is a lightweight customer relationship management application designed for small teams. It runs entirely in the browser, persists data with `localStorage`, and provides full CRUD workflows for accounts, contacts, and opportunities.

## Getting Started

1. Open `index.html` in a modern browser (Chrome, Edge, Firefox, or Safari).
2. The app comes preloaded with realistic sample data so you can explore the workflow immediately.
3. All data you add or modify is stored locally in your browser.

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

The application targets evergreen browsers with ES modules support. No build step or external dependencies are required.
