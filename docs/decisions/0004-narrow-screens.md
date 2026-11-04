# 0004 — Écrans étroits et fort zoom : pattern d'en-tête mobile du DSFR

- **Statut** : Proposé — variante A choisie par le responsable produit (2026-11-02)
- **Date** : 2026-11-01
- **Composants** : DsaasfrSidebar, DsaasfrAppShell

## Point de départ DSFR

- Le DSFR est conçu « mobile first » ; points de rupture sm 36em, md 48em, lg 62em, xl 78em.
- [En-tête](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/en-tete),
  en mobile : bloc-marque + nom du service + bouton « Menu » qui ouvre la navigation dans
  une modale.
- [Menu latéral](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/menu-lateral),
  en mobile : se replie dans la page derrière un bouton « Dans cette rubrique » (navigation
  au sein de la page uniquement).

## Besoin SaaS

Les statistiques de fréquentation ne montrent que des utilisateurs sur poste de travail :
aucune expérience téléphone n'est donc conçue. Mais le RGAA 10.11 / WCAG 1.4.10
(redistribution du contenu) exige que l'application soit utilisable à **320 px CSS sans
défilement horizontal**, ce qui correspond à un écran de poste de travail de 1280px avec
un **zoom à 400 %**. Les utilisateurs malvoyants sur poste de travail sont comptés comme
tels dans les statistiques. La cible de cette décision est le fort zoom, pas les téléphones.

## Options envisagées

1. Barre latérale repliable (rail d'icônes) — **rejeté** : disproportionné pour les
   utilisateurs, et un rail replié rognerait le bloc-marque (interdit).
2. Empiler la barre latérale au-dessus du contenu (comportement précédent) — respecte la
   redistribution, mais à 400 % de zoom les utilisateurs font défiler toute la navigation
   sur chaque page.
3. **Sous 62em, basculer sur le pattern d'en-tête mobile du DSFR** (retenu) : une barre
   avec bloc-marque + nom du service + bouton « Menu » ; le menu s'ouvre dans une modale
   contenant la même navigation et le pied « Mon espace ». Le bloc-marque est toujours
   visible, jamais rogné. Les mêmes props de `DsaasfrSidebar` pilotent les deux mises en page.

## Deux implémentations évaluées

| | A — `dsfr-header` | B — `dialog` |
|---|---|---|
| Barre | `DsfrHeader` de Vue DSFR (en-tête mobile officiel, bouton de menu à icône) | Notre barre (bloc-marque + service côte à côte, bouton texte « Menu ») |
| Modale | Modale de menu de DsfrHeader (piège à focus, Échap, retour du focus) | `<dialog>` natif + `showModal()` (page inerte, Échap, retour du focus) |
| Règle 1 « réutiliser Vue DSFR » | Réutilisation complète | Code de modale propre (réduit) |
| Rendu | DSFR pur | Plus proche de la barre latérale large |
| Risques | Dépend de la portée non typée du slot `mainnav` (`hidemodal`) ; identifiants `button-menu`/`close-button` codés en dur dans Vue DSFR | Le nom du service passe à la ligne à 320px à côté du bloc-marque ; Tab peut atteindre l'interface du navigateur (comportement natif de dialog) |

Les deux ont été vérifiées à 320px : le focus passe sur « Fermer » à l'ouverture, Échap
ferme et rend le focus à « Menu », suivre un lien ferme le menu, exactement une région
banner.

**Retenue : A** — le pattern officiel, rien à justifier auprès de la communauté DSFR, et
nous restons dans le cadre de la règle 1 (réutiliser Vue DSFR). Les utilisateurs sont
exclusivement sur poste de travail : la mise en page étroite doit seulement être correcte
et familière en fort zoom, pas soignée dans le détail. La variante B et la prop
expérimentale `narrowVariant` ont été supprimées.

## Conséquences pour l'accessibilité

- Détection du point de rupture via `matchMedia` (`useNarrowViewport`), de sorte qu'une
  seule mise en page est présente dans le DOM : ni régions ni identifiants dupliqués.
- Le panneau d'aperçu s'empile sous le contenu en dessous de 62em (à revoir lors du
  travail sur le panneau).

## Remarques à remonter à Vue DSFR

- Le slot `mainnav` de `DsfrHeader` transmet `{ hidemodal }` mais est typé sans props.
- Les boutons de groupe de `DsfrSideMenuList` reçoivent `aria-current="page"` lorsqu'ils
  sont actifs (voir 0003).
