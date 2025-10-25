import express from 'express';
import axios from 'axios';
import loadConfig from '../config/index.js';
const router = express.Router();
const cfg = loadConfig();

// POST /api/v1/ml/infer -> proxies to ML service, with graceful fallback
router.post('/infer', async (req, res) => {
  const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:8003';
  try {
    const resp = await axios.post(`${mlUrl}/infer`, req.body, { timeout: 10000 });
    return res.json(resp.data);
  } catch (err) {
    console.error('ml proxy error', err?.message || err);
    // Fallback: return a stubbed inference so the frontend remains functional
    const stub = {
      stub: true,
      model: 'stub-model',
      input: req.body,
      output: { text: 'This is a stubbed ML response because the ML service is unavailable.' }
    };
    return res.json({ data: stub });
  }
});

router.get('/health', async (req, res) => {
  const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:8003';
  try {
    const resp = await axios.get(`${mlUrl}/health`, { timeout: 3000 });
    return res.json({ ml: resp.data });
  } catch (err) {
    // If ML is down, return a friendly stubbed health response (noting it's a fallback)
    return res.json({ ml: { status: 'stub', message: 'ML service unreachable; using stub' } });
  }
});

export default router;
