#!/usr/bin/env node
import { config } from 'dotenv';
import { spawn } from 'node:child_process';

config({ path: '.env' });

if (!process.env.ACAI_API_TOKEN) {
  console.error('ACAI_API_TOKEN is not set in .env');
  process.exit(1);
}

const args = process.argv.slice(2);
const child = spawn('npx', ['@acai.sh/cli', ...args], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

child.on('exit', (code) => process.exit(code ?? 0));
