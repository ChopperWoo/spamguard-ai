import React, { useState } from 'react';
import { Shield, Mail, Settings, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

const SpamGuardAI = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  // Sample email data
  const emails = [
    {
      id: 1,
      from: 'john.doe@company.com',
      subject: 'Q4 Financial Report - Action Required',
      preview: 'Please review the attached quarterly financial report...',
      timestamp: '2 hours ago',
      isSpam: false,
      confidence: 96,
      category: 'work'
    },
    {
      id: 2,
      from: 'winner@mega-lottery.fake',
      subject: 'URGENT: You have Won $2,500,000!',
      preview: 'CONGRATULATIONS!!! You are the lucky winner...',
      timestamp: '3 hours ago',
      isSpam: true,
      confidence: 99,
      category: 'scam'
    }
  ];

  const spamEmails = emails.filter(email => email.isSpam);
  const cleanEmails = emails.filter(email => !email.isSpam);

  const EmailItem = ({ email }) => (
    <div className={`p-4 border rounded-lg mb-3 ${email.isSpam ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{email.subject}</h3>
            {email.isSpam && <AlertTriangle className="w-4 h-4 text-red-500" />}
          </div>
          <p className="text-sm text-gray-600">{email.from}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500">{email.timestamp}</span>
          <div className={`mt-1 px-2 py-1 rounded-full text-xs font-medium ${
            email.isSpam ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {email.confidence}% {email.isSpam ? 'Spam' : 'Clean'}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-700">{email.preview}</p>
    </div>
  );

  const Dashboard = () => (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">Emails Scanned</h3>
          <p className="text-2xl font-bold text-blue-600">1,247</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">Spam Blocked</h3>
          <p className="text-2xl font-bold text-red-600">89</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">Accuracy</h3>
          <p className="text-2xl font-bold text-green-600">97.3%</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {emails.slice(0, 2).map(email => (
            <div key={email.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {email.isSpam ? (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{email.subject}</p>
                <p className="text-xs text-gray-500">{email.from}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const InboxView = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Clean Inbox</h1>
      {cleanEmails.map(email => (
        <EmailItem key={email.id} email={email} />
      ))}
    </div>
  );

  const SpamView = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Spam Quarantine</h1>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          These emails have been automatically quarantined. Review carefully before taking action.
        </p>
      </div>
      {spamEmails.map(email => (
        <EmailItem key={email.id} email={email} />
      ))}
    </div>
  );

  const SettingsView = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">Custom Keywords (Coming Soon)</h3>
        <p className="text-gray-600">Advanced keyword management will be available in the next update.</p>
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'inbox':
        return <InboxView />;
      case 'spam':
        return <SpamView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white shadow-lg border-r">
        <div className="flex items-center gap-2 p-4 border-b">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">SpamGuard AI</h1>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { id: 'dashboard', icon: Mail, label: 'Dashboard' },
            { id: 'inbox', icon: CheckCircle, label: 'Clean Inbox', count: cleanEmails.length },
            { id: 'spam', icon: Trash2, label: 'Quarantine', count: spamEmails.length },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                currentView === item.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.count !== undefined && (
                <span className={`ml-auto text-xs font-medium px-2 py-1 rounded-full ${
                  item.id === 'spam' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentView === 'dashboard' ? 'Dashboard' :
             currentView === 'inbox' ? 'Clean Inbox' :
             currentView === 'spam' ? 'Spam Quarantine' : 'Settings'}
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