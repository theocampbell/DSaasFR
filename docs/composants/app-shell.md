# DsaasfrAppShell

La **mise en page d’application**. Elle place la barre latérale, la ligne du fil d’Ariane,
la ligne de la barre d’outils, le contenu de la page et le panneau d’aperçu facultatif. Elle
gère les régions, les liens d’évitement, le défilement et le comportement à fort zoom. Le
contenu de chaque zone vient de vos emplacements (slots).

## Quand l’utiliser

- Pour toutes les pages authentifiées d’un back-office ou d’un outil interne, une seule fois,
  dans le composant d’une route parente qui contient `<RouterView />`.
- Pas pour un site public ou une démarche en ligne destinée aux usagers : gardez la mise en
  page DSFR classique (en-tête, `fr-container`, pied de page).
- Pas pour la page de connexion : placez-la en dehors de la route parente.

## Exemple

<Example story="shell-dsaasfrappshell--default" title="barre latérale, fil d’Ariane avec action principale, barre d’outils et contenu" :height="560" :viewport="1280" />

```vue
<script setup lang="ts">
import type { DsaasfrSidebarItem, DsaasfrUserMenuItem } from '@dsaasfr/vue'

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

const account: DsaasfrUserMenuItem[] = [
  { text: 'Mon profil', to: '/profil', icon: 'fr-icon-user-line' },
  { text: 'Se déconnecter', icon: 'fr-icon-logout-box-r-line', separated: true, action: () => {} },
]
</script>

<template>
  <DsaasfrAppShell>
    <template #sidebar>
      <DsaasfrSidebar
        service-title="Démarches Pro"
        service-description="Back-office instructeurs"
        :items="nav"
      >
        <template #footer>
          <DsaasfrUserMenu name="Camille Martin" description="Instructrice · DDT 33" :items="account" />
        </template>
      </DsaasfrSidebar>
    </template>

    <template #breadcrumb>
      <DsaasfrBreadcrumbBar>
        <template #actions>
          <DsfrButton label="Nouveau dossier" icon="fr-icon-add-line" size="sm" />
        </template>
      </DsaasfrBreadcrumbBar>
    </template>

    <template #toolbar>
      <DsaasfrToolbar label="Filtres et actions de la liste">
        <template #start>
          <p class="fr-text--sm fr-mb-0">40 dossiers</p>
        </template>
        <template #end>
          <DsfrButton label="Filtrer" icon="fr-icon-filter-line" secondary size="sm" />
        </template>
      </DsaasfrToolbar>
    </template>

    <RouterView />
  </DsaasfrAppShell>
</template>
```

Chaque emplacement est facultatif : sans `toolbar`, la ligne de la barre d’outils n’est pas
affichée ; sans `breadcrumb` ni `toolbar`, aucune ligne n’est fixée en haut.

### Avec le panneau d’aperçu

<Example story="shell-dsaasfrappshell--with-preview" title="panneau d’aperçu ouvert à droite du contenu" :height="560" :viewport="1280" />

Le panneau s’affiche quand `previewOpen` vaut `true` **et** que l’emplacement `preview` est
fourni. La portée des emplacements `toolbar` et `preview` donne de quoi ouvrir et fermer le
panneau.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const preview = ref(false)
</script>

<template>
  <DsaasfrAppShell v-model:preview-open="preview">
    <!-- #sidebar, #breadcrumb… -->

    <template #toolbar="{ togglePreview, previewToggleAttrs }">
      <DsaasfrToolbar label="Filtres et actions de la liste">
        <template #end>
          <DsfrButton
            label="Aperçu"
            icon="fr-icon-eye-line"
            tertiary
            size="sm"
            v-bind="previewToggleAttrs"
            @click="togglePreview"
          />
        </template>
      </DsaasfrToolbar>
    </template>

    <h1 class="fr-h3">Dossier D-2026-2041</h1>

    <template #preview>
      <DsaasfrPreviewPanel title="Dossier D-2026-2041" description="Permis de construire">
        <p>Demandeur : Alix Petit — Pessac</p>
      </DsaasfrPreviewPanel>
    </template>
  </DsaasfrAppShell>
</template>
```

Dans une vraie liste, l’élément affiché vient en général de l’URL : voir
[usePreviewQuery](/composants/use-preview-query) et la recette
[Aperçu lié à l’URL](/recettes/apercu).

### Navigation secondaire

<Example story="shell-dsaasfrappshell--secondary-navigation" title="page courante dans le groupe Administration, ouvert automatiquement" :height="560" :viewport="1280" />

La navigation secondaire est un groupe de la barre latérale (`menuItems`). Le groupe qui
contient la page courante s’ouvre seul. Voir [DsaasfrSidebar](/composants/sidebar).

### Avec un en-tête DSFR classique

L’emplacement `header` reste disponible pour une application qui garde `DsfrHeader`
au-dessus de tout, par exemple pendant une migration. N’utilisez pas en même temps
`DsaasfrSidebar` : la page aurait deux régions `banner` et deux bloc-marques.

```vue
<DsaasfrAppShell>
  <template #header>
    <DsfrHeader service-title="Démarches Pro" :logo-text="['République', 'Française']" />
  </template>
  <RouterView />
</DsaasfrAppShell>
```

## Largeur de la barre latérale

Trois tailles, sur l’échelle d’espacement du DSFR, selon la longueur des libellés de
navigation et du nom du service :

<Example story="shell-dsaasfrappshell--large-sidebar" title="barre latérale large (lg, 20rem)" :height="420" :viewport="1280" />

```vue
<DsaasfrAppShell sidebar-size="lg">…</DsaasfrAppShell>   <!-- sm : 14rem · md : 16rem (défaut) · lg : 20rem -->
```

Pour une largeur sur mesure :

```vue
<DsaasfrAppShell style="--dsaasfr-shell-sidebar-width: 18rem">…</DsaasfrAppShell>
```

La largeur est fixe (pas de poignée de redimensionnement, qui devrait être utilisable au
clavier). Sous 62em, la barre latérale devient l’en-tête mobile du DSFR et la taille ne
s’applique pas.

## API

### Props

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `sidebarSize` | `'sm' \| 'md' \| 'lg'` | — (16rem) | Largeur de la barre latérale sur grand écran : `sm` 14rem (libellés courts), `md` 16rem, `lg` 20rem (libellés ou nom de service longs). Pour une autre largeur, définissez la variable CSS `--dsaasfr-shell-sidebar-width`. |
| `previewMode` | `'push' \| 'overlay'` | `'push'` | Ouverture de l’aperçu sur grand écran : `push` en colonne à côté du contenu (la page reste utilisable), `overlay` flottant dans la zone de la liste (sous les lignes fixées, à droite de la barre latérale), remplissant cette zone avec une bande du voile autour, contenu défilant à l’intérieur ; la page est mise en pause, un clic en dehors ferme l’aperçu. Sous 62em, l’aperçu est toujours en plein écran. |
| `previewSize` | `'sm' \| 'md' \| 'lg'` | — (`md`) | Largeur de l’aperçu : `sm` (24rem au plus), `md` (≈ 35 % de l’écran), `lg` (≈ la moitié). |
| `previewLabel` | `string` | `'Aperçu'` | Nom accessible du panneau d’aperçu (région `complementary`), utilisé seulement si le contenu ne fournit pas de titre. `DsaasfrPreviewPanel` nomme la région par son propre titre. |
| `mainId` | `string` | `'dsaasfr-main'` | Identifiant de `<main>`, cible du lien d’évitement « Contenu ». Sert aussi de base aux identifiants de la barre latérale (`<mainId>-sidebar`) et de l’aperçu (`<mainId>-preview`). |
| `hideSkipLinks` | `boolean` | `false` | Masque les liens d’évitement. Uniquement si votre application affiche déjà les siens. |

### v-model

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `v-model:preview-open` | `boolean` | `false` | Ouverture du panneau d’aperçu. Le shell le passe à `false` quand l’utilisateur ferme le panneau (Échap, « Fermer »). |

### Emplacements (slots)

| Nom | Portée | Description |
|---|---|---|
| `sidebar` | — | Barre latérale, en général [DsaasfrSidebar](/composants/sidebar). Fixée sur toute la hauteur. |
| `breadcrumb` | — | Première ligne, en général [DsaasfrBreadcrumbBar](/composants/breadcrumb-bar). |
| `toolbar` | portée de l’aperçu | Seconde ligne, en général [DsaasfrToolbar](/composants/toolbar). |
| _par défaut_ | — | Contenu de la page, dans `<main>`. Commencez par le `<h1>` de la page. |
| `preview` | portée de l’aperçu | Contenu du panneau d’aperçu, en général [DsaasfrPreviewPanel](/composants/preview-panel). |
| `header` | — | En-tête au-dessus de tout (par exemple `DsfrHeader`). À ne pas combiner avec `DsaasfrSidebar`. |

Portée de l’aperçu (emplacements `toolbar` et `preview`) :

| Nom | Type | Description |
|---|---|---|
| `previewId` | `string` | Identifiant de l’`<aside>` de l’aperçu. |
| `previewOpen` | `boolean` | État d’ouverture. |
| `closePreview` | `() => void` | Ferme le panneau. |
| `togglePreview` | `() => void` | Ouvre ou ferme le panneau. |
| `previewToggleAttrs` | `{ 'aria-controls': string, 'aria-expanded': boolean }` | À répandre (`v-bind`) sur le bouton qui ouvre et ferme l’aperçu. |

### Événements

| Nom | Charge utile | Description |
|---|---|---|
| `update:previewOpen` | `boolean` | Émis par `v-model:preview-open`. |

## Comportement

- **La page défile**, pas une boîte intérieure. Les touches de défilement, la recherche dans la
  page et la restauration du défilement fonctionnent normalement. La barre latérale, les deux
  lignes du haut et l’aperçu sont fixés avec `position: sticky`.
- À chaque changement de page (chemin de la route), la page revient en haut. Un changement
  des seuls paramètres (`?apercu=…`) ne la fait pas défiler.
- Sous 62em (fenêtre étroite, zoom fort) : rien n’est fixé, la barre latérale devient l’en-tête
  mobile du DSFR, et l’aperçu ouvert passe en plein écran.

## Accessibilité

- Régions : `banner` et `navigation` (fournies par `DsaasfrSidebar`), `main`, et
  `complementary` pour l’aperçu, nommée par le titre de `DsaasfrPreviewPanel`.
- Liens d’évitement (`DsfrSkipLinks`) : « Contenu » vers `<main>`, et « Menu » vers la barre
  latérale quand l’emplacement `sidebar` est fourni.
- Les lignes du fil d’Ariane et de la barre d’outils sont dans `<main>` : leur contenu
  (« 40 dossiers ») appartient à une région, et le lien « Contenu » y mène.
- La hauteur des lignes fixées est reportée dans `scroll-padding-top` : un élément qui reçoit
  le focus n’est jamais caché dessous (WCAG 2.4.11).
- **Aperçu ouvert par l’utilisateur** : le focus passe sur le titre du panneau. **Ouvert au
  chargement** (lien partagé) : le focus reste en début de page.
- Échap (focus dans le panneau) et « Fermer » ferment l’aperçu ; le focus revient à l’élément
  qui l’a ouvert (RGAA 12.8).
- En plein écran sous 62em, le reste de la page, liens d’évitement compris, est `inert` : le
  focus ne peut pas passer derrière.
- Le bouton qui ouvre l’aperçu reçoit `aria-controls` et `aria-expanded` avec
  `previewToggleAttrs`.

## Voir aussi

- [Fiche de décision 0002](/decisions/0002-app-shell-layout) (mise en page),
  [0003](/decisions/0003-brand-in-sidebar) (bloc-marque),
  [0004](/decisions/0004-narrow-screens) (fort zoom),
  [0008](/decisions/0008-preview-panel) (aperçu)
- [Pour commencer](/guide/pour-commencer), [Intégrer dans une application](/guide/integration)
- [DsaasfrSidebar](/composants/sidebar), [DsaasfrBreadcrumbBar](/composants/breadcrumb-bar),
  [DsaasfrToolbar](/composants/toolbar), [DsaasfrPreviewPanel](/composants/preview-panel)
