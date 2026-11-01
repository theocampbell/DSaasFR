# 0003 — Bloc-marque at the top of the sidebar, no DSFR header

- **Status**: Proposed
- **Date**: 2026-11-01
- **Components**: DsfsSidebar, DsfsAppShell

## DSFR starting point

- [En-tête](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/en-tete):
  the bloc-marque (Marianne, "République Française", devise) is mandatory and the header
  links the service name to the home page (`title="Accueil - [service] - République Française"`).
- [Bloc-marque](https://www.systeme-de-design.gouv.fr/fondamentaux/identite-de-l-etat):
  must not be cropped, distorted or recoloured.
- [Menu latéral](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/menu-lateral).

## SaaS need

The DSFR header (~117px, content centred in `fr-container`) takes vertical space on
every screen and does not line up with a full-width application layout. The apps targeted
here are tools used all day by public servants, not public-facing websites. Other
government apps already place the bloc-marque at the top of a sidebar.

## Options considered

1. Keep `DsfrHeader` above the shell (current DSFR pattern): wastes vertical space,
   misaligned with the sidebar.
2. Compact full-width header: still a full row of chrome.
3. **Bloc-marque + service name at the top of the sidebar** (chosen).

## Decision

- The sidebar's top block is a `<header>` (banner landmark) containing the official
  bloc-marque rendered by Vue DSFR's `DsfrLogo` (small variant, untouched) and the service
  name + optional baseline.
- The service name links to home with the DSFR `title` convention; the whole block is
  clickable via `fr-enlarge-link`, like the DSFR header brand.
- Below: the primary navigation (`<nav aria-label="Navigation principale">`), rendered
  with Vue DSFR's `DsfrSideMenuList`. Groups provide the **secondary navigation** and open
  automatically when they contain the current route.
- Bottom: a footer slot for account, settings and display parameters.
- The shell no longer requires a header; the `header` slot remains optional.

### DSFR adaptations (layout only)

- `nav.fr-sidemenu` is used directly as application navigation, without
  `fr-sidemenu__inner` or the mobile toggle button; only the in-page margins and the
  mobile inset borders are reset. Item styles (active bar, groups, indentation) are DSFR's.
- `DsfrLogo small` (`fr-logo--sm`, the mobile-header size) because the sidebar is 16rem wide.
- Service title / baseline use `fr-text--lg fr-text--bold` / `fr-text--sm`, which match the
  mobile header sizes of `fr-header__service-title` / `-tagline` (header CSS is scoped to
  `.fr-header`).
- The brand block reproduces `.fr-header__brand.fr-enlarge-link`: same `--idle/--hover/--active`
  feedback and the focus ring pulled inside (`outline-offset: -2px`) so the scrolling sidebar
  does not clip it.
- Custom content in the `brand` slot must contain exactly one link (the block is an
  `fr-enlarge-link`).
- Skip links use Vue DSFR's `DsfrSkipLinks`.
- **Collapsing the sidebar is not offered** until open question 1 is decided: a collapsed
  rail would crop the bloc-marque.

## Accessibility consequences

- Landmarks: banner (sidebar header), navigation, main, complementary (preview).
  One banner per page: apps must not also render `DsfrHeader`.
- Active page: `aria-current="page"` derived from the route (prefix match for nested
  pages). Groups: `aria-expanded` + `aria-controls` from DsfrSideMenuList.
- The "Menu" skip link targets the sidebar.

## Open questions

1. Collapsed sidebar: the bloc-marque cannot be cropped. Hide it when collapsed, or
   disallow collapsing on this pattern?
2. Mobile: the sidebar currently stacks above content. Proposed: a top bar with the
   bloc-marque + a menu button opening the sidebar as a drawer (DSFR header mobile pattern).
3. Where do "Paramètres d'affichage" (theme switch) and the DSFR footer live? Proposed:
   sidebar footer for the former; the footer is often omitted in back-offices — to validate.
4. Is this an acceptable use of the bloc-marque for the DSFR team?
