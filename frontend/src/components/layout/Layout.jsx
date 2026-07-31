import React from 'react';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import ProfileModal from '../profile/ProfileModal.jsx';
import OnboardingModal from '../profile/OnboardingModal.jsx';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-paper-2 text-ink-text font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
      <ProfileModal />
      <OnboardingModal />
    </div>
  );
}
