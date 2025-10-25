import express from 'express';
import multer from 'multer';
import fs from 'fs';
import axios from 'axios';
import loadConfig from '../config/index.js';
import { Scan } from '../models/scan.model.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const cfg = loadConfig();

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// POST /api/v1/scan - uploads a file and triggers an OPSWAT MetaDefender scan
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file uploaded' });

  // Save initial scan doc
  const scanDoc = new Scan({ filename: req.file.originalname, path: req.file.path });
  await scanDoc.save();

  if (!cfg.OPSWAT_API_KEY || cfg.OPSWAT_API_KEY === 'REPLACE_WITH_KEY') {
    // Simulate a scan result if no API key provided
    scanDoc.verdict = 'clean';
    scanDoc.raw = { simulated: true };
    await scanDoc.save();
    return res.json({ status: 'simulated', scan: scanDoc });
  }

  try {
    const fileStream = fs.createReadStream(req.file.path);
    const apiUrl = `${cfg.OPSWAT_API_URL.replace(/\/$/, '')}/file`;

    // Stream upload
    const uploadResp = await axios.post(apiUrl, fileStream, {
      headers: {
        apikey: cfg.OPSWAT_API_KEY,
        'Content-Type': 'application/octet-stream',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    // API often returns a resource id to poll for results
    const resourceId = uploadResp.data?.data_id || uploadResp.data?.resource_id || uploadResp.data?.job_id || null;
    scanDoc.resourceId = resourceId;
    await scanDoc.save();

    // Poll for result (simple exponential backoff)
    let attempt = 0;
    let finalResult = null;
    while (attempt < 8) {
      try {
        const statusUrl = `${cfg.OPSWAT_API_URL.replace(/\/$/, '')}/file/${resourceId}`;
        const statusResp = await axios.get(statusUrl, { headers: { apikey: cfg.OPSWAT_API_KEY } });
        // Decide if result is final based on returned structure
        if (statusResp.data && statusResp.data.scan_results) {
          finalResult = statusResp.data;
          break;
        }
      } catch (e) {
        // continue polling
      }

      attempt += 1;
      await sleep(500 * Math.pow(2, attempt));
    }

    if (!finalResult) {
      scanDoc.verdict = 'unknown';
      scanDoc.raw = { uploaded: true };
      await scanDoc.save();
      return res.status(202).json({ status: 'pending', scan: scanDoc });
    }

    // normalize verdict: if any engine reports malicious -> malicious, else if suspicious -> suspicious, else clean
    const engines = finalResult.scan_results?.scan_all_result_a || finalResult.scan_results || finalResult;
    let verdict = 'clean';
    // The structure of response varies; we keep this conservative
    if (String(JSON.stringify(finalResult)).toLowerCase().includes('malicious')) verdict = 'malicious';
    else if (String(JSON.stringify(finalResult)).toLowerCase().includes('suspicious')) verdict = 'suspicious';

    scanDoc.verdict = verdict;
    scanDoc.raw = finalResult;
    await scanDoc.save();

    return res.json({ status: 'done', scan: scanDoc });
  } catch (err) {
    console.error('scan error', err?.message || err);
    scanDoc.verdict = 'unknown';
    scanDoc.raw = { error: err?.message || String(err) };
    await scanDoc.save();
    return res.status(500).json({ error: 'scan_failed', detail: err?.message || String(err) });
  }
});

export default router;
