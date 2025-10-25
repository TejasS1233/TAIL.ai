import axios from 'axios';

async function run() {
  const url = process.env.DEV_TOKEN_URL || 'http://localhost:8002/api/v1/dev/token';
  try {
    const resp = await axios.post(url);
    console.log(resp.data.token);
  } catch (e) {
    console.error('failed to get token - message:', e?.message);
    if (e?.response) {
      console.error('status:', e.response.status);
      console.error('data:', e.response.data);
    }
    console.error(e.stack);
    process.exit(1);
  }
}

run();
