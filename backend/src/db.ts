import { Community, Post, PostReply, Checkup, TrustedContact, AlertLog, JournalEntry, Article, ChatMessage } from './types';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data_store.json');

interface DatabaseSchema {
  communities: Community[];
  posts: Post[];
  checkups: Checkup[];
  contacts: TrustedContact[];
  alertLogs: AlertLog[];
  journalEntries: JournalEntry[];
  articles: Article[];
  chatHistory: ChatMessage[];
  analytics: {
    totalUsers: number;
    activeUsersToday: number;
    repeatUserRate: number; // e.g. 74.2%
    retentionRate30Day: number; // 68.5%
    avgSessionMinutes: number; // 14.8
    satisfactionScore: number; // 4.8 / 5
    pageViews: Record<string, number>;
  };
}

const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm-quarter-life',
    name: 'Quarter-Life & Navigating The Unknown',
    description: 'For 18-30s dealing with graduation shock, existential vertigo, feeling behind peers, and defining an authentic path.',
    icon: 'Compass',
    slug: 'quarter-life',
    memberCount: 3420,
    frequentProblems: [
      { problem: 'Feeling behind compared to LinkedIn peers', count: 842 },
      { problem: 'Choice paralysis after finishing school', count: 620 },
      { problem: 'Grieving college friend circles drifting away', count: 495 },
      { problem: 'Uncertainty around personal purpose vs salary', count: 410 }
    ]
  },
  {
    id: 'comm-career-burnout',
    name: 'Early Career, Grind Culture & Burnout',
    description: 'Corporate survival, tech crunch, first jobs, boundary setting with managers, and overcoming toxic hustle mindset.',
    icon: 'Briefcase',
    slug: 'career-burnout',
    memberCount: 4890,
    frequentProblems: [
      { problem: 'Severe imposter syndrome in first professional role', count: 1240 },
      { problem: 'Inability to turn off work notifications on weekends', count: 980 },
      { problem: 'Exhaustion from constant restructuring / layoffs fear', count: 815 },
      { problem: 'Quiet quitting vs hyper-pleasing bosses', count: 640 }
    ]
  },
  {
    id: 'comm-money-cost-of-living',
    name: 'Cost of Living & Financial Dread',
    description: 'Real talk about rent spikes, groceries, student debt, living with parents, and financial shame in your 20s.',
    icon: 'Coins',
    slug: 'financial-anxiety',
    memberCount: 2950,
    frequentProblems: [
      { problem: 'Shame about still living at home or moving back', count: 910 },
      { problem: 'Anxiety checking bank balance before social outings', count: 830 },
      { problem: 'Feeling unable to ever afford home ownership or safety net', count: 755 },
      { problem: 'Guilt over small coffees/convenience purchases', count: 420 }
    ]
  },
  {
    id: 'comm-relationships-loneliness',
    name: 'Social Shifts, Modern Dating & Loneliness',
    description: 'Friendship breakups, dating app burnout, making new friends as an adult, and combating deep solitary weekends.',
    icon: 'HeartHandshake',
    slug: 'relationships-loneliness',
    memberCount: 3820,
    frequentProblems: [
      { problem: 'Difficulties making adult friends outside of school/work', count: 1120 },
      { problem: 'Dating app fatigue and feeling disposable / ghosted', count: 940 },
      { problem: 'Pain from close childhood friendships naturally fading', count: 780 },
      { problem: 'Fear of intimacy after past heartbreak', count: 510 }
    ]
  },
  {
    id: 'comm-family-boundaries',
    name: 'Family Boundaries & Breaking Cycles',
    description: 'Separating your self-worth from parental approval, immigrant parent guilt, and learning healthy assertive boundaries.',
    icon: 'Shield',
    slug: 'family-boundaries',
    memberCount: 2180,
    frequentProblems: [
      { problem: 'Immense guilt when saying no to family demands', count: 790 },
      { problem: 'Parental disappointment regarding marriage or career timeline', count: 640 },
      { problem: 'Unlearning generational anger and conflict avoidance', count: 520 },
      { problem: 'Navigating differing values / cultural expectations', count: 430 }
    ]
  },
  {
    id: 'comm-overwhelm-sensory',
    name: 'Sensory Overload & Doomscroll Detox',
    description: 'Overstimulated nervous systems, digital screen fatigue, insomnia, and reclaiming quiet moments for the mind.',
    icon: 'Moon',
    slug: 'overwhelm-sensory',
    memberCount: 3120,
    frequentProblems: [
      { problem: 'Bedtime revenge procrastination & endless reel scrolling', count: 1040 },
      { problem: 'Physical chest tightness from news / notifications overload', count: 790 },
      { problem: 'Brain fog and inability to focus for more than 5 minutes', count: 680 },
      { problem: 'Sensory fatigue in crowded urban or office spaces', count: 410 }
    ]
  }
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    communityId: 'comm-quarter-life',
    authorUsername: 'QuietWanderer24',
    authorAvatar: 'teal',
    title: 'Turned 25 last week and felt an instant wave of terror. Anyone else?',
    content: 'All through school you have a syllabus and a clear next step. Now I work an average marketing job, scroll Instagram, and see people starting startups or buying houses. I feel like an NPC in my own life. How do you accept that 20s are messy without panicking?',
    problemTag: 'Feeling behind compared to LinkedIn peers',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    upvotes: 42,
    replies: [
      {
        id: 'reply-1',
        authorUsername: 'NorthStar99',
        content: 'I had the exact same breakdown at 25. What helped me was remembering that everyone curates their highlight reel. At 28, I can tell you almost none of those people actually have it figured out. You are not late to your own life.',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        upvotes: 21
      },
      {
        id: 'reply-2',
        authorUsername: 'EchoBreeze',
        content: 'Try deleting LinkedIn from your phone for two weeks. It genuinely lowered my baseline cortisol by half.',
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        upvotes: 14
      }
    ]
  },
  {
    id: 'post-2',
    communityId: 'comm-career-burnout',
    authorUsername: 'PixelCraft',
    authorAvatar: 'indigo',
    title: 'My manager sent a Slack message at 9:30 PM on Sunday. I felt physically sick.',
    content: 'It wasn’t even marked urgent, but my heart started pounding and I couldn’t sleep the rest of the night. How do you train yourself to stop caring so intensely about work when you are in your first serious job?',
    problemTag: 'Inability to turn off work notifications on weekends',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    upvotes: 68,
    replies: [
      {
        id: 'reply-3',
        authorUsername: 'SlowPaceDev',
        content: 'Turn on scheduled Do Not Disturb from Friday 6pm to Monday 8:30am. If the company collapses over a Sunday night message, that is an organizational failure, not your responsibility.',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        upvotes: 35
      }
    ]
  },
  {
    id: 'post-3',
    communityId: 'comm-money-cost-of-living',
    authorUsername: 'BudgetNomad',
    authorAvatar: 'amber',
    title: 'Saying "I can’t afford that dinner" without feeling like a failure',
    content: 'My friends wanted to go to a $70/plate restaurant for a casual birthday. I had $120 left until next payday. I lied and said I was sick. I want to normalize just being honest about finances without feeling shame.',
    problemTag: 'Anxiety checking bank balance before social outings',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    upvotes: 89,
    replies: [
      {
        id: 'reply-4',
        authorUsername: 'SageTea',
        content: 'True friends will happily switch to park picnics or hot pot at home. Next time say: "My current budget is tight right now, but I would love to grab boba with you before or host drinks at my place!" It takes courage but sets a safe standard.',
        createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
        upvotes: 48
      }
    ]
  }
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-quarter-life-neuro',
    title: 'The Neuroscience of the Quarter-Life Crisis (Ages 18–30)',
    category: 'Developmental Psychology',
    readTime: '4 min read',
    summary: 'Why your brain is undergoing its last major prefrontal cortex pruning, and why identity confusion during these years is biologically expected, not a personal flaw.',
    content: `Between the ages of 18 and 28, the prefrontal cortex—the command center for long-term planning, impulse control, and existential evaluation—is undergoing its final myelination and structural pruning.

This neurological transition often clashes brutally with societal demands. Modern society asks young adults to choose lifelong careers, commit to economic liabilities, and establish independence at the exact moment their neural identity hardware is still calibrating.

### 3 Anchor Practices When Lost:
1. **The 6-Month Horizon Rule**: Stop planning your entire decade. Pick a 6-month experiment (a project, a skill, a lifestyle routine) and evaluate what gives you energy vs what drains you.
2. **De-couple Identity from Job Title**: You are an active living organism who happens to exchange labor hours for currency, not a walking LinkedIn profile.
3. **Audit Your Comparison Inputs**: Your ancestors lived in tribes of 50-100 people. Today your brain processes the top 0.001% high-achievers globally on TikTok and Instagram before breakfast. Your nervous system was never evolved for that scale.`,
    takeaways: [
      'The prefrontal cortex is actively developing until age 26-28',
      'Existential doubt is a sign of neural calibration, not stagnation',
      'Operate in 6-month growth sprints instead of rigid 10-year plans'
    ],
    tags: ['Quarter-Life', 'Neuroscience', 'Identity'],
    recommendedThresholdLevels: [1, 2]
  },
  {
    id: 'art-cortisol-reset',
    title: 'The 5-Minute De-escalation Protocol for Acute Nervous System Overload',
    category: 'Somatic Grounding',
    readTime: '3 min read',
    summary: 'When your chest is tight, brain fog is paralyzing, and you are spiraling, here is how to mechanically trigger the vagus nerve and downregulate cortisol.',
    content: `When stress hormones surge, logical cognitive thinking is largely offline. Talking yourself out of panic rarely works because the amygdala has hijacked blood flow away from the prefrontal cortex.

To recover, you must speak the language of the autonomic nervous system: **mechanics, temperature, and respiration**.

### Step-by-Step Somatic Reset:
1. **The Physiological Sigh**: Take two deep inhales through your nose (first long, second quick top-up), followed by an extended, audible sigh out of the mouth. Do this 3 to 5 times. This collapses alveolar sacs and dumps CO2 instantly.
2. **Cold Diver’s Reflex**: Splash cold water on your temples and cheeks, or hold an ice cube in your palm. This triggers an immediate mammalian heart rate deceleration.
3. **Gaze Softening**: Staring closely at a screen tunnels vision and drives sympathetic tone. Look up, gaze into the furthest distance or horizon, and widen your peripheral awareness to loosen autonomic grip.`,
    takeaways: [
      'Use somatic inputs (breath + temperature) before cognitive reframing',
      'The double-inhale physiological sigh rapidly drops acute heart rate',
      'Panoramic vision resets the sympathetic fight-or-flight pathway'
    ],
    tags: ['Grounding', 'Anxiety', 'Nervous System'],
    recommendedThresholdLevels: [2, 3, 4]
  },
  {
    id: 'art-family-boundaries',
    title: 'How to Hold Loving Boundaries with Parents Without Crushing Guilt',
    category: 'Relational Health',
    readTime: '5 min read',
    summary: 'A field guide for young adults navigating generational gaps, cultural obligations, and the terrifying first steps of saying "No".',
    content: `Differentiating from family is one of the hardest developmental tasks between 18 and 35. For many children of immigrant or collectivist families, boundaries feel like betrayal.

Remember this distinction: **A boundary is not a punishment for them; it is an explanation of what you need in order to remain connected safely.**

### The "Acknowledge + Pivot" Script:
- *When parents criticize your career pace or personal choices:*
  "I know you are asking because you worry about my security and love me. At the same time, I am handling this path, and when we talk today, I want to enjoy your company rather than discuss my career."
- *When feeling pressured to attend overwhelming gatherings:*
  "I love celebrating with the family. I will be able to come for lunch from 12 to 2 PM, and then I will head out."

Setting boundaries initially feels like cruelty because you have been conditioned to confuse compliance with harmony. Harmony built on self-erasure is resentment in disguise.`,
    takeaways: [
      'Boundaries preserve relationships; lack of boundaries breeds resentment',
      'Validate their intention while clearly stating your operational limit',
      'Guilt after setting a boundary is normal withdrawal from people-pleasing'
    ],
    tags: ['Family', 'Boundaries', 'Emotional Maturity'],
    recommendedThresholdLevels: [1, 2]
  },
  {
    id: 'art-sleep-digital-sundown',
    title: 'Ending the Bedtime Revenge Procrastination Loop',
    category: 'Sleep & Focus',
    readTime: '3 min read',
    summary: 'Why staying up until 2 AM on your phone is your brain trying to reclaim stolen autonomy, and how to gently transition without brute force.',
    content: `Revenge bedtime procrastination happens when you feel you have zero control over your daylight hours. When your day belongs to your job, your classes, your family, or your errands, midnight is the only time nobody demands anything of you.

Your brain craves that freedom. The problem is that short-form video algorithms exploit that need with erratic dopamine hits.

### The Gentle Reclamation Ritual:
1. **Give Yourself Legitimate "Sloth Time" Earlier**: Schedule 30 minutes at 7:30 PM where you do absolutely nothing productive. If you don't schedule leisure, your brain will steal it at 1 AM.
2. **Switch to Passive Audio**: Instead of glowing blue screens, transition to sound: brown noise, rainfall, or a calming voice. This occupies the mental narrator while letting the optic nerve rest.
3. **The 20-Minute Reset**: If you are lying in bed unable to sleep for more than 20 minutes, get out of bed. Sit in a dim chair with a paper book until sleepy. Protect the bed-sleep association.`,
    takeaways: [
      'Late-night scrolling is a symptom of daytime autonomy starvation',
      'Audio immersion (brown noise) satisfies the brain without blue-light arousal',
      'Never punish yourself for sleeplessness; treat it with gentle curiosity'
    ],
    tags: ['Sleep', 'Habits', 'Sensory Detox'],
    recommendedThresholdLevels: [1, 2, 3]
  }
];

const INITIAL_CHECKUPS: Checkup[] = [
  {
    id: 'chk-1',
    timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
    stressLevel: 4,
    energyLevel: 7,
    focusLevel: 6,
    moodState: 'Grounded',
    lifeDomains: ['Work / Career', 'Social'],
    notes: 'Good start to the week. Got through backlog without overthinking.',
    thresholdLevel: 1
  },
  {
    id: 'chk-2',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    stressLevel: 6,
    energyLevel: 5,
    focusLevel: 5,
    moodState: 'Restless',
    lifeDomains: ['Work / Career', 'Finances'],
    notes: 'Unexpected car repair bill rattled my budget. Kept calculating savings balance.',
    thresholdLevel: 2
  },
  {
    id: 'chk-3',
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
    stressLevel: 5,
    energyLevel: 6,
    focusLevel: 7,
    moodState: 'Grounded',
    lifeDomains: ['Self-Expectations'],
    notes: 'Went for a walk at lunch. Felt significantly calmer in the afternoon.',
    thresholdLevel: 1
  },
  {
    id: 'chk-4',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    stressLevel: 8,
    energyLevel: 3,
    focusLevel: 4,
    moodState: 'Overwhelmed',
    lifeDomains: ['Work / Career', 'Sleep', 'Social'],
    notes: 'Late night deadline. Slept 4 hours. Felt like my chest was tied in knots.',
    thresholdLevel: 3
  },
  {
    id: 'chk-5',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    stressLevel: 7,
    energyLevel: 4,
    focusLevel: 5,
    moodState: 'Anxious',
    lifeDomains: ['Finances', 'Work / Career'],
    notes: 'Lingering fatigue from earlier in the week. Needed quiet time.',
    thresholdLevel: 2
  },
  {
    id: 'chk-6',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    stressLevel: 4,
    energyLevel: 8,
    focusLevel: 7,
    moodState: 'Energized',
    lifeDomains: ['Social', 'Self-Expectations'],
    notes: 'Met up with an old high school friend. Very refreshing to laugh without agenda.',
    thresholdLevel: 1
  }
];

const INITIAL_CONTACTS: TrustedContact[] = [
  {
    id: 'tc-1',
    name: 'Maya Lin',
    relationship: 'Best Friend / Roommate',
    phone: '+1 (555) 234-8901',
    email: 'maya.lin@example.com',
    notes: 'Knows when I get sensory burnout. Responds fast on Signal.',
    canAutoAlert: true
  },
  {
    id: 'tc-2',
    name: 'Marcus Chen',
    relationship: 'Older Brother',
    phone: '+1 (555) 872-3312',
    email: 'marcus.chen@example.com',
    notes: 'Great grounding influence when I have career spirals.',
    canAutoAlert: true
  }
];

const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: 'j-1',
    title: 'Untangling the feeling of being behind',
    content: 'Today I caught myself spiraling because a former classmate was featured in a 30 Under 30 list. I had to pause, close my laptop, and write down what actually matters to me: good sleep, cooking nutritious dinners, having friends who love me when I have nothing impressive to say, and peace of mind. None of those are measurable on LinkedIn.',
    promptUsed: 'What is one invisible success in your life that no one on social media can see?',
    tags: ['Quarter-Life', 'Perspective', 'Comparison'],
    mood: 'Grounded',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isPrivate: true
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load data_store.json, using defaults', e);
    }

    const defaultData: DatabaseSchema = {
      communities: INITIAL_COMMUNITIES,
      posts: INITIAL_POSTS,
      checkups: INITIAL_CHECKUPS,
      contacts: INITIAL_CONTACTS,
      alertLogs: [],
      journalEntries: INITIAL_JOURNAL,
      articles: INITIAL_ARTICLES,
      chatHistory: [
        {
          id: 'welcome-msg',
          sender: 'assistant',
          text: "Welcome to Mental Beacon (MB). I'm your Beacon Companion. I'm connected to your check-ups and wellbeing patterns to offer grounded, zero-judgment perspective whenever things feel loud. How is your nervous system holding up right now?",
          timestamp: new Date().toISOString()
        }
      ],
      analytics: {
        totalUsers: 14820,
        activeUsersToday: 3240,
        repeatUserRate: 76.4,
        retentionRate30Day: 69.2,
        avgSessionMinutes: 14.5,
        satisfactionScore: 4.85,
        pageViews: {
          'communities': 18450,
          'checkup_patterns': 12300,
          'journal': 8920,
          'breathing_sound': 15600,
          'articles': 10210,
          'games': 7480,
          'chatbot': 9150
        }
      }
    };

    this.save(defaultData);
    return defaultData;
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save data_store.json', e);
    }
  }

  // Communities
  getCommunities(): Community[] {
    return this.data.communities;
  }

  getCommunityBySlug(slug: string): Community | undefined {
    return this.data.communities.find(c => c.slug === slug || c.id === slug);
  }

  // Posts
  getPosts(communityId?: string): Post[] {
    if (communityId) {
      return this.data.posts.filter(p => p.communityId === communityId);
    }
    return this.data.posts;
  }

  createPost(post: Omit<Post, 'id' | 'createdAt' | 'upvotes' | 'replies'>): Post {
    const newPost: Post = {
      ...post,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      upvotes: 1,
      replies: []
    };
    this.data.posts.unshift(newPost);

    // Track problem frequency in community
    const comm = this.data.communities.find(c => c.id === post.communityId);
    if (comm && post.problemTag) {
      const match = comm.frequentProblems.find(p => p.problem.toLowerCase() === post.problemTag.toLowerCase());
      if (match) {
        match.count += 1;
      } else {
        comm.frequentProblems.push({ problem: post.problemTag, count: 1 });
      }
    }

    this.save();
    return newPost;
  }

  addReply(postId: string, reply: { authorUsername: string; content: string }): PostReply | null {
    const post = this.data.posts.find(p => p.id === postId);
    if (!post) return null;
    const newReply: PostReply = {
      id: `reply-${Date.now()}`,
      authorUsername: reply.authorUsername,
      content: reply.content,
      createdAt: new Date().toISOString(),
      upvotes: 1
    };
    post.replies.push(newReply);
    this.save();
    return newReply;
  }

  upvotePost(postId: string): number {
    const post = this.data.posts.find(p => p.id === postId);
    if (post) {
      post.upvotes += 1;
      this.save();
      return post.upvotes;
    }
    return 0;
  }

  // Checkups & Pattern Tracking
  getCheckups(): Checkup[] {
    return this.data.checkups;
  }

  addCheckup(checkupData: Omit<Checkup, 'id' | 'timestamp' | 'thresholdLevel'> & { thresholdLevel?: number }): Checkup {
    // Determine threshold level based on stress & mood if not explicitly supplied
    let level = checkupData.thresholdLevel;
    if (!level) {
      if (checkupData.stressLevel >= 9) level = 5;
      else if (checkupData.stressLevel >= 8) level = 4;
      else if (checkupData.stressLevel >= 7) level = 3;
      else if (checkupData.stressLevel >= 5) level = 2;
      else level = 1;
    }

    const newCheckup: Checkup = {
      ...checkupData,
      id: `chk-${Date.now()}`,
      timestamp: new Date().toISOString(),
      thresholdLevel: level
    };
    this.data.checkups.push(newCheckup);
    this.save();
    return newCheckup;
  }

  // Trusted Contacts
  getContacts(): TrustedContact[] {
    return this.data.contacts;
  }

  addContact(contact: Omit<TrustedContact, 'id'>): TrustedContact {
    const newContact: TrustedContact = {
      ...contact,
      id: `tc-${Date.now()}`
    };
    this.data.contacts.push(newContact);
    this.save();
    return newContact;
  }

  deleteContact(id: string): boolean {
    const initialLen = this.data.contacts.length;
    this.data.contacts = this.data.contacts.filter(c => c.id !== id);
    if (this.data.contacts.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Alert Logs & Level Escalation
  getAlertLogs(): AlertLog[] {
    return this.data.alertLogs;
  }

  dispatchAlert(level: number, triggerSource: string, customMessage?: string): AlertLog {
    const contacts = this.data.contacts;
    const contactNames = contacts.map(c => c.name);
    
    let defaultMsg = '';
    if (level === 6) {
      defaultMsg = `[MB Auto-Safety System] Gentle alert: Your contact has triggered their Level 6 distress threshold on Mental Beacon. Please check in on them with a supportive, low-pressure message or call.`;
    } else if (level === 4) {
      defaultMsg = `[MB Suggested Reach-out] Hey, things have felt overwhelming today. Would love to grab a quiet tea or just hear your voice when you are free.`;
    } else {
      defaultMsg = `Distress threshold Level ${level} reached. Support interventions presented.`;
    }

    const newLog: AlertLog = {
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level,
      contactNames: contactNames.length ? contactNames : ['Default Safety Proxy'],
      message: customMessage || defaultMsg,
      triggerSource,
      status: level === 6 ? 'simulated_sent' : 'prompted'
    };

    this.data.alertLogs.unshift(newLog);
    this.save();
    return newLog;
  }

  // Journal
  getJournalEntries(): JournalEntry[] {
    return this.data.journalEntries;
  }

  addJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt'>): JournalEntry {
    const newEntry: JournalEntry = {
      ...entry,
      id: `j-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.journalEntries.unshift(newEntry);
    this.save();
    return newEntry;
  }

  deleteJournalEntry(id: string): boolean {
    const len = this.data.journalEntries.length;
    this.data.journalEntries = this.data.journalEntries.filter(j => j.id !== id);
    if (this.data.journalEntries.length !== len) {
      this.save();
      return true;
    }
    return false;
  }

  // Articles
  getArticles(): Article[] {
    return this.data.articles;
  }

  // Chat
  getChatHistory(): ChatMessage[] {
    return this.data.chatHistory;
  }

  addChatMessage(msg: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    this.data.chatHistory.push(newMsg);
    // Keep max 50 recent messages
    if (this.data.chatHistory.length > 50) {
      this.data.chatHistory = this.data.chatHistory.slice(-50);
    }
    this.save();
    return newMsg;
  }

  // Analytics & Transparent User Data
  getAnalytics() {
    // Calculate live problem distribution across all communities
    const problemMap: Record<string, number> = {};
    for (const comm of this.data.communities) {
      for (const fp of comm.frequentProblems) {
        problemMap[fp.problem] = (problemMap[fp.problem] || 0) + fp.count;
      }
    }

    return {
      ...this.data.analytics,
      frequentProblemDistribution: problemMap,
      totalPosts: this.data.posts.length,
      totalCheckupsLogged: this.data.checkups.length,
      totalJournalEntries: this.data.journalEntries.length,
      activeContactsCount: this.data.contacts.length
    };
  }

  trackPageView(page: string) {
    if (!this.data.analytics.pageViews[page]) {
      this.data.analytics.pageViews[page] = 0;
    }
    this.data.analytics.pageViews[page] += 1;
    this.save();
  }

  exportAllUserData() {
    return {
      exportTimestamp: new Date().toISOString(),
      accountAnonymizedId: 'anon-user-beacon-7892',
      privacyStatement: 'Mental Beacon does not sell, broker, or transmit behavioral telemetry to commercial ad networks. All patterns remain strictly under your ownership.',
      checkups: this.data.checkups,
      journalEntries: this.data.journalEntries,
      contacts: this.data.contacts,
      alertHistory: this.data.alertLogs,
      chatHistory: this.data.chatHistory
    };
  }

  clearUserData() {
    this.data.checkups = [];
    this.data.journalEntries = [];
    this.data.alertLogs = [];
    this.data.chatHistory = [];
    this.save();
    return { success: true, message: 'All personal patterns and journal history permanently wiped.' };
  }
}

export const db = new Database();
