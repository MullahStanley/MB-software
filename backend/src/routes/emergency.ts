import { Router } from 'express';
import { db } from '../db';

export const emergencyRouter = Router();

emergencyRouter.get('/contacts', (req, res) => {
  res.json({ success: true, contacts: db.getContacts() });
});

emergencyRouter.post('/contacts', (req, res) => {
  const { name, relationship, phone, email, notes, canAutoAlert } = req.body;
  if (!name || (!phone && !email)) {
    return res.status(400).json({ error: 'Name and either phone or email are required' });
  }

  const newContact = db.addContact({
    name,
    relationship: relationship || 'Friend / Family',
    phone: phone || '',
    email: email || '',
    notes: notes || '',
    canAutoAlert: canAutoAlert ?? true
  });

  res.status(201).json({ success: true, contact: newContact });
});

emergencyRouter.delete('/contacts/:id', (req, res) => {
  const deleted = db.deleteContact(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  res.json({ success: true, message: 'Contact deleted' });
});

emergencyRouter.get('/logs', (req, res) => {
  res.json({ success: true, logs: db.getAlertLogs() });
});

// Trigger a specific lower threshold level
emergencyRouter.post('/trigger-level', (req, res) => {
  const { level, source, customMessage } = req.body;
  const numLevel = Number(level);

  if (isNaN(numLevel) || numLevel < 1 || numLevel > 6) {
    return res.status(400).json({ error: 'Valid level between 1 and 6 is required' });
  }

  const log = db.dispatchAlert(numLevel, source || 'manual_trigger', customMessage);
  const contacts = db.getContacts();

  // Return level action package
  const actionPayload = {
    level: numLevel,
    log,
    actions: {
      1: {
        title: 'Community Space Prompt',
        directive: 'Join a peer community to read and share with peers walking through similar hurdles.',
        target: '/communities'
      },
      2: {
        title: 'Psychoeducational Article Recommendations',
        directive: 'Explore targeted developmental & nervous system de-escalation articles.',
        target: '/articles'
      },
      3: {
        title: 'Visual Breathwork & Sound Calming',
        directive: 'Activate 4-7-8 relaxing breathing and immersive brown/white noise to regulate cortisol.',
        target: '/calm'
      },
      4: {
        title: 'Prompt: Reach Out to Trusted Contacts',
        directive: 'We have pre-composed a gentle, zero-pressure text message for your trusted circle.',
        suggestedMessage: "Hey, I've had a really overwhelming day and could use a quick grounded check-in when you have a moment.",
        contacts
      },
      5: {
        title: 'MB Recommended Professional Support',
        directive: 'Connect with free, confidential 24/7 youth helplines and vetted MB mental health practitioners.',
        resources: [
          { name: 'Crisis Text Line', contact: 'Text HOME to 741741', detail: 'Free, 24/7 confidential crisis support by SMS' },
          { name: '988 Suicide & Crisis Lifeline', contact: 'Call or Text 988', detail: '24/7 English & Spanish crisis counselors' },
          { name: 'The Trevor Project (LGBTQ+ Youth)', contact: 'Call 1-866-488-7386 or Text START to 678-678', detail: 'Specialized youth support' },
          { name: 'MB Vetted Young-Adult Therapists Network', contact: 'therapy@mentalbeacon.org', detail: 'Sliding-scale and university-matched care' }
        ]
      },
      6: {
        title: 'Automated Alert Sent to Trusted Contacts',
        directive: 'Your emergency distress threshold was triggered. An automated, compassionate notification has been dispatched to your designated trusted contacts so they can check in on you.',
        dispatchedContacts: contacts.filter(c => c.canAutoAlert).map(c => ({ name: c.name, phone: c.phone, email: c.email })),
        dispatchStatus: 'SIMULATED_DISPATCHED_SUCCESS',
        dispatchedAt: new Date().toISOString()
      }
    }[numLevel]
  };

  res.json({
    success: true,
    action: actionPayload
  });
});
