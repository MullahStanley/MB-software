import { Router } from 'express';

export const intakeRouter = Router();

intakeRouter.post('/', (req, res) => {
  const data = req.body || {};
  if (!data.email || !data.fullName) {
    return res.status(400).json({ error: 'Missing intake details' });
  }
  const reference = 'INTAKE-' + Math.random().toString(36).slice(2, 7).toUpperCase();
  res.status(201).json({ success: true, reference, intake: data, message: 'Intake received.' });
});

intakeRouter.get('/', (req, res) => {
  res.json({ success: true, intakes: [] });
});