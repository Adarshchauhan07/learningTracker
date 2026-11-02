'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const template = path.join(root, 'public', 'index.template.html');
const dist = path.join(root, 'dist');
const envFile = path.join(root, '.env.local');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
const url = process.env.VITE_SUPABASE_URL || '';
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.');
  process.exit(1);
}
if (!/^https:\/\/.+\.supabase\.co\/?$/.test(url)) {
  console.error('VITE_SUPABASE_URL does not look like a Supabase project URL.');
  process.exit(1);
}
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
let html = fs.readFileSync(template, 'utf8')
  .replaceAll('__SUPABASE_URL__', url.replace(/\/$/, ''))
  .replaceAll('__SUPABASE_KEY__', key);
fs.writeFileSync(path.join(dist, 'index.html'), html);
console.log('Built dist/index.html for Supabase + Vercel.');
