# 0008 — Preview panel

- **Status**: Proposed
- **Date**: 2026-11-03
- **Components**: DsaasfrAppShell (`preview` slot), DsaasfrPreviewPanel, `usePreviewQuery`

## DSFR starting point

- [Modale](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/modale):
  centred dialog, "Fermer" close button (`fr-btn--close`), focus trapped.
- No side panel / drawer component.

## SaaS need

Back-office users check an item (case file, document) without leaving the list, then the
next one. A modal hides the list and must be closed each time; a side panel (as in Claude,
Linear, mail clients) keeps the list visible and the preview open while moving on.

## Decision

- **Layout by the shell**, by width:
  - ≥ 78em (DSFR xl): the panel **pushes** the content (third column, pinned).
  - 62–78em: it **slides over** the content, so the content is not squeezed into a thin
    column. Floating surface like `fr-menu`: `--background-overlap-grey` and
    `--overlap-shadow` (as a `box-shadow`; fr-menu's `filter: drop-shadow` would also
    affect the panel content). Layer `--ground + 750`: above a `DsfrHeader` if an app uses
    one, below DSFR menus (+1000).
  - < 62em (high zoom): still fixed, **full screen**; the rest of the page is `inert`.
- **DsaasfrPreviewPanel** for the content: sticky header with the title (heading), an
  optional description, the official DSFR close button (`fr-btn--close`, text "Fermer",
  name "Fermer l'aperçu"), optional actions and footer, scrolling body.
- **In the URL**: `usePreviewQuery()` keeps the item in `?apercu=…`. Opening pushes a history
  entry (Back closes the preview), closing replaces it; a shared link opens the preview.
- No resizing for now (a resize handle must be keyboard-operable; to add if users ask).

- Header built by us: Vue DSFR does not export DsfrModal's header on its own; the close
  button is the official `fr-btn--close fr-btn` markup. Header and footer backgrounds
  inherit the panel surface.

## Accessibility consequences

- Exception to the DSFR focus ring: the title gets focus programmatically on open; its
  ring is hidden for mouse users only (`:focus:not(:focus-visible)`), kept for keyboard.

- The panel is a `complementary` region named by its title (`aria-labelledby`).
- When the **user** opens it, focus moves to the title (announced, and the panel content
  is next in the tab order). Opened from a shared link / page load, focus stays at the page
  start (no focus stealing).
- Escape (focus inside) and "Fermer" close it; focus returns to the element that opened it.
- Full screen below 62em: the rest of the page is `inert`, so focus cannot go behind it.
- Each "Aperçu" trigger names its item ("Aperçu du dossier D-2026-2041").

## Open questions

1. Next / previous item buttons in the panel header to move through a list?
2. "Open full page" action as a standard header button?
