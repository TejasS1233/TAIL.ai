import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

function loadYaml(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return yaml.load(content) || {};
  } catch (err) {
    return {};
  }
}

export default function loadConfig() {
  const base = process.cwd();
  const env = process.env.NODE_ENV || 'development';

  // Load defaults from config.yaml if exists
  const yamlPath = path.join(base, 'server', 'config.yaml');
  const yamlCfg = loadYaml(yamlPath);

  // Merge .env (via process.env) with YAML
  const cfg = {
    PORT: process.env.PORT || yamlCfg.PORT || 8001,
    MONGODB_URI: process.env.MONGODB_URI || yamlCfg.MONGODB_URI || 'mongodb://localhost:27017/agentic-ai-lab',
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || yamlCfg.RAZORPAY_KEY_ID || null,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || yamlCfg.RAZORPAY_KEY_SECRET || null,
    OPSWAT_API_KEY: process.env.OPSWAT_API_KEY || yamlCfg.OPSWAT_API_KEY || null,
  OPSWAT_API_URL: process.env.OPSWAT_API_URL || yamlCfg.OPSWAT_API_URL || 'https://api.metadefender.com/v4',
    NODE_ENV: env,
  };

  return cfg;
}
