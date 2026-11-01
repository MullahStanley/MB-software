import { Router } from 'express';
import { db } from '../db';

export const checkupsRouter = Router();

checkupsRouter.get('/', (req, res) => {
  res.json({ success: true, checkups: db.getCheckups() });
});

// Calculate lower threshold based on user check-in data
function calculateThreshold(stressLevel: number, moodState: string, energyLevel: number): number {
  if (stressLevel >= 9) return 6; // Immediate Level 6: Auto-messaging contacts & emergency resources
  if (stressLevel === 8) return 5; // Level 5: Recommend MB specialist / vetted therapist
  if (stressLevel === 7) return 4; // Level 4: Suggest reaching out to trusted contacts
  if (stressLevel >= 5 || energyLevel <= 3) return 2; // Level 2: Suggest articles & calming grounding
  return 1; // Level 1: Prompt user to join relevant community
}

checkupsRouter.post('/', (req, res) => {
  const { stressLevel, energyLevel, focusLevel, moodState, lifeDomains, notes } = req.body;

  if (typeof stressLevel !== 'number' || !moodState) {
    return res.status(400).json({ error: 'stressLevel and moodState are required' });
  }

  const thresholdLevel = calculateThreshold(stressLevel, moodState, energyLevel || 5);

  const checkup = db.addCheckup({
    stressLevel,
    energyLevel: energyLevel || 5,
    focusLevel: focusLevel || 5,
    moodState,
    lifeDomains: Array.isArray(lifeDomains) ? lifeDomains : [],
    notes: notes || '',
    thresholdLevel
  });

  // If threshold is level 4, 5, or 6, record an alert log
  if (thresholdLevel >= 4) {
    db.dispatchAlert(thresholdLevel, 'checkup');
  }

  res.status(201).json({
    success: true,
    checkup,
    thresholdTriggered: {
      level: thresholdLevel,
      description: getThresholdDescription(thresholdLevel)
    }
  });
});

function getThresholdDescription(level: number): string {
  switch (level) {
    case 1:
      return 'Level 1: Recommended peer community connection to share with others feeling similar emotions.';
    case 2:
      return 'Level 2: Suggested psychoeducational developmental articles and nervous system reset tips.';
    case 3:
      return 'Level 3: Suggested visual breathing (4-7-8 / Box) and soothing brown/white noise calming.';
    case 4:
      return 'Level 4: Suggest reaching out to your chosen Trusted Contacts with pre-composed messages.';
    case 5:
      return 'Level 5: Recommend professional MB therapist, crisis hotline, and guided decompression.';
    case 6:
      return 'Level 6: Safe automated message dispatched to your Trusted Contacts to check in on you.';
    default:
      return 'Normal baseline wellbeing status.';
  }
}

// Analytical pattern report for the user
checkupsRouter.get('/patterns', (req, res) => {
  const checkups = db.getCheckups();

  // Compute averages
  const count = checkups.length;
  if (count === 0) {
    return res.json({
      success: true,
      patterns: {
        averageStress: 0,
        averageEnergy: 0,
        averageFocus: 0,
        mostFrequentMood: 'None',
        topLifeDrains: [],
        stressTrend: 'Insufficient data'
      }
    });
  }

  const avgStress = Number((checkups.reduce((acc, c) => acc + c.stressLevel, 0) / count).toFixed(1));
  const avgEnergy = Number((checkups.reduce((acc, c) => acc + c.energyLevel, 0) / count).toFixed(1));
  const avgFocus = Number((checkups.reduce((acc, c) => acc + c.focusLevel, 0) / count).toFixed(1));

  // Frequency of mood states
  const moodCounts: Record<string, number> = {};
  const domainCounts: Record<string, number> = {};

  for (const c of checkups) {
    moodCounts[c.moodState] = (moodCounts[c.moodState] || 0) + 1;
    for (const d of c.lifeDomains) {
      domainCounts[d] = (domainCounts[d] || 0) + 1;
    }
  }

  const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
  const sortedDomains = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([domain, total]) => ({ domain, count: total }));

  // Trend detection: compare first half to second half
  const half = Math.floor(count / 2);
  let stressTrend = 'Stable';
  if (half > 0) {
    const earlyAvg = checkups.slice(0, half).reduce((acc, c) => acc + c.stressLevel, 0) / half;
    const recentAvg = checkups.slice(half).reduce((acc, c) => acc + c.stressLevel, 0) / (count - half);
    if (recentAvg < earlyAvg - 0.8) stressTrend = 'Easing Downward (Improving)';
    else if (recentAvg > earlyAvg + 0.8) stressTrend = 'Escalating (Needs Attention)';
  }

  res.json({
    success: true,
    patterns: {
      averageStress: avgStress,
      averageEnergy: avgEnergy,
      averageFocus: avgFocus,
      mostFrequentMood: sortedMoods[0]?.[0] || 'Varied',
      topLifeDrains: sortedDomains,
      stressTrend,
      recentCheckups: checkups.slice(-10)
    }
  });
});
