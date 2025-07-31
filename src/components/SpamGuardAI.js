import React, { useState, useEffect } from 'react';
import { Shield, Mail, Settings, Lock, Trash2, AlertTriangle, CheckCircle, XCircle, BarChart3, Bell, User, Search, Menu, X, RefreshCw, Download, ArrowLeft, Filter, Plus } from 'lucide-react';

const SpamGuardAI = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const [outlookStatus, setOutlookStatus] = useState({
    connected: false,
    lastSync: null,
    totalEmails: 0,
    newEmails: 0
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [emails] = useState([
    {
      id: 1,
      from: 'john.doe@company.com',
      subject: 'Q4 Financial Report - Action Required',
      preview: 'Please review the attached quarterly financial report and provide your feedback by EOD...',
      timestamp: '2 hours ago',
      isSpam: false,
      confidence: 96,
      category: 'work',
      isRead: false
    },
    {
      id: 2,
      from: 'winner@mega-lottery.fake',
      subject: 'URGENT: You have Won $2,500,000 - Claim Now!',
      preview: 'CONGRATULATIONS!!! You are the lucky winner of our international lottery...',
      timestamp: '3 hours ago',
      isSpam: true,
      confidence: 99,
      category: 'scam',
      isRead: false
    },
    {
      id: 3,
      from: 'security@your-bank.phish',
      subject: 'URGENT: Account Suspended - Verify Identity',
      preview: 'Your account has been temporarily suspended due to suspicious activity...',
      timestamp: '5 hours ago',
      isSpam: true,
      confidence: 94,
      category: 'phishing',
      isRead: false
    },
    {
      id: 4,
      from: 'newsletter@techcrunch.com',
      subject: 'Daily Crunch: AI startup raises $50M',
      preview: 'Here are the top tech stories from today: AI startup secures major funding...',
      timestamp: '1 day ago',
      isSpam: false,
      confidence: 91,
      category: 'newsletter',
      isRead: true
    }
  ]);

  const [settings, setSettings] = useState({
    aggressiveFiltering: true,
    blockSuspiciousImages: true,
    realTimeScanning: true,
    notificationAlerts: true,
    customKeywords: ['lottery', 'winner', 'claim now', 'urgent action', 'limited time']
  });

  const stats = {
    totalScanned: 1247,
    spamBlocked: 89,
    accuracy: 97.3,
    timeSaved: '4.2 hours'
  };

  const spamEmails = emails.filter(email => email.isSpam);
  const cleanEmails = emails.filter(email => !email.isSpam);

  const connectToOutlook = () => {
    setIsScanning(true);
    setTimeout(() => {
      setOutlookStatus({
        connected: true,
        lastSync: new Date().toLocaleTimeString(),
        totalEmails: emails.length,
        newEmails: emails.filter(e => !e.isRead).length
      });
      setIsScanning(false);
    }, 3000);
  };

  const SpamConfidenceBadge = ({ confidence, isSpam }) => {
    const getColor = () => {
      if (!isSpam) return 'bg-green-100 text-green-800';
      if (confidence >= 95) return 'bg-red-100 text-red-800';
      return 'bg-orange-100 text-orange-800';
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}>
        {isSpam ? `${confidence}% Spam` : `${confidence}% Clean`}
      </span>
    );
  };

  const EmailItem = ({ email }) => (
    <div className={`p-4 border rounded-lg ${email.isSpam ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{email.subject}</h3>
            {email.isSpam && <AlertTriangle className="w-4 h-4 text-red-500" />}
          </div>
          <p className="text-sm text-gray-600 truncate">{email.from}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs text-gray-500">{email.timestamp}</span>
          <SpamConfidenceBadge confidence={email.confidence} isSpam={email.isSpam} />
        </div>
      </div>
      <p className={`text-sm mt-2 ${email.isSpam ? 'text-red-700' : 'text-gray-700'}`}>
        {email.isSpam && settings.blockSuspiciousImages ? '[Content blocked for security]' : email.preview}
      </p>
      <div className="flex items-center justify-between mt-3">
        <span className={`text-xs px-2 py-1 rounded ${
          email.category === 'work' ? 'bg-blue-100 text-blue-800' :
          email.category === 'scam' ? 'bg-red-100 text-red-800' :
          email.category === 'phishing' ? 'bg-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {email.category}
        </span>
        <div className="flex gap-2">
          <button className="text-gray-600 hover:text-gray-800">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-xl md:text-2xl font-bold ${
            color === 'blue' ? 'text-blue-600' : 
            color === 'red' ? 'text-red-600' : 
            color === 'green' ? 'text-green-600' : 'text-purple-600'
          }`}>{value}</p>
        </div>
        <Icon className={`w-6 h-6 md:w-8 md:h-8 ${
          color === 'blue' ? 'text-blue-500' : 
          color === 'red' ? 'text-red-500' : 
          color === 'green' ? 'text-green-500' : 'text-purple-500'
        }`} />
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">MS Outlook Integration</h3>
          {outlookStatus.connected ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
        </div>
        
        {!outlookStatus.connected ? (
          <div className="space-y-4">
            <p className="text-gray-600">Connect to your Microsoft Outlook account to start scanning your inbox for spam and malicious emails.</p>
            <button
              onClick={connectToOutlook}
              disabled={isScanning}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Connect to Outlook
                </>
              )}
            </button>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <Lock className="w-4 h-4 inline mr-1" />
                Secure OAuth 2.0 authentication. We never store your password.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600">Total Emails</p>
                <p className="text-lg font-semibold">{outlookStatus.totalEmails}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600">New Emails</p>
                <p className="text-lg font-semibold text-blue-600">{outlookStatus.newEmails}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Sync</p>
                <p className="text-sm font-medium">{outlookStatus.lastSync}</p>
              </div>
              <button
                onClick={() => {
                  setIsScanning(true);
                  setTimeout(() => {
                    setOutlookStatus(prev => ({
                      ...prev,
                      lastSync: new Date().toLocaleTimeString(),
                      newEmails: Math.floor(Math.random() * 5)
                    }));
                    setIsScanning(false);
                  }, 2000);
                }}
                disabled={isScanning}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Scan Now
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={Mail} title="Scanned" value={stats.totalScanned} color="blue" />
        <StatCard icon={Shield} title="Blocked" value={stats.spamBlocked} color="red" />
        <StatCard icon={CheckCircle} title="Accuracy" value={`${stats.accuracy}%`} color="green" />
        <StatCard icon={User} title="Time Saved" value={stats.timeSaved} color="purple" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {emails.slice(0, 3).map(email => (
              <div key={email.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {email.isSpam ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{email.subject}</p>
                  <p className="text-xs text-gray-500">{email.from}</p>
                </div>
                <SpamConfidenceBadge confidence={email.confidence} isSpam={email.isSpam} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">AI Protection Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Spam Detection</span>
                <span className="text-sm text-green-600">Active</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '97%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Phishing Protection</span>
                <span className="text-sm text-green-600">Active</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Outlook Integration</span>
                <span className={`text-sm ${outlookStatus.connected ? 'text-green-600' : 'text-orange-600'}`}>
                  {outlookStatus.connected ? 'Connected' : 'Pending'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${outlookStatus.connected ? 'bg-green-600' : 'bg-orange-500'}`} style={{width: outlookStatus.connected ? '100%' : '45%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const InboxView = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Clean Inbox</h2>
      <div className="space-y-3">
        {cleanEmails.map(email => (
          <EmailItem key={email.id} email={email} />
        ))}
      </div>
    </div>
  );

  const SpamView = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Spam Quarantine</h2>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            These emails have been automatically quarantined by SpamGuard AI. Review carefully before taking action.
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {spamEmails.map(email => (
          <EmailItem key={email.id} email={email} />
        ))}
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Spam Protection</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Aggressive Filtering</h4>
              <p className="text-sm text-gray-600">Higher sensitivity for spam detection</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.aggressiveFiltering}
                onChange={(e) => setSettings({...settings, aggressiveFiltering: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Block Suspicious Images</h4>
              <p className="text-sm text-gray-600">Prevent loading of harmful content</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.blockSuspiciousImages}
                onChange={(e) => setSettings({...settings, blockSuspiciousImages: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Real-time Outlook Scanning</h4>
              <p className="text-sm text-gray-600">Automatically scan new emails as they arrive</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.realTimeScanning}
                onChange={(e) => setSettings({...settings, realTimeScanning: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">Custom Keywords Manager</h3>
        </div>
        <p className="text-red-800 mb-6">Add keywords and phrases that should trigger spam detection</p>
        
        <div className="bg-white p-4 rounded-lg mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Add New Keyword</h4>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type keyword or phrase here..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  const newKeyword = e.target.value.trim().toLowerCase();
                  if (!settings.customKeywords.includes(newKeyword)) {
                    setSettings({
                      ...settings,
                      customKeywords: [...settings.customKeywords, newKeyword]
                    });
                    e.target.value = '';
                  } else {
                    alert('This keyword already exists!');
                  }
                }
              }}
              id="new-keyword-input"
            />
            <button 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
              onClick={() => {
                const input = document.getElementById('new-keyword-input');
                const newKeyword = input?.value?.trim()?.toLowerCase();
                if (newKeyword && !settings.customKeywords.includes(newKeyword)) {
                  setSettings({
                    ...settings,
                    customKeywords: [...settings.customKeywords, newKeyword]
                  });
                  input.value = '';
                } else if (newKeyword && settings.customKeywords.includes(newKeyword)) {
                  alert('This keyword already exists!');
                }
              }}
            >
              <Plus className="w-5 h-5" />
              Add Keyword
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">
              Your Keywords ({settings.customKeywords.length} active)
            </h4>
            {settings.customKeywords.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to remove all keywords?')) {
                    setSettings({...settings, customKeywords: []});
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Clear All
              </button>
            )}
          </div>
          
          {settings.customKeywords.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg mb-2">No keywords added yet</p>
              <p className="text-gray-400 text-sm">Add keywords above to enhance spam detection</p>
            </div>
          ) : (
            <div className="space-y-3">
              {settings.customKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-900 font-medium text-lg">{keyword}</span>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      {keyword.includes(' ') ? 'Phrase' : 'Word'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const newKeywords = settings.customKeywords.filter((_, i) => i !== index);
                      setSettings({...settings, customKeywords: newKeywords});
                    }}
                    className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 p-2 rounded-lg transition-colors"
                    title="Remove this keyword"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg mt-4">
          <h4 className="font-medium text-gray-900 mb-4">Quick Add Common Spam Keywords</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'free money', 'act now', 'limited offer', 'click here', 
              'guaranteed', 'urgent response', 'congratulations', 'winner',
              'claim prize', 'exclusive deal', 'no obligation', 'risk free'
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  if (!settings.customKeywords.includes(suggestion)) {
                    setSettings({
                      ...settings,
                      customKeywords: [...settings.customKeywords, suggestion]
                    });
                  }
                }}
                disabled={settings.customKeywords.includes(suggestion)}
                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                  settings.customKeywords.includes(suggestion)
                    ? 'bg-green-100 text-green-800 border-green-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                {settings.customKeywords.includes(suggestion) ? '✓ Added' : `+ Add "${suggestion}"`}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Privacy & Security</h3>
        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
          <Lock className="w-6 h-6 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900">On-Device Processing</h4>
            <p className="text-sm text-green-700">All AI analysis happens locally on your device. Your emails never leave your computer, ensuring complete privacy and security.</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Push Notifications</h4>
              <p className="text-sm text-gray-600">Get alerts when spam is detected</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationAlerts}
                onChange={(e) => setSettings({...settings, notificationAlerts: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'inbox': return <InboxView />;
      case 'spam': return <SpamView />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && (
        <div className="w-64 bg-white shadow-lg border-r">
          <div className="flex items-center gap-2 p-4 border-b">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">SpamGuard AI</h1>
          </div>
          
          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
              { id: 'inbox', icon: Mail, label: 'Clean Inbox', count: cleanEmails.length },
              { id: 'spam', icon: Trash2, label: 'Spam Quarantine', count: spamEmails.length },
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
      )}

      {!isMobile && (
        <div className="w-64 bg-white shadow-lg border-r">
          <div className="flex items-center gap-2 p-4 border-b">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">SpamGuard AI</h1>
          </div>
          
          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
              { id: 'inbox', icon: Mail, label: 'Clean Inbox', count: cleanEmails.length },
              { id: 'spam', icon: Trash2, label: 'Spam Quarantine', count: spamEmails.length },
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
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isMobile && (
                <button onClick={() => setSidebarOpen(true)}>
                  <Menu className="w-6 h-6" />
                </button>
              )}
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                {currentView === 'dashboard' ? 'Dashboard' :
                 currentView === 'inbox' ? 'Clean Inbox' :
                 currentView === 'spam' ? 'Spam Quarantine' : 'Settings'}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Protected</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className={`flex-1 overflow-auto p-6 ${isMobile ? 'pb-20' : ''}`}>
          {renderCurrentView()}
        </main>
      </div>
      
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-2">
          <div className="flex justify-around">
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
              { id: 'inbox', icon: Mail, label: 'Inbox' },
              { id: 'spam', icon: Shield, label: 'Quarantine' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg ${
                  currentView === item.id ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default SpamGuardAI;