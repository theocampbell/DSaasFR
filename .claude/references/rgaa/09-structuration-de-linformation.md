<!-- Generated from the official RGAA 4.1.2 (DINUM, github.com/DISIC/accessibilite.numerique.gouv.fr,
     RGAA/*.json), Licence Ouverte 2.0. Do not edit by hand: regenerate with generate.py. -->


# Thème 9 — Structuration de l’information

## Critère 9.1

Dans chaque page web, l’information est-elle structurée par l’utilisation appropriée de titres ?

### Test 9.1.1

Dans chaque page web, la hiérarchie entre les titres (balise `<hx>` ou balise possédant un attribut WAI-ARIA `role="heading"` associé à un attribut WAI-ARIA `aria-level`) est-elle pertinente ?

**Méthodologie**

1. Retrouver dans le document les titres (balise `<hx>` ou balise possédant un attribut WAI-ARIA `role="heading"` associé à un attribut WAI-ARIA `aria-level`) ;
2. Vérifier que la hiérarchie entre les titres est pertinente ;
3. Si c’est le cas, **le test est validé**.


### Test 9.1.2

Dans chaque page web, le contenu de chaque titre (balise `<hx>` ou balise possédant un attribut WAI-ARIA `role="heading"` associé à un attribut WAI-ARIA `aria-level`) est-il pertinent ?

**Méthodologie**

1. Pour chaque titre identifié au test 9.1.1, vérifier que son contenu est pertinent ;
2. Si c’est le cas pour chaque titre, **le test est validé**.


### Test 9.1.3

Dans chaque page web, chaque passage de texte constituant un titre est-il structuré à l’aide d’une balise `<hx>` ou d’une balise possédant un attribut WAI-ARIA `role="heading"` associé à un attribut WAI-ARIA `aria-level` ?

**Méthodologie**

1. Pour chaque titre identifié au test 9.1.1, vérifier que :
   - Soit il est structuré au moyen d’une balise `<hx>` (“x” désignant une valeur numérique comprise entre 1 et 6);
   - Soit il est structuré au moyen d’une balise possédant un attribut WAI-ARIA `role="heading"` et un attribut WAI-ARIA `aria-level=x` (“x” désignant une valeur numérique).
2. Si c’est le cas pour chaque titre, **le test est validé**.


**Notes techniques**

WAI-ARIA permet de définir des titres via le rôle `heading` et l’attribut `aria-level` (indication du niveau de titre). Bien qu’il soit préférable d’utiliser l’élément de titre natif en HTML `<hx>`, l’utilisation du rôle WAI-ARIA `heading` est compatible avec l’accessibilité.

**Références** — WCAG : 1.3.1 Info and Relationships (A), 2.4.1 Bypass Blocks (A), 2.4.6 Headings and Labels (AA), 4.1.2 Name, Role, Value (A) · Techniques : G115, G130, H42, G141, ARIA4, ARIA12

## Critère 9.2

Dans chaque page web, la structure du document est-elle cohérente (hors cas particuliers) ?

### Test 9.2.1

Dans chaque page web, la structure du document vérifie-t-elle ces conditions (hors cas particuliers) ?
- La zone d’en-tête de la page est structurée via une balise `<header>` ;
- Les zones de navigation principales et secondaires sont structurées via une balise `<nav>` ;
- La balise `<nav>` est réservée à la structuration des zones de navigation principales et secondaires ;
- La zone de contenu principal est structurée via une balise `<main>` ;
- La structure du document utilise une balise `<main>` visible unique ;
- La zone de pied de page est structurée via une balise `<footer>`.

**Méthodologie**

1. Vérifier que la zone d’en-tête est structurée au moyen d’un élément `<header>` ;
2. Vérifier que les zones de navigation principales et secondaires sont structurées au moyen d’un élément `<nav>` ;
3. Vérifier que l’élément `<nav>` n’est pas utilisé en dehors de la structuration des zones de navigation principales et secondaires ;
4. Vérifier que la zone de contenu principal est structurée au moyen d’un élément `<main>` ;
5. Si le document possède plusieurs éléments `<main>`, vérifier qu’un seul de ces éléments est visible (les autres occurrences de l’élément sont pourvues d’un attribut `hidden`) ;
6. Vérifier que la zone de pied de page est structurée au moyen d’un élément `<footer>`.
7. Si c’est le cas pour chaque zone de contenu, **le test est validé**.


**Cas particuliers**

Lorsque le doctype déclaré dans la page n’est pas le doctype HTML5, ce critère est non applicable.

**Notes techniques**

La balise `<main>` peut être utilisée plusieurs fois dans le même document HTML. Néanmoins, il ne peut y avoir en permanence qu’une seule balise visible et lisible par les technologies d’assistances, les autres devant disposer d’un attribut `hidden` ou d’un style permettant de les masquer aux technologies d’assistances. À noter cependant que l’utilisation d’un style seul restera insuffisante pour assurer l’unicité d’une balise `<main>` visible en cas de désactivation des feuilles de styles.

**Références** — WCAG : 1.3.1 Info and Relationships (A) · Techniques : G115, ARIA11

## Critère 9.3

Dans chaque page web, chaque liste est-elle correctement structurée ?

### Test 9.3.1

Dans chaque page web, les informations regroupées visuellement sous forme de liste non ordonnée vérifient-elles une de ces conditions ?
- La liste utilise les balises HTML `<ul>` et `<li>` ;
- La liste utilise les attributs WAI-ARIA `role="list"` et `role="listitem"`.

**Méthodologie**

1. Retrouver dans le document les éléments regroupés visuellement sous la forme d’une liste non ordonnée ;
2. Pour chaque liste, vérifier que la liste est structurée :
   - Soit au moyen des éléments `<ul>` et `<li>` ;
   - Soit au moyen d’éléments pourvus d’attributs WAI-ARIA `role="list"` et `role="listitem"`.
3. Si c’est le cas pour chaque liste non ordonnée, **le test est validé**.


### Test 9.3.2

Dans chaque page web, les informations regroupées visuellement sous forme de liste ordonnée vérifient-elles une de ces conditions ?
- La liste utilise les balises HTML `<ol>` et `<li>` ;
- La liste utilise les attributs WAI-ARIA `role="list"` et `role="listitem"`.

**Méthodologie**

1. Retrouver dans le document les éléments regroupés visuellement sous la forme d’une liste ordonnée ;
2. Pour chaque liste, vérifier que la liste est structurée :
   - Soit au moyen des éléments `<ol>` et `<li>` ;
   - Soit au moyen d’éléments pourvus d’attributs WAI-ARIA `role="list"` et `role="listitem"`.
3. Si c’est le cas pour chaque liste ordonnée, **le test est validé**.


### Test 9.3.3

Dans chaque page web, les informations regroupées sous forme de liste de description utilisent-elles les balises `<dl>` et `<dt>/<dd>` ?

**Méthodologie**

1. Retrouver dans le document les éléments regroupés visuellement sous la forme d’une liste de description ;
2. Pour chaque liste, vérifier que la liste est structurée au moyen des éléments `<dl>`, `<dt>` et `<dd>` ;
3. Si c’est le cas pour chaque liste de description, **le test est validé**.


**Notes techniques**

Les attributs WAI-ARIA `role="list"` et `role="listitem"` peuvent nécessiter l’utilisation des attributs WAI-ARIA `aria-setsize` et `aria-posinset` dans le cas où l’ensemble de la liste n’est pas disponible via le DOM généré au moment de la consultation.

Les attributs WAI-ARIA `role="tree"`, `role="tablist"`, `role="menu"`, `role="combobox"` et `role="listbox"` ne sont pas équivalents à une liste HTML `<ul>` ou `<ol>`.

**Références** — WCAG : 1.3.1 Info and Relationships (A) · Techniques : G115, G153, H40, H48, F2

## Critère 9.4

Dans chaque page web, chaque citation est-elle correctement indiquée ?

### Test 9.4.1

Dans chaque page web, chaque citation courte utilise-t-elle une balise `<q>` ?

**Méthodologie**

1. Retrouver dans le document les citations courtes (ou en ligne) ;
2. Pour chaque citation, vérifier que la citation est structurée au moyen d’un élément `<q>` ;
3. Si c’est le cas pour chaque citation courte, **le test est validé**.


### Test 9.4.2

Dans chaque page web, chaque bloc de citation utilise-t-il une balise `<blockquote>` ?

**Méthodologie**

1. Retrouver dans le document les blocs de citation ;
2. Pour chaque bloc de citation, vérifier que le bloc de citation est structuré au moyen d’un élément `<blockquote>` ;
3. Si c’est le cas pour chaque bloc de citation, **le test est validé**.


**Références** — WCAG : 1.3.1 Info and Relationships (A) · Techniques : G115, H49, F2
