# DsaasfrPreviewPanel

Le **panneau d’aperçu** affiche un élément (dossier, pièce, usager) à côté de la liste, sans
la quitter. C’est le contenu de l’emplacement `preview` de
[DsaasfrAppShell](/composants/app-shell) : un en-tête fixé avec le titre et le bouton
« Fermer », des actions et un pied facultatifs, et un corps qui défile.

## Quand l’utiliser

- Pour consulter rapidement les éléments d’une liste l’un après l’autre, en gardant la liste
  visible.
- Pour un résumé : les informations principales et un lien « Ouvrir le dossier » vers la page
  complète.
- Pas pour une tâche qui demande l’attention complète de l’utilisateur ou une confirmation :
  utilisez `DsfrModal`.
- Pas pour un formulaire long ou une page de détail complète : faites-en une page.

## Exemple

<Example story="shell-dsaasfrpreviewpanel--case-file" title="aperçu d’un dossier avec un lien Ouvrir le dossier" :height="420" />

```vue
<DsaasfrAppShell v-model:preview-open="preview">
  …
  <template #preview>
    <DsaasfrPreviewPanel title="Dossier D-2026-2041" description="Permis de construire">
      <template #actions>
        <RouterLink class="fr-btn fr-btn--secondary fr-btn--sm" to="/dossiers/D-2026-2041">
          Ouvrir le dossier
        </RouterLink>
      </template>

      <dl>
        <dt class="fr-text--sm fr-text--bold fr-mb-0">Demandeur</dt>
        <dd class="fr-ml-0 fr-mb-2w">Alix Petit</dd>
        <dt class="fr-text--sm fr-text--bold fr-mb-0">Commune</dt>
        <dd class="fr-ml-0 fr-mb-2w">Pessac</dd>
        <dt class="fr-text--sm fr-text--bold fr-mb-0">Statut</dt>
        <dd class="fr-ml-0 fr-mb-2w">À instruire</dd>
      </dl>
    </DsaasfrPreviewPanel>
  </template>
</DsaasfrAppShell>
```

Dans le shell, le panneau se ferme lui-même (« Fermer », Échap) : le shell remet
`preview-open` à `false`. Vous n’avez pas besoin d’écouter `close`.

Pour garder l’élément affiché dans l’URL (lien partageable, bouton Retour qui ferme
l’aperçu), associez le shell à [usePreviewQuery](/composants/use-preview-query). Voir la
recette [Aperçu lié à l’URL](/recettes/apercu).

### Avec un pied

<Example story="shell-dsaasfrpreviewpanel--with-footer" title="aperçu d’une pièce justificative, bouton Télécharger dans le pied fixé" :height="480" />

Le pied reste visible en bas pendant que le corps défile.

```vue
<DsaasfrPreviewPanel
  title="Plan de situation du terrain et plan de masse des constructions"
  description="Pièce justificative"
>
  <!-- contenu du document -->
  <template #footer>
    <DsfrButton label="Télécharger" icon="fr-icon-download-line" secondary size="sm" />
  </template>
</DsaasfrPreviewPanel>
```

### En dehors du shell

Hors de `DsaasfrAppShell`, le panneau ne sait pas se fermer seul : écoutez `close`.

```vue
<DsaasfrPreviewPanel v-if="selected" :title="selected.titre" @close="selected = undefined">
  …
</DsaasfrPreviewPanel>
```

## Mise en page selon la largeur

La mise en page est assurée par le shell :

- **62em et plus** : le panneau est une troisième colonne fixée à droite, qui **pousse** le
  contenu. Sa largeur suit la fenêtre (entre 20 et 40rem). Rien n’est jamais recouvert : la
  liste reste utilisable et permet d’afficher l’élément suivant. Les tableaux larges défilent
  dans leur propre cadre (`fr-table`).
- **Sous 62em** (fenêtre étroite, zoom fort) : le panneau passe en **plein écran**, au-dessus
  de la page et en dessous des modales DSFR. Le reste de la page est inerte.

## Pousser la page ou flotter par-dessus

Le shell propose deux façons d’ouvrir l’aperçu, à choisir selon l’usage (`preview-mode` sur
[DsaasfrAppShell](/composants/app-shell)) :

| | `push` (défaut) | `overlay` |
|---|---|---|
| Rendu | Colonne à droite, le contenu se resserre | Panneau flottant dans la zone de la liste (sous le fil d’Ariane et la barre d’outils), sur toute la hauteur de cette zone avec une bande sombre autour, large selon `preview-size` (≈ un tiers de l’écran par défaut) ; un contenu long défile à l’intérieur |
| Page derrière | Utilisable | En pause (inerte), clic en dehors du panneau = fermer |
| Pour | Un document lu à côté de la page | Un coup d’œil à un élément sans resserrer un tableau |

<Example story="shell-dsaasfrappshell--floating-preview" title="aperçu flottant au-dessus de la liste" :height="480" :viewport="1280" />

```vue
<DsaasfrAppShell v-model:preview-open="isOpen" preview-mode="overlay">
  …
  <template #preview>
    <DsaasfrPreviewPanel
      :title="`Dossier ${id}`"
      :has-previous="index > 0"
      :has-next="index < ids.length - 1"
      previous-label="Dossier précédent"
      next-label="Dossier suivant"
      @previous="open(ids[index - 1], { replace: true })"
      @next="open(ids[index + 1], { replace: true })"
    >…</DsaasfrPreviewPanel>
  </template>
</DsaasfrAppShell>
```

En mode `overlay`, la page étant en pause, ajoutez **précédent / suivant** : l’utilisateur
parcourt la liste sans refermer l’aperçu. Le focus reste sur le bouton et le nouvel élément
est annoncé aux lecteurs d’écran.

## API

### Props

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `title` | `string` | — (obligatoire) | Titre de l’élément. Nomme la région d’aperçu et reçoit le focus à l’ouverture. |
| `titleTag` | `'h2' \| 'h3' \| 'h4'` | `'h2'` | Niveau de titre. |
| `description` | `string` | — | Ligne facultative sous le titre (type, statut…). |
| `closeText` | `string` | `'Fermer'` | Texte visible du bouton de fermeture (celui de la modale DSFR). |
| `hasPrevious` | `boolean` | — | Affiche la navigation précédent / suivant ; `false` désactive « précédent ». |
| `hasNext` | `boolean` | — | Idem pour « suivant ». |
| `previousLabel` | `string` | `'Élément précédent'` | Nom du bouton « précédent » (par exemple « Dossier précédent »). |
| `nextLabel` | `string` | `'Élément suivant'` | Nom du bouton « suivant ». |
| `closeLabel` | `string` | `'Fermer l’aperçu'` | Nom accessible du bouton de fermeture. Il doit contenir le texte visible. |

### Emplacements (slots)

| Nom | Description |
|---|---|
| _par défaut_ | Corps du panneau, qui défile. |
| `actions` | Actions sous l’en-tête (« Ouvrir le dossier »). Boutons secondaires ou tertiaires, taille `sm`. |
| `footer` | Pied fixé en bas du panneau (« Télécharger »). |

### Événements

| Nom | Charge utile | Description |
|---|---|---|
| `close` | — | Émis au clic sur « Fermer ». Dans le shell, le panneau est aussi fermé par le shell. |
| `previous` | — | Bouton « précédent » activé. |
| `next` | — | Bouton « suivant » activé. |

## Accessibilité

- Le shell rend le panneau dans un `<aside>` (région `complementary`) nommé par le titre
  (`aria-labelledby`).
- **Ouvert par l’utilisateur** : le focus passe sur le titre, qui est annoncé ; le contenu du
  panneau suit dans l’ordre de tabulation. **Ouvert au chargement de la page** (lien
  partagé) : le focus reste en début de page.
- Échap (focus dans le panneau) et « Fermer » ferment l’aperçu ; le focus revient à l’élément
  qui l’a ouvert.
- Le bouton de fermeture utilise le balisage officiel du DSFR (`fr-btn--close`), avec le texte
  « Fermer » et le nom « Fermer l’aperçu ».
- Écart à l’anneau de focus du DSFR : le titre reçoit le focus par programmation ; son anneau
  est masqué pour la souris (`:focus:not(:focus-visible)`) et conservé pour le clavier.
- Chaque bouton qui ouvre l’aperçu doit nommer son élément : « Aperçu du dossier
  D-2026-2041 », pas seulement « Aperçu ».
- En plein écran sous 62em, le reste de la page, liens d’évitement compris, est `inert`.

## Voir aussi

- [Fiche de décision 0008](/decisions/0008-preview-panel)
- [usePreviewQuery](/composants/use-preview-query), [Recette : aperçu lié à l’URL](/recettes/apercu)
- [DsaasfrAppShell](/composants/app-shell)
