import { Router } from 'express';
import { db } from '../db';

export const journalRouter = Router();

const PROMPTS = [
  "What is one expectation placed on you (by family, work, or yourself) that you can consciously put down today?",
  "Describe a small moment in the last 48 hours where you felt entirely like yourself.",
  "If your current worry was a weather system, what kind of storm is it, and what does the clearing look like?",
  "Write an honest letter to someone you need a boundary with (you do not have to send it).",
  "What is one invisible accomplishment you achieved recently that would never show up on social media?",
  "What does 'enough' look like for you this week? What if you did 20% less?",
  "If a dear friend felt as tired and overwhelmed as you do right now, what would you whisper to them?",
  "Name three physical sensations in your body right now without trying to immediately fix them."
];

journalRouter.get('/', (req, res) => {
  res.json({ success: true, entries: db.getJournalEntries() });
});

journalRouter.get('/prompts', (req, res) => {
  res.json({ success: true, prompts: PROMPTS });
});

journalRouter.post('/', (req, res) => {
  const { title, content, promptUsed, tags, mood } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Journal content is required' });
  }

  const newEntry = db.addJournalEntry({
    title: title || 'Untitled Reflection',
    content,
    promptUsed,
    tags: Array.isArray(tags) ? tags : [],
    mood: mood || 'Reflective',
    isPrivate: true
  });

  res.status(201).json({ success: true, entry: newEntry });
});

journalRouter.delete('/:id', (req, res) => {
  const deleted = db.deleteJournalEntry(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  res.json({ success: true, message: 'Journal entry removed' });
});
