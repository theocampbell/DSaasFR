# DsaasfrFilterModal

Un **filtre à beaucoup de valeurs** (les communes d’un département) dans son propre bouton de
la [barre d’outils](/composants/toolbar), qui ouvre une **fenêtre modale DSFR**
(`DsfrModal`). Le bouton montre le nombre de valeurs choisies (« Communes (3) ») ; le contenu
de la modale vient de l’emplacement par défaut, en général un
[DsaasfrSearchableCheckboxSet](/composants/searchable-checkbox-set).

Le comportement est dans le composant ; les données restent dans votre application : le
brouillon, les nombres de résultats et l’application du filtre.

## Quand l’utiliser

- Un filtre aux centaines de valeurs, qui a besoin de place pour la recherche et la
  sélection.
- Pour un groupe de filtres à valeurs peu nombreuses : [DsaasfrFilterDropdown](/composants/filter-dropdown).

## Exemple

<Example story="briques-dsaasfrfiltermodal--default" title="bouton Communes et sa fenêtre modale" :height="140" />

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

const ouvert = ref(false)
const brouillon = ref<string[]>([])
watch(ouvert, (o) => { if (o) brouillon.value = [...communesAppliquees.value] })
</script>

<template>
  <DsaasfrFilterModal
    v-model:open="ouvert"
    label="Communes"
    icon="fr-icon-map-pin-2-line"
    :count="communesAppliquees.length"
    :count-text="n => `${n} communes sélectionnées`"
    :apply-label="`Afficher ${nombreDeResultats(brouillon)} dossiers`"
    @apply="appliquer('commune', brouillon)"
  >
    <DsaasfrSearchableCheckboxSet v-model="brouillon" label="Commune" :options="optionsCommune" />
  </DsaasfrFilterModal>
</template>
```

## Ce qui est intégré

- **Modale au niveau de la page** (`Teleport` vers `body`) : dans les barres fixées du shell,
  elle partagerait leur contexte d’empilement et l’en-tête DSFR des écrans étroits la
  recouvrirait.
- **Hauteur fixe** (`--dsaasfr-modal-list-height`) : la modale ne change pas de taille pendant
  la recherche ; le contenu défile à l’intérieur, avec la place de l’anneau de focus.
- **Fenêtre basse** (fort zoom, moins de 40em de haut) : plus de hauteur fixe ni de pied
  fixé, un seul défilement ; le focus n’est jamais caché sous les boutons.
- **Focus** rendu au bouton à la fermeture (« Afficher… », « Annuler », Échap).

## API

### Props

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `label` | `string` | — (obligatoire) | Nom du filtre : texte du bouton et titre de la modale. |
| `title` | `string` | `label` | Titre de la modale, s’il diffère. |
| `icon` | `string` | — | Classe d’icône DSFR du bouton. |
| `count` | `number` | `0` | Valeurs choisies, affichées sur le bouton (« Communes (3) »). |
| `countText` | `(n) => string` | « 3 sélectionnées » | Fin du nom accessible du bouton quand `count` > 0. |
| `applyLabel` | `string` | `'Appliquer'` | Bouton d’application, en général avec le nombre de résultats. |
| `cancelLabel` | `string` | `'Annuler'` | Bouton qui ferme sans appliquer. |
| `fixedHeight` | `boolean` | `true` | Hauteur fixe pour le contenu. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Largeur de la modale DSFR. |

### v-model, emplacement et événements

| Nom | Description |
|---|---|
| `v-model:open` | Modale ouverte. Quand elle passe à `true`, repartez du filtre appliqué pour le brouillon. |
| emplacement par défaut | Le contenu de la modale. |
| `apply` | Appliquez le brouillon ; la modale se ferme, le focus revient au bouton. |
| `cancel` | « Annuler », Échap ou « Fermer » : rien n’est appliqué. |

Méthode exposée : `focus()` place le focus sur le bouton.

## Accessibilité

- Bouton avec `aria-haspopup="dialog"` ; nom accessible « Communes (3), 3 communes
  sélectionnées », qui commence par le texte visible.
- Boîte de dialogue modale DSFR : titre, « Fermer », focus confiné, Échap.
- Le focus revient au bouton à la fermeture.
- Revue RGAA : modale visible à 200 % et 400 % de zoom, focus jamais caché (fiche 0010).

## Voir aussi

- [DsaasfrSearchableCheckboxSet](/composants/searchable-checkbox-set), [DsaasfrFilterDropdown](/composants/filter-dropdown)
- [Recette : filtres d’une liste](/recettes/filtres), [fiche de décision 0010](/decisions/0010-long-lists)
