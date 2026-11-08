# Journal des modifications

À partir de la 0.2.0, les notes de chaque version sont publiées automatiquement dans les
[releases GitHub](https://github.com/theocampbell/DSaasFR/releases) (générées par
semantic-release à partir des commits conventionnels). La branche `main` étant protégée, la
publication ne commite plus ce fichier.

## 0.1.0 (2026-11-04)

Première version publiée sur npm : `@dsaasfr/vue`.

### ✨ Nouvelles fonctionnalités

* **DsaasfrAppShell** : mise en page applicative (barre latérale, fil d'Ariane, barre d'outils, contenu, panneau d'aperçu), régions ARIA, liens d'évitement, défilement de page avec zones épinglées.
* **DsaasfrSidebar** : bloc-marque et nom du service à la place de l'en-tête DSFR, navigation principale et secondaire pilotée par le routeur, en-tête DSFR mobile sur écran étroit / zoom élevé.
* **DsaasfrUserMenu** : la personne connectée comme déclencheur des actions de compte.
* **DsaasfrBreadcrumbBar** : fil d'Ariane construit depuis le routeur, action principale à droite, repli « … » des niveaux.
* **DsaasfrToolbar** : barre d'outils générique `start` / `end`.
* **DsaasfrPreviewPanel** : panneau d'aperçu (pousse le contenu, plein écran sur écran étroit), lié à l'URL avec `usePreviewQuery`.
* **DsaasfrDropdown** et **DsaasfrFilterChip** : briques de filtres façon Linear, application explicite.
