import express from 'express';
import cors from 'cors';
import { communitiesRouter } from './routes/communities';
import { checkupsRouter } from './routes/checkups';
import { journalRouter } from './routes/journal';
// import { emergencyRouter } from './routes/emergency'; // unused after frontend emergency resources removal
import { articlesRouter } from './routes/articles';
import { chatRouter } from './routes/chatbot';
import { analyticsRouter } from './routes/analytics';
import { bookingsRouter } from './routes/bookings';
import { intakeRouter } from './routes/intake';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/communities', communitiesRouter);
app.use('/api/checkups', checkupsRouter);
app.use('/api/journal', journalRouter);
// app.use('/api/emergency', emergencyRouter); // unused
app.use('/api/articles', articlesRouter);
app.use('/api/chat', chatRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/intake', intakeRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    product: 'Mental Beacon (MB)',
    targetAudience: 'Young Adults (15-35)',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[MB Server] Mental Beacon API running on http://localhost:${PORT}`);
});
