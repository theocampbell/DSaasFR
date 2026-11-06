# Contribuer

DSaaSFR est une **proposition communautaire** : remarques, questions et contributions sont
bienvenues, y compris un simple retour d’usage. Cette page résume le
[guide du contributeur complet](https://github.com/theocampbell/DSaasFR/blob/develop/CONTRIBUTING.md).

## Avant de commencer

- Lisez les [fiches de décision](/decisions/) : elles expliquent chaque écart ou extension
  par rapport au DSFR.
- Pour une nouvelle idée ou un changement de comportement, ouvrez d’abord un
  [ticket](https://github.com/theocampbell/DSaasFR/issues) pour en discuter.

## Installer le projet

Prérequis : Node 22 ou plus et pnpm (`corepack enable` installe la bonne version).

```bash
git clone https://github.com/theocampbell/DSaasFR.git
cd DSaasFR
corepack enable
pnpm install          # installe aussi les hooks git (commitlint, lint-staged)

pnpm storybook        # http://localhost:6006 — documentation des composants
pnpm dev              # http://localhost:5173 — bac à sable (fausse application)
pnpm docs:dev         # ce site de documentation
pnpm check            # lint, types, exports, tests, build
```

Lancez `pnpm check` avant chaque pull request.

## Branches

Comme pour [Vue DSFR](https://github.com/dnum-mi/vue-dsfr) :

- **`develop`** : branche d’intégration. **Toutes les pull requests visent `develop`**,
  mises à jour par `rebase` (sans commit de fusion).
- **`main`** : branche de publication. Chaque fusion publie une nouvelle version sur npm.

## Messages de commit

Les commits suivent les
[Commits Conventionnels](https://www.conventionalcommits.org/fr/v1.0.0/), vérifiés par
commitlint. Le numéro de version et le journal des modifications en sont déduits.

| Type | Effet sur la version | Exemple |
|---|---|---|
| `feat:` | mineure (0.**2**.0) | `feat(toolbar): ajouter un slot center` |
| `fix:` | correctif (0.1.**1**) | `fix(dropdown): garder le panneau dans l'écran` |
| `docs:` | correctif | `docs: compléter le guide d'installation` |
| `feat!:` ou `BREAKING CHANGE:` | majeure | changement incompatible de l’API |
| `refactor:`, `test:`, `ci:`, `chore:`, `style:` | aucune | |

## Règles du projet

Elles sont décrites dans les [principes](/guide/principes). En bref : réutiliser Vue DSFR,
jetons DSFR uniquement, accessibilité RGAA 4.1, interprétations documentées, textes en
français modifiables par props.

Chaque composant suit la structure de Vue DSFR :

```
src/components/DsaasfrThing/
  DsaasfrThing.vue           # composant
  DsaasfrThing.types.ts      # interface des props, documentée
  DsaasfrThing.spec.ts       # tests (Vitest, Testing Library, axe)
  DsaasfrThing.stories.ts    # Storybook
  index.ts                   # exports
```

Il est exporté depuis `src/components/index.ts` (vérifié par `pnpm check-exports`).

## Fiches de décision

Toute interprétation ou extension d’un motif DSFR s’accompagne d’une fiche dans
`docs/decisions/`, à partir du [modèle](/decisions/0000-template). Elle cite la page DSFR de
départ, explique le besoin, liste les options envisagées et décrit les conséquences pour
l’accessibilité. Son statut reste « Proposé » : seul le responsable produit l’accepte.

## Utilisation de l’IA

Le projet est développé avec l’aide de Claude Code ; les commits concernés le mentionnent.
Les agents de relecture vérifient la conformité DSFR et l’accessibilité, mais ne remplacent
pas une relecture humaine.
