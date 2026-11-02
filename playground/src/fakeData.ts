// Invented, deterministic demo data (no real people, no real files).
const firstNames = ['Camille', 'Dominique', 'Claude', 'Alix', 'Sacha', 'Morgan', 'Lou', 'Noa', 'Eden', 'Charlie']
const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau']
const communes = ['Bordeaux', 'Mérignac', 'Pessac', 'Talence', 'Libourne', 'Arcachon', 'Bègles', 'Blaye', 'Langon', 'Cenon']
const types = ['Permis de construire', 'Déclaration préalable', 'Autorisation de défrichement', 'Dossier loi sur l’eau', 'Certificat d’urbanisme']
const statuses = ['À instruire', 'En cours', 'Incomplet', 'Accepté', 'Refusé']

const pick = <T>(list: T[], i: number, salt: number) => list[(i * 7 + salt * 3) % list.length]!
const date = (i: number) => `${String((i % 28) + 1).padStart(2, '0')}/${String((i % 12) + 1).padStart(2, '0')}/2026`

export const dossiers = Array.from({ length: 40 }, (_, i) => [
  `D-2026-${String(2041 - i).padStart(4, '0')}`,
  `${pick(firstNames, i, 1)} ${pick(lastNames, i, 2)}`,
  pick(types, i, 3),
  pick(communes, i, 4),
  pick(statuses, i, 5),
  date(i),
])

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
