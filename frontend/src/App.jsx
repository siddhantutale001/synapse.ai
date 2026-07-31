import React from 'react';
import { WorkspaceProvider } from './context/WorkspaceContext.jsx';
import Layout from './components/layout/Layout.jsx';
import DashboardApp from './pages/DashboardApp.jsx';

export default function App() {
  return (
    <WorkspaceProvider>
      <Layout>
        <DashboardApp />
      </Layout>
    </WorkspaceProvider>
  );
}
