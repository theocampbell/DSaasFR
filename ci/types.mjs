#!/usr/bin/env node
// Type declarations around the build (see the "build" script):
//   node ci/types.mjs clean   before: empty types/, so a removed component's declarations
//                             are never packed by a local publish;
//   node ci/types.mjs extras  after: what vue-tsc does not emit.
import { readFileSync, rmSync, writeFileSync } from 'node:fs'

const [step] = process.argv.slice(2)

if (step === 'clean') {
  rmSync('types', { recursive: true, force: true })
}
else if (step === 'extras') {
  // `import '@dsaasfr/vue/styles'` is a side-effect import of a CSS file: TypeScript
  // (noUncheckedSideEffectImports, on by default in TS 6) needs a declaration for it.
  writeFileSync('types/styles.d.ts', '// Side-effect import of the DSaaSFR stylesheet.\nexport {}\n')
  // The entry imports the source stylesheet, which is not shipped: drop it from the types.
  const entry = readFileSync('types/index.d.ts', 'utf8')
  writeFileSync('types/index.d.ts', entry.replace(/^import '\.\/styles\/index\.css';\n/m, ''))
}
else {
  console.error('usage: node ci/types.mjs clean|extras')
  process.exit(1)
}
