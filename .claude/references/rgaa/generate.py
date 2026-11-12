"""Regenerate the RGAA reference used by the a11y-auditor agent.

Usage (from the repository root):
  git clone --depth 1 https://github.com/DISIC/accessibilite.numerique.gouv.fr /tmp/rgaa
  python3 .claude/references/rgaa/generate.py /tmp/rgaa/RGAA .claude/references/rgaa

Source: the official RGAA JSON files (criteria, test methodologies, glossary) published by
DINUM, Licence Ouverte 2.0.
"""
import json, re, sys, os, html, unicodedata
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
crit = json.load(open(os.path.join(src, 'criteres.json')))
meth = json.load(open(os.path.join(src, 'methodologies.json')))
glos = json.load(open(os.path.join(src, 'glossaire.json')))['glossary']

def link(s):  # [text](#anchor) -> text (glossary term, see glossaire.md)
    return re.sub(r'\[([^\]]+)\]\(#[^)]+\)', r'\1', s)


def slug(s):
    s = unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')

header = ('<!-- Generated from the official RGAA 4.1.2 (DINUM, github.com/DISIC/accessibilite.numerique.gouv.fr,\n'
          '     RGAA/*.json), Licence Ouverte 2.0. Do not edit by hand: regenerate with generate.py. -->\n\n')
index = [header, '# RGAA 4.1.2 — référentiel (critères, tests, méthodologie)\n',
         'Source : https://accessibilite.numerique.gouv.fr/ — version en vigueur 4.1.2, niveau WCAG 2.1 AA.',
         'Les termes du glossaire (« composant d’interface », « correctement restitué »…) sont définis dans',
         '[glossaire.md](glossaire.md).\n', '| Thème | Fichier | Critères |', '|---|---|---|']
for t in crit['topics']:
    fname = f"{t['number']:02d}-{slug(t['topic'])}.md"
    index.append(f"| {t['number']}. {t['topic']} | [{fname}]({fname}) | {len(t['criteria'])} |")
    md = [header, f"# Thème {t['number']} — {t['topic']}\n"]
    for c in t['criteria']:
        c = c['criterium']; cid = f"{t['number']}.{c['number']}"
        md.append(f"## Critère {cid}\n\n{link(c['title'])}\n")
        for tn, tl in c['tests'].items():
            tid = f"{cid}.{tn}"
            md.append(f"### Test {tid}\n")
            md.append(link(tl[0]))
            for x in tl[1:]:
                md.append('- ' + link(x).lstrip('- '))
            m = meth.get(tid)
            if m:
                md.append('\n**Méthodologie**\n\n' + link(m if isinstance(m, str) else '\n'.join(map(str, m))))
            md.append('')
        for key, label in (('particularCases', 'Cas particuliers'), ('technicalNote', 'Notes techniques')):
            if c.get(key):
                md.append(f"**{label}**\n")
                for it in c[key]:
                    if isinstance(it, str): md.append(link(it) + '\n')
                    else:
                        for v in it.values():
                            md += ['- ' + link(x).lstrip('- ') for x in v]
                        md.append('')
        refs = []
        for r in c.get('references', []):
            for k, v in r.items(): refs.append(f"{k.upper() if k=='wcag' else k.capitalize()} : {', '.join(v)}")
        if refs: md.append('**Références** — ' + ' · '.join(refs) + '\n')
    open(os.path.join(out, fname), 'w').write('\n'.join(md).rstrip() + '\n')
g = [header, '# Glossaire RGAA 4.1.2\n']
for e in glos:
    body = html.unescape(re.sub(r'<li>', '\n- ', re.sub(r'</?(ul|ol|p|code|strong|em|a[^>]*)>|</li>', '', e['body'])))
    g.append(f"## {e['title']}\n\n{link(re.sub(r'<[^>]+>', '', body)).strip()}\n")
open(os.path.join(out, 'glossaire.md'), 'w').write('\n'.join(g))
open(os.path.join(out, 'README.md'), 'w').write('\n'.join(index) + '\n')
