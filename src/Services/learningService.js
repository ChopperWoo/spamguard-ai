// src/services/learningService.js
class LearningService {
  constructor() {
    this.spamPatterns = new Map();
    this.senderPatterns = new Map();
    this.subjectPatterns = new Map();
    this.domainPatterns = new Map();
    this.learningData = {
      totalAnalyzed: 0,
      spamKeywords: new Set(),
      trustedSenders: new Set(),
      suspiciousSenders: new Set(),
      spamDomains: new Set(),
      trustedDomains: new Set(),
      timePatterns: new Map(),
      confidence: 0
    };
  }

  // Analyze emails from junk folder to learn patterns
  async learnFromJunkFolder(junkEmails) {
    console.log(`Learning from ${junkEmails.length} junk emails...`);
    
    for (const email of junkEmails) {
      this.analyzeSpamEmail(email);
    }
    
    this.calculateConfidence();
    this.saveToStorage();
    
    return {
      totalLearned: junkEmails.length,
      patterns: this.getLearningStats(),
      confidence: this.learningData.confidence
    };
  }

  // Analyze a single spam email to extract patterns
  analyzeSpamEmail(email) {
    this.learningData.totalAnalyzed++;
    
    // Extract sender patterns
    const sender = this.extractEmailAddress(email.from);
    const domain = this.extractDomain(sender);
    
    this.learningData.suspiciousSenders.add(sender);
    this.learningData.spamDomains.add(domain);
    
    // Extract subject patterns
    const subject = (email.subject || '').toLowerCase();
    const subjectWords = this.extractKeywords(subject);
    
    subjectWords.forEach(word => {
      if (word.length > 2) {
        this.learningData.spamKeywords.add(word);
      }
    });
    
    // Extract content patterns
    const content = (email.bodyPreview || '').toLowerCase();
    const contentWords = this.extractKeywords(content);
    
    contentWords.forEach(word => {
      if (word.length > 3) {
        this.learningData.spamKeywords.add(word);
      }
    });
    
    // Time pattern analysis
    const hour = new Date(email.receivedDateTime).getHours();
    const currentCount = this.learningData.timePatterns.get(hour) || 0;
    this.learningData.timePatterns.set(hour, currentCount + 1);
    
    // Update pattern strength
    this.updatePatternStrength(sender, 'spam');
    this.updatePatternStrength(domain, 'domain_spam');
    this.updatePatternStrength(subject, 'subject_spam');
  }

  // Learn from clean emails (inbox) to identify trusted patterns
  async learnFromCleanEmails(cleanEmails) {
    console.log(`Learning from ${cleanEmails.length} clean emails...`);
    
    for (const email of cleanEmails) {
      this.analyzeCleanEmail(email);
    }
    
    this.calculateConfidence();
    this.saveToStorage();
  }

  analyzeCleanEmail(email) {
    const sender = this.extractEmailAddress(email.from);
    const domain = this.extractDomain(sender);
    
    this.learningData.trustedSenders.add(sender);
    this.learningData.trustedDomains.add(domain);
    
    this.updatePatternStrength(sender, 'trusted');
    this.updatePatternStrength(domain, 'domain_trusted');
  }

  // Analyze a new email and predict if it's spam
  async predictSpam(email) {
    const sender = this.extractEmailAddress(email.from);
    const domain = this.extractDomain(sender);
    const subject = (email.subject || '').toLowerCase();
    const content = (email.bodyPreview || '').toLowerCase();
    const receivedHour = new Date(email.receivedDateTime).getHours();
    
    let spamScore = 0;
    let reasons = [];
    
    // Check sender reputation
    if (this.learningData.suspiciousSenders.has(sender)) {
      spamScore += 40;
      reasons.push(`Known spam sender: ${sender}`);
    } else if (this.learningData.trustedSenders.has(sender)) {
      spamScore -= 30;
      reasons.push(`Trusted sender: ${sender}`);
    }
    
    // Check domain reputation
    if (this.learningData.spamDomains.has(domain)) {
      spamScore += 25;
      reasons.push(`Suspicious domain: ${domain}`);
    } else if (this.learningData.trustedDomains.has(domain)) {
      spamScore -= 20;
      reasons.push(`Trusted domain: ${domain}`);
    }
    
    // Check for learned spam keywords
    const allText = `${subject} ${content}`.toLowerCase();
    let keywordMatches = 0;
    
    this.learningData.spamKeywords.forEach(keyword => {
      if (allText.includes(keyword)) {
        keywordMatches++;
        spamScore += 10;
        reasons.push(`Spam keyword: "${keyword}"`);
      }
    });
    
    // Time pattern analysis
    const timeSpamFrequency = this.learningData.timePatterns.get(receivedHour) || 0;
    if (timeSpamFrequency > 5) {
      spamScore += 5;
      reasons.push(`High spam time: ${receivedHour}:00`);
    }
    
    // Additional heuristics based on learned patterns
    spamScore += this.checkAdvancedPatterns(email, reasons);
    
    // Normalize score to 0-100
    const confidence = Math.max(0, Math.min(100, spamScore + 50));
    const isSpam = confidence > 60;
    
    return {
      isSpam,
      confidence: Math.round(confidence),
      category: this.categorizeSpam(reasons, email),
      reasons,
      aiAnalysis: {
        senderReputation: this.getSenderReputation(sender, domain),
        contentAnalysis: reasons.length > 0 ? reasons.join(', ') : 'No spam indicators',
        behaviorMatch: keywordMatches > 2 ? 'High pattern match' : 'Low pattern match',
        learningConfidence: this.learningData.confidence
      }
    };
  }

  // Check advanced patterns learned from user behavior
  checkAdvancedPatterns(email, reasons) {
    let score = 0;
    const subject = (email.subject || '').toLowerCase();
    const content = (email.bodyPreview || '').toLowerCase();
    
    // Check for excessive capitalization (learned pattern)
    const capsRatio = (subject.match(/[A-Z]/g) || []).length / subject.length;
    if (capsRatio > 0.6) {
      score += 15;
      reasons.push('Excessive capitalization');
    }
    
    // Check for multiple exclamation marks
    const exclamationCount = (subject.match(/!/g) || []).length;
    if (exclamationCount >= 3) {
      score += 10;
      reasons.push('Excessive punctuation');
    }
    
    // Check for urgency words that appeared in user's junk
    const urgencyWords = ['urgent', 'immediate', 'expires', 'act now', 'limited time'];
    urgencyWords.forEach(word => {
      if (subject.includes(word) || content.includes(word)) {
        score += 8;
        reasons.push(`Urgency keyword: ${word}`);
      }
    });
    
    return score;
  }

  categorizeSpam(reasons, email) {
    const reasonText = reasons.join(' ').toLowerCase();
    
    if (reasonText.includes('phish') || reasonText.includes('verify') || reasonText.includes('suspend')) {
      return 'phishing';
    }
    if (reasonText.includes('adult') || reasonText.includes('dating') || reasonText.includes('sexy')) {
      return 'pornographic';
    }
    if (reasonText.includes('lottery') || reasonText.includes('winner') || reasonText.includes('million')) {
      return 'sophisticated_scam';
    }
    if (reasonText.includes('medication') || reasonText.includes('pills') || reasonText.includes('pharmacy')) {
      return 'medication';
    }
    
    return 'general_spam';
  }

  getSenderReputation(sender, domain) {
    if (this.learningData.trustedSenders.has(sender) || this.learningData.trustedDomains.has(domain)) {
      return 'trusted';
    }
    if (this.learningData.suspiciousSenders.has(sender) || this.learningData.spamDomains.has(domain)) {
      return 'suspicious';
    }
    return 'unknown';
  }

  // Helper methods
  extractEmailAddress(fromField) {
    if (!fromField) return '';
    if (typeof fromField === 'string') return fromField.toLowerCase();
    return (fromField.emailAddress?.address || '').toLowerCase();
  }

  extractDomain(email) {
    const atIndex = email.indexOf('@');
    return atIndex > -1 ? email.substring(atIndex + 1) : '';
  }

  extractKeywords(text) {
    return text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(word => word.toLowerCase());
  }

  updatePatternStrength(pattern, type) {
    const key = `${type}:${pattern}`;
    const current = this.spamPatterns.get(key) || 0;
    this.spamPatterns.set(key, current + 1);
  }

  calculateConfidence() {
    const totalPatterns = this.learningData.spamKeywords.size + 
                         this.learningData.suspiciousSenders.size + 
                         this.learningData.spamDomains.size;
    
    if (this.learningData.totalAnalyzed < 10) {
      this.learningData.confidence = 30;
    } else if (this.learningData.totalAnalyzed < 50) {
      this.learningData.confidence = Math.min(70, 30 + (totalPatterns * 2));
    } else {
      this.learningData.confidence = Math.min(95, 60 + (totalPatterns * 1));
    }
  }

  getLearningStats() {
    return {
      totalAnalyzed: this.learningData.totalAnalyzed,
      spamKeywords: this.learningData.spamKeywords.size,
      suspiciousSenders: this.learningData.suspiciousSenders.size,
      trustedSenders: this.learningData.trustedSenders.size,
      spamDomains: this.learningData.spamDomains.size,
      trustedDomains: this.learningData.trustedDomains.size,
      confidence: this.learningData.confidence
    };
  }

  // Save learning data in memory (you could extend this to use IndexedDB)
  saveToStorage() {
    try {
      const dataToStore = {
        ...this.learningData,
        spamKeywords: Array.from(this.learningData.spamKeywords),
        trustedSenders: Array.from(this.learningData.trustedSenders),
        suspiciousSenders: Array.from(this.learningData.suspiciousSenders),
        spamDomains: Array.from(this.learningData.spamDomains),
        trustedDomains: Array.from(this.learningData.trustedDomains),
        timePatterns: Array.from(this.learningData.timePatterns.entries())
      };
      
      // Store in memory for this session
      window.spamGuardLearningData = dataToStore;
      console.log('Learning data saved:', this.getLearningStats());
    } catch (error) {
      console.error('Error saving learning data:', error);
    }
  }

  // Load learning data from storage
  loadFromStorage() {
    try {
      const stored = window.spamGuardLearningData;
      if (stored) {
        this.learningData = {
          ...stored,
          spamKeywords: new Set(stored.spamKeywords || []),
          trustedSenders: new Set(stored.trustedSenders || []),
          suspiciousSenders: new Set(stored.suspiciousSenders || []),
          spamDomains: new Set(stored.spamDomains || []),
          trustedDomains: new Set(stored.trustedDomains || []),
          timePatterns: new Map(stored.timePatterns || [])
        };
        console.log('Learning data loaded:', this.getLearningStats());
      }
    } catch (error) {
      console.error('Error loading learning data:', error);
    }
  }

  // Get learning progress for UI
  getLearningProgress() {
    return {
      analyzed: this.learningData.totalAnalyzed,
      confidence: this.learningData.confidence,
      patterns: this.getLearningStats(),
      ready: this.learningData.confidence > 50
    };
  }
}

export default LearningService;