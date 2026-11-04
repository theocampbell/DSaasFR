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
   focus into the panel, on the **current choice** (checked / current) else the first
   control. The panel **stays inside the viewport** while open (recomputed when the
   trigger or the window resizes): shifted horizontally, height limited to the room left
   with scrolling inside, flipped to the other side only when the requested side is
   cramped (< 12rem) — flipping freely put it under the DSFR header at 320px. Surface: official `fr-menu` / `fr-menu__list` markup; since `fr-menu` only
   floats from lg, the DSFR desktop rules (absolute, `--ground + 1000`, drop shadow,
   overlap surface and hover pair, high-contrast outline) are applied at all widths; the
   desktop-only open-blue top line is dropped for consistency. Panel 1v below the
   trigger, at most 22rem wide. Shared by the user menu.
2. **DsaasfrFilterChip** (library, presentational): `[field] [operator] [values] [×]`. Each
   part with a slot becomes a dropdown trigger showing that slot's content; parts without a
   slot are plain text; × emits `remove`; `v-model:open-part` lets the app open "values"
   right after adding a filter. Looks like a **DSFR neutral tag split into segments** (same
   surface, radius, height, text, padding, hover pair): one fr-tag cannot hold several
   actions, so DsfrTag / fr-tag--dismiss are not reused. **Interpretation**: in the DSFR
   the grey tag is the static one and clickable tags are blue (action-low); a chip made of
   several buttons in blue would read as one big action, so it stays grey and each part
   shows its affordance on hover and when open (open-blue, as `fr-translate__btn`). The ×
   part has asymmetric padding to sit at the rounded end.
3. **Filter logic** (app): fields, operators, values, applying them, URL sync if wanted.

### Interaction (product owner, 2026-11-04)

- **Applied on demand, not on click.** With millions of records filtering runs on the
  server: instant filtering means one request per click and results moving while the user
  is still choosing (Linear can filter instantly because it keeps a local, synced copy of
  the data). An explicit "Appliquer" sends one request per decision and announces the new
  count once. Every panel works on a draft; closing it without applying discards it.
- **"Filtrer"** (toolbar end) opens **every field with its values** (DSFR checkbox sets),
  with a pinned footer: "Réinitialiser", "Appliquer les filtres (n)". The trigger shows the
  number of active filters ("Filtrer (2)").
- **One chip per field** (toolbar start), in field order, values in list order. The field
  is not editable on the chip (it could create a duplicate); condition and values open a
  panel with its own "Appliquer"; × removes the filter immediately; "Tout effacer".
- Library support: a pinned `footer` slot on DsaasfrDropdown, passed through by
  DsaasfrFilterChip (with the open `part`).

## Accessibility consequences

- Chip = labelled group: "Filtre : Statut est Accepté, Incomplet".
- Part buttons: "Modifier le champ : Statut", "Modifier la condition : est",
  "Modifier les valeurs : …" — each contains its visible text (label in name). Summarised
  values ("A, B et 2 autres") keep the full list in the name.
- × = "Retirer le filtre Statut".
- Dropdown panels contain real form controls (fieldset + legend) or lists of buttons.
- **App responsibilities** (shown in the playground): announce the result count
  (`role="status"`: "16 dossiers sur 40"); after removing a chip, move focus to the next
  chip (or the previous one), after clearing all to "Filtrer"; mark the current field with
  `aria-current` and a visible check, and keep values when the same field is re-picked.
- Clicking a non-focusable label inside a panel inside a focusable container (the shell's
  `<main>`) must not close it: focus moving to an ancestor is not "leaving".

## Open questions

1. Keep filters in the URL (shareable filtered lists), like the preview?
2. Search inside long value lists (combobox) — future component.
3. A filter count badge on "Filtrer" when chips are hidden on narrow screens?
