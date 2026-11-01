# 0004 — Narrow screens and high zoom: DSFR mobile header pattern

- **Status**: Proposed — variant to choose (A or B)
- **Date**: 2026-11-01
- **Components**: DsfsSidebar, DsfsAppShell

## DSFR starting point

- The DSFR is mobile-first; breakpoints sm 36em, md 48em, lg 62em, xl 78em.
- [En-tête](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/en-tete),
  mobile: bloc-marque + service name + "Menu" button opening the navigation in a modal.
- [Menu latéral](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/menu-lateral),
  mobile: collapses inline behind a "Dans cette rubrique" button (in-page navigation only).

## SaaS need

Analytics show desktop-only users, so no phone experience is designed. But RGAA 10.11 /
WCAG 1.4.10 (reflow) requires the app to be usable at **320 CSS px without horizontal
scrolling**, which is a 1280px desktop screen at **400% zoom**. Low-vision desktop users
are counted as desktop in analytics. The target of this decision is high zoom, not phones.

## Options considered

1. Collapsible sidebar (icon rail) — **rejected**: overkill for the users, and a collapsed
   rail would crop the bloc-marque (forbidden).
2. Stack the sidebar above the content (previous behaviour) — passes reflow, but at 400%
   zoom users scroll through the whole navigation on every page.
3. **Below 62em, switch to the DSFR mobile header pattern** (chosen): a bar with
   bloc-marque + service name + "Menu" button; the menu opens in a modal containing the
   same navigation and the "Mon espace" footer. The bloc-marque is always visible, never
   cropped. Same `DsfsSidebar` props drive both layouts.

## Two implementations under evaluation (`narrowVariant`, experimental)

| | A — `dsfr-header` | B — `dialog` |
|---|---|---|
| Bar | Vue DSFR `DsfrHeader` (official mobile header, icon menu button) | Our bar (bloc-marque + service side by side, "Menu" text button) |
| Modal | DsfrHeader's menu modal (focus-trap, Escape, focus return) | Native `<dialog>` + `showModal()` (inert page, Escape, focus return) |
| Rule 1 "reuse Vue DSFR" | Fully reused | Own modal code (small) |
| Look | Pure DSFR | Closer to the wide sidebar |
| Risks | Relies on the untyped `mainnav` slot scope (`hidemodal`); hard-coded ids `button-menu`/`close-button` in Vue DSFR | Service name wraps at 320px next to the bloc-marque; Tab can reach browser UI (native dialog behaviour) |

Both were checked at 320px: focus moves to "Fermer" on open, Escape closes and returns
focus to "Menu", following a link closes the menu, exactly one banner landmark.

Recommendation: **A**. It is the official pattern, so there is nothing to justify to the
DSFR community, and it keeps us within rule 1. Variant B is removed once a choice is made.

## Accessibility consequences

- Breakpoint detection via `matchMedia` (`useNarrowViewport`), so only one layout is in the
  DOM: no duplicated landmarks or ids.
- The preview panel stacks under the content below 62em (to revisit with the panel work).

## Upstream notes for Vue DSFR

- `DsfrHeader`'s `mainnav` slot passes `{ hidemodal }` but is typed without props.
- Group buttons in `DsfrSideMenuList` get `aria-current="page"` when active (see 0003).
