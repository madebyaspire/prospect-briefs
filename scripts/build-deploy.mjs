#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, '.deploy-dist');
const excluded = new Set(['.gitignore', 'README.md', 'scripts/build-deploy.mjs']);

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

const tracked = execFileSync('git', ['ls-files', '-z'], {
  cwd: root,
  encoding: 'utf8',
}).split('\0').filter(Boolean);

for (const relativePath of tracked) {
  if (excluded.has(relativePath)) continue;
  const destination = resolve(output, relativePath);
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(resolve(root, relativePath), destination);
}

console.log(`Built ${tracked.length - excluded.size} tracked static files into ${output}`);
