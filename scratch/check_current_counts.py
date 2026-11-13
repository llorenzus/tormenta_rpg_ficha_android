import json
import re
import unicodedata

def slugify(name):
    n = unicodedata.normalize('NFD', name)
    n = ''.join(c for c in n if unicodedata.category(c) != 'Mn')
    n = re.sub(r'[^a-zA-Z0-9]+', '_', n).strip('_').lower()
    return n

# Carrega os existentes
with open('src/data/talentos/talentos.json', 'r', encoding='utf-8') as f:
    existing_talentos = json.load(f)

existing_ids = {t['id']: t for t in existing_talentos}
existing_names = {t['nome'].lower().strip(): t for t in existing_talentos}

print(f"Talentos existentes antes: {len(existing_talentos)}")

# Carrega magias existentes
with open('src/data/magias/magias.json', 'r', encoding='utf-8') as f:
    existing_magias = json.load(f)

existing_magia_ids = {m['id']: m for m in existing_magias}
existing_magia_names = {m['nome'].lower().strip(): m for m in existing_magias}

print(f"Magias existentes antes: {len(existing_magias)}")

