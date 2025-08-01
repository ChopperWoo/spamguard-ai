// src/services/graphService.js
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';

class GraphService {
  constructor(msalInstance) {
    this.msalInstance = msalInstance;
    this.graphClient = null;
  }

  async initializeGraphClient() {
    try {
      // Create an authentication provider
      const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
        this.msalInstance,
        {
          account: this.msalInstance.getActiveAccount(),
          scopes: ['User.Read', 'Mail.Read', 'Mail.ReadWrite'],
          interactionType: 'popup'
        }
      );

      // Initialize Graph client
      this.graphClient = Client.initWithMiddleware({ authProvider });
      return true;
    } catch (error) {
      console.error('Error initializing Graph client:', error);
      return false;
    }
  }

  async getUserProfile() {
    try {
      if (!this.graphClient) {
        await this.initializeGraphClient();
      }
      
      const user = await this.graphClient.api('/me').get();
      return user;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async getEmails(pageSize = 50, filter = null) {
    try {
      if (!this.graphClient) {
        await this.initializeGraphClient();
      }

      let query = this.graphClient
        .api('/me/messages')
        .top(pageSize)
        .select('id,subject,from,receivedDateTime,bodyPreview,hasAttachments,isRead,importance,internetMessageHeaders')
        .orderby('receivedDateTime desc');

      if (filter) {
        query = query.filter(filter);
      }

      const emails = await query.get();
      return this.transformEmails(emails.value);
    } catch (error) {
      console.error('Error getting emails:', error);
      throw error;
    }
  }

  async moveEmailToFolder(emailId, folderId) {
    try {
      if (!this.graphClient) {
        await this.initializeGraphClient();
      }

      await this.graphClient
        .api(`/me/messages/${emailId}/move`)
        .post({
          destinationId: folderId
        });

      return true;
    } catch (error) {
      console.error('Error moving email:', error);
      throw error;
    }
  }

  async createSpamFolder() {
    try {
      if (!this.graphClient) {
        await this.initializeGraphClient();
      }

      const folder = await this.graphClient
        .api('/me/mailFolders')
        .post({
          displayName: 'SpamGuard Quarantine',
          isHidden: false
        });

      return folder;
    } catch (error) {
      console.error('Error creating spam folder:', error);
      throw error;
    }
  }

  async getMailFolders() {
    try {
      if (!this.graphClient) {
        await this.initializeGraphClient();
      }

      const folders = await this.graphClient
        .api('/me/mailFolders')
        .get();

      return folders.value;
    } catch (error) {
      console.error('Error getting mail folders:', error);
      throw error;
    }
  }

  // Transform Microsoft Graph email format to our app format
  transformEmails(emails) {
    return emails.map((email, index) => ({
      id: email.id,
      from: email.from?.emailAddress?.address || 'Unknown',
      fromName: email.from?.emailAddress?.name || email.from?.emailAddress?.address || 'Unknown',
      subject: email.subject || '(No Subject)',
      preview: email.bodyPreview || '',
      timestamp: this.formatTimestamp(email.receivedDateTime),
      isSpam: false, // This will be determined by your AI logic
      confidence: 0, // This will be set by your spam detection
      category: this.detectCategory(email),
      hasAttachment: email.hasAttachments || false,
      isRead: email.isRead || false,
      starred: false,
      importance: email.importance || 'normal',
      rawEmail: email, // Keep original for reference
      aiAnalysis: null // Will be populated by your AI
    }));
  }

  detectCategory(email) {
    const subject = (email.subject || '').toLowerCase();
    const from = (email.from?.emailAddress?.address || '').toLowerCase();
    
    // Basic category detection - you can enhance this
    if (from.includes('noreply') || from.includes('newsletter')) {
      return 'newsletter';
    }
    if (subject.includes('work') || subject.includes('meeting') || subject.includes('project')) {
      return 'work';
    }
    if (from.includes('microsoft') || from.includes('office') || from.includes('service')) {
      return 'service';
    }
    
    return 'personal';
  }

  formatTimestamp(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return '1 day ago';
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  }

  // Spam detection integration point
  async analyzeEmailForSpam(email) {
    try {
      // This is where you'd integrate your AI spam detection logic
      // For now, we'll do basic keyword detection
      const spamKeywords = [
        'lottery', 'winner', 'claim now', 'urgent action', 'limited time',
        'viagra', 'casino', 'free money', 'congratulations', 'prize'
      ];

      const subject = (email.subject || '').toLowerCase();
      const preview = (email.bodyPreview || '').toLowerCase();
      const from = (email.from?.emailAddress?.address || '').toLowerCase();

      let spamScore = 0;
      let detectedCategories = [];

      // Check for spam keywords
      spamKeywords.forEach(keyword => {
        if (subject.includes(keyword) || preview.includes(keyword)) {
          spamScore += 20;
          detectedCategories.push('keyword_match');
        }
      });

      // Check sender patterns
      if (from.includes('noreply') && subject.includes('winner')) {
        spamScore += 30;
        detectedCategories.push('sophisticated_scam');
      }

      // Check for phishing patterns
      if (subject.includes('verify') && subject.includes('account')) {
        spamScore += 40;
        detectedCategories.push('phishing');
      }

      const isSpam = spamScore > 50;
      const confidence = Math.min(95, Math.max(5, spamScore));

      return {
        isSpam,
        confidence,
        category: isSpam ? detectedCategories[0] || 'general_spam' : 'clean',
        aiAnalysis: {
          senderReputation: spamScore > 70 ? 'suspicious' : spamScore > 30 ? 'unknown' : 'trusted',
          contentAnalysis: detectedCategories.length > 0 ? detectedCategories.join(', ') : 'clean content',
          behaviorMatch: 'analyzed'
        }
      };
    } catch (error) {
      console.error('Error analyzing email for spam:', error);
      return {
        isSpam: false,
        confidence: 50,
        category: 'unknown',
        aiAnalysis: null
      };
    }
  }
}

export default GraphService;