# JobPilot React

JobPilot converted into a component-based React + Vite project while preserving the existing demo functionality.

## Structure

src/
- App.jsx
- main.jsx
- index.css
- components/
  - Navbar.jsx
  - JobCard.jsx
  - ProviderCard.jsx
  - Modal.jsx
  - Sidebar.jsx
- pages/
  - JobsPage.jsx
  - ProvidersPage.jsx
  - DashboardPage.jsx
  - ApplicationsPage.jsx
  - BookingPage.jsx
  - FavoritesPage.jsx
  - NotificationsPage.jsx
  - ChatPage.jsx

## Install and run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## npm setup

Runtime dependencies:
- react
- react-dom

Development dependencies:
- vite
- @vitejs/plugin-react

No React Router, Axios, or Firebase npm package is required for the current version. Firebase compat scripts remain optional in index.html because the existing app uses the browser Firebase compat API only when a Firebase config is supplied.

The app currently uses tab-based navigation, so React Router is not required.
