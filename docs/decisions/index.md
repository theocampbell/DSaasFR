# Fiches de décision

Le DSFR est pensé d’abord pour les sites publics. Quand une application métier a besoin d’un
motif que le DSFR ne prévoit pas, ou d’une adaptation, DSaaSFR le documente dans une
**fiche de décision** : le point de départ DSFR, le besoin, les options envisagées, le choix
fait et ses conséquences pour l’accessibilité.

Elles restent au statut **« Proposé »** tant qu’elles n’ont pas été discutées. Vos retours
sont les bienvenus, dans un [ticket](https://github.com/theocampbell/DSaasFR/issues) ou une
discussion.

| N° | Décision | Composants |
|---|---|---|
| [0001](./0001-build-on-vue-dsfr) | Construire sur Vue DSFR, l’étendre plutôt que le remplacer | tous |
| [0002](./0002-app-shell-layout) | Mise en page applicative | DsaasfrAppShell |
| [0003](./0003-brand-in-sidebar) | Bloc-marque en haut de la barre latérale, sans en-tête DSFR | DsaasfrSidebar |
| [0004](./0004-narrow-screens) | Écrans étroits et fort zoom : en-tête mobile du DSFR | DsaasfrSidebar, DsaasfrAppShell |
| [0005](./0005-user-menu) | Menu utilisateur dans le pied de la barre latérale | DsaasfrUserMenu |
| [0006](./0006-breadcrumb-bar) | Fil d’Ariane piloté par le routeur et action principale | DsaasfrBreadcrumbBar |
| [0007](./0007-toolbar) | Barre d’outils générique | DsaasfrToolbar |
| [0008](./0008-preview-panel) | Panneau d’aperçu | DsaasfrPreviewPanel |
| [0009](./0009-filters) | Filtres : menu déroulant et étiquettes, logique dans l’application | DsaasfrDropdown, DsaasfrFilterChip |

Pour proposer une nouvelle fiche, partez du [modèle](./0000-template).
