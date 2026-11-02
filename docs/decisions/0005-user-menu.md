# 0005 — User menu in the sidebar footer

- **Status**: Proposed
- **Date**: 2026-11-02
- **Components**: DsfsUserMenu (used in the DsfsSidebar `footer` slot)

## DSFR starting point

- The [En-tête](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/en-tete)
  puts account links ("Se connecter", "Mon espace", "Se déconnecter") in its quick-access
  links. Its sub-menus (navigation, `DsfrLanguageSelector`) use a **disclosure** pattern:
  a button with `aria-expanded`/`aria-controls` that shows a list of links.
- No DSFR component for an account menu.

## SaaS need

With the header gone (0003), the signed-in person and everything tied to the account
(profile, preferences, notifications, display settings, log out) need one predictable
place. SaaS tools put it at the bottom of the sidebar.

## Decision

- `DsfsUserMenu`: the person's name + role is the **trigger button**; it opens a panel
  (upwards in the sidebar footer) listing links (`to`/`href`) and actions (`action`).
- **Disclosure pattern**, like the DSFR header menus — not ARIA `role="menu"`, which would
  require arrow-key navigation and is often misused for navigation links.
- Closes on Escape (focus returns to the trigger), click outside, tab out, and after
  choosing an item.
- Styling: DSFR tokens only (`--background-overlap-grey`, `--lifted-shadow`, hover/active
  tokens); items are DSFR tertiary buttons with DSFR icons (`fr-icon-*`).

## Accessibility consequences

- Trigger name = name + role; `aria-expanded`, `aria-controls`.
- The list is labelled ("Mon compte"), items are real links or buttons.

## Open questions

1. "Paramètres d'affichage": reuse the DSFR display-settings modal pattern (light / dark /
   system) instead of the demo toggle?
2. Avatar: generic DSFR account icon now; initials or photo later?
