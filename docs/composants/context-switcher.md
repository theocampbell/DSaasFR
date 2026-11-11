# DsaasfrContextSwitcher

Le **sélecteur de contexte** montre le contexte dans lequel toute l’application travaille (un
département, une organisation…) et permet d’en changer. Il se place sous le nom du service,
dans l’emplacement `context` de [DsaasfrSidebar](/composants/sidebar).

Il reprend le modèle du **sélecteur de langue du DSFR** : un bouton qui montre la valeur
courante et ouvre une liste de liens, le lien courant marqué.

## Quand l’utiliser

- Quand le même agent travaille dans plusieurs contextes (plusieurs départements,
  l’administration nationale dans tous) et que ce contexte change tout ce que montre
  l’application.
- Pas pour un critère d’une liste : c’est un filtre ([DsaasfrFilterChip](/composants/filter-chip)).
- Pas pour un réglage du compte : c’est le [menu utilisateur](/composants/user-menu).

## Exemple

<Example story="shell-dsaasfrcontextswitcher--with-more-link" title="département courant, autres départements et lien vers tous les départements" :height="340" />

```vue
<DsaasfrSidebar service-title="Démarches Pro" :items="items">
  <template #context>
    <DsaasfrContextSwitcher
      label="Département"
      current="Gironde (33)"
      :items="[
        { text: 'Gironde (33)', to: '/33/dossiers', current: true },
        { text: 'Landes (40)', to: '/40/dossiers' },
      ]"
      :more-link="{ text: 'Tous les départements', to: '/departements' }"
    />
  </template>
  <template #footer>…</template>
</DsaasfrSidebar>
```

### Beaucoup de choix

Le panneau ne contient pas de champ de recherche. Pour l’administration nationale (101
départements) :

- montrez dans le panneau ceux qui servent le plus (récents, rattachements), éventuellement
  par région avec `groups` ;
- ajoutez `moreLink` vers une **page** qui les liste tous, par région.

<Example story="shell-dsaasfrcontextswitcher--grouped" title="départements regroupés par région" :height="360" />

### Ce que fait votre application

- **Où vit le contexte** : dans le chemin (`/33/dossiers`), un paramètre ou la session. Chaque
  choix est un lien vers la même page dans l’autre contexte.
- **Ce que le changement réinitialise** : par exemple le filtre Commune (les communes
  appartiennent à un département) et l’aperçu.
- **Les recherches enregistrées** contiennent le département : en ouvrir une change de
  département si besoin.
- L’emplacement `context` est rendu deux fois (barre latérale et menu mobile) : ne passez pas
  d’`id` fixe au sélecteur.

## API

### Props

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `label` | `string` | — (obligatoire) | Ce qui est choisi, par exemple « Département » (première ligne du bouton). |
| `current` | `string` | — (obligatoire) | Le contexte courant, par exemple « Gironde (33) » (seconde ligne). |
| `items` | `{ text, to \| href, current? }[]` | `[]` | Les choix, en liens (`to` ou `href` obligatoire). |
| `groups` | `{ title, items }[]` | `[]` | Des choix sous des titres (par région), après `items`. |
| `moreLink` | `{ text, to \| href }` | — | Lien vers une page qui liste tous les choix. |
| `listLabel` | `string` | `'Choisir : {label}'` | Nom accessible de la liste des choix, par exemple « Changer de département ». |
| `placement` | `'top' \| 'bottom'` | `'bottom'` | Ouverture du panneau par rapport au bouton. |
| `id` | `string` | généré | Identifiant de base (`aria-controls`). |

### v-model

| Nom | Type | Défaut | Description |
|---|---|---|---|
| `v-model:open` | `boolean` | `false` | Panneau ouvert. |

### Événements

| Nom | Charge utile | Description |
|---|---|---|
| `select` | `DsaasfrContextSwitcherItem` | Émis au choix d’un lien, avant la navigation. |

## Accessibilité

- Bouton de divulgation nommé « Département : Gironde (33) » (le texte visible, séparé).
- Des liens : changer de contexte est une action explicite (RGAA 7.4). Le choix courant porte
  `aria-current="true"`, un repère bleu et de la graisse (pas la couleur seule).
- À l’ouverture, le focus va sur le choix courant ; Échap, clic en dehors et Tab ferment.
- Après un choix, le focus revient au bouton, qui annonce la nouvelle valeur.
- **À votre charge** : annoncer ce que le changement a réinitialisé (zone `role="status"`
  présente dès le chargement, par exemple « Département : Landes (40). Filtre Commune
  retiré. ») et mettre le département dans le titre de la page.
- Sur écran étroit, il est en haut du menu, avant la navigation.

## Voir aussi

- [Fiche de décision 0011](/decisions/0011-context-switcher)
- [DsaasfrSidebar](/composants/sidebar), [DsaasfrUserMenu](/composants/user-menu)
