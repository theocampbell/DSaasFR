# 0006 — Breadcrumb bar: router-driven breadcrumb + key action

- **Status**: Proposed
- **Date**: 2026-11-02
- **Components**: DsaasfrBreadcrumbBar, `useRouteBreadcrumb`

## DSFR starting point

- [Fil d'Ariane](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/fil-d-ariane):
  `nav.fr-breadcrumb > ol.fr-breadcrumb__list > li > a.fr-breadcrumb__link`, current page
  last with `aria-current="page"`, label "vous êtes ici :". On mobile the whole trail hides
  behind a "Voir le fil d'Ariane" button. Placed above the page title, with page margins.
- Vue DSFR `DsfrBreadcrumb` takes a `links` array only: no slot for a collapse button
  or for actions.

## SaaS need

App pages are 3–5 levels deep (list → case file → documents → document). The row above the
content has free horizontal space; users expect the page's key action (e.g. "Nouveau
dossier") at the top right, as in most SaaS tools. Teams should not hand-wire the
breadcrumb on every page.

## Decision

- **Official DSFR breadcrumb markup** and classes, rendered by `DsaasfrBreadcrumbBar`
  (not `DsfrBreadcrumb`, which cannot host the "…" button). Layout-only overrides: no page
  margins, one line, flex.
- **Right side: `actions` slot** for the page's key action(s), outside the `nav`.
- **Router-driven**: `useRouteBreadcrumb()` resolves every path prefix (`/`, `/dossiers`,
  `/dossiers/2041`) and reads the matching route's `meta.breadcrumb` (or `meta.title`):
  a string or a function of the route; `false` hides a level. Works with flat and nested
  routes. An `items` prop overrides it. The same trail gives the page `<h1>`.
- **Long trails**: above `maxItems` (default 4) levels, the middle ones collapse into a
  "…" button (first level, "…", last levels kept). It reveals the full trail; a new page
  starts collapsed again.
- **Long labels**: truncated at 16rem with an ellipsis; the full text stays in the DOM
  (read by screen readers) and long labels get a `title` tooltip.
- **Narrow screens / high zoom**: no DSFR "Voir le fil d'Ariane" collapse; the trail wraps
  over several lines instead of truncating, so every level stays readable at 320px.

## Accessibility consequences

- Same landmark and labels as the DSFR breadcrumb (`nav` "vous êtes ici :", `aria-current`).
- "…" is a real button: name "Afficher tous les niveaux du fil d'Ariane (n)",
  `aria-expanded`/`aria-controls`; after activation it disappears and focus moves to the
  first revealed level, so focus is never lost.
- The key action is outside the navigation landmark, after the trail in reading order.

## Open questions

1. Should a page be able to put more than one action on the right, or one primary action
   plus an overflow menu (to be designed with the toolbar row)?
2. Should `document.title` (browser tab) and a page-change announcement for screen
   readers come from the same route titles? (Proposed for the next iteration.)
