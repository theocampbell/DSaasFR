#!/usr/bin/env node
// PostToolUse hook: lint the file Claude just edited and feed errors back.
// Exit code 2 sends stderr back to Claude so it fixes the problem immediately.
import { execFileSync } from 'node:child_process'
import { relative } from 'node:path'

let input = ''
for await (const chunk of process.stdin) input += chunk
const filePath = JSON.parse(input || '{}')?.tool_input?.file_path
if (!filePath) process.exit(0)

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd()
const rel = relative(root, filePath)
if (rel.startsWith('..') || rel.includes('node_modules')) process.exit(0)

const run = (bin, args) => {
  try {
    execFileSync('pnpm', ['exec', bin, ...args], { cwd: root, stdio: 'pipe' })
    return ''
  } catch (e) {
    return `${e.stdout ?? ''}${e.stderr ?? ''}`
  }
}

let errors = ''
if (/\.(vue|ts|js|mjs)$/.test(rel)) errors += run('eslint', [rel])
if (/^src\/.*\.(vue|css)$/.test(rel)) errors += run('stylelint', [rel])

if (errors.trim()) {
  process.stderr.write(`Lint errors in ${rel} (DSaaSFR rules, see CLAUDE.md):\n${errors}`)
  process.exit(2)
}
