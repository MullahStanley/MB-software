import { Router } from 'express';
import { db } from '../db';

export const articlesRouter = Router();

articlesRouter.get('/', (req, res) => {
  res.json({ success: true, articles: db.getArticles() });
});

articlesRouter.get('/:id', (req, res) => {
  const article = db.getArticles().find(a => a.id === req.params.id);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  res.json({ success: true, article });
});
