#!/usr/bin/env node
// Fails if a component is not exported from the package entry (as Vue DSFR's
// ci/check-exports.mjs): every src/components/<Name>/ must have an index.ts exporting
// <Name>, and src/components/index.ts must re-export every folder.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = 'src/components'
const barrel = readFileSync(join(root, 'index.ts'), 'utf8')
const problems = []

for (const name of readdirSync(root, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)) {
  const index = join(root, name, 'index.ts')
  if (!existsSync(index)) {
    problems.push(`${name}: missing ${index}`)
    continue
  }
  if (!new RegExp(`as ${name}\\b`).test(readFileSync(index, 'utf8'))) problems.push(`${name}: ${index} does not export ${name}`)
  if (!barrel.includes(`'./${name}'`)) problems.push(`${name}: not re-exported from ${root}/index.ts`)
}

if (problems.length) {
  console.error(`check-exports: ${problems.length} problem(s)\n- ${problems.join('\n- ')}`)
  process.exit(1)
}
console.log('check-exports: every component is exported.')
