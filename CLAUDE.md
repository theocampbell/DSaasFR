# DSaaSFR — instructions for Claude

DSaaSFR is a Vue 3 component library that adds **SaaS application patterns** (app shell,
navigation, toolbars, preview panel, data views…) on top of **Vue DSFR**
(`@gouvminint/vue-dsfr`) and the **DSFR** (`@gouvfr/dsfr`). It is used by French
government applications. It is a POC, a community proposal, NOT an official DSFR product.

## Non-negotiable rules

1. **Never reimplement what Vue DSFR already has.** Compose `Dsfr*` components
   (DsfrButton, DsfrBreadcrumb, DsfrHeader, DsfrSideMenu…) or reuse official `fr-*` markup.
2. **DSFR tokens only.**
   - Colours: DSFR CSS variables only (`var(--background-default-grey)`,
     `var(--text-action-high-blue-france)`, `var(--border-default-grey)`…). No hex,
     rgb(), hsl() or named colours. This gives light/dark themes for free.
   - Spacing: `var(--dsfs-space-*)` (DSFR scale: 1v = 0.25rem, 1w = 0.5rem) or DSFR
     utility classes (`fr-p-2w`, `fr-mb-1v`…).
   - Typography: DSFR classes (`fr-h3`, `fr-text--sm`…). Never set font-size or
     font-family in our CSS. Marianne only.
   - Raw lengths live in `src/styles/tokens.css` and nowhere else.
   Stylelint enforces this; do not disable rules to get green.
3. **Accessibility is a feature, not a check.** Target RGAA 4.1 / WCAG 2.1 AA.
   Use native elements first, then WAI-ARIA APG patterns. Every component must:
   be fully keyboard usable, have a visible focus (DSFR focus ring), expose correct
   landmarks/roles/names, respect `prefers-reduced-motion`, and pass axe.
4. **Interpretations are documented.** Any time we deviate from or extend a DSFR
   pattern, add or update a decision record in `docs/decisions/` (see template).
   Status starts as `Proposed`; only the human product owner marks it `Accepted`.
5. **User-facing strings are French** and overridable through props.

## Component conventions (mirror Vue DSFR)

- Prefix `Dsfs`, folder per component:
  ```
  src/components/DsfsThing/
    DsfsThing.vue           # <script setup lang="ts">, scoped styles, BEM `dsfs-thing__el--mod`
    DsfsThing.types.ts      # exported props interface, documented with JSDoc
    DsfsThing.spec.ts       # Vitest + Testing Library + expectNoA11yViolations
    DsfsThing.stories.ts    # Storybook, tags: ['autodocs']
    index.ts                # re-exports component + types
  ```
- Export from `src/components/index.ts`; the plugin registers everything exported there.
- State that the parent may control uses `defineModel` (`v-model:xxx`).
- Content goes through slots; prefer slots over config objects for layout components.
- Tests query by role and accessible name (`getByRole`), never by class.

## Commands

```bash
pnpm dev               # playground app (consumes the lib like a real app)
pnpm storybook         # component docs on :6006 (a11y addon on)
pnpm test              # vitest
pnpm lint              # eslint + stylelint (DSFR token rules)
pnpm typecheck
pnpm build             # dist/ + types/
pnpm check             # everything above; run before every commit
```

## Working with agents

Specialised subagents live in `.claude/agents/`. Typical flow for a new component:
1. `component-builder` implements it (component, types, story, spec, playground usage).
2. `dsfr-guardian` and `a11y-auditor` review it in parallel and report issues.
3. `test-writer` fills test gaps (keyboard, edge cases).
4. `docs-writer` updates the story docs and the decision record.
The human product owner reviews the decision records and the Storybook result.

## Known gotchas

- Import `@gouvfr/dsfr/dist/utility/utility.main.min.css`, not `utility.min.css`:
  the latter contains a legacy media query that Vite 8 (lightningcss) rejects.
- jsdom cannot evaluate colour contrast; that is covered by Storybook's a11y addon.
