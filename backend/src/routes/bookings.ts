import { Router } from 'express';

export const bookingsRouter = Router();

// Preview-mode booking endpoint. M-Pesa integration can be wired here.
bookingsRouter.post('/', (req, res) => {
  const { format, plan, date, time, name, phone, email, topic } = req.body || {};
  if (!format || !plan || !date || !time || !name || !phone) {
    return res.status(400).json({ error: 'Missing booking details' });
  }

  const total = format === 'virtual' ? (plan === 'single' ? 2500 : 9000) : (plan === 'single' ? 3000 : 11000);
  const dueNow = format === 'physical' && plan === 'single' ? total / 2 : total;

  // TODO: integrate M-Pesa STK push using phone and dueNow, then verify callback.
  const reference = 'MB-' + Math.random().toString(36).slice(2, 7).toUpperCase();

  res.status(201).json({
    success: true,
    preview: true,
    reference,
    total,
    dueNow,
    booking: { format, plan, date, time, name, phone, email, topic },
    message: 'Preview mode: no payment was charged. M-Pesa integration pending.'
  });
});

bookingsRouter.get('/', (req, res) => {
  res.json({ success: true, bookings: [] });
});
