import React, { useState, useEffect } from 'react';
import { Shield, Mail, Settings, AlertTriangle, CheckCircle, Trash2, BarChart3, Brain, Lock, RefreshCw, Download, Filter, Plus, X, Eye, EyeOff, Wifi, Bell, Search, Archive, Star, ChevronLeft, ChevronRight, Home, Menu, User, HelpCircle } from 'lucide-react';

const SpamGuardAI = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // AI Learning Status
  const [aiLearning, setAiLearning] = useState({
    userPreferences: 87,
    behaviorPatterns: 92,
    spamCategories: 95,
    falsePositives: 3.2
  });

  // Outlook Integration Status
  const [outlookStatus, setOutlookStatus] = useState({
    connected: false,
    lastSync: null,
    totalEmails: 0,
    newEmails: 0,
    syncInProgress: false
  });

  // Settings
  const [settings, setSettings] = useState({
    realTimeDetection: true,
    autoQuarantine: true,
    blockSuspiciousImages: true,
    onDeviceProcessing: true,
    adaptiveLearning: true,
    notificationAlerts: true,
    sophisticatedScamDetection: true,
    pornographicSpamFilter: true,
    customKeywords: ['lottery', 'winner', 'claim now', 'urgent action', 'limited time', 'viagra', 'casino']
  });

  // Enhanced email data with more spam categories
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
      hasAttachment: true,
      isRead: false,
      starred: false,
      aiAnalysis: {
        senderReputation: 'trusted',
        contentAnalysis: 'legitimate business',
        behaviorMatch: 'normal communication pattern'
      }
    },
    {
      id: 2,
      from: 'winner@mega-lottery.fake',
      subject: '🎉 URGENT: You have Won $2,500,000 - Claim Now!',
      preview: '[CONTENT BLOCKED] - Suspicious promotional content detected',
      timestamp: '3 hours ago',
      isSpam: true,
      confidence: 99,
      category: 'sophisticated_scam',
      hasAttachment: false,
      isRead: false,
      starred: false,
      aiAnalysis: {
        senderReputation: 'suspicious',
        contentAnalysis: 'lottery scam pattern',
        behaviorMatch: 'mass spam campaign'
      }
    },
    {
      id: 3,
      from: 'security@your-bank.phish',
      subject: 'URGENT: Account Suspended - Verify Identity',
      preview: '[CONTENT BLOCKED] - Phishing attempt detected',
      timestamp: '5 hours ago',
      isSpam: true,
      confidence: 97,
      category: 'phishing',
      hasAttachment: false,
      isRead: false,
      starred: false,
      aiAnalysis: {
        senderReputation: 'malicious',
        contentAnalysis: 'phishing template detected',
        behaviorMatch: 'known attack vector'
      }
    },
    {
      id: 4,
      from: 'adult-content@spam.net',
      subject: '[SUBJECT BLOCKED]',
      preview: '[CONTENT BLOCKED] - Adult content detected and filtered',
      timestamp: '1 day ago',
      isSpam: true,
      confidence: 98,
      category: 'pornographic',
      hasAttachment: true,
      isRead: false,
      starred: false,
      aiAnalysis: {
        senderReputation: 'blacklisted',
        contentAnalysis: 'adult content detected',
        behaviorMatch: 'spam network'
      }
    },
    {
      id: 5,
      from: 'newsletter@techcrunch.com',
      subject: 'Daily Crunch: AI startup raises $50M',
      preview: 'Here are the top tech stories from today: AI startup secures major funding...',
      timestamp: '1 day ago',
      isSpam: false,
      confidence: 91,
      category: 'newsletter',
      hasAttachment: false,
      isRead: true,
      starred: true,
      aiAnalysis: {
        senderReputation: 'verified publisher',
        contentAnalysis: 'legitimate newsletter',
        behaviorMatch: 'subscribed content'
      }
    },
    {
      id: 6,
      from: 'support@microsoft.com',
      subject: 'Your Office 365 subscription renewal',
      preview: 'Your Microsoft Office 365 subscription is due for renewal in 7 days...',
      timestamp: '2 days ago',
      isSpam: false,
      confidence: 94,
      category: 'service',
      hasAttachment: false,
      isRead: true,
      starred: false,
      aiAnalysis: {
        senderReputation: 'verified',
        contentAnalysis: 'service notification',
        behaviorMatch: 'subscription service'
      }
    }
  ]);

  const stats = {
    totalScanned: 1247,
    spamBlocked: 89,
    sophisticatedScamsBlocked: 23,
    pornographicSpamBlocked: 15,
    phishingAttempts: 31,
    accuracy: 97.3,
    falsePositives: 3,
    timeSaved: '4.2 hours',
    onDeviceProcessing: '100%'
  };

  const spamEmails = emails.filter(email => email.isSpam);
  const cleanEmails = emails.filter(email => !email.isSpam);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Connect to Outlook
  const connectToOutlook = () => {
    setIsScanning(true);
    setOutlookStatus(prev => ({ ...prev, syncInProgress: true }));
    
    setTimeout(() => {
      setOutlookStatus({
        connected: true,
        lastSync: new Date().toLocaleTimeString(),
        totalEmails: emails.length,
        newEmails: emails.filter(e => !e.isRead).length,
        syncInProgress: false
      });
      setIsScanning(false);
    }, 3000);
  };

  // Spam confidence badge
  const SpamConfidenceBadge = ({ confidence, isSpam, category }) => {
    const getColor = () => {
      if (!isSpam) return 'bg-green-100 text-green-800';
      if (category === 'sophisticated_scam') return 'bg-red-100 text-red-800';
      if (category === 'pornographic') return 'bg-purple-100 text-purple-800';
      if (category === 'phishing') return 'bg-orange-100 text-orange-800';
      if (confidence >= 95) return 'bg-red-100 text-red-800';
      return 'bg-yellow-100 text-yellow-800';
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}>
        {isSpam ? `${confidence}% Spam` : `${confidence}% Clean`}
      </span>
    );
  };

  // Enhanced email item component
  const EmailItem = ({ email }) => (
    <div className={`p-4 border rounded-lg mb-3 ${email.isSpam ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold text-gray-900 truncate ${!email.isRead ? 'font-bold' : ''}`}>
              {email.subject}
            </h3>
            {email.isSpam && <AlertTriangle className="w-4 h-4 text-red-500" />}
            {email.hasAttachment && <div className="w-2 h-2 bg-gray-400 rounded-full" />}
            {!email.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
            {email.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
          </div>
          <p className="text-sm text-gray-600 truncate">{email.from}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs text-gray-500">{email.timestamp}</span>
          <SpamConfidenceBadge confidence={email.confidence} isSpam={email.isSpam} category={email.category} />
        </div>
      </div>
      
      <p className={`text-sm mt-2 ${email.isSpam ? 'text-red-700' : 'text-gray-700'}`}>
        {email.preview}
      </p>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded ${
            email.category === 'work' ? 'bg-blue-100 text-blue-800' :
            email.category === 'sophisticated_scam' ? 'bg-red-100 text-red-800' :
            email.category === 'pornographic' ? 'bg-purple-100 text-purple-800' :
            email.category === 'phishing' ? 'bg-orange-100 text-orange-800' :
            email.category === 'newsletter' ? 'bg-green-100 text-green-800' :
            email.category === 'service' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {email.category.replace('_', ' ')}
          </span>
          
          {email.aiAnalysis && (
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              AI: {email.aiAnalysis.senderReputation}
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          {email.isSpam ? (
            <button className="text-green-600 hover:text-green-800 text-sm">Mark Safe</button>
          ) : (
            <button className="text-red-600 hover:text-red-800 text-sm">Mark Spam</button>
          )}
          <button className="text-gray-600 hover:text-gray-800">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Navigation Menu
  const NavigationMenu = () => {
    const menuItems = [
      { id: 'dashboard', icon: Home, label: 'Dashboard' },
      { id: 'inbox', icon: Mail, label: 'Clean Inbox', count: cleanEmails.length },
      { id: 'spam', icon: Shield, label: 'Quarantine', count: spamEmails.length },
      { id: 'analytics', icon: BarChart3, label: 'Analytics' },
      { id: 'settings', icon: Settings, label: 'Settings' },
      { id: 'help', icon: HelpCircle, label: 'Help' }
    ];

    return (
      <nav className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 w-64' : 'w-64'} bg-white border-r border-gray-200 ${isMobile && !sidebarOpen ? '-translate-x-full' : ''} transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">SpamGuard AI</h1>
            <p className="text-xs text-gray-500">Advanced Protection</p>
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentView === item.id 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== undefined && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentView === item.id 
                    ? 'bg-blue-200 text-blue-800' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* AI Status Indicator */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">AI Active</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Real-time protection enabled
            </p>
          </div>
        </div>
      </nav>
    );
  };

  // Dashboard view
  const Dashboard = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">SpamGuard AI Dashboard</h1>
        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">AI Active</span>
        </div>
      </div>

      {/* Outlook Integration Card */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Wifi className={`w-6 h-6 ${outlookStatus.connected ? 'text-green-500' : 'text-red-500'}`} />
            <h3 className="text-lg font-semibold">MS Outlook Integration</h3>
          </div>
          {outlookStatus.connected ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-red-500" />
          )}
        </div>
        
        {!outlookStatus.connected ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Connect to your Microsoft Outlook account to enable real-time spam detection and automatic filtering.
            </p>
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
                Secure OAuth 2.0 authentication. All processing happens on your device.
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
                <p className="text-sm text-gray-600">Last Sync</p>
                <p className="text-sm font-medium">{outlookStatus.lastSync}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">Emails Scanned</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalScanned}</p>
          <p className="text-xs text-gray-500 mt-1">Real-time processing</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">Total Spam Blocked</h3>
          <p className="text-2xl font-bold text-red-600">{stats.spamBlocked}</p>
          <p className="text-xs text-gray-500 mt-1">Auto-quarantined</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">AI Accuracy</h3>
          <p className="text-2xl font-bold text-green-600">{stats.accuracy}%</p>
          <p className="text-xs text-gray-500 mt-1">{stats.falsePositives} false positives</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">Time Saved</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.timeSaved}</p>
          <p className="text-xs text-gray-500 mt-1">This week</p>
        </div>
      </div>

      {/* Advanced Threat Protection Stats */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">Advanced Threat Protection</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <h4 className="text-sm font-medium text-red-800">Sophisticated Scams</h4>
            <p className="text-2xl font-bold text-red-600">{stats.sophisticatedScamsBlocked}</p>
            <p className="text-xs text-red-600">Blocked this week</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <h4 className="text-sm font-medium text-purple-800">Adult Content</h4>
            <p className="text-2xl font-bold text-purple-600">{stats.pornographicSpamBlocked}</p>
            <p className="text-xs text-purple-600">Filtered automatically</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <h4 className="text-sm font-medium text-orange-800">Phishing Attempts</h4>
            <p className="text-2xl font-bold text-orange-600">{stats.phishingAttempts}</p>
            <p className="text-xs text-orange-600">Prevented attacks</p>
          </div>
        </div>
      </div>

      {/* AI Learning Progress */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">AI Learning Progress</h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">User Preferences</span>
              <span className="text-sm text-blue-600">{aiLearning.userPreferences}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: `${aiLearning.userPreferences}%`}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Behavior Patterns</span>
              <span className="text-sm text-green-600">{aiLearning.behaviorPatterns}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: `${aiLearning.behaviorPatterns}%`}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Spam Categories</span>
              <span className="text-sm text-purple-600">{aiLearning.spamCategories}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{width: `${aiLearning.spamCategories}%`}}></div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            AI continuously learns from your email patterns to improve accuracy and reduce false positives.
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">Recent Threat Detection</h3>
        <div className="space-y-3">
          {emails.filter(e => e.isSpam).slice(0, 3).map(email => (
            <div key={email.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{email.subject}</p>
                <p className="text-xs text-gray-500">{email.category.replace('_', ' ')} - {email.from}</p>
              </div>
              <SpamConfidenceBadge confidence={email.confidence} isSpam={email.isSpam} category={email.category} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Inbox view
  const InboxView = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clean Inbox</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Legitimate Emails ({cleanEmails.length})</h3>
            <div className="flex items-center gap-2">
              <button className="text-gray-600 hover:text-gray-800">
                <Archive className="w-4 h-4" />
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          {cleanEmails.filter(email => 
            email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.from.toLowerCase().includes(searchQuery.toLowerCase())
          ).map(email => (
            <EmailItem key={email.id} email={email} />
          ))}
        </div>
      </div>
    </div>
  );

  // Spam/Quarantine view
  const SpamView = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quarantine</h1>
        <div className="flex items-center gap-3">
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            <Trash2 className="w-4 h-4 mr-2" />
            Empty Quarantine
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Quarantined Emails ({spamEmails.length})</h3>
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span>High-risk content blocked</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          {spamEmails.map(email => (
            <EmailItem key={email.id} email={email} />
          ))}
        </div>
      </div>
    </div>
  );

  // Analytics view
  const AnalyticsView = () => (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">Weekly Protection Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total Threats Blocked</span>
              <span className="font-semibold text-red-600">{stats.spamBlocked}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Phishing Attempts</span>
              <span className="font-semibold text-orange-600">{stats.phishingAttempts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Scam Detection</span>
              <span className="font-semibold text-red-600">{stats.sophisticatedScamsBlocked}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Adult Content Filtered</span>
              <span className="font-semibold text-purple-600">{stats.pornographicSpamBlocked}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">AI Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Overall Accuracy</span>
                <span className="font-semibold text-green-600">{stats.accuracy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: `${stats.accuracy}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">False Positive Rate</span>
                <span className="font-semibold text-yellow-600">{aiLearning.falsePositives}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{width: `${aiLearning.falsePositives}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Processing Speed</span>
                <span className="font-semibold text-blue-600">Real-time</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Threat Categories Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.sophisticatedScamsBlocked}</div>
              <div className="text-sm text-red-800">Sophisticated Scams</div>
              <div className="text-xs text-red-600">25.8% of threats</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.phishingAttempts}</div>
              <div className="text-sm text-orange-800">Phishing</div>
              <div className="text-xs text-orange-600">34.8% of threats</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.pornographicSpamBlocked}</div>
              <div className="text-sm text-purple-800">Adult Content</div>
              <div className="text-xs text-purple-600">16.9% of threats</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{stats.spamBlocked - stats.sophisticatedScamsBlocked - stats.phishingAttempts - stats.pornographicSpamBlocked}</div>
              <div className="text-sm text-gray-800">Other Spam</div>
              <div className="text-xs text-gray-600">22.5% of threats</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Settings view with enhanced options
  const SettingsView = () => (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">SpamGuard AI Settings</h1>

      {/* AI Protection Settings */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">AI Protection Features</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Real-time Spam Detection</h4>
              <p className="text-sm text-gray-600">Automatically scan emails as they arrive</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.realTimeDetection}
                onChange={(e) => setSettings({...settings, realTimeDetection: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Sophisticated Scam Detection</h4>
              <p className="text-sm text-gray-600">Advanced AI to detect complex scam attempts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sophisticatedScamDetection}
                onChange={(e) => setSettings({...settings, sophisticatedScamDetection: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Adult Content Filter</h4>
              <p className="text-sm text-gray-600">Block pornographic and inappropriate content</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pornographicSpamFilter}
                onChange={(e) => setSettings({...settings, pornographicSpamFilter: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Block Suspicious Images</h4>
              <p className="text-sm text-gray-600">Prevent loading of potentially harmful image content</p>
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
              <h4 className="font-medium text-gray-900">On-Device Processing</h4>
              <p className="text-sm text-gray-600">Keep all data processing local for privacy</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.onDeviceProcessing}
                onChange={(e) => setSettings({...settings, onDeviceProcessing: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Adaptive Learning</h4>
              <p className="text-sm text-gray-600">AI learns from your preferences and behaviors</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.adaptiveLearning}
                onChange={(e) => setSettings({...settings, adaptiveLearning: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Auto-Quarantine</h4>
              <p className="text-sm text-gray-600">Automatically move spam to quarantine folder</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoQuarantine}
                onChange={(e) => setSettings({...settings, autoQuarantine: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Notification Alerts</h4>
              <p className="text-sm text-gray-600">Get notified when threats are detected</p>
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

      {/* Custom Keywords Manager */}
      <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg shadow">
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
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              id="keyword-input"
            />
            <button 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              onClick={() => {
                const input = document.getElementById('keyword-input');
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
              Add
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">
              Active Keywords ({settings.customKeywords.length})
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
            <div className="text-center py-8">
              <Filter className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No custom keywords added yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {settings.customKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-800 font-medium">{keyword}</span>
                  <button
                    onClick={() => {
                      setSettings({
                        ...settings,
                        customKeywords: settings.customKeywords.filter((_, i) => i !== index)
                      });
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold">Privacy & Security</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">End-to-End Privacy</h4>
            <p className="text-sm text-green-800 mb-3">
              All email processing happens locally on your device. No data is sent to external servers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">Local AI processing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">No cloud data storage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">Encrypted communications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">Zero data collection</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Secure Mode</h4>
              <p className="text-sm text-gray-600">Enhanced security with stricter filtering</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
              Enabled
            </button>
          </div>
        </div>
      </div>

      {/* Export/Import Settings */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">Backup & Restore</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Export Settings</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Import Settings</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Help view
  const HelpView = () => (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">Getting Started</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">1. Connect to Outlook</h4>
              <p className="text-sm text-blue-800">Link your Microsoft Outlook account for real-time protection</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">2. Configure Settings</h4>
              <p className="text-sm text-blue-800">Adjust AI protection features to match your preferences</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">3. Monitor Protection</h4>
              <p className="text-sm text-blue-800">View analytics and manage quarantined emails</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">FAQ</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">How does AI learning work?</h4>
              <p className="text-sm text-gray-600">SpamGuard AI learns from your email patterns and feedback to improve accuracy over time.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Is my data secure?</h4>
              <p className="text-sm text-gray-600">Yes, all processing happens locally on your device. No data is sent to external servers.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">What about false positives?</h4>
              <p className="text-sm text-gray-600">You can mark emails as safe to help the AI learn and reduce future false positives.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Advanced Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-medium text-purple-900">AI Learning</h4>
              <p className="text-sm text-purple-800">Adaptive algorithms that improve with use</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Shield className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <h4 className="font-medium text-red-900">Advanced Threats</h4>
              <p className="text-sm text-red-800">Protection against sophisticated scams and phishing</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Lock className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-medium text-green-900">Privacy First</h4>
              <p className="text-sm text-green-800">Local processing ensures complete privacy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Top bar for mobile
  const TopBar = () => (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between lg:hidden">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="text-gray-600 hover:text-gray-900"
      >
        <Menu className="w-6 h-6" />
      </button>
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-blue-600" />
        <span className="font-bold text-gray-900">SpamGuard AI</span>
      </div>
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-gray-600" />
        <User className="w-5 h-5 text-gray-600" />
      </div>
    </div>
  );

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'inbox':
        return <InboxView />;
      case 'spam':
        return <SpamView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      case 'help':
        return <HelpView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <NavigationMenu />
      
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default SpamGuardAI;