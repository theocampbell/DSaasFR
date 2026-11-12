// Invented, deterministic demo data (no real people, no real files).
const firstNames = ['Camille', 'Dominique', 'Claude', 'Alix', 'Sacha', 'Morgan', 'Lou', 'Noa', 'Eden', 'Charlie']
const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau']
const communes = ['Bordeaux', 'Mérignac', 'Pessac', 'Talence', 'Libourne', 'Arcachon', 'Saint-Médard-en-Jalles', 'Lacanau', 'Saint-Émilion', 'Cenon']
// Every commune of the (invented) département: over a thousand, as in a real one. Only
// the ten above have case files; the others exist so the commune filter has a long list.
const saints = ['Médard', 'Aubin', 'Jean', 'Pierre', 'Germain', 'Martin', 'Laurent', 'André', 'Loubès', 'Seurin',
  'Sulpice', 'Vincent', 'Christoly', 'Ciers', 'Denis', 'Émilion', 'Estèphe', 'Julien', 'Macaire', 'Michel',
  'Paul', 'Romain', 'Sauveur', 'Selve', 'Yzan', 'Genès', 'Hilaire', 'Magne', 'Quentin', 'Avit']
const roots = ['Arsac', 'Avensan', 'Bassens', 'Blanquefort', 'Cadaujac', 'Camblanes', 'Carcans', 'Castelnau', 'Cestas', 'Créon',
  'Eysines', 'Floirac', 'Gradignan', 'Hourtin', 'Izon', 'Lacanau', 'Léognan', 'Lormont', 'Ludon', 'Macau',
  'Margaux', 'Martignas', 'Pauillac', 'Podensac', 'Quinsac', 'Saucats', 'Soulac', 'Targon', 'Vayres', 'Villenave']
const suffixes = ['', '-sur-Dordogne', '-sur-Garonne', '-en-Médoc', '-de-Guyenne', '-et-Bastide', '-les-Vignes',
  '-le-Haut', '-le-Bas', '-du-Bois', '-de-l’Isle', '-en-Gironde']
/** A small perimeter (e.g. a gendarmerie): the communes that have case files. */
export const perimetreCommunes = [...communes].sort((a, b) => a.localeCompare(b, 'fr'))
export const allCommunes = [...new Set([
  ...communes,
  ...roots.flatMap(root => suffixes.map(suffix => root + suffix)),
  ...saints.flatMap(saint => suffixes.map(suffix => `Saint-${saint}${suffix}`)),
  ...saints.flatMap((saint, i) => roots.filter((_, j) => (i + j) % 2 === 0).map(root => `Saint-${saint}-de-${root}`)),
])].sort((a, b) => a.localeCompare(b, 'fr'))
const types = ['Permis de construire', 'Déclaration préalable', 'Autorisation de défrichement', 'Dossier loi sur l’eau', 'Certificat d’urbanisme']
const statuses = ['À instruire', 'En cours', 'Incomplet', 'Accepté', 'Refusé']

const pick = <T>(list: T[], i: number, salt: number) => list[(i * 7 + salt * 3) % list.length]!
const date = (i: number) => `${String((i % 28) + 1).padStart(2, '0')}/${String((i % 12) + 1).padStart(2, '0')}/2026`

// Every status × type × commune combination exists once (5 × 5 × 10 = 250 case files),
// so any single filter value returns results; listed in a stable, mixed order.
const combinations = statuses.flatMap(statut => types.flatMap(type => communes.map(commune => ({ statut, type, commune }))))
const mixed = combinations
  .map((c, i) => ({ c, key: (i * 7919) % combinations.length }))
  .sort((a, b) => a.key - b.key)
  .map(({ c }) => c)

// Other attributes of each case file (filters of the Instruction and Projet groups), kept
// apart from the table row. Spread so that every value has case files.
const instructeurs = ['Camille Martin', 'Dominique Robert', 'Sacha Durand', 'Non assigné']
const delais = ['Dans les délais', 'Échéance sous 15 jours', 'Délai dépassé']
const consultations = ['Aucune', 'En attente de réponse', 'Avis reçus']
const natures = ['Construction neuve', 'Extension', 'Démolition', 'Changement de destination', 'Aménagement']
const protections = ['Aucune', 'Abords de monument historique', 'Site classé', 'Natura 2000']
const surfaces = ['Moins de 20 m²', 'De 20 à 150 m²', 'Plus de 150 m²']
const spread = <T>(list: T[], i: number, step: number) => list[(i * step + Math.floor(i / list.length)) % list.length]!
const attributes = new Map<string, Record<string, string>>()
export const attributesOf = (id: string) => attributes.get(id)!

export const dossiers = mixed.map(({ statut, type, commune }, i) => [
  `D-2026-${String(2250 - i).padStart(4, '0')}`,
  `${pick(firstNames, i, 1)} ${pick(lastNames, i, 2)}`,
  type,
  commune,
  statut,
  date(i),
])
dossiers.forEach((row, i) => attributes.set(row[0]!, {
  instructeur: spread(instructeurs, i, 1),
  delai: spread(delais, i, 2),
  consultations: spread(consultations, i, 5),
  nature: spread(natures, i, 3),
  protection: spread(protections, i, 7),
  surface: spread(surfaces, i, 11),
}))

export const usagers = Array.from({ length: 30 }, (_, i) => [
  `${pick(firstNames, i, 6)} ${pick(lastNames, i, 7)}`,
  pick(communes, i, 8),
  `${(i % 5) + 1}`,
  date(i + 3),
])

export const activity = Array.from({ length: 25 }, (_, i) =>
  `${date(i)} — ${pick(firstNames, i, 9)} ${pick(lastNames, i, 1)} : ${pick(types, i, 2).toLowerCase()} « ${pick(statuses, i, 4).toLowerCase()} » (${pick(communes, i, 3)})`,
)

export const lorem = [
  'Cette section décrit le fonctionnement du service et les règles applicables à l’instruction des demandes. Elle sert uniquement à remplir la page pour tester le défilement.',
  'Les agents instructeurs vérifient la complétude du dossier, sollicitent les pièces manquantes, consultent les services concernés puis proposent une décision.',
  'Les délais d’instruction courent à compter de la réception d’un dossier complet. Toute demande de pièce complémentaire suspend le délai jusqu’à réception.',
  'Les paramètres ci-dessous ne sont pas enregistrés : ce bac à sable n’est relié à aucune base de données.',
]

const pieceTitles: Record<string, string> = {
  1: 'Formulaire Cerfa n° 13406*09 signé',
  2: 'Plan de situation du terrain et plan de masse des constructions',
  3: 'Notice décrivant le terrain et le projet',
}

export interface PreviewContent {
  title: string
  description?: string
  link?: string
  fields?: [string, string][]
  document?: boolean
  /** Case history, most recent first: [date, event]. Long on purpose (scrolling demo). */
  history?: [string, string][]
}

const historyEvents = [
  'Dossier déposé en ligne',
  'Accusé de réception envoyé au demandeur',
  'Dossier attribué à l’instructeur',
  'Pièce justificative ajoutée : plan de situation',
  'Demande de pièces complémentaires',
  'Pièces complémentaires reçues',
  'Consultation de l’architecte des Bâtiments de France',
  'Avis favorable de l’architecte des Bâtiments de France',
  'Consultation du service de l’eau',
  'Avis réservé du service de l’eau',
  'Échange téléphonique avec le demandeur',
  'Note interne ajoutée',
  'Visite sur site programmée',
  'Compte rendu de visite ajouté',
  'Projet de décision rédigé',
  'Projet de décision transmis pour signature',
]

function historyOf(index: number): [string, string][] {
  return historyEvents
    .map((event, n): [string, string] => [
      `${String(((index + n) % 28) + 1).padStart(2, '0')}/${String((n % 12) + 1).padStart(2, '0')}/2026`,
      event,
    ])
    .reverse()
}

/** Preview ids: `D-2026-2041` (case file) or `D-2026-2041/2` (document 2 of it). */
export function describePreview(id: string | undefined): PreviewContent | undefined {
  if (!id) return undefined
  const [dossierId, piece] = id.split('/')
  const row = dossiers.find(r => r[0] === dossierId)
  if (!row) return undefined
  if (piece) {
    return { title: pieceTitles[piece] ?? `Pièce ${piece}`, description: `Pièce justificative — dossier ${dossierId}`, document: true }
  }
  return {
    title: `Dossier ${row[0]}`,
    description: row[2],
    link: `/dossiers/${row[0]}`,
    fields: [['Demandeur', row[1]!], ['Commune', row[3]!], ['Statut', row[4]!], ['Dépôt', row[5]!]],
    history: historyOf(dossiers.indexOf(row)),
  }
}
