# 0005 — User menu in the sidebar footer

- **Status**: Proposed
- **Date**: 2026-11-02
- **Components**: DsaasfrUserMenu (used in the DsaasfrSidebar `footer` slot)

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

- `DsaasfrUserMenu`: the person's name + role is the **trigger button**; it opens a panel
  (upwards in the sidebar footer) listing links (`to`/`href`) and actions (`action`).
- **Disclosure pattern**, like the DSFR header menus — not ARIA `role="menu"`, which would
  require arrow-key navigation and is often misused for navigation links.
- Closes on Escape (focus returns to the trigger), click outside, tab out, and after
  choosing an item.
- **Reuse check (dsfr-guardian):** Vue DSFR has no account, avatar or dropdown component;
  DsfrNavigationMenu is tied to DsfrNavigation, DsfrLanguageSelector to languages, and
  DsfrHeader quick links are flat. A Dsaasfr component is justified, but it uses the
  **official DSFR menu markup** `fr-menu > fr-menu__list` (as in `fr-translate`), which
  brings the overlap background, hover pair, `--overlap-shadow` and high-contrast outline.
  Only layout overrides: full sidebar width and opening upwards.
- Items: `fr-btn--tertiary-no-outline fr-btn--sm` with DSFR icons (the list mixes links
  and buttons; `fr-nav__link` assumes a `fr-nav` context).
- Trigger: custom button, because a two-line name + role with an avatar does not fit
  `fr-btn`. It inherits `--idle/--hover/--active` from its container (alt-grey in the
  sidebar, default-grey in the narrow-screen modal) and copies the `fr-translate__btn`
  expanded state (open-blue-france background, chevron rotating, reduced-motion safe).
- Avatar: `fr-icon-account-circle-line`.

## Accessibility consequences

- Trigger name = name + role; `aria-expanded`, `aria-controls`.
- The list is labelled ("Mon compte"), items are real links or buttons.

## Display settings

The header used to host "Paramètres d'affichage". It moves to the user menu: the item
opens a `DsfrModal` with light / dark / system radios (`DsfrRadioButtonSet`), backed by
Vue DSFR's `useScheme`. Shown in the playground; could become a `DsaasfrDisplaySettings`
component if every app needs it.

## Open questions

1. Avatar: generic DSFR account icon now; initials or photo later?
