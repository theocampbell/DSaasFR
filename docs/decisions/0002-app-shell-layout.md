# 0002 — Application shell layout

- **Status**: Proposed (draft — awaiting product owner design input)
- **Date**: 2026-11-01
- **Components**: DsfsAppShell (+ future DsfsSidebar, DsfsToolbar, DsfsPreviewPanel)

## DSFR starting point

- [En-tête](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/en-tete):
  mandatory bloc-marque, designed for websites (tall, centred in `fr-container`).
- [Menu latéral](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/menu-lateral):
  in-page side navigation, not an application-level primary navigation.
- [Fil d'Ariane](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/fil-d-ariane).
- [Liens d'évitement](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/liens-d-evitement).

## SaaS need

Back-office users spend hours in the tool. Today's DSFR pages stack everything vertically
in a centred container, wasting screen width on large screens. Users need: persistent
primary navigation, a sense of where they are, contextual actions/filters close to the
content, and the ability to preview a document or item without leaving the list.

## Draft layout

```
┌─────────────┬────────────────────────────────────────┬──────────────┐
│ bloc-marque │ breadcrumb row                         │ preview      │
│ service     │ toolbar row: actions / filters         │ panel        │
│─────────────│ main content (full width, no container)│ (optional)   │
│ primary nav │ only `main` scrolls                    │              │
│ footer      │                                        │              │
└─────────────┴────────────────────────────────────────┴──────────────┘
```

The DSFR header is replaced by the sidebar brand block: see
[0003](0003-brand-in-sidebar.md).

- **Breadcrumb row** = location (DsfrBreadcrumb, margins removed).
- **Toolbar row** = page-level actions and filters (inspired by Linear).
- **Preview panel** = optional `aside`, opened by the app (`v-model:preview-open`).
- Below the DSFR `lg` breakpoint (62em) regions stack; the mobile pattern is not designed yet.

## Accessibility consequences

- Landmarks: `header` (from DsfrHeader), `nav` "Navigation principale", breadcrumb `nav`,
  `main` (focus target of the skip link), `aside` "Aperçu".
- Skip links: "Contenu" and "Menu".
- To decide: focus management when the preview opens/closes; whether the toolbar is a
  plain group or an APG toolbar (arrow-key navigation); collapsed sidebar labelling.

## Open questions

1. ~~Header height~~ → resolved by 0003 (no header).
2. Secondary navigation: second sidebar level, tabs in the toolbar row, or both?
3. Preview panel: fixed width, resizable, or expandable to full width?
4. Mobile: sidebar as drawer (DSFR modal-like), preview as full-screen view?
