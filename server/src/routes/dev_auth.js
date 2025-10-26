import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// POST /api/v1/dev/token - dev helper to create a JWT (only enabled when SKIP_AUTH=true or NODE_ENV=development)
router.post('/token', (req, res) => {
  if (process.env.NODE_ENV !== 'development') return res.status(403).json({ error: 'forbidden' });
  const payload = req.body || { _id: 'dev-user', email: 'dev@example.com', role: 'developer' };
  const secret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || 'dev-secret';
  const token = jwt.sign(payload, secret, { expiresIn: '7d' });
  return res.json({ token });
});

export default router;
