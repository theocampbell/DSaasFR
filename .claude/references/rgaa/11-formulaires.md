<!-- Generated from the official RGAA 4.1.2 (DINUM, github.com/DISIC/accessibilite.numerique.gouv.fr,
     RGAA/*.json), Licence Ouverte 2.0. Do not edit by hand: regenerate with generate.py. -->


# Thème 11 — Formulaires

## Critère 11.1

Chaque champ de formulaire a-t-il une étiquette ?

### Test 11.1.1

Chaque champ de formulaire vérifie-t-il une de ces conditions ?
- Le champ de formulaire possède un attribut WAI-ARIA `aria-labelledby` référençant un passage de texte identifié ;
- Le champ de formulaire possède un attribut WAI-ARIA `aria-label` ;
- Une balise `<label>` ayant un attribut `for` est associée au champ de formulaire ;
- Le champ de formulaire possède un attribut `title` ;
- Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément `<label>` visuellement caché ou un attribut WAI-ARIA `aria-label`, `aria-labelledby` ou `title` lui fournit un nom accessible.

**Méthodologie**

1. Retrouver dans le document les champs de formulaire ;
2. Pour chaque champ de formulaire, vérifier que le champ de formulaire :
   - Possède un attribut WAI-ARIA `aria-labelledby` référençant un passage de texte identifié ;
   - Possède un attribut WAI-ARIA `aria-label` ;
   - Est associé à un élément `<label>` ayant un attribut `for` ;
   - Possède un attribut `title` ;
   - Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément `<label>` visuellement caché ou un attribut WAI-ARIA `aria-label`, `aria-labelledby` ou `title` lui fournit un nom accessible.
3. Si c’est le cas pour champ de formulaire, **le test est validé**.


### Test 11.1.2

Chaque champ de formulaire associé à une balise `<label>` ayant un attribut `for`, vérifie-t-il ces conditions ?
- Le champ de formulaire possède un attribut `id` ;
- La valeur de l’attribut `for` est égale à la valeur de l’attribut `id` du champ de formulaire associé.

**Méthodologie**

1. Retrouver dans le document les champs de formulaire associé à un élément `<label>` ;
2. Pour chaque champ de formulaire, vérifier que :
   - Le champ de formulaire possède un attribut `id` ;
   - La valeur de l’attribut `for` de l’élément `<label>` est égale à la valeur de l’attribut `id`.
3. Si c’est le cas pour champ de formulaire, **le test est validé**.


### Test 11.1.3

Chaque champ de formulaire ayant une étiquette dont le contenu n’est pas visible ou à proximité (masqué, `aria-label`) ou qui n’est pas accolé au champ (`aria-labelledby`), vérifie-t-il une de ses conditions ?
- Le champ de formulaire possède un attribut `title` dont le contenu permet de comprendre la nature de la saisie attendue ;
- Le champ de formulaire est accompagné d’un passage de texte accolé au champ qui devient visible à la prise de focus permettant de comprendre la nature de la saisie attendue ;
- Le champ de formulaire est accompagné d’un passage de texte visible accolé au champ permettant de comprendre la nature de la saisie attendue.

**Méthodologie**

1. Retrouver dans le document les champs de formulaire dont l’étiquette n’est pas visible ou à proximité (masquée, utilisation de l’attribut aria-label) ou n’est pas accolée au champ (utilisation de l’attribut `aria-labelledby`) ;
2. Pour chaque champ de formulaire, vérifier que le champ de formulaire :
   - soit possède un attribut `title` dont le contenu permet de comprendre la nature de la saisie attendue ;
   - est accompagné d’un passage de texte accolé au champ qui devient visible à la prise de focus permettant de comprendre la nature de la saisie attendue ;
   - est accompagné d’un passage de texte visible accolé au champ permettant de comprendre la nature de la saisie attendue.


**Références** — WCAG : 1.3.1 Info and Relationships (A), 2.4.6 Headings and Labels (AA), 3.3.2 Labels or Instructions (A), 4.1.2 Name, Role, Value (A) · Techniques : G82, G131, H44, H65, F68, F82, F86, ARIA6, ARIA9, ARIA14, ARIA16

## Critère 11.2

Chaque étiquette associée à un champ de formulaire est-elle pertinente (hors cas particuliers) ?

### Test 11.2.1

Chaque balise `<label>` permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée ?

**Méthodologie**

1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie par un élément `<label>` ;
2. Pour chaque champ de formulaire, vérifier que le contenu de l’élément est pertinent ;
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.


### Test 11.2.2

Chaque attribut `title` permet-il de connaître la fonction exacte du champ de formulaire auquel il est associé ?

**Méthodologie**

1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie par un attribut `title` ;
2. Pour chaque champ de formulaire, vérifier que le contenu de l’attribut est pertinent ;
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.


### Test 11.2.3

Chaque étiquette implémentée via l’attribut WAI-ARIA `aria-label` permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée ?

**Méthodologie**

1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie par un attribut WAI-ARIA `aria-label` ;
2. Pour chaque champ de formulaire, vérifier que le contenu de l’attribut est pertinent ;
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.


### Test 11.2.4

Chaque passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` permet-il de connaître la fonction exacte du champ de formulaire auquel il est associé ?

**Méthodologie**

1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie par un attribut WAI-ARIA `aria-labelledby` ;
2. Pour chaque champ de formulaire, vérifier que le contenu du passage de texte référencé est pertinent ;
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.


### Test 11.2.5

Chaque champ de formulaire ayant un intitulé visible vérifie-t-il ces conditions (hors cas particuliers) ?
- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` du champ de formulaire contient au moins l’intitulé visible ;
- S’il est présent, le passage de texte lié au champ de formulaire via un attribut WAI-ARIA `aria-labelledby` contient au moins l’intitulé visible ;
- S’il est présent, le contenu de l’attribut `title` du champ de formulaire contient au moins l’intitulé visible ;
- S’il est présent le contenu de la balise `<label>` associé au champ de formulaire contient au moins l’intitulé visible.

**Méthodologie**

1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie à la fois par un intitulé visible et par le contenu soit d’un élément `<label>`, soit d’un attribut `title` ou d’un attribut `aria-label` ou d’un attribut `aria-labelledby` ;
2. Pour chaque champ de formulaire, vérifier que le contenu de l’élément `<label>` ou de l’attribut `title` ou de l’attribut `aria-label` ou de l’attribut `aria-labelledby` contient l’intitulé visible ;
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.


### Test 11.2.6

Chaque bouton adjacent au champ de formulaire qui fournit une étiquette visible permet-il de connaître la fonction exacte du champ de formulaire auquel il est associé ?

**Méthodologie**

1. Retrouver dans le document les champs de formulaire dont l’étiquette visible est fournie par un bouton adjacent ;
2. Pour chaque champ de formulaire, vérifier que le contenu visible du bouton est pertinent ;
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.


**Cas particuliers**

Il existe une gestion de cas particuliers pour le test 11.2.5 lorsque :

- La ponctuation et les lettres majuscules sont présentes dans le texte de l’intitulé visible : elles peuvent être ignorées dans le nom accessible sans porter à conséquence ;
- Le texte de l’intitulé visible sert de symbole : le texte ne doit pas être interprété littéralement au niveau du nom accessible. Le nom doit exprimer la fonction véhiculée par le symbole (par exemple, “B” au niveau d’un éditeur de texte aura pour nom accessible “Mettre en gras”, le signe “>” en fonction du contexte signifiera “Suivant” ou “Lancer la vidéo”). Le cas des symboles mathématiques fait cependant exception (voir la note ci-dessous).

Note : si l’étiquette visible représente une expression mathématique, les symboles mathématiques peuvent être repris littéralement pour servir d’étiquette au nom accessible (ex. : “A>B”). Il est laissé à l’utilisateur le soin d’opérer la correspondance entre l’expression et ce qu’il doit épeler compte tenu de la connaissance qu’il a du fonctionnement de son logiciel de saisie vocale (“A plus grand que B” ou “A supérieur à B”).

Ce cas particulier s’applique également au test 11.9.2.

**Références** — WCAG : 2.4.6 Headings and Labels (AA), 2.5.3 Label in Name (A), 3.3.2 Labels or Instructions (A) · Techniques : G82, G131, H44, H65, ARIA6, ARIA9, ARIA14, ARIA16

## Critère 11.3

Dans chaque formulaire, chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée plusieurs fois dans une même page ou dans un ensemble de pages est-elle cohérente ?

### Test 11.3.1

Chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée plusieurs fois dans une même page est-elle cohérente ?

**Méthodologie**

1. Retrouver dans le document les champs de formulaire ayant une même fonction (par exemple plusieurs champs d’adresse) ;
2. Pour chaque champ de formulaire, vérifier que les étiquettes sont cohérentes (elles permettent de comprendre qu’il s’agit de saisies de natures identiques) ;
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.


### Test 11.3.2

Chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée dans un ensemble de pages est-elle cohérente ?

**Méthodologie**

1. Retrouver dans l’ensemble des pages considérées les champs de formulaire ayant une même fonction (par exemple le champ de saisie d’un moteur de recherche ou le champ de saisie d’inscription à une newsletter) ;
2. Pour chaque champ de formulaire, vérifier que les étiquettes sont cohérentes (elles permettent de comprendre qu’il s’agit de saisies de natures identiques) ;
3. Si c’est le cas pour chaque champ de formulaire de l’ensemble des pages considérées, **le test est validé**.


**Références** — WCAG : 3.2.4 Consistent Identification (AA) · Techniques : F31

## Critère 11.4

Dans chaque formulaire, chaque étiquette de champ et son champ associé sont-ils accolés (hors cas particuliers) ?

### Test 11.4.1

Chaque étiquette de champ et son champ associé sont-ils accolés ?

**Méthodologie**

1. Retrouver dans le document les champs de formulaire ;
2. Pour chaque champ de formulaire, vérifier qu’il est accolé à son étiquette ;
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.


### Test 11.4.2

Chaque étiquette accolée à un champ (à l’exception des cases à cocher, bouton radio ou balises ayant un attribut WAI-ARIA `role="checkbox"`, `role="radio"` ou `role="switch"`), vérifie-t-elle ces conditions (hors cas particuliers) ?
- L’étiquette est visuellement accolée immédiatement au-dessus ou à gauche du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de gauche à droite ;
- L’étiquette est visuellement accolée immédiatement au-dessus ou à droite du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de droite à gauche.

**Méthodologie**

1. Retrouver dans le document les champs de formulaire qui ne sont pas des éléments `<input>` de type `checkbox` ou de type `radio` ou des éléments ayant un attribut WAI-ARIA `role="checkbox"`, `role="radio"` ou `role="switch`";
2. Pour chaque champ de formulaire, vérifier que l’étiquette est visuellement accolée :
   - Immédiatement au-dessus ou à gauche du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de gauche à droite ;
   - Immédiatement au-dessus ou à droite du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de droite à gauche.
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.


### Test 11.4.3

Chaque étiquette accolée à un champ de type `checkbox` ou `radio` ou à une balise ayant un attribut WAI-ARIA `role="checkbox"`, `role="radio"` ou `role="switch"`, vérifie-t-elle ces conditions (hors cas particuliers) ?
- L’étiquette est visuellement accolée immédiatement au-dessous ou à droite du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de gauche à droite ;
- L’étiquette est visuellement accolée immédiatement au-dessous ou à gauche du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de droite à gauche.

**Méthodologie**

1. Retrouver dans le document les champs de formulaire qui sont `<input>` de type `checkbox` ou de type `radio` ou des éléments ayant un attribut WAI-ARIA `role="checkbox"`, `role="radio"` ou `role="switch`";
2. Pour chaque champ de formulaire, vérifier que l’étiquette est visuellement accolée :
   - Immédiatement au-dessous ou à droite du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de gauche à droite ;
   - Immédiatement au-dessous ou à gauche du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de droite à gauche.
3. Si c’est le cas pour chaque champ de formulaire, **le test est validé**.


**Cas particuliers**

Les tests 11.4.2 et 11.4.3 seront considérés comme non applicables :

- Dans le cas où l’étiquette mélange une portion de texte qui se lit de droite à gauche avec une portion de texte qui se lit de gauche à droite ;
- Dans le cas où un formulaire contient des labels de plusieurs langues qui se liraient de droite à gauche et inversement. Par exemple, un formulaire de commande en arabe qui propose une liste de cases à cocher de produit en langue française ou mixant des produits en langue arabe ou en langue française ;
- Dans le cas où les champs de type `radio` ou `checkbox` et les balises ayant un attribut WAI-ARIA `role="checkbox"`, `role="radio"` ou `role="switch"` ne sont pas visuellement présentés sous forme de bouton radio ou de case à cocher ;
- Dans le cas où les champs seraient utilisés dans un contexte où il pourrait être légitime, du point de vue de l’expérience utilisateur, de placer les étiquettes de manière différente à celle requise dans les tests 11.4.2 et 11.4.3.

**Références** — WCAG : 3.3.2 Labels or Instructions (A) · Techniques : G162

## Critère 11.5

Dans chaque formulaire, les champs de même nature sont-ils regroupés, si nécessaire ?

### Test 11.5.1

Les champs de même nature vérifient-ils l’une de ces conditions, si nécessaire ?
- Les champs de même nature sont regroupés dans une balise `<fieldset>` ;
- Les champs de même nature sont regroupés dans une balise possédant un attribut WAI-ARIA `role="group"` ;
- Les champs de même nature de type radio (`<input type="radio">`) ou balises possédant un attribut WAI-ARIA `role="radio"`) sont regroupés dans une balise possédant un attribut WAI-ARIA `role="radiogroup"` ou `role="group"`.

**Méthodologie**

1. Retrouver dans le document les champs de formulaire de même nature (par exemple un groupe de saisie d’informations d’identité, une série de cases à cocher, une saisie de date sur plusieurs champs successifs…) ;
2. Pour chaque groupe de champs de formulaire de même nature, vérifier que ces champs de même nature sont regroupés :
   - Soit dans un élément `<fieldset>` ;
   - Soit dans un élément possédant un attribut WAI-ARIA `role="group"` ;
   - Soit dans un élément possédant un attribut WAI-ARIA `role="radiogroup"` ou `"group"`, s’il s’agit d’éléments `<input>` de type `radio` ( ou d’éléments possédant un attribut WAI-ARIA `role="radio"`).
3. Si c’est le cas pour chaque groupe de champs de formulaire de même nature, **le test est validé**.


**Références** — WCAG : 1.3.1 Info and Relationships (A), 3.3.2 Labels or Instructions (A) · Techniques : H71, ARIA17

## Critère 11.6

Dans chaque formulaire, chaque regroupement de champs de même nature a-t-il une légende ?

### Test 11.6.1

Chaque regroupement de champs de même nature possède-t-il une légende ?

**Méthodologie**

1. Retrouver dans le document les groupes de champs de formulaire de même nature ;
2. Pour chaque groupe de champs de formulaire de même nature, vérifier que :
   - Si le regroupement utilise un élément `<fieldset>`, l’élément `<fieldset>` possède un élément `<legend>` ;
   - Si l’élément de regroupement utilise un attribut WAI-ARIA `role="group"` ou `"radiogroup"`, il possède un attribut WAI-ARIA `aria-label` ou `aria-labelledby`.
3. Sinon, pour chacun des champs de même nature, vérifier la présence :
   - Soit d’un attribut title permettant de déterminer l’appartenance du champ au groupement de champ ;
   - Soit d’un attribut `aria-label` permettant de déterminer l’appartenance du champ au groupement de champ ;
   - Soit d’un attribut `aria-labelledby` qui référence un passage de texte permettant de déterminer l’appartenance du champ au groupement de champ ;
   - Soit d’un attribut `aria-describedby` qui référence un passage de texte permettant de déterminer l’appartenance du champ au groupement de champ.
4. Si c’est le cas pour chaque groupe de champs de formulaire ou pour chacun des champs de même nature, **le test est validé**.


**Références** — WCAG : 1.3.1 Info and Relationships (A), 3.3.2 Labels or Instructions (A) · Techniques : H71, ARIA17

## Critère 11.7

Dans chaque formulaire, chaque légende associée à un regroupement de champs de même nature est-elle pertinente ?

### Test 11.7.1

Chaque légende associée à un regroupement de champs de même nature est-elle pertinente ?

**Méthodologie**

1. Retrouver dans le document les groupes de champs de formulaire de même nature ;
2. Pour chaque groupe de champs de formulaire de même nature ou pour chacun des champs de même nature qui dispose d’une légende, vérifier que le texte de cette légende est pertinent ;
3. Si c’est le cas pour chaque groupe de champs de formulaire ou pour chacun des champs de même nature, **le test est validé**.


**Références** — WCAG : 1.3.1 Info and Relationships (A), 3.3.2 Labels or Instructions (A) · Techniques : H71, ARIA17

## Critère 11.8

Dans chaque formulaire, les items de même nature d’une liste de choix sont-ils regroupés de manière pertinente ?

### Test 11.8.1

Pour chaque balise `<select>`, les items de même nature d’une liste de choix sont-ils regroupés avec une balise `<optgroup>`, si nécessaire ?

**Méthodologie**

1. Retrouver dans le document les listes de sélection (élément `<select>`) ;
2. Pour chaque liste de sélection proposant des groupes d’items de même nature, vérifier que ces items sont regroupés au moyen d’éléments `<optgroup>` ;
3. Si c’est le cas pour chaque liste de sélection proposant des groupes d’items de même nature, **le test est validé**.


### Test 11.8.2

Dans chaque balise `<select>`, chaque balise `<optgroup>` possède-t-elle un attribut `label` ?

**Méthodologie**

1. Retrouver dans le document les listes de sélection (élément `<select>`) qui possèdent des éléments `<optgroup>` ;
2. Pour chaque élément `<optgroup>`, vérifier qu’il possède un attribut `label` ;
3. Si c’est le cas pour chaque élément `<optgroup>`, **le test est validé**.


### Test 11.8.3

Pour chaque balise `<optgroup>` ayant un attribut `label`, le contenu de l’attribut `label` est-il pertinent ?

**Méthodologie**

1. Retrouver dans le document les listes de sélection (élément `<select>`) qui possèdent des éléments `<optgroup>` pourvus d’un attribut `label` ;
2. Pour chaque attribut `label`, vérifier que son contenu est pertinent ;
3. Si c’est le cas pour chaque attribut `label`, **le test est validé**.


**Notes techniques**

Il est possible d’utiliser une balise ayant un attribut WAI-ARIA `role="listbox"` en remplacement d’une balise `<select>`. En revanche, il est impossible de créer des groupes d’options via l’utilisation de WAI-ARIA. De ce fait, une liste nécessitant un regroupement d’options structurée à l’aide d’une balise ayant un attribut WAI-ARIA `role="listbox"` sera considérée comme non conforme au critère 11.8.

**Références** — WCAG : 1.3.1 Info and Relationships (A) · Techniques : H85

## Critère 11.9

Dans chaque formulaire, l’intitulé de chaque bouton est-il pertinent (hors cas particuliers) ?

### Test 11.9.1

L’intitulé de chaque bouton vérifie-t-il ces conditions (hors cas particuliers) ?
- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
- S’il est présent, le passage de texte lié au bouton via un attribut WAI-ARIA `aria-labelledby` est pertinent ;
- S’il est présent, le contenu de l’attribut `value` d’une balise `<input>` de type `submit`, `reset` ou `button` est pertinent ;
- S’il est présent, le contenu de la balise `<button>` est pertinent ;
- S’il est présent, le contenu de l’attribut `alt` d’une balise `<input>` de type `image` est pertinent ;
- S’il est présent, le contenu de l’attribut `title` est pertinent.

**Méthodologie**

1. Retrouver dans le document les boutons présents au sein d’un formulaire ;
2. Pour chaque bouton, vérifier que son intitulé visible et son nom accessible sont pertinents ;
3. Si c’est le cas pour chaque bouton, **le test est validé**.


### Test 11.9.2

Chaque bouton affichant un intitulé visible vérifie-t-il ces conditions (hors cas particuliers) ?
- S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label `contient au moins l’intitulé visible ;
- S’il est présent, le passage de texte lié au bouton via un attribut WAI-ARIA `aria-labelledby` contient au moins l’intitulé visible ;
- S’il est présent, le contenu de l’attribut value d’une balise `<input>` de type `submit`, `reset` ou `button` contient au moins l’intitulé visible ;
- S’il est présent, le contenu de la balise `<button>` contient au moins l’intitulé visible ;
- S’il est présent, le contenu de l’attribut `alt` d’une balise `<input>` de type `image` contient au moins l’intitulé visible ;
- S’il est présent, le contenu de l’attribut `title` contient au moins l’intitulé visible.

**Méthodologie**

1. Retrouver dans le document les boutons présents au sein d’un formulaire ;
2. Pour chaque bouton, vérifier que son nom accessible contient au moins son intitulé visible ;
3. Si c’est le cas pour chaque bouton, **le test est validé**.


**Cas particuliers**

Pour le test 11.9.2, voir cas particuliers critère 11.2.

**Références** — WCAG : 2.5.3 Label in Name (A), 4.1.2 Name, Role, Value (A) · Techniques : H36, H91, ARIA6, ARIA9, ARIA14, ARIA16

## Critère 11.10

Dans chaque formulaire, le contrôle de saisie est-il utilisé de manière pertinente (hors cas particuliers) ?

### Test 11.10.1

Les indications du caractère obligatoire de la saisie des champs vérifient-elles une de ces conditions (hors cas particuliers) ?
- Une indication de champ obligatoire est visible et permet d’identifier nommément le champ concerné préalablement à la validation du formulaire ;
- Le champ obligatoire dispose de l’attribut `aria-required="true"` ou `required` préalablement à la validation du formulaire.

**Méthodologie**

1. Retrouver dans le document les champs de formulaire obligatoires ;
2. Pour chaque champ de formulaire, vérifier que préalablement à la validation du formulaire :
   - Soit une indication de champ obligatoire est visible et permet d’identifier nommément le champ concerné ;
   - Soit le champ possède un attribut `aria-required="true"` ou `required`.
3. Si c’est le cas pour chaque champ de formulaire obligatoire, **le test est validé**.


### Test 11.10.2

Les champs obligatoires ayant l’attribut `aria-required="true"` ou `required` vérifient-ils une de ces conditions ?
- Une indication de champ obligatoire est visible et située dans l’étiquette associée au champ préalablement à la validation du formulaire ;
- Une indication de champ obligatoire est visible et située dans le passage de texte associé au champ préalablement à la validation du formulaire.

**Méthodologie**

1. Retrouver dans le document les champs de formulaire obligatoires qui possèdent un attribut `aria-required="true"` ou `required` ;
2. Pour chaque champ de formulaire, vérifier que préalablement à la validation du formulaire :
   - Soit une indication de champ obligatoire est visible et située dans l’étiquette associée au champ ;
   - Soit une indication de champ obligatoire est visible et située dans le passage de texte associé au champ.
3. Si c’est le cas pour chaque champ de formulaire obligatoire qui possèdent un attribut `aria-required="true"` ou `required`, **le test est validé**.


### Test 11.10.3

Les messages d’erreur indiquant l’absence de saisie d’un champ obligatoire vérifient-ils une de ces conditions ?
- Le message d’erreur indiquant l’absence de saisie d’un champ obligatoire est visible et permet d’identifier nommément le champ concerné ;
- Le champ obligatoire dispose de l’attribut `aria-invalid="true"`.

**Méthodologie**

1. Retrouver dans le document les messages d’erreur indiquant l’absence de saisie d’un champ obligatoire ;
2. Pour chaque message d’erreur, vérifier que :
   - Soit le message d’erreur est visible et permet d’identifier nommément le champ concerné ;
   - Soit le champ obligatoire associé au message d’erreur possède un attribut `aria-invalid="true"`.
3. Si c’est le cas pour chaque message d’erreur indiquant l’absence de saisie d’un champ obligatoire, **le test est validé**.


### Test 11.10.4

Les champs obligatoires ayant l’attribut `aria-invalid="true"` vérifient-ils une de ces conditions ?
- Le message d’erreur indiquant le caractère invalide de la saisie est visible et situé dans l’étiquette associée au champ ;
- Le message d’erreur indiquant le caractère invalide de la saisie est visible et situé dans le passage de texte associé au champ.

**Méthodologie**

1. Retrouver dans le document les champs de formulaire obligatoires qui possèdent un attribut `aria-invalid="true"` ;
2. Pour chaque champ de formulaire, vérifier que :
   - Soit le message d’erreur indiquant le caractère invalide de la saisie est visible et situé dans l’étiquette associée au champ ;
   - Soit le message d’erreur indiquant le caractère invalide de la saisie est visible et situé dans le passage de texte associé au champ.
3. Si c’est le cas pour chaque champ de formulaire obligatoire qui possède un attribut `aria-invalid="true"`, **le test est validé**.


### Test 11.10.5

Les instructions et indications du type de données et/ou de format obligatoires vérifient-elles une de ces conditions ?
- Une instruction ou une indication du type de données et/ou de format obligatoire est visible et permet d’identifier nommément le champ concerné préalablement à la validation du formulaire ;
- Une instruction ou une indication du type de données et/ou de format obligatoire est visible dans l’étiquette ou le passage de texte associé au champ préalablement à la validation du formulaire.

**Méthodologie**

1. Retrouver dans le document les champs de formulaire obligatoires auxquels est associée une instruction ou une indication du type de données et/ou de format obligatoire ;
2. Pour chaque champ de formulaire, vérifier que l’instruction ou l’indication du type de données et/ou de format obligatoire est préalablement à la validation du formulaire :
   - Soit visible et permet d’identifier nommément le champ concerné ;
   - Soit visible dans l’étiquette ou le passage de texte associé au champ.
3. Si c’est le cas pour chaque champ de formulaire obligatoire auquel est associée une instruction ou une indication du type de données et/ou de format obligatoire, **le test est validé**.


### Test 11.10.6

Les messages d’erreurs fournissant une instruction ou une indication du type de données et/ou de format obligatoire des champs vérifient-ils une de ces conditions ?
- Le message d’erreur fournissant une instruction ou une indication du type de données et/ou de format obligatoires est visible et identifie le champ concerné ;
- Le champ dispose de l’attribut `aria-invalid="true"`.

**Méthodologie**

1. Retrouver dans le document les messages d’erreur fournissant une instruction ou une indication du type de données et/ou de format obligatoire d’un champ ;
2. Pour chaque message d’erreur, vérifier que :
   - Soit le message d’erreur est visible et permet d’identifier nommément le champ concerné ;
   - Soit le champ associé au message d’erreur possède un attribut `aria-invalid="true"`.
3. Si c’est le cas pour chaque message d’erreur indiquant l’absence de saisie d’un champ obligatoire, **le test est validé**.


### Test 11.10.7

Les champs ayant l’attribut `aria-invalid="true"` dont la saisie requiert un type de données et/ou de format obligatoires vérifient-ils une de ces conditions ?
- Une instruction ou une indication du type de données et/ou de format obligatoire est visible et située dans la balise `<label>` associée au champ ;
- Une instruction ou une indication du type de données et/ou de format obligatoire est visible et située dans le passage de texte associé au champ.

**Méthodologie**

1. Retrouver dans le document les champs de formulaire qui possèdent un attribut `aria-invalid="true"` ;
2. Pour chaque champ de formulaire, vérifier que :
   - Soit une instruction ou une indication du type de données et/ou de format obligatoire est visible et située dans l’élément `<label>` associé au champ ;
   - Soit une instruction ou une indication du type de données et/ou de format obligatoire est visible et située dans le passage de texte associé au champ.
3. Si c’est le cas pour chaque champ de formulaire qui possède un attribut `aria-invalid="true"`, **le test est validé**.


**Cas particuliers**

Le test 11.10.1 et le test 11.10.2 seront considérés comme non applicables lorsque le formulaire comporte un seul champ de formulaire ou qu’il indique les champs optionnels de manière :

- Visible ;
- Dans la balise `<label>` ou dans la légende associée au champ.

Dans le cas où l’ensemble des champs d’un formulaire sont obligatoires, les tests 11.10.1 et 11.10.2 restent applicables.

**Notes techniques**

Dans un long formulaire dont la majorité des champs sont obligatoires, on pourrait constater que ce sont les quelques champs restés facultatifs qui sont explicitement signalés comme tels. Dans ce cas, il faudrait s’assurer que :

- Un message précise visuellement en haut de formulaire que “tous les champs sont obligatoires sauf ceux indiqués comme étant facultatifs” ;
- Une mention “facultatif” est présente visuellement dans le libellé des champs facultatifs ou dans la légende d’un groupe de champs facultatifs ;
- Un attribut `required` ou `aria-required="true"` reste associé à chaque champ qui n’est pas concerné par ce caractère facultatif.

**Références** — WCAG : 3.3.1 Error Identification (A), 3.3.2 Labels or Instructions (A) · Techniques : G83, G84, G85, G89, G184, H44, H81, H89, H90, F81, SCR18, SCR32, ARIA1, ARIA2, ARIA6, ARIA9, ARIA16, ARIA21

## Critère 11.11

Dans chaque formulaire, le contrôle de saisie est-il accompagné, si nécessaire, de suggestions facilitant la correction des erreurs de saisie ?

### Test 11.11.1

Pour chaque erreur de saisie, les types et les formats de données sont-ils suggérés, si nécessaire ?

**Méthodologie**

1. Retrouver dans le document les messages d’erreur ;
2. Pour chaque message d’erreur, vérifier que les types et les formats de données attendus sont suggérés ;
3. Si c’est le cas pour chaque message d’erreur , **le test est validé**.


### Test 11.11.2

Pour chaque erreur de saisie, des exemples de valeurs attendues sont-ils suggérés, si nécessaire ?

**Méthodologie**

1. Retrouver dans le document les messages d’erreur ;
2. Pour chaque message d’erreur, vérifier que des exemples de valeurs attendues sont suggérés ;
3. Si c’est le cas pour chaque message d’erreur , **le test est validé**.


**Notes techniques**

Certains types de contrôles en HTML5 proposent des messages d’aide à la saisie automatique : par exemple le type `email` affiche un message du type « veuillez saisir une adresse e-mail valide » dans le cas où l’adresse e-mail saisie ne correspond pas au format attendu. Ces messages sont personnalisables via l’API Constraint Validation, ce qui permet de personnaliser les messages d’erreur et de valider le critère. L’attribut `pattern` permet d’effectuer automatiquement des contrôles de format (via des expressions régulières) et affiche un message d’aide personnalisable via l’attribut `title` : ce dispositif valide également le critère.

**Références** — WCAG : 3.3.3 Error Suggestion (AA) · Techniques : G84, G85, G89, G177, H89

## Critère 11.12

Pour chaque formulaire qui modifie ou supprime des données, ou qui transmet des réponses à un test ou à un examen, ou dont la validation a des conséquences financières ou juridiques, les données saisies peuvent-elles être modifiées, mises à jour ou récupérées par l’utilisateur ?

### Test 11.12.1

Pour chaque formulaire qui modifie ou supprime des données, ou qui transmet des réponses à un test ou un examen, ou dont la validation a des conséquences financières ou juridiques, la saisie des données vérifie-t-elle une de ces conditions ?
- L’utilisateur peut modifier ou annuler les données et les actions effectuées sur ces données après la validation du formulaire ;
- L’utilisateur peut vérifier et corriger les données avant la validation d’un formulaire en plusieurs étapes ;
- Un mécanisme de confirmation explicite, via une case à cocher (balise `<input>` de type `checkbox` ou balise ayant un attribut WAI-ARIA `role="checkbox"`) ou une étape supplémentaire, est présent.

**Méthodologie**

1. Retrouver dans le document les formulaires qui modifient ou suppriment des données, ou qui transmettent des réponses à un test ou un examen, ou dont la validation a des conséquences financières ou juridiques ;
2. Pour chaque formulaire, vérifier que l’utilisateur peut :
   - Soit modifier ou annuler les données et les actions effectuées sur ces données après la validation du formulaire ;
   - Soit vérifier et corriger les données avant la validation d’un formulaire en plusieurs étapes ;
   - Soit disposer d’un mécanisme de confirmation explicite (par exemple, une case à cocher ou une étape supplémentaire).
3. Si c’est le cas pour chaque formulaire retrouvé, **le test est validé**.


### Test 11.12.2

Chaque formulaire dont la validation modifie ou supprime des données à caractère financier, juridique ou personnel vérifie-t-il une de ces conditions ?
- Un mécanisme permet de récupérer les données supprimées ou modifiées par l’utilisateur ;
- Un mécanisme de demande de confirmation explicite de la suppression ou de la modification, via un champ de formulaire ou une étape supplémentaire, est proposé.

**Méthodologie**

1. Retrouver dans le document les formulaires qui modifient ou suppriment des données à caractère financier, juridique ou personnel ;
2. Pour chaque formulaire, vérifier que l’utilisateur dispose :
   - Soit d’un mécanisme qui permet de récupérer les données supprimées ou modifiées ;
   - Soit d’un mécanisme de demande de confirmation explicite de la suppression ou de la modification (par exemple, une case à cocher ou une étape supplémentaire).
3. Si c’est le cas pour chaque formulaire retrouvé, **le test est validé**.


**Références** — WCAG : 3.3.4 Error Prevention (Legal, Financial, Data) (AA) · Techniques : G98, G99, G155, G164, G168

## Critère 11.13

La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur ?

### Test 11.13.1

Chaque champ de formulaire dont l’objet se rapporte à une information concernant l’utilisateur vérifie-t-il ces conditions ?
- Le champ de formulaire possède un attribut `autocomplete `;
- L’attribut `autocomplete` est pourvu d’une valeur présente dans la liste des valeurs possibles pour l’attribut `autocomplete` associés à un champ de formulaire ;
- La valeur indiquée pour l’attribut `autocomplete` est pertinente au regard du type d’information attendu.

**Méthodologie**

1. Retrouver dans le document les champs de formulaire qui se rapportent à une information concernant l’utilisateur (nom, prénom, numéro de téléphone, etc.) ;
2. Pour chaque champ de formulaire, vérifier que :
   - Le champ de formulaire possède un attribut `autocomplete` ;
   - L’attribut `autocomplete` est pourvu d’une valeur présente dans la <a rel="noreferrer noopener" target="_blank" title="liste des valeurs possibles - en anglais - nouvelle fenêtre" href="https://www.w3.org/TR/html52/sec-forms.html#autofill-processing-model">liste des valeurs possibles</a> ;
   - La valeur indiquée pour l’attribut `autocomplete` est pertinente au regard du type d’information attendu.
3. Si c’est le cas pour chaque champ de formulaire retrouvé, **le test est validé**.


**Notes techniques**

La liste des valeurs possibles pour l’attribut `autocomplete` repose sur la liste des valeurs présentes dans la spécification WCAG2.1 qui reprend elle-même la liste des valeurs de type “field name” de la spécification HTML5.2. Le critère WCAG demande à ce que l’une de ces valeurs soit présente pour qualifier un champ de saisie concernant l’utilisateur.

Ce que le critère WCAG laisse implicite, ce sont les différentes règles de construction possibles pour obtenir une valeur (simple ou composée) pour l’attribut `autocomplete`. C’est cependant l’affaire du développeur de fournir à l’attribut `autocomplete` une valeur ou un ensemble de valeurs valides au regard des exigences de l’algorithme fourni par la spécification HTML5.2. Ainsi, un attribut `autocomplete` ne peut contenir qu’une seule valeur de type `“field name”`, comme `"name"` ou `"street-address"`. On peut avoir également un ensemble composé de différentes valeurs comme, par exemple, `autocomplete="shipping name"` ou `autocomplete="section-software shipping street-address"` : `"section-software"` renvoie à une valeur de type <span lang="en">“scope”</span> et `"shipping"` à une valeur de type <span lang="en">“hint set”</span>, mais toujours une seule valeur de type <span lang="en">“field name”</span>.

**Références** — WCAG : 1.3.5 Identify Input Purpose (AA) · Techniques : H98
