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
  stressLevel: number; // 1 to 10
  energyLevel: number; // 1 to 10
  focusLevel: number;  // 1 to 10
  moodState: string;   // 'Overwhelmed' | 'Burnt Out' | 'Anxious' | 'Lost / Quarter-Life' | 'Numb / Disconnected' | 'Grounded' | 'Energized'
  lifeDomains: string[]; // e.g. ['Work / Career', 'Finances', 'Social', 'Sleep', 'Self-Expectations']
  notes: string;
  thresholdLevel: number; // 1 to 6
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
  triggerSource: string; // 'checkup' | 'journal' | 'manual' | 'chatbot'
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
