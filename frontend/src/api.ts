// Frontend API client for Mental Beacon (MB)

export interface Community {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  memberCount: number;
  frequentProblems: { problem: string; count: number }[];
}

export interface PostReply {
  id: string;
  authorUsername: string;
  content: string;
  createdAt: string;
  upvotes: number;
}

export interface Post {
  id: string;
  communityId: string;
  authorUsername: string;
  authorAvatar: string;
  title: string;
  content: string;
  problemTag: string;
  createdAt: string;
  upvotes: number;
  replies: PostReply[];
}

export interface Checkup {
  id: string;
  timestamp: string;
  stressLevel: number;
  energyLevel: number;
  focusLevel: number;
  moodState: string;
  lifeDomains: string[];
  notes: string;
  thresholdLevel: number;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  notes?: string;
  canAutoAlert: boolean;
}

export interface AlertLog {
  id: string;
  timestamp: string;
  level: number;
  contactNames: string[];
  message: string;
  triggerSource: string;
  status: 'simulated_sent' | 'prompted';
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  promptUsed?: string;
  tags: string[];
  mood: string;
  createdAt: string;
  isPrivate: boolean;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string;
  takeaways: string[];
  tags: string[];
  recommendedThresholdLevels: number[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  distressLevel?: number;
  suggestedAction?: {
    type: 'community' | 'article' | 'trusted_contacts' | 'breathing' | 'specialist';
    targetId?: string;
    label: string;
  };
}

const BASE_URL = '/api';

export const api = {
  // Communities
  async getCommunities(): Promise<Community[]> {
    const res = await fetch(`${BASE_URL}/communities`);
    const json = await res.json();
    return json.communities || [];
  },

  async getPosts(communityId?: string): Promise<Post[]> {
    const url = communityId ? `${BASE_URL}/communities/${communityId}/posts` : `${BASE_URL}/communities`;
    const res = await fetch(url);
    const json = await res.json();
    return json.posts || [];
  },

  async createPost(communityId: string, post: { authorUsername: string; title: string; content: string; problemTag: string; authorAvatar?: string }): Promise<Post> {
    const res = await fetch(`${BASE_URL}/communities/${communityId}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    const json = await res.json();
    return json.post;
  },

  async addReply(postId: string, reply: { authorUsername: string; content: string }): Promise<PostReply> {
    const res = await fetch(`${BASE_URL}/communities/posts/${postId}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reply)
    });
    const json = await res.json();
    return json.reply;
  },

  async upvotePost(postId: string): Promise<number> {
    const res = await fetch(`${BASE_URL}/communities/posts/${postId}/upvote`, {
      method: 'POST'
    });
    const json = await res.json();
    return json.upvotes;
  },

  // Checkups & Patterns
  async getCheckups(): Promise<Checkup[]> {
    const res = await fetch(`${BASE_URL}/checkups`);
    const json = await res.json();
    return json.checkups || [];
  },

  async submitCheckup(data: Omit<Checkup, 'id' | 'timestamp' | 'thresholdLevel'>): Promise<{ checkup: Checkup; thresholdTriggered: { level: number; description: string } }> {
    const res = await fetch(`${BASE_URL}/checkups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getCheckupPatterns(): Promise<any> {
    const res = await fetch(`${BASE_URL}/checkups/patterns`);
    const json = await res.json();
    return json.patterns;
  },

  // Emergency & Trusted Contacts
  async getContacts(): Promise<TrustedContact[]> {
    const res = await fetch(`${BASE_URL}/emergency/contacts`);
    const json = await res.json();
    return json.contacts || [];
  },

  async addContact(contact: Omit<TrustedContact, 'id'>): Promise<TrustedContact> {
    const res = await fetch(`${BASE_URL}/emergency/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact)
    });
    const json = await res.json();
    return json.contact;
  },

  async deleteContact(id: string): Promise<void> {
    await fetch(`${BASE_URL}/emergency/contacts/${id}`, { method: 'DELETE' });
  },

  async getAlertLogs(): Promise<AlertLog[]> {
    const res = await fetch(`${BASE_URL}/emergency/logs`);
    const json = await res.json();
    return json.logs || [];
  },

  async triggerThresholdLevel(level: number, source: string, customMessage?: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/emergency/trigger-level`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, source, customMessage })
    });
    return res.json();
  },

  // Journal
  async getJournal(): Promise<JournalEntry[]> {
    const res = await fetch(`${BASE_URL}/journal`);
    const json = await res.json();
    return json.entries || [];
  },

  async getJournalPrompts(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/journal/prompts`);
    const json = await res.json();
    return json.prompts || [];
  },

  async addJournalEntry(entry: { title: string; content: string; promptUsed?: string; tags?: string[]; mood?: string }): Promise<JournalEntry> {
    const res = await fetch(`${BASE_URL}/journal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    const json = await res.json();
    return json.entry;
  },

  async deleteJournalEntry(id: string): Promise<void> {
    await fetch(`${BASE_URL}/journal/${id}`, { method: 'DELETE' });
  },

  // Articles
  async getArticles(): Promise<Article[]> {
    const res = await fetch(`${BASE_URL}/articles`);
    const json = await res.json();
    return json.articles || [];
  },

  // Chatbot
  async getChatHistory(): Promise<ChatMessage[]> {
    const res = await fetch(`${BASE_URL}/chat`);
    const json = await res.json();
    return json.messages || [];
  },

  async sendChatMessage(message: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    return res.json();
  },

  // Analytics & Transparency
  async getAnalytics(): Promise<any> {
    const res = await fetch(`${BASE_URL}/analytics`);
    const json = await res.json();
    return json.analytics;
  },

  async trackPage(page: string): Promise<void> {
    await fetch(`${BASE_URL}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page })
    });
  },

  async clearUserData(): Promise<any> {
    const res = await fetch(`${BASE_URL}/analytics/clear-user-data`, { method: 'POST' });
    return res.json();
  }
};
