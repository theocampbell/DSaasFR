# 0007 — Toolbar: generic second row with start / end slots

- **Status**: Proposed
- **Date**: 2026-11-03
- **Components**: DsaasfrToolbar

## DSFR starting point

No DSFR toolbar component. The DSFR offers buttons and button groups (`fr-btns-group`),
tags, segmented controls, but no row combining them above a list.

## SaaS need

List pages need a row for context (count, active filters, view switches) and tools
(filter, export, display options). What goes in it varies per app: one team puts filter
chips on the left and a "Filtrer" trigger on the right, another puts view tabs or bulk
actions. The library must not decide that.

## Decision

- `DsaasfrToolbar`: two slots, `start` (left) and `end` (right). The component owns
  layout only — spacing (DSFR scale), alignment, wrapping. It knows nothing about filters;
  filter components (chips, dropdown) are separate and go into these slots.
- Items keep their natural width and wrap as a whole (never squeezed until labels
  break), `end` stays right-aligned, and on narrow screens `end` wraps below `start`.
- Same pattern as the breadcrumb bar (0006): content left, actions right. One primary
  button per view lives in the breadcrumb bar; the toolbar uses secondary / tertiary.

## Accessibility consequences

- **Not `role="toolbar"`**: the ARIA toolbar pattern means one tab stop and arrow-key
  navigation, which suits icon button rows, not mixed content (filter chips with several
  buttons each, menus, text). Each control stays in the normal tab order.
- With a `label` prop it is a labelled group (`role="group"`), e.g. "Filtres et actions
  de la liste"; without it, plain layout.
- Reading order = visual order: `start` then `end`.
