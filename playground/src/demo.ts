// Demo switches for comparing designs in the sandbox (NOT part of a real app). Kept in
// the URL so a designer can share a link to a given variant.
import { ref } from 'vue'

/** Where communes are chosen: in the "Filtrer" panel and its chip, or a "Communes" button opening a modal. */
export type CommuneUi = 'filtrer' | 'modale'
export const communeUi = ref<CommuneUi>('filtrer')

/** The signed-in person's perimeter: the whole département, or a few communes (e.g. a gendarmerie). */
export type Perimetre = 'departement' | 'communes'
export const perimetre = ref<Perimetre>('departement')
