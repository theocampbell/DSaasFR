# DsaasfrSidebar

La **barre latérale d’application**. Elle remplace l’en-tête DSFR : le bloc-marque et le nom
du service en haut, la navigation principale en dessous, et un pied pour le compte et les
réglages. Elle déduit la page active de la route.

## Quand l’utiliser

- Dans l’emplacement `sidebar` de [DsaasfrAppShell](/composants/app-shell), pour la
  navigation principale de l’application.
- Pour une navigation secondaire courte (quelques pages d’administration) : sous forme de
  groupe, qui s’ouvre quand il contient la page courante.
- Pas pour une navigation à l’intérieur d’une page (sommaire, rubriques) : utilisez
  `DsfrSideMenu` de Vue DSFR dans le contenu.
- Pas avec `DsfrHeader` sur la même page : le bloc-marque serait affiché deux fois.

## Exemple

<Example story="shell-dsaasfrsidebar--default" title="bloc-marque, nom du service, baseline et navigation, page Dossiers active" :height="560" />

```vue
<script setup lang="ts">
import type { DsaasfrSidebarItem } from '@dsaasfr/vue'

const nav: DsaasfrSidebarItem[] = [
  { text: 'Tableau de bord', to: '/' },
  { text: 'Dossiers', to: '/dossiers' },
  { text: 'Usagers', to: '/usagers' },
  { text: 'Statistiques', to: '/statistiques' },
  {
    text: 'Administration',
    menuItems: [
      { text: 'Agents', to: '/admin/agents' },
      { text: 'Démarches', to: '/admin/demarches' },
      { text: 'Paramètres', to: '/admin/parametres' },
    ],
  },
]
</script>

<template>
  <DsaasfrSidebar
    service-title="Démarches Pro"
    service-description="Back-office instructeurs"
    :items="nav"
  />
</template>
```

La page active est déduite de la route courante, par préfixe : sur `/dossiers/D-2026-2041`,
l’entrée « Dossiers » est active. L’entrée `/` n’est active que sur `/`. Pour forcer un état,
utilisez `active` sur l’entrée.

### Page active dans un groupe

<Example story="shell-dsaasfrsidebar--active-in-group" title="groupe Administration ouvert, page Démarches active" :height="560" />

Une entrée avec `menuItems` devient un groupe repliable. Il s’ouvre automatiquement quand il
contient la page courante. Le groupe lui-même n’a pas de destination : sa propriété `to` est
ignorée.

```ts
{
  text: 'Administration',
  menuItems: [
    { text: 'Agents', to: '/admin/agents' },
    { text: 'Démarches', to: '/admin/demarches' },
  ],
}
```

### Sans baseline

<Example story="shell-dsaasfrsidebar--without-baseline" title="nom du service seul sous le bloc-marque" :height="480" />

```vue
<DsaasfrSidebar service-title="Démarches Pro" :items="nav" />
```

### Avec le menu utilisateur

L’emplacement `footer` accueille la personne connectée et les réglages, en général
[DsaasfrUserMenu](/composants/user-menu).

```vue
<DsaasfrSidebar service-title="Démarches Pro" :items="nav">
  <template #footer>
    <DsaasfrUserMenu name="Camille Martin" description="Instructrice · DDT 33" :items="account" />
  </template>
</DsaasfrSidebar>
```

### Sur écran étroit

Sous 62em (fenêtre étroite ou zoom fort), la barre latérale devient l’en-tête mobile du DSFR,
rendu par `DsfrHeader` : bloc-marque, nom du service et bouton « Menu ». Le menu s’ouvre dans
une modale qui contient la même navigation et le même pied. Suivre un lien ferme le menu.
Les mêmes props pilotent les deux mises en page ; pour voir ce rendu, zoomez à 400 %.

## API

### Props

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `serviceTitle` | `string` | — (obligatoire) | Nom du service, sous le bloc-marque. C’est un lien vers l’accueil. |
| `serviceDescription` | `string` | — | Baseline facultative sous le nom du service. |
| `logoText` | `string \| string[]` | `['République', 'Française']` | Texte du bloc-marque, une entrée par ligne. |
| `homeTo` | `RouteLocationRaw` | `'/'` | Destination du lien d’accueil. |
| `items` | `DsaasfrSidebarItem[]` | `[]` | Entrées de la navigation principale. Ignorées si l’emplacement par défaut est utilisé. |
| `navLabel` | `string` | `'Navigation principale'` | Nom accessible de la région de navigation. |
| `footerLabel` | `string` | `'Mon espace'` | Nom accessible de la région du pied. |
| `menuLabel` | `string` | `'Menu'` | Libellé du bouton qui ouvre le menu sur écran étroit. |
| `closeMenuLabel` | `string` | `'Fermer'` | Libellé du bouton qui ferme le menu sur écran étroit. |
| `id` | `string` | `'dsaasfr-sidebar'` | Identifiant de base, pour les identifiants générés. |

`DsaasfrSidebarItem` :

| Nom | Type | Description |
|---|---|---|
| `text` | `string` | Libellé visible. |
| `to` | `RouteLocationRaw` | Destination. Les routes internes utilisent `RouterLink` ; les URL qui commencent par `http` un lien `<a>`. Ignorée sur les groupes. |
| `active` | `boolean` | Force l’état actif. Sinon, il est déduit de la route. |
| `expanded` | `boolean` | Force l’ouverture d’un groupe. Sinon, le groupe s’ouvre s’il contient la page active. |
| `id` | `string` | Identifiant de la liste repliable d’un groupe (généré sinon). |
| `menuItems` | `DsaasfrSidebarItem[]` | Sous-entrées : transforment l’entrée en groupe. |

### Emplacements (slots)

| Nom | Description |
|---|---|
| `footer` | Pied de la barre latérale : compte, réglages, paramètres d’affichage. Exposé comme une région nommée par `footerLabel`. |
| _par défaut_ | Remplace la liste générée à partir de `items`, à l’intérieur du `<nav>`. Réservé aux cas que `items` ne couvre pas. |
| `brand` | Remplace le bloc-marque et le nom du service, sur grand écran uniquement. Le contenu doit garder le bloc-marque officiel et contenir **exactement un lien** (le bloc entier est cliquable). |

::: warning Emplacement `brand`
Sur écran étroit, l’en-tête mobile est construit à partir des props (`logoText`,
`serviceTitle`, `serviceDescription`) : le contenu de l’emplacement `brand` n’y est pas
utilisé. Renseignez donc toujours ces props.
:::

## Accessibilité

- Le haut de la barre est un `<header>` (région `banner`) avec le bloc-marque officiel
  (`DsfrLogo`, variante petite, non modifiée). Une seule région `banner` par page : n’ajoutez
  pas `DsfrHeader`.
- Le nom du service est un lien vers l’accueil, avec le `title` prévu par le DSFR
  (« Accueil - Démarches Pro - République Française »).
- La navigation est un `<nav>` nommé « Navigation principale », rendu par `DsfrSideMenuList`.
- `aria-current="page"` est placé sur un seul lien. Les boutons de groupe reçoivent
  `aria-expanded` et `aria-controls`, mais jamais d’état actif : Vue DSFR leur ajouterait
  `aria-current="page"` et la page annoncerait deux pages courantes.
- Le pied est une région nommée « Mon espace ».
- Sur écran étroit, le menu est la modale de `DsfrHeader` : focus piégé, Échap la ferme et rend
  le focus au bouton « Menu ». Une seule mise en page est présente dans le DOM à la fois : pas
  de région ni d’identifiant en double.
- Le lien d’évitement « Menu » de `DsaasfrAppShell` mène à la barre latérale.

## Voir aussi

- [Fiche de décision 0003](/decisions/0003-brand-in-sidebar) (bloc-marque dans la barre
  latérale), [0004](/decisions/0004-narrow-screens) (écrans étroits et zoom)
- [Recette : navigation selon les rôles](/recettes/roles)
- [DsaasfrAppShell](/composants/app-shell), [DsaasfrUserMenu](/composants/user-menu)
