# Versions et compatibilité

DSaaSFR est un projet expérimental, en version `0.x`. Cette page dit ce que vous pouvez
attendre d’une mise à jour, et avec quelles versions de ses dépendances le paquet fonctionne.

## Compatibilité

| `@dsaasfr/vue` | Vue DSFR | DSFR | Vue | vue-router |
|---|---|---|---|---|
| 0.4 | `^8.21.0` | `~1.14.4` | `^3.5.27` | `^5.0.3` |
| 0.2 – 0.3 | `^8.21.0` | celle de Vue DSFR (`~1.14.4`) | `^3.5.27` | `^5.0.3` |

Ce sont des dépendances paires : votre application les fournit, et npm vous prévient si une
version ne convient pas. La version du DSFR est celle dont dépend Vue DSFR ; prenez la même.

Chaque lundi, une vérification automatique installe le paquet avec les **dernières** versions
de Vue DSFR, du DSFR, de Vue et de vue-router, vérifie les types, compile et lance les tests.
En cas d’échec, un ticket « amont » est ouvert dans le dépôt : vous pouvez le suivre avant de
mettre à jour ces dépendances dans votre application.

## Ce que change une version

Le numéro de version suit les messages de commit
([Commits Conventionnels](https://www.conventionalcommits.org/fr/v1.0.0/)), et chaque version
a ses notes dans les [releases GitHub](https://github.com/theocampbell/DSaasFR/releases).

Tant que le paquet est en `0.x` :

| Version | Ce qu’elle peut contenir | Ce que vous faites |
|---|---|---|
| Correctif (`0.4.0` → `0.4.1`) | Corrections, documentation. Aucun changement d’API. | Mettre à jour sans relire. |
| Mineure (`0.4` → `0.5`) | Nouveaux composants et props. **Peut retirer ou renommer** une prop, un emplacement, un événement ou un composant. | Lire les notes de version : elles listent chaque changement incompatible et ce qu’il faut modifier. |

Conséquences pratiques :

- Dans votre `package.json`, `^0.4.0` n’accepte que les correctifs `0.4.x` (c’est la règle de
  npm pour les versions `0.x`) : vous ne recevrez jamais une version mineure sans le décider.
- Un changement incompatible est annoncé dans les notes de la version sous un titre
  « Changements incompatibles », avec l’avant et l’après.
- Quand c’est possible, l’ancienne API reste une version mineure de plus, avec un
  avertissement dans la console en développement.

Ce qui compte comme l’API du paquet : les composants exportés, leurs props, emplacements,
événements et méthodes exposées ; les composables exportés ; les variables CSS
`--dsaasfr-*` de `tokens.css`. Les classes CSS `dsaasfr-*`, la structure HTML interne et les
fichiers de `types/` autres que l’entrée ne sont pas une API : ne vous appuyez pas dessus.

## Version 1.0

Une version `1.0` supposera : des applications en production qui l’utilisent, des tests avec
lecteurs d’écran, et un hébergement du projet par une organisation plutôt qu’un compte
personnel. À partir de là, un changement incompatible demandera une version majeure.

## Si le projet s’arrête

Le paquet est petit, sous licence MIT, et ne fait que composer Vue DSFR. Une application peut
copier dans son propre code les composants qu’elle utilise (`src/components`) et les
maintenir elle-même.
