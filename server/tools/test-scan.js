import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

async function run() {
  const url = process.env.SCAN_URL || 'http://localhost:8002/api/v1/scan';
  const fpath = './test-upload.txt';
  fs.writeFileSync(fpath, 'test upload content');

  const form = new FormData();
  form.append('file', fs.createReadStream(fpath));

  try {
    const headers = form.getHeaders();
    if (process.env.TOKEN) headers.Authorization = `Bearer ${process.env.TOKEN}`;
    const resp = await axios.post(url, form, { headers });
    console.log('scan resp:', resp.data);
  } catch (e) {
    console.error('scan failed - message:', e?.message);
    if (e?.response) {
      console.error('response status:', e.response.status);
      console.error('response headers:', e.response.headers);
      console.error('response data:', e.response.data);
    }
    console.error('stack:', e.stack);
    process.exit(1);
  }
}

run();
