import express from 'express';
import multer from 'multer';
const app = express();
const upload = multer();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ services: { image_classification: { status: 'available', available_classes: ['garbage','pothole','water','other'] } } });
});

app.post('/classify-upload', upload.single('file'), (req, res) => {
  // Simple deterministic stub: look at filename if present
  const file = req.file;
  const name = file?.originalname || 'image';
  const category = name.toLowerCase().includes('pothole') ? 'pothole' : (name.toLowerCase().includes('garbage') ? 'garbage' : 'other');
  res.json({ success: true, prediction: { category, confidence: 0.85 } });
});

app.post('/classify-url', (req, res) => {
  const image_url = req.body?.image_url || req.query?.image_url;
  const category = (image_url || '').toLowerCase().includes('pothole') ? 'pothole' : 'other';
  res.json({ success: true, prediction: { category, confidence: 0.78 } });
});

app.get('/categories', (req, res) => {
  res.json({ categories: ['garbage','pothole','water','other'] });
});

const port = process.env.CLASSIFY_PORT || 5000;
app.listen(port, '127.0.0.1', () => console.log(`Mock classifier listening on http://127.0.0.1:${port}`));
