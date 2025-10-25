import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  // Allow disabling auth in dev via SKIP_AUTH=true
  const skip = String(process.env.SKIP_AUTH || 'true').toLowerCase();
  if (skip === 'true' || skip === '1') return next();

  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'missing_token' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'missing_token' });

  try {
    const secret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid_token', detail: err?.message || String(err) });
  }
}
