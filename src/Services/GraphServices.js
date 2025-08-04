// src/services/graphService.js
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { loginRequest } from '../config/authConfig';

class GraphService {
  constructor(msalInstance) {
    this.msalInstance = msalInstance;
    this.graphClient = null;
  }

  async initializeGraphClient() {
    try {
      const account = this.msalInstance.getActiveAccount();
      if (!account) {
        throw new Error('No active account found');
      }

      const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
        this.msalInstance,
        {
          account: account,
          scopes: loginRequest.scopes,
          interactionType: 'popup'
        }
      );

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
      
      const user = await this.graphClient
        .api('/me')
        .select('displayName,mail,userPrincipalName,id')
        .get();
      
      return user;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async getEmails(pageSize = 50) {
    try {
      if (!this.graphClient) {
        await this.initializeGraphClient();
      }

      const response = await this.graphClient
        .api('/me/messages')
        .top(pageSize)
        .select('id,subject,from,receivedDateTime,bodyPreview,hasAttachments,isRead,importance')
        .orderby('receivedDateTime desc')
        .get();

      return this.transformEmails(response.value);
    } catch (error) {
      console.error('Error getting emails:', error);
      throw error;
    }
  }

  transformEmails(emails) {
    return emails.map((email) => ({
      id: email.id,
      from: email.from?.emailAddress?.address || 'Unknown',
      fromName: email.from?.emailAddress?.name || 'Unknown',
      subject: email.subject || '(No Subject)',
      preview: email.bodyPreview || '',
      timestamp: this.formatTimestamp(email.receivedDateTime),
      isSpam: false,
      confidence: 0,
      category: this.detectCategory(email),
      hasAttachment: email.hasAttachments || false,
      isRead: email.isRead || false,
      starred: false,
      importance: email.importance || 'normal',
      rawEmail: email,
      aiAnalysis: null
    }));
  }

  detectCategory(email) {
    const subject = (email.subject || '').toLowerCase();
    const from = (email.from?.emailAddress?.address || '').toLowerCase();
    
    if (from.includes('noreply') || from.includes('newsletter')) {
      return 'newsletter';
    }
    if (subject.includes('work') || subject.includes('meeting')) {
      return 'work';
    }
    if (from.includes('microsoft') || from.includes('service')) {
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
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  }

  async analyzeEmailForSpam(email) {
    try {
      const spamKeywords = [
        'lottery', 'winner', 'claim now', 'urgent action', 'limited time',
        'viagra', 'casino', 'free money', 'congratulations', 'prize'
      ];

      const subject = (email.subject || '').toLowerCase();
      const preview = (email.preview || '').toLowerCase();
      const from = (email.from || '').toLowerCase();

      let spamScore = 0;
      let detectedCategories = [];

      spamKeywords.forEach(keyword => {
        if (subject.includes(keyword) || preview.includes(keyword)) {
          spamScore += 20;
          detectedCategories.push('keyword_match');
        }
      });

      if (from.includes('noreply') && subject.includes('winner')) {
        spamScore += 30;
        detectedCategories.push('sophisticated_scam');
      }

      if (subject.includes('verify') && subject.includes('account')) {
        spamScore += 40;
        detectedCategories.push('phishing');
      }

      const adultKeywords = ['adult', 'xxx', 'sexy', 'viagra'];
      if (adultKeywords.some(keyword => subject.includes(keyword) || preview.includes(keyword))) {
        spamScore += 35;
        detectedCategories.push('pornographic');
      }

      const isSpam = spamScore > 50;
      const confidence = Math.min(95, Math.max(5, spamScore));

      return {
        isSpam,
        confidence,
        category: isSpam ? detectedCategories[0] || 'general_spam' : email.category,
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