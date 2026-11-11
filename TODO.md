# DSaaSFR — à faire

Traité un élément à la fois, de haut en bas. Claude met ce fichier à jour au fur et à
mesure. **Responsable** : 🤖 Claude · 👤 Théo (décision ou action que vous seul pouvez prendre).

## 0. Prochaines étapes (état au 2026-11-11)

- [ ] 👤 Fusionner la PR #4 (`develop → main`, **« Create a merge commit »**) → publication
      0.3.0. Si la publication échoue après la création du tag, supprimer le tag avant de
      relancer.
- [ ] 👤 Faire valider par la designer : filtres groupés (Communes / Instruction / Projet),
      tags sous les boutons, recherche dans la page (bac à sable, page Dossiers).
- [ ] 🤖👤 « Mes recherches » : pas un composant. Ce sont des liens enregistrés en base
      (l’URL de la recherche), affichés dans la barre latérale (groupe « Mes recherches »
      sous « Dossiers ») ; « Enregistrer la recherche » (barre d’outils) enregistre l’URL
      courante. À faire côté application ; dans le bac à sable, un exemple et une recette.
      Chaque recherche a un **nom** (texte du lien). À montrer : « Enregistrer la recherche »
      ouvre une petite modale DSFR (champ « Nom de la recherche ») ; sur une recherche
      enregistrée, son nom dans le `<h1>` et l’onglet ; recherche modifiée (l’URL ne
      correspond plus, le lien n’est plus « page actuelle ») → « Enregistrer les
      modifications » ou « Enregistrer comme nouvelle recherche ».
- [ ] 🤖 Option : « Tout effacer » sur la dernière ligne de tags plutôt que seul en dessous.
- [ ] 🤖 Option : revue `dsfr-guardian` + `a11y-auditor` de `DsaasfrFilterDropdown` et
      `DsaasfrFilterModal` (code déjà revu dans le bac à sable, puis déplacé).
- [ ] 👤 Tests manuels avec NVDA / JAWS / VoiceOver (listes dans les fiches 0008 à 0011).
- [ ] 👤 Message à la communauté (artefact « Annonce DSaaSFR ») : relire les liens, poster.
- [ ] 🤖👤 Plus tard : reprendre `DsaasfrFilterChip` (retiré pour l’instant, code dans
      l’historique git, commit `c0f120e`).



- [ ] 🤖 **Titres de page issus des données chargées** (après les filtres) : un titre par page,
      défini par la page une fois ses données chargées (par ex. numéro de dossier, demandeur),
      qui alimente à la fois le niveau courant du fil d'Ariane, le `<h1>`, l'onglet du
      navigateur (`document.title`, RGAA 8.6) et une annonce de changement de page pour les
      lecteurs d'écran.
- [ ] 🤖 **Guide d'intégration + fausse authentification dans le playground** : route de
      mise en page, store d'authentification, navigation et actions filtrées selon le rôle,
      garde du routeur (un « instructeur » et un « admin » qui voient des choses différentes).
- [ ] 🤖 Passe de revue par `dsfr-guardian` + `a11y-auditor` sur chacun des composants ci-dessus.
- [ ] 👤 Lire les fiches de décision (docs/decisions) et passer celles que vous approuvez
      au statut **Accepté**.

## 2. Publier sur npm

- [ ] 👤 Créer l'organisation npm `dsaasfr` (gratuite pour les paquets publics) et activer
      la 2FA sur le compte.
- [ ] 👤 Première publication depuis votre poste : `npm login` puis `npm publish`
      (voir la section « Publication » du README).
- [ ] 👤 Sur npmjs.com, déclarer le workflow `release.yml` comme *trusted publisher* du
      paquet `@dsaasfr/vue`.
- [ ] 🤖 Ajouter le test côté consommateur à la CI (empaqueter, installer dans une
      application Vite + Vue DSFR vierge, compiler, afficher). Fait à la main le 2026-11-04.
- [ ] 🤖👤 Créer une branche `main` et travailler ensuite par pull requests.

## 3. Personnes et communauté

- [ ] 👤 Informer votre responsable hiérarchique et le référent IA de votre direction / le
      service du numérique du ministère au sujet du projet (open source, aucune donnée
      interne) — voir la synthèse des règles sur l'IA du 2026-11-02.
- [ ] 👤 Consulter la charte d'utilisation de PIAG sur l'intranet.
- [ ] 🤖👤 Signaler les deux problèmes Vue DSFR identifiés (fiche de décision 0004) : slot
      `mainnav` de `DsfrHeader` typé sans sa prop `hidemodal` ; `DsfrSideMenuList` place
      `aria-current="page"` sur les boutons de groupe.
- [ ] 🤖👤 Message de discussion pour les mainteneurs de Vue DSFR / la communauté DSFR :
      lien vers le bac à sable, fiches de décision, question « intégration, extension
      reconnue ou projet indépendant ? ».

## 4. Plus tard

- [ ] Tableau de données : en-têtes fixes, tri, sélection de lignes, actions groupées.
- [ ] Combobox / autocomplétion, sélection multiple, sélecteur de période.
- [ ] Toasts, états vides, squelettes de chargement.
- [ ] Composant `DsaasfrDisplaySettings` (si toutes les applications ont besoin de la
      modale de paramètres d'affichage).
- [ ] Avatar du menu utilisateur : initiales ou photo.
- [ ] Module Nuxt (seulement si des équipes Nuxt le demandent).

## Fait

- [x] `DsaasfrSidebar` : le lien courant compare aussi les paramètres et seul le lien le plus
      précis est « page actuelle » (recherches enregistrées `/dossiers?…` en liens).
- [x] 0.3.0 (PR #4) : aperçu flottant contenu dans la liste ; filtres groupés
      (`DsaasfrFilterDropdown`, `DsaasfrFilterModal`, `DsaasfrSearchableCheckboxSet`,
      `DsaasfrSelectedFilters`), recherche dans la page ; sélecteur de département
      (`DsaasfrContextSwitcher`, emplacement `context`) ; agent `a11y-auditor` sur le RGAA
      4.1.2 officiel ; revues DSFR et RGAA corrigées ; `DsaasfrFilterChip` retiré pour
      l’instant ; « projet expérimental, non officiel ».
- [x] Publication automatisée réparée : 0.2.0 publiée (trusted publisher npm, pas de commit
      sur `main` protégée).

- [x] Site de documentation (VitePress, en français) à la racine du bac à sable : guide,
      une page par composant avec exemple en direct et code à copier, composables, recettes
      (filtres, aperçu, rôles), fiches de décision, recherche. Storybook déplacé sous
      `/storybook/`.
- [x] Avant l'annonce à la communauté : publication automatisée (semantic-release, commits
      conventionnels, journal des modifications en français), vérification des exports,
      couverture des tests en CI, modèle de PR et guide du contributeur, pages de
      documentation en français dans Storybook (Accueil, Pour commencer, Contribuer).
- [x] Paquet `@dsaasfr/vue` prêt : métadonnées, licence MIT, `prepublishOnly` (`pnpm check`),
      provenance, workflow de publication sur tag `v*` ; testé dans une application vierge
      (installation, types, compilation, affichage).
- [x] Documentation (fiches de décision, README, TODO, Storybook) traduite en français.
- [x] Socle : bibliothèque Vite, Storybook (clair/sombre), Vitest + axe, règles de lint
      DSFR uniquement, playground, CI, agents Claude et hook de lint.
- [x] `DsaasfrAppShell` : mise en page, régions, liens d'évitement, slot d'aperçu avec
      retour du focus.
- [x] `DsaasfrSidebar` : bloc-marque + nom du service à la place de l'en-tête DSFR,
      navigation pilotée par le routeur avec groupes, slot de pied.
- [x] Écrans étroits / zoom à 400 % : deux variantes construites pour comparaison.
- [x] `DsaasfrUserMenu` : déclencheur nom + rôle, actions de compte, balisage de menu DSFR,
      modale de paramètres d'affichage (`useScheme`).
- [x] Bac à sable public sur GitHub Pages (Storybook + playground), mention de démonstration.
- [x] Synthèse des règles d'usage de l'IA (guide de l'État, feuille de route du MTE, PIAG).
- [x] Défilement : la page défile, barre latérale + lignes fil d'Ariane / barre d'outils +
      aperçu fixés (défilement au clavier corrigé, WCAG 2.1.1 ; focus jamais masqué sous les
      lignes fixées, 2.4.11).
- [x] Écrans étroits : variante A (DsfrHeader) conservée, variante B et `narrowVariant`
      supprimées.
- [x] `DsaasfrBreadcrumbBar` : fil d'Ariane piloté par le routeur (balisage DSFR) + action
      principale à droite, repli « … » pour les arborescences profondes, aucun libellé
      tronqué en fragments (retour à la ligne à la place) ; revu par dsfr-guardian +
      a11y-auditor.
- [x] `DsaasfrToolbar` : seconde ligne générique, slots `start` / `end` (fiche de décision 0007).
- [x] `DsaasfrPreviewPanel` + mises en page du shell (poussée / superposée / plein écran),
      focus, Échap, dans l'URL avec `usePreviewQuery` (fiche de décision 0008).
- [x] Filtres : `DsaasfrDropdown` (partagé avec le menu utilisateur) + `DsaasfrFilterChip`,
      à la manière de Linear ; exemple de logique de filtrage dans le playground (fiche de
      décision 0009).
- [x] Préfixe des composants renommé `Dsfs` → `Dsaasfr` (CSS `dsaasfr-`) : un seul nom
      partout, nettement distinct du `Dsfr` de Vue DSFR, dont il reprend la convention.
