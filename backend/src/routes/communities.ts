import { Router } from 'express';
import { db } from '../db';

export const communitiesRouter = Router();

communitiesRouter.get('/', (req, res) => {
  res.json({ success: true, communities: db.getCommunities() });
});

communitiesRouter.get('/:id/posts', (req, res) => {
  const posts = db.getPosts(req.params.id);
  res.json({ success: true, posts });
});

communitiesRouter.post('/:id/posts', (req, res) => {
  const { authorUsername, title, content, problemTag, authorAvatar } = req.body;
  if (!title || !content || !authorUsername) {
    return res.status(400).json({ error: 'Title, content, and username are required' });
  }

  const newPost = db.createPost({
    communityId: req.params.id,
    authorUsername,
    authorAvatar: authorAvatar || 'teal',
    title,
    content,
    problemTag: problemTag || 'General Discussion'
  });

  res.status(201).json({ success: true, post: newPost });
});

communitiesRouter.post('/posts/:postId/replies', (req, res) => {
  const { authorUsername, content } = req.body;
  if (!authorUsername || !content) {
    return res.status(400).json({ error: 'authorUsername and content are required' });
  }

  const reply = db.addReply(req.params.postId, { authorUsername, content });
  if (!reply) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.status(201).json({ success: true, reply });
});

communitiesRouter.post('/posts/:postId/upvote', (req, res) => {
  const newUpvotes = db.upvotePost(req.params.postId);
  res.json({ success: true, upvotes: newUpvotes });
});
