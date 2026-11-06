# DsaasfrUserMenu

Le **menu utilisateur** affiche la personne connectée (nom et rôle) sous la forme d’un bouton.
Le bouton ouvre la liste des actions liées au compte : profil, préférences, paramètres
d’affichage, déconnexion.

## Quand l’utiliser

- Dans l’emplacement `footer` de [DsaasfrSidebar](/composants/sidebar), une seule fois par
  application. Il s’ouvre vers le haut par défaut.
- Pour les liens et actions qui concernent la personne ou son compte.
- Pas pour la navigation de l’application (mettez-la dans la barre latérale), ni pour des
  actions sur le contenu de la page.

## Exemple

<Example story="shell-dsaasfrusermenu--default" title="nom et rôle de la personne connectée, menu fermé" :height="420" />

```vue
<script setup lang="ts">
import type { DsaasfrUserMenuItem } from '@dsaasfr/vue'
import { ref } from 'vue'
import { useSession } from '@/stores/session' // store de votre application

const session = useSession()
const displaySettingsOpen = ref(false)

const account: DsaasfrUserMenuItem[] = [
  { text: 'Mon profil', to: '/profil', icon: 'fr-icon-user-line' },
  { text: 'Préférences', to: '/preferences', icon: 'fr-icon-settings-5-line' },
  { text: 'Notifications', to: '/notifications', icon: 'fr-icon-notification-3-line' },
  { text: 'Paramètres d’affichage', icon: 'fr-icon-theme-fill', action: () => (displaySettingsOpen.value = true) },
  { text: 'Aide', href: 'https://aide.example.gouv.fr', icon: 'fr-icon-question-line' },
  { text: 'Se déconnecter', icon: 'fr-icon-logout-box-r-line', separated: true, action: () => session.deconnecter() },
]
</script>

<template>
  <DsaasfrUserMenu
    name="Camille Martin"
    description="Instructrice · DDT 33"
    :items="account"
  />
</template>
```

Chaque entrée devient :

- un `RouterLink` si elle a `to` ;
- un lien `<a>` si elle a `href` ;
- un bouton sinon, qui appelle `action`.

Le menu se ferme après le choix d’une entrée.

### Menu ouvert

<Example story="shell-dsaasfrusermenu--open" title="liste des actions de compte, ouverte vers le haut" :height="420" />

L’ouverture est contrôlable avec `v-model:open`, par exemple pour fermer le menu depuis votre
code :

```vue
<DsaasfrUserMenu v-model:open="accountOpen" name="Camille Martin" :items="account" />
```

### Paramètres d’affichage

Le DSFR place le choix du thème dans les « Paramètres d’affichage ». Sans en-tête, ils
passent dans le menu utilisateur : l’entrée ouvre une `DsfrModal` avec des boutons radio,
reliés à `useScheme` de Vue DSFR. C’est du code d’application, repris du bac à sable :

```vue
<script setup lang="ts">
import { useScheme } from '@gouvminint/vue-dsfr'
import { ref } from 'vue'

const { scheme, setScheme } = useScheme()!
const displaySettingsOpen = ref(false)
const schemeOptions = [
  { label: 'Thème clair', value: 'light' },
  { label: 'Thème sombre', value: 'dark' },
  { label: 'Système', value: 'system', hint: 'Utilise les paramètres système.' },
]
</script>

<template>
  <DsfrModal
    :opened="displaySettingsOpen"
    title="Paramètres d’affichage"
    @close="displaySettingsOpen = false"
  >
    <DsfrRadioButtonSet
      name="fr-radios-theme"
      legend="Choisissez un thème pour personnaliser l’apparence du site."
      :model-value="scheme"
      :options="schemeOptions"
      @update:model-value="(value) => setScheme(String(value))"
    />
  </DsfrModal>
</template>
```

Placez la modale en dehors de `DsaasfrAppShell` (par exemple juste après, dans la même
mise en page).

## API

### Props

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `name` | `string` | — (obligatoire) | Nom de la personne connectée, texte du bouton. |
| `description` | `string` | — | Seconde ligne sous le nom : rôle, service… |
| `items` | `DsaasfrUserMenuItem[]` | `[]` | Entrées du menu. |
| `menuLabel` | `string` | `'Mon compte'` | Nom accessible de la liste des actions. |
| `placement` | `'top' \| 'bottom'` | `'top'` | Sens d’ouverture du panneau par rapport au bouton. |
| `id` | `string` | `'dsaasfr-user-menu'` | Identifiant de base, utilisé pour `aria-controls`. |

`DsaasfrUserMenuItem` :

| Nom | Type | Description |
|---|---|---|
| `text` | `string` | Libellé visible. |
| `to` | `RouteLocationRaw` | Route interne (`RouterLink`). |
| `href` | `string` | URL externe ou hors routeur. |
| `icon` | `string` | Classe d’icône DSFR, par exemple `fr-icon-logout-box-r-line`. |
| `action` | `() => void` | Action d’une entrée bouton (déconnexion, ouverture d’une modale). |
| `separated` | `boolean` | Trace un séparateur au-dessus de l’entrée. |

### v-model

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `v-model:open` | `boolean` | `false` | Ouverture du menu. |

### Emplacements (slots)

| Nom | Portée | Description |
|---|---|---|
| _par défaut_ | `{ close }` | Contenu ajouté à la fin de la liste. Placez-y des éléments `<li>`. `close()` ferme le menu. |

### Événements

| Nom | Charge utile | Description |
|---|---|---|
| `select` | `DsaasfrUserMenuItem` | Émis au choix d’une entrée, avant l’appel de son `action`. |
| `update:open` | `boolean` | Émis par `v-model:open`. |

## Accessibilité

- Motif de **divulgation**, comme les menus de l’en-tête DSFR : un bouton avec
  `aria-expanded` et `aria-controls`, qui affiche une liste de vrais liens et boutons.
  Volontairement **pas de `role="menu"`** : ce rôle impose une navigation aux flèches et ne
  convient pas à une liste de liens. Chaque entrée reste dans l’ordre de tabulation.
- Le nom du bouton est le nom suivi du rôle (« Camille Martin Instructrice · DDT 33 »).
- La liste est nommée « Mon compte ».
- Échap ferme le menu et rend le focus au bouton. Un clic à l’extérieur ou une sortie avec Tab
  le ferment aussi.
- La rotation du chevron est désactivée si l’utilisateur a demandé moins d’animations
  (`prefers-reduced-motion`).

## Voir aussi

- [Fiche de décision 0005](/decisions/0005-user-menu)
- [DsaasfrSidebar](/composants/sidebar), [DsaasfrDropdown](/composants/dropdown)
