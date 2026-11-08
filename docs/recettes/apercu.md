# Aperçu lié à l’URL

Cette recette montre comment afficher l’aperçu d’un élément d’une liste dans le panneau
latéral, en gardant l’élément dans l’URL. Elle reprend la page « Dossiers » du bac à sable
(`playground/src/App.vue` et `PageBody.vue`).

<Example story="shell-dsaasfrappshell--with-preview" title="liste et aperçu d’un dossier côte à côte" :height="560" :viewport="1280" />

Le résultat :

- chaque ligne du tableau a un bouton « Aperçu » ;
- l’aperçu s’ouvre à droite, la liste reste visible et utilisable ;
- l’URL contient l’élément (`/dossiers?apercu=D-2026-2041`) : le lien peut être partagé ou
  rechargé ;
- le bouton Retour du navigateur ferme l’aperçu.

| Bibliothèque DSaaSFR | Votre application |
|---|---|
| `DsaasfrAppShell` : colonne ou plein écran, région, focus, Échap | Les données de l’élément affiché |
| `DsaasfrPreviewPanel` : en-tête, « Fermer », actions, pied | Le contenu du panneau |
| `usePreviewQuery` : lecture et écriture de `?apercu=` | Les boutons « Aperçu » de chaque ligne |

## 1. Relier le shell à l’URL

Dans le composant de mise en page, `usePreviewQuery()` donne l’identifiant de l’URL et un
booléen à lier à `v-model:preview-open`. L’application cherche l’élément correspondant.

```vue
<!-- src/layouts/AppLayout.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { usePreviewQuery } from '@dsaasfr/vue'
import { useDossiers } from '@/stores/dossiers' // données de votre application

const preview = usePreviewQuery()
const dossiers = useDossiers()

/** Élément affiché, ou undefined si l’identifiant ne correspond à rien. */
const previewed = computed(() => {
  const dossier = dossiers.parNumero(preview.item.value)
  if (!dossier) return undefined
  return {
    title: `Dossier ${dossier.numero}`,
    description: dossier.type,
    link: `/dossiers/${dossier.numero}`,
    fields: [
      ['Demandeur', dossier.demandeur],
      ['Commune', dossier.commune],
      ['Statut', dossier.statut],
    ],
  }
})
</script>

<template>
  <DsaasfrAppShell v-model:preview-open="preview.isOpen.value">
    <!-- #sidebar, #breadcrumb, #toolbar… -->

    <RouterView />

    <template v-if="previewed" #preview>
      <DsaasfrPreviewPanel :title="previewed.title" :description="previewed.description">
        <template #actions>
          <RouterLink class="fr-btn fr-btn--secondary fr-btn--sm" :to="previewed.link">
            Ouvrir le dossier
          </RouterLink>
        </template>

        <dl>
          <template v-for="[label, value] in previewed.fields" :key="label">
            <dt class="fr-text--sm fr-text--bold fr-mb-0">{{ label }}</dt>
            <dd class="fr-ml-0 fr-mb-2w">{{ value }}</dd>
          </template>
        </dl>
      </DsaasfrPreviewPanel>
    </template>
  </DsaasfrAppShell>
</template>
```

L’emplacement `preview` n’est fourni que si l’élément existe (`v-if="previewed"`). Si
l’identifiant de l’URL est inconnu (dossier supprimé, ancien lien), le panneau ne s’ouvre pas.

Si les données de l’élément viennent du serveur, chargez-les quand `preview.item` change
(`watch`) et affichez le panneau avec un titre provisoire pendant le chargement.

## 2. Un bouton « Aperçu » par ligne

Dans la page de liste, chaque ligne a un bouton icône. Il appelle `open` avec l’identifiant
de la ligne. Si la page n’a pas accès au composable de la mise en page, appelez
`usePreviewQuery()` dans la page aussi : l’état est dans l’URL, les deux appels lisent la
même valeur.

```vue
<!-- src/pages/Dossiers.vue -->
<script setup lang="ts">
import { usePreviewQuery } from '@dsaasfr/vue'

defineProps<{ dossiers: { numero: string, demandeur: string, commune: string, statut: string }[] }>()
const preview = usePreviewQuery()
</script>

<template>
  <h1 class="fr-h3">Dossiers</h1>

  <div class="fr-table">
    <div class="fr-table__wrapper">
      <div class="fr-table__container">
        <div class="fr-table__content">
          <table>
            <caption>Dossiers en cours ({{ dossiers.length }})</caption>
            <thead>
              <tr>
                <th scope="col">N°</th>
                <th scope="col">Demandeur</th>
                <th scope="col">Commune</th>
                <th scope="col">Statut</th>
                <th scope="col">Aperçu</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="dossier in dossiers" :key="dossier.numero">
                <td>
                  <RouterLink class="fr-link" :to="`/dossiers/${dossier.numero}`">{{ dossier.numero }}</RouterLink>
                </td>
                <td>{{ dossier.demandeur }}</td>
                <td>{{ dossier.commune }}</td>
                <td>{{ dossier.statut }}</td>
                <td>
                  <DsfrButton
                    :label="`Aperçu du dossier ${dossier.numero}`"
                    :title="`Aperçu du dossier ${dossier.numero}`"
                    icon="fr-icon-eye-line"
                    icon-only
                    tertiary
                    no-outline
                    size="sm"
                    @click="preview.open(dossier.numero)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
```

- Le numéro du dossier reste un lien vers la page complète. L’aperçu est une action à part,
  dans sa propre colonne.
- Le bouton est **icône seule** (`icon-only`) : son `label` devient son nom accessible et son
  `title` l’infobulle. Le nom **nomme l’élément** (« Aperçu du dossier D-2026-2041 ») : dix
  boutons « Aperçu » identiques seraient indiscernables dans une liste de liens et boutons.
- Hors tableau, un bouton avec texte fonctionne aussi :
  `Aperçu<span class="fr-sr-only"> de la pièce 2</span>`.

## 3. Ce qui se passe pour le focus

Le shell gère le focus ; vous n’avez rien à écrire.

| Situation | Focus |
|---|---|
| L’utilisateur clique sur « Aperçu » | Passe sur le titre du panneau, qui est annoncé. Tab continue dans le panneau. |
| L’aperçu est ouvert par un lien partagé ou au rechargement | Reste en début de page. Le panneau est annoncé par son nom quand on l’atteint. |
| L’utilisateur clique sur « Aperçu » d’une autre ligne, panneau ouvert | Reste sur le bouton cliqué : le contenu du panneau change, le panneau ne se rouvre pas. |
| « Fermer » ou Échap dans le panneau | Revient au bouton « Aperçu » qui a ouvert le panneau. |
| Bouton Retour du navigateur | Le panneau se ferme ; si le focus était dedans, il revient au bouton d’ouverture. |

## 4. La mise en page selon la largeur

Le shell choisit la mise en page ; votre code ne change pas.

- **62em et plus** : le panneau est une troisième colonne, fixée, qui pousse la liste vers la
  gauche. Rien n’est recouvert : on peut afficher l’élément suivant sans fermer le panneau.
  Sur les écrans moyens, la liste devient étroite ; les tableaux DSFR (`fr-table`) défilent
  alors dans leur propre cadre.
- **Sous 62em** (fenêtre étroite, zoom à 400 %) : le panneau couvre tout l’écran. Le reste de
  la page est inerte : le focus ne peut pas passer derrière. « Fermer » ou Échap ramènent à la
  liste.

## Variante : plusieurs types d’éléments

Le bac à sable affiche aussi l’aperçu des pièces justificatives, avec le même paramètre.
L’identifiant encode le type : `D-2026-2041` pour un dossier, `D-2026-2041/2` pour la pièce 2.
La fonction qui calcule `previewed` reconnaît les deux formes. Une autre solution est une clé
différente par page : `usePreviewQuery('piece')`.

## Voir aussi

- [usePreviewQuery](/composants/use-preview-query), [DsaasfrPreviewPanel](/composants/preview-panel),
  [DsaasfrAppShell](/composants/app-shell)
- [Fiche de décision 0008](/decisions/0008-preview-panel)
