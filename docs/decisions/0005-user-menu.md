# 0005 — Menu utilisateur dans le pied de la barre latérale

- **Statut** : Proposé
- **Date** : 2026-11-02
- **Composants** : DsaasfrUserMenu (utilisé dans le slot `footer` de DsaasfrSidebar)

## Point de départ DSFR

- L'[En-tête](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/en-tete)
  place les liens de compte (« Se connecter », « Mon espace », « Se déconnecter ») dans ses
  liens d'accès rapide. Ses sous-menus (navigation, `DsfrLanguageSelector`) utilisent un
  pattern de **divulgation** (disclosure) : un bouton avec `aria-expanded`/`aria-controls`
  qui affiche une liste de liens.
- Aucun composant DSFR pour un menu de compte.

## Besoin SaaS

L'en-tête ayant disparu (0003), la personne connectée et tout ce qui est lié au compte
(profil, préférences, notifications, paramètres d'affichage, déconnexion) ont besoin d'un
emplacement unique et prévisible. Les outils SaaS le placent en bas de la barre latérale.

## Décision

- `DsaasfrUserMenu` : le nom + le rôle de la personne forment le **bouton déclencheur** ;
  il ouvre un panneau (vers le haut dans le pied de la barre latérale) listant des liens
  (`to`/`href`) et des actions (`action`).
- **Pattern de divulgation**, comme les menus de l'en-tête DSFR — et non `role="menu"`
  d'ARIA, qui imposerait une navigation aux flèches et est souvent détourné pour des liens
  de navigation.
- Se ferme avec Échap (le focus revient au déclencheur), par un clic à l'extérieur, en
  sortant avec Tab, et après le choix d'un élément.
- **Vérification de réutilisation (dsfr-guardian) :** Vue DSFR n'a aucun composant de
  compte, d'avatar ou de menu déroulant ; DsfrNavigationMenu est lié à DsfrNavigation,
  DsfrLanguageSelector aux langues, et les liens d'accès rapide de DsfrHeader sont à plat.
  Un composant Dsaasfr se justifie, mais il utilise le **balisage officiel du menu DSFR**
  `fr-menu > fr-menu__list` (comme dans `fr-translate`), qui apporte le fond overlap, la
  paire de survol, `--overlap-shadow` et le contour en mode contraste élevé. Seules
  surcharges de mise en page : pleine largeur de la barre latérale et ouverture vers le haut.
- Éléments : `fr-btn--tertiary-no-outline fr-btn--sm` avec des icônes DSFR (la liste
  mélange liens et boutons ; `fr-nav__link` suppose un contexte `fr-nav`).
- Déclencheur : bouton personnalisé, car un nom + rôle sur deux lignes avec un avatar ne
  tient pas dans `fr-btn`. Il hérite de `--idle/--hover/--active` de son conteneur
  (alt-grey dans la barre latérale, default-grey dans la modale des écrans étroits) et
  reprend l'état déplié de `fr-translate__btn` (fond open-blue-france, chevron qui pivote,
  compatible avec la réduction des animations).
- Avatar : `fr-icon-account-circle-line`.

## Conséquences pour l'accessibilité

- Nom du déclencheur = nom + rôle ; `aria-expanded`, `aria-controls`.
- La liste est nommée (« Mon compte »), les éléments sont de vrais liens ou boutons.

## Paramètres d'affichage

L'en-tête accueillait auparavant les « Paramètres d'affichage ». Ils passent dans le menu
utilisateur : l'élément ouvre une `DsfrModal` avec des boutons radio clair / sombre /
système (`DsfrRadioButtonSet`), reposant sur le `useScheme` de Vue DSFR. Présenté dans le
playground ; pourrait devenir un composant `DsaasfrDisplaySettings` si toutes les
applications en ont besoin.

## Questions ouvertes

1. Avatar : icône de compte DSFR générique pour l'instant ; initiales ou photo plus tard ?
