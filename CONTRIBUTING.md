# Contribuer à DSaaSFR

Merci de votre intérêt ! DSaaSFR est un **projet expérimental et ouvert** : toute remarque,
question ou contribution est bienvenue, y compris un simple retour d'usage.

## Avant de commencer

- Lisez les [fiches de décision](docs/decisions) : elles expliquent chaque écart ou
  extension par rapport au DSFR, et pourquoi.
- Pour une nouvelle idée ou un changement de comportement, ouvrez d'abord un ticket pour
  en discuter.

## Installer le projet

Prérequis : Node 22+ et pnpm (`corepack enable` installe la bonne version).

```bash
git clone https://github.com/theocampbell/DSaasFR.git
cd DSaasFR
corepack enable
pnpm install          # installe aussi les hooks git (commitlint, lint-staged)

pnpm storybook        # http://localhost:6006 — documentation des composants
pnpm dev              # http://localhost:5173 — bac à sable (fausse application)
pnpm check            # lint, types, exports, tests, build : à lancer avant chaque PR
```

## Branches et pull requests

Comme pour [Vue DSFR](https://github.com/dnum-mi/vue-dsfr) :

- **`develop`** : branche d'intégration. **Toutes les PR visent `develop`**, à jour par
  `rebase` (sans commit de fusion).
- **`main`** : branche de publication. Seule `develop` (ou une branche `hotfix/*`) y est
  fusionnée ; chaque fusion publie automatiquement une nouvelle version sur npm.
- **`next`** (facultative) : préversions publiées avec l'étiquette npm `next`.

## Messages de commit

Les commits suivent les [Commits Conventionnels](https://www.conventionalcommits.org/fr/v1.0.0/),
vérifiés par commitlint :

| Type | Effet sur la version | Exemple |
|---|---|---|
| `feat:` | mineure (0.**2**.0) | `feat(toolbar): ajouter un slot center` |
| `fix:` | correctif (0.1.**1**) | `fix(dropdown): garder le panneau dans l'écran` |
| `docs:` | correctif | `docs: compléter le guide d'installation` |
| `feat!:` ou `BREAKING CHANGE:` | majeure | changement incompatible de l'API |
| `refactor:`, `test:`, `ci:`, `chore:`, `style:` | aucune | |

Le numéro de version et la release GitHub (avec les notes de version)
sont générés automatiquement par semantic-release à partir de ces messages.

### Changements incompatibles

Retirer ou renommer une prop, un emplacement, un événement ou un composant exporté est un
changement incompatible. Tant que le paquet est en `0.x`, il passe dans une version mineure :
utilisez `feat:` (pas `feat!:`, qui publierait une `1.0.0`) et décrivez dans le corps du
commit et dans la PR l’avant et l’après, sous « Changements incompatibles ». Voir
[Versions et compatibilité](docs/guide/versions.md).

## Règles du projet

Elles sont détaillées dans [CLAUDE.md](CLAUDE.md) (utilisé aussi par les agents IA du
projet). En résumé :

1. **Ne jamais réimplémenter ce que Vue DSFR fournit** : composer les composants `Dsfr*`
   ou réutiliser le balisage officiel `fr-*`.
2. **Jetons DSFR uniquement** : couleurs, espacements (`--dsaasfr-space-*`), typographie.
   Stylelint le vérifie.
3. **L'accessibilité est une fonctionnalité** : RGAA 4.1 / WCAG 2.1 AA, clavier complet,
   focus visible, noms accessibles, axe dans chaque test, utilisable à 320 px (zoom 400 %).
4. **Toute interprétation du DSFR est consignée** dans une fiche de décision, au statut
   « Proposé ».
5. **Textes en français**, modifiables par props.

Chaque composant suit la structure de Vue DSFR : `Composant.vue`, `.types.ts`, `.spec.ts`,
`.stories.ts`, `index.ts`, exporté depuis `src/components/index.ts` (vérifié par
`pnpm check-exports`).

## Utilisation de l'IA

Ce projet est développé avec l'aide de Claude Code ; les commits concernés le mentionnent.
Les agents de relecture (`.claude/agents/`) vérifient la conformité DSFR et
l'accessibilité, mais ne remplacent pas une relecture humaine.
