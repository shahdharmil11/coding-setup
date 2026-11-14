#!/usr/bin/env node
// Status line: model and effort, context size, prompt cache state, plan limits, branch.
// Claude Code pipes session JSON to stdin and shows the first line of stdout.
// Everything here is local and free: no model calls, no subprocesses.
'use strict';

const fs = require('fs');
const path = require('path');

const useColor = !process.env.NO_COLOR;
const paint = (code, text) => (useColor ? `\x1b[${code}m${text}\x1b[0m` : text);
const dim = (t) => paint('2', t);
const yellow = (t) => paint('33', t);
const red = (t) => paint('31', t);

// Colour a value by two thresholds: plain below warn, yellow from warn, red from alarm.
function graded(value, warn, alarm, text) {
  if (value >= alarm) return red(text);
  if (value >= warn) return yellow(text);
  return text;
}

function tokens(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1)}M`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}k`;
  return String(n);
}

// Read the branch from .git/HEAD directly; spawning git on every refresh is slow.
function branch(startDir) {
  let dir = startDir;
  for (let i = 0; dir && i < 40; i++) {
    const dotGit = path.join(dir, '.git');
    try {
      const stat = fs.statSync(dotGit);
      let gitDir = dotGit;
      if (stat.isFile()) {
        // A linked worktree: .git is a file holding "gitdir: <path>".
        const m = /^gitdir:\s*(.+)$/m.exec(fs.readFileSync(dotGit, 'utf8'));
        if (!m) return '';
        gitDir = path.resolve(dir, m[1].trim());
      }
      const head = fs.readFileSync(path.join(gitDir, 'HEAD'), 'utf8').trim();
      const ref = /^ref:\s*refs\/heads\/(.+)$/.exec(head);
      return ref ? ref[1] : head.slice(0, 7);
    } catch {
      const parent = path.dirname(dir);
      if (parent === dir) return '';
      dir = parent;
    }
  }
  return '';
}

function render(input) {
  const parts = [];

  const model = input.model?.display_name || input.model?.id || 'claude';
  const effort = input.effort?.level;
  parts.push(effort ? `${model} ${dim(effort)}` : model);

  // Context: cost per request grows with this number, so show it in tokens.
  const cw = input.context_window;
  if (cw && typeof cw.total_input_tokens === 'number') {
    const used = cw.total_input_tokens;
    parts.push(`${dim('ctx')} ${graded(used, 200_000, 350_000, tokens(used))}`);
  }

  // Cache: a cold cache means the next message re-reads the whole conversation at full price.
  const cache = input.prompt_cache;
  if (cache && cache.caching_observed !== false) {
    if (cache.warm === false) parts.push(red('cache cold'));
    else if (typeof cache.hit_ratio === 'number') {
      const pct = Math.round(cache.hit_ratio * 100);
      parts.push(`${dim('cache')} ${pct < 70 ? yellow(`${pct}%`) : `${pct}%`}`);
    }
  }

  // Plan limits, present on subscription plans.
  const limits = input.rate_limits;
  const five = limits?.five_hour?.used_percentage;
  const week = limits?.seven_day?.used_percentage;
  const limitParts = [];
  if (typeof five === 'number') limitParts.push(`${dim('5h')} ${graded(five, 70, 90, `${Math.round(five)}%`)}`);
  if (typeof week === 'number') limitParts.push(`${dim('7d')} ${graded(week, 70, 90, `${Math.round(week)}%`)}`);
  if (limitParts.length) parts.push(limitParts.join(' '));

  const cwd = input.workspace?.current_dir || input.cwd || '';
  const br = cwd ? branch(cwd) : '';
  if (br) parts.push(dim(br));

  return parts.join(dim(' | '));
}

if (require.main === module) {
  let raw = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => (raw += chunk));
  process.stdin.on('end', () => {
    let input = {};
    try {
      input = JSON.parse(raw || '{}');
    } catch {
      // Malformed input: show a neutral line instead of an error.
    }
    process.stdout.write(render(input) + '\n');
  });
}

module.exports = { render, tokens, branch };
