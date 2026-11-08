# usePreviewQuery

Garde l’élément affiché dans le panneau d’aperçu dans un paramètre de l’URL
(`?apercu=D-2026-2041`). L’aperçu peut ainsi être partagé par un lien ou rechargé, et le
bouton Retour du navigateur le ferme.

::: tip Précédent / suivant
`open(id, { replace: true })` change d’élément sans ajouter d’entrée à l’historique : « Retour » ferme toujours l’aperçu au lieu de reparcourir les éléments vus.
:::

## Signature

```ts
import { usePreviewQuery } from '@dsaasfr/vue'

function usePreviewQuery(key?: string): {
  item: ComputedRef<string | undefined>
  isOpen: WritableComputedRef<boolean>
  open: (id: string) => void
  close: () => void
}
```

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `key` | `string` | `'apercu'` | Nom du paramètre de l’URL. |

| Retour | Type | Description |
|---|---|---|
| `item` | `ComputedRef<string \| undefined>` | Identifiant lu dans l’URL, ou `undefined` si le paramètre est absent ou vide. |
| `isOpen` | `WritableComputedRef<boolean>` | `true` si un élément est dans l’URL. Écrire `false` ferme l’aperçu. À lier à `v-model:preview-open`. |
| `open(id, { replace? })` | `(id: string) => void` | Ouvre l’aperçu de l’élément `id`. Sans effet si cet élément est déjà affiché. |
| `close()` | `() => void` | Ferme l’aperçu. Sans effet s’il est déjà fermé. |

Les autres paramètres de l’URL (filtres, page, tri) sont conservés.

## Le bouton Retour

- `open(id)` **ajoute** une entrée à l’historique (`router.push`). Retour ferme donc l’aperçu
  et revient à la liste telle qu’elle était.
- `close()` **remplace** l’entrée courante (`router.replace`). Après une fermeture, Retour
  mène à la page précédente, pas à l’aperçu qui vient d’être fermé.
- Passer d’un élément à l’autre (`open` avec un autre identifiant) ajoute une entrée à chaque
  fois : Retour réaffiche l’élément précédent.
- Un lien partagé qui contient `?apercu=…` ouvre l’aperçu au chargement. Le focus reste alors
  en début de page.

## Exemple

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { usePreviewQuery } from '@dsaasfr/vue'
import { useDossiers } from '@/stores/dossiers' // données de votre application

const preview = usePreviewQuery()
const dossiers = useDossiers()
const previewed = computed(() => dossiers.parNumero(preview.item.value))
</script>

<template>
  <DsaasfrAppShell v-model:preview-open="preview.isOpen.value">
    <!-- … -->

    <DsfrButton
      label="Aperçu du dossier D-2026-2041"
      icon="fr-icon-eye-line"
      icon-only
      tertiary
      no-outline
      size="sm"
      @click="preview.open('D-2026-2041')"
    />

    <template v-if="previewed" #preview>
      <DsaasfrPreviewPanel :title="`Dossier ${previewed.numero}`" :description="previewed.type">
        …
      </DsaasfrPreviewPanel>
    </template>
  </DsaasfrAppShell>
</template>
```

Deux points :

- `preview` est un objet qui contient des refs : dans le template, écrivez
  `preview.isOpen.value` (Vue ne déballe automatiquement que les refs de premier niveau). Vous
  pouvez aussi déstructurer : `const { item, isOpen, open } = usePreviewQuery()`, puis
  `v-model:preview-open="isOpen"`.
- Conditionnez l’emplacement `preview` à l’élément trouvé (`v-if="previewed"`). Si
  l’identifiant de l’URL ne correspond à rien (élément supprimé, lien ancien), le panneau ne
  s’affiche pas.

La recette [Aperçu lié à l’URL](/recettes/apercu) montre l’ensemble : boutons par ligne,
contenu du panneau, focus.

## Plusieurs aperçus

Un seul aperçu est affiché à la fois. Pour distinguer des types d’éléments (dossiers et
pièces), encodez-les dans l’identifiant, comme le bac à sable (`D-2026-2041` pour un dossier,
`D-2026-2041/2` pour une pièce), ou utilisez une autre clé sur une autre page :
`usePreviewQuery('piece')`.

## Voir aussi

- [Fiche de décision 0008](/decisions/0008-preview-panel)
- [DsaasfrPreviewPanel](/composants/preview-panel), [DsaasfrAppShell](/composants/app-shell)
- [Recette : aperçu lié à l’URL](/recettes/apercu)
