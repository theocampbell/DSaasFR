# DsaasfrFilterDropdown

Un **groupe de filtres** dans la [barre d’outils](/composants/toolbar) : un bouton secondaire
DSFR avec son icône et le nombre de filtres actifs (« Instruction (2) »), qui ouvre un
panneau. Le contenu du panneau vient de l’emplacement par défaut ; son pied contient
« Réinitialiser » et un bouton d’application (« Afficher 12 dossiers »).

Le comportement est dans le composant (bouton, panneau, pied, Échap, focus) ; les données
restent dans votre application : le brouillon, les nombres de résultats et l’application des
filtres.

## Quand l’utiliser

- Un bouton par groupe de filtres du même thème (« Instruction », « Projet »), avec
  quelques champs à valeurs peu nombreuses.
- Pour un filtre à beaucoup de valeurs (les communes) : [DsaasfrFilterModal](/composants/filter-modal).

## Exemple

<Example story="briques-dsaasfrfilterdropdown--default" title="groupe Instruction avec le champ Statut" :height="420" />

```vue
<script setup lang="ts">
import { reactive, ref, watch } from 'vue'

const ouvert = ref(false)
const brouillon = reactive<Record<string, string[]>>({ statut: [], delai: [] })
// À l’ouverture, le brouillon repart des filtres appliqués.
watch(ouvert, (o) => { if (o) Object.assign(brouillon, filtresAppliques('instruction')) })
</script>

<template>
  <DsaasfrFilterDropdown
    v-model:open="ouvert"
    label="Instruction"
    icon="fr-icon-todo-line"
    :count="nombreDeFiltresActifs('instruction')"
    :apply-label="`Afficher ${nombreDeResultats(brouillon)} dossiers`"
    :reset-disabled="!brouillon.statut.length && !brouillon.delai.length"
    @apply="appliquer('instruction', brouillon)"
    @reset="brouillon.statut = []; brouillon.delai = []"
  >
    <DsfrCheckboxSet v-model="brouillon.statut" legend="Statut" small :options="optionsStatut" />
    <DsfrCheckboxSet v-model="brouillon.delai" legend="Délai" small :options="optionsDelai" />
  </DsaasfrFilterDropdown>
</template>
```

## API

### Props

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `label` | `string` | — (obligatoire) | Nom du groupe, par exemple « Instruction ». |
| `icon` | `string` | — | Classe d’icône DSFR du bouton, par exemple `fr-icon-todo-line`. |
| `count` | `number` | `0` | Filtres du groupe en cours, affichés sur le bouton (« Instruction (2) »). |
| `countText` | `(n) => string` | « 2 filtres actifs » | Fin du nom accessible du bouton quand `count` > 0. |
| `applyLabel` | `string` | `'Appliquer'` | Bouton d’application, en général avec le nombre de résultats. |
| `resetLabel` | `string` | `'Réinitialiser'` | Bouton qui vide le brouillon. |
| `resetDisabled` | `boolean` | `false` | Désactive « Réinitialiser » (rien de coché). |
| `placement` | `'bottom-start' \| 'bottom-end'` | `'bottom-end'` | Ouverture du panneau. |
| `id` | `string` | généré | Identifiant de base (`aria-controls`). |

### v-model

| Nom | Type | Description |
|---|---|---|
| `v-model:open` | `boolean` | Panneau ouvert. Quand il passe à `true`, repartez des filtres appliqués pour le brouillon. |

### Emplacement et événements

| Nom | Description |
|---|---|
| emplacement par défaut | Le contenu du panneau : un `DsfrCheckboxSet` par champ, par exemple. |
| `apply` | « Afficher… » : appliquez le brouillon. Le panneau se ferme et le focus revient au bouton. |
| `reset` | « Réinitialiser » : videz le brouillon. |

Méthode exposée : `focus()` place le focus sur le bouton.

## Accessibilité

- Bouton de divulgation (`aria-expanded`, `aria-controls`) ; nom accessible « Instruction
  (2), 2 filtres actifs », qui commence par le texte visible.
- À l’ouverture, le focus va dans le panneau (sur la première valeur cochée, sinon le premier
  contrôle). Échap, un clic en dehors ou Tab hors du panneau ferment sans appliquer.
- Après « Afficher… », le panneau se ferme et le focus revient au bouton.
- Seul le contenu du panneau défile : le pied ne cache jamais le contrôle qui a le focus.

## Voir aussi

- [DsaasfrFilterModal](/composants/filter-modal), [DsaasfrSelectedFilters](/composants/selected-filters)
- [Recette : filtres d’une liste](/recettes/filtres), [fiche de décision 0009](/decisions/0009-filters)
