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
- **Long labels** (measured in the browser, after review): ancestors never shrink (capped
  at 16rem); only the current page shrinks, down to 10rem. If the trail still does not fit
  on one line — narrow window, 200% text zoom — it **wraps**, and the current page wraps its
  text, so no level is ever cut to a fragment. Labels that are actually truncated get a
  tooltip (on the `li`, because the DSFR gives the current page `pointer-events: none`).
  Tooltips are not reachable by keyboard or touch, so a **focused** link whose label is
  cut wraps its text in place (and the trail wraps) instead of widening off-screen;
  labels that fit do not move. The current page is not focusable: its full text must be
  the page `<h1>` (**required** of apps using the bar).
- Ancestors without a destination render as plain text (breadcrumb mention grey, no
  underline, `fr-text--xs` like the links) — a state the DSFR does not define; only the last level gets
  `aria-current="page"` (links use a `custom` RouterLink so vue-router does not add its
  own `aria-current`).
- **Narrow screens / high zoom**: the DSFR hides the trail behind "Voir le fil d'Ariane"
  below 48em; we keep it visible and wrapping below 62em, so every level stays readable.
- **Key action**: one primary button per view, size `sm` in the shell bars (toolbar uses
  secondary / tertiary buttons).

## Accessibility consequences

- Same landmark and labels as the DSFR breadcrumb (`nav` "vous êtes ici :", `aria-current`).
- "…" is a real `<button>` (styled with `fr-breadcrumb__link`; `fr-breadcrumb__button` is
  hidden from md up): name "Afficher tous les niveaux du fil d'Ariane (n)". No
  `aria-expanded`: it disappears on activation, and focus moves to the first revealed
  level, so focus is never lost. Its target is small: fine for WCAG 2.1 AA, below the
  WCAG 2.2 target-size minimum (2.5.8).
- No list id unless the app passes one (nothing references it), so no duplicate ids.
- The key action is outside the navigation landmark, after the trail in reading order.

## Open questions

1. Should a page be able to put more than one action on the right, or one primary action
   plus an overflow menu (to be designed with the toolbar row)?
2. `document.title` (browser tab, RGAA 8.6) and a page-change announcement for screen
   readers should come from the same route titles — flagged by the a11y review, next item
   in TODO.md.
