import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Dev-only token minting - short lived
router.post('/token', (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ error: 'forbidden' });

  const payload = {
    sub: 'dev-user',
    role: 'developer',
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1h' });
  res.json({ token });
});

export default router;
