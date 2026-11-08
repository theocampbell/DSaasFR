# 0008 — Panneau d'aperçu

- **Statut** : Proposé
- **Date** : 2026-11-03
- **Composants** : DsaasfrAppShell (slot `preview`), DsaasfrPreviewPanel, `usePreviewQuery`

## Point de départ DSFR

- [Modale](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/modale) :
  boîte de dialogue centrée, bouton de fermeture « Fermer » (`fr-btn--close`), focus piégé.
- Aucun composant de panneau latéral / tiroir.

## Besoin SaaS

Les utilisateurs de back-office consultent un élément (dossier, document) sans quitter la
liste, puis le suivant. Une modale masque la liste et doit être fermée à chaque fois ; un
panneau latéral (comme dans Claude, Linear ou les clients de messagerie) garde la liste
visible et l'aperçu ouvert pendant que l'on passe à l'élément suivant.

## Décision

- **Mise en page assurée par le shell**, selon la largeur :
  - ≥ 62em (lg du DSFR) : le panneau **pousse** le contenu (troisième colonne, fixée). Sur
    les écrans moyens, le contenu devient étroit et les tableaux larges défilent dans leur
    propre cadre (`fr-table`). Une version antérieure faisait flotter le panneau au-dessus
    du contenu entre 62 et 78em ; la revue d'accessibilité a montré que le focus pouvait
    arriver sur des contrôles masqués dessous (RGAA 10.7) et que la liste en arrière-plan
    ne permettait plus d'afficher l'aperçu de l'élément suivant ; cette version a donc été
    abandonnée : rien n'est jamais recouvert.
  - < 62em (fort zoom) : **plein écran**, fixe, couche `--ground + 1500` (au-dessus d'un
    en-tête DSFR, en dessous des modales DSFR) ; le reste de la page — barre latérale /
    en-tête DSFR, contenu et liens d'évitement — est `inert`.
- **DsaasfrPreviewPanel** pour le contenu : en-tête fixé (sticky) avec le titre (niveau de
  titre), une description facultative, le bouton de fermeture officiel du DSFR
  (`fr-btn--close`, texte « Fermer », nom « Fermer l'aperçu »), des actions et un pied
  facultatifs, un corps qui défile.
- **Dans l'URL** : `usePreviewQuery()` conserve l'élément dans `?apercu=…`. L'ouverture
  ajoute une entrée à l'historique (le bouton Retour ferme l'aperçu), la fermeture la
  remplace ; un lien partagé ouvre l'aperçu.
- Pas de redimensionnement pour l'instant (une poignée de redimensionnement doit être
  utilisable au clavier ; à ajouter si les utilisateurs le demandent).

- En-tête construit par nos soins : Vue DSFR n'exporte pas séparément l'en-tête de
  DsfrModal ; le bouton de fermeture utilise le balisage officiel `fr-btn--close fr-btn`.
  Les fonds de l'en-tête et du pied héritent de la surface du panneau.

## Aperçu flottant (2026-11-08)

Demande du responsable produit : pour un dossier, un panneau flottant plutôt qu’une colonne,
pour ne pas resserrer le tableau ; la poussée reste adaptée aux documents. Le premier essai
de superposition (62–78em) avait été retiré parce que le focus pouvait tomber sur des
éléments cachés sous le panneau. D’où `previewMode="overlay"`, qui suit le modèle de la
modale DSFR : la page derrière est **mise en pause** (inerte) sous un voile (valeur du fond
de `fr-modal`, sans jeton DSFR), au niveau des modales DSFR (1750), surface et ombre
« lifted » comme `fr-modal`. Pour parcourir la liste sans fermer, `DsaasfrPreviewPanel`
propose **précédent / suivant** (le focus reste sur le bouton, le nouvel élément est annoncé ;
`usePreviewQuery().open(id, { replace: true })` n’ajoute pas d’entrée d’historique). Trois
largeurs : `previewSize` `sm` / `md` / `lg`.

## Conséquences pour l'accessibilité

- Exception à l'anneau de focus du DSFR : le titre reçoit le focus par programmation à
  l'ouverture ; son anneau est masqué pour les utilisateurs de la souris uniquement
  (`:focus:not(:focus-visible)`), conservé pour le clavier.

- Le panneau est une région `complementary` nommée par son titre (`aria-labelledby`).
- Lorsque l'**utilisateur** l'ouvre, le focus passe sur le titre (annoncé, et le contenu du
  panneau suit dans l'ordre de tabulation). S'il est ouvert depuis un lien partagé / au
  chargement de la page, le focus reste en début de page (pas de vol de focus).
- Échap (focus à l'intérieur) et « Fermer » le ferment ; le focus revient à l'élément qui
  l'a ouvert.
- En plein écran sous 62em : le reste de la page, liens d'évitement compris, est `inert`,
  de sorte que le focus ne peut pas passer derrière.
- Les lignes du fil d'Ariane et de la barre d'outils se trouvent dans `<main>` (leur texte
  appartient à une région, RGAA 12.6) ; le lien d'évitement « Contenu » y mène.
- Chaque déclencheur « Aperçu » nomme son élément (« Aperçu du dossier D-2026-2041 »).

## Questions ouvertes

1. Des boutons élément suivant / précédent dans l'en-tête du panneau pour parcourir une liste ?
2. Une action « Ouvrir en pleine page » comme bouton standard de l'en-tête ?
