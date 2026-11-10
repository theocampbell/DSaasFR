<!-- Generated from the official RGAA 4.1.2 (DINUM, github.com/DISIC/accessibilite.numerique.gouv.fr,
     RGAA/*.json), Licence Ouverte 2.0. Do not edit by hand: regenerate with generate.py. -->


# Thème 5 — Tableaux

## Critère 5.1

Chaque tableau de données complexe a-t-il un résumé ?

### Test 5.1.1

Pour chaque tableau de données complexe, un résumé est-il disponible ?

**Méthodologie**

1. Retrouver dans le document les tableaux de données complexes (tableau de données - élément `<table>` ou élément pourvu d’un attribut WAI-ARIA `role="table"` - contenant des en-têtes qui ne sont pas répartis uniquement sur la première ligne et/ou la première colonne de la grille ou dont la portée n’est pas valable pour l’ensemble de la colonne ou de la ligne) ;
2. Pour chaque tableau de données complexe, vérifier qu’un passage de texte permettant de comprendre la nature et la structure du tableau, est présent :
   - Soit dans l’élément `<caption>` ;
   - Soit dans l’attribut `summary` de l’élément `<table>` (dans les versions de HTML et de XHTML antérieures à HTML 5) ;
   - Soit dans un passage de texte lié au tableau avec l’attribut `aria-describedby`.
3. Si c’est le cas pour chaque tableau de données complexe, **le test est validé**.


**Notes techniques**

La spécification HTML propose plusieurs méthodes pour lier un résumé à un tableau (tableau lié à un passage de texte avec l’attribut `aria-describedby`, tableau groupé dans un élément `figure` avec un résumé présent dans un élément `figcaption` ou un élément `p`, résumé présent dans un élément `details` contenu dans l’élément `caption`). Ces méthodes n’ont pas un support suffisant pour être utilisées actuellement.

**Références** — WCAG : 1.3.1 Info and Relationships (A) · Techniques : H73

## Critère 5.2

Pour chaque tableau de données complexe ayant un résumé, celui-ci est-il pertinent ?

### Test 5.2.1

Pour chaque tableau de données complexe ayant un résumé, celui-ci est-il pertinent ?

**Méthodologie**

1. Retrouver dans le document les résumés de tableaux de données complexes (tels que déterminés par le test 5.1.1) ;
2. Pour chaque résumé, vérifier que son contenu est pertinent ;
3. Si c’est le cas pour chaque résumé de tableaux de données complexes, **le test est validé**.


**Références** — WCAG : 1.3.1 Info and Relationships (A) · Techniques : H73

## Critère 5.3

Pour chaque tableau de mise en forme, le contenu linéarisé reste-t-il compréhensible ?

### Test 5.3.1

Chaque tableau de mise en forme vérifie-t-il ces conditions ?
- Le contenu linéarisé reste compréhensible ;
- La balise `<table>` possède un attribut `role="presentation"`.

**Méthodologie**

1. Retrouver dans le document les tableaux de mise en forme ;
2. Pour chaque tableau de mise en forme, vérifier que :
   - L’ordre d’accès aux cellules est cohérent avec le contenu ;
   - L’élément `<table>` est pourvu d’un attribut WAI-ARIA `role="presentation"`.
3. Si c’est le cas pour chaque tableau de mise en forme, **le test est validé**.


**Références** — WCAG : 1.3.2 Meaningful Sequence (A), 4.1.2 Name, Role, Value (A) · Techniques : F49, ARIA4

## Critère 5.4

Pour chaque tableau de données ayant un titre, le titre est-il correctement associé au tableau de données ?

### Test 5.4.1

Pour chaque tableau de données ayant un titre, le titre est-il correctement associé au tableau de données ?

**Méthodologie**

1. Retrouver dans le document les tableaux de données pourvus d’un titre ;
2. Pour chaque titre, vérifier qu’il est fourni au moyen :
   - Soit d’un élément `<caption>` ;
   - Soit d’un attribut `title` ;
   - Soit d’un attribut WAI-ARIA `aria-label` ;
   - Soit d’un attribut WAI-ARIA `aria-labelledby` référençant un passage de texte.
3. Si c’est le cas pour chaque titre de tableau de données, **le test est validé**.


**Références** — WCAG : 1.3.1 Info and Relationships (A) · Techniques : H39

## Critère 5.5

Pour chaque tableau de données ayant un titre, celui-ci est-il pertinent ?

### Test 5.5.1

Pour chaque tableau de données ayant un titre, ce titre permet-il d’identifier le contenu du tableau de données de manière claire et concise ?

**Méthodologie**

1. Retrouver dans le document les tableaux de données pourvus d’un titre ;
2. Pour chaque titre, vérifier qu’il est pertinent ;
3. Si c’est le cas pour chaque titre de tableau de données, **le test est validé**.


**Références** — WCAG : 1.3.1 Info and Relationships (A) · Techniques : H39

## Critère 5.6

Pour chaque tableau de données, chaque en-tête de colonne et chaque en-tête de ligne sont-ils correctement déclarés ?

### Test 5.6.1

Pour chaque tableau de données, chaque en-tête de colonne s’appliquant à la totalité de la colonne vérifie-t-il une de ces conditions ?
- L’en-tête de colonnes est structuré au moyen d’une balise `<th>` ;
- L’en-tête de colonnes est structuré au moyen d’une balise pourvue d’un attribut WAI-ARIA `role="columnheader"`.

**Méthodologie**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête de colonnes s’appliquant à la totalité de la colonne, vérifier que l’en-tête de colonne est structuré au moyen :
   - Soit d’un élément `<th>` ;
   - Soit d’un élément pourvu d’un attribut WAI-ARIA `role="columnheader"`.
3. Si c’est le cas pour chaque en-tête de colonne s’appliquant à la totalité de la colonne, **le test est validé**.


### Test 5.6.2

Pour chaque tableau de données, chaque en-tête de ligne s’appliquant à la totalité de la ligne vérifie-t-il une de ces conditions ?
- L’en-tête de lignes est structuré au moyen d’une balise `<th>` ;
- L’en-tête de lignes est structuré au moyen d’une balise pourvue d’un attribut WAI-ARIA `role="rowheader"`.

**Méthodologie**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête de ligne s’appliquant à la totalité de la ligne, vérifier que l’en-tête de ligne est structuré au moyen :
   - Soit d’un élément `<th>` ;
   - Soit d’un élément pourvu d’un attribut WAI-ARIA `role="rowheader"`.
3. Si c’est le cas pour chaque en-tête de ligne s’appliquant à la totalité de la ligne, **le test est validé**.


### Test 5.6.3

Pour chaque tableau de données, chaque en-tête ne s’appliquant pas à la totalité de la ligne ou de la colonne est-il structuré au moyen d’une balise `<th>` ?

**Méthodologie**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête ne s’appliquant pas à la totalité de la ligne ou de la colonne, vérifier que l’en-tête de ligne est structuré au moyen d’un élément `<th>` ;
3. Si c’est le cas pour chaque en-tête ne s’appliquant pas à la totalité de la ligne ou de la colonne, **le test est validé**.


### Test 5.6.4

Pour chaque tableau de données, chaque cellule associée à plusieurs en-têtes est-elle structurée au moyen d’une balise `<td>` ou `<th>` ?

**Méthodologie**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque cellule associée à plusieurs en-têtes est-elle structurée au moyen d’une balise `<th>` ou `<td>` ;
3. Si c’est le cas pour chaque en-tête ne s’appliquant pas à la totalité de la ligne ou de la colonne, **le test est validé**.


**Références** — WCAG : 1.3.1 Info and Relationships (A) · Techniques : H51, F91

## Critère 5.7

Pour chaque tableau de données, la technique appropriée permettant d’associer chaque cellule avec ses en-têtes est-elle utilisée (hors cas particuliers) ?

### Test 5.7.1

Pour chaque contenu de balise `<th>` s’appliquant à la totalité de la ligne ou de la colonne, la balise `<th>` respecte-t-elle une de ces conditions (hors cas particuliers) ?
- La balise `<th>` possède un attribut `id` unique ;
- La balise `<th>` possède un attribut `scope` ;
- La balise `<th>` possède un attribut WAI-ARIA `role="rowheader"` ou `role="columnheader"`.

**Méthodologie**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête (élément `<th>`) s’appliquant à la totalité de la ligne ou de la colonne, vérifier que l’élément `<th>` possède :
   - Soit un attribut `id` unique ;
   - Soit un attribut scope ;
   - Soit un attribut WAI-ARIA `role="rowheader"` ou `"columnheader"`.
3. Si c’est le cas pour chaque en-tête s’appliquant à la totalité de la ligne ou de la colonne, **le test est validé**.


### Test 5.7.2

Pour chaque contenu de balise `<th>` s’appliquant à la totalité de la ligne ou de la colonne et possédant un attribut `scope`, la balise `<th>` vérifie-t-elle une de ces conditions ?
- La balise `<th>` possède un attribut `scope` avec la valeur `"row"` pour les en-têtes de ligne ;
- La balise `<th>` possède un attribut `scope` avec la valeur `"col"` pour les en-têtes de colonne.

**Méthodologie**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête (élément `<th>`) s’appliquant à la totalité de la ligne ou de la colonne et pourvu d’un attribut `scope`, vérifier que l’attribut `scope` possède :
   - Soit une valeur `"row"` pour les en-têtes de ligne ;
   - Soit une valeur `"col"` pour les en-têtes de colonne.
3. Si c’est le cas pour chaque en-tête s’appliquant à la totalité de la ligne ou de la colonne et pourvu d’un attribut `scope`, **le test est validé**.


### Test 5.7.3

Pour chaque contenu de balise `<th>` ne s’appliquant pas à la totalité de la ligne ou de la colonne, la balise `<th>` vérifie-t-elle ces conditions ?
- La balise `<th>` ne possède pas d’attribut `scope` ;
- La balise `<th>` ne possède pas d’attribut WAI-ARIA `role="rowheader"` ou `role="columnheader"` ;
- La balise `<th>` possède un attribut `id` unique.

**Méthodologie**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête (élément `<th>`) ne s’appliquant pas à la totalité de la ligne ou de la colonne, vérifier que l’élément `<th>` :
   - Possède un attribut `id` unique ;
   - Et ne possède pas d’attribut `scope `;
   - Et ne possède pas d’attribut WAI-ARIA `role="rowheader"` ou `"columnheader"`.
3. Si c’est le cas pour chaque en-tête ne s’appliquant pas à la totalité de la ligne ou de la colonne, **le test est validé**.


### Test 5.7.4

Pour chaque contenu de balise `<td>` ou `<th>` associée à un ou plusieurs en-têtes possédant un attribut `id`, la balise vérifie-t-elle ces conditions ?
- La balise possède un attribut `headers` ;
- L’attribut `headers` possède la liste des valeurs d’attribut `id` des en-têtes associés.

**Méthodologie**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque élément `<td>` ou `<th>` associé à un ou plusieurs en-têtes possédant un attribut `id`, vérifier que :
   - L’élément `<td>` ou `<th>` possède un attribut `headers` ;
   - Et l’attribut `headers` possède la liste des valeurs d’attribut `id` des en-têtes associés.
3. Si c’est le cas pour chaque élément `<td>` ou `<th>` associé à un ou plusieurs en-têtes possédant un attribut `id`, **le test est validé**.


### Test 5.7.5

Pour chaque balise pourvue d’un attribut WAI-ARIA `role="rowheader"` ou `role="columnheader"` dont le contenu s’applique à la totalité de la ligne ou de la colonne, la balise vérifie-t-elle une de ces conditions ?
- La balise possède un attribut WAI-ARIA `role="rowheader"` pour les en-têtes de ligne ;
- La balise possède un attribut WAI-ARIA `role="columnheader"` pour les en-têtes de colonne.

**Méthodologie**

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête s’appliquant à la totalité de la ligne ou de la colonne et pourvu d’un attribut WAI-ARIA `role="rowheader"` ou `"columnheader"`, vérifier que l’élément possède :
   - Soit un attribut WAI-ARIA `role="rowheader"` pour les en-têtes de ligne ;
   - Soit un attribut WAI-ARIA `role="columnheader"` pour les en-têtes de colonne.
3. Si c’est le cas pour chaque en-tête s’appliquant à la totalité de la ligne ou de la colonne et pourvu d’un attribut WAI-ARIA `role="rowheader"` ou `"columnheader"`, **le test est validé**.


**Cas particuliers**

Dans le cas de tableaux de données ayant des en-têtes sur une seule ligne ou une seule colonne, les en-têtes peuvent être structurés à l’aide de balise `<th>` sans attribut `scope`.

**Notes techniques**

Si l’attribut `headers` est implémenté sur une cellule déjà reliée à un en-tête (de ligne ou de colonne) avec l’attribut `scope` (avec la valeur `col` ou `row`), c’est l’en-tête ou les en-têtes référencés par l’attribut `headers` qui seront restitués aux technologies d’assistance. Les en-têtes reliés avec l’attribut `scope` seront ignorés.

**Références** — WCAG : 1.3.1 Info and Relationships (A) · Techniques : H43, H63, F90

## Critère 5.8

Chaque tableau de mise en forme ne doit pas utiliser d’éléments propres aux  tableaux de données. Cette règle est-elle respectée ?

### Test 5.8.1

Chaque tableau de mise en forme (balise `<table>`) vérifie-t-il ces conditions ?
- Le tableau de mise en forme (balise `<table>`) n’a pas d’attribut `summary` (sinon vide) et ne contient pas de balises `<caption>`, `<th>`, `<thead>`, `<tfoot>` ou de balises ayant un attribut WAI-ARIA `role="rowheader"`, `role="columnheader"` ;
- Les cellules du tableau de mise en forme (balises `<td>`) ne possèdent pas d’attributs `scope`, `headers` et `axis`.

**Méthodologie**

1. Retrouver dans le document les tableaux de mise en forme ;
2. Pour chaque tableau de mise en forme, vérifier que :
   - L’élément `<table>` ne possède pas d'attribut `summary`, d’éléments enfant `<caption>`, `<thead>`, `<th>`, `<tfoot>` ou d’éléments pourvus d’un attribut WAI-ARIA `role="rowheader"` ou `role="columnheader"` ;
   - Les éléments `<td>` ne possèdent pas d’attributs `scope`, `headers` et `axis`.
3. Si c’est le cas pour chaque tableau de mise en forme, **le test est validé**.


**Références** — WCAG : 1.3.1 Info and Relationships (A) · Techniques : F46
