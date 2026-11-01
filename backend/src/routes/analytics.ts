import { Router } from 'express';
import { db } from '../db';

export const analyticsRouter = Router();

analyticsRouter.get('/', (req, res) => {
  res.json({ success: true, analytics: db.getAnalytics() });
});

analyticsRouter.post('/track', (req, res) => {
  const { page } = req.body;
  if (page) {
    db.trackPageView(page);
  }
  res.json({ success: true });
});

// User data transparency & control endpoints
analyticsRouter.get('/export-user-data', (req, res) => {
  const exportData = db.exportAllUserData();
  res.setHeader('Content-Disposition', 'attachment; filename="mb-user-data-export.json"');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(exportData, null, 2));
});

analyticsRouter.post('/clear-user-data', (req, res) => {
  const result = db.clearUserData();
  res.json(result);
});
