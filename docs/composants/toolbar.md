# DsaasfrToolbar

La **barre d’outils** est la seconde ligne de la mise en page, sous le fil d’Ariane. C’est un
conteneur générique : vous y placez ce que vous voulez à gauche (`start`) et à droite (`end`).

## Quand l’utiliser

- Au-dessus d’une liste : nombre de résultats et filtres actifs à gauche, « Filtrer »,
  « Exporter » ou les options d’affichage à droite.
- Uniquement quand la page en a besoin : sans barre d’outils, la ligne n’est pas affichée.

L’action principale de la page (bouton primaire) va dans le [fil d’Ariane](./breadcrumb-bar),
pas ici : la barre d’outils utilise des boutons secondaires ou tertiaires.

## Exemple

<Example story="shell-dsaasfrtoolbar--start-and-end" title="nombre de résultats à gauche, Filtrer et Exporter à droite" :height="140" />

```vue
<DsaasfrToolbar label="Filtres et actions de la liste">
  <template #start>
    <p class="fr-text--sm fr-mb-0">40 dossiers</p>
  </template>
  <template #end>
    <DsfrButton label="Filtrer" icon="fr-icon-filter-line" secondary size="sm" />
    <DsfrButton label="Exporter" icon="fr-icon-download-line" tertiary size="sm" />
  </template>
</DsaasfrToolbar>
```

Dans la mise en page, placez-la dans l’emplacement `toolbar` de
[DsaasfrAppShell](./app-shell) :

```vue
<DsaasfrAppShell>
  <template #toolbar>
    <DsaasfrToolbar label="Filtres et actions de la liste">…</DsaasfrToolbar>
  </template>
  …
</DsaasfrAppShell>
```

### Seulement à droite

<Example story="shell-dsaasfrtoolbar--end-only" title="un seul bouton à droite" :height="120" />

```vue
<DsaasfrToolbar>
  <template #end>
    <DsfrButton label="Filtrer" icon="fr-icon-filter-line" secondary size="sm" />
  </template>
</DsaasfrToolbar>
```

## API

### Props

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `label` | `string` | — | Nom accessible. Avec un nom, la barre est exposée comme un groupe nommé (`role="group"`) ; sans nom, c’est une simple mise en page. |

### Emplacements (slots)

| Nom | Description |
|---|---|
| `start` | Contenu aligné à gauche (nombre de résultats, filtres actifs, choix de vue…). |
| `end` | Contenu aligné à droite (déclencheurs, boutons d’action). |

## Accessibilité

- Volontairement **pas `role="toolbar"`** : ce motif ARIA impose un seul arrêt de tabulation et
  une navigation aux flèches, adaptés à une rangée d’icônes mais pas à un contenu mixte
  (étiquettes de filtre, menus, texte). Chaque contrôle reste dans l’ordre de tabulation normal.
- L’ordre de lecture suit l’ordre visuel : `start` puis `end`.
- Sur écran étroit ou à fort zoom, les éléments passent à la ligne d’un bloc (jamais de libellé
  coupé, jamais de défilement horizontal).

## Voir aussi

- [Fiche de décision 0007](/decisions/0007-toolbar)
- [Recette : filtres d’une liste](/recettes/filtres)
- [DsaasfrSelectedFilters](./selected-filters), [DsaasfrDropdown](./dropdown)
