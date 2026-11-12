# DsaasfrSelectedFilters

Les **filtres sélectionnés** montrent la recherche en cours au-dessus d’une liste de
résultats : un **tag supprimable** DSFR par filtre (« Commune : Pessac et 1 autre × »), le
texte recherché compris, et « Tout effacer ». Un emplacement accueille le nombre de
résultats.

Pas de condition, pas de modification sur place : pour changer un filtre, on revient à son
bouton dans la [barre d’outils](/composants/toolbar) ; le tag sert seulement à le retirer.

## Quand l’utiliser

- Au-dessus des résultats d’une liste filtrée, quand les commandes de recherche sont dans la
  barre d’outils (un bouton par groupe de filtres).
- Pas dans la barre d’outils elle-même : la ligne déborderait dès quelques filtres.

## Exemple

<Example story="briques-dsaasfrselectedfilters--with-count" title="nombre de résultats et trois filtres supprimables" :height="140" />

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { DsaasfrSelectedFilter } from '@dsaasfr/vue'

const filtresEnCours = computed<DsaasfrSelectedFilter[]>(() => [
  ...(texte.value ? [{ key: 'recherche', label: 'Recherche', values: [`« ${texte.value} »`] }] : []),
  ...appliques.value.map(f => ({ key: f.champ, label: libelle(f.champ), values: f.valeurs })),
])
</script>

<template>
  <DsaasfrSelectedFilters
    :items="filtresEnCours"
    @remove="retirer"
    @clear="toutEffacer"
    @empty="focusRecherche"
  >
    <p class="fr-text--sm fr-mb-0" role="status">{{ nombreDeResultats }}</p>
  </DsaasfrSelectedFilters>
</template>
```

## API

### Props

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `items` | `{ key, label, values }[]` | — (obligatoire) | Les filtres en cours, un tag chacun. |
| `maxVisibleValues` | `number` | `1` | Valeurs affichées au plus dans un tag avant le résumé (« Pessac et 49 autres »). |
| `maxValuesLength` | `number` | `32` | Caractères que peuvent occuper les valeurs affichées avant le résumé. |
| `listLabel` | `string` | `'Filtres sélectionnés'` | Nom accessible du groupe des tags. |
| `removeLabel` | `string` | `'Retirer le filtre'` | Début du nom accessible de chaque tag, avant son texte visible. |
| `clearText` | `string` | `'Tout effacer'` | Bouton qui retire tous les filtres, affiché à partir de deux. |
| `align` | `'start' \| 'end'` | `'start'` | `end` : aligné à droite, sous les boutons de filtres. |

### Emplacement (slot)

| Nom | Description |
|---|---|
| `default` | Avant les tags : par exemple le nombre de résultats, en `role="status"`. |

### Événements

| Nom | Charge utile | Description |
|---|---|---|
| `remove` | `key` | Retrait d’un filtre. À l’application de le retirer. |
| `clear` | — | « Tout effacer ». |
| `empty` | — | Plus aucun tag après ce retrait (ou « Tout effacer ») : placez le focus après le prochain rendu (`nextTick`), par exemple sur le bouton du groupe du filtre retiré. Émis tout de suite, même si l’application retire ensuite le composant. |

## Accessibilité

- Balisage officiel d’un groupe de petits tags supprimables DSFR (`fr-tags-group--sm`,
  `fr-tag--dismiss`) ; Vue DSFR n’a pas de variante supprimable de `DsfrTag`. Les tags et
  « Tout effacer » forment un groupe nommé (« Filtres sélectionnés »), annoncé à l’entrée du
  focus.
- Chaque tag est un bouton nommé « Retirer le filtre » + son texte visible (« Retirer le
  filtre Commune : Pessac et 1 autre ») : la commande vocale fonctionne avec ce qu’on voit
  (RGAA 7.1.3, accessibilité du tag DSFR). Quand des valeurs sont résumées, leur liste (au
  plus 10) est la description du bouton.
- Après un retrait, le focus passe au tag suivant, ou au précédent. Quand il n’en reste
  aucun, `empty` permet à l’application de placer le focus.
- Le nombre de résultats est annoncé par la zone `role="status"` fournie dans l’emplacement.
- Sur écran étroit, les tags passent à la ligne ; une valeur longue revient à la ligne dans
  son tag.

## Voir aussi

- [Fiche de décision 0009](/decisions/0009-filters)
- [Recette : filtres d’une liste](/recettes/filtres)
