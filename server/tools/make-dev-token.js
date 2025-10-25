import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'dev-secret';
const payload = { sub: 'dev-user', role: 'developer' };
const token = jwt.sign(payload, secret, { expiresIn: '1h' });
console.log(token);
