import { Router } from 'express';
import { db } from '../db';
import { ChatMessage } from '../types';

export const chatRouter = Router();

// Evaluate distress keywords and suggest lower threshold triggers
function evaluateDistress(message: string, currentStressLevel: number): {
  level: number;
  action?: ChatMessage['suggestedAction'];
  aiReply: string;
} {
  const text = message.toLowerCase();

  // Severe distress triggers -> Level 6 or 5
  if (
    text.includes('want to die') ||
    text.includes('end it all') ||
    text.includes('kill myself') ||
    text.includes('disappear forever') ||
    text.includes('cant go on') ||
    text.includes("can't go on")
  ) {
    return {
      level: 6,
      action: {
        type: 'specialist',
        label: 'Emergency Safety & Direct Support'
      },
      aiReply: "I hear how intensely painful and exhausted things feel right now. You don't have to carry this alone. I am activating our safety protocol to prompt your Trusted Contacts and give you direct access to 24/7 crisis specialists who care deeply. Please stay with me, take one slow breath, and let us support you."
    };
  }

  // Panic / Acute spiral -> Level 4 or 5
  if (
    text.includes('panic attack') ||
    text.includes("can't breathe") ||
    text.includes('cant breathe') ||
    text.includes('spiraling') ||
    text.includes('chest is tight') ||
    text.includes('terrified')
  ) {
    return {
      level: 4,
      action: {
        type: 'trusted_contacts',
        label: 'Reach Out to Your Trusted Circle'
      },
      aiReply: "Your body is in acute fight-or-flight right now. That feeling in your chest is adrenaline, not reality. Let's do a physiological sigh together: two quick inhales through the nose, then a slow sigh out the mouth. I also recommend pinging one of your trusted contacts or using our grounding breath guide."
    };
  }

  // Heavy overwhelm / feeling alone -> Level 2 or 3
  if (
    text.includes('so lonely') ||
    text.includes('nobody understands') ||
    text.includes('behind in life') ||
    text.includes('failed') ||
    text.includes('imposter') ||
    text.includes('quarter life')
  ) {
    return {
      level: 2,
      action: {
        type: 'community',
        label: 'Read Peer Stories in Quarter-Life Community'
      },
      aiReply: "That sense of being behind or isolated is the single most common feeling among people in their 20s and early 30s. Our culture feeds us curated highlight reels, but if you look inside our peer communities, thousands of people are wrestling with the exact same transition. Would you like to read how others are dealing with this?"
    };
  }

  // General check-in response informed by user's pattern
  const recentCheckups = db.getCheckups();
  const latest = recentCheckups[recentCheckups.length - 1];

  let patternContext = '';
  if (latest) {
    if (latest.stressLevel >= 7) {
      patternContext = `I see from your recent checkup that your stress has been high (level ${latest.stressLevel}/10) with feeling ${latest.moodState}. `;
    } else {
      patternContext = `I noticed your last check-in recorded a ${latest.moodState} state. `;
    }
  }

  let aiReply = `${patternContext}Thank you for sharing that with me. When you look at what's currently on your plate, what feels like the single heaviest brick you are trying to lift? We can break it down, or just sit with it quietly.`;

  if (text.includes('work') || text.includes('job') || text.includes('boss')) {
    aiReply = `${patternContext}Work stress can easily bleed into every hour of the evening. Remember: your professional output is an agreement between you and an employer, not your identity or self-worth. Have you had a chance to disconnect from work devices today?`;
  } else if (text.includes('money') || text.includes('rent') || text.includes('broke')) {
    aiReply = `${patternContext}Financial stress triggers deep biological survival anxiety. It is completely understandable why your nervous system feels rattled. Even small boundaries around money guilt can give your brain breathing room.`;
  }

  return {
    level: currentStressLevel >= 7 ? 3 : 1,
    action: {
      type: 'breathing',
      label: 'Try 2 Minutes of Box Breathing'
    },
    aiReply
  };
}

chatRouter.get('/', (req, res) => {
  res.json({ success: true, messages: db.getChatHistory() });
});

chatRouter.post('/', (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message text is required' });
  }

  // Save user message
  const userMsg = db.addChatMessage({
    sender: 'user',
    text: message
  });

  const recentCheckups = db.getCheckups();
  const latestCheckup = recentCheckups[recentCheckups.length - 1];
  const currentStress = latestCheckup ? latestCheckup.stressLevel : 5;

  const evaluation = evaluateDistress(message, currentStress);

  // If distress level is high (4 to 6), log alert dispatch
  if (evaluation.level >= 4) {
    db.dispatchAlert(evaluation.level, 'chatbot', `Chatbot detected distress keywords. Triggered Level ${evaluation.level} escalation.`);
  }

  // Save assistant reply
  const aiMsg = db.addChatMessage({
    sender: 'assistant',
    text: evaluation.aiReply,
    distressLevel: evaluation.level,
    suggestedAction: evaluation.action
  });

  res.json({
    success: true,
    userMessage: userMsg,
    assistantMessage: aiMsg,
    distressLevel: evaluation.level,
    suggestedAction: evaluation.action
  });
});
