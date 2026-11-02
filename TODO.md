# DSaaSFR — todo

Worked through one item at a time, top to bottom. Claude updates this file as items
are done. **Owner**: 🤖 Claude · 👤 Théo (decision or action only you can take).

## 1. Finish the shell (base for v0.1.0)

- [ ] 👤🤖 **Scrolling**: let the page scroll with the sidebar, breadcrumb row and
      toolbar row pinned (fixes keyboard scrolling on long text pages, WCAG 2.1.1;
      removes the scroll-reset workaround). *Waiting for your go-ahead.*
- [ ] 👤 **Narrow screens**: choose variant A (DsfrHeader, recommended) or B (dialog)
      — see docs/decisions/0004. 🤖 then remove the other one and the `narrowVariant` prop.
- [ ] 🤖 **Breadcrumb row** (first row): built from the router — each route declares
      its title once → breadcrumb, `<h1>`, browser tab title, page-change announcement for
      screen readers. Page actions on the right (Linear-style). 👤 design input welcome.
- [ ] 🤖 **Toolbar row** (second row): actions and filters, shown only when the page
      needs them; overflow "…" menu when there are too many actions. 👤 design input welcome.
- [ ] 🤖 **Preview panel**: push the content on wide screens, overlay on narrower ones;
      linkable in the URL (back button closes it); focus management; behaviour on narrow
      screens. Resizable only if keyboard-accessible.
- [ ] 🤖 Review pass by `dsfr-guardian` + `a11y-auditor` on each component above.
- [ ] 👤 Read the decision records (docs/decisions) and mark the ones you agree with
      **Accepted**.

## 2. Publish on npm

- [ ] 👤 **Package name**: `@dsaasfr/vue` (recommended: neutral, can be handed over)
      or `dsaasfr`.
- [ ] 🤖 Package metadata: `LICENSE` file, repository/homepage/bugs/keywords,
      `publishConfig.access`, `prepublishOnly` running `pnpm check`, clean public types.
- [ ] 🤖 Consumer test in CI: pack the package, install it in a blank Vite + Vue DSFR
      app, check it builds, renders and type-checks.
- [ ] 🤖 Release process: Changesets (versions + CHANGELOG) and a GitHub Action
      publishing with npm trusted publishing (no token, provenance badge).
- [ ] 🤖👤 Create a `main` branch and work through pull requests from then on.
- [ ] 👤 npm account with 2FA (+ `dsaasfr` organisation if scoped name), and add the
      GitHub workflow as trusted publisher on npmjs.com.
- [ ] 👤 Merge the first release PR → `0.1.0` published.

## 3. People and community

- [ ] 👤 Tell your manager and your directorate's AI referent / the ministry's digital
      department about the project (open-source, no internal data) — see the AI rules
      summary from 2026-11-02.
- [ ] 👤 Check the PIAG usage charter on the intranet.
- [ ] 🤖👤 Report the two Vue DSFR issues found (decision 0004): `DsfrHeader` `mainnav`
      slot typed without its `hidemodal` prop; `DsfrSideMenuList` puts
      `aria-current="page"` on group buttons.
- [ ] 🤖👤 Discussion post for Vue DSFR maintainers / DSFR community: sandbox link,
      decision records, question "absorb, recognised extension, or independent?".

## 4. Later

- [ ] Data table: sticky headers, sorting, row selection, bulk actions.
- [ ] Combobox / autocomplete, multi-select, date range picker.
- [ ] Toasts, empty states, loading skeletons.
- [ ] `DsfsDisplaySettings` component (if every app needs the display settings modal).
- [ ] User menu avatar: initials or photo.
- [ ] Nuxt module (only if Nuxt teams ask for it).

## Done

- [x] Scaffold: Vite library, Storybook (light/dark), Vitest + axe, DSFR-only lint rules,
      playground, CI, Claude agents and lint hook.
- [x] `DsfsAppShell`: layout, landmarks, skip links, preview slot with focus return.
- [x] `DsfsSidebar`: bloc-marque + service name instead of the DSFR header, router-driven
      navigation with groups, footer slot.
- [x] Narrow screens / 400% zoom: two variants built for comparison.
- [x] `DsfsUserMenu`: name + role trigger, account actions, DSFR menu markup,
      display settings modal (`useScheme`).
- [x] Public sandbox on GitHub Pages (Storybook + playground), demo notice.
- [x] Summary of the AI usage rules (State guide, MTE roadmap, PIAG).
