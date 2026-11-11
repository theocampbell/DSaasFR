# 0009 — Filtres : menu déroulant + étiquette de filtre dans la barre d'outils, logique dans l'application

- **Statut** : Proposé
- **Date** : 2026-11-03
- **Composants** : DsaasfrDropdown, DsaasfrFilterChip (DsaasfrUserMenu repose désormais sur le menu déroulant)

## Point de départ DSFR

- [Tag](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/tag) : tags
  neutres, cliquables, sélectionnables ou supprimables — chaque tag fait **une seule** chose.
- Menus : `fr-menu > fr-menu__list` (navigation de l'en-tête, sélecteur de langue),
  flottants uniquement à partir du point de rupture lg ; pattern de divulgation (bouton +
  `aria-expanded`).
- Contrôles de formulaire : cases à cocher, boutons radio (`DsfrCheckboxSet`,
  `DsfrRadioButtonSet`).
- Aucun composant de barre de filtres ni de menu déroulant.

## Besoin SaaS

Les utilisateurs restreignent de longues listes en combinant des conditions et les
ajustent sur place, comme dans Linear : « Assigné à · est · Personne A, Personne B · × »,
où le champ, la condition et les valeurs peuvent chacun être modifiés en cliquant dessus.
Les champs disponibles, leurs valeurs et la façon dont ils s'appliquent sont propres à
chaque application.

## Décision

Trois couches :

1. **DsaasfrDropdown** (bibliothèque) : bouton déclencheur + panneau flottant, pattern de
   divulgation. Échap rend le focus au déclencheur ; un clic à l'extérieur ou une sortie
   avec Tab le ferment ; `autofocus` place le focus dans le panneau, sur le **choix
   courant** (coché / courant), sinon sur le premier contrôle. Le panneau **reste dans la
   fenêtre d'affichage** tant qu'il est ouvert (recalculé lorsque le déclencheur ou la
   fenêtre est redimensionné) : décalé horizontalement, hauteur limitée à l'espace restant
   avec défilement interne, basculé de l'autre côté uniquement lorsque le côté demandé est
   trop exigu (< 12rem) — le basculer librement le plaçait sous l'en-tête DSFR à 320px.
   Surface : balisage officiel `fr-menu` / `fr-menu__list` ; comme `fr-menu` ne flotte
   qu'à partir de lg, les règles DSFR pour poste de travail (absolute, `--ground + 1000`,
   ombre portée, surface overlap et paire de survol, contour en mode contraste élevé) sont
   appliquées à toutes les largeurs ; le filet supérieur open-blue, propre au poste de
   travail, est abandonné par souci de cohérence. Panneau à 1v sous le déclencheur, 22rem
   de large au maximum. Partagé avec le menu utilisateur.
2. **DsaasfrFilterChip** (bibliothèque, présentationnel) : `[field] [operator] [values] [×]`.
   Chaque partie dotée d'un slot devient un déclencheur de menu déroulant affichant le
   contenu de ce slot ; les parties sans slot sont du texte simple ; × émet `remove` ;
   `v-model:open-part` permet à l'application d'ouvrir « valeurs » juste après l'ajout
   d'un filtre. L'étiquette ressemble à un **tag neutre DSFR découpé en segments** (même
   surface, rayon, hauteur, texte, marges internes, paire de survol) : un fr-tag ne peut
   pas porter plusieurs actions, donc DsfrTag / fr-tag--dismiss ne sont pas réutilisés.
   **Interprétation** : dans le DSFR, le tag gris est le tag statique et les tags
   cliquables sont bleus (action-low) ; une étiquette composée de plusieurs boutons en
   bleu se lirait comme une seule grande action, elle reste donc grise et chaque partie
   montre son affordance au survol et lorsqu'elle est ouverte (open-blue, comme
   `fr-translate__btn`). La partie × a des marges internes asymétriques pour s'ajuster à
   l'extrémité arrondie.
3. **Logique de filtrage** (application) : champs, opérateurs, valeurs, leur application,
   synchronisation avec l'URL si souhaité.

### Interaction (responsable produit, 2026-11-04)

- **Appliqué à la demande, pas au clic.** Avec des millions d'enregistrements, le
  filtrage s'exécute sur le serveur : un filtrage instantané signifie une requête par clic
  et des résultats qui bougent pendant que l'utilisateur fait encore son choix (Linear
  peut filtrer instantanément parce qu'il conserve une copie locale synchronisée des
  données). Un bouton « Appliquer » explicite envoie une requête par décision et annonce
  le nouveau nombre de résultats une seule fois. Chaque panneau travaille sur un
  brouillon ; le fermer sans appliquer l'abandonne.
- **« Filtrer »** (`end` de la barre d'outils) ouvre **tous les champs avec leurs valeurs**
  (groupes de cases à cocher DSFR), avec un pied fixé : « Réinitialiser », « Appliquer les
  filtres (n) ». Le déclencheur affiche le nombre de filtres actifs (« Filtrer (2) »).
- **Une étiquette par champ** (`start` de la barre d'outils), dans l'ordre des champs,
  valeurs dans l'ordre de la liste. Le champ n'est pas modifiable sur l'étiquette (cela
  pourrait créer un doublon) ; la condition et les valeurs ouvrent un panneau doté de son
  propre « Appliquer » ; × retire le filtre immédiatement ; « Tout effacer ».
- Prise en charge par la bibliothèque : un slot `footer` fixé sur DsaasfrDropdown, transmis
  par DsaasfrFilterChip (avec la `part` ouverte).

### Une ligne sur grand écran (2026-11-06)

Retour du responsable produit : une partie de l'étiquette passait sur deux lignes et cassait
la mise en page. Sur grand écran, l'étiquette reste désormais **sur une ligne** : les valeurs
sont résumées selon leur longueur (« Autorisation de défrichement et 2 autres », 32 caractères
au plus, `maxValuesLength`), une valeur isolée très longue est raccourcie par « … » avec une
info-bulle, et la liste complète reste dans le nom accessible du groupe. Sous 62em (fort
zoom), le texte n'est jamais coupé : l'étiquette passe sur deux rangées (champ, condition et ×
en haut, valeurs en dessous), conformément au RGAA 10.11.

### Filtres groupés, recherche et filtres sélectionnés (2026-11-11)

Retours du responsable produit : avec une douzaine de filtres, un seul panneau « Filtrer »
mélange tout ; les étiquettes dans la barre d’outils la font déborder dès quelques filtres ;
la condition « est / n’est pas » et la modification sur place sont trop avancées pour les
utilisateurs visés. Nouveau motif, montré dans le bac à sable :

- **Le champ de recherche est dans la page**, sous le titre (`DsfrSearchBar` : référence,
  demandeur, commune ; appliquée à la validation), pas dans la barre d’outils.
- **Barre d’outils** : à gauche, le nombre de résultats (`role="status"`) ; à droite, **un
  bouton par groupe de filtres** (« Communes » avec sa modale, fiche 0010 ; « Instruction » ;
  « Projet »…), puis « Enregistrer la recherche ». Chaque bouton ouvre un panneau court avec
  les champs de son groupe et indique combien sont actifs (« Instruction (2) »). Les groupes
  dépendent du métier. Ces commandes forment un ensemble fixe : la ligne ne déborde plus.
- **Les filtres sélectionnés juste sous les boutons**, sur leur propre ligne : un **tag
  supprimable DSFR** par filtre et « Tout effacer » (qui ne vide pas le champ de recherche).
  Le texte recherché n’a pas de tag : il reste visible dans son champ. Un tag montre une
  valeur puis le nombre des autres (« Commune : Pessac et 49 autres »). Nouveau composant
  `DsaasfrSelectedFilters` : le balisage officiel `fr-tag--dismiss` (Vue DSFR n’a pas de
  variante supprimable de `DsfrTag`), chaque tag nommé « Retirer le filtre … ».
- **Pas de condition** : un filtre retient les dossiers qui ont l’une des valeurs choisies.
  Pour modifier un filtre, on revient à son bouton ; le tag sert seulement à le retirer.
  `DsaasfrFilterChip` (condition et valeurs modifiables sur place, à la manière de Linear)
  reste disponible pour des usages plus avancés.

## Conséquences pour l'accessibilité

- Étiquette = groupe nommé : « Filtre : Statut est Accepté, Incomplet ».
- Boutons des parties : « Modifier le champ : Statut », « Modifier la condition : est »,
  « Modifier les valeurs : … » — chacun contient son texte visible (libellé inclus dans le
  nom). Les valeurs résumées (« A, B et 2 autres ») conservent la liste complète dans le nom.
- × = « Retirer le filtre Statut ».
- Les panneaux des menus déroulants contiennent de vrais contrôles de formulaire (fieldset
  + legend) ou des listes de boutons.
- **Responsabilités de l'application** (illustrées dans le playground) : annoncer le
  nombre de résultats (`role="status"` : « 16 dossiers sur 40 ») ; après le retrait d'une
  étiquette, déplacer le focus sur l'étiquette suivante (ou la précédente), après « Tout
  effacer » sur « Filtrer » ; signaler le champ courant avec `aria-current` et une coche
  visible, et conserver les valeurs lorsque le même champ est de nouveau choisi.
- Un clic sur un libellé non focalisable dans un panneau situé dans un conteneur
  focalisable (le `<main>` du shell) ne doit pas le fermer : un focus qui passe à un
  ancêtre ne signifie pas « sortir ».

Pour `DsaasfrSelectedFilters` : chaque tag est un bouton nommé « Retirer le filtre Commune :
Pessac, Talence » (au plus 10 valeurs dans le nom) ; après un retrait, le focus passe au tag
suivant (ou précédent) ; quand il n’en reste aucun, l’événement `empty` (émis tout de suite,
même si l’application retire le composant) lui permet de placer le focus : dans le bac à sable,
sur le bouton du groupe du dernier filtre retiré. Le nombre de résultats reste une zone
`role="status"`, dans la barre d’outils.

## Questions ouvertes

1. Conserver les filtres dans l'URL (listes filtrées partageables), comme l'aperçu ?
2. Recherche dans les longues listes de valeurs (combobox) — futur composant.
3. Un badge indiquant le nombre de filtres sur « Filtrer » lorsque les étiquettes sont
   masquées sur écran étroit ?
