#!/usr/bin/env node
// Consumer test: use the package the way an application does. Packs the built library,
// installs the tarball in a blank Vite + Vue app (ci/consumer) with the install command of
// the README, then type-checks (strict, TS defaults) and builds it. Catches what the
// repo's own tests cannot: a broken install command, missing files or types in the tarball.
// Run `pnpm build` first.
//
// With --latest (weekly CI): install the LATEST Vue DSFR, and the DSFR version it depends
// on, instead of the versions of the README — to learn that an upstream release breaks the
// package before the applications using it do.
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

if (!existsSync('dist/dsaasfr.js') || !existsSync('types/index.d.ts')) {
  console.error('consumer-test: run `pnpm build` first.')
  process.exit(1)
}

const run = (command, cwd) => {
  console.log(`\n$ ${command}`)
  execSync(command, { cwd, stdio: 'inherit' })
}

const work = mkdtempSync(join(tmpdir(), 'dsaasfr-consumer-'))
try {
  run(`npm pack --ignore-scripts --pack-destination ${work}`, process.cwd())
  const tarball = join(work, readdirSync(work).find(file => file.endsWith('.tgz')))

  const app = join(work, 'app')
  cpSync(resolve('ci/consumer'), app, { recursive: true })

  // The install command of the README, with the tarball in place of the registry package.
  const readme = readFileSync('README.md', 'utf8')
  const install = readme.match(/^npm install .*@dsaasfr\/vue.*$/m)?.[0]
  if (!install) throw new Error('consumer-test: install command not found in README.md')
  let command = install.replace('@dsaasfr/vue', tarball)
  if (process.argv.includes('--latest')) {
    const dsfr = execSync('npm view @gouvminint/vue-dsfr@latest dependencies.@gouvfr/dsfr', { encoding: 'utf8' }).trim()
    command = command
      .replace(/@gouvminint\/vue-dsfr@\S+/, '@gouvminint/vue-dsfr@latest')
      .replace(/@gouvfr\/dsfr@\S+/, `@gouvfr/dsfr@${dsfr}`)
      .replace(/ vue-router /, ' vue@latest vue-router@latest ')
  }
  run(`${command} --no-audit --no-fund`, app)
  run('npm install --no-audit --no-fund', app) // the app's own tooling (vite, vue-tsc…)

  run('npx vue-tsc --noEmit', app)
  run('npx vite build', app)
  console.log('\nconsumer-test: the package installs, type-checks and builds in a blank app.')
}
finally {
  rmSync(work, { recursive: true, force: true })
}
