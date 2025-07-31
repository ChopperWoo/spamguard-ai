import React, { useState } from 'react';
import { Shield, Mail, Settings, Trash2 } from 'lucide-react';

const SpamGuardAI = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const Dashboard = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">SpamGuard AI Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">Welcome to SpamGuard AI</h3>
        <p className="text-gray-600">Your email protection is active and monitoring for spam.</p>
      </div>
    </div>
  );

  const Settings = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">Custom Keywords</h3>
        <p className="text-gray-600">Keyword management coming soon...</p>
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
          <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentView === 'dashboard' ? 'Dashboard' : 'Settings'}
          </h2>
        </header>
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default SpamGuardAI;