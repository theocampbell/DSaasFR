// Demo switches for comparing designs in the sandbox (NOT part of a real app). Kept in
// the URL so a designer can share a link to a given variant.
import { ref } from 'vue'

/** The signed-in person's perimeter: the whole département, or a few communes (e.g. a gendarmerie). */
export type Perimetre = 'departement' | 'communes'
export const perimetre = ref<Perimetre>('departement')

/** How many départements the person works in: most have one (no switcher); a few have several. */
export type Departements = 'un' | 'plusieurs'
export const departements = ref<Departements>('un')
