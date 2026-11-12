// App-side context (NOT in the library): the département the app works in. The library
// only provides DsaasfrContextSwitcher. Here it is kept in memory and set from `?dep=`
// when the user switches; a real app would rather put it in the path (/33/dossiers) or
// in the session, and include it in saved searches.
import { ref } from 'vue'

export interface Departement { code: string, name: string }
/** Extract: two régions of eighteen (enough to show the "every département" page). */
export const regions: { name: string, departements: Departement[] }[] = [
  {
    name: 'Nouvelle-Aquitaine',
    departements: [
      { code: '16', name: 'Charente' }, { code: '17', name: 'Charente-Maritime' }, { code: '19', name: 'Corrèze' },
      { code: '23', name: 'Creuse' }, { code: '24', name: 'Dordogne' }, { code: '33', name: 'Gironde' },
      { code: '40', name: 'Landes' }, { code: '47', name: 'Lot-et-Garonne' }, { code: '64', name: 'Pyrénées-Atlantiques' },
      { code: '79', name: 'Deux-Sèvres' }, { code: '86', name: 'Vienne' }, { code: '87', name: 'Haute-Vienne' },
    ],
  },
  {
    name: 'Occitanie',
    departements: [
      { code: '09', name: 'Ariège' }, { code: '11', name: 'Aude' }, { code: '12', name: 'Aveyron' },
      { code: '30', name: 'Gard' }, { code: '31', name: 'Haute-Garonne' }, { code: '32', name: 'Gers' },
      { code: '34', name: 'Hérault' }, { code: '46', name: 'Lot' }, { code: '48', name: 'Lozère' },
      { code: '65', name: 'Hautes-Pyrénées' }, { code: '66', name: 'Pyrénées-Orientales' }, { code: '81', name: 'Tarn' },
      { code: '82', name: 'Tarn-et-Garonne' },
    ],
  },
]
const all = regions.flatMap(r => r.departements)
export const departementLabel = (code: string) => {
  const d = all.find(x => x.code === code)
  return d ? `${d.name} (${d.code})` : code
}

/** The département in use, and those the signed-in person works in (most people: one). */
export const currentDep = ref('33')
export const severalDeps = ['33', '40', '64']
