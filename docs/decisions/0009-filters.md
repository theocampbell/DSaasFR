# 0009 — Filters: dropdown + filter chip in the toolbar, logic in the app

- **Status**: Proposed
- **Date**: 2026-11-03
- **Components**: DsaasfrDropdown, DsaasfrFilterChip (DsaasfrUserMenu now built on the dropdown)

## DSFR starting point

- [Tag](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/tag): neutral,
  clickable, selectable or dismissible tags — each tag does **one** thing.
- Menus: `fr-menu > fr-menu__list` (header navigation, language selector), floating only
  from the lg breakpoint; disclosure pattern (button + `aria-expanded`).
- Form controls: checkboxes, radios (`DsfrCheckboxSet`, `DsfrRadioButtonSet`).
- No filter-bar or dropdown component.

## SaaS need

Users narrow long lists by combining conditions and adjust them in place, as in Linear:
"Assigné à · est · Personne A, Personne B · ×", where the field, the condition and the
values can each be changed by clicking them. Which fields exist, their values and how they
apply are specific to each app.

## Decision

Three layers:

1. **DsaasfrDropdown** (library): trigger button + floating panel, disclosure pattern.
   Escape returns focus to the trigger; click outside / tab out close it; `autofocus` moves
   focus into the panel (option lists, forms); the panel is shifted to stay inside the
   viewport. Surface: official `fr-menu` / `fr-menu__list` markup; since `fr-menu` only
   floats from lg, the DSFR desktop rules (absolute, `--ground + 1000`, drop shadow,
   overlap surface and hover pair) are applied at all widths. Shared by the user menu.
2. **DsaasfrFilterChip** (library, presentational): `[field] [operator] [values] [×]`. Each
   part with a slot becomes a dropdown trigger showing that slot's content; parts without a
   slot are plain text; × emits `remove`; `v-model:open-part` lets the app open "values"
   right after adding a filter. Looks like a **DSFR neutral tag split into segments** (same
   surface, radius, height, text): one fr-tag cannot hold several actions.
3. **Filter logic** (app): fields, operators, values, applying them, URL sync if wanted.
   The playground shows an example (Dossiers): "Filtrer" (toolbar end) lists the fields;
   choosing one adds a chip (toolbar start) with its values open (DSFR checkboxes); the
   condition uses DSFR radios; "Tout effacer" clears all.

## Accessibility consequences

- Chip = labelled group: "Filtre : Statut est Accepté, Incomplet".
- Part buttons: "Modifier le champ : Statut", "Modifier la condition : est",
  "Modifier les valeurs : …" — each contains its visible text (label in name). Summarised
  values ("A, B et 2 autres") keep the full list in the name.
- × = "Retirer le filtre Statut".
- Dropdown panels contain real form controls (fieldset + legend) or lists of buttons.
- **App responsibilities** (shown in the playground): announce the result count
  (`role="status"`: "16 dossiers sur 40"); after removing a chip or clearing all, move focus
  somewhere meaningful (the playground moves it to "Filtrer").
- Clicking a non-focusable label inside a panel inside a focusable container (the shell's
  `<main>`) must not close it: focus moving to an ancestor is not "leaving".

## Open questions

1. Keep filters in the URL (shareable filtered lists), like the preview?
2. Search inside long value lists (combobox) — future component.
3. A filter count badge on "Filtrer" when chips are hidden on narrow screens?
