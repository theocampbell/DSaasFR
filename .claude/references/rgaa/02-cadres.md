<!-- Generated from the official RGAA 4.1.2 (DINUM, github.com/DISIC/accessibilite.numerique.gouv.fr,
     RGAA/*.json), Licence Ouverte 2.0. Do not edit by hand: regenerate with generate.py. -->


# Thème 2 — Cadres

## Critère 2.1

Chaque cadre a-t-il un titre de cadre ?

### Test 2.1.1

Chaque cadre (balise `<iframe>` ou `<frame>`) a-t-il un attribut `title` ?

**Méthodologie**

1. Retrouver dans le document les cadres (élément `<iframe>` ou `<frame>`) ;
2. Pour chaque cadre, vérifier qu’il possède un attribut `title `;
3. Si c’est le cas pour chaque cadre, **le test est validé**.


**Références** — WCAG : 4.1.2 Name, Role, Value (A) · Techniques : H64

## Critère 2.2

Pour chaque cadre ayant un titre de cadre, ce titre de cadre est-il pertinent ?

### Test 2.2.1

Pour chaque cadre (balise `<iframe>` ou `<frame>`) ayant un attribut `title`, le contenu de cet attribut est-il pertinent ?

**Méthodologie**

1. Retrouver dans le document les cadres (élément `<iframe>` ou `<frame>`) ;
2. Pour chaque cadre pourvu d’un attribut `title`, vérifier que son contenu est pertinent ;
3. Si c’est le cas pour chaque cadre, **le test est validé**.


**Références** — WCAG : 4.1.2 Name, Role, Value (A) · Techniques : H64
