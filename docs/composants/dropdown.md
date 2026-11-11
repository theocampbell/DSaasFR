# DsaasfrDropdown

Le **menu déroulant** est un bouton qui ouvre un panneau flottant. Il gère l’ouverture, la
fermeture, le focus et la position du panneau. Vous fournissez le texte du bouton et le
contenu du panneau : une liste de boutons, des cases à cocher, un petit formulaire.

C’est la brique commune du [menu utilisateur](/composants/user-menu), des
[étiquettes de filtre](/composants/filter-chip) et du déclencheur « Filtrer ».

## Quand l’utiliser

- Pour un déclencheur de la barre d’outils qui ouvre des choix : « Filtrer », options
  d’affichage.
- Pour un panneau court, lié à un seul bouton, qui se ferme dès que l’on en sort.
- Pas pour une navigation de site : utilisez `DsfrNavigation`.
- Pas pour un choix unique dans un formulaire : utilisez `DsfrSelect`.
- Pas pour un contenu qui demande une confirmation ou bloque la page : utilisez `DsfrModal`.

## Exemple

<Example story="briques-dsaasfrdropdown--field-list" title="bouton Filtrer qui ouvre la liste des champs" :height="300" />

```vue
<DsaasfrDropdown
  autofocus
  trigger-class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-filter-line"
>
  <template #trigger>Filtrer</template>

  <template #default="{ close }">
    <ul aria-label="Ajouter un filtre" class="fr-raw-list">
      <li v-for="champ in ['Statut', 'Type', 'Commune']" :key="champ">
        <button
          type="button"
          class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm"
          @click="ajouterFiltre(champ); close(true)"
        >
          {{ champ }}
        </button>
      </li>
    </ul>
  </template>
</DsaasfrDropdown>
```

Le bouton déclencheur est rendu par le composant. Donnez-lui son apparence avec
`trigger-class` (classes de bouton DSFR) et son texte avec l’emplacement `trigger`.

### Avec un pied fixé

L’emplacement `footer` reste visible en bas du panneau quand son contenu défile : seul le
contenu défile, le pied est en dessous et ne masque jamais l’élément qui a le focus. Il sert
aux boutons « Réinitialiser » et « Appliquer » d’un panneau de filtres.

```vue
<DsaasfrDropdown
  v-model:open="panelOpen"
  placement="bottom-end"
  autofocus
  trigger-class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-filter-line"
>
  <template #trigger>Filtrer</template>

  <template #default>
    <div class="fr-px-2w fr-pt-1w">
      <DsfrCheckboxSet v-model="statuts" legend="Statut" small :options="optionsStatut" />
    </div>
  </template>

  <template #footer="{ close }">
    <DsfrButton label="Réinitialiser" tertiary no-outline size="sm" @click="statuts = []" />
    <DsfrButton label="Afficher 16 dossiers" size="sm" @click="appliquer(); close(true)" />
  </template>
</DsaasfrDropdown>
```

La recette [Filtres d’une liste](/recettes/filtres) montre ce panneau en entier.

### Position du panneau

`placement` fixe le côté d’ouverture et l’alignement : `bottom-start` (défaut),
`bottom-end` (pour un bouton aligné à droite), `top-start`, `top-end`. Les variantes
`top-stretch` et `bottom-stretch` donnent au panneau la largeur du conteneur du bouton (menu
utilisateur dans la barre latérale).

Tant qu’il est ouvert, le panneau reste dans la fenêtre : il est décalé horizontalement s’il
déborde, sa hauteur est limitée à l’espace disponible (son contenu défile, même s’il grandit
après l’ouverture), et il ne passe de l’autre côté du bouton que si le côté demandé est trop
exigu (moins de 12rem). Si aucun côté n’offre 12rem (fort zoom sur une fenêtre basse), la
hauteur n’est pas limitée : le panneau s’allonge et la page défile, plutôt que de ne montrer
que le pied.

## API

### Props

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `placement` | `'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end' \| 'top-stretch' \| 'bottom-stretch'` | `'bottom-start'` | Côté d’ouverture du panneau. `*-stretch` prend la largeur du conteneur du bouton. |
| `triggerClass` | `string \| string[] \| Record<string, boolean>` | — | Classes du bouton déclencheur (par exemple des classes de bouton DSFR). |
| `triggerLabel` | `string` | — | Nom accessible du bouton, quand son contenu visible ne suffit pas. Il doit contenir le texte visible. |
| `triggerTitle` | `string` | — | Infobulle du bouton (par exemple le texte complet d’un libellé raccourci). |
| `autofocus` | `boolean` | `false` | À l’ouverture, place le focus dans le panneau : sur l’élément marqué `data-autofocus` (par exemple un champ de recherche), sinon sur le choix courant (case cochée, élément `aria-pressed` ou `aria-current`), sinon sur le premier contrôle. |
| `id` | `string` | unique | Identifiant de base. Le panneau a l’identifiant `<id>-panel`. |

### v-model

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `v-model:open` | `boolean` | `false` | Ouverture du panneau. |

### Emplacements (slots)

| Nom | Portée | Description |
|---|---|---|
| `trigger` | `{ open }` | Contenu du bouton déclencheur. |
| _par défaut_ | `{ close }` | Contenu du panneau. |
| `footer` | `{ close }` | Pied fixé en bas du panneau. |

`close(returnFocus?: boolean)` ferme le panneau. Avec `true`, le focus revient sur le bouton
déclencheur : utilisez-le après un choix fait dans le panneau.

### Événements

| Nom | Charge utile | Description |
|---|---|---|
| `update:open` | `boolean` | Émis par `v-model:open`. |

### Méthodes exposées

Par une référence de template (`ref`) :

| Nom | Description |
|---|---|
| `close(returnFocus?: boolean)` | Ferme le panneau, et rend le focus au bouton si demandé. |
| `focus()` | Donne le focus au bouton déclencheur. |

## Accessibilité

- Motif de **divulgation** : un `<button>` avec `aria-expanded` et `aria-controls`. Pas de
  `role="menu"` ni de navigation aux flèches : le contenu du panneau reste dans l’ordre de
  tabulation.
- Échap ferme le panneau et rend le focus au bouton. Un clic à l’extérieur ou une sortie du
  panneau avec Tab le ferment.
- Un clic sur un texte non focalisable du panneau ne le ferme pas.
- Le contenu du panneau doit être de vrais contrôles : groupes de cases à cocher ou de boutons
  radio avec `legend`, ou une liste nommée de boutons.
- Surface : balisage officiel du menu DSFR (`fr-menu`, `fr-menu__list`), avec son fond, son
  ombre et son contour en mode de contraste élevé, à toutes les largeurs.
- Le panneau reste dans la fenêtre, y compris à 320 px de large (RGAA 10.11).

## Voir aussi

- [Fiche de décision 0009](/decisions/0009-filters)
- [DsaasfrFilterChip](/composants/filter-chip), [DsaasfrUserMenu](/composants/user-menu)
- [Recette : filtres d’une liste](/recettes/filtres)
